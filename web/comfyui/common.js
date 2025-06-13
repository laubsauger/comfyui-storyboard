// src_web/comfyui/common.ts
var LOG_VERBOSE = true;
var log = (prefix, ...args) => {
  if (LOG_VERBOSE) {
    console.log(`[${prefix}]`, ...args);
  }
};
var ALLOWED_TAGS = [
  "video",
  "source",
  // original video/source tags
  "pre",
  "code",
  "span",
  // code block elements
  "div",
  "p",
  "br",
  // block elements
  "strong",
  "em",
  "b",
  "i",
  // text formatting
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  // headers
  "ul",
  "ol",
  "li",
  // lists
  "blockquote",
  // quotes
  "a",
  "img"
  // links and images
];
var ALLOWED_ATTRS = [
  "controls",
  "autoplay",
  "loop",
  "muted",
  "preload",
  "poster",
  "class",
  "id",
  // styling attributes
  "href",
  "target",
  "src",
  "alt",
  "title"
  // link and image attributes
];
var MEDIA_SRC_REGEX = /(<(?:img|source|video)[^>]*\ssrc=['"])(?!(?:\/|https?:\/\/))([^'"\s>]+)(['"])/gi;
export {
  ALLOWED_ATTRS,
  ALLOWED_TAGS,
  LOG_VERBOSE,
  MEDIA_SRC_REGEX,
  log
};
