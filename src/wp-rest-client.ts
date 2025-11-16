import {
  WordPressAuthParams,
  WordPressClientResult,
  WordPressClientReturnCode,
  WordPressMediaUploadResult,
  WordPressPostParams,
  WordPressPublishResult
} from './wp-client';
import { AbstractWordPressClient } from './abstract-wp-client';
import WordpressPlugin from './main';
import { PostStatus, PostType, Term } from './wp-api';
import { RestClient } from './rest-client';
import { isArray, isFunction, isNumber, isObject, isString, template } from 'lodash-es';
import { WpProfile } from './wp-profile';
import { FormItemNameMapper, FormItems, Media } from './types';
import { formatISO } from 'date-fns';
import { Logger } from './logger';

interface WpRestEndpoint {
  base: string | UrlGetter;
  newPost: string | UrlGetter;
  editPost: string | UrlGetter;
  getCategories: string | UrlGetter;
  newTag: string | UrlGetter;
  getTag: string | UrlGetter;
  validateUser: string | UrlGetter;
  uploadFile: string | UrlGetter;
  getPostTypes: string | UrlGetter;
}

export class WpRestClient extends AbstractWordPressClient {

  private readonly client: RestClient;

  constructor(
    readonly plugin: WordpressPlugin,
    readonly profile: WpProfile,
    private readonly context: WpRestClientContext
  ) {
    super(plugin, profile);
    this.name = 'WpRestClient';
    this.client = new RestClient({
      url: new URL(getUrl(this.context.endpoints?.base, profile.endpoint))
    });
  }

  protected needLogin(): boolean {
    if (this.context.needLoginModal !== undefined) {
      return this.context.needLoginModal;
    }
    return  super.needLogin();
  }

  async publish(
    title: string,
    content: string,
    postParams: WordPressPostParams,
    certificate: WordPressAuthParams
  ): Promise<WordPressClientResult<WordPressPublishResult>> {
    let url: string;
    if (postParams.postId) {
      url = getUrl(this.context.endpoints?.editPost, 'wp-json/wp/v2/posts/<%= postId %>', {
        postId: postParams.postId
      });
    } else {
      url = getUrl(this.context.endpoints?.newPost, 'wp-json/wp/v2/posts');
    }
    const extra: Record<string, string> = {};
    if (postParams.status === PostStatus.Future) {
      extra.date = formatISO(postParams.datetime ?? new Date());
    }
    const resp: unknown = await this.client.httpPost(
      url,
      {
        title,
        content,
        status: postParams.status,
        comment_status: postParams.commentStatus,
        categories: postParams.categories,
        tags: postParams.tags ?? [],
        ...extra
      },
      {
        headers: this.context.getHeaders(certificate)
      });
    Logger.log('WpRestClient response', resp);
    try {
      const result = this.context.responseParser.toWordPressPublishResult(postParams, resp);
      return {
        code: WordPressClientReturnCode.OK,
        data: result,
        response: resp
      };
    } catch (e) {
      return {
        code: WordPressClientReturnCode.Error,
        error: {
          code: WordPressClientReturnCode.ServerInternalError,
          message: this.plugin.i18n.t('error_cannotParseResponse')
        },
        response: resp
      };
    }
  }

  async getCategories(certificate: WordPressAuthParams): Promise<Term[]> {
    const data = await this.client.httpGet(
      getUrl(this.context.endpoints?.getCategories, 'wp-json/wp/v2/categories?per_page=100'),
      {
        headers: this.context.getHeaders(certificate)
      });
    return this.context.responseParser.toTerms(data);
  }

  async getPostTypes(certificate: WordPressAuthParams): Promise<PostType[]> {
    const data: unknown = await this.client.httpGet(
      getUrl(this.context.endpoints?.getPostTypes, 'wp-json/wp/v2/types'),
      {
        headers: this.context.getHeaders(certificate)
      });
    return this.context.responseParser.toPostTypes(data);
  }

  async validateUser(certificate: WordPressAuthParams): Promise<WordPressClientResult<boolean>> {
    try {
      const data = await this.client.httpGet(
        getUrl(this.context.endpoints?.validateUser, `wp-json/wp/v2/users/me`),
        {
          headers: this.context.getHeaders(certificate)
        });
      return {
        code: WordPressClientReturnCode.OK,
        data: !!data,
        response: data
      };
    } catch(error) {
      return {
        code: WordPressClientReturnCode.Error,
        error: {
          code: WordPressClientReturnCode.Error,
          message: this.plugin.i18n.t('error_invalidUser'),
        },
        response: error
      };
    }
  }

