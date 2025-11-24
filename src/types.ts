import { isArray, isString } from 'lodash-es';

export interface MarkdownItPlugin {
  updateOptions: (opts: Record<string, unknown>) => void;
}

export type MatterData = Record<string, unknown>;

export interface Media {
  mimeType: string;
  fileName: string;
  content: ArrayBuffer;
}

/**
 * Rest client options for making HTTP requests
 */
export interface RestClientOptions {
    /**
     * The base URL for REST API requests
     */
    url: URL;
}
export interface XmlRpcOptions {
  url: URL;
  xmlRpcPath: string;
}

export function isMedia(obj: unknown): obj is Media {
  return (
    typeof obj === 'object'
    && obj !== null
    && 'mimeType' in obj && typeof (obj as { mimeType: unknown }).mimeType === 'string'
    && 'fileName' in obj && typeof (obj as { fileName: unknown }).fileName === 'string'
    && 'content' in obj && (obj as { content: unknown }).content instanceof ArrayBuffer
  );
}

/**
 * Convert original item name to custom one.
 *
 * @param name original item name. If `isArray` is `true`, which means is in an array, the `name` will be appended by `[]`
 * @param isArray whether this item is in an array
 */
export type FormItemNameMapper = (name: string, isArray: boolean) => string;

export class FormItems {
  #formData: Record<string, string | Media | Array<string | Media>> = {};

  append(name: string, data: string): FormItems;
  append(name: string, data: Media): FormItems;
  append(name: string, data: string | Media): FormItems {
    const existing = this.#formData[name];
    if (existing) {
      const arr = Array.isArray(existing) ? existing : [existing];
      arr.push(data);
      this.#formData[name] = arr;
    } else {
      this.#formData[name] = data;
    }
    return this;
  }

  toArrayBuffer(option: {
    boundary: string;
    nameMapper?: FormItemNameMapper;
  }): Promise<ArrayBuffer> {
    const CRLF = '\r\n';
    const itemPart = (name: string, data: string | Media, isArray: boolean) => {
      let itemName = name;
      if (option.nameMapper) {
        itemName = option.nameMapper(name, isArray);
      }

      body.push(encodedItemStart);
      if (isString(data)) {
        body.push(encoder.encode(`Content-Disposition: form-data; name="${itemName}"${CRLF}${CRLF}`));
        body.push(encoder.encode(data));
      } else {
        const media = data;
        body.push(encoder.encode(`Content-Disposition: form-data; name="${itemName}"; filename="${media.fileName}"${CRLF}Content-Type: ${media.mimeType}${CRLF}${CRLF}`));
        body.push(media.content);
      }
      body.push(encoder.encode(CRLF));
    };

    const encoder = new TextEncoder();
    const encodedItemStart = encoder.encode(`--${option.boundary}${CRLF}`);
    const body: ArrayBuffer[] = [];
    Object.entries(this.#formData).forEach(([ name, data ]) => {
      if (isArray(data)) {
        data.forEach(item => {
          itemPart(`${name}[]`, item, true);
        });
      } else {
        itemPart(name, data, false);
      }
    });
    body.push(encoder.encode(`--${option.boundary}--`));
    return new Blob(body).arrayBuffer();
  }
}
