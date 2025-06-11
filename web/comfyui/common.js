// src_web/comfyui/common.ts
var LOG_VERBOSE = true;
var log = (prefix, ...args) => {
  if (LOG_VERBOSE) {
    console.log(`[${prefix}]`, ...args);
  }
};
var ALLOWED_TAGS = ["video", "source"];
var ALLOWED_ATTRS = [
  "controls",
  "autoplay",
  "loop",
  "muted",
  "preload",
  "poster"
];
var MEDIA_SRC_REGEX = /(<(?:img|source|video)[^>]*\ssrc=['"])(?!(?:\/|https?:\/\/))([^'"\s>]+)(['"])/gi;
export {
  ALLOWED_ATTRS,
  ALLOWED_TAGS,
  LOG_VERBOSE,
  MEDIA_SRC_REGEX,
  log
};