  async getTag(name: string, certificate: WordPressAuthParams): Promise<Term> {
    const termResp: unknown = await this.client.httpGet(
      getUrl(this.context.endpoints?.getTag, 'wp-json/wp/v2/tags?number=1&search=<%= name %>', {
        name
      }),
    );
    const exists = this.context.responseParser.toTerms(termResp);
    if (exists.length === 0) {
      const resp = await this.client.httpPost(
        getUrl(this.context.endpoints?.newTag, 'wp-json/wp/v2/tags'),
        {
          name
        },
        {
          headers: this.context.getHeaders(certificate)
        });
      Logger.log('WpRestClient newTag response', resp);
      return this.context.responseParser.toTerm(resp);
    } else {
      return exists[0];
    }
  }

  async uploadMedia(media: Media, certificate: WordPressAuthParams): Promise<WordPressClientResult<WordPressMediaUploadResult>> {
    try {
      Logger.log('uploadMedia', media);
      const formItems = new FormItems();
      formItems.append('file', media);

      const response: unknown = await this.client.httpPost(
        getUrl(this.context.endpoints?.uploadFile, 'wp-json/wp/v2/media'),
        formItems,
        {
          headers: {
            ...this.context.getHeaders(certificate)
          },
          formItemNameMapper: this.context.formItemNameMapper
        });
      const result = this.context.responseParser.toWordPressMediaUploadResult(response);
      return {
        code: WordPressClientReturnCode.OK,
        data: result,
        response
      };
    } catch (e: unknown) {
      Logger.error('uploadMedia', e);
      return {
        code: WordPressClientReturnCode.Error,
        error: {
          code: WordPressClientReturnCode.ServerInternalError,
          message: String(e)
        },
        response: undefined
      };
    }
  }

}

type UrlGetter = () => string;

function getUrl(
  url: string | UrlGetter | undefined,
  defaultValue: string,
  params?: { [p: string]: string | number }
): string {
  let resultUrl: string;
  if (isString(url)) {
    resultUrl = url;
  } else if (isFunction(url)) {
    resultUrl = url();
  } else {
    resultUrl = defaultValue;
  }
  if (params) {
    const compiled = template(resultUrl);
    return compiled(params);
  } else {
    return resultUrl;
  }
}

interface WpRestClientContext {
  name: string;

  responseParser: {
    toWordPressPublishResult: (postParams: WordPressPostParams, response: unknown) => WordPressPublishResult;
    /**
     * Convert response to `WordPressMediaUploadResult`.
     *
     * If there is any error, throw new error directly.
     * @param response response from remote server
     */
    toWordPressMediaUploadResult: (response: unknown) => WordPressMediaUploadResult;
    toTerms: (response: unknown) => Term[];
    toTerm: (response: unknown) => Term;
    toPostTypes: (response: unknown) => PostType[];
  };

  endpoints?: Partial<WpRestEndpoint>;

  needLoginModal?: boolean;

  formItemNameMapper?: FormItemNameMapper;

  getHeaders(wp: WordPressAuthParams): Record<string, string>;

}

class WpRestClientCommonContext implements WpRestClientContext {
  name = 'WpRestClientCommonContext';

  getHeaders(wp: WordPressAuthParams): Record<string, string> {
    return {
      'authorization': `Basic ${btoa(`${wp.username}:${wp.password}`)}`
    };
  }

  responseParser = {
    toWordPressPublishResult: (postParams: WordPressPostParams, response: unknown): WordPressPublishResult => {
      if (typeof response === 'object' && response !== null && 'id' in response) {
        const resp = response as { id: unknown; categories?: unknown };
        return {
          postId: postParams.postId ?? String(resp.id),
          categories: postParams.categories ?? (Array.isArray(resp.categories) ? resp.categories : [])
        }
      }
      throw new Error('Invalid response format');
    },
    toWordPressMediaUploadResult: (response: unknown): WordPressMediaUploadResult => {
      if (typeof response === 'object' && response !== null && 'source_url' in response) {
        return {
          url: String((response as { source_url: unknown }).source_url)
        };
      }
      throw new Error('Invalid response format');
    },
    toTerms: (response: unknown): Term[] => {
      if (isArray(response)) {
        return response as Term[];
      }
      return [];
    },
    toTerm: (response: unknown): Term => {
      if (typeof response === 'object' && response !== null && 'id' in response) {
        return {
          ...response as Record<string, unknown>,
          id: (response as { id: unknown }).id
        } as Term;
      }
      throw new Error('Invalid response format');
    },
    toPostTypes: (response: unknown): PostType[] => {
      if (isObject(response) && response !== null) {
        return Object.keys(response as object);
      }
      return [];
    }
  };
}

