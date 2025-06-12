import DOMPurify from "dompurify";
import { Marked, Renderer } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import python from 'highlight.js/lib/languages/python';
import { ALLOWED_TAGS, ALLOWED_ATTRS, MEDIA_SRC_REGEX, log } from "./common.js";

hljs.registerLanguage('json', json);
hljs.registerLanguage('python', python);

export function createMarkdownRenderer(baseUrl?: string): Renderer {
  const normalizedBase = baseUrl ? baseUrl.replace(/\/+$/, "") : "";
  const renderer = new Renderer();
  renderer.image = ({ href, title, text }) => {
    let src = href;
    if (normalizedBase && !/^(?:\/|https?:\/\/)/.test(href)) {
      src = `${normalizedBase}/${href}`;
    }
    const titleAttr = title ? ` title="${title}"` : "";
    return `<img src="${src}" alt="${text}"${titleAttr} />`;
  };
  return renderer;
}

export function renderMarkdownToHtml(
  markdown: string | string[],
  baseUrl?: string
): string {
  if (!markdown) {
    return "";
  }

  // Convert array to string if needed
  const markdownStr = Array.isArray(markdown) ? markdown.join("") : markdown;

  // Create renderer and only override the image method
  const renderer = new Renderer();
  const originalImage = renderer.image;
  renderer.image = ({ href, title, text }) => {
    let src = href;
    if (baseUrl && !/^(?:\/|https?:\/\/)/.test(href)) {
      src = `${baseUrl.replace(/\/+$/, "")}/${href}`;
    }
    const titleAttr = title ? ` title="${title}"` : "";
    return `<img src="${src}" alt="${text}"${titleAttr} />`;
  };

  const markedInstance = new Marked({ renderer });
  // Expose for manual browser testing
  if (typeof window !== "undefined") {
    (window as any).markedInstance = markedInstance;
  }

  markedInstance.use(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight(code: string, lang: string) {
        let codeToHighlight = code;
        if (lang === "json") {
          try {
            const jsonObj = JSON.parse(code);
            codeToHighlight = JSON.stringify(jsonObj, null, 2);
          } catch (e) {
            console.error("[highlight] Failed to parse JSON, using as-is.");
          }
        }
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        const highlighted = hljs.highlight(codeToHighlight, { language }).value;
        return highlighted;
      },
    })
  );

  // Add debug logging for the markdown parsing
  let html = markedInstance.parse(markdownStr) as string;

  if (baseUrl) {
    html = html.replace(MEDIA_SRC_REGEX, `$1${baseUrl}$2$3`);
  }

  const sanitized = DOMPurify.sanitize(html, {
    ADD_TAGS: ALLOWED_TAGS,
    ADD_ATTR: ALLOWED_ATTRS,
  });
  return sanitized;
} 