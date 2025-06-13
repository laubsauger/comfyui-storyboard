import DOMPurify from "dompurify";
import { Marked, Renderer } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import python from 'highlight.js/lib/languages/python';
import plaintext from 'highlight.js/lib/languages/plaintext';
import markdown from 'highlight.js/lib/languages/markdown';
import { ALLOWED_TAGS, ALLOWED_ATTRS, MEDIA_SRC_REGEX, log } from "./common.js";

hljs.registerLanguage('json', json);
hljs.registerLanguage('python', python);
hljs.registerLanguage('plaintext', plaintext);
hljs.registerLanguage('markdown', markdown);
hljs.configure({
  languages: ['python', 'json', 'plaintext', 'markdown'],
});

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

  // Convert array to string if needed and clean up Python-style string formatting
  let markdownStr = Array.isArray(markdown) ? markdown.join("") : markdown;

  // Clean up Python-style string formatting (remove extra quotes and brackets)
  markdownStr = markdownStr.replace(/^\[|\]$/g, '').replace(/^'|'$/g, '').replace(/^"|"$/g, '');

  log("highlight", "Cleaned markdown string:", markdownStr.slice(0, 100));

  // Check if the content looks like JSON and wrap it in a code block if it is
  const preview = markdownStr.trim().slice(0, 100);
  if (preview[0] === '{' || preview[0] === '[') {
    try {
      const jsonObj = JSON.parse(markdownStr);
      const formatted = JSON.stringify(jsonObj, null, 2);
      markdownStr = "```json\n" + formatted + "\n```";
      log("highlight", "Wrapped JSON in code block");
    } catch (e: any) {
      log("highlight", "JSON parse failed:", e.message);
    }
  }

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
      highlight(code: string | string[], lang: string) {
        log("highlight", "Input type:", typeof code, "Is array:", Array.isArray(code), "Length:", Array.isArray(code) ? code.length : code.length);

        // Handle array input by joining it and cleaning up Python-style formatting
        let codeStr = Array.isArray(code) ? code.join('') : code;
        codeStr = codeStr.replace(/^\[|\]$/g, '').replace(/^'|'$/g, '').replace(/^"|"$/g, '');

        log("highlight", "Cleaned code string:", codeStr.slice(0, 100));

        // If we already have a language specified, use it
        if (lang) {
          return hljs.highlight(codeStr, { language: lang }).value;
        }

        // Get first 100 chars for quick checks (more than enough for our patterns)
        const preview = codeStr.trim().slice(0, 100);
        log("highlight", "Preview:", preview);

        // Quick check for JSON-like content (starts with { or [)
        if (preview[0] === '{' || preview[0] === '[') {
          log("highlight", "Detected potential JSON content");
          try {
            const jsonObj = JSON.parse(codeStr);
            log("highlight", "Successfully parsed JSON");
            const formatted = JSON.stringify(jsonObj, null, 2);
            log("highlight", "Formatted JSON length:", formatted.length);
            return hljs.highlight(formatted, { language: 'json' }).value;
          } catch (e: any) {
            log("highlight", "JSON parse failed:", e.message);
            // Not valid JSON, continue with other checks
          }
        }

        // Quick check for Python-like content (indentation, def, class, etc)
        if (preview.match(/^(def|class|import|from|if|for|while)\s/)) {
          log("highlight", "Detected Python content");
          return hljs.highlight(codeStr, { language: 'python' }).value;
        }

        // Quick check for markdown-like content (headers, lists, etc)
        if (preview.match(/^(#|\*|\-|\d\.)\s/)) {
          log("highlight", "Detected Markdown content");
          return hljs.highlight(codeStr, { language: 'markdown' }).value;
        }

        // Default to plaintext for everything else
        log("highlight", "No specific format detected, using plaintext");
        return hljs.highlight(codeStr, { language: 'plaintext' }).value;
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