import { LanguageWithAuto } from './i18n';
import { WpProfile } from './wp-profile';
import { CommentStatus, PostStatus } from './wp-api';
import { isNil, isUndefined } from 'lodash-es';
import { PassCrypto } from './pass-crypto';
import { WP_DEFAULT_PROFILE_NAME } from './consts';
import { Logger } from './logger';

export const enum SettingsVersion {
  V2 = '2'
}

export const enum ApiType {
  XML_RPC = 'xml-rpc',
  RestAPI_miniOrange = 'miniOrange',
  RestApi_ApplicationPasswords = 'application-passwords',
  RestApi_WpComOAuth2 = 'WpComOAuth2'
}

export const enum MathJaxOutputType {
  TeX = 'tex',
  SVG = 'svg'
}

export const enum CommentConvertMode {
  Ignore = 'ignore',
  HTML = 'html'
}

export interface WordpressPluginSettings {

  version?: SettingsVersion;

  /**
   * Plugin language.
   */
  lang: LanguageWithAuto;

  profiles: WpProfile[];

  /**
   * Show plugin icon in side.
   */
  showRibbonIcon: boolean;

  /**
   * Default post status.
   */
  defaultPostStatus: PostStatus;

  /**
   * Default comment status.
   */
  defaultCommentStatus: CommentStatus;

  /**
   * Remember last selected post categories.
   */
  rememberLastSelectedCategories: boolean;

  /**
   * If WordPress edit confirm modal will be shown when published successfully.
   */
  showWordPressEditConfirm: boolean;

  mathJaxOutputType: MathJaxOutputType;

  commentConvertMode: CommentConvertMode;

  enableHtml: boolean;

  /**
   * Whether to upload raw markdown content instead of converting to HTML.
   */
  uploadRawMarkdown: boolean;

  /**
   * Whether media links should be replaced after uploading to WordPress.
   */
  replaceMediaLinks: boolean;
}

export const DEFAULT_SETTINGS: WordpressPluginSettings = {
  lang: 'auto',
  profiles: [],
  showRibbonIcon: false,
  defaultPostStatus: PostStatus.Draft,
  defaultCommentStatus: CommentStatus.Open,
  rememberLastSelectedCategories: true,
  showWordPressEditConfirm: false,
  mathJaxOutputType: MathJaxOutputType.SVG,
  commentConvertMode: CommentConvertMode.Ignore,
  enableHtml: false,
  uploadRawMarkdown: false,
  replaceMediaLinks: true,
}

export async function upgradeSettings(
  existingSettings: unknown,
  to: SettingsVersion
): Promise<{ needUpgrade: boolean, settings: WordpressPluginSettings }> {
  Logger.log('upgradeSettings', existingSettings, to);
  if (typeof existingSettings !== 'object' || existingSettings === null) {
    return {
      needUpgrade: false,
      settings: DEFAULT_SETTINGS
    };
  }

  const settings = existingSettings as Record<string, unknown>;

  if (isUndefined(settings.version)) {
    // V1
    if (to === SettingsVersion.V2) {
      const newSettings: WordpressPluginSettings = Object.assign({}, DEFAULT_SETTINGS, {
        version: SettingsVersion.V2,
        lang: settings.lang,
        showRibbonIcon: settings.showRibbonIcon,
        defaultPostStatus: settings.defaultPostStatus,
        defaultCommentStatus: settings.defaultCommentStatus,
        defaultPostType: 'post',
        rememberLastSelectedCategories: settings.rememberLastSelectedCategories,
        showWordPressEditConfirm: settings.showWordPressEditConfirm,
        mathJaxOutputType: settings.mathJaxOutputType,
        commentConvertMode: settings.commentConvertMode,
      });
      if (settings.endpoint) {
        const endpoint = settings.endpoint;
        const apiType = settings.apiType;
        const xmlRpcPath = settings.xmlRpcPath;
        const username = settings.username;
        const password = settings.password;
        const lastSelectedCategories = settings.lastSelectedCategories;
        const crypto = new PassCrypto();
        const encryptedPassword = await crypto.encrypt(typeof password === 'string' ? password : '');
        const profile: WpProfile = {
          name: WP_DEFAULT_PROFILE_NAME,
          apiType: apiType as ApiType,
          endpoint: endpoint as string,
          xmlRpcPath: xmlRpcPath as string,
          saveUsername: !isNil(username),
          savePassword: !isNil(password),
          isDefault: true,
          lastSelectedCategories: (Array.isArray(lastSelectedCategories) ? lastSelectedCategories : [1]) as number[],
          username: username as string | undefined,
          encryptedPassword: encryptedPassword
        };
        newSettings.profiles = [
          profile
        ];
      } else {
        newSettings.profiles = [];
      }
      return {
        needUpgrade: true,
        settings: newSettings
      };
    }
  }
  return {
    needUpgrade: false,
    settings: existingSettings as WordpressPluginSettings
  };
}
