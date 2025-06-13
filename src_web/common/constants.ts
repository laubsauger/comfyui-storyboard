// Logging
export const LOG_VERBOSE = false;

// Markdown rendering constants - expanded to include common HTML tags used in markdown
export const ALLOWED_TAGS = [
  "video", "source", // original video/source tags
  "pre", "code", "span", // code block elements
  "div", "p", "br", // block elements
  "strong", "em", "b", "i", // text formatting
  "h1", "h2", "h3", "h4", "h5", "h6", // headers
  "ul", "ol", "li", // lists
  "blockquote", // quotes
  "a", "img" // links and images
];
export const ALLOWED_ATTRS = [
  "controls",
  "autoplay",
  "loop",
  "muted",
  "preload",
  "poster",
  "class", "id", // styling attributes
  "href", "target", "src", "alt", "title" // link and image attributes
];

export const MEDIA_SRC_REGEX =
  /(<(?:img|source|video)[^>]*\ssrc=['"])(?!(?:\/|https?:\/\/))([^'"\s>]+)(['"])/gi; 