import DOMPurify from "dompurify";
import { marked, Renderer } from "marked";
import { ALLOWED_TAGS, ALLOWED_ATTRS, MEDIA_SRC_REGEX } from "./common.js";

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
  if (!markdown) return "";

  // Convert array to string if needed
  const markdownStr = Array.isArray(markdown) ? markdown.join("") : markdown;

  let html = marked.parse(markdownStr, {
    renderer: createMarkdownRenderer(baseUrl),
    gfm: true,
    breaks: true,
  }) as string;

  if (baseUrl) {
    html = html.replace(MEDIA_SRC_REGEX, `$1${baseUrl}$2$3`);
  }

  return DOMPurify.sanitize(html, {
    ADD_TAGS: ALLOWED_TAGS,
    ADD_ATTR: ALLOWED_ATTRS,
  });
} 