export class WpRestClientMiniOrangeContext extends WpRestClientCommonContext {
  name = 'WpRestClientMiniOrangeContext';

  constructor() {
    super();
    Logger.log(`${this.name} loaded`);
  }
}

export class WpRestClientAppPasswordContext extends WpRestClientCommonContext {
  name = 'WpRestClientAppPasswordContext';

  constructor() {
    super();
    Logger.log(`${this.name} loaded`);
  }
}

export class WpRestClientWpComOAuth2Context implements WpRestClientContext {
  name = 'WpRestClientWpComOAuth2Context';

  needLoginModal = false;

  endpoints: WpRestEndpoint = {
    base: 'https://public-api.wordpress.com',
    newPost: () => `/rest/v1.1/sites/${this.site}/posts/new`,
    editPost: () => `/rest/v1.1/sites/${this.site}/posts/<%= postId %>`,
    getCategories: () => `/rest/v1.1/sites/${this.site}/categories`,
    newTag: () => `/rest/v1.1/sites/${this.site}/tags/new`,
    getTag: () => `/rest/v1.1/sites/${this.site}/tags?number=1&search=<%= name %>`,
    validateUser: () => `/rest/v1.1/sites/${this.site}/posts?number=1`,
    uploadFile: () => `/rest/v1.1/sites/${this.site}/media/new`,
    getPostTypes: () => `/rest/v1.1/sites/${this.site}/post-types`,
  };

  constructor(
    private readonly site: string,
    private readonly accessToken: string
  ) {
    Logger.log(`${this.name} loaded`);
  }

  formItemNameMapper(name: string, isArray: boolean): string {
    if (name === 'file' && !isArray) {
      return 'media[]';
    }
    return name;
  }

  getHeaders(wp: WordPressAuthParams): Record<string, string> {
    return {
      'authorization': `BEARER ${this.accessToken}`
    };
  }

  responseParser = {
    toWordPressPublishResult: (postParams: WordPressPostParams, response: unknown): WordPressPublishResult => {
      if (typeof response === 'object' && response !== null && 'ID' in response) {
        const resp = response as { ID: unknown; categories?: unknown };
        const categories = postParams.categories ?? (
          typeof resp.categories === 'object' && resp.categories !== null
            ? Object.values(resp.categories).map((cat: unknown) => {
                if (typeof cat === 'object' && cat !== null && 'ID' in cat) {
                  return (cat as { ID: unknown }).ID;
                }
                return cat;
              })
            : []
        );
        return {
          postId: postParams.postId ?? String(resp.ID),
          categories: categories as number[]
        };
      }
      throw new Error('Invalid response format');
    },
    toWordPressMediaUploadResult: (response: unknown): WordPressMediaUploadResult => {
      if (typeof response === 'object' && response !== null) {
        const resp = response as { media?: unknown[]; errors?: { error?: { message?: unknown } } };
        if (Array.isArray(resp.media) && resp.media.length > 0) {
          const media = resp.media[0];
          if (typeof media === 'object' && media !== null && 'link' in media) {
            return {
              url: String((media as { link: unknown }).link)
            };
          }
        } else if (resp.errors?.error?.message) {
          throw new Error(String(resp.errors.error.message));
        }
      }
      throw new Error('Upload failed');
    },
    toTerms: (response: unknown): Term[] => {
      if (typeof response === 'object' && response !== null && 'found' in response) {
        const resp = response as { found: unknown; categories?: unknown[] };
        if (isNumber(resp.found) && Array.isArray(resp.categories)) {
          return resp.categories.map((it: unknown) => {
            if (typeof it === 'object' && it !== null && 'ID' in it) {
              return {
                ...it as Record<string, unknown>,
                id: String((it as { ID: unknown }).ID)
              } as Term;
            }
            return it as Term;
          });
        }
      }
      return [];
    },
    toTerm: (response: unknown): Term => {
      if (typeof response === 'object' && response !== null && 'ID' in response) {
        return {
          ...response as Record<string, unknown>,
          id: (response as { ID: unknown }).ID
        } as Term;
      }
      throw new Error('Invalid response format');
    },
    toPostTypes: (response: unknown): PostType[] => {
      if (typeof response === 'object' && response !== null && 'found' in response) {
        const resp = response as { found: unknown; post_types?: unknown };
        if (isNumber(resp.found) && Array.isArray(resp.post_types)) {
          return resp.post_types.map((it: unknown) => {
            if (typeof it === 'object' && it !== null && 'name' in it) {
              return String((it as { name: unknown }).name);
            }
            return String(it);
          });
        }
      }
      return [];
    }
  };
}
