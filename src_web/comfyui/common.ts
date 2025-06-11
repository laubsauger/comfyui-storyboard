// Logging
export const LOG_VERBOSE = true;
export const log = (prefix: string, ...args: any[]) => {
  if (LOG_VERBOSE) {
    console.log(`[${prefix}]`, ...args);
  }
};

// Markdown rendering constants
export const ALLOWED_TAGS = ["video", "source"];
export const ALLOWED_ATTRS = [
  "controls",
  "autoplay",
  "loop",
  "muted",
  "preload",
  "poster",
];

export const MEDIA_SRC_REGEX =
  /(<(?:img|source|video)[^>]*\ssrc=['"])(?!(?:\/|https?:\/\/))([^'"\s>]+)(['"])/gi; 