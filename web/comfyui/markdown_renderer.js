var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});

// node_modules/highlight.js/lib/core.js
var require_core = __commonJS({
  "node_modules/highlight.js/lib/core.js"(exports, module) {
    function deepFreeze(obj) {
      if (obj instanceof Map) {
        obj.clear = obj.delete = obj.set = function() {
          throw new Error("map is read-only");
        };
      } else if (obj instanceof Set) {
        obj.add = obj.clear = obj.delete = function() {
          throw new Error("set is read-only");
        };
      }
      Object.freeze(obj);
      Object.getOwnPropertyNames(obj).forEach((name) => {
        const prop = obj[name];
        const type = typeof prop;
        if ((type === "object" || type === "function") && !Object.isFrozen(prop)) {
          deepFreeze(prop);
        }
      });
      return obj;
    }
    var Response = class {
      /**
       * @param {CompiledMode} mode
       */
      constructor(mode) {
        if (mode.data === void 0) mode.data = {};
        this.data = mode.data;
        this.isMatchIgnored = false;
      }
      ignoreMatch() {
        this.isMatchIgnored = true;
      }
    };
    function escapeHTML(value) {
      return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
    }
    function inherit$1(original, ...objects) {
      const result = /* @__PURE__ */ Object.create(null);
      for (const key in original) {
        result[key] = original[key];
      }
      objects.forEach(function(obj) {
        for (const key in obj) {
          result[key] = obj[key];
        }
      });
      return (
        /** @type {T} */
        result
      );
    }
    var SPAN_CLOSE = "</span>";
    var emitsWrappingTags = (node2) => {
      return !!node2.scope;
    };
    var scopeToCSSClass = (name, { prefix }) => {
      if (name.startsWith("language:")) {
        return name.replace("language:", "language-");
      }
      if (name.includes(".")) {
        const pieces = name.split(".");
        return [
          `${prefix}${pieces.shift()}`,
          ...pieces.map((x2, i) => `${x2}${"_".repeat(i + 1)}`)
        ].join(" ");
      }
      return `${prefix}${name}`;
    };
    var HTMLRenderer = class {
      /**
       * Creates a new HTMLRenderer
       *
       * @param {Tree} parseTree - the parse tree (must support `walk` API)
       * @param {{classPrefix: string}} options
       */
      constructor(parseTree, options3) {
        this.buffer = "";
        this.classPrefix = options3.classPrefix;
        parseTree.walk(this);
      }
      /**
       * Adds texts to the output stream
       *
       * @param {string} text */
      addText(text2) {
        this.buffer += escapeHTML(text2);
      }
      /**
       * Adds a node open to the output stream (if needed)
       *
       * @param {Node} node */
      openNode(node2) {
        if (!emitsWrappingTags(node2)) return;
        const className = scopeToCSSClass(
          node2.scope,
          { prefix: this.classPrefix }
        );
        this.span(className);
      }
      /**
       * Adds a node close to the output stream (if needed)
       *
       * @param {Node} node */
      closeNode(node2) {
        if (!emitsWrappingTags(node2)) return;
        this.buffer += SPAN_CLOSE;
      }
      /**
       * returns the accumulated buffer
      */
      value() {
        return this.buffer;
      }
      // helpers
      /**
       * Builds a span element
       *
       * @param {string} className */
      span(className) {
        this.buffer += `<span class="${className}">`;
      }
    };
    var newNode = (opts = {}) => {
      const result = { children: [] };
      Object.assign(result, opts);
      return result;
    };
    var TokenTree = class _TokenTree {
      constructor() {
        this.rootNode = newNode();
        this.stack = [this.rootNode];
      }
      get top() {
        return this.stack[this.stack.length - 1];
      }
      get root() {
        return this.rootNode;
      }
      /** @param {Node} node */
      add(node2) {
        this.top.children.push(node2);
      }
      /** @param {string} scope */
      openNode(scope) {
        const node2 = newNode({ scope });
        this.add(node2);
        this.stack.push(node2);
      }
      closeNode() {
        if (this.stack.length > 1) {
          return this.stack.pop();
        }
        return void 0;
      }
      closeAllNodes() {
        while (this.closeNode()) ;
      }
      toJSON() {
        return JSON.stringify(this.rootNode, null, 4);
      }
      /**
       * @typedef { import("./html_renderer").Renderer } Renderer
       * @param {Renderer} builder
       */
      walk(builder) {
        return this.constructor._walk(builder, this.rootNode);
      }
      /**
       * @param {Renderer} builder
       * @param {Node} node
       */
      static _walk(builder, node2) {
        if (typeof node2 === "string") {
          builder.addText(node2);
        } else if (node2.children) {
          builder.openNode(node2);
          node2.children.forEach((child) => this._walk(builder, child));
          builder.closeNode(node2);
        }
        return builder;
      }
      /**
       * @param {Node} node
       */
      static _collapse(node2) {
        if (typeof node2 === "string") return;
        if (!node2.children) return;
        if (node2.children.every((el) => typeof el === "string")) {
          node2.children = [node2.children.join("")];
        } else {
          node2.children.forEach((child) => {
            _TokenTree._collapse(child);
          });
        }
      }
    };
    var TokenTreeEmitter = class extends TokenTree {
      /**
       * @param {*} options
       */
      constructor(options3) {
        super();
        this.options = options3;
      }
      /**
       * @param {string} text
       */
      addText(text2) {
        if (text2 === "") {
          return;
        }
        this.add(text2);
      }
      /** @param {string} scope */
      startScope(scope) {
        this.openNode(scope);
      }
      endScope() {
        this.closeNode();
      }
      /**
       * @param {Emitter & {root: DataNode}} emitter
       * @param {string} name
       */
      __addSublanguage(emitter, name) {
        const node2 = emitter.root;
        if (name) node2.scope = `language:${name}`;
        this.add(node2);
      }
      toHTML() {
        const renderer = new HTMLRenderer(this, this.options);
        return renderer.value();
      }
      finalize() {
        this.closeAllNodes();
        return true;
      }
    };
    function source(re) {
      if (!re) return null;
      if (typeof re === "string") return re;
      return re.source;
    }
    function lookahead(re) {
      return concat("(?=", re, ")");
    }
    function anyNumberOfTimes(re) {
      return concat("(?:", re, ")*");
    }
    function optional(re) {
      return concat("(?:", re, ")?");
    }
    function concat(...args) {
      const joined = args.map((x2) => source(x2)).join("");
      return joined;
    }
    function stripOptionsFromArgs(args) {
      const opts = args[args.length - 1];
      if (typeof opts === "object" && opts.constructor === Object) {
        args.splice(args.length - 1, 1);
        return opts;
      } else {
        return {};
      }
    }
    function either(...args) {
      const opts = stripOptionsFromArgs(args);
      const joined = "(" + (opts.capture ? "" : "?:") + args.map((x2) => source(x2)).join("|") + ")";
      return joined;
    }
    function countMatchGroups(re) {
      return new RegExp(re.toString() + "|").exec("").length - 1;
    }
    function startsWith(re, lexeme) {
      const match = re && re.exec(lexeme);
      return match && match.index === 0;
    }
    var BACKREF_RE = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
    function _rewriteBackreferences(regexps, { joinWith }) {
      let numCaptures = 0;
      return regexps.map((regex) => {
        numCaptures += 1;
        const offset = numCaptures;
        let re = source(regex);
        let out = "";
        while (re.length > 0) {
          const match = BACKREF_RE.exec(re);
          if (!match) {
            out += re;
            break;
          }
          out += re.substring(0, match.index);
          re = re.substring(match.index + match[0].length);
          if (match[0][0] === "\\" && match[1]) {
            out += "\\" + String(Number(match[1]) + offset);
          } else {
            out += match[0];
            if (match[0] === "(") {
              numCaptures++;
            }
          }
        }
        return out;
      }).map((re) => `(${re})`).join(joinWith);
    }
    var MATCH_NOTHING_RE = /\b\B/;
    var IDENT_RE = "[a-zA-Z]\\w*";
    var UNDERSCORE_IDENT_RE = "[a-zA-Z_]\\w*";
    var NUMBER_RE = "\\b\\d+(\\.\\d+)?";
    var C_NUMBER_RE = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";
    var BINARY_NUMBER_RE = "\\b(0b[01]+)";
    var RE_STARTERS_RE = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";
    var SHEBANG = (opts = {}) => {
      const beginShebang = /^#![ ]*\//;
      if (opts.binary) {
        opts.begin = concat(
          beginShebang,
          /.*\b/,
          opts.binary,
          /\b.*/
        );
      }
      return inherit$1({
        scope: "meta",
        begin: beginShebang,
        end: /$/,
        relevance: 0,
        /** @type {ModeCallback} */
        "on:begin": (m, resp) => {
          if (m.index !== 0) resp.ignoreMatch();
        }
      }, opts);
    };
    var BACKSLASH_ESCAPE = {
      begin: "\\\\[\\s\\S]",
      relevance: 0
    };
    var APOS_STRING_MODE = {
      scope: "string",
      begin: "'",
      end: "'",
      illegal: "\\n",
      contains: [BACKSLASH_ESCAPE]
    };
    var QUOTE_STRING_MODE = {
      scope: "string",
      begin: '"',
      end: '"',
      illegal: "\\n",
      contains: [BACKSLASH_ESCAPE]
    };
    var PHRASAL_WORDS_MODE = {
      begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
    };
    var COMMENT = function(begin, end, modeOptions = {}) {
      const mode = inherit$1(
        {
          scope: "comment",
          begin,
          end,
          contains: []
        },
        modeOptions
      );
      mode.contains.push({
        scope: "doctag",
        // hack to avoid the space from being included. the space is necessary to
        // match here to prevent the plain text rule below from gobbling up doctags
        begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
        end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
        excludeBegin: true,
        relevance: 0
      });
      const ENGLISH_WORD = either(
        // list of common 1 and 2 letter words in English
        "I",
        "a",
        "is",
        "so",
        "us",
        "to",
        "at",
        "if",
        "in",
        "it",
        "on",
        // note: this is not an exhaustive list of contractions, just popular ones
        /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
        // contractions - can't we'd they're let's, etc
        /[A-Za-z]+[-][a-z]+/,
        // `no-way`, etc.
        /[A-Za-z][a-z]{2,}/
        // allow capitalized words at beginning of sentences
      );
      mode.contains.push(
        {
          // TODO: how to include ", (, ) without breaking grammars that use these for
          // comment delimiters?
          // begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
          // ---
          // this tries to find sequences of 3 english words in a row (without any
          // "programming" type syntax) this gives us a strong signal that we've
          // TRULY found a comment - vs perhaps scanning with the wrong language.
          // It's possible to find something that LOOKS like the start of the
          // comment - but then if there is no readable text - good chance it is a
          // false match and not a comment.
          //
          // for a visual example please see:
          // https://github.com/highlightjs/highlight.js/issues/2827
          begin: concat(
            /[ ]+/,
            // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
            "(",
            ENGLISH_WORD,
            /[.]?[:]?([.][ ]|[ ])/,
            "){3}"
          )
          // look for 3 words in a row
        }
      );
      return mode;
    };
    var C_LINE_COMMENT_MODE = COMMENT("//", "$");
    var C_BLOCK_COMMENT_MODE = COMMENT("/\\*", "\\*/");
    var HASH_COMMENT_MODE = COMMENT("#", "$");
    var NUMBER_MODE = {
      scope: "number",
      begin: NUMBER_RE,
      relevance: 0
    };
    var C_NUMBER_MODE = {
      scope: "number",
      begin: C_NUMBER_RE,
      relevance: 0
    };
    var BINARY_NUMBER_MODE = {
      scope: "number",
      begin: BINARY_NUMBER_RE,
      relevance: 0
    };
    var REGEXP_MODE = {
      scope: "regexp",
      begin: /\/(?=[^/\n]*\/)/,
      end: /\/[gimuy]*/,
      contains: [
        BACKSLASH_ESCAPE,
        {
          begin: /\[/,
          end: /\]/,
          relevance: 0,
          contains: [BACKSLASH_ESCAPE]
        }
      ]
    };
    var TITLE_MODE = {
      scope: "title",
      begin: IDENT_RE,
      relevance: 0
    };
    var UNDERSCORE_TITLE_MODE = {
      scope: "title",
      begin: UNDERSCORE_IDENT_RE,
      relevance: 0
    };
    var METHOD_GUARD = {
      // excludes method names from keyword processing
      begin: "\\.\\s*" + UNDERSCORE_IDENT_RE,
      relevance: 0
    };
    var END_SAME_AS_BEGIN = function(mode) {
      return Object.assign(
        mode,
        {
          /** @type {ModeCallback} */
          "on:begin": (m, resp) => {
            resp.data._beginMatch = m[1];
          },
          /** @type {ModeCallback} */
          "on:end": (m, resp) => {
            if (resp.data._beginMatch !== m[1]) resp.ignoreMatch();
          }
        }
      );
    };
    var MODES = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      APOS_STRING_MODE,
      BACKSLASH_ESCAPE,
      BINARY_NUMBER_MODE,
      BINARY_NUMBER_RE,
      COMMENT,
      C_BLOCK_COMMENT_MODE,
      C_LINE_COMMENT_MODE,
      C_NUMBER_MODE,
      C_NUMBER_RE,
      END_SAME_AS_BEGIN,
      HASH_COMMENT_MODE,
      IDENT_RE,
      MATCH_NOTHING_RE,
      METHOD_GUARD,
      NUMBER_MODE,
      NUMBER_RE,
      PHRASAL_WORDS_MODE,
      QUOTE_STRING_MODE,
      REGEXP_MODE,
      RE_STARTERS_RE,
      SHEBANG,
      TITLE_MODE,
      UNDERSCORE_IDENT_RE,
      UNDERSCORE_TITLE_MODE
    });
    function skipIfHasPrecedingDot(match, response) {
      const before = match.input[match.index - 1];
      if (before === ".") {
        response.ignoreMatch();
      }
    }
    function scopeClassName(mode, _parent) {
      if (mode.className !== void 0) {
        mode.scope = mode.className;
        delete mode.className;
      }
    }
    function beginKeywords(mode, parent) {
      if (!parent) return;
      if (!mode.beginKeywords) return;
      mode.begin = "\\b(" + mode.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)";
      mode.__beforeBegin = skipIfHasPrecedingDot;
      mode.keywords = mode.keywords || mode.beginKeywords;
      delete mode.beginKeywords;
      if (mode.relevance === void 0) mode.relevance = 0;
    }
    function compileIllegal(mode, _parent) {
      if (!Array.isArray(mode.illegal)) return;
      mode.illegal = either(...mode.illegal);
    }
    function compileMatch(mode, _parent) {
      if (!mode.match) return;
      if (mode.begin || mode.end) throw new Error("begin & end are not supported with match");
      mode.begin = mode.match;
      delete mode.match;
    }
    function compileRelevance(mode, _parent) {
      if (mode.relevance === void 0) mode.relevance = 1;
    }
    var beforeMatchExt = (mode, parent) => {
      if (!mode.beforeMatch) return;
      if (mode.starts) throw new Error("beforeMatch cannot be used with starts");
      const originalMode = Object.assign({}, mode);
      Object.keys(mode).forEach((key) => {
        delete mode[key];
      });
      mode.keywords = originalMode.keywords;
      mode.begin = concat(originalMode.beforeMatch, lookahead(originalMode.begin));
      mode.starts = {
        relevance: 0,
        contains: [
          Object.assign(originalMode, { endsParent: true })
        ]
      };
      mode.relevance = 0;
      delete originalMode.beforeMatch;
    };
    var COMMON_KEYWORDS = [
      "of",
      "and",
      "for",
      "in",
      "not",
      "or",
      "if",
      "then",
      "parent",
      // common variable name
      "list",
      // common variable name
      "value"
      // common variable name
    ];
    var DEFAULT_KEYWORD_SCOPE = "keyword";
    function compileKeywords(rawKeywords, caseInsensitive, scopeName = DEFAULT_KEYWORD_SCOPE) {
      const compiledKeywords = /* @__PURE__ */ Object.create(null);
      if (typeof rawKeywords === "string") {
        compileList(scopeName, rawKeywords.split(" "));
      } else if (Array.isArray(rawKeywords)) {
        compileList(scopeName, rawKeywords);
      } else {
        Object.keys(rawKeywords).forEach(function(scopeName2) {
          Object.assign(
            compiledKeywords,
            compileKeywords(rawKeywords[scopeName2], caseInsensitive, scopeName2)
          );
        });
      }
      return compiledKeywords;
      function compileList(scopeName2, keywordList) {
        if (caseInsensitive) {
          keywordList = keywordList.map((x2) => x2.toLowerCase());
        }
        keywordList.forEach(function(keyword) {
          const pair = keyword.split("|");
          compiledKeywords[pair[0]] = [scopeName2, scoreForKeyword(pair[0], pair[1])];
        });
      }
    }
    function scoreForKeyword(keyword, providedScore) {
      if (providedScore) {
        return Number(providedScore);
      }
      return commonKeyword(keyword) ? 0 : 1;
    }
    function commonKeyword(keyword) {
      return COMMON_KEYWORDS.includes(keyword.toLowerCase());
    }
    var seenDeprecations = {};
    var error = (message) => {
      console.error(message);
    };
    var warn = (message, ...args) => {
      console.log(`WARN: ${message}`, ...args);
    };
    var deprecated = (version2, message) => {
      if (seenDeprecations[`${version2}/${message}`]) return;
      console.log(`Deprecated as of ${version2}. ${message}`);
      seenDeprecations[`${version2}/${message}`] = true;
    };
    var MultiClassError = new Error();
    function remapScopeNames(mode, regexes, { key }) {
      let offset = 0;
      const scopeNames = mode[key];
      const emit = {};
      const positions = {};
      for (let i = 1; i <= regexes.length; i++) {
        positions[i + offset] = scopeNames[i];
        emit[i + offset] = true;
        offset += countMatchGroups(regexes[i - 1]);
      }
      mode[key] = positions;
      mode[key]._emit = emit;
      mode[key]._multi = true;
    }
    function beginMultiClass(mode) {
      if (!Array.isArray(mode.begin)) return;
      if (mode.skip || mode.excludeBegin || mode.returnBegin) {
        error("skip, excludeBegin, returnBegin not compatible with beginScope: {}");
        throw MultiClassError;
      }
      if (typeof mode.beginScope !== "object" || mode.beginScope === null) {
        error("beginScope must be object");
        throw MultiClassError;
      }
      remapScopeNames(mode, mode.begin, { key: "beginScope" });
      mode.begin = _rewriteBackreferences(mode.begin, { joinWith: "" });
    }
    function endMultiClass(mode) {
      if (!Array.isArray(mode.end)) return;
      if (mode.skip || mode.excludeEnd || mode.returnEnd) {
        error("skip, excludeEnd, returnEnd not compatible with endScope: {}");
        throw MultiClassError;
      }
      if (typeof mode.endScope !== "object" || mode.endScope === null) {
        error("endScope must be object");
        throw MultiClassError;
      }
      remapScopeNames(mode, mode.end, { key: "endScope" });
      mode.end = _rewriteBackreferences(mode.end, { joinWith: "" });
    }
    function scopeSugar(mode) {
      if (mode.scope && typeof mode.scope === "object" && mode.scope !== null) {
        mode.beginScope = mode.scope;
        delete mode.scope;
      }
    }
    function MultiClass(mode) {
      scopeSugar(mode);
      if (typeof mode.beginScope === "string") {
        mode.beginScope = { _wrap: mode.beginScope };
      }
      if (typeof mode.endScope === "string") {
        mode.endScope = { _wrap: mode.endScope };
      }
      beginMultiClass(mode);
      endMultiClass(mode);
    }
    function compileLanguage(language) {
      function langRe(value, global) {
        return new RegExp(
          source(value),
          "m" + (language.case_insensitive ? "i" : "") + (language.unicodeRegex ? "u" : "") + (global ? "g" : "")
        );
      }
      class MultiRegex {
        constructor() {
          this.matchIndexes = {};
          this.regexes = [];
          this.matchAt = 1;
          this.position = 0;
        }
        // @ts-ignore
        addRule(re, opts) {
          opts.position = this.position++;
          this.matchIndexes[this.matchAt] = opts;
          this.regexes.push([opts, re]);
          this.matchAt += countMatchGroups(re) + 1;
        }
        compile() {
          if (this.regexes.length === 0) {
            this.exec = () => null;
          }
          const terminators = this.regexes.map((el) => el[1]);
          this.matcherRe = langRe(_rewriteBackreferences(terminators, { joinWith: "|" }), true);
          this.lastIndex = 0;
        }
        /** @param {string} s */
        exec(s) {
          this.matcherRe.lastIndex = this.lastIndex;
          const match = this.matcherRe.exec(s);
          if (!match) {
            return null;
          }
          const i = match.findIndex((el, i2) => i2 > 0 && el !== void 0);
          const matchData = this.matchIndexes[i];
          match.splice(0, i);
          return Object.assign(match, matchData);
        }
      }
      class ResumableMultiRegex {
        constructor() {
          this.rules = [];
          this.multiRegexes = [];
          this.count = 0;
          this.lastIndex = 0;
          this.regexIndex = 0;
        }
        // @ts-ignore
        getMatcher(index) {
          if (this.multiRegexes[index]) return this.multiRegexes[index];
          const matcher = new MultiRegex();
          this.rules.slice(index).forEach(([re, opts]) => matcher.addRule(re, opts));
          matcher.compile();
          this.multiRegexes[index] = matcher;
          return matcher;
        }
        resumingScanAtSamePosition() {
          return this.regexIndex !== 0;
        }
        considerAll() {
          this.regexIndex = 0;
        }
        // @ts-ignore
        addRule(re, opts) {
          this.rules.push([re, opts]);
          if (opts.type === "begin") this.count++;
        }
        /** @param {string} s */
        exec(s) {
          const m = this.getMatcher(this.regexIndex);
          m.lastIndex = this.lastIndex;
          let result = m.exec(s);
          if (this.resumingScanAtSamePosition()) {
            if (result && result.index === this.lastIndex) ;
            else {
              const m2 = this.getMatcher(0);
              m2.lastIndex = this.lastIndex + 1;
              result = m2.exec(s);
            }
          }
          if (result) {
            this.regexIndex += result.position + 1;
            if (this.regexIndex === this.count) {
              this.considerAll();
            }
          }
          return result;
        }
      }
      function buildModeRegex(mode) {
        const mm = new ResumableMultiRegex();
        mode.contains.forEach((term) => mm.addRule(term.begin, { rule: term, type: "begin" }));
        if (mode.terminatorEnd) {
          mm.addRule(mode.terminatorEnd, { type: "end" });
        }
        if (mode.illegal) {
          mm.addRule(mode.illegal, { type: "illegal" });
        }
        return mm;
      }
      function compileMode(mode, parent) {
        const cmode = (
          /** @type CompiledMode */
          mode
        );
        if (mode.isCompiled) return cmode;
        [
          scopeClassName,
          // do this early so compiler extensions generally don't have to worry about
          // the distinction between match/begin
          compileMatch,
          MultiClass,
          beforeMatchExt
        ].forEach((ext) => ext(mode, parent));
        language.compilerExtensions.forEach((ext) => ext(mode, parent));
        mode.__beforeBegin = null;
        [
          beginKeywords,
          // do this later so compiler extensions that come earlier have access to the
          // raw array if they wanted to perhaps manipulate it, etc.
          compileIllegal,
          // default to 1 relevance if not specified
          compileRelevance
        ].forEach((ext) => ext(mode, parent));
        mode.isCompiled = true;
        let keywordPattern = null;
        if (typeof mode.keywords === "object" && mode.keywords.$pattern) {
          mode.keywords = Object.assign({}, mode.keywords);
          keywordPattern = mode.keywords.$pattern;
          delete mode.keywords.$pattern;
        }
        keywordPattern = keywordPattern || /\w+/;
        if (mode.keywords) {
          mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
        }
        cmode.keywordPatternRe = langRe(keywordPattern, true);
        if (parent) {
          if (!mode.begin) mode.begin = /\B|\b/;
          cmode.beginRe = langRe(cmode.begin);
          if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
          if (mode.end) cmode.endRe = langRe(cmode.end);
          cmode.terminatorEnd = source(cmode.end) || "";
          if (mode.endsWithParent && parent.terminatorEnd) {
            cmode.terminatorEnd += (mode.end ? "|" : "") + parent.terminatorEnd;
          }
        }
        if (mode.illegal) cmode.illegalRe = langRe(
          /** @type {RegExp | string} */
          mode.illegal
        );
        if (!mode.contains) mode.contains = [];
        mode.contains = [].concat(...mode.contains.map(function(c) {
          return expandOrCloneMode(c === "self" ? mode : c);
        }));
        mode.contains.forEach(function(c) {
          compileMode(
            /** @type Mode */
            c,
            cmode
          );
        });
        if (mode.starts) {
          compileMode(mode.starts, parent);
        }
        cmode.matcher = buildModeRegex(cmode);
        return cmode;
      }
      if (!language.compilerExtensions) language.compilerExtensions = [];
      if (language.contains && language.contains.includes("self")) {
        throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
      }
      language.classNameAliases = inherit$1(language.classNameAliases || {});
      return compileMode(
        /** @type Mode */
        language
      );
    }
    function dependencyOnParent(mode) {
      if (!mode) return false;
      return mode.endsWithParent || dependencyOnParent(mode.starts);
    }
    function expandOrCloneMode(mode) {
      if (mode.variants && !mode.cachedVariants) {
        mode.cachedVariants = mode.variants.map(function(variant) {
          return inherit$1(mode, { variants: null }, variant);
        });
      }
      if (mode.cachedVariants) {
        return mode.cachedVariants;
      }
      if (dependencyOnParent(mode)) {
        return inherit$1(mode, { starts: mode.starts ? inherit$1(mode.starts) : null });
      }
      if (Object.isFrozen(mode)) {
        return inherit$1(mode);
      }
      return mode;
    }
    var version = "11.11.1";
    var HTMLInjectionError = class extends Error {
      constructor(reason, html3) {
        super(reason);
        this.name = "HTMLInjectionError";
        this.html = html3;
      }
    };
    var escape4 = escapeHTML;
    var inherit = inherit$1;
    var NO_MATCH = Symbol("nomatch");
    var MAX_KEYWORD_HITS = 7;
    var HLJS = function(hljs) {
      const languages = /* @__PURE__ */ Object.create(null);
      const aliases = /* @__PURE__ */ Object.create(null);
      const plugins = [];
      let SAFE_MODE = true;
      const LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
      const PLAINTEXT_LANGUAGE = { disableAutodetect: true, name: "Plain text", contains: [] };
      let options3 = {
        ignoreUnescapedHTML: false,
        throwUnescapedHTML: false,
        noHighlightRe: /^(no-?highlight)$/i,
        languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
        classPrefix: "hljs-",
        cssSelector: "pre code",
        languages: null,
        // beta configuration options, subject to change, welcome to discuss
        // https://github.com/highlightjs/highlight.js/issues/1086
        __emitter: TokenTreeEmitter
      };
      function shouldNotHighlight(languageName) {
        return options3.noHighlightRe.test(languageName);
      }
      function blockLanguage(block2) {
        let classes = block2.className + " ";
        classes += block2.parentNode ? block2.parentNode.className : "";
        const match = options3.languageDetectRe.exec(classes);
        if (match) {
          const language = getLanguage(match[1]);
          if (!language) {
            warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
            warn("Falling back to no-highlight mode for this block.", block2);
          }
          return language ? match[1] : "no-highlight";
        }
        return classes.split(/\s+/).find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
      }
      function highlight2(codeOrLanguageName, optionsOrCode, ignoreIllegals) {
        let code = "";
        let languageName = "";
        if (typeof optionsOrCode === "object") {
          code = codeOrLanguageName;
          ignoreIllegals = optionsOrCode.ignoreIllegals;
          languageName = optionsOrCode.language;
        } else {
          deprecated("10.7.0", "highlight(lang, code, ...args) has been deprecated.");
          deprecated("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277");
          languageName = codeOrLanguageName;
          code = optionsOrCode;
        }
        if (ignoreIllegals === void 0) {
          ignoreIllegals = true;
        }
        const context = {
          code,
          language: languageName
        };
        fire("before:highlight", context);
        const result = context.result ? context.result : _highlight(context.language, context.code, ignoreIllegals);
        result.code = context.code;
        fire("after:highlight", result);
        return result;
      }
      function _highlight(languageName, codeToHighlight, ignoreIllegals, continuation) {
        const keywordHits = /* @__PURE__ */ Object.create(null);
        function keywordData(mode, matchText) {
          return mode.keywords[matchText];
        }
        function processKeywords() {
          if (!top.keywords) {
            emitter.addText(modeBuffer);
            return;
          }
          let lastIndex = 0;
          top.keywordPatternRe.lastIndex = 0;
          let match = top.keywordPatternRe.exec(modeBuffer);
          let buf = "";
          while (match) {
            buf += modeBuffer.substring(lastIndex, match.index);
            const word = language.case_insensitive ? match[0].toLowerCase() : match[0];
            const data = keywordData(top, word);
            if (data) {
              const [kind, keywordRelevance] = data;
              emitter.addText(buf);
              buf = "";
              keywordHits[word] = (keywordHits[word] || 0) + 1;
              if (keywordHits[word] <= MAX_KEYWORD_HITS) relevance += keywordRelevance;
              if (kind.startsWith("_")) {
                buf += match[0];
              } else {
                const cssClass = language.classNameAliases[kind] || kind;
                emitKeyword(match[0], cssClass);
              }
            } else {
              buf += match[0];
            }
            lastIndex = top.keywordPatternRe.lastIndex;
            match = top.keywordPatternRe.exec(modeBuffer);
          }
          buf += modeBuffer.substring(lastIndex);
          emitter.addText(buf);
        }
        function processSubLanguage() {
          if (modeBuffer === "") return;
          let result2 = null;
          if (typeof top.subLanguage === "string") {
            if (!languages[top.subLanguage]) {
              emitter.addText(modeBuffer);
              return;
            }
            result2 = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
            continuations[top.subLanguage] = /** @type {CompiledMode} */
            result2._top;
          } else {
            result2 = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
          }
          if (top.relevance > 0) {
            relevance += result2.relevance;
          }
          emitter.__addSublanguage(result2._emitter, result2.language);
        }
        function processBuffer() {
          if (top.subLanguage != null) {
            processSubLanguage();
          } else {
            processKeywords();
          }
          modeBuffer = "";
        }
        function emitKeyword(keyword, scope) {
          if (keyword === "") return;
          emitter.startScope(scope);
          emitter.addText(keyword);
          emitter.endScope();
        }
        function emitMultiClass(scope, match) {
          let i = 1;
          const max = match.length - 1;
          while (i <= max) {
            if (!scope._emit[i]) {
              i++;
              continue;
            }
            const klass = language.classNameAliases[scope[i]] || scope[i];
            const text2 = match[i];
            if (klass) {
              emitKeyword(text2, klass);
            } else {
              modeBuffer = text2;
              processKeywords();
              modeBuffer = "";
            }
            i++;
          }
        }
        function startNewMode(mode, match) {
          if (mode.scope && typeof mode.scope === "string") {
            emitter.openNode(language.classNameAliases[mode.scope] || mode.scope);
          }
          if (mode.beginScope) {
            if (mode.beginScope._wrap) {
              emitKeyword(modeBuffer, language.classNameAliases[mode.beginScope._wrap] || mode.beginScope._wrap);
              modeBuffer = "";
            } else if (mode.beginScope._multi) {
              emitMultiClass(mode.beginScope, match);
              modeBuffer = "";
            }
          }
          top = Object.create(mode, { parent: { value: top } });
          return top;
        }
        function endOfMode(mode, match, matchPlusRemainder) {
          let matched = startsWith(mode.endRe, matchPlusRemainder);
          if (matched) {
            if (mode["on:end"]) {
              const resp = new Response(mode);
              mode["on:end"](match, resp);
              if (resp.isMatchIgnored) matched = false;
            }
            if (matched) {
              while (mode.endsParent && mode.parent) {
                mode = mode.parent;
              }
              return mode;
            }
          }
          if (mode.endsWithParent) {
            return endOfMode(mode.parent, match, matchPlusRemainder);
          }
        }
        function doIgnore(lexeme) {
          if (top.matcher.regexIndex === 0) {
            modeBuffer += lexeme[0];
            return 1;
          } else {
            resumeScanAtSamePosition = true;
            return 0;
          }
        }
        function doBeginMatch(match) {
          const lexeme = match[0];
          const newMode = match.rule;
          const resp = new Response(newMode);
          const beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];
          for (const cb of beforeCallbacks) {
            if (!cb) continue;
            cb(match, resp);
            if (resp.isMatchIgnored) return doIgnore(lexeme);
          }
          if (newMode.skip) {
            modeBuffer += lexeme;
          } else {
            if (newMode.excludeBegin) {
              modeBuffer += lexeme;
            }
            processBuffer();
            if (!newMode.returnBegin && !newMode.excludeBegin) {
              modeBuffer = lexeme;
            }
          }
          startNewMode(newMode, match);
          return newMode.returnBegin ? 0 : lexeme.length;
        }
        function doEndMatch(match) {
          const lexeme = match[0];
          const matchPlusRemainder = codeToHighlight.substring(match.index);
          const endMode = endOfMode(top, match, matchPlusRemainder);
          if (!endMode) {
            return NO_MATCH;
          }
          const origin = top;
          if (top.endScope && top.endScope._wrap) {
            processBuffer();
            emitKeyword(lexeme, top.endScope._wrap);
          } else if (top.endScope && top.endScope._multi) {
            processBuffer();
            emitMultiClass(top.endScope, match);
          } else if (origin.skip) {
            modeBuffer += lexeme;
          } else {
            if (!(origin.returnEnd || origin.excludeEnd)) {
              modeBuffer += lexeme;
            }
            processBuffer();
            if (origin.excludeEnd) {
              modeBuffer = lexeme;
            }
          }
          do {
            if (top.scope) {
              emitter.closeNode();
            }
            if (!top.skip && !top.subLanguage) {
              relevance += top.relevance;
            }
            top = top.parent;
          } while (top !== endMode.parent);
          if (endMode.starts) {
            startNewMode(endMode.starts, match);
          }
          return origin.returnEnd ? 0 : lexeme.length;
        }
        function processContinuations() {
          const list2 = [];
          for (let current = top; current !== language; current = current.parent) {
            if (current.scope) {
              list2.unshift(current.scope);
            }
          }
          list2.forEach((item) => emitter.openNode(item));
        }
        let lastMatch = {};
        function processLexeme(textBeforeMatch, match) {
          const lexeme = match && match[0];
          modeBuffer += textBeforeMatch;
          if (lexeme == null) {
            processBuffer();
            return 0;
          }
          if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
            modeBuffer += codeToHighlight.slice(match.index, match.index + 1);
            if (!SAFE_MODE) {
              const err = new Error(`0 width match regex (${languageName})`);
              err.languageName = languageName;
              err.badRule = lastMatch.rule;
              throw err;
            }
            return 1;
          }
          lastMatch = match;
          if (match.type === "begin") {
            return doBeginMatch(match);
          } else if (match.type === "illegal" && !ignoreIllegals) {
            const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.scope || "<unnamed>") + '"');
            err.mode = top;
            throw err;
          } else if (match.type === "end") {
            const processed = doEndMatch(match);
            if (processed !== NO_MATCH) {
              return processed;
            }
          }
          if (match.type === "illegal" && lexeme === "") {
            modeBuffer += "\n";
            return 1;
          }
          if (iterations > 1e5 && iterations > match.index * 3) {
            const err = new Error("potential infinite loop, way more iterations than matches");
            throw err;
          }
          modeBuffer += lexeme;
          return lexeme.length;
        }
        const language = getLanguage(languageName);
        if (!language) {
          error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
          throw new Error('Unknown language: "' + languageName + '"');
        }
        const md = compileLanguage(language);
        let result = "";
        let top = continuation || md;
        const continuations = {};
        const emitter = new options3.__emitter(options3);
        processContinuations();
        let modeBuffer = "";
        let relevance = 0;
        let index = 0;
        let iterations = 0;
        let resumeScanAtSamePosition = false;
        try {
          if (!language.__emitTokens) {
            top.matcher.considerAll();
            for (; ; ) {
              iterations++;
              if (resumeScanAtSamePosition) {
                resumeScanAtSamePosition = false;
              } else {
                top.matcher.considerAll();
              }
              top.matcher.lastIndex = index;
              const match = top.matcher.exec(codeToHighlight);
              if (!match) break;
              const beforeMatch = codeToHighlight.substring(index, match.index);
              const processedCount = processLexeme(beforeMatch, match);
              index = match.index + processedCount;
            }
            processLexeme(codeToHighlight.substring(index));
          } else {
            language.__emitTokens(codeToHighlight, emitter);
          }
          emitter.finalize();
          result = emitter.toHTML();
          return {
            language: languageName,
            value: result,
            relevance,
            illegal: false,
            _emitter: emitter,
            _top: top
          };
        } catch (err) {
          if (err.message && err.message.includes("Illegal")) {
            return {
              language: languageName,
              value: escape4(codeToHighlight),
              illegal: true,
              relevance: 0,
              _illegalBy: {
                message: err.message,
                index,
                context: codeToHighlight.slice(index - 100, index + 100),
                mode: err.mode,
                resultSoFar: result
              },
              _emitter: emitter
            };
          } else if (SAFE_MODE) {
            return {
              language: languageName,
              value: escape4(codeToHighlight),
              illegal: false,
              relevance: 0,
              errorRaised: err,
              _emitter: emitter,
              _top: top
            };
          } else {
            throw err;
          }
        }
      }
      function justTextHighlightResult(code) {
        const result = {
          value: escape4(code),
          illegal: false,
          relevance: 0,
          _top: PLAINTEXT_LANGUAGE,
          _emitter: new options3.__emitter(options3)
        };
        result._emitter.addText(code);
        return result;
      }
      function highlightAuto(code, languageSubset) {
        languageSubset = languageSubset || options3.languages || Object.keys(languages);
        const plaintext = justTextHighlightResult(code);
        const results = languageSubset.filter(getLanguage).filter(autoDetection).map(
          (name) => _highlight(name, code, false)
        );
        results.unshift(plaintext);
        const sorted = results.sort((a, b) => {
          if (a.relevance !== b.relevance) return b.relevance - a.relevance;
          if (a.language && b.language) {
            if (getLanguage(a.language).supersetOf === b.language) {
              return 1;
            } else if (getLanguage(b.language).supersetOf === a.language) {
              return -1;
            }
          }
          return 0;
        });
        const [best, secondBest] = sorted;
        const result = best;
        result.secondBest = secondBest;
        return result;
      }
      function updateClassName(element, currentLang, resultLang) {
        const language = currentLang && aliases[currentLang] || resultLang;
        element.classList.add("hljs");
        element.classList.add(`language-${language}`);
      }
      function highlightElement(element) {
        let node2 = null;
        const language = blockLanguage(element);
        if (shouldNotHighlight(language)) return;
        fire(
          "before:highlightElement",
          { el: element, language }
        );
        if (element.dataset.highlighted) {
          console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", element);
          return;
        }
        if (element.children.length > 0) {
          if (!options3.ignoreUnescapedHTML) {
            console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk.");
            console.warn("https://github.com/highlightjs/highlight.js/wiki/security");
            console.warn("The element with unescaped HTML:");
            console.warn(element);
          }
          if (options3.throwUnescapedHTML) {
            const err = new HTMLInjectionError(
              "One of your code blocks includes unescaped HTML.",
              element.innerHTML
            );
            throw err;
          }
        }
        node2 = element;
        const text2 = node2.textContent;
        const result = language ? highlight2(text2, { language, ignoreIllegals: true }) : highlightAuto(text2);
        element.innerHTML = result.value;
        element.dataset.highlighted = "yes";
        updateClassName(element, language, result.language);
        element.result = {
          language: result.language,
          // TODO: remove with version 11.0
          re: result.relevance,
          relevance: result.relevance
        };
        if (result.secondBest) {
          element.secondBest = {
            language: result.secondBest.language,
            relevance: result.secondBest.relevance
          };
        }
        fire("after:highlightElement", { el: element, result, text: text2 });
      }
      function configure(userOptions) {
        options3 = inherit(options3, userOptions);
      }
      const initHighlighting = () => {
        highlightAll();
        deprecated("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
      };
      function initHighlightingOnLoad() {
        highlightAll();
        deprecated("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
      }
      let wantsHighlight = false;
      function highlightAll() {
        function boot() {
          highlightAll();
        }
        if (document.readyState === "loading") {
          if (!wantsHighlight) {
            window.addEventListener("DOMContentLoaded", boot, false);
          }
          wantsHighlight = true;
          return;
        }
        const blocks = document.querySelectorAll(options3.cssSelector);
        blocks.forEach(highlightElement);
      }
      function registerLanguage(languageName, languageDefinition) {
        let lang = null;
        try {
          lang = languageDefinition(hljs);
        } catch (error$1) {
          error("Language definition for '{}' could not be registered.".replace("{}", languageName));
          if (!SAFE_MODE) {
            throw error$1;
          } else {
            error(error$1);
          }
          lang = PLAINTEXT_LANGUAGE;
        }
        if (!lang.name) lang.name = languageName;
        languages[languageName] = lang;
        lang.rawDefinition = languageDefinition.bind(null, hljs);
        if (lang.aliases) {
          registerAliases(lang.aliases, { languageName });
        }
      }
      function unregisterLanguage(languageName) {
        delete languages[languageName];
        for (const alias of Object.keys(aliases)) {
          if (aliases[alias] === languageName) {
            delete aliases[alias];
          }
        }
      }
      function listLanguages() {
        return Object.keys(languages);
      }
      function getLanguage(name) {
        name = (name || "").toLowerCase();
        return languages[name] || languages[aliases[name]];
      }
      function registerAliases(aliasList, { languageName }) {
        if (typeof aliasList === "string") {
          aliasList = [aliasList];
        }
        aliasList.forEach((alias) => {
          aliases[alias.toLowerCase()] = languageName;
        });
      }
      function autoDetection(name) {
        const lang = getLanguage(name);
        return lang && !lang.disableAutodetect;
      }
      function upgradePluginAPI(plugin) {
        if (plugin["before:highlightBlock"] && !plugin["before:highlightElement"]) {
          plugin["before:highlightElement"] = (data) => {
            plugin["before:highlightBlock"](
              Object.assign({ block: data.el }, data)
            );
          };
        }
        if (plugin["after:highlightBlock"] && !plugin["after:highlightElement"]) {
          plugin["after:highlightElement"] = (data) => {
            plugin["after:highlightBlock"](
              Object.assign({ block: data.el }, data)
            );
          };
        }
      }
      function addPlugin(plugin) {
        upgradePluginAPI(plugin);
        plugins.push(plugin);
      }
      function removePlugin(plugin) {
        const index = plugins.indexOf(plugin);
        if (index !== -1) {
          plugins.splice(index, 1);
        }
      }
      function fire(event, args) {
        const cb = event;
        plugins.forEach(function(plugin) {
          if (plugin[cb]) {
            plugin[cb](args);
          }
        });
      }
      function deprecateHighlightBlock(el) {
        deprecated("10.7.0", "highlightBlock will be removed entirely in v12.0");
        deprecated("10.7.0", "Please use highlightElement now.");
        return highlightElement(el);
      }
      Object.assign(hljs, {
        highlight: highlight2,
        highlightAuto,
        highlightAll,
        highlightElement,
        // TODO: Remove with v12 API
        highlightBlock: deprecateHighlightBlock,
        configure,
        initHighlighting,
        initHighlightingOnLoad,
        registerLanguage,
        unregisterLanguage,
        listLanguages,
        getLanguage,
        registerAliases,
        autoDetection,
        inherit,
        addPlugin,
        removePlugin
      });
      hljs.debugMode = function() {
        SAFE_MODE = false;
      };
      hljs.safeMode = function() {
        SAFE_MODE = true;
      };
      hljs.versionString = version;
      hljs.regex = {
        concat,
        lookahead,
        either,
        optional,
        anyNumberOfTimes
      };
      for (const key in MODES) {
        if (typeof MODES[key] === "object") {
          deepFreeze(MODES[key]);
        }
      }
      Object.assign(hljs, MODES);
      return hljs;
    };
    var highlight = HLJS({});
    highlight.newInstance = () => HLJS({});
    module.exports = highlight;
    highlight.HighlightJS = highlight;
    highlight.default = highlight;
  }
});

// src_web/comfyui/markdown_renderer.ts
import { app as app2 } from "/scripts/app.js";

// node_modules/@comfyorg/litegraph/dist/litegraph.es.js
var _onPointerDownOrMove, _onPointerUp, _onKeyDownOrUp;
var InputIndicators = class {
  constructor(canvas2) {
    // #region config
    __publicField(this, "radius", 8);
    __publicField(this, "startAngle", 0);
    __publicField(this, "endAngle", Math.PI * 2);
    __publicField(this, "inactiveColour", "#ffffff10");
    __publicField(this, "colour1", "#ff5f00");
    __publicField(this, "colour2", "#00ff7c");
    __publicField(this, "colour3", "#dea7ff");
    __publicField(this, "fontString", "bold 12px Arial");
    // #endregion
    // #region state
    __publicField(this, "enabled", true);
    __publicField(this, "shiftDown", false);
    __publicField(this, "undoDown", false);
    __publicField(this, "redoDown", false);
    __publicField(this, "ctrlDown", false);
    __publicField(this, "altDown", false);
    __publicField(this, "mouse0Down", false);
    __publicField(this, "mouse1Down", false);
    __publicField(this, "mouse2Down", false);
    __publicField(this, "x", 0);
    __publicField(this, "y", 0);
    // #endregion
    __publicField(this, "controller");
    __privateAdd(this, _onPointerDownOrMove, this.onPointerDownOrMove.bind(this));
    __privateAdd(this, _onPointerUp, this.onPointerUp.bind(this));
    __privateAdd(this, _onKeyDownOrUp, this.onKeyDownOrUp.bind(this));
    this.canvas = canvas2;
    this.controller = new AbortController();
    const { signal } = this.controller;
    const element = canvas2.canvas;
    const options22 = { capture: true, signal };
    element.addEventListener("pointerdown", __privateGet(this, _onPointerDownOrMove), options22);
    element.addEventListener("pointermove", __privateGet(this, _onPointerDownOrMove), options22);
    element.addEventListener("pointerup", __privateGet(this, _onPointerUp), options22);
    element.addEventListener("keydown", __privateGet(this, _onKeyDownOrUp), options22);
    document.addEventListener("keyup", __privateGet(this, _onKeyDownOrUp), options22);
    const origDrawFrontCanvas = canvas2.drawFrontCanvas.bind(canvas2);
    signal.addEventListener("abort", () => {
      canvas2.drawFrontCanvas = origDrawFrontCanvas;
    });
    canvas2.drawFrontCanvas = () => {
      origDrawFrontCanvas();
      this.draw();
    };
  }
  onPointerDownOrMove(e2) {
    this.mouse0Down = (e2.buttons & 1) === 1;
    this.mouse1Down = (e2.buttons & 4) === 4;
    this.mouse2Down = (e2.buttons & 2) === 2;
    this.x = e2.clientX;
    this.y = e2.clientY;
    this.canvas.setDirty(true);
  }
  onPointerUp() {
    this.mouse0Down = false;
    this.mouse1Down = false;
    this.mouse2Down = false;
  }
  onKeyDownOrUp(e2) {
    this.ctrlDown = e2.ctrlKey;
    this.altDown = e2.altKey;
    this.shiftDown = e2.shiftKey;
    this.undoDown = e2.ctrlKey && e2.code === "KeyZ" && e2.type === "keydown";
    this.redoDown = e2.ctrlKey && e2.code === "KeyY" && e2.type === "keydown";
  }
  draw() {
    const {
      canvas: { ctx },
      radius,
      startAngle,
      endAngle,
      x: x2,
      y,
      inactiveColour,
      colour1,
      colour2,
      colour3,
      fontString
    } = this;
    const { fillStyle, font } = ctx;
    const mouseDotX = x2;
    const mouseDotY = y - 80;
    const textX = mouseDotX;
    const textY = mouseDotY - 15;
    ctx.font = fontString;
    textMarker(textX + 0, textY, "Shift", this.shiftDown ? colour1 : inactiveColour);
    textMarker(textX + 45, textY + 20, "Alt", this.altDown ? colour2 : inactiveColour);
    textMarker(textX + 30, textY, "Control", this.ctrlDown ? colour3 : inactiveColour);
    textMarker(textX - 30, textY, "\u21A9\uFE0F", this.undoDown ? "#000" : "transparent");
    textMarker(textX + 45, textY, "\u21AA\uFE0F", this.redoDown ? "#000" : "transparent");
    ctx.beginPath();
    drawDot(mouseDotX, mouseDotY);
    drawDot(mouseDotX + 15, mouseDotY);
    drawDot(mouseDotX + 30, mouseDotY);
    ctx.fillStyle = inactiveColour;
    ctx.fill();
    const leftButtonColour = this.mouse0Down ? colour1 : inactiveColour;
    const middleButtonColour = this.mouse1Down ? colour2 : inactiveColour;
    const rightButtonColour = this.mouse2Down ? colour3 : inactiveColour;
    if (this.mouse0Down) mouseMarker(mouseDotX, mouseDotY, leftButtonColour);
    if (this.mouse1Down) mouseMarker(mouseDotX + 15, mouseDotY, middleButtonColour);
    if (this.mouse2Down) mouseMarker(mouseDotX + 30, mouseDotY, rightButtonColour);
    ctx.fillStyle = fillStyle;
    ctx.font = font;
    function textMarker(x22, y2, text2, colour) {
      ctx.fillStyle = colour;
      ctx.fillText(text2, x22, y2);
    }
    function mouseMarker(x22, y2, colour) {
      ctx.beginPath();
      ctx.fillStyle = colour;
      drawDot(x22, y2);
      ctx.fill();
    }
    function drawDot(x22, y2) {
      ctx.arc(x22, y2, radius, startAngle, endAngle);
    }
  }
  dispose() {
    var _a2;
    (_a2 = this.controller) == null ? void 0 : _a2.abort();
    this.controller = void 0;
  }
};
_onPointerDownOrMove = new WeakMap();
_onPointerUp = new WeakMap();
_onKeyDownOrUp = new WeakMap();
var ContextMenu = class _ContextMenu {
  /**
   * @todo Interface for values requires functionality change - currently accepts
   * an array of strings, functions, objects, nulls, or undefined.
   * @param values (allows object { title: "Nice text", callback: function ... })
   * @param options [optional] Some options:\
   * - title: title to show on top of the menu
   * - callback: function to call when an option is clicked, it receives the item information
   * - ignore_item_callbacks: ignores the callback inside the item, it just calls the options.callback
   * - event: you can pass a MouseEvent, this way the ContextMenu appears in that position
   */
  constructor(values, options22) {
    __publicField(this, "options");
    __publicField(this, "parentMenu");
    __publicField(this, "root");
    __publicField(this, "current_submenu");
    __publicField(this, "lock");
    var _a2, _b, _c;
    options22 || (options22 = {});
    this.options = options22;
    const parent = options22.parentMenu;
    if (parent) {
      if (!(parent instanceof _ContextMenu)) {
        console.error("parentMenu must be of class ContextMenu, ignoring it");
        options22.parentMenu = void 0;
      } else {
        this.parentMenu = parent;
        this.parentMenu.lock = true;
        this.parentMenu.current_submenu = this;
      }
      if (((_a2 = parent.options) == null ? void 0 : _a2.className) === "dark") {
        options22.className = "dark";
      }
    }
    const eventClass = options22.event ? options22.event.constructor.name : null;
    if (eventClass !== "MouseEvent" && eventClass !== "CustomEvent" && eventClass !== "PointerEvent") {
      console.error(`Event passed to ContextMenu is not of type MouseEvent or CustomEvent. Ignoring it. (${eventClass})`);
      options22.event = void 0;
    }
    const root = document.createElement("div");
    let classes = "litegraph litecontextmenu litemenubar-panel";
    if (options22.className) classes += ` ${options22.className}`;
    root.className = classes;
    root.style.minWidth = "100";
    root.style.minHeight = "100";
    root.style.pointerEvents = "none";
    setTimeout(function() {
      root.style.pointerEvents = "auto";
    }, 100);
    root.addEventListener(
      "pointerup",
      function(e2) {
        e2.preventDefault();
        return true;
      },
      true
    );
    root.addEventListener(
      "contextmenu",
      function(e2) {
        if (e2.button != 2) return false;
        e2.preventDefault();
        return false;
      },
      true
    );
    root.addEventListener(
      "pointerdown",
      (e2) => {
        if (e2.button == 2) {
          this.close();
          e2.preventDefault();
          return true;
        }
      },
      true
    );
    this.root = root;
    if (options22.title) {
      const element = document.createElement("div");
      element.className = "litemenu-title";
      element.innerHTML = options22.title;
      root.append(element);
    }
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      let name = Array.isArray(values) ? value : String(i);
      if (typeof name !== "string") {
        name = name != null ? name.content === void 0 ? String(name) : name.content : name;
      }
      this.addItem(name, value, options22);
    }
    root.addEventListener("pointerenter", function() {
      if (root.closing_timer) {
        clearTimeout(root.closing_timer);
      }
    });
    const ownerDocument = (_c = (_b = options22.event) == null ? void 0 : _b.target) == null ? void 0 : _c.ownerDocument;
    const root_document = ownerDocument || document;
    if (root_document.fullscreenElement)
      root_document.fullscreenElement.append(root);
    else
      root_document.body.append(root);
    let left = options22.left || 0;
    let top = options22.top || 0;
    if (options22.event) {
      left = options22.event.clientX - 10;
      top = options22.event.clientY - 10;
      if (options22.title) top -= 20;
      if (parent) {
        const rect = parent.root.getBoundingClientRect();
        left = rect.left + rect.width;
      }
      const body_rect = document.body.getBoundingClientRect();
      const root_rect = root.getBoundingClientRect();
      if (body_rect.height == 0)
        console.error("document.body height is 0. That is dangerous, set html,body { height: 100%; }");
      if (body_rect.width && left > body_rect.width - root_rect.width - 10)
        left = body_rect.width - root_rect.width - 10;
      if (body_rect.height && top > body_rect.height - root_rect.height - 10)
        top = body_rect.height - root_rect.height - 10;
    }
    root.style.left = `${left}px`;
    root.style.top = `${top}px`;
    if (LiteGraph.context_menu_scaling && options22.scale) {
      root.style.transform = `scale(${Math.round(options22.scale * 4) * 0.25})`;
    }
  }
  addItem(name, value, options22) {
    var _a2;
    options22 || (options22 = {});
    const element = document.createElement("div");
    element.className = "litemenu-entry submenu";
    let disabled = false;
    if (value === null) {
      element.classList.add("separator");
    } else {
      const innerHtml = name === null ? "" : String(name);
      if (typeof value === "string") {
        element.innerHTML = innerHtml;
      } else {
        element.innerHTML = (_a2 = value == null ? void 0 : value.title) != null ? _a2 : innerHtml;
        if (value.disabled) {
          disabled = true;
          element.classList.add("disabled");
          element.setAttribute("aria-disabled", "true");
        }
        if (value.submenu || value.has_submenu) {
          element.classList.add("has_submenu");
          element.setAttribute("aria-haspopup", "true");
          element.setAttribute("aria-expanded", "false");
        }
        if (value.className) element.className += ` ${value.className}`;
      }
      element.value = value;
      element.setAttribute("role", "menuitem");
      if (typeof value === "function") {
        element.dataset["value"] = String(name);
        element.onclick_callback = value;
      } else {
        element.dataset["value"] = String(value);
      }
    }
    this.root.append(element);
    if (!disabled) element.addEventListener("click", inner_onclick);
    if (!disabled && options22.autoopen)
      element.addEventListener("pointerenter", inner_over);
    const setAriaExpanded = () => {
      const entries2 = this.root.querySelectorAll("div.litemenu-entry.has_submenu");
      if (entries2) {
        for (const entry of entries2) {
          entry.setAttribute("aria-expanded", "false");
        }
      }
      element.setAttribute("aria-expanded", "true");
    };
    function inner_over(e2) {
      const value2 = this.value;
      if (!value2 || !value2.has_submenu) return;
      inner_onclick.call(this, e2);
      setAriaExpanded();
    }
    const that = this;
    function inner_onclick(e2) {
      var _a3;
      const value2 = this.value;
      let close_parent = true;
      (_a3 = that.current_submenu) == null ? void 0 : _a3.close(e2);
      if ((value2 == null ? void 0 : value2.has_submenu) || (value2 == null ? void 0 : value2.submenu)) {
        setAriaExpanded();
      }
      if (options22.callback) {
        const r = options22.callback.call(
          this,
          value2,
          options22,
          e2,
          that,
          options22.node
        );
        if (r === true) close_parent = false;
      }
      if (typeof value2 === "object") {
        if (value2.callback && !options22.ignore_item_callbacks && value2.disabled !== true) {
          const r = value2.callback.call(
            this,
            value2,
            options22,
            e2,
            that,
            options22.extra
          );
          if (r === true) close_parent = false;
        }
        if (value2.submenu) {
          if (!value2.submenu.options) throw "ContextMenu submenu needs options";
          new that.constructor(value2.submenu.options, {
            callback: value2.submenu.callback,
            event: e2,
            parentMenu: that,
            ignore_item_callbacks: value2.submenu.ignore_item_callbacks,
            title: value2.submenu.title,
            extra: value2.submenu.extra,
            autoopen: options22.autoopen
          });
          close_parent = false;
        }
      }
      if (close_parent && !that.lock) that.close();
    }
    return element;
  }
  close(e2, ignore_parent_menu) {
    var _a2;
    this.root.remove();
    if (this.parentMenu && !ignore_parent_menu) {
      this.parentMenu.lock = false;
      this.parentMenu.current_submenu = void 0;
      if (e2 === void 0) {
        this.parentMenu.close();
      } else if (e2 && !_ContextMenu.isCursorOverElement(e2, this.parentMenu.root)) {
        _ContextMenu.trigger(
          this.parentMenu.root,
          `${LiteGraph.pointerevents_method}leave`,
          e2
        );
      }
    }
    (_a2 = this.current_submenu) == null ? void 0 : _a2.close(e2, true);
    if (this.root.closing_timer) clearTimeout(this.root.closing_timer);
  }
  // this code is used to trigger events easily (used in the context menu mouseleave
  static trigger(element, event_name, params) {
    const evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event_name, true, true, params);
    if (element.dispatchEvent) element.dispatchEvent(evt);
    else if (element.__events) element.__events.dispatchEvent(evt);
    return evt;
  }
  // returns the top most menu
  getTopMenu() {
    return this.options.parentMenu ? this.options.parentMenu.getTopMenu() : this;
  }
  getFirstEvent() {
    return this.options.parentMenu ? this.options.parentMenu.getFirstEvent() : this.options.event;
  }
  static isCursorOverElement(event, element) {
    const left = event.clientX;
    const top = event.clientY;
    const rect = element.getBoundingClientRect();
    if (!rect) return false;
    if (top > rect.top && top < rect.top + rect.height && left > rect.left && left < rect.left + rect.width) {
      return true;
    }
    return false;
  }
};
var NodeSlotType = /* @__PURE__ */ ((NodeSlotType2) => {
  NodeSlotType2[NodeSlotType2["INPUT"] = 1] = "INPUT";
  NodeSlotType2[NodeSlotType2["OUTPUT"] = 2] = "OUTPUT";
  return NodeSlotType2;
})(NodeSlotType || {});
var RenderShape = /* @__PURE__ */ ((RenderShape2) => {
  RenderShape2[RenderShape2["BOX"] = 1] = "BOX";
  RenderShape2[RenderShape2["ROUND"] = 2] = "ROUND";
  RenderShape2[RenderShape2["CIRCLE"] = 3] = "CIRCLE";
  RenderShape2[RenderShape2["CARD"] = 4] = "CARD";
  RenderShape2[RenderShape2["ARROW"] = 5] = "ARROW";
  RenderShape2[RenderShape2["GRID"] = 6] = "GRID";
  RenderShape2[RenderShape2["HollowCircle"] = 7] = "HollowCircle";
  return RenderShape2;
})(RenderShape || {});
var CanvasItem = /* @__PURE__ */ ((CanvasItem2) => {
  CanvasItem2[CanvasItem2["Nothing"] = 0] = "Nothing";
  CanvasItem2[CanvasItem2["Node"] = 1] = "Node";
  CanvasItem2[CanvasItem2["Group"] = 2] = "Group";
  CanvasItem2[CanvasItem2["Reroute"] = 4] = "Reroute";
  CanvasItem2[CanvasItem2["Link"] = 8] = "Link";
  CanvasItem2[CanvasItem2["ResizeSe"] = 16] = "ResizeSe";
  return CanvasItem2;
})(CanvasItem || {});
var LinkDirection = /* @__PURE__ */ ((LinkDirection2) => {
  LinkDirection2[LinkDirection2["NONE"] = 0] = "NONE";
  LinkDirection2[LinkDirection2["UP"] = 1] = "UP";
  LinkDirection2[LinkDirection2["DOWN"] = 2] = "DOWN";
  LinkDirection2[LinkDirection2["LEFT"] = 3] = "LEFT";
  LinkDirection2[LinkDirection2["RIGHT"] = 4] = "RIGHT";
  LinkDirection2[LinkDirection2["CENTER"] = 5] = "CENTER";
  return LinkDirection2;
})(LinkDirection || {});
var LinkRenderType = /* @__PURE__ */ ((LinkRenderType2) => {
  LinkRenderType2[LinkRenderType2["HIDDEN_LINK"] = -1] = "HIDDEN_LINK";
  LinkRenderType2[LinkRenderType2["STRAIGHT_LINK"] = 0] = "STRAIGHT_LINK";
  LinkRenderType2[LinkRenderType2["LINEAR_LINK"] = 1] = "LINEAR_LINK";
  LinkRenderType2[LinkRenderType2["SPLINE_LINK"] = 2] = "SPLINE_LINK";
  return LinkRenderType2;
})(LinkRenderType || {});
var LinkMarkerShape = /* @__PURE__ */ ((LinkMarkerShape2) => {
  LinkMarkerShape2[LinkMarkerShape2["None"] = 0] = "None";
  LinkMarkerShape2[LinkMarkerShape2["Circle"] = 1] = "Circle";
  LinkMarkerShape2[LinkMarkerShape2["Arrow"] = 2] = "Arrow";
  return LinkMarkerShape2;
})(LinkMarkerShape || {});
var TitleMode = /* @__PURE__ */ ((TitleMode2) => {
  TitleMode2[TitleMode2["NORMAL_TITLE"] = 0] = "NORMAL_TITLE";
  TitleMode2[TitleMode2["NO_TITLE"] = 1] = "NO_TITLE";
  TitleMode2[TitleMode2["TRANSPARENT_TITLE"] = 2] = "TRANSPARENT_TITLE";
  TitleMode2[TitleMode2["AUTOHIDE_TITLE"] = 3] = "AUTOHIDE_TITLE";
  return TitleMode2;
})(TitleMode || {});
var LGraphEventMode = /* @__PURE__ */ ((LGraphEventMode2) => {
  LGraphEventMode2[LGraphEventMode2["ALWAYS"] = 0] = "ALWAYS";
  LGraphEventMode2[LGraphEventMode2["ON_EVENT"] = 1] = "ON_EVENT";
  LGraphEventMode2[LGraphEventMode2["NEVER"] = 2] = "NEVER";
  LGraphEventMode2[LGraphEventMode2["ON_TRIGGER"] = 3] = "ON_TRIGGER";
  LGraphEventMode2[LGraphEventMode2["BYPASS"] = 4] = "BYPASS";
  return LGraphEventMode2;
})(LGraphEventMode || {});
var EaseFunction = /* @__PURE__ */ ((EaseFunction2) => {
  EaseFunction2["LINEAR"] = "linear";
  EaseFunction2["EASE_IN_QUAD"] = "easeInQuad";
  EaseFunction2["EASE_OUT_QUAD"] = "easeOutQuad";
  EaseFunction2["EASE_IN_OUT_QUAD"] = "easeInOutQuad";
  return EaseFunction2;
})(EaseFunction || {});
function distance(a, b) {
  return Math.sqrt(
    (b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])
  );
}
function dist2(x1, y1, x2, y2) {
  return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
}
function isInRectangle(x2, y, left, top, width2, height) {
  return x2 >= left && x2 < left + width2 && y >= top && y < top + height;
}
function isPointInRect(point, rect) {
  return point[0] >= rect[0] && point[0] < rect[0] + rect[2] && point[1] >= rect[1] && point[1] < rect[1] + rect[3];
}
function isInRect(x2, y, rect) {
  return x2 >= rect[0] && x2 < rect[0] + rect[2] && y >= rect[1] && y < rect[1] + rect[3];
}
function isInsideRectangle(x2, y, left, top, width2, height) {
  return left < x2 && left + width2 > x2 && top < y && top + height > y;
}
function isSortaInsideOctagon(x2, y, radius) {
  const sum = Math.min(radius, Math.abs(x2)) + Math.min(radius, Math.abs(y));
  return sum < radius * 0.75;
}
function overlapBounding(a, b) {
  const aRight = a[0] + a[2];
  const aBottom = a[1] + a[3];
  const bRight = b[0] + b[2];
  const bBottom = b[1] + b[3];
  return a[0] > bRight || a[1] > bBottom || aRight < b[0] || aBottom < b[1] ? false : true;
}
function containsCentre(a, b) {
  const centreX = b[0] + b[2] * 0.5;
  const centreY = b[1] + b[3] * 0.5;
  return isInRect(centreX, centreY, a);
}
function containsRect(a, b) {
  const aRight = a[0] + a[2];
  const aBottom = a[1] + a[3];
  const bRight = b[0] + b[2];
  const bBottom = b[1] + b[3];
  const identical = a[0] === b[0] && a[1] === b[1] && aRight === bRight && aBottom === bBottom;
  return !identical && a[0] <= b[0] && a[1] <= b[1] && aRight >= bRight && aBottom >= bBottom;
}
function findPointOnCurve(out, a, b, controlA, controlB, t = 0.5) {
  const iT = 1 - t;
  const c1 = iT * iT * iT;
  const c2 = 3 * (iT * iT) * t;
  const c3 = 3 * iT * (t * t);
  const c4 = t * t * t;
  out[0] = c1 * a[0] + c2 * controlA[0] + c3 * controlB[0] + c4 * b[0];
  out[1] = c1 * a[1] + c2 * controlA[1] + c3 * controlB[1] + c4 * b[1];
}
function createBounds(objects, padding = 10) {
  const bounds = new Float32Array([Infinity, Infinity, -Infinity, -Infinity]);
  for (const obj of objects) {
    const rect = obj.boundingRect;
    bounds[0] = Math.min(bounds[0], rect[0]);
    bounds[1] = Math.min(bounds[1], rect[1]);
    bounds[2] = Math.max(bounds[2], rect[0] + rect[2]);
    bounds[3] = Math.max(bounds[3], rect[1] + rect[3]);
  }
  if (!bounds.every((x2) => isFinite(x2))) return null;
  return [
    bounds[0] - padding,
    bounds[1] - padding,
    bounds[2] - bounds[0] + 2 * padding,
    bounds[3] - bounds[1] + 2 * padding
  ];
}
function snapPoint(pos, snapTo) {
  if (!snapTo) return false;
  pos[0] = snapTo * Math.round(pos[0] / snapTo);
  pos[1] = snapTo * Math.round(pos[1] / snapTo);
  return true;
}
var CurveEditor = class {
  constructor(points) {
    __publicField(this, "points");
    __publicField(this, "selected");
    __publicField(this, "nearest");
    __publicField(this, "size");
    __publicField(this, "must_update");
    __publicField(this, "margin");
    __publicField(this, "_nearest");
    this.points = points;
    this.selected = -1;
    this.nearest = -1;
    this.size = null;
    this.must_update = true;
    this.margin = 5;
  }
  static sampleCurve(f, points) {
    if (!points) return;
    for (let i = 0; i < points.length - 1; ++i) {
      const p = points[i];
      const pn = points[i + 1];
      if (pn[0] < f) continue;
      const r = pn[0] - p[0];
      if (Math.abs(r) < 1e-5) return p[1];
      const local_f = (f - p[0]) / r;
      return p[1] * (1 - local_f) + pn[1] * local_f;
    }
    return 0;
  }
  draw(ctx, size, graphcanvas, background_color, line_color, inactive = false) {
    const points = this.points;
    if (!points) return;
    this.size = size;
    const w = size[0] - this.margin * 2;
    const h = size[1] - this.margin * 2;
    line_color = line_color || "#666";
    ctx.save();
    ctx.translate(this.margin, this.margin);
    if (background_color) {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#222";
      ctx.fillRect(w * 0.5, 0, 1, h);
      ctx.strokeStyle = "#333";
      ctx.strokeRect(0, 0, w, h);
    }
    ctx.strokeStyle = line_color;
    if (inactive) ctx.globalAlpha = 0.5;
    ctx.beginPath();
    for (const p of points) {
      ctx.lineTo(p[0] * w, (1 - p[1]) * h);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
    if (!inactive) {
      for (const [i, p] of points.entries()) {
        ctx.fillStyle = this.selected == i ? "#FFF" : this.nearest == i ? "#DDD" : "#AAA";
        ctx.beginPath();
        ctx.arc(p[0] * w, (1 - p[1]) * h, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
  // localpos is mouse in curve editor space
  onMouseDown(localpos, graphcanvas) {
    const points = this.points;
    if (!points) return;
    if (localpos[1] < 0) return;
    if (this.size == null) throw new Error("CurveEditor.size was null or undefined.");
    const w = this.size[0] - this.margin * 2;
    const h = this.size[1] - this.margin * 2;
    const x2 = localpos[0] - this.margin;
    const y = localpos[1] - this.margin;
    const pos = [x2, y];
    const max_dist = 30 / graphcanvas.ds.scale;
    this.selected = this.getCloserPoint(pos, max_dist);
    if (this.selected == -1) {
      const point = [x2 / w, 1 - y / h];
      points.push(point);
      points.sort(function(a, b) {
        return a[0] - b[0];
      });
      this.selected = points.indexOf(point);
      this.must_update = true;
    }
    if (this.selected != -1) return true;
  }
  onMouseMove(localpos, graphcanvas) {
    const points = this.points;
    if (!points) return;
    const s = this.selected;
    if (s < 0) return;
    if (this.size == null) throw new Error("CurveEditor.size was null or undefined.");
    const x2 = (localpos[0] - this.margin) / (this.size[0] - this.margin * 2);
    const y = (localpos[1] - this.margin) / (this.size[1] - this.margin * 2);
    const curvepos = [
      localpos[0] - this.margin,
      localpos[1] - this.margin
    ];
    const max_dist = 30 / graphcanvas.ds.scale;
    this._nearest = this.getCloserPoint(curvepos, max_dist);
    const point = points[s];
    if (point) {
      const is_edge_point = s == 0 || s == points.length - 1;
      if (!is_edge_point && (localpos[0] < -10 || localpos[0] > this.size[0] + 10 || localpos[1] < -10 || localpos[1] > this.size[1] + 10)) {
        points.splice(s, 1);
        this.selected = -1;
        return;
      }
      if (!is_edge_point) point[0] = clamp(x2, 0, 1);
      else point[0] = s == 0 ? 0 : 1;
      point[1] = 1 - clamp(y, 0, 1);
      points.sort(function(a, b) {
        return a[0] - b[0];
      });
      this.selected = points.indexOf(point);
      this.must_update = true;
    }
  }
  // Former params: localpos, graphcanvas
  onMouseUp() {
    this.selected = -1;
    return false;
  }
  getCloserPoint(pos, max_dist) {
    const points = this.points;
    if (!points) return -1;
    max_dist = max_dist || 30;
    if (this.size == null) throw new Error("CurveEditor.size was null or undefined.");
    const w = this.size[0] - this.margin * 2;
    const h = this.size[1] - this.margin * 2;
    const num = points.length;
    const p2 = [0, 0];
    let min_dist = 1e6;
    let closest = -1;
    for (let i = 0; i < num; ++i) {
      const p = points[i];
      p2[0] = p[0] * w;
      p2[1] = (1 - p[1]) * h;
      const dist = distance(pos, p2);
      if (dist > min_dist || dist > max_dist) continue;
      closest = i;
      min_dist = dist;
    }
    return closest;
  }
};
var DragAndScale = class {
  constructor(element) {
    /**
     * The state of this DragAndScale instance.
     *
     * Implemented as a POCO that can be proxied without side-effects.
     */
    __publicField(this, "state");
    /** Maximum scale (zoom in) */
    __publicField(this, "max_scale");
    /** Minimum scale (zoom out) */
    __publicField(this, "min_scale");
    __publicField(this, "enabled");
    __publicField(this, "last_mouse");
    __publicField(this, "element");
    __publicField(this, "visible_area");
    __publicField(this, "dragging");
    __publicField(this, "viewport");
    this.state = {
      offset: new Float32Array([0, 0]),
      scale: 1
    };
    this.max_scale = 10;
    this.min_scale = 0.1;
    this.enabled = true;
    this.last_mouse = [0, 0];
    this.visible_area = new Float32Array(4);
    this.element = element;
  }
  get offset() {
    return this.state.offset;
  }
  set offset(value) {
    this.state.offset = value;
  }
  get scale() {
    return this.state.scale;
  }
  set scale(value) {
    this.state.scale = value;
  }
  computeVisibleArea(viewport) {
    if (!this.element) {
      this.visible_area[0] = this.visible_area[1] = this.visible_area[2] = this.visible_area[3] = 0;
      return;
    }
    let width2 = this.element.width;
    let height = this.element.height;
    let startx = -this.offset[0];
    let starty = -this.offset[1];
    if (viewport) {
      startx += viewport[0] / this.scale;
      starty += viewport[1] / this.scale;
      width2 = viewport[2];
      height = viewport[3];
    }
    const endx = startx + width2 / this.scale;
    const endy = starty + height / this.scale;
    this.visible_area[0] = startx;
    this.visible_area[1] = starty;
    this.visible_area[2] = endx - startx;
    this.visible_area[3] = endy - starty;
  }
  toCanvasContext(ctx) {
    ctx.scale(this.scale, this.scale);
    ctx.translate(this.offset[0], this.offset[1]);
  }
  convertOffsetToCanvas(pos) {
    return [
      (pos[0] + this.offset[0]) * this.scale,
      (pos[1] + this.offset[1]) * this.scale
    ];
  }
  convertCanvasToOffset(pos, out) {
    out = out || [0, 0];
    out[0] = pos[0] / this.scale - this.offset[0];
    out[1] = pos[1] / this.scale - this.offset[1];
    return out;
  }
  /** @deprecated Has not been kept up to date */
  mouseDrag(x2, y) {
    var _a2;
    this.offset[0] += x2 / this.scale;
    this.offset[1] += y / this.scale;
    (_a2 = this.onredraw) == null ? void 0 : _a2.call(this, this);
  }
  changeScale(value, zooming_center) {
    var _a2;
    if (value < this.min_scale) {
      value = this.min_scale;
    } else if (value > this.max_scale) {
      value = this.max_scale;
    }
    if (value == this.scale) return;
    if (!this.element) return;
    const rect = this.element.getBoundingClientRect();
    if (!rect) return;
    zooming_center = zooming_center != null ? zooming_center : [rect.width * 0.5, rect.height * 0.5];
    const normalizedCenter = [
      zooming_center[0] - rect.x,
      zooming_center[1] - rect.y
    ];
    const center = this.convertCanvasToOffset(normalizedCenter);
    this.scale = value;
    if (Math.abs(this.scale - 1) < 0.01) this.scale = 1;
    const new_center = this.convertCanvasToOffset(normalizedCenter);
    const delta_offset = [
      new_center[0] - center[0],
      new_center[1] - center[1]
    ];
    this.offset[0] += delta_offset[0];
    this.offset[1] += delta_offset[1];
    (_a2 = this.onredraw) == null ? void 0 : _a2.call(this, this);
  }
  changeDeltaScale(value, zooming_center) {
    this.changeScale(this.scale * value, zooming_center);
  }
  /**
   * Starts an animation to fit the view around the specified selection of nodes.
   * @param bounds The bounds to animate the view to, defined by a rectangle.
   */
  animateToBounds(bounds, setDirty, {
    duration = 350,
    zoom = 0.75,
    easing = EaseFunction.EASE_IN_OUT_QUAD
  } = {}) {
    var _a2;
    if (!(duration > 0)) throw new RangeError("Duration must be greater than 0");
    const easeFunctions = {
      linear: (t) => t,
      easeInQuad: (t) => t * t,
      easeOutQuad: (t) => t * (2 - t),
      easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    };
    const easeFunction = (_a2 = easeFunctions[easing]) != null ? _a2 : easeFunctions.linear;
    const startTimestamp = performance.now();
    const cw = this.element.width / window.devicePixelRatio;
    const ch = this.element.height / window.devicePixelRatio;
    const startX = this.offset[0];
    const startY = this.offset[1];
    const startX2 = startX - cw / this.scale;
    const startY2 = startY - ch / this.scale;
    const startScale = this.scale;
    let targetScale = startScale;
    if (zoom > 0) {
      const targetScaleX = zoom * cw / Math.max(bounds[2], 300);
      const targetScaleY = zoom * ch / Math.max(bounds[3], 300);
      targetScale = Math.min(targetScaleX, targetScaleY, this.max_scale);
    }
    const scaledWidth = cw / targetScale;
    const scaledHeight = ch / targetScale;
    const targetX = -bounds[0] - bounds[2] * 0.5 + scaledWidth * 0.5;
    const targetY = -bounds[1] - bounds[3] * 0.5 + scaledHeight * 0.5;
    const targetX2 = targetX - scaledWidth;
    const targetY2 = targetY - scaledHeight;
    const animate = (timestamp) => {
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeFunction(progress);
      const currentX = startX + (targetX - startX) * easedProgress;
      const currentY = startY + (targetY - startY) * easedProgress;
      this.offset[0] = currentX;
      this.offset[1] = currentY;
      if (zoom > 0) {
        const currentX2 = startX2 + (targetX2 - startX2) * easedProgress;
        const currentY2 = startY2 + (targetY2 - startY2) * easedProgress;
        const currentWidth = Math.abs(currentX2 - currentX);
        const currentHeight = Math.abs(currentY2 - currentY);
        this.scale = Math.min(cw / currentWidth, ch / currentHeight);
      }
      setDirty();
      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationId);
      }
    };
    let animationId = requestAnimationFrame(animate);
  }
  reset() {
    this.scale = 1;
    this.offset[0] = 0;
    this.offset[1] = 0;
  }
};
var SlotType = /* @__PURE__ */ ((SlotType2) => {
  SlotType2["Array"] = "array";
  SlotType2[SlotType2["Event"] = -1] = "Event";
  return SlotType2;
})(SlotType || {});
var SlotShape = ((SlotShape2) => {
  SlotShape2[SlotShape2["Box"] = RenderShape.BOX] = "Box";
  SlotShape2[SlotShape2["Arrow"] = RenderShape.ARROW] = "Arrow";
  SlotShape2[SlotShape2["Grid"] = RenderShape.GRID] = "Grid";
  SlotShape2[SlotShape2["Circle"] = RenderShape.CIRCLE] = "Circle";
  SlotShape2[SlotShape2["HollowCircle"] = RenderShape.HollowCircle] = "HollowCircle";
  return SlotShape2;
})(SlotShape || {});
var SlotDirection = ((SlotDirection2) => {
  SlotDirection2[SlotDirection2["Up"] = LinkDirection.UP] = "Up";
  SlotDirection2[SlotDirection2["Right"] = LinkDirection.RIGHT] = "Right";
  SlotDirection2[SlotDirection2["Down"] = LinkDirection.DOWN] = "Down";
  SlotDirection2[SlotDirection2["Left"] = LinkDirection.LEFT] = "Left";
  return SlotDirection2;
})(SlotDirection || {});
var LabelPosition = /* @__PURE__ */ ((LabelPosition2) => {
  LabelPosition2["Left"] = "left";
  LabelPosition2["Right"] = "right";
  return LabelPosition2;
})(LabelPosition || {});
function strokeShape(ctx, area, {
  shape = RenderShape.BOX,
  round_radius,
  title_height,
  title_mode = TitleMode.NORMAL_TITLE,
  color,
  padding = 6,
  collapsed = false,
  lineWidth: thickness = 1
} = {}) {
  round_radius != null ? round_radius : round_radius = LiteGraph.ROUND_RADIUS;
  color != null ? color : color = LiteGraph.NODE_BOX_OUTLINE_COLOR;
  if (title_mode === TitleMode.TRANSPARENT_TITLE) {
    const height2 = title_height != null ? title_height : LiteGraph.NODE_TITLE_HEIGHT;
    area[1] -= height2;
    area[3] += height2;
  }
  const { lineWidth, strokeStyle } = ctx;
  ctx.lineWidth = thickness;
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = color;
  ctx.beginPath();
  const [x2, y, width2, height] = area;
  switch (shape) {
    case RenderShape.BOX: {
      ctx.rect(
        x2 - padding,
        y - padding,
        width2 + 2 * padding,
        height + 2 * padding
      );
      break;
    }
    case RenderShape.ROUND:
    case RenderShape.CARD: {
      const radius = round_radius + padding;
      const isCollapsed = shape === RenderShape.CARD && collapsed;
      const cornerRadii = isCollapsed || shape === RenderShape.ROUND ? [radius] : [radius, 2, radius, 2];
      ctx.roundRect(
        x2 - padding,
        y - padding,
        width2 + 2 * padding,
        height + 2 * padding,
        cornerRadii
      );
      break;
    }
    case RenderShape.CIRCLE: {
      const centerX = x2 + width2 / 2;
      const centerY = y + height / 2;
      const radius = Math.max(width2, height) / 2 + padding;
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      break;
    }
  }
  ctx.stroke();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.globalAlpha = 1;
}
var zeroUuid = "00000000-0000-0000-0000-000000000000";
var randomStorage = new Uint32Array(31);
function createUuidv4() {
  if (typeof (crypto == null ? void 0 : crypto.randomUUID) === "function") return crypto.randomUUID();
  if (typeof (crypto == null ? void 0 : crypto.getRandomValues) === "function") {
    const random = crypto.getRandomValues(randomStorage);
    let i = 0;
    return "10000000-1000-4000-8000-100000000000".replaceAll(/[018]/g, (a) => (Number(a) ^ random[i++] * 3725290298461914e-24 >> Number(a) * 0.25).toString(16));
  }
  return "10000000-1000-4000-8000-100000000000".replaceAll(/[018]/g, (a) => (Number(a) ^ Math.random() * 16 >> Number(a) * 0.25).toString(16));
}
var LinkConnectorEventTarget = class extends EventTarget {
  dispatch(type, detail) {
    const event = new CustomEvent(type, { detail });
    return super.dispatchEvent(event);
  }
  addEventListener(type, listener, options22) {
    super.addEventListener(type, listener, options22);
  }
  removeEventListener(type, listener, options22) {
    super.removeEventListener(type, listener, options22);
  }
  /** @deprecated Use {@link dispatch}. */
  dispatchEvent(event) {
    return super.dispatchEvent(event);
  }
};
var _color;
var _LLink = class _LLink {
  constructor(id, type, origin_id, origin_slot, target_id, target_slot, parentId) {
    /** Link ID */
    __publicField(this, "id");
    __publicField(this, "parentId");
    __publicField(this, "type");
    /** Output node ID */
    __publicField(this, "origin_id");
    /** Output slot index */
    __publicField(this, "origin_slot");
    /** Input node ID */
    __publicField(this, "target_id");
    /** Input slot index */
    __publicField(this, "target_slot");
    __publicField(this, "data");
    __publicField(this, "_data");
    /** Centre point of the link, calculated during render only - can be inaccurate */
    __publicField(this, "_pos");
    /** @todo Clean up - never implemented in comfy. */
    __publicField(this, "_last_time");
    /** The last canvas 2D path that was used to render this link */
    __publicField(this, "path");
    /** @inheritdoc */
    __publicField(this, "_centreAngle");
    /** @inheritdoc */
    __publicField(this, "_dragging");
    __privateAdd(this, _color);
    this.id = id;
    this.type = type;
    this.origin_id = origin_id;
    this.origin_slot = origin_slot;
    this.target_id = target_id;
    this.target_slot = target_slot;
    this.parentId = parentId;
    this._data = null;
    this._pos = new Float32Array(2);
  }
  /** Custom colour for this link only */
  get color() {
    return __privateGet(this, _color);
  }
  set color(value) {
    __privateSet(this, _color, value === "" ? null : value);
  }
  get isFloatingOutput() {
    return this.origin_id === -1 && this.origin_slot === -1;
  }
  get isFloatingInput() {
    return this.target_id === -1 && this.target_slot === -1;
  }
  get isFloating() {
    return this.isFloatingOutput || this.isFloatingInput;
  }
  /** @deprecated Use {@link LLink.create} */
  static createFromArray(data) {
    return new _LLink(data[0], data[5], data[1], data[2], data[3], data[4]);
  }
  /**
   * LLink static factory: creates a new LLink from the provided data.
   * @param data Serialised LLink data to create the link from
   * @returns A new LLink
   */
  static create(data) {
    return new _LLink(
      data.id,
      data.type,
      data.origin_id,
      data.origin_slot,
      data.target_id,
      data.target_slot,
      data.parentId
    );
  }
  /**
   * Gets all reroutes from the output slot to this segment.  If this segment is a reroute, it will not be included.
   * @returns An ordered array of all reroutes from the node output to
   * this reroute or the reroute before it.  Otherwise, an empty array.
   */
  static getReroutes(network, linkSegment) {
    var _a2, _b;
    if (!linkSegment.parentId) return [];
    return (_b = (_a2 = network.reroutes.get(linkSegment.parentId)) == null ? void 0 : _a2.getReroutes()) != null ? _b : [];
  }
  static getFirstReroute(network, linkSegment) {
    return _LLink.getReroutes(network, linkSegment).at(0);
  }
  /**
   * Finds the reroute in the chain after the provided reroute ID.
   * @param network The network this link belongs to
   * @param linkSegment The starting point of the search (input side).
   * Typically the LLink object itself, but can be any link segment.
   * @param rerouteId The matching reroute will have this set as its {@link parentId}.
   * @returns The reroute that was found, `undefined` if no reroute was found, or `null` if an infinite loop was detected.
   */
  static findNextReroute(network, linkSegment, rerouteId) {
    var _a2;
    if (!linkSegment.parentId) return;
    return (_a2 = network.reroutes.get(linkSegment.parentId)) == null ? void 0 : _a2.findNextReroute(rerouteId);
  }
  configure(o) {
    if (Array.isArray(o)) {
      this.id = o[0];
      this.origin_id = o[1];
      this.origin_slot = o[2];
      this.target_id = o[3];
      this.target_slot = o[4];
      this.type = o[5];
    } else {
      this.id = o.id;
      this.type = o.type;
      this.origin_id = o.origin_id;
      this.origin_slot = o.origin_slot;
      this.target_id = o.target_id;
      this.target_slot = o.target_slot;
      this.parentId = o.parentId;
    }
  }
  /**
   * Checks if the specified node id and output index are this link's origin (output side).
   * @param nodeId ID of the node to check
   * @param outputIndex The array index of the node output
   * @returns `true` if the origin matches, otherwise `false`.
   */
  hasOrigin(nodeId, outputIndex) {
    return this.origin_id === nodeId && this.origin_slot === outputIndex;
  }
  /**
   * Checks if the specified node id and input index are this link's target (input side).
   * @param nodeId ID of the node to check
   * @param inputIndex The array index of the node input
   * @returns `true` if the target matches, otherwise `false`.
   */
  hasTarget(nodeId, inputIndex) {
    return this.target_id === nodeId && this.target_slot === inputIndex;
  }
  /**
   * Creates a floating link from this link.
   * @param slotType The side of the link that is still connected
   * @param parentId The parent reroute ID of the link
   * @returns A new LLink that is floating
   */
  toFloating(slotType, parentId) {
    const exported = this.asSerialisable();
    exported.id = -1;
    exported.parentId = parentId;
    if (slotType === "input") {
      exported.origin_id = -1;
      exported.origin_slot = -1;
    } else {
      exported.target_id = -1;
      exported.target_slot = -1;
    }
    return _LLink.create(exported);
  }
  /**
   * Disconnects a link and removes it from the graph, cleaning up any reroutes that are no longer used
   * @param network The container (LGraph) where reroutes should be updated
   * @param keepReroutes If `undefined`, reroutes will be automatically removed if no links remain.
   * If `input` or `output`, reroutes will not be automatically removed, and retain a connection to the input or output, respectively.
   */
  disconnect(network, keepReroutes) {
    const reroutes = _LLink.getReroutes(network, this);
    const lastReroute = reroutes.at(-1);
    const outputFloating = keepReroutes === "output" && (lastReroute == null ? void 0 : lastReroute.linkIds.size) === 1 && lastReroute.floatingLinkIds.size === 0;
    if (outputFloating || keepReroutes === "input" && lastReroute) {
      const newLink = _LLink.create(this);
      newLink.id = -1;
      if (keepReroutes === "input") {
        newLink.origin_id = -1;
        newLink.origin_slot = -1;
        lastReroute.floating = { slotType: "input" };
      } else {
        newLink.target_id = -1;
        newLink.target_slot = -1;
        lastReroute.floating = { slotType: "output" };
      }
      network.addFloatingLink(newLink);
    }
    for (const reroute of reroutes) {
      reroute.linkIds.delete(this.id);
      if (!keepReroutes && !reroute.totalLinks) {
        network.reroutes.delete(reroute.id);
      }
    }
    network.links.delete(this.id);
  }
  /**
   * @deprecated Prefer {@link LLink.asSerialisable} (returns an object, not an array)
   * @returns An array representing this LLink
   */
  serialize() {
    return [
      this.id,
      this.origin_id,
      this.origin_slot,
      this.target_id,
      this.target_slot,
      this.type
    ];
  }
  asSerialisable() {
    const copy = {
      id: this.id,
      origin_id: this.origin_id,
      origin_slot: this.origin_slot,
      target_id: this.target_id,
      target_slot: this.target_slot,
      type: this.type
    };
    if (this.parentId) copy.parentId = this.parentId;
    return copy;
  }
};
_color = new WeakMap();
var LLink = _LLink;
var FloatingRenderLink = class {
  constructor(network, link2, toType, fromReroute, dragDirection = LinkDirection.CENTER) {
    __publicField(this, "node");
    __publicField(this, "fromSlot");
    __publicField(this, "fromPos");
    __publicField(this, "fromDirection");
    __publicField(this, "fromSlotIndex");
    __publicField(this, "outputNodeId", -1);
    __publicField(this, "outputNode");
    __publicField(this, "outputSlot");
    __publicField(this, "outputIndex", -1);
    __publicField(this, "outputPos");
    __publicField(this, "inputNodeId", -1);
    __publicField(this, "inputNode");
    __publicField(this, "inputSlot");
    __publicField(this, "inputIndex", -1);
    __publicField(this, "inputPos");
    var _a2, _b, _c;
    this.network = network;
    this.link = link2;
    this.toType = toType;
    this.fromReroute = fromReroute;
    this.dragDirection = dragDirection;
    const {
      origin_id: outputNodeId,
      target_id: inputNodeId,
      origin_slot: outputIndex,
      target_slot: inputIndex
    } = link2;
    if (outputNodeId !== -1) {
      const outputNode = (_a2 = network.getNodeById(outputNodeId)) != null ? _a2 : void 0;
      if (!outputNode) throw new Error(`Creating DraggingRenderLink for link [${link2.id}] failed: Output node [${outputNodeId}] not found.`);
      const outputSlot = outputNode == null ? void 0 : outputNode.outputs.at(outputIndex);
      if (!outputSlot) throw new Error(`Creating DraggingRenderLink for link [${link2.id}] failed: Output slot [${outputIndex}] not found.`);
      this.outputNodeId = outputNodeId;
      this.outputNode = outputNode;
      this.outputSlot = outputSlot;
      this.outputIndex = outputIndex;
      this.outputPos = outputNode.getOutputPos(outputIndex);
      this.node = outputNode;
      this.fromSlot = outputSlot;
      this.fromPos = (_b = fromReroute == null ? void 0 : fromReroute.pos) != null ? _b : this.outputPos;
      this.fromDirection = LinkDirection.LEFT;
      this.dragDirection = LinkDirection.RIGHT;
      this.fromSlotIndex = outputIndex;
    } else {
      const inputNode = (_c = network.getNodeById(inputNodeId)) != null ? _c : void 0;
      if (!inputNode) throw new Error(`Creating DraggingRenderLink for link [${link2.id}] failed: Input node [${inputNodeId}] not found.`);
      const inputSlot = inputNode == null ? void 0 : inputNode.inputs.at(inputIndex);
      if (!inputSlot) throw new Error(`Creating DraggingRenderLink for link [${link2.id}] failed: Input slot [${inputIndex}] not found.`);
      this.inputNodeId = inputNodeId;
      this.inputNode = inputNode;
      this.inputSlot = inputSlot;
      this.inputIndex = inputIndex;
      this.inputPos = inputNode.getInputPos(inputIndex);
      this.node = inputNode;
      this.fromSlot = inputSlot;
      this.fromDirection = LinkDirection.RIGHT;
      this.fromSlotIndex = inputIndex;
    }
    this.fromPos = fromReroute.pos;
  }
  canConnectToInput() {
    return this.toType === "input";
  }
  canConnectToOutput() {
    return this.toType === "output";
  }
  canConnectToReroute(reroute) {
    var _a2, _b;
    if (this.toType === "input") {
      if (reroute.origin_id === ((_a2 = this.inputNode) == null ? void 0 : _a2.id)) return false;
    } else {
      if (reroute.origin_id === ((_b = this.outputNode) == null ? void 0 : _b.id)) return false;
    }
    return true;
  }
  connectToInput(node2, input, _events) {
    var _a2, _b;
    const floatingLink = this.link;
    floatingLink.target_id = node2.id;
    floatingLink.target_slot = node2.inputs.indexOf(input);
    node2.disconnectInput(node2.inputs.indexOf(input));
    (_a2 = this.fromSlot._floatingLinks) == null ? void 0 : _a2.delete(floatingLink);
    (_b = input._floatingLinks) != null ? _b : input._floatingLinks = /* @__PURE__ */ new Set();
    input._floatingLinks.add(floatingLink);
  }
  connectToOutput(node2, output, _events) {
    var _a2, _b;
    const floatingLink = this.link;
    floatingLink.origin_id = node2.id;
    floatingLink.origin_slot = node2.outputs.indexOf(output);
    (_a2 = this.fromSlot._floatingLinks) == null ? void 0 : _a2.delete(floatingLink);
    (_b = output._floatingLinks) != null ? _b : output._floatingLinks = /* @__PURE__ */ new Set();
    output._floatingLinks.add(floatingLink);
  }
  connectToRerouteInput(reroute, { node: inputNode, input }, events) {
    var _a2, _b;
    const floatingLink = this.link;
    floatingLink.target_id = inputNode.id;
    floatingLink.target_slot = inputNode.inputs.indexOf(input);
    (_a2 = this.fromSlot._floatingLinks) == null ? void 0 : _a2.delete(floatingLink);
    (_b = input._floatingLinks) != null ? _b : input._floatingLinks = /* @__PURE__ */ new Set();
    input._floatingLinks.add(floatingLink);
    events.dispatch("input-moved", this);
  }
  connectToRerouteOutput(reroute, outputNode, output, events) {
    var _a2, _b;
    const floatingLink = this.link;
    floatingLink.origin_id = outputNode.id;
    floatingLink.origin_slot = outputNode.outputs.indexOf(output);
    (_a2 = this.fromSlot._floatingLinks) == null ? void 0 : _a2.delete(floatingLink);
    (_b = output._floatingLinks) != null ? _b : output._floatingLinks = /* @__PURE__ */ new Set();
    output._floatingLinks.add(floatingLink);
    events.dispatch("output-moved", this);
  }
};
var MovingLinkBase = class {
  constructor(network, link2, toType, fromReroute, dragDirection = LinkDirection.CENTER) {
    __publicField(this, "outputNodeId");
    __publicField(this, "outputNode");
    __publicField(this, "outputSlot");
    __publicField(this, "outputIndex");
    __publicField(this, "outputPos");
    __publicField(this, "inputNodeId");
    __publicField(this, "inputNode");
    __publicField(this, "inputSlot");
    __publicField(this, "inputIndex");
    __publicField(this, "inputPos");
    var _a2, _b;
    this.network = network;
    this.link = link2;
    this.toType = toType;
    this.fromReroute = fromReroute;
    this.dragDirection = dragDirection;
    const {
      origin_id: outputNodeId,
      target_id: inputNodeId,
      origin_slot: outputIndex,
      target_slot: inputIndex
    } = link2;
    const outputNode = (_a2 = network.getNodeById(outputNodeId)) != null ? _a2 : void 0;
    if (!outputNode) throw new Error(`Creating MovingRenderLink for link [${link2.id}] failed: Output node [${outputNodeId}] not found.`);
    const outputSlot = outputNode.outputs.at(outputIndex);
    if (!outputSlot) throw new Error(`Creating MovingRenderLink for link [${link2.id}] failed: Output slot [${outputIndex}] not found.`);
    this.outputNodeId = outputNodeId;
    this.outputNode = outputNode;
    this.outputSlot = outputSlot;
    this.outputIndex = outputIndex;
    this.outputPos = outputNode.getOutputPos(outputIndex);
    const inputNode = (_b = network.getNodeById(inputNodeId)) != null ? _b : void 0;
    if (!inputNode) throw new Error(`Creating DraggingRenderLink for link [${link2.id}] failed: Input node [${inputNodeId}] not found.`);
    const inputSlot = inputNode.inputs.at(inputIndex);
    if (!inputSlot) throw new Error(`Creating DraggingRenderLink for link [${link2.id}] failed: Input slot [${inputIndex}] not found.`);
    this.inputNodeId = inputNodeId;
    this.inputNode = inputNode;
    this.inputSlot = inputSlot;
    this.inputIndex = inputIndex;
    this.inputPos = inputNode.getInputPos(inputIndex);
  }
};
var MovingInputLink = class extends MovingLinkBase {
  constructor(network, link2, fromReroute, dragDirection = LinkDirection.CENTER) {
    var _a2;
    super(network, link2, "input", fromReroute, dragDirection);
    __publicField(this, "toType", "input");
    __publicField(this, "node");
    __publicField(this, "fromSlot");
    __publicField(this, "fromPos");
    __publicField(this, "fromDirection");
    __publicField(this, "fromSlotIndex");
    this.node = this.outputNode;
    this.fromSlot = this.outputSlot;
    this.fromPos = (_a2 = fromReroute == null ? void 0 : fromReroute.pos) != null ? _a2 : this.outputPos;
    this.fromDirection = LinkDirection.NONE;
    this.fromSlotIndex = this.outputIndex;
  }
  canConnectToInput(inputNode, input) {
    return this.node.canConnectTo(inputNode, input, this.outputSlot);
  }
  canConnectToOutput() {
    return false;
  }
  canConnectToReroute(reroute) {
    return reroute.origin_id !== this.inputNode.id;
  }
  connectToInput(inputNode, input, events) {
    var _a2;
    if (input === this.inputSlot) return;
    this.inputNode.disconnectInput(this.inputIndex, true);
    const link2 = this.outputNode.connectSlots(this.outputSlot, inputNode, input, (_a2 = this.fromReroute) == null ? void 0 : _a2.id);
    if (link2) events.dispatch("input-moved", this);
    return link2;
  }
  connectToOutput() {
    throw new Error("MovingInputLink cannot connect to an output.");
  }
  connectToRerouteInput(reroute, { node: inputNode, input, link: existingLink }, events, originalReroutes) {
    const { outputNode, outputSlot, fromReroute } = this;
    for (const reroute2 of originalReroutes) {
      if (reroute2.id === this.link.parentId) break;
      if (reroute2.totalLinks === 1) reroute2.remove();
    }
    reroute.parentId = fromReroute == null ? void 0 : fromReroute.id;
    const newLink = outputNode.connectSlots(outputSlot, inputNode, input, existingLink.parentId);
    if (newLink) events.dispatch("input-moved", this);
  }
  connectToRerouteOutput() {
    throw new Error("MovingInputLink cannot connect to an output.");
  }
};
var MovingOutputLink = class extends MovingLinkBase {
  constructor(network, link2, fromReroute, dragDirection = LinkDirection.CENTER) {
    var _a2;
    super(network, link2, "output", fromReroute, dragDirection);
    __publicField(this, "toType", "output");
    __publicField(this, "node");
    __publicField(this, "fromSlot");
    __publicField(this, "fromPos");
    __publicField(this, "fromDirection");
    __publicField(this, "fromSlotIndex");
    this.node = this.inputNode;
    this.fromSlot = this.inputSlot;
    this.fromPos = (_a2 = fromReroute == null ? void 0 : fromReroute.pos) != null ? _a2 : this.inputPos;
    this.fromDirection = LinkDirection.LEFT;
    this.fromSlotIndex = this.inputIndex;
  }
  canConnectToInput() {
    return false;
  }
  canConnectToOutput(outputNode, output) {
    return outputNode.canConnectTo(this.node, this.inputSlot, output);
  }
  canConnectToReroute(reroute) {
    return reroute.origin_id !== this.outputNode.id;
  }
  connectToInput() {
    throw new Error("MovingOutputLink cannot connect to an input.");
  }
  connectToOutput(outputNode, output, events) {
    if (output === this.outputSlot) return;
    const link2 = outputNode.connectSlots(output, this.inputNode, this.inputSlot, this.link.parentId);
    if (link2) events.dispatch("output-moved", this);
    return link2;
  }
  connectToRerouteInput() {
    throw new Error("MovingOutputLink cannot connect to an input.");
  }
  connectToRerouteOutput(reroute, outputNode, output, events) {
    var _a2;
    const { inputNode, inputSlot, fromReroute } = this;
    const floatingTerminus = ((_a2 = reroute == null ? void 0 : reroute.floating) == null ? void 0 : _a2.slotType) === "output";
    if (fromReroute) {
      fromReroute.parentId = reroute.id;
    } else {
      this.link.parentId = reroute.id;
    }
    outputNode.connectSlots(output, inputNode, inputSlot, this.link.parentId);
    if (floatingTerminus) reroute.removeAllFloatingLinks();
    events.dispatch("output-moved", this);
  }
};
var ToInputRenderLink = class {
  constructor(network, node2, fromSlot, fromReroute, dragDirection = LinkDirection.CENTER) {
    __publicField(this, "toType", "input");
    __publicField(this, "fromPos");
    __publicField(this, "fromSlotIndex");
    __publicField(this, "fromDirection", LinkDirection.RIGHT);
    this.network = network;
    this.node = node2;
    this.fromSlot = fromSlot;
    this.fromReroute = fromReroute;
    this.dragDirection = dragDirection;
    const outputIndex = node2.outputs.indexOf(fromSlot);
    if (outputIndex === -1) throw new Error(`Creating render link for node [${this.node.id}] failed: Slot index not found.`);
    this.fromSlotIndex = outputIndex;
    this.fromPos = fromReroute ? fromReroute.pos : this.node.getOutputPos(outputIndex);
  }
  canConnectToInput(inputNode, input) {
    return this.node.canConnectTo(inputNode, input, this.fromSlot);
  }
  canConnectToOutput() {
    return false;
  }
  connectToInput(node2, input, events) {
    const { node: outputNode, fromSlot, fromReroute } = this;
    if (node2 === outputNode) return;
    const newLink = outputNode.connectSlots(fromSlot, node2, input, fromReroute == null ? void 0 : fromReroute.id);
    events.dispatch("link-created", newLink);
  }
  connectToRerouteInput(reroute, {
    node: inputNode,
    input,
    link: existingLink
  }, events, originalReroutes) {
    var _a2;
    const { node: outputNode, fromSlot, fromReroute } = this;
    const floatingTerminus = ((_a2 = fromReroute == null ? void 0 : fromReroute.floating) == null ? void 0 : _a2.slotType) === "output";
    reroute.parentId = fromReroute == null ? void 0 : fromReroute.id;
    const newLink = outputNode.connectSlots(fromSlot, inputNode, input, existingLink.parentId);
    if (floatingTerminus) fromReroute.removeAllFloatingLinks();
    for (const reroute2 of originalReroutes) {
      if (reroute2.id === (fromReroute == null ? void 0 : fromReroute.id)) break;
      reroute2.removeLink(existingLink);
      if (reroute2.totalLinks === 0) {
        if (existingLink.isFloating) {
          reroute2.remove();
        } else {
          const cl = existingLink.toFloating("output", reroute2.id);
          this.network.addFloatingLink(cl);
          reroute2.floating = { slotType: "output" };
        }
      }
    }
    events.dispatch("link-created", newLink);
  }
  connectToOutput() {
    throw new Error("ToInputRenderLink cannot connect to an output.");
  }
  connectToRerouteOutput() {
    throw new Error("ToInputRenderLink cannot connect to an output.");
  }
};
var ToOutputRenderLink = class {
  constructor(network, node2, fromSlot, fromReroute, dragDirection = LinkDirection.CENTER) {
    __publicField(this, "toType", "output");
    __publicField(this, "fromPos");
    __publicField(this, "fromSlotIndex");
    __publicField(this, "fromDirection", LinkDirection.LEFT);
    this.network = network;
    this.node = node2;
    this.fromSlot = fromSlot;
    this.fromReroute = fromReroute;
    this.dragDirection = dragDirection;
    const inputIndex = node2.inputs.indexOf(fromSlot);
    if (inputIndex === -1) throw new Error(`Creating render link for node [${this.node.id}] failed: Slot index not found.`);
    this.fromSlotIndex = inputIndex;
    this.fromPos = fromReroute ? fromReroute.pos : this.node.getInputPos(inputIndex);
  }
  canConnectToInput() {
    return false;
  }
  canConnectToOutput(outputNode, output) {
    return this.node.canConnectTo(outputNode, this.fromSlot, output);
  }
  canConnectToReroute(reroute) {
    if (reroute.origin_id === this.node.id) return false;
    return true;
  }
  connectToOutput(node2, output, events) {
    const { node: inputNode, fromSlot, fromReroute } = this;
    if (!inputNode) return;
    const newLink = node2.connectSlots(output, inputNode, fromSlot, fromReroute == null ? void 0 : fromReroute.id);
    events.dispatch("link-created", newLink);
  }
  connectToRerouteOutput(reroute, outputNode, output, events) {
    const { node: inputNode, fromSlot } = this;
    const newLink = outputNode.connectSlots(output, inputNode, fromSlot, reroute == null ? void 0 : reroute.id);
    events.dispatch("link-created", newLink);
  }
  connectToInput() {
    throw new Error("ToOutputRenderLink cannot connect to an input.");
  }
  connectToRerouteInput() {
    throw new Error("ToOutputRenderLink cannot connect to an input.");
  }
};
var _setConnectingLinks, _LinkConnector_instances, dropOnNodeBackground_fn, dropOnInput_fn, dropOnOutput_fn, setLegacyLinks_fn;
var LinkConnector = class {
  constructor(setConnectingLinks) {
    __privateAdd(this, _LinkConnector_instances);
    /**
     * Link connection state POJO. Source of truth for state of link drag operations.
     *
     * Can be replaced or proxied to allow notifications.
     * Is always dereferenced at the start of an operation.
     */
    __publicField(this, "state", {
      connectingTo: void 0,
      multi: false,
      draggingExistingLinks: false
    });
    __publicField(this, "events", new LinkConnectorEventTarget());
    /** Contains information for rendering purposes only. */
    __publicField(this, "renderLinks", []);
    /** Existing links that are being moved **to** a new input slot. */
    __publicField(this, "inputLinks", []);
    /** Existing links that are being moved **to** a new output slot. */
    __publicField(this, "outputLinks", []);
    /** Existing floating links that are being moved to a new slot. */
    __publicField(this, "floatingLinks", []);
    __publicField(this, "hiddenReroutes", /* @__PURE__ */ new Set());
    /** The widget beneath the pointer, if it is a valid connection target. */
    __publicField(this, "overWidget");
    /** The type (returned by downstream callback) for {@link overWidget} */
    __publicField(this, "overWidgetType");
    /** The reroute beneath the pointer, if it is a valid connection target. */
    __publicField(this, "overReroute");
    __privateAdd(this, _setConnectingLinks);
    __privateSet(this, _setConnectingLinks, setConnectingLinks);
  }
  get isConnecting() {
    return this.state.connectingTo !== void 0;
  }
  get draggingExistingLinks() {
    return this.state.draggingExistingLinks;
  }
  /** Drag an existing link to a different input. */
  moveInputLink(network, input) {
    var _a2;
    if (this.isConnecting) throw new Error("Already dragging links.");
    const { state, inputLinks, renderLinks } = this;
    const linkId = input.link;
    if (linkId == null) {
      const floatingLink = (_a2 = input._floatingLinks) == null ? void 0 : _a2.values().next().value;
      if ((floatingLink == null ? void 0 : floatingLink.parentId) == null) return;
      try {
        const reroute = network.reroutes.get(floatingLink.parentId);
        if (!reroute) throw new Error(`Invalid reroute id: [${floatingLink.parentId}] for floating link id: [${floatingLink.id}].`);
        const renderLink = new FloatingRenderLink(network, floatingLink, "input", reroute);
        const mayContinue = this.events.dispatch("before-move-input", renderLink);
        if (mayContinue === false) return;
        renderLinks.push(renderLink);
      } catch (error) {
        console.warn(`Could not create render link for link id: [${floatingLink.id}].`, floatingLink, error);
      }
      floatingLink._dragging = true;
      this.floatingLinks.push(floatingLink);
    } else {
      const link2 = network.links.get(linkId);
      if (!link2) return;
      try {
        const reroute = network.getReroute(link2.parentId);
        const renderLink = new MovingInputLink(network, link2, reroute);
        const mayContinue = this.events.dispatch("before-move-input", renderLink);
        if (mayContinue === false) return;
        renderLinks.push(renderLink);
        this.listenUntilReset("input-moved", (e2) => {
          e2.detail.link.disconnect(network, "output");
        });
      } catch (error) {
        console.warn(`Could not create render link for link id: [${link2.id}].`, link2, error);
        return;
      }
      link2._dragging = true;
      inputLinks.push(link2);
    }
    state.connectingTo = "input";
    state.draggingExistingLinks = true;
    __privateMethod(this, _LinkConnector_instances, setLegacyLinks_fn).call(this, false);
  }
  /** Drag all links from an output to a new output. */
  moveOutputLink(network, output) {
    var _a2, _b;
    if (this.isConnecting) throw new Error("Already dragging links.");
    const { state, renderLinks } = this;
    if ((_a2 = output._floatingLinks) == null ? void 0 : _a2.size) {
      for (const floatingLink of output._floatingLinks.values()) {
        try {
          const reroute = LLink.getFirstReroute(network, floatingLink);
          if (!reroute) throw new Error(`Invalid reroute id: [${floatingLink.parentId}] for floating link id: [${floatingLink.id}].`);
          const renderLink = new FloatingRenderLink(network, floatingLink, "output", reroute);
          const mayContinue = this.events.dispatch("before-move-output", renderLink);
          if (mayContinue === false) continue;
          renderLinks.push(renderLink);
          this.floatingLinks.push(floatingLink);
        } catch (error) {
          console.warn(`Could not create render link for link id: [${floatingLink.id}].`, floatingLink, error);
        }
      }
    }
    if ((_b = output.links) == null ? void 0 : _b.length) {
      for (const linkId of output.links) {
        const link2 = network.links.get(linkId);
        if (!link2) continue;
        const firstReroute = LLink.getFirstReroute(network, link2);
        if (firstReroute) {
          firstReroute._dragging = true;
          this.hiddenReroutes.add(firstReroute);
        } else {
          link2._dragging = true;
        }
        this.outputLinks.push(link2);
        try {
          const renderLink = new MovingOutputLink(network, link2, firstReroute, LinkDirection.RIGHT);
          const mayContinue = this.events.dispatch("before-move-output", renderLink);
          if (mayContinue === false) continue;
          renderLinks.push(renderLink);
        } catch (error) {
          console.warn(`Could not create render link for link id: [${link2.id}].`, link2, error);
          continue;
        }
      }
    }
    if (renderLinks.length === 0) return this.reset();
    state.draggingExistingLinks = true;
    state.multi = true;
    state.connectingTo = "output";
    __privateMethod(this, _LinkConnector_instances, setLegacyLinks_fn).call(this, true);
  }
  /**
   * Drags a new link from an output slot to an input slot.
   * @param network The network that the link being connected belongs to
   * @param node The node the link is being dragged from
   * @param output The output slot that the link is being dragged from
   */
  dragNewFromOutput(network, node2, output, fromReroute) {
    if (this.isConnecting) throw new Error("Already dragging links.");
    const { state } = this;
    const renderLink = new ToInputRenderLink(network, node2, output, fromReroute);
    this.renderLinks.push(renderLink);
    state.connectingTo = "input";
    __privateMethod(this, _LinkConnector_instances, setLegacyLinks_fn).call(this, false);
  }
  /**
   * Drags a new link from an input slot to an output slot.
   * @param network The network that the link being connected belongs to
   * @param node The node the link is being dragged from
   * @param input The input slot that the link is being dragged from
   */
  dragNewFromInput(network, node2, input, fromReroute) {
    if (this.isConnecting) throw new Error("Already dragging links.");
    const { state } = this;
    const renderLink = new ToOutputRenderLink(network, node2, input, fromReroute);
    this.renderLinks.push(renderLink);
    state.connectingTo = "output";
    __privateMethod(this, _LinkConnector_instances, setLegacyLinks_fn).call(this, true);
  }
  /**
   * Drags a new link from a reroute to an input slot.
   * @param network The network that the link being connected belongs to
   * @param reroute The reroute that the link is being dragged from
   */
  dragFromReroute(network, reroute) {
    var _a2;
    if (this.isConnecting) throw new Error("Already dragging links.");
    const link2 = (_a2 = reroute.firstLink) != null ? _a2 : reroute.firstFloatingLink;
    if (!link2) return;
    const outputNode = network.getNodeById(link2.origin_id);
    if (!outputNode) return;
    const outputSlot = outputNode.outputs.at(link2.origin_slot);
    if (!outputSlot) return;
    const renderLink = new ToInputRenderLink(network, outputNode, outputSlot, reroute);
    renderLink.fromDirection = LinkDirection.NONE;
    this.renderLinks.push(renderLink);
    this.state.connectingTo = "input";
    __privateMethod(this, _LinkConnector_instances, setLegacyLinks_fn).call(this, false);
  }
  dragFromLinkSegment(network, linkSegment) {
    if (this.isConnecting) throw new Error("Already dragging links.");
    const { state } = this;
    if (linkSegment.origin_id == null || linkSegment.origin_slot == null) return;
    const node2 = network.getNodeById(linkSegment.origin_id);
    if (!node2) return;
    const slot = node2.outputs.at(linkSegment.origin_slot);
    if (!slot) return;
    const reroute = network.getReroute(linkSegment.parentId);
    const renderLink = new ToInputRenderLink(network, node2, slot, reroute);
    renderLink.fromDirection = LinkDirection.NONE;
    this.renderLinks.push(renderLink);
    state.connectingTo = "input";
    __privateMethod(this, _LinkConnector_instances, setLegacyLinks_fn).call(this, false);
  }
  /**
   * Connects the links being droppe
   * @param event Contains the drop location, in canvas space
   */
  dropLinks(locator, event) {
    var _a2;
    if (!this.isConnecting) return this.reset();
    const { renderLinks } = this;
    const mayContinue = this.events.dispatch("before-drop-links", { renderLinks, event });
    if (mayContinue === false) return this.reset();
    const { canvasX, canvasY } = event;
    const node2 = (_a2 = locator.getNodeOnPos(canvasX, canvasY)) != null ? _a2 : void 0;
    if (node2) {
      this.dropOnNode(node2, event);
    } else {
      const reroute = locator.getRerouteOnPos(canvasX, canvasY);
      if (reroute && this.isRerouteValidDrop(reroute)) {
        this.dropOnReroute(reroute, event);
      } else {
        this.dropOnNothing(event);
      }
    }
    this.events.dispatch("after-drop-links", { renderLinks, event });
    this.reset();
  }
  dropOnNode(node2, event) {
    const { renderLinks, state } = this;
    const { connectingTo } = state;
    const { canvasX, canvasY } = event;
    if (renderLinks.every((link2) => link2.node === node2)) return;
    if (connectingTo === "output") {
      const output = node2.getOutputOnPos([canvasX, canvasY]);
      if (output) {
        __privateMethod(this, _LinkConnector_instances, dropOnOutput_fn).call(this, node2, output);
      } else {
        __privateMethod(this, _LinkConnector_instances, dropOnNodeBackground_fn).call(this, node2, event);
      }
    } else if (connectingTo === "input") {
      const input = node2.getInputOnPos([canvasX, canvasY]);
      if (input) {
        __privateMethod(this, _LinkConnector_instances, dropOnInput_fn).call(this, node2, input);
      } else if (this.overWidget && renderLinks[0] instanceof ToInputRenderLink) {
        this.events.dispatch("dropped-on-widget", {
          link: renderLinks[0],
          node: node2,
          widget: this.overWidget
        });
        this.overWidget = void 0;
      } else {
        __privateMethod(this, _LinkConnector_instances, dropOnNodeBackground_fn).call(this, node2, event);
      }
    }
  }
  dropOnReroute(reroute, event) {
    const mayContinue = this.events.dispatch("dropped-on-reroute", { reroute, event });
    if (mayContinue === false) return;
    if (this.state.connectingTo === "input") {
      if (this.renderLinks.length !== 1) throw new Error(`Attempted to connect ${this.renderLinks.length} input links to a reroute.`);
      const renderLink = this.renderLinks[0];
      const results = reroute.findTargetInputs();
      if (!(results == null ? void 0 : results.length)) return;
      const maybeReroutes = reroute.getReroutes();
      if (maybeReroutes === null) throw new Error("Reroute loop detected.");
      const originalReroutes = maybeReroutes.slice(0, -1).reverse();
      if (renderLink instanceof ToInputRenderLink) {
        const { node: node2, fromSlot, fromSlotIndex, fromReroute } = renderLink;
        const floatingOutLinks = reroute.getFloatingLinks("output");
        const floatingInLinks = reroute.getFloatingLinks("input");
        reroute.setFloatingLinkOrigin(node2, fromSlot, fromSlotIndex);
        if (floatingOutLinks && floatingInLinks) {
          for (const link2 of floatingOutLinks) {
            link2.origin_id = node2.id;
            link2.origin_slot = fromSlotIndex;
            for (const originalReroute of originalReroutes) {
              if (fromReroute != null && originalReroute.id === fromReroute.id) break;
              originalReroute.floatingLinkIds.delete(link2.id);
            }
          }
          for (const link2 of floatingInLinks) {
            for (const originalReroute of originalReroutes) {
              if (fromReroute != null && originalReroute.id === fromReroute.id) break;
              originalReroute.floatingLinkIds.delete(link2.id);
            }
          }
        }
      }
      const better = this.renderLinks.flatMap((renderLink2) => results.map((result) => ({ renderLink: renderLink2, result }))).filter(({ renderLink: renderLink2, result }) => renderLink2.toType === "input" && canConnectInputLinkToReroute(renderLink2, result.node, result.input, reroute));
      for (const { renderLink: renderLink2, result } of better) {
        if (renderLink2.toType !== "input") continue;
        renderLink2.connectToRerouteInput(reroute, result, this.events, originalReroutes);
      }
      return;
    }
    for (const link2 of this.renderLinks) {
      if (link2.toType !== "output") continue;
      const result = reroute.findSourceOutput();
      if (!result) continue;
      const { node: node2, output } = result;
      if (!link2.canConnectToOutput(node2, output)) continue;
      link2.connectToRerouteOutput(reroute, node2, output, this.events);
    }
  }
  dropOnNothing(event) {
    if (this.state.connectingTo === "input") {
      for (const link2 of this.renderLinks) {
        if (link2 instanceof MovingInputLink) {
          link2.inputNode.disconnectInput(link2.inputIndex, true);
        }
      }
    }
    this.events.dispatch("dropped-on-canvas", event);
  }
  isNodeValidDrop(node2) {
    var _a2;
    if (this.state.connectingTo === "output") {
      return node2.outputs.some((output) => this.renderLinks.some((link2) => link2.canConnectToOutput(node2, output)));
    }
    if ((_a2 = node2.widgets) == null ? void 0 : _a2.length) {
      return true;
    }
    return node2.inputs.some((input) => this.renderLinks.some((link2) => link2.canConnectToInput(node2, input)));
  }
  /**
   * Checks if a reroute is a valid drop target for any of the links being connected.
   * @param reroute The reroute that would be dropped on.
   * @returns `true` if any of the current links being connected are valid for the given reroute.
   */
  isRerouteValidDrop(reroute) {
    if (this.state.connectingTo === "input") {
      const results = reroute.findTargetInputs();
      if (!(results == null ? void 0 : results.length)) return false;
      for (const { node: node2, input } of results) {
        for (const renderLink of this.renderLinks) {
          if (renderLink.toType !== "input") continue;
          if (canConnectInputLinkToReroute(renderLink, node2, input, reroute)) return true;
        }
      }
    } else {
      const result = reroute.findSourceOutput();
      if (!result) return false;
      const { node: node2, output } = result;
      for (const renderLink of this.renderLinks) {
        if (renderLink.toType !== "output") continue;
        if (!renderLink.canConnectToReroute(reroute)) continue;
        if (renderLink.canConnectToOutput(node2, output)) return true;
      }
    }
    return false;
  }
  /**
   * Exports the current state of the link connector.
   * @param network The network that the links being connected belong to.
   * @returns A POJO with the state of the link connector, links being connected, and their network.
   * @remarks Other than {@link network}, all properties are shallow cloned.
   */
  export(network) {
    return {
      renderLinks: [...this.renderLinks],
      inputLinks: [...this.inputLinks],
      outputLinks: [...this.outputLinks],
      floatingLinks: [...this.floatingLinks],
      state: { ...this.state },
      network
    };
  }
  /**
   * Adds an event listener that will be automatically removed when the reset event is fired.
   * @param eventName The event to listen for.
   * @param listener The listener to call when the event is fired.
   */
  listenUntilReset(eventName, listener, options22) {
    this.events.addEventListener(eventName, listener, options22);
    this.events.addEventListener("reset", () => this.events.removeEventListener(eventName, listener), { once: true });
  }
  /**
   * Resets everything to its initial state.
   *
   * Effectively cancels moving or connecting links.
   */
  reset(force = false) {
    this.events.dispatch("reset", force);
    const { state, outputLinks, inputLinks, hiddenReroutes, renderLinks, floatingLinks } = this;
    if (!force && state.connectingTo === void 0) return;
    state.connectingTo = void 0;
    for (const link2 of outputLinks) delete link2._dragging;
    for (const link2 of inputLinks) delete link2._dragging;
    for (const link2 of floatingLinks) delete link2._dragging;
    for (const reroute of hiddenReroutes) delete reroute._dragging;
    renderLinks.length = 0;
    inputLinks.length = 0;
    outputLinks.length = 0;
    floatingLinks.length = 0;
    hiddenReroutes.clear();
    state.multi = false;
    state.draggingExistingLinks = false;
  }
};
_setConnectingLinks = new WeakMap();
_LinkConnector_instances = new WeakSet();
/**
 * Connects the links being dropped onto a node.
 * @param node The node that the links are being dropped on
 * @param event Contains the drop location, in canvas space
 */
dropOnNodeBackground_fn = function(node2, event) {
  var _a2, _b;
  const { state: { connectingTo } } = this;
  const mayContinue = this.events.dispatch("dropped-on-node", { node: node2, event });
  if (mayContinue === false) return;
  const firstLink = this.renderLinks[0];
  if (!firstLink) return;
  if (connectingTo === "output") {
    const output = (_a2 = node2.findOutputByType(firstLink.fromSlot.type)) == null ? void 0 : _a2.slot;
    if (!output) {
      console.warn(`Could not find slot for link type: [${firstLink.fromSlot.type}].`);
      return;
    }
    __privateMethod(this, _LinkConnector_instances, dropOnOutput_fn).call(this, node2, output);
  } else if (connectingTo === "input") {
    const input = (_b = node2.findInputByType(firstLink.fromSlot.type)) == null ? void 0 : _b.slot;
    if (!input) {
      console.warn(`Could not find slot for link type: [${firstLink.fromSlot.type}].`);
      return;
    }
    __privateMethod(this, _LinkConnector_instances, dropOnInput_fn).call(this, node2, input);
  }
};
dropOnInput_fn = function(node2, input) {
  for (const link2 of this.renderLinks) {
    if (!link2.canConnectToInput(node2, input)) continue;
    link2.connectToInput(node2, input, this.events);
  }
};
dropOnOutput_fn = function(node2, output) {
  for (const link2 of this.renderLinks) {
    if (!link2.canConnectToOutput(node2, output)) {
      if (link2 instanceof MovingOutputLink && link2.link.parentId !== void 0) {
        link2.outputNode.connectSlots(link2.outputSlot, link2.inputNode, link2.inputSlot, void 0);
      }
      continue;
    }
    link2.connectToOutput(node2, output, this.events);
  }
};
/** Sets connecting_links, used by some extensions still. */
setLegacyLinks_fn = function(fromSlotIsInput) {
  const links = this.renderLinks.map((link2) => {
    var _a2, _b;
    const input = fromSlotIsInput ? link2.fromSlot : null;
    const output = fromSlotIsInput ? null : link2.fromSlot;
    const afterRerouteId = link2 instanceof MovingLinkBase ? (_a2 = link2.link) == null ? void 0 : _a2.parentId : (_b = link2.fromReroute) == null ? void 0 : _b.id;
    return {
      node: link2.node,
      slot: link2.fromSlotIndex,
      input,
      output,
      pos: link2.fromPos,
      afterRerouteId
    };
  });
  __privateGet(this, _setConnectingLinks).call(this, links);
};
function canConnectInputLinkToReroute(link2, inputNode, input, reroute) {
  var _a2, _b, _c;
  const { fromReroute } = link2;
  if (!link2.canConnectToInput(inputNode, input) || // Would result in no change
  (fromReroute == null ? void 0 : fromReroute.id) === reroute.id || // Cannot connect from child to parent reroute
  ((_a2 = fromReroute == null ? void 0 : fromReroute.getReroutes()) == null ? void 0 : _a2.includes(reroute))) {
    return false;
  }
  if (link2 instanceof ToInputRenderLink) {
    if (reroute.parentId == null) {
      if ((_b = reroute.firstLink) == null ? void 0 : _b.hasOrigin(link2.node.id, link2.fromSlotIndex)) return false;
    } else if (((_c = link2.fromReroute) == null ? void 0 : _c.id) === reroute.parentId) {
      return false;
    }
  }
  return true;
}
function getNodeInputOnPos(node2, x2, y) {
  var _a2, _b, _c, _d, _e;
  const { inputs } = node2;
  if (!inputs) return;
  for (const [index, input] of inputs.entries()) {
    const pos = node2.getInputPos(index);
    const nameLength = (_e = (_c = (_a2 = input.label) == null ? void 0 : _a2.length) != null ? _c : (_b = input.localized_name) == null ? void 0 : _b.length) != null ? _e : (_d = input.name) == null ? void 0 : _d.length;
    const width2 = 20 + (nameLength || 3) * 7;
    if (isInRectangle(
      x2,
      y,
      pos[0] - 10,
      pos[1] - 10,
      width2,
      20
    )) {
      return { index, input, pos };
    }
  }
}
function getNodeOutputOnPos(node2, x2, y) {
  const { outputs } = node2;
  if (!outputs) return;
  for (const [index, output] of outputs.entries()) {
    const pos = node2.getOutputPos(index);
    if (isInRectangle(
      x2,
      y,
      pos[0] - 10,
      pos[1] - 10,
      40,
      20
    )) {
      return { index, output, pos };
    }
  }
}
function isOverNodeInput(node2, canvasx, canvasy, slot_pos) {
  const result = getNodeInputOnPos(node2, canvasx, canvasy);
  if (!result) return -1;
  if (slot_pos) {
    slot_pos[0] = result.pos[0];
    slot_pos[1] = result.pos[1];
  }
  return result.index;
}
function isOverNodeOutput(node2, canvasx, canvasy, slot_pos) {
  const result = getNodeOutputOnPos(node2, canvasx, canvasy);
  if (!result) return -1;
  if (slot_pos) {
    slot_pos[0] = result.pos[0];
    slot_pos[1] = result.pos[1];
  }
  return result.index;
}
var _maxClickDrift, _maxClickDrift2, _finally, _CanvasPointer_instances, completeClick_fn, hasSamePosition_fn, isDoubleClick_fn, setDragStarted_fn;
var _CanvasPointer = class _CanvasPointer {
  constructor(element) {
    __privateAdd(this, _CanvasPointer_instances);
    /** The element this PointerState should capture input against when dragging. */
    __publicField(this, "element");
    /** Pointer ID used by drag capture. */
    __publicField(this, "pointerId");
    /** Set to true when if the pointer moves far enough after a down event, before the corresponding up event is fired. */
    __publicField(this, "dragStarted", false);
    /** The {@link eUp} from the last successful click */
    __publicField(this, "eLastDown");
    /** Used downstream for touch event support. */
    __publicField(this, "isDouble", false);
    /** Used downstream for touch event support. */
    __publicField(this, "isDown", false);
    /**
     * If `true`, {@link eDown}, {@link eMove}, and {@link eUp} will be set to
     * `undefined` when {@link reset} is called.
     *
     * Default: `true`
     */
    __publicField(this, "clearEventsOnReset", true);
    /** The last pointerdown event for the primary button */
    __publicField(this, "eDown");
    /** The last pointermove event for the primary button */
    __publicField(this, "eMove");
    /** The last pointerup event for the primary button */
    __publicField(this, "eUp");
    __privateAdd(this, _finally);
    this.element = element;
  }
  /** Maximum offset from click location */
  static get maxClickDrift() {
    return __privateGet(this, _maxClickDrift);
  }
  static set maxClickDrift(value) {
    __privateSet(this, _maxClickDrift, value);
    __privateSet(this, _maxClickDrift2, value * value);
  }
  /**
   * Run-once callback, called at the end of any click or drag, whether or not it was successful in any way.
   *
   * The setter of this callback will call the existing value before replacing it.
   * Therefore, simply setting this value twice will execute the first callback.
   */
  get finally() {
    return __privateGet(this, _finally);
  }
  set finally(value) {
    var _a2;
    try {
      (_a2 = __privateGet(this, _finally)) == null ? void 0 : _a2.call(this);
    } finally {
      __privateSet(this, _finally, value);
    }
  }
  /**
   * Callback for `pointerdown` events.  To be used as the event handler (or called by it).
   * @param e The `pointerdown` event
   */
  down(e2) {
    this.reset();
    this.eDown = e2;
    this.pointerId = e2.pointerId;
    this.element.setPointerCapture(e2.pointerId);
  }
  /**
   * Callback for `pointermove` events.  To be used as the event handler (or called by it).
   * @param e The `pointermove` event
   */
  move(e2) {
    var _a2;
    const { eDown } = this;
    if (!eDown) return;
    if (!e2.buttons) {
      this.reset();
      return;
    }
    if (!(e2.buttons & eDown.buttons)) {
      __privateMethod(this, _CanvasPointer_instances, completeClick_fn).call(this, e2);
      this.reset();
      return;
    }
    this.eMove = e2;
    (_a2 = this.onDrag) == null ? void 0 : _a2.call(this, e2);
    if (this.dragStarted) return;
    const longerThanBufferTime = e2.timeStamp - eDown.timeStamp > _CanvasPointer.bufferTime;
    if (longerThanBufferTime || !__privateMethod(this, _CanvasPointer_instances, hasSamePosition_fn).call(this, e2, eDown)) {
      __privateMethod(this, _CanvasPointer_instances, setDragStarted_fn).call(this);
    }
  }
  /**
   * Callback for `pointerup` events.  To be used as the event handler (or called by it).
   * @param e The `pointerup` event
   */
  up(e2) {
    var _a2;
    if (e2.button !== ((_a2 = this.eDown) == null ? void 0 : _a2.button)) return false;
    __privateMethod(this, _CanvasPointer_instances, completeClick_fn).call(this, e2);
    const { dragStarted } = this;
    this.reset();
    return !dragStarted;
  }
  /**
   * Resets the state of this {@link CanvasPointer} instance.
   *
   * The {@link finally} callback is first executed, then all callbacks and intra-click
   * state is cleared.
   */
  reset() {
    this.finally = void 0;
    delete this.onClick;
    delete this.onDoubleClick;
    delete this.onDragStart;
    delete this.onDrag;
    delete this.onDragEnd;
    this.isDown = false;
    this.isDouble = false;
    this.dragStarted = false;
    if (this.clearEventsOnReset) {
      this.eDown = void 0;
      this.eMove = void 0;
      this.eUp = void 0;
    }
    const { element, pointerId } = this;
    this.pointerId = void 0;
    if (typeof pointerId === "number" && element.hasPointerCapture(pointerId)) {
      element.releasePointerCapture(pointerId);
    }
  }
};
_maxClickDrift = new WeakMap();
_maxClickDrift2 = new WeakMap();
_finally = new WeakMap();
_CanvasPointer_instances = new WeakSet();
completeClick_fn = function(e2) {
  var _a2, _b, _c;
  const { eDown } = this;
  if (!eDown) return;
  this.eUp = e2;
  if (this.dragStarted) {
    (_a2 = this.onDragEnd) == null ? void 0 : _a2.call(this, e2);
  } else if (!__privateMethod(this, _CanvasPointer_instances, hasSamePosition_fn).call(this, e2, eDown)) {
    __privateMethod(this, _CanvasPointer_instances, setDragStarted_fn).call(this);
    (_b = this.onDragEnd) == null ? void 0 : _b.call(this, e2);
  } else if (this.onDoubleClick && __privateMethod(this, _CanvasPointer_instances, isDoubleClick_fn).call(this)) {
    this.onDoubleClick(e2);
    this.eLastDown = void 0;
  } else {
    (_c = this.onClick) == null ? void 0 : _c.call(this, e2);
    this.eLastDown = eDown;
  }
};
/**
 * Checks if two events occurred near each other - not further apart than the maximum click drift.
 * @param a The first event to compare
 * @param b The second event to compare
 * @param tolerance2 The maximum distance (squared) before the positions are considered different
 * @returns `true` if the two events were no more than {@link maxClickDrift} apart, otherwise `false`
 */
hasSamePosition_fn = function(a, b, tolerance2 = __privateGet(_CanvasPointer, _maxClickDrift2)) {
  const drift = dist2(a.clientX, a.clientY, b.clientX, b.clientY);
  return drift <= tolerance2;
};
/**
 * Checks whether the pointer is currently past the max click drift threshold.
 * @returns `true` if the latest pointer event is past the the click drift threshold
 */
isDoubleClick_fn = function() {
  const { eDown, eLastDown } = this;
  if (!eDown || !eLastDown) return false;
  const tolerance2 = (3 * __privateGet(_CanvasPointer, _maxClickDrift)) ** 2;
  const diff = eDown.timeStamp - eLastDown.timeStamp;
  return diff > 0 && diff < _CanvasPointer.doubleClickTime && __privateMethod(this, _CanvasPointer_instances, hasSamePosition_fn).call(this, eDown, eLastDown, tolerance2);
};
setDragStarted_fn = function() {
  var _a2;
  this.dragStarted = true;
  (_a2 = this.onDragStart) == null ? void 0 : _a2.call(this, this);
  delete this.onDragStart;
};
/** Maximum time in milliseconds to ignore click drift */
__publicField(_CanvasPointer, "bufferTime", 150);
/** Maximum gap between pointerup and pointerdown events to be considered as a double click */
__publicField(_CanvasPointer, "doubleClickTime", 300);
__privateAdd(_CanvasPointer, _maxClickDrift, 6);
/** {@link maxClickDrift} squared.  Used to calculate click drift without `sqrt`. */
__privateAdd(_CanvasPointer, _maxClickDrift2, __privateGet(_CanvasPointer, _maxClickDrift) ** 2);
var CanvasPointer = _CanvasPointer;
var NullGraphError = class extends Error {
  constructor(message = "Attempted to access LGraph reference that was null or undefined.", cause) {
    super(message, { cause });
    this.name = "NullGraphError";
  }
};
var BadgePosition = /* @__PURE__ */ ((BadgePosition2) => {
  BadgePosition2["TopLeft"] = "top-left";
  BadgePosition2["TopRight"] = "top-right";
  return BadgePosition2;
})(BadgePosition || {});
var LGraphBadge = class {
  constructor({
    text: text2,
    fgColor = "white",
    bgColor = "#0F1F0F",
    fontSize = 12,
    padding = 6,
    height = 20,
    cornerRadius = 5
  }) {
    __publicField(this, "text");
    __publicField(this, "fgColor");
    __publicField(this, "bgColor");
    __publicField(this, "fontSize");
    __publicField(this, "padding");
    __publicField(this, "height");
    __publicField(this, "cornerRadius");
    this.text = text2;
    this.fgColor = fgColor;
    this.bgColor = bgColor;
    this.fontSize = fontSize;
    this.padding = padding;
    this.height = height;
    this.cornerRadius = cornerRadius;
  }
  get visible() {
    return this.text.length > 0;
  }
  getWidth(ctx) {
    if (!this.visible) return 0;
    const { font } = ctx;
    ctx.font = `${this.fontSize}px sans-serif`;
    const textWidth = ctx.measureText(this.text).width;
    ctx.font = font;
    return textWidth + this.padding * 2;
  }
  draw(ctx, x2, y) {
    if (!this.visible) return;
    const { fillStyle } = ctx;
    ctx.font = `${this.fontSize}px sans-serif`;
    const badgeWidth = this.getWidth(ctx);
    const badgeX = 0;
    ctx.fillStyle = this.bgColor;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x2 + badgeX, y, badgeWidth, this.height, this.cornerRadius);
    } else {
      ctx.rect(x2 + badgeX, y, badgeWidth, this.height);
    }
    ctx.fill();
    ctx.fillStyle = this.fgColor;
    ctx.fillText(
      this.text,
      x2 + badgeX + this.padding,
      y + this.height - this.padding
    );
    ctx.fillStyle = fillStyle;
  }
};
function shallowCloneCommonProps(slot) {
  const { color_off, color_on, dir, label, localized_name, locked, name, nameLocked, removable, shape, type } = slot;
  return { color_off, color_on, dir, label, localized_name, locked, name, nameLocked, removable, shape, type };
}
function inputAsSerialisable(slot) {
  const { link: link2 } = slot;
  const widgetOrPos = slot.widget ? { widget: { name: slot.widget.name } } : { pos: slot.pos };
  return {
    ...shallowCloneCommonProps(slot),
    ...widgetOrPos,
    link: link2
  };
}
function outputAsSerialisable(slot) {
  const { pos, slot_index, links, widget } = slot;
  const outputWidget = widget ? { widget: { name: widget.name } } : null;
  return {
    ...shallowCloneCommonProps(slot),
    ...outputWidget,
    pos,
    slot_index,
    links
  };
}
function toNodeSlotClass(slot) {
  if (isINodeInputSlot(slot)) {
    return new NodeInputSlot(slot);
  } else if (isINodeOutputSlot(slot)) {
    return new NodeOutputSlot(slot);
  }
  throw new Error("Invalid slot type");
}
function isWidgetInputSlot(slot) {
  return isINodeInputSlot(slot) && !!slot.widget;
}
var NodeSlot = class {
  constructor(slot) {
    __publicField(this, "name");
    __publicField(this, "localized_name");
    __publicField(this, "label");
    __publicField(this, "type");
    __publicField(this, "dir");
    __publicField(this, "removable");
    __publicField(this, "shape");
    __publicField(this, "color_off");
    __publicField(this, "color_on");
    __publicField(this, "locked");
    __publicField(this, "nameLocked");
    __publicField(this, "pos");
    __publicField(this, "widget");
    __publicField(this, "hasErrors");
    Object.assign(this, slot);
    this.name = slot.name;
    this.type = slot.type;
  }
  /**
   * The label to display in the UI.
   */
  get renderingLabel() {
    return this.label || this.localized_name || this.name || "";
  }
  connectedColor(context) {
    return this.color_on || context.default_connection_color_byType[this.type] || context.default_connection_color.output_on;
  }
  disconnectedColor(context) {
    return this.color_off || context.default_connection_color_byTypeOff[this.type] || context.default_connection_color_byType[this.type] || context.default_connection_color.output_off;
  }
  renderingColor(context) {
    return this.isConnected() ? this.connectedColor(context) : this.disconnectedColor(context);
  }
  draw(ctx, options22) {
    const {
      pos,
      colorContext,
      labelColor = "#AAA",
      labelPosition = LabelPosition.Right,
      lowQuality = false,
      highlight = false
    } = options22;
    let { doStroke = false } = options22;
    const originalFillStyle = ctx.fillStyle;
    const originalStrokeStyle = ctx.strokeStyle;
    const originalLineWidth = ctx.lineWidth;
    const slot_type = this.type;
    const slot_shape = slot_type === SlotType.Array ? SlotShape.Grid : this.shape;
    ctx.beginPath();
    let doFill = true;
    ctx.fillStyle = this.renderingColor(colorContext);
    ctx.lineWidth = 1;
    if (slot_type === SlotType.Event || slot_shape === SlotShape.Box) {
      ctx.rect(pos[0] - 6 + 0.5, pos[1] - 5 + 0.5, 14, 10);
    } else if (slot_shape === SlotShape.Arrow) {
      ctx.moveTo(pos[0] + 8, pos[1] + 0.5);
      ctx.lineTo(pos[0] - 4, pos[1] + 6 + 0.5);
      ctx.lineTo(pos[0] - 4, pos[1] - 6 + 0.5);
      ctx.closePath();
    } else if (slot_shape === SlotShape.Grid) {
      const gridSize = 3;
      const cellSize = 2;
      const spacing = 3;
      for (let x2 = 0; x2 < gridSize; x2++) {
        for (let y = 0; y < gridSize; y++) {
          ctx.rect(
            pos[0] - 4 + x2 * spacing,
            pos[1] - 4 + y * spacing,
            cellSize,
            cellSize
          );
        }
      }
      doStroke = false;
    } else {
      if (lowQuality) {
        ctx.rect(pos[0] - 4, pos[1] - 4, 8, 8);
      } else {
        let radius;
        if (slot_shape === SlotShape.HollowCircle) {
          doFill = false;
          doStroke = true;
          ctx.lineWidth = 3;
          ctx.strokeStyle = ctx.fillStyle;
          radius = highlight ? 4 : 3;
        } else {
          radius = highlight ? 5 : 4;
        }
        ctx.arc(pos[0], pos[1], radius, 0, Math.PI * 2);
      }
    }
    if (doFill) ctx.fill();
    if (!lowQuality && doStroke) ctx.stroke();
    if (!lowQuality) {
      const text2 = this.renderingLabel;
      if (text2) {
        ctx.fillStyle = labelColor;
        if (labelPosition === LabelPosition.Right) {
          if (this.dir == LinkDirection.UP) {
            ctx.fillText(text2, pos[0], pos[1] - 10);
          } else {
            ctx.fillText(text2, pos[0] + 10, pos[1] + 5);
          }
        } else {
          if (this.dir == LinkDirection.DOWN) {
            ctx.fillText(text2, pos[0], pos[1] - 8);
          } else {
            ctx.fillText(text2, pos[0] - 10, pos[1] + 5);
          }
        }
      }
    }
    if (this.hasErrors) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(pos[0], pos[1], 12, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = originalFillStyle;
    ctx.strokeStyle = originalStrokeStyle;
    ctx.lineWidth = originalLineWidth;
  }
  drawCollapsed(ctx, options22) {
    const [x2, y] = options22.pos;
    const originalFillStyle = ctx.fillStyle;
    ctx.fillStyle = "#686";
    ctx.beginPath();
    if (this.type === SlotType.Event || this.shape === RenderShape.BOX) {
      ctx.rect(x2 - 7 + 0.5, y - 4, 14, 8);
    } else if (this.shape === RenderShape.ARROW) {
      const isInput = this instanceof NodeInputSlot;
      if (isInput) {
        ctx.moveTo(x2 + 8, y);
        ctx.lineTo(x2 - 4, y - 4);
        ctx.lineTo(x2 - 4, y + 4);
      } else {
        ctx.moveTo(x2 + 6, y);
        ctx.lineTo(x2 - 6, y - 4);
        ctx.lineTo(x2 - 6, y + 4);
      }
      ctx.closePath();
    } else {
      ctx.arc(x2, y, 4, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.fillStyle = originalFillStyle;
  }
};
function isINodeInputSlot(slot) {
  return "link" in slot;
}
var NodeInputSlot = class extends NodeSlot {
  constructor(slot) {
    super(slot);
    __publicField(this, "link");
    this.link = slot.link;
  }
  isConnected() {
    return this.link != null;
  }
  isValidTarget(fromSlot) {
    return "links" in fromSlot && LiteGraph.isValidConnection(this.type, fromSlot.type);
  }
  draw(ctx, options22) {
    const originalTextAlign = ctx.textAlign;
    ctx.textAlign = "left";
    super.draw(ctx, {
      ...options22,
      labelPosition: LabelPosition.Right,
      doStroke: false
    });
    ctx.textAlign = originalTextAlign;
  }
};
function isINodeOutputSlot(slot) {
  return "links" in slot;
}
var NodeOutputSlot = class extends NodeSlot {
  constructor(slot) {
    super(slot);
    __publicField(this, "links");
    __publicField(this, "_data");
    __publicField(this, "slot_index");
    this.links = slot.links;
    this._data = slot._data;
    this.slot_index = slot.slot_index;
  }
  isValidTarget(fromSlot) {
    return "link" in fromSlot && LiteGraph.isValidConnection(this.type, fromSlot.type);
  }
  isConnected() {
    return this.links != null && this.links.length > 0;
  }
  draw(ctx, options22) {
    const originalTextAlign = ctx.textAlign;
    const originalStrokeStyle = ctx.strokeStyle;
    ctx.textAlign = "right";
    ctx.strokeStyle = "black";
    super.draw(ctx, {
      ...options22,
      labelPosition: LabelPosition.Left,
      doStroke: true
    });
    ctx.textAlign = originalTextAlign;
    ctx.strokeStyle = originalStrokeStyle;
  }
};
function stringOrEmpty(value) {
  return value == null ? "" : String(value);
}
function parseSlotTypes(type) {
  return type == "" || type == "0" ? ["*"] : String(type).toLowerCase().split(",");
}
function getAllNestedItems(items) {
  const allItems = /* @__PURE__ */ new Set();
  if (items) {
    for (const item of items) addRecursively(item, allItems);
  }
  return allItems;
  function addRecursively(item, flatSet) {
    if (flatSet.has(item) || item.pinned) return;
    flatSet.add(item);
    if (item.children) {
      for (const child of item.children) addRecursively(child, flatSet);
    }
  }
}
function findFirstNode(items) {
  for (const item of items) {
    if (item instanceof LGraphNode) return item;
  }
}
function findFreeSlotOfType(slots, type) {
  var _a2, _b, _c;
  if (!(slots == null ? void 0 : slots.length)) return;
  let occupiedSlot;
  let wildSlot;
  let occupiedWildSlot;
  const validTypes = parseSlotTypes(type);
  for (const [index, slot] of slots.entries()) {
    const slotTypes = parseSlotTypes(slot.type);
    for (const validType of validTypes) {
      for (const slotType of slotTypes) {
        if (slotType === validType) {
          if (slot.link == null && !((_a2 = slot.links) == null ? void 0 : _a2.length)) {
            return { index, slot };
          }
          occupiedSlot != null ? occupiedSlot : occupiedSlot = { index, slot };
        } else if (!wildSlot && (validType === "*" || slotType === "*")) {
          if (slot.link == null && !((_b = slot.links) == null ? void 0 : _b.length)) {
            wildSlot = { index, slot };
          } else {
            occupiedWildSlot != null ? occupiedWildSlot : occupiedWildSlot = { index, slot };
          }
        }
      }
    }
  }
  return (_c = wildSlot != null ? wildSlot : occupiedSlot) != null ? _c : occupiedWildSlot;
}
var LayoutElement = class {
  constructor(o) {
    __publicField(this, "value");
    __publicField(this, "boundingRect");
    this.value = o.value;
    this.boundingRect = o.boundingRect;
  }
  get center() {
    return [
      this.boundingRect[0] + this.boundingRect[2] / 2,
      this.boundingRect[1] + this.boundingRect[3] / 2
    ];
  }
};
function distributeSpace(totalSpace, requests) {
  if (requests.length === 0) return [];
  const totalMinSize = requests.reduce((sum, req) => sum + req.minSize, 0);
  if (totalSpace < totalMinSize) {
    return requests.map((req) => req.minSize);
  }
  let allocations = requests.map((req) => {
    var _a2, _b;
    return {
      computedSize: req.minSize,
      maxSize: (_a2 = req.maxSize) != null ? _a2 : Infinity,
      remaining: ((_b = req.maxSize) != null ? _b : Infinity) - req.minSize
    };
  });
  let remainingSpace = totalSpace - totalMinSize;
  while (remainingSpace > 0 && allocations.some((alloc) => alloc.remaining > 0)) {
    const growableItems = allocations.filter(
      (alloc) => alloc.remaining > 0
    ).length;
    if (growableItems === 0) break;
    const sharePerItem = remainingSpace / growableItems;
    let spaceUsedThisRound = 0;
    allocations = allocations.map((alloc) => {
      if (alloc.remaining <= 0) return alloc;
      const growth = Math.min(sharePerItem, alloc.remaining);
      spaceUsedThisRound += growth;
      return {
        ...alloc,
        computedSize: alloc.computedSize + growth,
        remaining: alloc.remaining - growth
      };
    });
    remainingSpace -= spaceUsedThisRound;
    if (spaceUsedThisRound === 0) break;
  }
  return allocations.map(({ computedSize }) => computedSize);
}
function toClass(cls, obj) {
  return obj instanceof cls ? obj : new cls(obj);
}
function isColorable(obj) {
  return typeof obj === "object" && obj !== null && "setColorOption" in obj && "getColorOption" in obj;
}
var BaseWidget = class {
  constructor(widget) {
    __publicField(this, "linkedWidgets");
    __publicField(this, "name");
    __publicField(this, "options");
    __publicField(this, "label");
    __publicField(this, "type");
    __publicField(this, "value");
    __publicField(this, "y", 0);
    __publicField(this, "last_y");
    __publicField(this, "width");
    __publicField(this, "disabled");
    __publicField(this, "hidden");
    __publicField(this, "advanced");
    __publicField(this, "tooltip");
    __publicField(this, "element");
    Object.assign(this, widget);
    this.name = widget.name;
    this.options = widget.options;
    this.type = widget.type;
  }
  get outline_color() {
    return this.advanced ? LiteGraph.WIDGET_ADVANCED_OUTLINE_COLOR : LiteGraph.WIDGET_OUTLINE_COLOR;
  }
  get background_color() {
    return LiteGraph.WIDGET_BGCOLOR;
  }
  get height() {
    return LiteGraph.NODE_WIDGET_HEIGHT;
  }
  get text_color() {
    return LiteGraph.WIDGET_TEXT_COLOR;
  }
  get secondary_text_color() {
    return LiteGraph.WIDGET_SECONDARY_TEXT_COLOR;
  }
  /**
   * Sets the value of the widget
   * @param value The value to set
   * @param options The options for setting the value
   */
  setValue(value, options22) {
    var _a2, _b, _c, _d;
    const { node: node2, canvas: canvas2, e: e2 } = options22;
    const oldValue = this.value;
    if (value === this.value) return;
    const v2 = this.type === "number" ? Number(value) : value;
    this.value = v2;
    if (((_a2 = this.options) == null ? void 0 : _a2.property) && node2.properties[this.options.property] !== void 0) {
      node2.setProperty(this.options.property, v2);
    }
    const pos = canvas2.graph_mouse;
    (_b = this.callback) == null ? void 0 : _b.call(this, this.value, canvas2, node2, pos, e2);
    (_d = node2.onWidgetChanged) == null ? void 0 : _d.call(node2, (_c = this.name) != null ? _c : "", v2, oldValue, this);
    if (node2.graph) node2.graph._version++;
  }
};
var BooleanWidget = class extends BaseWidget {
  constructor(widget) {
    super(widget);
    this.type = "toggle";
    this.value = widget.value;
  }
  drawWidget(ctx, {
    y,
    width: width2,
    show_text = true,
    margin = 15
  }) {
    const { height } = this;
    ctx.textAlign = "left";
    ctx.strokeStyle = this.outline_color;
    ctx.fillStyle = this.background_color;
    ctx.beginPath();
    if (show_text)
      ctx.roundRect(margin, y, width2 - margin * 2, height, [height * 0.5]);
    else ctx.rect(margin, y, width2 - margin * 2, height);
    ctx.fill();
    if (show_text && !this.disabled) ctx.stroke();
    ctx.fillStyle = this.value ? "#89A" : "#333";
    ctx.beginPath();
    ctx.arc(
      width2 - margin * 2,
      y + height * 0.5,
      height * 0.36,
      0,
      Math.PI * 2
    );
    ctx.fill();
    if (show_text) {
      ctx.fillStyle = this.secondary_text_color;
      const label = this.label || this.name;
      if (label != null) {
        ctx.fillText(label, margin * 2, y + height * 0.7);
      }
      ctx.fillStyle = this.value ? this.text_color : this.secondary_text_color;
      ctx.textAlign = "right";
      ctx.fillText(
        this.value ? this.options.on || "true" : this.options.off || "false",
        width2 - 40,
        y + height * 0.7
      );
    }
  }
  onClick(options22) {
    this.setValue(!this.value, options22);
  }
};
var ButtonWidget = class extends BaseWidget {
  constructor(widget) {
    var _a2;
    super(widget);
    this.type = "button";
    this.clicked = (_a2 = widget.clicked) != null ? _a2 : false;
  }
  /**
   * Draws the widget
   * @param ctx The canvas context
   * @param options The options for drawing the widget
   */
  drawWidget(ctx, {
    y,
    width: width2,
    show_text = true,
    margin = 15
  }) {
    const originalTextAlign = ctx.textAlign;
    const originalStrokeStyle = ctx.strokeStyle;
    const originalFillStyle = ctx.fillStyle;
    const { height } = this;
    ctx.fillStyle = this.background_color;
    if (this.clicked) {
      ctx.fillStyle = "#AAA";
      this.clicked = false;
    }
    ctx.fillRect(margin, y, width2 - margin * 2, height);
    if (show_text && !this.disabled) {
      ctx.strokeStyle = this.outline_color;
      ctx.strokeRect(margin, y, width2 - margin * 2, height);
    }
    if (show_text) {
      ctx.textAlign = "center";
      ctx.fillStyle = this.text_color;
      ctx.fillText(
        this.label || this.name || "",
        width2 * 0.5,
        y + height * 0.7
      );
    }
    ctx.textAlign = originalTextAlign;
    ctx.strokeStyle = originalStrokeStyle;
    ctx.fillStyle = originalFillStyle;
  }
  onClick(options22) {
    var _a2;
    const { e: e2, node: node2, canvas: canvas2 } = options22;
    const pos = canvas2.graph_mouse;
    this.clicked = true;
    canvas2.setDirty(true);
    (_a2 = this.callback) == null ? void 0 : _a2.call(this, this, canvas2, node2, pos, e2);
  }
};
var ComboWidget = class extends BaseWidget {
  constructor(widget) {
    super(widget);
    this.type = "combo";
    this.value = widget.value;
  }
  /**
   * Draws the widget
   * @param ctx The canvas context
   * @param options The options for drawing the widget
   */
  drawWidget(ctx, {
    y,
    width: width2,
    show_text = true,
    margin = 15
  }) {
    const originalTextAlign = ctx.textAlign;
    const originalStrokeStyle = ctx.strokeStyle;
    const originalFillStyle = ctx.fillStyle;
    const { height } = this;
    ctx.textAlign = "left";
    ctx.strokeStyle = this.outline_color;
    ctx.fillStyle = this.background_color;
    ctx.beginPath();
    if (show_text)
      ctx.roundRect(margin, y, width2 - margin * 2, height, [height * 0.5]);
    else
      ctx.rect(margin, y, width2 - margin * 2, height);
    ctx.fill();
    if (show_text) {
      if (!this.disabled) {
        ctx.stroke();
        ctx.fillStyle = this.text_color;
        ctx.beginPath();
        ctx.moveTo(margin + 16, y + 5);
        ctx.lineTo(margin + 6, y + height * 0.5);
        ctx.lineTo(margin + 16, y + height - 5);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(width2 - margin - 16, y + 5);
        ctx.lineTo(width2 - margin - 6, y + height * 0.5);
        ctx.lineTo(width2 - margin - 16, y + height - 5);
        ctx.fill();
      }
      ctx.fillStyle = this.secondary_text_color;
      const label = this.label || this.name;
      if (label != null) {
        ctx.fillText(label, margin * 2 + 5, y + height * 0.7);
      }
      ctx.fillStyle = this.text_color;
      ctx.textAlign = "right";
      let displayValue = typeof this.value === "number" ? String(this.value) : this.value;
      if (this.options.values) {
        let values = this.options.values;
        if (typeof values === "function") {
          values = values();
        }
        if (values && !Array.isArray(values)) {
          displayValue = values[this.value];
        }
      }
      const labelWidth = ctx.measureText(label || "").width + margin * 2;
      const inputWidth = width2 - margin * 4;
      const availableWidth = inputWidth - labelWidth;
      const textWidth = ctx.measureText(displayValue).width;
      if (textWidth > availableWidth) {
        const ELLIPSIS = "\u2026";
        const ellipsisWidth = ctx.measureText(ELLIPSIS).width;
        const charWidthAvg = ctx.measureText("a").width;
        if (availableWidth <= ellipsisWidth) {
          displayValue = "\u2024";
        } else {
          displayValue = `${displayValue}`;
          const overflowWidth = textWidth + ellipsisWidth - availableWidth;
          if (overflowWidth + charWidthAvg * 3 > availableWidth) {
            const preciseRange = availableWidth + charWidthAvg * 3;
            const preTruncateCt = Math.floor((preciseRange - ellipsisWidth) / charWidthAvg);
            displayValue = displayValue.substr(0, preTruncateCt);
          }
          while (ctx.measureText(displayValue).width + ellipsisWidth > availableWidth) {
            displayValue = displayValue.substr(0, displayValue.length - 1);
          }
          displayValue += ELLIPSIS;
        }
      }
      ctx.fillText(
        displayValue,
        width2 - margin * 2 - 20,
        y + height * 0.7
      );
    }
    ctx.textAlign = originalTextAlign;
    ctx.strokeStyle = originalStrokeStyle;
    ctx.fillStyle = originalFillStyle;
  }
  onClick(options22) {
    const { e: e2, node: node2, canvas: canvas2 } = options22;
    const x2 = e2.canvasX - node2.pos[0];
    const width2 = this.width || node2.size[0];
    const delta2 = x2 < 40 ? -1 : x2 > width2 - 40 ? 1 : 0;
    let values = this.options.values;
    if (typeof values === "function") {
      values = values(this, node2);
    }
    const values_list = Array.isArray(values) ? values : Object.keys(values);
    if (delta2) {
      let index = -1;
      canvas2.last_mouseclick = 0;
      index = typeof values === "object" ? values_list.indexOf(String(this.value)) + delta2 : values_list.indexOf(this.value) + delta2;
      if (index >= values_list.length) index = values_list.length - 1;
      if (index < 0) index = 0;
      this.setValue(
        Array.isArray(values) ? values[index] : index,
        {
          e: e2,
          node: node2,
          canvas: canvas2
        }
      );
      return;
    }
    const text_values = values != values_list ? Object.values(values) : values;
    new LiteGraph.ContextMenu(text_values, {
      scale: Math.max(1, canvas2.ds.scale),
      event: e2,
      className: "dark",
      callback: (value) => {
        this.setValue(
          values != values_list ? text_values.indexOf(value) : value,
          {
            e: e2,
            node: node2,
            canvas: canvas2
          }
        );
      }
    });
  }
};
function getWidgetStep(options22) {
  return options22.step2 || (options22.step || 10) * 0.1;
}
var KnobWidget = class extends BaseWidget {
  constructor(widget) {
    super(widget);
    __publicField(this, "computedHeight");
    __publicField(this, "current_drag_offset", 0);
    this.type = "knob";
    this.value = widget.value;
    this.options = widget.options;
  }
  /**
   * Compute the layout size of the widget.
   * @returns The layout size of the widget.
   */
  computeLayoutSize() {
    return {
      minHeight: 60,
      minWidth: 20,
      maxHeight: 1e6,
      maxWidth: 1e6
    };
  }
  get height() {
    return this.computedHeight || super.height;
  }
  drawWidget(ctx, {
    y,
    width: width2,
    show_text = true,
    margin = 15
  }) {
    var _a2;
    const originalTextAlign = ctx.textAlign;
    const originalStrokeStyle = ctx.strokeStyle;
    const originalFillStyle = ctx.fillStyle;
    const { gradient_stops = "rgb(14, 182, 201); rgb(0, 216, 72)" } = this.options;
    const effective_height = this.computedHeight || this.height;
    const size_modifier = Math.min(this.computedHeight || this.height, this.width || 20) / 20;
    const arc_center = { x: width2 / 2, y: effective_height / 2 + y };
    ctx.lineWidth = (Math.min(width2, effective_height) - margin * size_modifier) / 6;
    const arc_size = (Math.min(width2, effective_height) - margin * size_modifier - ctx.lineWidth) / 2;
    {
      const gradient2 = ctx.createRadialGradient(
        arc_center.x,
        arc_center.y,
        arc_size + ctx.lineWidth,
        0,
        0,
        arc_size + ctx.lineWidth
      );
      gradient2.addColorStop(0, "rgb(29, 29, 29)");
      gradient2.addColorStop(1, "rgb(116, 116, 116)");
      ctx.fillStyle = gradient2;
    }
    ctx.beginPath();
    {
      ctx.arc(
        arc_center.x,
        arc_center.y,
        arc_size + ctx.lineWidth / 2,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
      ctx.closePath();
    }
    const arc = {
      start_angle: Math.PI * 0.6,
      end_angle: Math.PI * 2.4
    };
    ctx.beginPath();
    {
      const gradient2 = ctx.createRadialGradient(
        arc_center.x,
        arc_center.y,
        arc_size + ctx.lineWidth,
        0,
        0,
        arc_size + ctx.lineWidth
      );
      gradient2.addColorStop(0, "rgb(99, 99, 99)");
      gradient2.addColorStop(1, "rgb(36, 36, 36)");
      ctx.strokeStyle = gradient2;
    }
    ctx.arc(
      arc_center.x,
      arc_center.y,
      arc_size,
      arc.start_angle,
      arc.end_angle,
      false
    );
    ctx.stroke();
    ctx.closePath();
    const range = this.options.max - this.options.min;
    let nvalue = (this.value - this.options.min) / range;
    nvalue = clamp(nvalue, 0, 1);
    ctx.beginPath();
    const gradient = ctx.createConicGradient(
      arc.start_angle,
      arc_center.x,
      arc_center.y
    );
    const gs = gradient_stops.split(";");
    for (const [index, stop] of gs.entries()) {
      gradient.addColorStop(index, stop.trim());
    }
    ctx.strokeStyle = gradient;
    const value_end_angle = (arc.end_angle - arc.start_angle) * nvalue + arc.start_angle;
    ctx.arc(
      arc_center.x,
      arc_center.y,
      arc_size,
      arc.start_angle,
      value_end_angle,
      false
    );
    ctx.stroke();
    ctx.closePath();
    if (show_text && !this.disabled) {
      ctx.strokeStyle = this.outline_color;
      ctx.beginPath();
      ctx.strokeStyle = this.outline_color;
      ctx.arc(
        arc_center.x,
        arc_center.y,
        arc_size + ctx.lineWidth / 2,
        0,
        Math.PI * 2,
        false
      );
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.closePath();
    }
    if (show_text) {
      ctx.textAlign = "center";
      ctx.fillStyle = this.text_color;
      const fixedValue = Number(this.value).toFixed((_a2 = this.options.precision) != null ? _a2 : 3);
      ctx.fillText(
        `${this.label || this.name}
${fixedValue}`,
        width2 * 0.5,
        y + effective_height * 0.5
      );
    }
    ctx.textAlign = originalTextAlign;
    ctx.strokeStyle = originalStrokeStyle;
    ctx.fillStyle = originalFillStyle;
  }
  onClick() {
    this.current_drag_offset = 0;
  }
  onDrag(options22) {
    if (this.options.read_only) return;
    const { e: e2 } = options22;
    const step = getWidgetStep(this.options);
    const range = this.options.max - this.options.min;
    const range_10_percent = range / 10;
    const range_1_percent = range / 100;
    const step_for = {
      shift: range_10_percent > step ? range_10_percent - range_10_percent % step : step,
      delta_y: range_1_percent > step ? range_1_percent - range_1_percent % step : step
      // 1% increments
    };
    const use_y = Math.abs(e2.movementY) > Math.abs(e2.movementX);
    const delta2 = use_y ? -e2.movementY : e2.movementX;
    const drag_threshold = 15;
    this.current_drag_offset += delta2;
    let adjustment = 0;
    if (this.current_drag_offset > drag_threshold) {
      adjustment += 1;
      this.current_drag_offset -= drag_threshold;
    } else if (this.current_drag_offset < -15) {
      adjustment -= 1;
      this.current_drag_offset += drag_threshold;
    }
    const step_with_shift_modifier = e2.shiftKey ? step_for.shift : use_y ? step_for.delta_y : step;
    const deltaValue = adjustment * step_with_shift_modifier;
    const newValue2 = clamp(
      this.value + deltaValue,
      this.options.min,
      this.options.max
    );
    if (newValue2 !== this.value) {
      this.setValue(newValue2, options22);
    }
  }
};
var NumberWidget = class extends BaseWidget {
  constructor(widget) {
    super(widget);
    this.type = "number";
    this.value = widget.value;
  }
  setValue(value, options22) {
    let newValue2 = value;
    if (this.options.min != null && newValue2 < this.options.min) {
      newValue2 = this.options.min;
    }
    if (this.options.max != null && newValue2 > this.options.max) {
      newValue2 = this.options.max;
    }
    super.setValue(newValue2, options22);
  }
  /**
   * Draws the widget
   * @param ctx The canvas context
   * @param options The options for drawing the widget
   */
  drawWidget(ctx, {
    y,
    width: width2,
    show_text = true,
    margin = 15
  }) {
    const originalTextAlign = ctx.textAlign;
    const originalStrokeStyle = ctx.strokeStyle;
    const originalFillStyle = ctx.fillStyle;
    const { height } = this;
    ctx.textAlign = "left";
    ctx.strokeStyle = this.outline_color;
    ctx.fillStyle = this.background_color;
    ctx.beginPath();
    if (show_text)
      ctx.roundRect(margin, y, width2 - margin * 2, height, [height * 0.5]);
    else
      ctx.rect(margin, y, width2 - margin * 2, height);
    ctx.fill();
    if (show_text) {
      if (!this.disabled) {
        ctx.stroke();
        ctx.fillStyle = this.text_color;
        ctx.beginPath();
        ctx.moveTo(margin + 16, y + 5);
        ctx.lineTo(margin + 6, y + height * 0.5);
        ctx.lineTo(margin + 16, y + height - 5);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(width2 - margin - 16, y + 5);
        ctx.lineTo(width2 - margin - 6, y + height * 0.5);
        ctx.lineTo(width2 - margin - 16, y + height - 5);
        ctx.fill();
      }
      ctx.fillStyle = this.secondary_text_color;
      const label = this.label || this.name;
      if (label != null) {
        ctx.fillText(label, margin * 2 + 5, y + height * 0.7);
      }
      ctx.fillStyle = this.text_color;
      ctx.textAlign = "right";
      ctx.fillText(
        Number(this.value).toFixed(
          this.options.precision !== void 0 ? this.options.precision : 3
        ),
        width2 - margin * 2 - 20,
        y + height * 0.7
      );
    }
    ctx.textAlign = originalTextAlign;
    ctx.strokeStyle = originalStrokeStyle;
    ctx.fillStyle = originalFillStyle;
  }
  onClick(options) {
    const { e, node, canvas } = options;
    const x = e.canvasX - node.pos[0];
    const width = this.width || node.size[0];
    const delta = x < 40 ? -1 : x > width - 40 ? 1 : 0;
    if (delta) {
      this.setValue(this.value + delta * getWidgetStep(this.options), { e, node, canvas });
      return;
    }
    canvas.prompt("Value", this.value, (v) => {
      if (/^[\d\s()*+/-]+|\d+\.\d+$/.test(v)) {
        try {
          v = eval(v);
        } catch {
        }
      }
      const newValue = Number(v);
      if (!isNaN(newValue)) {
        this.setValue(newValue, { e, node, canvas });
      }
    }, e);
  }
  /**
   * Handles drag events for the number widget
   * @param options The options for handling the drag event
   */
  onDrag(options22) {
    var _a2;
    const { e: e2, node: node2, canvas: canvas2 } = options22;
    const width2 = this.width || node2.width;
    const x2 = e2.canvasX - node2.pos[0];
    const delta2 = x2 < 40 ? -1 : x2 > width2 - 40 ? 1 : 0;
    if (delta2 && (x2 > -3 && x2 < width2 + 3)) return;
    this.setValue(this.value + ((_a2 = e2.deltaX) != null ? _a2 : 0) * getWidgetStep(this.options), { e: e2, node: node2, canvas: canvas2 });
  }
};
var SliderWidget = class extends BaseWidget {
  constructor(widget) {
    super(widget);
    __publicField(this, "marker");
    this.type = "slider";
    this.value = widget.value;
    this.options = widget.options;
    this.marker = widget.marker;
  }
  /**
   * Draws the widget
   * @param ctx The canvas context
   * @param options The options for drawing the widget
   */
  drawWidget(ctx, {
    y,
    width: width2,
    show_text = true,
    margin = 15
  }) {
    var _a2, _b, _c;
    const originalTextAlign = ctx.textAlign;
    const originalStrokeStyle = ctx.strokeStyle;
    const originalFillStyle = ctx.fillStyle;
    const { height } = this;
    ctx.fillStyle = this.background_color;
    ctx.fillRect(margin, y, width2 - margin * 2, height);
    const range = this.options.max - this.options.min;
    let nvalue = (this.value - this.options.min) / range;
    nvalue = clamp(nvalue, 0, 1);
    ctx.fillStyle = (_a2 = this.options.slider_color) != null ? _a2 : "#678";
    ctx.fillRect(margin, y, nvalue * (width2 - margin * 2), height);
    if (show_text && !this.disabled) {
      ctx.strokeStyle = this.outline_color;
      ctx.strokeRect(margin, y, width2 - margin * 2, height);
    }
    if (this.marker != null) {
      let marker_nvalue = (this.marker - this.options.min) / range;
      marker_nvalue = clamp(marker_nvalue, 0, 1);
      ctx.fillStyle = (_b = this.options.marker_color) != null ? _b : "#AA9";
      ctx.fillRect(
        margin + marker_nvalue * (width2 - margin * 2),
        y,
        2,
        height
      );
    }
    if (show_text) {
      ctx.textAlign = "center";
      ctx.fillStyle = this.text_color;
      const fixedValue = Number(this.value).toFixed((_c = this.options.precision) != null ? _c : 3);
      ctx.fillText(
        `${this.label || this.name}  ${fixedValue}`,
        width2 * 0.5,
        y + height * 0.7
      );
    }
    ctx.textAlign = originalTextAlign;
    ctx.strokeStyle = originalStrokeStyle;
    ctx.fillStyle = originalFillStyle;
  }
  /**
   * Handles click events for the slider widget
   */
  onClick(options22) {
    if (this.options.read_only) return;
    const { e: e2, node: node2 } = options22;
    const width2 = this.width || node2.size[0];
    const x2 = e2.canvasX - node2.pos[0];
    const slideFactor = clamp((x2 - 15) / (width2 - 30), 0, 1);
    const newValue2 = this.options.min + (this.options.max - this.options.min) * slideFactor;
    if (newValue2 !== this.value) {
      this.setValue(newValue2, options22);
    }
  }
  /**
   * Handles drag events for the slider widget
   */
  onDrag(options22) {
    if (this.options.read_only) return false;
    const { e: e2, node: node2 } = options22;
    const width2 = this.width || node2.size[0];
    const x2 = e2.canvasX - node2.pos[0];
    const slideFactor = clamp((x2 - 15) / (width2 - 30), 0, 1);
    const newValue2 = this.options.min + (this.options.max - this.options.min) * slideFactor;
    if (newValue2 !== this.value) {
      this.setValue(newValue2, options22);
    }
  }
};
var TextWidget = class extends BaseWidget {
  constructor(widget) {
    var _a2, _b, _c;
    super(widget);
    this.type = (_a2 = widget.type) != null ? _a2 : "string";
    this.value = (_c = (_b = widget.value) == null ? void 0 : _b.toString()) != null ? _c : "";
  }
  /**
   * Draws the widget
   * @param ctx The canvas context
   * @param options The options for drawing the widget
   */
  drawWidget(ctx, {
    y,
    width: width2,
    show_text = true,
    margin = 15
  }) {
    const originalTextAlign = ctx.textAlign;
    const originalStrokeStyle = ctx.strokeStyle;
    const originalFillStyle = ctx.fillStyle;
    const { height } = this;
    ctx.textAlign = "left";
    ctx.strokeStyle = this.outline_color;
    ctx.fillStyle = this.background_color;
    ctx.beginPath();
    if (show_text)
      ctx.roundRect(margin, y, width2 - margin * 2, height, [height * 0.5]);
    else
      ctx.rect(margin, y, width2 - margin * 2, height);
    ctx.fill();
    if (show_text) {
      if (!this.disabled) ctx.stroke();
      ctx.save();
      ctx.beginPath();
      ctx.rect(margin, y, width2 - margin * 2, height);
      ctx.clip();
      ctx.fillStyle = this.secondary_text_color;
      const label = this.label || this.name;
      if (label != null) {
        ctx.fillText(label, margin * 2, y + height * 0.7);
      }
      ctx.fillStyle = this.text_color;
      ctx.textAlign = "right";
      ctx.fillText(
        // 30 chars max
        String(this.value).substr(0, 30),
        width2 - margin * 2,
        y + height * 0.7
      );
      ctx.restore();
    }
    ctx.textAlign = originalTextAlign;
    ctx.strokeStyle = originalStrokeStyle;
    ctx.fillStyle = originalFillStyle;
  }
  onClick(options22) {
    var _a2, _b;
    const { e: e2, node: node2, canvas: canvas2 } = options22;
    canvas2.prompt(
      "Value",
      this.value,
      (v2) => {
        if (v2 !== null) {
          this.setValue(v2, { e: e2, node: node2, canvas: canvas2 });
        }
      },
      e2,
      (_b = (_a2 = this.options) == null ? void 0 : _a2.multiline) != null ? _b : false
    );
  }
};
var WIDGET_TYPE_MAP = {
  // @ts-expect-error https://github.com/Comfy-Org/litegraph.js/issues/616
  button: ButtonWidget,
  // @ts-expect-error #616
  toggle: BooleanWidget,
  // @ts-expect-error #616
  slider: SliderWidget,
  // @ts-expect-error #616
  knob: KnobWidget,
  // @ts-expect-error #616
  combo: ComboWidget,
  // @ts-expect-error #616
  number: NumberWidget,
  // @ts-expect-error #616
  string: TextWidget,
  // @ts-expect-error #616
  text: TextWidget
};
var _renderArea, _boundingRect, _LGraphNode_instances, getErrorStrokeStyle_fn, getSelectedStrokeStyle_fn, findFreeSlot_fn, findSlotByType_fn, getMouseOverSlot_fn, isMouseOverSlot_fn;
var _LGraphNode = class _LGraphNode {
  constructor(title, type) {
    __privateAdd(this, _LGraphNode_instances);
    /** The title text of the node. */
    __publicField(this, "title");
    __publicField(this, "graph", null);
    __publicField(this, "id");
    __publicField(this, "type", "");
    __publicField(this, "inputs", []);
    __publicField(this, "outputs", []);
    // Not used
    __publicField(this, "connections", []);
    __publicField(this, "properties", {});
    __publicField(this, "properties_info", []);
    __publicField(this, "flags", {});
    __publicField(this, "widgets");
    /**
     * The amount of space available for widgets to grow into.
     * @see {@link layoutWidgets}
     */
    __publicField(this, "freeWidgetSpace");
    __publicField(this, "locked");
    /** Execution order, automatically computed during run @see {@link LGraph.computeExecutionOrder} */
    __publicField(this, "order", 0);
    __publicField(this, "mode", LGraphEventMode.ALWAYS);
    __publicField(this, "last_serialization");
    __publicField(this, "serialize_widgets");
    /**
     * The overridden fg color used to render the node.
     * @see {@link renderingColor}
     */
    __publicField(this, "color");
    /**
     * The overridden bg color used to render the node.
     * @see {@link renderingBgColor}
     */
    __publicField(this, "bgcolor");
    /**
     * The overridden box color used to render the node.
     * @see {@link renderingBoxColor}
     */
    __publicField(this, "boxcolor");
    /**
     * The stroke styles that should be applied to the node.
     */
    __publicField(this, "strokeStyles");
    /**
     * The progress of node execution. Used to render a progress bar. Value between 0 and 1.
     */
    __publicField(this, "progress");
    __publicField(this, "exec_version");
    __publicField(this, "action_call");
    __publicField(this, "execute_triggered");
    __publicField(this, "action_triggered");
    __publicField(this, "widgets_up");
    __publicField(this, "widgets_start_y");
    __publicField(this, "lostFocusAt");
    __publicField(this, "gotFocusAt");
    __publicField(this, "badges", []);
    __publicField(this, "badgePosition", BadgePosition.TopLeft);
    /**
     * The width of the node when collapsed.
     * Updated by {@link LGraphCanvas.drawNode}
     */
    __publicField(this, "_collapsed_width");
    __publicField(this, "console");
    __publicField(this, "_level");
    __publicField(this, "_shape");
    __publicField(this, "mouseOver");
    __publicField(this, "redraw_on_mouse");
    __publicField(this, "resizable");
    __publicField(this, "clonable");
    __publicField(this, "_relative_id");
    __publicField(this, "clip_area");
    __publicField(this, "ignore_remove");
    __publicField(this, "has_errors");
    __publicField(this, "removable");
    __publicField(this, "block_delete");
    __publicField(this, "selected");
    __publicField(this, "showAdvanced");
    /** @inheritdoc {@link renderArea} */
    __privateAdd(this, _renderArea, new Float32Array(4));
    /** @inheritdoc {@link boundingRect} */
    __privateAdd(this, _boundingRect, new Float32Array(4));
    /** {@link pos} and {@link size} values are backed by this {@link Rect}. */
    __publicField(this, "_posSize", new Float32Array(4));
    __publicField(this, "_pos", this._posSize.subarray(0, 2));
    __publicField(this, "_size", this._posSize.subarray(2, 4));
    this.id = LiteGraph.use_uuids ? LiteGraph.uuidv4() : -1;
    this.title = title || "Unnamed";
    this.type = type != null ? type : "";
    this.size = [LiteGraph.NODE_WIDTH, 60];
    this.pos = [10, 10];
    this.strokeStyles = {
      error: __privateMethod(this, _LGraphNode_instances, getErrorStrokeStyle_fn),
      selected: __privateMethod(this, _LGraphNode_instances, getSelectedStrokeStyle_fn)
    };
  }
  /**
   * The font style used to render the node's title text.
   */
  get titleFontStyle() {
    return `${LiteGraph.NODE_TEXT_SIZE}px Arial`;
  }
  get innerFontStyle() {
    return `normal ${LiteGraph.NODE_SUBTEXT_SIZE}px Arial`;
  }
  /** The fg color used to render the node. */
  get renderingColor() {
    return this.color || this.constructor.color || LiteGraph.NODE_DEFAULT_COLOR;
  }
  /** The bg color used to render the node. */
  get renderingBgColor() {
    return this.bgcolor || this.constructor.bgcolor || LiteGraph.NODE_DEFAULT_BGCOLOR;
  }
  /** The box color used to render the node. */
  get renderingBoxColor() {
    var _a2;
    if (this.boxcolor) return this.boxcolor;
    if (LiteGraph.node_box_coloured_when_on) {
      if (this.action_triggered) return "#FFF";
      if (this.execute_triggered) return "#AAA";
    }
    if (LiteGraph.node_box_coloured_by_mode) {
      const modeColour = LiteGraph.NODE_MODES_COLORS[(_a2 = this.mode) != null ? _a2 : LGraphEventMode.ALWAYS];
      if (modeColour) return modeColour;
    }
    return LiteGraph.NODE_DEFAULT_BOXCOLOR;
  }
  /** @inheritdoc {@link IColorable.setColorOption} */
  setColorOption(colorOption) {
    if (colorOption == null) {
      delete this.color;
      delete this.bgcolor;
    } else {
      this.color = colorOption.color;
      this.bgcolor = colorOption.bgcolor;
    }
  }
  /** @inheritdoc {@link IColorable.getColorOption} */
  getColorOption() {
    var _a2;
    return (_a2 = Object.values(LGraphCanvas.node_colors).find(
      (colorOption) => colorOption.color === this.color && colorOption.bgcolor === this.bgcolor
    )) != null ? _a2 : null;
  }
  /**
   * Rect describing the node area, including shadows and any protrusions.
   * Determines if the node is visible.  Calculated once at the start of every frame.
   */
  get renderArea() {
    return __privateGet(this, _renderArea);
  }
  /**
   * Cached node position & area as `x, y, width, height`.  Includes changes made by {@link onBounding}, if present.
   *
   * Determines the node hitbox and other rendering effects.  Calculated once at the start of every frame.
   */
  get boundingRect() {
    return __privateGet(this, _boundingRect);
  }
  get pos() {
    return this._pos;
  }
  /** Node position does not necessarily correlate to the top-left corner. */
  set pos(value) {
    if (!value || value.length < 2) return;
    this._pos[0] = value[0];
    this._pos[1] = value[1];
  }
  get size() {
    return this._size;
  }
  set size(value) {
    if (!value || value.length < 2) return;
    this._size[0] = value[0];
    this._size[1] = value[1];
  }
  /**
   * The size of the node used for rendering.
   */
  get renderingSize() {
    var _a2;
    return this.flags.collapsed ? [(_a2 = this._collapsed_width) != null ? _a2 : 0, 0] : this._size;
  }
  get shape() {
    return this._shape;
  }
  set shape(v2) {
    switch (v2) {
      case "default":
        delete this._shape;
        break;
      case "box":
        this._shape = RenderShape.BOX;
        break;
      case "round":
        this._shape = RenderShape.ROUND;
        break;
      case "circle":
        this._shape = RenderShape.CIRCLE;
        break;
      case "card":
        this._shape = RenderShape.CARD;
        break;
      default:
        this._shape = v2;
    }
  }
  /**
   * The shape of the node used for rendering. @see {@link RenderShape}
   */
  get renderingShape() {
    return this._shape || this.constructor.shape || LiteGraph.NODE_DEFAULT_SHAPE;
  }
  get is_selected() {
    return this.selected;
  }
  set is_selected(value) {
    this.selected = value;
  }
  get title_mode() {
    var _a2;
    return (_a2 = this.constructor.title_mode) != null ? _a2 : TitleMode.NORMAL_TITLE;
  }
  /**
   * configure a node from an object containing the serialized info
   */
  configure(info) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    if (this.graph) {
      this.graph._version++;
    }
    for (const j in info) {
      if (j == "properties") {
        for (const k in info.properties) {
          this.properties[k] = info.properties[k];
          (_a2 = this.onPropertyChanged) == null ? void 0 : _a2.call(this, k, info.properties[k]);
        }
        continue;
      }
      if (info[j] == null) {
        continue;
      } else if (typeof info[j] == "object") {
        if ((_b = this[j]) == null ? void 0 : _b.configure) {
          (_c = this[j]) == null ? void 0 : _c.configure(info[j]);
        } else {
          this[j] = LiteGraph.cloneObject(info[j], this[j]);
        }
      } else {
        this[j] = info[j];
      }
    }
    if (!info.title) {
      this.title = this.constructor.title;
    }
    (_d = this.inputs) != null ? _d : this.inputs = [];
    this.inputs = this.inputs.map((input) => toClass(NodeInputSlot, input));
    for (const [i, input] of this.inputs.entries()) {
      const link2 = this.graph && input.link != null ? this.graph._links.get(input.link) : null;
      (_e = this.onConnectionsChange) == null ? void 0 : _e.call(this, NodeSlotType.INPUT, i, true, link2, input);
      (_f = this.onInputAdded) == null ? void 0 : _f.call(this, input);
    }
    (_g = this.outputs) != null ? _g : this.outputs = [];
    this.outputs = this.outputs.map((output) => toClass(NodeOutputSlot, output));
    for (const [i, output] of this.outputs.entries()) {
      if (!output.links) continue;
      for (const linkId of output.links) {
        const link2 = this.graph ? this.graph._links.get(linkId) : null;
        (_h = this.onConnectionsChange) == null ? void 0 : _h.call(this, NodeSlotType.OUTPUT, i, true, link2, output);
      }
      (_i = this.onOutputAdded) == null ? void 0 : _i.call(this, output);
    }
    if (this.widgets) {
      for (const w of this.widgets) {
        if (!w) continue;
        if (((_j = w.options) == null ? void 0 : _j.property) && this.properties[w.options.property] != void 0)
          w.value = JSON.parse(JSON.stringify(this.properties[w.options.property]));
      }
      if (info.widgets_values) {
        for (let i = 0; i < info.widgets_values.length; ++i) {
          const widget = this.widgets[i];
          if (widget) {
            widget.value = info.widgets_values[i];
          }
        }
      }
    }
    if (this.pinned) this.resizable = false;
    (_k = this.onConfigure) == null ? void 0 : _k.call(this, info);
  }
  /**
   * serialize the content
   */
  serialize() {
    var _a2;
    const o = {
      id: this.id,
      type: this.type,
      pos: [this.pos[0], this.pos[1]],
      size: [this.size[0], this.size[1]],
      flags: LiteGraph.cloneObject(this.flags),
      order: this.order,
      mode: this.mode,
      showAdvanced: this.showAdvanced
    };
    if (this.constructor === _LGraphNode && this.last_serialization)
      return this.last_serialization;
    if (this.inputs) o.inputs = this.inputs.map((input) => inputAsSerialisable(input));
    if (this.outputs) o.outputs = this.outputs.map((output) => outputAsSerialisable(output));
    if (this.title && this.title != this.constructor.title) o.title = this.title;
    if (this.properties) o.properties = LiteGraph.cloneObject(this.properties);
    const { widgets } = this;
    if (widgets && this.serialize_widgets) {
      o.widgets_values = [];
      for (const [i, widget] of widgets.entries()) {
        o.widgets_values[i] = widget ? widget.value : null;
      }
    }
    if (!o.type) o.type = this.constructor.type;
    if (this.color) o.color = this.color;
    if (this.bgcolor) o.bgcolor = this.bgcolor;
    if (this.boxcolor) o.boxcolor = this.boxcolor;
    if (this.shape) o.shape = this.shape;
    if ((_a2 = this.onSerialize) == null ? void 0 : _a2.call(this, o)) console.warn("node onSerialize shouldnt return anything, data should be stored in the object pass in the first parameter");
    return o;
  }
  /* Creates a clone of this node */
  clone() {
    if (this.type == null) return null;
    const node2 = LiteGraph.createNode(this.type);
    if (!node2) return null;
    const data = LiteGraph.cloneObject(this.serialize());
    const { inputs, outputs } = data;
    if (inputs) {
      for (const input of inputs) {
        input.link = null;
      }
    }
    if (outputs) {
      for (const { links } of outputs) {
        if (links) links.length = 0;
      }
    }
    delete data.id;
    if (LiteGraph.use_uuids) data.id = LiteGraph.uuidv4();
    node2.configure(data);
    return node2;
  }
  /**
   * serialize and stringify
   */
  toString() {
    return JSON.stringify(this.serialize());
  }
  /**
   * get the title string
   */
  getTitle() {
    return this.title || this.constructor.title;
  }
  /**
   * sets the value of a property
   * @param name
   * @param value
   */
  setProperty(name, value) {
    var _a2;
    this.properties || (this.properties = {});
    if (value === this.properties[name]) return;
    const prev_value = this.properties[name];
    this.properties[name] = value;
    if (((_a2 = this.onPropertyChanged) == null ? void 0 : _a2.call(this, name, value, prev_value)) === false)
      this.properties[name] = prev_value;
    if (this.widgets) {
      for (const w of this.widgets) {
        if (!w) continue;
        if (w.options.property == name) {
          w.value = value;
          break;
        }
      }
    }
  }
  /**
   * sets the output data
   * @param slot
   * @param data
   */
  setOutputData(slot, data) {
    const { outputs } = this;
    if (!outputs) return;
    if (slot == -1 || slot >= outputs.length) return;
    const output_info = outputs[slot];
    if (!output_info) return;
    output_info._data = data;
    if (!this.graph) throw new NullGraphError();
    const { links } = outputs[slot];
    if (links) {
      for (const id of links) {
        const link2 = this.graph._links.get(id);
        if (link2) link2.data = data;
      }
    }
  }
  /**
   * sets the output data type, useful when you want to be able to overwrite the data type
   */
  setOutputDataType(slot, type) {
    const { outputs } = this;
    if (!outputs || (slot == -1 || slot >= outputs.length)) return;
    const output_info = outputs[slot];
    if (!output_info) return;
    output_info.type = type;
    if (!this.graph) throw new NullGraphError();
    const { links } = outputs[slot];
    if (links) {
      for (const id of links) {
        const link2 = this.graph._links.get(id);
        if (link2) link2.type = type;
      }
    }
  }
  /**
   * Retrieves the input data (data traveling through the connection) from one slot
   * @param slot
   * @param force_update if set to true it will force the connected node of this slot to output data into this link
   * @returns data or if it is not connected returns undefined
   */
  getInputData(slot, force_update) {
    var _a2;
    if (!this.inputs) return;
    if (slot >= this.inputs.length || this.inputs[slot].link == null) return;
    if (!this.graph) throw new NullGraphError();
    const link_id = this.inputs[slot].link;
    const link2 = this.graph._links.get(link_id);
    if (!link2) return null;
    if (!force_update) return link2.data;
    const node2 = this.graph.getNodeById(link2.origin_id);
    if (!node2) return link2.data;
    if (node2.updateOutputData) {
      node2.updateOutputData(link2.origin_slot);
    } else {
      (_a2 = node2.onExecute) == null ? void 0 : _a2.call(node2);
    }
    return link2.data;
  }
  /**
   * Retrieves the input data type (in case this supports multiple input types)
   * @param slot
   * @returns datatype in string format
   */
  getInputDataType(slot) {
    if (!this.inputs) return null;
    if (slot >= this.inputs.length || this.inputs[slot].link == null) return null;
    if (!this.graph) throw new NullGraphError();
    const link_id = this.inputs[slot].link;
    const link2 = this.graph._links.get(link_id);
    if (!link2) return null;
    const node2 = this.graph.getNodeById(link2.origin_id);
    if (!node2) return link2.type;
    const output_info = node2.outputs[link2.origin_slot];
    return output_info ? output_info.type : null;
  }
  /**
   * Retrieves the input data from one slot using its name instead of slot number
   * @param slot_name
   * @param force_update if set to true it will force the connected node of this slot to output data into this link
   * @returns data or if it is not connected returns null
   */
  getInputDataByName(slot_name, force_update) {
    const slot = this.findInputSlot(slot_name);
    return slot == -1 ? null : this.getInputData(slot, force_update);
  }
  /**
   * tells you if there is a connection in one input slot
   * @param slot The 0-based index of the input to check
   * @returns `true` if the input slot has a link ID (does not perform validation)
   */
  isInputConnected(slot) {
    if (!this.inputs) return false;
    return slot < this.inputs.length && this.inputs[slot].link != null;
  }
  /**
   * tells you info about an input connection (which node, type, etc)
   * @returns object or null { link: id, name: string, type: string or 0 }
   */
  getInputInfo(slot) {
    return !this.inputs || !(slot < this.inputs.length) ? null : this.inputs[slot];
  }
  /**
   * Returns the link info in the connection of an input slot
   * @returns object or null
   */
  getInputLink(slot) {
    var _a2;
    if (!this.inputs) return null;
    if (slot < this.inputs.length) {
      if (!this.graph) throw new NullGraphError();
      const input = this.inputs[slot];
      if (input.link != null) {
        return (_a2 = this.graph._links.get(input.link)) != null ? _a2 : null;
      }
    }
    return null;
  }
  /**
   * returns the node connected in the input slot
   * @returns node or null
   */
  getInputNode(slot) {
    if (!this.inputs) return null;
    if (slot >= this.inputs.length) return null;
    const input = this.inputs[slot];
    if (!input || input.link === null) return null;
    if (!this.graph) throw new NullGraphError();
    const link_info = this.graph._links.get(input.link);
    if (!link_info) return null;
    return this.graph.getNodeById(link_info.origin_id);
  }
  /**
   * returns the value of an input with this name, otherwise checks if there is a property with that name
   * @returns value
   */
  getInputOrProperty(name) {
    const { inputs } = this;
    if (!(inputs == null ? void 0 : inputs.length)) {
      return this.properties ? this.properties[name] : null;
    }
    if (!this.graph) throw new NullGraphError();
    for (const input of inputs) {
      if (name == input.name && input.link != null) {
        const link2 = this.graph._links.get(input.link);
        if (link2) return link2.data;
      }
    }
    return this.properties[name];
  }
  /**
   * tells you the last output data that went in that slot
   * @returns object or null
   */
  getOutputData(slot) {
    if (!this.outputs) return null;
    if (slot >= this.outputs.length) return null;
    const info = this.outputs[slot];
    return info._data;
  }
  /**
   * tells you info about an output connection (which node, type, etc)
   * @returns object or null { name: string, type: string, links: [ ids of links in number ] }
   */
  getOutputInfo(slot) {
    return !this.outputs || !(slot < this.outputs.length) ? null : this.outputs[slot];
  }
  /**
   * tells you if there is a connection in one output slot
   */
  isOutputConnected(slot) {
    var _a2;
    if (!this.outputs) return false;
    return slot < this.outputs.length && Number((_a2 = this.outputs[slot].links) == null ? void 0 : _a2.length) > 0;
  }
  /**
   * tells you if there is any connection in the output slots
   */
  isAnyOutputConnected() {
    var _a2;
    const { outputs } = this;
    if (!outputs) return false;
    for (const output of outputs) {
      if ((_a2 = output.links) == null ? void 0 : _a2.length) return true;
    }
    return false;
  }
  /**
   * retrieves all the nodes connected to this output slot
   */
  getOutputNodes(slot) {
    const { outputs } = this;
    if (!outputs || outputs.length == 0) return null;
    if (slot >= outputs.length) return null;
    const { links } = outputs[slot];
    if (!links || links.length == 0) return null;
    if (!this.graph) throw new NullGraphError();
    const r = [];
    for (const id of links) {
      const link2 = this.graph._links.get(id);
      if (link2) {
        const target_node = this.graph.getNodeById(link2.target_id);
        if (target_node) {
          r.push(target_node);
        }
      }
    }
    return r;
  }
  addOnTriggerInput() {
    const trigS = this.findInputSlot("onTrigger");
    if (trigS == -1) {
      this.addInput("onTrigger", LiteGraph.EVENT, {
        nameLocked: true
      });
      return this.findInputSlot("onTrigger");
    }
    return trigS;
  }
  addOnExecutedOutput() {
    const trigS = this.findOutputSlot("onExecuted");
    if (trigS == -1) {
      this.addOutput("onExecuted", LiteGraph.ACTION, {
        nameLocked: true
      });
      return this.findOutputSlot("onExecuted");
    }
    return trigS;
  }
  onAfterExecuteNode(param, options22) {
    const trigS = this.findOutputSlot("onExecuted");
    if (trigS != -1) {
      this.triggerSlot(trigS, param, null, options22);
    }
  }
  changeMode(modeTo) {
    switch (modeTo) {
      case LGraphEventMode.ON_EVENT:
        break;
      case LGraphEventMode.ON_TRIGGER:
        this.addOnTriggerInput();
        this.addOnExecutedOutput();
        break;
      case LGraphEventMode.NEVER:
        break;
      case LGraphEventMode.ALWAYS:
        break;
      // @ts-expect-error Not impl.
      case LiteGraph.ON_REQUEST:
        break;
      default:
        return false;
    }
    this.mode = modeTo;
    return true;
  }
  /**
   * Triggers the node code execution, place a boolean/counter to mark the node as being executed
   */
  doExecute(param, options22) {
    var _a2;
    options22 = options22 || {};
    if (this.onExecute) {
      options22.action_call || (options22.action_call = `${this.id}_exec_${Math.floor(Math.random() * 9999)}`);
      if (!this.graph) throw new NullGraphError();
      this.graph.nodes_executing[this.id] = true;
      this.onExecute(param, options22);
      this.graph.nodes_executing[this.id] = false;
      this.exec_version = this.graph.iteration;
      if (options22 == null ? void 0 : options22.action_call) {
        this.action_call = options22.action_call;
        this.graph.nodes_executedAction[this.id] = options22.action_call;
      }
    }
    this.execute_triggered = 2;
    (_a2 = this.onAfterExecuteNode) == null ? void 0 : _a2.call(this, param, options22);
  }
  /**
   * Triggers an action, wrapped by logics to control execution flow
   * @param action name
   */
  actionDo(action, param, options22) {
    var _a2;
    options22 = options22 || {};
    if (this.onAction) {
      options22.action_call || (options22.action_call = `${this.id}_${action || "action"}_${Math.floor(Math.random() * 9999)}`);
      if (!this.graph) throw new NullGraphError();
      this.graph.nodes_actioning[this.id] = action || "actioning";
      this.onAction(action, param, options22);
      this.graph.nodes_actioning[this.id] = false;
      if (options22 == null ? void 0 : options22.action_call) {
        this.action_call = options22.action_call;
        this.graph.nodes_executedAction[this.id] = options22.action_call;
      }
    }
    this.action_triggered = 2;
    (_a2 = this.onAfterExecuteNode) == null ? void 0 : _a2.call(this, param, options22);
  }
  /**
   * Triggers an event in this node, this will trigger any output with the same name
   * @param action name ( "on_play", ... ) if action is equivalent to false then the event is send to all
   */
  trigger(action, param, options22) {
    const { outputs } = this;
    if (!outputs || !outputs.length) {
      return;
    }
    if (this.graph) this.graph._last_trigger_time = LiteGraph.getTime();
    for (const [i, output] of outputs.entries()) {
      if (!output || output.type !== LiteGraph.EVENT || action && output.name != action) {
        continue;
      }
      this.triggerSlot(i, param, null, options22);
    }
  }
  /**
   * Triggers a slot event in this node: cycle output slots and launch execute/action on connected nodes
   * @param slot the index of the output slot
   * @param link_id [optional] in case you want to trigger and specific output link in a slot
   */
  triggerSlot(slot, param, link_id, options22) {
    var _a2;
    options22 = options22 || {};
    if (!this.outputs) return;
    if (slot == null) {
      console.error("slot must be a number");
      return;
    }
    if (typeof slot !== "number")
      console.warn("slot must be a number, use node.trigger('name') if you want to use a string");
    const output = this.outputs[slot];
    if (!output) return;
    const links = output.links;
    if (!links || !links.length) return;
    if (!this.graph) throw new NullGraphError();
    this.graph._last_trigger_time = LiteGraph.getTime();
    for (const id of links) {
      if (link_id != null && link_id != id) continue;
      const link_info = this.graph._links.get(id);
      if (!link_info) continue;
      link_info._last_time = LiteGraph.getTime();
      const node2 = this.graph.getNodeById(link_info.target_id);
      if (!node2) continue;
      if (node2.mode === LGraphEventMode.ON_TRIGGER) {
        if (!options22.action_call)
          options22.action_call = `${this.id}_trigg_${Math.floor(Math.random() * 9999)}`;
        (_a2 = node2.doExecute) == null ? void 0 : _a2.call(node2, param, options22);
      } else if (node2.onAction) {
        if (!options22.action_call)
          options22.action_call = `${this.id}_act_${Math.floor(Math.random() * 9999)}`;
        const target_connection = node2.inputs[link_info.target_slot];
        node2.actionDo(target_connection.name, param, options22);
      }
    }
  }
  /**
   * clears the trigger slot animation
   * @param slot the index of the output slot
   * @param link_id [optional] in case you want to trigger and specific output link in a slot
   */
  clearTriggeredSlot(slot, link_id) {
    if (!this.outputs) return;
    const output = this.outputs[slot];
    if (!output) return;
    const links = output.links;
    if (!links || !links.length) return;
    if (!this.graph) throw new NullGraphError();
    for (const id of links) {
      if (link_id != null && link_id != id) continue;
      const link_info = this.graph._links.get(id);
      if (!link_info) continue;
      link_info._last_time = 0;
    }
  }
  /**
   * changes node size and triggers callback
   */
  setSize(size) {
    var _a2;
    this.size = size;
    (_a2 = this.onResize) == null ? void 0 : _a2.call(this, this.size);
  }
  /**
   * Expands the node size to fit its content.
   */
  expandToFitContent() {
    const newSize = this.computeSize();
    this.setSize([
      Math.max(this.size[0], newSize[0]),
      Math.max(this.size[1], newSize[1])
    ]);
  }
  /**
   * add a new property to this node
   * @param type string defining the output type ("vec3","number",...)
   * @param extra_info this can be used to have special properties of the property (like values, etc)
   */
  addProperty(name, default_value, type, extra_info) {
    const o = { name, type, default_value };
    if (extra_info) Object.assign(o, extra_info);
    this.properties_info || (this.properties_info = []);
    this.properties_info.push(o);
    this.properties || (this.properties = {});
    this.properties[name] = default_value;
    return o;
  }
  /**
   * add a new output slot to use in this node
   * @param type string defining the output type ("vec3","number",...)
   * @param extra_info this can be used to have special properties of an output (label, special color, position, etc)
   */
  addOutput(name, type, extra_info) {
    var _a2;
    const output = new NodeOutputSlot({ name, type, links: null });
    if (extra_info) Object.assign(output, extra_info);
    this.outputs || (this.outputs = []);
    this.outputs.push(output);
    (_a2 = this.onOutputAdded) == null ? void 0 : _a2.call(this, output);
    if (LiteGraph.auto_load_slot_types)
      LiteGraph.registerNodeAndSlotType(this, type, true);
    this.expandToFitContent();
    this.setDirtyCanvas(true, true);
    return output;
  }
  /**
   * add a new output slot to use in this node
   * @param array of triplets like [[name,type,extra_info],[...]]
   */
  addOutputs(array) {
    var _a2;
    for (const info of array) {
      const o = new NodeOutputSlot({ name: info[0], type: info[1], links: null });
      if (array[2]) Object.assign(o, info[2]);
      this.outputs || (this.outputs = []);
      this.outputs.push(o);
      (_a2 = this.onOutputAdded) == null ? void 0 : _a2.call(this, o);
      if (LiteGraph.auto_load_slot_types)
        LiteGraph.registerNodeAndSlotType(this, info[1], true);
    }
    this.expandToFitContent();
    this.setDirtyCanvas(true, true);
  }
  /**
   * remove an existing output slot
   */
  removeOutput(slot) {
    var _a2;
    this.disconnectOutput(slot);
    const { outputs } = this;
    outputs.splice(slot, 1);
    for (let i = slot; i < outputs.length; ++i) {
      const output = outputs[i];
      if (!output || !output.links) continue;
      for (const linkId of output.links) {
        if (!this.graph) throw new NullGraphError();
        const link2 = this.graph._links.get(linkId);
        if (link2) link2.origin_slot--;
      }
    }
    (_a2 = this.onOutputRemoved) == null ? void 0 : _a2.call(this, slot);
    this.setDirtyCanvas(true, true);
  }
  /**
   * add a new input slot to use in this node
   * @param type string defining the input type ("vec3","number",...), it its a generic one use 0
   * @param extra_info this can be used to have special properties of an input (label, color, position, etc)
   */
  addInput(name, type, extra_info) {
    var _a2;
    type = type || 0;
    const input = new NodeInputSlot({ name, type, link: null });
    if (extra_info) Object.assign(input, extra_info);
    this.inputs || (this.inputs = []);
    this.inputs.push(input);
    this.expandToFitContent();
    (_a2 = this.onInputAdded) == null ? void 0 : _a2.call(this, input);
    LiteGraph.registerNodeAndSlotType(this, type);
    this.setDirtyCanvas(true, true);
    return input;
  }
  /**
   * add several new input slots in this node
   * @param array of triplets like [[name,type,extra_info],[...]]
   */
  addInputs(array) {
    var _a2;
    for (const info of array) {
      const o = new NodeInputSlot({ name: info[0], type: info[1], link: null });
      if (array[2]) Object.assign(o, info[2]);
      this.inputs || (this.inputs = []);
      this.inputs.push(o);
      (_a2 = this.onInputAdded) == null ? void 0 : _a2.call(this, o);
      LiteGraph.registerNodeAndSlotType(this, info[1]);
    }
    this.expandToFitContent();
    this.setDirtyCanvas(true, true);
  }
  /**
   * remove an existing input slot
   */
  removeInput(slot) {
    var _a2;
    this.disconnectInput(slot, true);
    const { inputs } = this;
    const slot_info = inputs.splice(slot, 1);
    for (let i = slot; i < inputs.length; ++i) {
      const input = inputs[i];
      if (!(input == null ? void 0 : input.link)) continue;
      if (!this.graph) throw new NullGraphError();
      const link2 = this.graph._links.get(input.link);
      if (link2) link2.target_slot--;
    }
    (_a2 = this.onInputRemoved) == null ? void 0 : _a2.call(this, slot, slot_info[0]);
    this.setDirtyCanvas(true, true);
  }
  /**
   * add an special connection to this node (used for special kinds of graphs)
   * @param type string defining the input type ("vec3","number",...)
   * @param pos position of the connection inside the node
   * @param direction if is input or output
   */
  addConnection(name, type, pos, direction) {
    const o = {
      name,
      type,
      pos,
      direction,
      links: null
    };
    this.connections.push(o);
    return o;
  }
  /**
   * computes the minimum size of a node according to its inputs and output slots
   * @returns the total size
   */
  computeSize(out) {
    var _a2, _b;
    const ctorSize = this.constructor.size;
    if (ctorSize) return [ctorSize[0], ctorSize[1]];
    const { inputs, outputs } = this;
    let rows = Math.max(
      inputs ? inputs.filter((input) => !isWidgetInputSlot(input)).length : 1,
      outputs ? outputs.length : 1
    );
    const size = out || new Float32Array([0, 0]);
    rows = Math.max(rows, 1);
    const font_size = LiteGraph.NODE_TEXT_SIZE;
    const title_width = compute_text_size(this.title);
    let input_width = 0;
    let output_width = 0;
    if (inputs) {
      for (const input of inputs) {
        const text2 = input.label || input.localized_name || input.name || "";
        const text_width = compute_text_size(text2);
        if (input_width < text_width)
          input_width = text_width;
      }
    }
    if (outputs) {
      for (const output of outputs) {
        const text2 = output.label || output.localized_name || output.name || "";
        const text_width = compute_text_size(text2);
        if (output_width < text_width)
          output_width = text_width;
      }
    }
    size[0] = Math.max(input_width + output_width + 10, title_width);
    size[0] = Math.max(size[0], LiteGraph.NODE_WIDTH);
    if ((_a2 = this.widgets) == null ? void 0 : _a2.length)
      size[0] = Math.max(size[0], LiteGraph.NODE_WIDTH * 1.5);
    size[1] = (this.constructor.slot_start_y || 0) + rows * LiteGraph.NODE_SLOT_HEIGHT;
    let widgets_height = 0;
    if ((_b = this.widgets) == null ? void 0 : _b.length) {
      for (const widget of this.widgets) {
        if (widget.hidden || widget.advanced && !this.showAdvanced) continue;
        let widget_height = 0;
        if (widget.computeSize) {
          widget_height += widget.computeSize(size[0])[1];
        } else if (widget.computeLayoutSize) {
          widget_height += widget.computeLayoutSize(this).minHeight;
        } else {
          widget_height += LiteGraph.NODE_WIDGET_HEIGHT;
        }
        widgets_height += widget_height + 4;
      }
      widgets_height += 8;
    }
    if (this.widgets_up)
      size[1] = Math.max(size[1], widgets_height);
    else if (this.widgets_start_y != null)
      size[1] = Math.max(size[1], widgets_height + this.widgets_start_y);
    else
      size[1] += widgets_height;
    function compute_text_size(text2) {
      return text2 ? font_size * text2.length * 0.6 : 0;
    }
    if (this.constructor.min_height && size[1] < this.constructor.min_height) {
      size[1] = this.constructor.min_height;
    }
    size[1] += 6;
    return size;
  }
  inResizeCorner(canvasX, canvasY) {
    const rows = this.outputs ? this.outputs.length : 1;
    const outputs_offset = (this.constructor.slot_start_y || 0) + rows * LiteGraph.NODE_SLOT_HEIGHT;
    return isInRectangle(
      canvasX,
      canvasY,
      this.pos[0] + this.size[0] - 15,
      this.pos[1] + Math.max(this.size[1] - 15, outputs_offset),
      20,
      20
    );
  }
  /**
   * returns all the info available about a property of this node.
   * @param property name of the property
   * @returns the object with all the available info
   */
  getPropertyInfo(property) {
    var _a2;
    let info = null;
    const { properties_info } = this;
    if (properties_info) {
      for (const propInfo of properties_info) {
        if (propInfo.name == property) {
          info = propInfo;
          break;
        }
      }
    }
    if (this.constructor[`@${property}`]) info = this.constructor[`@${property}`];
    if ((_a2 = this.constructor.widgets_info) == null ? void 0 : _a2[property])
      info = this.constructor.widgets_info[property];
    if (!info && this.onGetPropertyInfo) {
      info = this.onGetPropertyInfo(property);
    }
    info || (info = {});
    info.type || (info.type = typeof this.properties[property]);
    if (info.widget == "combo") info.type = "enum";
    return info;
  }
  /**
   * Defines a widget inside the node, it will be rendered on top of the node, you can control lots of properties
   * @param type the widget type
   * @param name the text to show on the widget
   * @param value the default value
   * @param callback function to call when it changes (optionally, it can be the name of the property to modify)
   * @param options the object that contains special properties of this widget
   * @returns the created widget object
   */
  addWidget(type, name, value, callback, options22) {
    this.widgets || (this.widgets = []);
    if (!options22 && callback && typeof callback === "object") {
      options22 = callback;
      callback = null;
    }
    options22 || (options22 = {});
    if (typeof options22 === "string")
      options22 = { property: options22 };
    if (callback && typeof callback === "string") {
      options22.property = callback;
      callback = null;
    }
    const w = {
      // @ts-expect-error Type check or just assert?
      type: type.toLowerCase(),
      name,
      value,
      callback: typeof callback !== "function" ? void 0 : callback,
      options: options22,
      y: 0
    };
    if (w.options.y !== void 0) {
      w.y = w.options.y;
    }
    if (!callback && !w.options.callback && !w.options.property) {
      console.warn("LiteGraph addWidget(...) without a callback or property assigned");
    }
    if (type == "combo" && !w.options.values) {
      throw "LiteGraph addWidget('combo',...) requires to pass values in options: { values:['red','blue'] }";
    }
    const widget = this.addCustomWidget(w);
    this.expandToFitContent();
    return widget;
  }
  addCustomWidget(custom_widget) {
    this.widgets || (this.widgets = []);
    const WidgetClass = WIDGET_TYPE_MAP[custom_widget.type];
    const widget = WidgetClass ? new WidgetClass(custom_widget) : custom_widget;
    this.widgets.push(widget);
    return widget;
  }
  move(deltaX, deltaY) {
    if (this.pinned) return;
    this.pos[0] += deltaX;
    this.pos[1] += deltaY;
  }
  /**
   * Internal method to measure the node for rendering.  Prefer {@link boundingRect} where possible.
   *
   * Populates {@link out} with the results in graph space.
   * Populates {@link _collapsed_width} with the collapsed width if the node is collapsed.
   * Adjusts for title and collapsed status, but does not call {@link onBounding}.
   * @param out `x, y, width, height` are written to this array.
   * @param ctx The canvas context to use for measuring text.
   */
  measure(out, ctx) {
    var _a2, _b;
    const titleMode = this.title_mode;
    const renderTitle = titleMode != TitleMode.TRANSPARENT_TITLE && titleMode != TitleMode.NO_TITLE;
    const titleHeight = renderTitle ? LiteGraph.NODE_TITLE_HEIGHT : 0;
    out[0] = this.pos[0];
    out[1] = this.pos[1] + -titleHeight;
    if (!((_a2 = this.flags) == null ? void 0 : _a2.collapsed)) {
      out[2] = this.size[0];
      out[3] = this.size[1] + titleHeight;
    } else {
      ctx.font = this.innerFontStyle;
      this._collapsed_width = Math.min(
        this.size[0],
        ctx.measureText((_b = this.getTitle()) != null ? _b : "").width + LiteGraph.NODE_TITLE_HEIGHT * 2
      );
      out[2] = this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH;
      out[3] = LiteGraph.NODE_TITLE_HEIGHT;
    }
  }
  /**
   * returns the bounding of the object, used for rendering purposes
   * @param out {Float32Array[4]?} [optional] a place to store the output, to free garbage
   * @param includeExternal {boolean?} [optional] set to true to
   * include the shadow and connection points in the bounding calculation
   * @returns the bounding box in format of [topleft_cornerx, topleft_cornery, width, height]
   */
  getBounding(out, includeExternal) {
    out || (out = new Float32Array(4));
    const rect = includeExternal ? this.renderArea : this.boundingRect;
    out[0] = rect[0];
    out[1] = rect[1];
    out[2] = rect[2];
    out[3] = rect[3];
    return out;
  }
  /**
   * Calculates the render area of this node, populating both {@link boundingRect} and {@link renderArea}.
   * Called automatically at the start of every frame.
   */
  updateArea(ctx) {
    var _a2;
    const bounds = __privateGet(this, _boundingRect);
    this.measure(bounds, ctx);
    (_a2 = this.onBounding) == null ? void 0 : _a2.call(this, bounds);
    const renderArea = __privateGet(this, _renderArea);
    renderArea.set(bounds);
    renderArea[0] -= 4;
    renderArea[1] -= 4;
    renderArea[2] += 6 + 4;
    renderArea[3] += 5 + 4;
  }
  /**
   * checks if a point is inside the shape of a node
   */
  isPointInside(x2, y) {
    return isInRect(x2, y, this.boundingRect);
  }
  /**
   * Checks if the provided point is inside this node's collapse button area.
   * @param x X co-ordinate to check
   * @param y Y co-ordinate to check
   * @returns true if the x,y point is in the collapse button area, otherwise false
   */
  isPointInCollapse(x2, y) {
    const squareLength = LiteGraph.NODE_TITLE_HEIGHT;
    return isInRectangle(
      x2,
      y,
      this.pos[0],
      this.pos[1] - squareLength,
      squareLength,
      squareLength
    );
  }
  /**
   * Returns the input slot at the given position. Uses full 20 height, and approximates the label length.
   * @param pos The graph co-ordinates to check
   * @returns The input slot at the given position if found, otherwise `undefined`.
   */
  getInputOnPos(pos) {
    var _a2;
    return (_a2 = getNodeInputOnPos(this, pos[0], pos[1])) == null ? void 0 : _a2.input;
  }
  /**
   * Returns the output slot at the given position. Uses full 20x20 box for the slot.
   * @param pos The graph co-ordinates to check
   * @returns The output slot at the given position if found, otherwise `undefined`.
   */
  getOutputOnPos(pos) {
    var _a2;
    return (_a2 = getNodeOutputOnPos(this, pos[0], pos[1])) == null ? void 0 : _a2.output;
  }
  /**
   * Returns the input or output slot at the given position.
   *
   * Tries {@link getNodeInputOnPos} first, then {@link getNodeOutputOnPos}.
   * @param pos The graph co-ordinates to check
   * @returns The input or output slot at the given position if found, otherwise `undefined`.
   */
  getSlotOnPos(pos) {
    var _a2;
    if (!isPointInRect(pos, this.boundingRect)) return;
    return (_a2 = this.getInputOnPos(pos)) != null ? _a2 : this.getOutputOnPos(pos);
  }
  /**
   * @deprecated Use {@link getSlotOnPos} instead.
   * checks if a point is inside a node slot, and returns info about which slot
   * @param x
   * @param y
   * @returns if found the object contains { input|output: slot object, slot: number, link_pos: [x,y] }
   */
  getSlotInPosition(x2, y) {
    const { inputs, outputs } = this;
    if (inputs) {
      for (const [i, input] of inputs.entries()) {
        const pos = this.getInputPos(i);
        if (isInRectangle(x2, y, pos[0] - 10, pos[1] - 10, 20, 20)) {
          return { input, slot: i, link_pos: pos };
        }
      }
    }
    if (outputs) {
      for (const [i, output] of outputs.entries()) {
        const pos = this.getOutputPos(i);
        if (isInRectangle(x2, y, pos[0] - 10, pos[1] - 10, 20, 20)) {
          return { output, slot: i, link_pos: pos };
        }
      }
    }
    return null;
  }
  /**
   * Gets the widget on this node at the given co-ordinates.
   * @param canvasX X co-ordinate in graph space
   * @param canvasY Y co-ordinate in graph space
   * @returns The widget found, otherwise `null`
   */
  getWidgetOnPos(canvasX, canvasY, includeDisabled = false) {
    var _a2, _b, _c;
    const { widgets, pos, size } = this;
    if (!(widgets == null ? void 0 : widgets.length)) return null;
    const x2 = canvasX - pos[0];
    const y = canvasY - pos[1];
    const nodeWidth = size[0];
    for (const widget of widgets) {
      if (widget.disabled && !includeDisabled || widget.hidden || widget.advanced && !this.showAdvanced) {
        continue;
      }
      const h = (_c = (_b = widget.computedHeight) != null ? _b : (_a2 = widget.computeSize) == null ? void 0 : _a2.call(widget, nodeWidth)[1]) != null ? _c : LiteGraph.NODE_WIDGET_HEIGHT;
      const w = widget.width || nodeWidth;
      if (widget.last_y !== void 0 && isInRectangle(x2, y, 6, widget.last_y, w - 12, h)) {
        return widget;
      }
    }
    return null;
  }
  findInputSlot(name, returnObj = false) {
    const { inputs } = this;
    if (!inputs) return -1;
    for (const [i, input] of inputs.entries()) {
      if (name == input.name) {
        return !returnObj ? i : input;
      }
    }
    return -1;
  }
  findOutputSlot(name, returnObj = false) {
    const { outputs } = this;
    if (!outputs) return -1;
    for (const [i, output] of outputs.entries()) {
      if (name == output.name) {
        return !returnObj ? i : output;
      }
    }
    return -1;
  }
  findInputSlotFree(optsIn) {
    return __privateMethod(this, _LGraphNode_instances, findFreeSlot_fn).call(this, this.inputs, optsIn);
  }
  findOutputSlotFree(optsIn) {
    return __privateMethod(this, _LGraphNode_instances, findFreeSlot_fn).call(this, this.outputs, optsIn);
  }
  findInputSlotByType(type, returnObj, preferFreeSlot, doNotUseOccupied) {
    return __privateMethod(this, _LGraphNode_instances, findSlotByType_fn).call(this, this.inputs, type, returnObj, preferFreeSlot, doNotUseOccupied);
  }
  findOutputSlotByType(type, returnObj, preferFreeSlot, doNotUseOccupied) {
    return __privateMethod(this, _LGraphNode_instances, findSlotByType_fn).call(this, this.outputs, type, returnObj, preferFreeSlot, doNotUseOccupied);
  }
  findSlotByType(input, type, returnObj, preferFreeSlot, doNotUseOccupied) {
    return input ? __privateMethod(this, _LGraphNode_instances, findSlotByType_fn).call(this, this.inputs, type, returnObj, preferFreeSlot, doNotUseOccupied) : __privateMethod(this, _LGraphNode_instances, findSlotByType_fn).call(this, this.outputs, type, returnObj, preferFreeSlot, doNotUseOccupied);
  }
  /**
   * Determines the slot index to connect to when attempting to connect by type.
   * @param findInputs If true, searches for an input.  Otherwise, an output.
   * @param node The node at the other end of the connection.
   * @param slotType The type of slot at the other end of the connection.
   * @param options Search restrictions to adhere to.
   * @see {connectByType}
   * @see {connectByTypeOutput}
   */
  findConnectByTypeSlot(findInputs, node2, slotType, options22) {
    if (options22 && typeof options22 === "object") {
      if ("firstFreeIfInputGeneralInCase" in options22) options22.wildcardToTyped = !!options22.firstFreeIfInputGeneralInCase;
      if ("firstFreeIfOutputGeneralInCase" in options22) options22.wildcardToTyped = !!options22.firstFreeIfOutputGeneralInCase;
      if ("generalTypeInCase" in options22) options22.typedToWildcard = !!options22.generalTypeInCase;
    }
    const optsDef = {
      createEventInCase: true,
      wildcardToTyped: true,
      typedToWildcard: true
    };
    const opts = Object.assign(optsDef, options22);
    if (!this.graph) throw new NullGraphError();
    if (node2 && typeof node2 === "number") {
      const nodeById = this.graph.getNodeById(node2);
      if (!nodeById) return;
      node2 = nodeById;
    }
    const slot = node2.findSlotByType(findInputs, slotType, false, true);
    if (slot >= 0 && slot !== null) return slot;
    if (opts.createEventInCase && slotType == LiteGraph.EVENT) {
      if (findInputs) return -1;
      if (LiteGraph.do_add_triggers_slots) return node2.addOnExecutedOutput();
    }
    if (opts.typedToWildcard) {
      const generalSlot = node2.findSlotByType(findInputs, 0, false, true, true);
      if (generalSlot >= 0) return generalSlot;
    }
    if (opts.wildcardToTyped && (slotType == 0 || slotType == "*" || slotType == "")) {
      const opt = { typesNotAccepted: [LiteGraph.EVENT] };
      const nonEventSlot = findInputs ? node2.findInputSlotFree(opt) : node2.findOutputSlotFree(opt);
      if (nonEventSlot >= 0) return nonEventSlot;
    }
  }
  /**
   * Finds the first free output slot with any of the comma-delimited types in {@link type}.
   *
   * If no slots are free, falls back in order to:
   * - The first free wildcard slot
   * - The first occupied slot
   * - The first occupied wildcard slot
   * @param type The {@link ISlotType type} of slot to find
   * @returns The index and slot if found, otherwise `undefined`.
   */
  findOutputByType(type) {
    return findFreeSlotOfType(this.outputs, type);
  }
  /**
   * Finds the first free input slot with any of the comma-delimited types in {@link type}.
   *
   * If no slots are free, falls back in order to:
   * - The first free wildcard slot
   * - The first occupied slot
   * - The first occupied wildcard slot
   * @param type The {@link ISlotType type} of slot to find
   * @returns The index and slot if found, otherwise `undefined`.
   */
  findInputByType(type) {
    return findFreeSlotOfType(this.inputs, type);
  }
  /**
   * connect this node output to the input of another node BY TYPE
   * @param slot (could be the number of the slot or the string with the name of the slot)
   * @param target_node the target node
   * @param target_slotType the input slot type of the target node
   * @returns the link_info is created, otherwise null
   */
  connectByType(slot, target_node, target_slotType, optsIn) {
    const slotIndex = this.findConnectByTypeSlot(
      true,
      target_node,
      target_slotType,
      optsIn
    );
    if (slotIndex !== void 0)
      return this.connect(slot, target_node, slotIndex, optsIn == null ? void 0 : optsIn.afterRerouteId);
    console.debug("[connectByType]: no way to connect type:", target_slotType, "to node:", target_node);
    return null;
  }
  /**
   * connect this node input to the output of another node BY TYPE
   * @param slot (could be the number of the slot or the string with the name of the slot)
   * @param source_node the target node
   * @param source_slotType the output slot type of the target node
   * @returns the link_info is created, otherwise null
   */
  connectByTypeOutput(slot, source_node, source_slotType, optsIn) {
    if (typeof optsIn === "object") {
      if ("firstFreeIfInputGeneralInCase" in optsIn) optsIn.wildcardToTyped = !!optsIn.firstFreeIfInputGeneralInCase;
      if ("generalTypeInCase" in optsIn) optsIn.typedToWildcard = !!optsIn.generalTypeInCase;
    }
    const slotIndex = this.findConnectByTypeSlot(
      false,
      source_node,
      source_slotType,
      optsIn
    );
    if (slotIndex !== void 0)
      return source_node.connect(slotIndex, this, slot, optsIn == null ? void 0 : optsIn.afterRerouteId);
    console.debug("[connectByType]: no way to connect type:", source_slotType, "to node:", source_node);
    return null;
  }
  canConnectTo(node2, toSlot, fromSlot) {
    return this.id !== node2.id && LiteGraph.isValidConnection(fromSlot.type, toSlot.type);
  }
  /**
   * Connect an output of this node to an input of another node
   * @param slot (could be the number of the slot or the string with the name of the slot)
   * @param target_node the target node
   * @param target_slot the input slot of the target node (could be the number of the slot or the string with the name of the slot, or -1 to connect a trigger)
   * @returns the link_info is created, otherwise null
   */
  connect(slot, target_node, target_slot, afterRerouteId) {
    var _a2;
    let targetIndex;
    const { graph, outputs } = this;
    if (!graph) {
      console.log("Connect: Error, node doesn't belong to any graph. Nodes must be added first to a graph before connecting them.");
      return null;
    }
    if (typeof slot === "string") {
      slot = this.findOutputSlot(slot);
      if (slot == -1) {
        if (LiteGraph.debug) console.log(`Connect: Error, no slot of name ${slot}`);
        return null;
      }
    } else if (!outputs || slot >= outputs.length) {
      if (LiteGraph.debug) console.log("Connect: Error, slot number not found");
      return null;
    }
    if (target_node && typeof target_node === "number") {
      const nodeById = graph.getNodeById(target_node);
      if (!nodeById) throw "target node is null";
      target_node = nodeById;
    }
    if (!target_node) throw "target node is null";
    if (target_node == this) return null;
    if (typeof target_slot === "string") {
      targetIndex = target_node.findInputSlot(target_slot);
      if (targetIndex == -1) {
        if (LiteGraph.debug) console.log(`Connect: Error, no slot of name ${targetIndex}`);
        return null;
      }
    } else if (target_slot === LiteGraph.EVENT) {
      if (LiteGraph.do_add_triggers_slots) {
        target_node.changeMode(LGraphEventMode.ON_TRIGGER);
        targetIndex = target_node.findInputSlot("onTrigger");
      } else {
        return null;
      }
    } else if (typeof target_slot === "number") {
      targetIndex = target_slot;
    } else {
      targetIndex = 0;
    }
    if (target_node.onBeforeConnectInput) {
      const requestedIndex = target_node.onBeforeConnectInput(targetIndex, target_slot);
      targetIndex = typeof requestedIndex === "number" ? requestedIndex : null;
    }
    if (targetIndex === null || !target_node.inputs || targetIndex >= target_node.inputs.length) {
      if (LiteGraph.debug) console.log("Connect: Error, slot number not found");
      return null;
    }
    const input = target_node.inputs[targetIndex];
    const output = outputs[slot];
    if (!output) return null;
    if ((_a2 = output.links) == null ? void 0 : _a2.length) {
      if (output.type === LiteGraph.EVENT && !LiteGraph.allow_multi_output_for_events) {
        graph.beforeChange();
        this.disconnectOutput(slot, false, { doProcessChange: false });
      }
    }
    const link2 = this.connectSlots(output, target_node, input, afterRerouteId);
    return link2 != null ? link2 : null;
  }
  /**
   * Connect two slots between two nodes
   * @param output The output slot to connect
   * @param inputNode The node that the input slot is on
   * @param input The input slot to connect
   * @param afterRerouteId The reroute ID to use for the link
   * @returns The link that was created, or null if the connection was blocked
   */
  connectSlots(output, inputNode, input, afterRerouteId) {
    var _a2, _b, _c, _d, _e, _f;
    const { graph } = this;
    if (!graph) throw new NullGraphError();
    const outputIndex = this.outputs.indexOf(output);
    if (outputIndex === -1) {
      console.warn("connectSlots: output not found");
      return;
    }
    const inputIndex = inputNode.inputs.indexOf(input);
    if (inputIndex === -1) {
      console.warn("connectSlots: input not found");
      return;
    }
    if (!LiteGraph.isValidConnection(output.type, input.type)) {
      this.setDirtyCanvas(false, true);
      return null;
    }
    if (((_a2 = inputNode.onConnectInput) == null ? void 0 : _a2.call(inputNode, inputIndex, output.type, output, this, outputIndex)) === false)
      return null;
    if (((_b = this.onConnectOutput) == null ? void 0 : _b.call(this, outputIndex, input.type, input, inputNode, inputIndex)) === false)
      return null;
    if (((_c = inputNode.inputs[inputIndex]) == null ? void 0 : _c.link) != null) {
      graph.beforeChange();
      inputNode.disconnectInput(inputIndex, true);
    }
    const link2 = new LLink(
      ++graph.state.lastLinkId,
      input.type || output.type,
      this.id,
      outputIndex,
      inputNode.id,
      inputIndex,
      afterRerouteId
    );
    graph._links.set(link2.id, link2);
    (_d = output.links) != null ? _d : output.links = [];
    output.links.push(link2.id);
    inputNode.inputs[inputIndex].link = link2.id;
    const reroutes = LLink.getReroutes(graph, link2);
    for (const reroute of reroutes) {
      reroute.linkIds.add(link2.id);
      if (reroute.floating) delete reroute.floating;
      reroute._dragging = void 0;
    }
    const lastReroute = reroutes.at(-1);
    if (lastReroute) {
      for (const linkId of lastReroute.floatingLinkIds) {
        const link22 = graph.floatingLinks.get(linkId);
        if ((link22 == null ? void 0 : link22.parentId) === lastReroute.id) {
          graph.removeFloatingLink(link22);
        }
      }
    }
    graph._version++;
    (_e = this.onConnectionsChange) == null ? void 0 : _e.call(
      this,
      NodeSlotType.OUTPUT,
      outputIndex,
      true,
      link2,
      output
    );
    (_f = inputNode.onConnectionsChange) == null ? void 0 : _f.call(
      inputNode,
      NodeSlotType.INPUT,
      inputIndex,
      true,
      link2,
      input
    );
    this.setDirtyCanvas(false, true);
    graph.afterChange();
    graph.connectionChange(this);
    return link2;
  }
  connectFloatingReroute(pos, slot, afterRerouteId) {
    var _a2, _b;
    const { graph, id } = this;
    if (!graph) throw new NullGraphError();
    const inputIndex = this.inputs.indexOf(slot);
    const outputIndex = this.outputs.indexOf(slot);
    if (inputIndex === -1 && outputIndex === -1) throw new Error("Invalid slot");
    const slotType = outputIndex === -1 ? "input" : "output";
    const reroute = graph.setReroute({
      pos,
      parentId: afterRerouteId,
      linkIds: [],
      floating: { slotType }
    });
    const parentReroute = graph.getReroute(afterRerouteId);
    const fromLastFloatingReroute = ((_a2 = parentReroute == null ? void 0 : parentReroute.floating) == null ? void 0 : _a2.slotType) === "output";
    if (afterRerouteId == null || !fromLastFloatingReroute) {
      const link22 = new LLink(
        -1,
        slot.type,
        outputIndex === -1 ? -1 : id,
        outputIndex,
        inputIndex === -1 ? -1 : id,
        inputIndex
      );
      link22.parentId = reroute.id;
      graph.addFloatingLink(link22);
      return reroute;
    }
    if (!parentReroute) throw new Error("[connectFloatingReroute] Parent reroute not found");
    const link2 = (_b = parentReroute.getFloatingLinks("output")) == null ? void 0 : _b[0];
    if (!link2) throw new Error("[connectFloatingReroute] Floating link not found");
    reroute.floatingLinkIds.add(link2.id);
    link2.parentId = reroute.id;
    delete parentReroute.floating;
    return reroute;
  }
  /**
   * disconnect one output to an specific node
   * @param slot (could be the number of the slot or the string with the name of the slot)
   * @param target_node the target node to which this slot is connected [Optional,
   * if not target_node is specified all nodes will be disconnected]
   * @returns if it was disconnected successfully
   */
  disconnectOutput(slot, target_node) {
    var _a2, _b, _c, _d, _e;
    if (typeof slot === "string") {
      slot = this.findOutputSlot(slot);
      if (slot == -1) {
        if (LiteGraph.debug) console.log(`Connect: Error, no slot of name ${slot}`);
        return false;
      }
    } else if (!this.outputs || slot >= this.outputs.length) {
      if (LiteGraph.debug) console.log("Connect: Error, slot number not found");
      return false;
    }
    const output = this.outputs[slot];
    if (!output) return false;
    if (output._floatingLinks) {
      for (const link2 of output._floatingLinks) {
        if (link2.hasOrigin(this.id, slot)) {
          (_a2 = this.graph) == null ? void 0 : _a2.removeFloatingLink(link2);
        }
      }
    }
    if (!output.links || output.links.length == 0) return false;
    const { links } = output;
    const graph = this.graph;
    if (!graph) throw new NullGraphError();
    if (target_node) {
      const target = typeof target_node === "number" ? graph.getNodeById(target_node) : target_node;
      if (!target) throw "Target Node not found";
      for (const [i, link_id] of links.entries()) {
        const link_info = graph._links.get(link_id);
        if ((link_info == null ? void 0 : link_info.target_id) != target.id) continue;
        links.splice(i, 1);
        const input = target.inputs[link_info.target_slot];
        input.link = null;
        link_info.disconnect(graph, "input");
        graph._version++;
        (_b = target.onConnectionsChange) == null ? void 0 : _b.call(
          target,
          NodeSlotType.INPUT,
          link_info.target_slot,
          false,
          link_info,
          input
        );
        (_c = this.onConnectionsChange) == null ? void 0 : _c.call(
          this,
          NodeSlotType.OUTPUT,
          slot,
          false,
          link_info,
          output
        );
        break;
      }
    } else {
      for (const link_id of links) {
        const link_info = graph._links.get(link_id);
        if (!link_info) continue;
        const target = graph.getNodeById(link_info.target_id);
        graph._version++;
        if (target) {
          const input = target.inputs[link_info.target_slot];
          input.link = null;
          (_d = target.onConnectionsChange) == null ? void 0 : _d.call(
            target,
            NodeSlotType.INPUT,
            link_info.target_slot,
            false,
            link_info,
            input
          );
        }
        link_info.disconnect(graph, "input");
        (_e = this.onConnectionsChange) == null ? void 0 : _e.call(
          this,
          NodeSlotType.OUTPUT,
          slot,
          false,
          link_info,
          output
        );
      }
      output.links = null;
    }
    this.setDirtyCanvas(false, true);
    graph.connectionChange(this);
    return true;
  }
  /**
   * Disconnect one input
   * @param slot Input slot index, or the name of the slot
   * @param keepReroutes If `true`, reroutes will not be garbage collected.
   * @returns true if disconnected successfully or already disconnected, otherwise false
   */
  disconnectInput(slot, keepReroutes) {
    var _a2, _b, _c, _d;
    if (typeof slot === "string") {
      slot = this.findInputSlot(slot);
      if (slot == -1) {
        if (LiteGraph.debug) console.log(`Connect: Error, no slot of name ${slot}`);
        return false;
      }
    } else if (!this.inputs || slot >= this.inputs.length) {
      if (LiteGraph.debug) {
        console.log("Connect: Error, slot number not found");
      }
      return false;
    }
    const input = this.inputs[slot];
    if (!input) return false;
    const { graph } = this;
    if (!graph) throw new NullGraphError();
    if ((_a2 = input._floatingLinks) == null ? void 0 : _a2.size) {
      for (const link2 of input._floatingLinks) {
        graph.removeFloatingLink(link2);
      }
    }
    const link_id = this.inputs[slot].link;
    if (link_id != null) {
      this.inputs[slot].link = null;
      const link_info = graph._links.get(link_id);
      if (link_info) {
        const target_node = graph.getNodeById(link_info.origin_id);
        if (!target_node) return false;
        const output = target_node.outputs[link_info.origin_slot];
        if (!((_b = output == null ? void 0 : output.links) == null ? void 0 : _b.length)) return false;
        let i = 0;
        for (const l = output.links.length; i < l; i++) {
          if (output.links[i] == link_id) {
            output.links.splice(i, 1);
            break;
          }
        }
        link_info.disconnect(graph, keepReroutes ? "output" : void 0);
        if (graph) graph._version++;
        (_c = this.onConnectionsChange) == null ? void 0 : _c.call(
          this,
          NodeSlotType.INPUT,
          slot,
          false,
          link_info,
          input
        );
        (_d = target_node.onConnectionsChange) == null ? void 0 : _d.call(
          target_node,
          NodeSlotType.OUTPUT,
          i,
          false,
          link_info,
          output
        );
      }
    }
    this.setDirtyCanvas(false, true);
    graph == null ? void 0 : graph.connectionChange(this);
    return true;
  }
  /**
   * @deprecated Use {@link getInputPos} or {@link getOutputPos} instead.
   * returns the center of a connection point in canvas coords
   * @param is_input true if if a input slot, false if it is an output
   * @param slot_number (could be the number of the slot or the string with the name of the slot)
   * @param out [optional] a place to store the output, to free garbage
   * @returns the position
   */
  getConnectionPos(is_input, slot_number, out) {
    var _a2, _b;
    out || (out = new Float32Array(2));
    const { pos: [nodeX, nodeY], inputs, outputs } = this;
    if (this.flags.collapsed) {
      const w = this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH;
      out[0] = is_input ? nodeX : nodeX + w;
      out[1] = nodeY - LiteGraph.NODE_TITLE_HEIGHT * 0.5;
      return out;
    }
    if (is_input && slot_number == -1) {
      out[0] = nodeX + LiteGraph.NODE_TITLE_HEIGHT * 0.5;
      out[1] = nodeY + LiteGraph.NODE_TITLE_HEIGHT * 0.5;
      return out;
    }
    const inputPos = (_a2 = inputs == null ? void 0 : inputs[slot_number]) == null ? void 0 : _a2.pos;
    const outputPos = (_b = outputs == null ? void 0 : outputs[slot_number]) == null ? void 0 : _b.pos;
    if (is_input && inputPos) {
      out[0] = nodeX + inputPos[0];
      out[1] = nodeY + inputPos[1];
      return out;
    } else if (!is_input && outputPos) {
      out[0] = nodeX + outputPos[0];
      out[1] = nodeY + outputPos[1];
      return out;
    }
    const offset = LiteGraph.NODE_SLOT_HEIGHT * 0.5;
    out[0] = is_input ? nodeX + offset : nodeX + this.size[0] + 1 - offset;
    out[1] = nodeY + (slot_number + 0.7) * LiteGraph.NODE_SLOT_HEIGHT + (this.constructor.slot_start_y || 0);
    return out;
  }
  /**
   * Gets the position of an input slot, in graph co-ordinates.
   *
   * This method is preferred over the legacy {@link getConnectionPos} method.
   * @param slot Input slot index
   * @returns Position of the input slot
   */
  getInputPos(slot) {
    var _a2;
    const { pos: [nodeX, nodeY], inputs } = this;
    if (this.flags.collapsed) {
      const halfTitle = LiteGraph.NODE_TITLE_HEIGHT * 0.5;
      return [nodeX, nodeY - halfTitle];
    }
    const inputPos = (_a2 = inputs == null ? void 0 : inputs[slot]) == null ? void 0 : _a2.pos;
    if (inputPos) return [nodeX + inputPos[0], nodeY + inputPos[1]];
    const offsetX = LiteGraph.NODE_SLOT_HEIGHT * 0.5;
    const nodeOffsetY = this.constructor.slot_start_y || 0;
    const slotY = (slot + 0.7) * LiteGraph.NODE_SLOT_HEIGHT;
    return [nodeX + offsetX, nodeY + slotY + nodeOffsetY];
  }
  /**
   * Gets the position of an output slot, in graph co-ordinates.
   *
   * This method is preferred over the legacy {@link getConnectionPos} method.
   * @param slot Output slot index
   * @returns Position of the output slot
   */
  getOutputPos(slot) {
    var _a2;
    const { pos: [nodeX, nodeY], outputs, size: [width2] } = this;
    if (this.flags.collapsed) {
      const width22 = this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH;
      const halfTitle = LiteGraph.NODE_TITLE_HEIGHT * 0.5;
      return [nodeX + width22, nodeY - halfTitle];
    }
    const outputPos = (_a2 = outputs == null ? void 0 : outputs[slot]) == null ? void 0 : _a2.pos;
    if (outputPos) return outputPos;
    const offsetX = LiteGraph.NODE_SLOT_HEIGHT * 0.5;
    const nodeOffsetY = this.constructor.slot_start_y || 0;
    const slotY = (slot + 0.7) * LiteGraph.NODE_SLOT_HEIGHT;
    return [nodeX + width2 + 1 - offsetX, nodeY + slotY + nodeOffsetY];
  }
  /** @inheritdoc */
  snapToGrid(snapTo) {
    return this.pinned ? false : snapPoint(this.pos, snapTo);
  }
  /** @see {@link snapToGrid} */
  alignToGrid() {
    this.snapToGrid(LiteGraph.CANVAS_GRID_SIZE);
  }
  /* Console output */
  trace(msg) {
    this.console || (this.console = []);
    this.console.push(msg);
    if (this.console.length > _LGraphNode.MAX_CONSOLE)
      this.console.shift();
  }
  /* Forces to redraw or the main canvas (LGraphNode) or the bg canvas (links) */
  setDirtyCanvas(dirty_foreground, dirty_background) {
    var _a2;
    (_a2 = this.graph) == null ? void 0 : _a2.canvasAction((c) => c.setDirty(dirty_foreground, dirty_background));
  }
  loadImage(url) {
    const img = new Image();
    img.src = LiteGraph.node_images_path + url;
    img.ready = false;
    const dirty = () => this.setDirtyCanvas(true);
    img.addEventListener("load", function() {
      this.ready = true;
      dirty();
    });
    return img;
  }
  /* Allows to get onMouseMove and onMouseUp events even if the mouse is out of focus */
  captureInput(v2) {
    if (!this.graph || !this.graph.list_of_graphcanvas) return;
    const list2 = this.graph.list_of_graphcanvas;
    for (const c of list2) {
      if (!v2 && c.node_capturing_input != this) continue;
      c.node_capturing_input = v2 ? this : null;
    }
  }
  get collapsed() {
    return !!this.flags.collapsed;
  }
  get collapsible() {
    return !this.pinned && this.constructor.collapsable !== false;
  }
  /**
   * Toggle node collapse (makes it smaller on the canvas)
   */
  collapse(force) {
    if (!this.collapsible && !force) return;
    if (!this.graph) throw new NullGraphError();
    this.graph._version++;
    this.flags.collapsed = !this.flags.collapsed;
    this.setDirtyCanvas(true, true);
  }
  /**
   * Toggles advanced mode of the node, showing advanced widgets
   */
  toggleAdvanced() {
    var _a2;
    if (!((_a2 = this.widgets) == null ? void 0 : _a2.some((w) => w.advanced))) return;
    if (!this.graph) throw new NullGraphError();
    this.graph._version++;
    this.showAdvanced = !this.showAdvanced;
    this.expandToFitContent();
    this.setDirtyCanvas(true, true);
  }
  get pinned() {
    return !!this.flags.pinned;
  }
  /**
   * Prevents the node being accidentally moved or resized by mouse interaction.
   * Toggles pinned state if no value is provided.
   */
  pin(v2) {
    if (!this.graph) throw new NullGraphError();
    this.graph._version++;
    this.flags.pinned = v2 != null ? v2 : !this.flags.pinned;
    this.resizable = !this.pinned;
    if (!this.pinned) delete this.flags.pinned;
  }
  unpin() {
    this.pin(false);
  }
  localToScreen(x2, y, dragAndScale) {
    return [
      (x2 + this.pos[0]) * dragAndScale.scale + dragAndScale.offset[0],
      (y + this.pos[1]) * dragAndScale.scale + dragAndScale.offset[1]
    ];
  }
  get width() {
    return this.collapsed ? this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH : this.size[0];
  }
  /**
   * Returns the height of the node, including the title bar.
   */
  get height() {
    return LiteGraph.NODE_TITLE_HEIGHT + this.bodyHeight;
  }
  /**
   * Returns the height of the node, excluding the title bar.
   */
  get bodyHeight() {
    return this.collapsed ? 0 : this.size[1];
  }
  drawBadges(ctx, { gap = 2 } = {}) {
    const badgeInstances = this.badges.map((badge) => badge instanceof LGraphBadge ? badge : badge());
    const isLeftAligned = this.badgePosition === BadgePosition.TopLeft;
    let currentX = isLeftAligned ? 0 : this.width - badgeInstances.reduce((acc, badge) => acc + badge.getWidth(ctx) + gap, 0);
    const y = -(LiteGraph.NODE_TITLE_HEIGHT + gap);
    for (const badge of badgeInstances) {
      badge.draw(ctx, currentX, y - badge.height);
      currentX += badge.getWidth(ctx) + gap;
    }
  }
  /**
   * Renders the node's title bar background
   */
  drawTitleBarBackground(ctx, options22) {
    const {
      scale,
      title_height = LiteGraph.NODE_TITLE_HEIGHT,
      low_quality = false
    } = options22;
    const fgcolor = this.renderingColor;
    const shape = this.renderingShape;
    const size = this.renderingSize;
    if (this.onDrawTitleBar) {
      this.onDrawTitleBar(ctx, title_height, size, scale, fgcolor);
      return;
    }
    if (this.title_mode === TitleMode.TRANSPARENT_TITLE) {
      return;
    }
    if (this.collapsed) {
      ctx.shadowColor = LiteGraph.DEFAULT_SHADOW_COLOR;
    }
    ctx.fillStyle = this.constructor.title_color || fgcolor;
    ctx.beginPath();
    if (shape == RenderShape.BOX || low_quality) {
      ctx.rect(0, -title_height, size[0], title_height);
    } else if (shape == RenderShape.ROUND || shape == RenderShape.CARD) {
      ctx.roundRect(
        0,
        -title_height,
        size[0],
        title_height,
        this.collapsed ? [LiteGraph.ROUND_RADIUS] : [LiteGraph.ROUND_RADIUS, LiteGraph.ROUND_RADIUS, 0, 0]
      );
    }
    ctx.fill();
    ctx.shadowColor = "transparent";
  }
  /**
   * Renders the node's title box, i.e. the dot in front of the title text that
   * when clicked toggles the node's collapsed state. The term `title box` comes
   * from the original LiteGraph implementation.
   */
  drawTitleBox(ctx, options22) {
    const {
      scale,
      low_quality = false,
      title_height = LiteGraph.NODE_TITLE_HEIGHT,
      box_size = 10
    } = options22;
    const size = this.renderingSize;
    const shape = this.renderingShape;
    if (this.onDrawTitleBox) {
      this.onDrawTitleBox(ctx, title_height, size, scale);
      return;
    }
    if ([RenderShape.ROUND, RenderShape.CIRCLE, RenderShape.CARD].includes(shape)) {
      if (low_quality) {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(
          title_height * 0.5,
          title_height * -0.5,
          box_size * 0.5 + 1,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.fillStyle = this.renderingBoxColor;
      if (low_quality) {
        ctx.fillRect(
          title_height * 0.5 - box_size * 0.5,
          title_height * -0.5 - box_size * 0.5,
          box_size,
          box_size
        );
      } else {
        ctx.beginPath();
        ctx.arc(
          title_height * 0.5,
          title_height * -0.5,
          box_size * 0.5,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    } else {
      if (low_quality) {
        ctx.fillStyle = "black";
        ctx.fillRect(
          (title_height - box_size) * 0.5 - 1,
          (title_height + box_size) * -0.5 - 1,
          box_size + 2,
          box_size + 2
        );
      }
      ctx.fillStyle = this.renderingBoxColor;
      ctx.fillRect(
        (title_height - box_size) * 0.5,
        (title_height + box_size) * -0.5,
        box_size,
        box_size
      );
    }
  }
  /**
   * Renders the node's title text.
   */
  drawTitleText(ctx, options22) {
    var _a2;
    const {
      scale,
      default_title_color,
      low_quality = false,
      title_height = LiteGraph.NODE_TITLE_HEIGHT
    } = options22;
    const size = this.renderingSize;
    const selected = this.selected;
    if (this.onDrawTitleText) {
      this.onDrawTitleText(
        ctx,
        title_height,
        size,
        scale,
        this.titleFontStyle,
        selected
      );
      return;
    }
    if (low_quality) {
      return;
    }
    ctx.font = this.titleFontStyle;
    const rawTitle = (_a2 = this.getTitle()) != null ? _a2 : `\u274C ${this.type}`;
    const title = String(rawTitle) + (this.pinned ? "\u{1F4CC}" : "");
    if (title) {
      if (selected) {
        ctx.fillStyle = LiteGraph.NODE_SELECTED_TITLE_COLOR;
      } else {
        ctx.fillStyle = this.constructor.title_text_color || default_title_color;
      }
      if (this.collapsed) {
        ctx.textAlign = "left";
        ctx.fillText(
          // avoid urls too long
          title.substr(0, 20),
          title_height,
          LiteGraph.NODE_TITLE_TEXT_Y - title_height
        );
        ctx.textAlign = "left";
      } else {
        ctx.textAlign = "left";
        ctx.fillText(
          title,
          title_height,
          LiteGraph.NODE_TITLE_TEXT_Y - title_height
        );
      }
    }
  }
  /**
   * Attempts to gracefully bypass this node in all of its connections by reconnecting all links.
   *
   * Each input is checked against each output.  This is done on a matching index basis, i.e. input 3 -> output 3.
   * If there are any input links remaining,
   * and {@link flags}.{@link INodeFlags.keepAllLinksOnBypass keepAllLinksOnBypass} is `true`,
   * each input will check for outputs that match, and take the first one that matches
   * `true`: Try the index matching first, then every input to every output.
   * `false`: Only matches indexes, e.g. input 3 to output 3.
   *
   * If {@link flags}.{@link INodeFlags.keepAllLinksOnBypass keepAllLinksOnBypass} is `undefined`, it will fall back to
   * the static {@link keepAllLinksOnBypass}.
   * @returns `true` if any new links were established, otherwise `false`.
   * @todo Decision: Change API to return array of new links instead?
   */
  connectInputToOutput() {
    var _a2;
    const { inputs, outputs, graph } = this;
    if (!inputs || !outputs) return;
    if (!graph) throw new NullGraphError();
    const { _links } = graph;
    let madeAnyConnections = false;
    for (const [index, input] of inputs.entries()) {
      if (input.link == null) continue;
      const output = outputs[index];
      if (!output || !LiteGraph.isValidConnection(input.type, output.type)) continue;
      const inLink = _links.get(input.link);
      if (!inLink) continue;
      const inNode = graph.getNodeById(inLink == null ? void 0 : inLink.origin_id);
      if (!inNode) continue;
      bypassAllLinks(output, inNode, inLink, graph);
    }
    if (!((_a2 = this.flags.keepAllLinksOnBypass) != null ? _a2 : _LGraphNode.keepAllLinksOnBypass))
      return madeAnyConnections;
    for (const input of inputs) {
      if (input.link == null) continue;
      const inLink = _links.get(input.link);
      if (!inLink) continue;
      const inNode = graph.getNodeById(inLink == null ? void 0 : inLink.origin_id);
      if (!inNode) continue;
      for (const output of outputs) {
        if (!LiteGraph.isValidConnection(input.type, output.type)) continue;
        bypassAllLinks(output, inNode, inLink, graph);
        break;
      }
    }
    return madeAnyConnections;
    function bypassAllLinks(output, inNode, inLink, graph2) {
      var _a3;
      const outLinks = (_a3 = output.links) == null ? void 0 : _a3.map((x2) => _links.get(x2)).filter((x2) => !!x2);
      if (!(outLinks == null ? void 0 : outLinks.length)) return;
      for (const outLink of outLinks) {
        const outNode = graph2.getNodeById(outLink.target_id);
        if (!outNode) continue;
        const result = inNode.connect(
          inLink.origin_slot,
          outNode,
          outLink.target_slot,
          inLink.parentId
        );
        madeAnyConnections || (madeAnyConnections = !!result);
      }
    }
  }
  drawWidgets(ctx, options22) {
    var _a2;
    if (!this.widgets) return;
    const { colorContext, linkOverWidget, linkOverWidgetType, lowQuality = false, editorAlpha = 1 } = options22;
    const width2 = this.size[0];
    const widgets = this.widgets;
    const H = LiteGraph.NODE_WIDGET_HEIGHT;
    const show_text = !lowQuality;
    ctx.save();
    ctx.globalAlpha = editorAlpha;
    const margin = 15;
    for (const w of widgets) {
      if (w.hidden || w.advanced && !this.showAdvanced) continue;
      const y = w.y;
      const outline_color = w.advanced ? LiteGraph.WIDGET_ADVANCED_OUTLINE_COLOR : LiteGraph.WIDGET_OUTLINE_COLOR;
      if (w === linkOverWidget) {
        new NodeInputSlot({
          name: "",
          // @ts-expect-error https://github.com/Comfy-Org/litegraph.js/issues/616
          type: linkOverWidgetType,
          link: 0
        }).draw(ctx, { pos: [10, y + 10], colorContext });
      }
      w.last_y = y;
      ctx.strokeStyle = outline_color;
      ctx.fillStyle = "#222";
      ctx.textAlign = "left";
      if (w.disabled) ctx.globalAlpha *= 0.5;
      const widget_width = w.width || width2;
      const WidgetClass = WIDGET_TYPE_MAP[w.type];
      if (WidgetClass) {
        toClass(WidgetClass, w).drawWidget(ctx, { y, width: widget_width, show_text, margin });
      } else {
        (_a2 = w.draw) == null ? void 0 : _a2.call(w, ctx, this, widget_width, y, H, lowQuality);
      }
      ctx.globalAlpha = editorAlpha;
    }
    ctx.restore();
  }
  /**
   * When {@link LGraphNode.collapsed} is `true`, this method draws the node's collapsed slots.
   */
  drawCollapsedSlots(ctx) {
    var _a2, _b, _c;
    let input_slot = null;
    let output_slot = null;
    for (const slot of (_a2 = this.inputs) != null ? _a2 : []) {
      if (slot.link == null) {
        continue;
      }
      input_slot = slot;
      break;
    }
    for (const slot of (_b = this.outputs) != null ? _b : []) {
      if (!slot.links || !slot.links.length) {
        continue;
      }
      output_slot = slot;
      break;
    }
    if (input_slot) {
      const x2 = 0;
      const y = LiteGraph.NODE_TITLE_HEIGHT * -0.5;
      toClass(NodeInputSlot, input_slot).drawCollapsed(ctx, {
        pos: [x2, y]
      });
    }
    if (output_slot) {
      const x2 = (_c = this._collapsed_width) != null ? _c : LiteGraph.NODE_COLLAPSED_WIDTH;
      const y = LiteGraph.NODE_TITLE_HEIGHT * -0.5;
      toClass(NodeOutputSlot, output_slot).drawCollapsed(ctx, {
        pos: [x2, y]
      });
    }
  }
  get highlightColor() {
    var _a2, _b;
    return (_b = (_a2 = LiteGraph.NODE_TEXT_HIGHLIGHT_COLOR) != null ? _a2 : LiteGraph.NODE_SELECTED_TITLE_COLOR) != null ? _b : LiteGraph.NODE_TEXT_COLOR;
  }
  get slots() {
    return [...this.inputs, ...this.outputs];
  }
  layoutSlot(slot, options22) {
    const { slotIndex } = options22;
    const isInput = isINodeInputSlot(slot);
    const pos = isInput ? this.getInputPos(slotIndex) : this.getOutputPos(slotIndex);
    slot._layoutElement = new LayoutElement({
      value: slot,
      boundingRect: [
        pos[0] - this.pos[0] - LiteGraph.NODE_SLOT_HEIGHT * 0.5,
        pos[1] - this.pos[1] - LiteGraph.NODE_SLOT_HEIGHT * 0.5,
        LiteGraph.NODE_SLOT_HEIGHT,
        LiteGraph.NODE_SLOT_HEIGHT
      ]
    });
  }
  layoutSlots() {
    var _a2;
    const slots = [];
    for (const [i, slot] of this.inputs.entries()) {
      if (((_a2 = this.widgets) == null ? void 0 : _a2.length) && isWidgetInputSlot(slot)) continue;
      this.layoutSlot(slot, {
        slotIndex: i
      });
      if (slot._layoutElement) {
        slots.push(slot._layoutElement);
      }
    }
    for (const [i, slot] of this.outputs.entries()) {
      this.layoutSlot(slot, {
        slotIndex: i
      });
      if (slot._layoutElement) {
        slots.push(slot._layoutElement);
      }
    }
    return slots.length ? createBounds(
      slots,
      /** padding= */
      0
    ) : null;
  }
  /**
   * Draws the node's input and output slots.
   */
  drawSlots(ctx, options22) {
    var _a2;
    const { fromSlot, colorContext, editorAlpha, lowQuality } = options22;
    for (const slot of this.slots) {
      const layoutElement = slot._layoutElement;
      const slotInstance = toNodeSlotClass(slot);
      const isValid = !fromSlot || slotInstance.isValidTarget(fromSlot);
      const highlight = isValid && __privateMethod(this, _LGraphNode_instances, isMouseOverSlot_fn).call(this, slot);
      const labelColor = highlight ? this.highlightColor : LiteGraph.NODE_TEXT_COLOR;
      ctx.globalAlpha = isValid ? editorAlpha : 0.4 * editorAlpha;
      slotInstance.draw(ctx, {
        pos: (_a2 = layoutElement == null ? void 0 : layoutElement.center) != null ? _a2 : [0, 0],
        colorContext,
        labelColor,
        lowQuality,
        highlight
      });
    }
  }
  /**
   * Lays out the node's widgets vertically.
   * Sets following properties on each widget:
   * -  {@link IBaseWidget.computedHeight}
   * -  {@link IBaseWidget.y}
   */
  layoutWidgets(options22) {
    var _a2, _b;
    if (!this.widgets || !this.widgets.length) return;
    const bodyHeight = this.bodyHeight;
    const widgetStartY = (_a2 = this.widgets_start_y) != null ? _a2 : (this.widgets_up ? 0 : options22.widgetStartY) + 2;
    let freeSpace = bodyHeight - widgetStartY;
    let fixedWidgetHeight = 0;
    const growableWidgets = [];
    for (const w of this.widgets) {
      if (w.computeSize) {
        const height = w.computeSize()[1] + 4;
        w.computedHeight = height;
        fixedWidgetHeight += height;
      } else if (w.computeLayoutSize) {
        const { minHeight, maxHeight } = w.computeLayoutSize(this);
        growableWidgets.push({
          minHeight,
          prefHeight: maxHeight,
          w
        });
      } else {
        const height = LiteGraph.NODE_WIDGET_HEIGHT + 4;
        w.computedHeight = height;
        fixedWidgetHeight += height;
      }
    }
    freeSpace -= fixedWidgetHeight;
    this.freeWidgetSpace = freeSpace;
    const spaceRequests = growableWidgets.map((d) => ({
      minSize: d.minHeight,
      maxSize: d.prefHeight
    }));
    const allocations = distributeSpace(Math.max(0, freeSpace), spaceRequests);
    for (const [i, d] of growableWidgets.entries()) {
      d.w.computedHeight = allocations[i];
    }
    let y = widgetStartY;
    for (const w of this.widgets) {
      w.y = y;
      y += (_b = w.computedHeight) != null ? _b : 0;
    }
    if (!this.graph) throw new NullGraphError();
    if (y > bodyHeight) {
      this.setSize([this.size[0], y]);
      this.graph.setDirtyCanvas(false, true);
    }
  }
  /**
   * Lays out the node's widget input slots.
   */
  layoutWidgetInputSlots() {
    var _a2;
    if (!this.widgets) return;
    const slotByWidgetName = /* @__PURE__ */ new Map();
    for (const [i, slot] of this.inputs.entries()) {
      if (!isWidgetInputSlot(slot)) continue;
      slotByWidgetName.set((_a2 = slot.widget) == null ? void 0 : _a2.name, { ...slot, index: i });
    }
    if (!slotByWidgetName.size) return;
    for (const widget of this.widgets) {
      const slot = slotByWidgetName.get(widget.name);
      if (!slot) continue;
      const actualSlot = this.inputs[slot.index];
      const offset = LiteGraph.NODE_SLOT_HEIGHT * 0.5;
      actualSlot.pos = [offset, widget.y + offset];
      this.layoutSlot(actualSlot, { slotIndex: slot.index });
    }
  }
  /**
   * Draws a progress bar on the node.
   * @param ctx The canvas context to draw on
   */
  drawProgressBar(ctx) {
    if (!this.progress) return;
    const originalFillStyle = ctx.fillStyle;
    ctx.fillStyle = "green";
    ctx.fillRect(
      0,
      0,
      this.width * this.progress,
      6
    );
    ctx.fillStyle = originalFillStyle;
  }
};
_renderArea = new WeakMap();
_boundingRect = new WeakMap();
_LGraphNode_instances = new WeakSet();
getErrorStrokeStyle_fn = function() {
  if (this.has_errors) {
    return {
      padding: 12,
      lineWidth: 10,
      color: LiteGraph.NODE_ERROR_COLOUR
    };
  }
};
getSelectedStrokeStyle_fn = function() {
  if (this.selected) {
    return {
      padding: this.has_errors ? 20 : void 0
    };
  }
};
/**
 * Finds the next free slot
 * @param slots The slots to search, i.e. this.inputs or this.outputs
 */
findFreeSlot_fn = function(slots, options22) {
  var _a2, _b, _c;
  const defaults = {
    returnObj: false,
    typesNotAccepted: []
  };
  const opts = Object.assign(defaults, options22 || {});
  const length = slots == null ? void 0 : slots.length;
  if (!(length > 0)) return -1;
  for (let i = 0; i < length; ++i) {
    const slot = slots[i];
    if (!slot || slot.link || ((_a2 = slot.links) == null ? void 0 : _a2.length)) continue;
    if ((_c = (_b = opts.typesNotAccepted) == null ? void 0 : _b.includes) == null ? void 0 : _c.call(_b, slot.type)) continue;
    return !opts.returnObj ? i : slot;
  }
  return -1;
};
/**
 * Finds a matching slot from those provided, returning the slot itself or its index in {@link slots}.
 * @param slots Slots to search (this.inputs or this.outputs)
 * @param type Type of slot to look for
 * @param returnObj If true, returns the slot itself.  Otherwise, the index.
 * @param preferFreeSlot Prefer a free slot, but if none are found, fall back to an occupied slot.
 * @param doNotUseOccupied Do not fall back to occupied slots.
 * @see {findSlotByType}
 * @see {findOutputSlotByType}
 * @see {findInputSlotByType}
 * @returns If a match is found, the slot if returnObj is true, otherwise the index.  If no matches are found, -1
 */
findSlotByType_fn = function(slots, type, returnObj, preferFreeSlot, doNotUseOccupied) {
  var _a2;
  const length = slots == null ? void 0 : slots.length;
  if (!length) return -1;
  if (type == "" || type == "*") type = 0;
  const sourceTypes = String(type).toLowerCase().split(",");
  let occupiedSlot = null;
  for (let i = 0; i < length; ++i) {
    const slot = slots[i];
    const destTypes = slot.type == "0" || slot.type == "*" ? ["0"] : String(slot.type).toLowerCase().split(",");
    for (const sourceType of sourceTypes) {
      const source = sourceType == "_event_" ? LiteGraph.EVENT : sourceType;
      for (const destType of destTypes) {
        const dest = destType == "_event_" ? LiteGraph.EVENT : destType;
        if (source == dest || source === "*" || dest === "*") {
          if (preferFreeSlot && (((_a2 = slot.links) == null ? void 0 : _a2.length) || slot.link != null)) {
            occupiedSlot != null ? occupiedSlot : occupiedSlot = returnObj ? slot : i;
            continue;
          }
          return returnObj ? slot : i;
        }
      }
    }
  }
  return doNotUseOccupied ? -1 : occupiedSlot != null ? occupiedSlot : -1;
};
getMouseOverSlot_fn = function(slot) {
  var _a2, _b;
  const isInput = isINodeInputSlot(slot);
  const mouseOverId = (_b = (_a2 = this.mouseOver) == null ? void 0 : _a2[isInput ? "inputId" : "outputId"]) != null ? _b : -1;
  if (mouseOverId === -1) {
    return null;
  }
  return isInput ? this.inputs[mouseOverId] : this.outputs[mouseOverId];
};
isMouseOverSlot_fn = function(slot) {
  return __privateMethod(this, _LGraphNode_instances, getMouseOverSlot_fn).call(this, slot) === slot;
};
// Static properties used by dynamic child classes
__publicField(_LGraphNode, "title");
__publicField(_LGraphNode, "MAX_CONSOLE");
__publicField(_LGraphNode, "type");
__publicField(_LGraphNode, "category");
__publicField(_LGraphNode, "filter");
__publicField(_LGraphNode, "skip_list");
/** Default setting for {@link LGraphNode.connectInputToOutput}. @see {@link INodeFlags.keepAllLinksOnBypass} */
__publicField(_LGraphNode, "keepAllLinksOnBypass", false);
var LGraphNode = _LGraphNode;
var _LGraphGroup = class _LGraphGroup {
  constructor(title, id) {
    __publicField(this, "id");
    __publicField(this, "color");
    __publicField(this, "title");
    __publicField(this, "font");
    __publicField(this, "font_size", LiteGraph.DEFAULT_GROUP_FONT || 24);
    __publicField(this, "_bounding", new Float32Array([
      10,
      10,
      _LGraphGroup.minWidth,
      _LGraphGroup.minHeight
    ]));
    __publicField(this, "_pos", this._bounding.subarray(0, 2));
    __publicField(this, "_size", this._bounding.subarray(2, 4));
    /** @deprecated See {@link _children} */
    __publicField(this, "_nodes", []);
    __publicField(this, "_children", /* @__PURE__ */ new Set());
    __publicField(this, "graph");
    __publicField(this, "flags", {});
    __publicField(this, "selected");
    __publicField(this, "isPointInside", LGraphNode.prototype.isPointInside);
    __publicField(this, "setDirtyCanvas", LGraphNode.prototype.setDirtyCanvas);
    this.id = id != null ? id : -1;
    this.title = title || "Group";
    this.color = LGraphCanvas.node_colors.pale_blue ? LGraphCanvas.node_colors.pale_blue.groupcolor : "#AAA";
  }
  /** @inheritdoc {@link IColorable.setColorOption} */
  setColorOption(colorOption) {
    if (colorOption == null) {
      delete this.color;
    } else {
      this.color = colorOption.groupcolor;
    }
  }
  /** @inheritdoc {@link IColorable.getColorOption} */
  getColorOption() {
    var _a2;
    return (_a2 = Object.values(LGraphCanvas.node_colors).find(
      (colorOption) => colorOption.groupcolor === this.color
    )) != null ? _a2 : null;
  }
  /** Position of the group, as x,y co-ordinates in graph space */
  get pos() {
    return this._pos;
  }
  set pos(v2) {
    if (!v2 || v2.length < 2) return;
    this._pos[0] = v2[0];
    this._pos[1] = v2[1];
  }
  /** Size of the group, as width,height in graph units */
  get size() {
    return this._size;
  }
  set size(v2) {
    if (!v2 || v2.length < 2) return;
    this._size[0] = Math.max(_LGraphGroup.minWidth, v2[0]);
    this._size[1] = Math.max(_LGraphGroup.minHeight, v2[1]);
  }
  get boundingRect() {
    return this._bounding;
  }
  get nodes() {
    return this._nodes;
  }
  get titleHeight() {
    return this.font_size * 1.4;
  }
  get children() {
    return this._children;
  }
  get pinned() {
    return !!this.flags.pinned;
  }
  /**
   * Prevents the group being accidentally moved or resized by mouse interaction.
   * Toggles pinned state if no value is provided.
   */
  pin(value) {
    const newState = value === void 0 ? !this.pinned : value;
    if (newState) this.flags.pinned = true;
    else delete this.flags.pinned;
  }
  unpin() {
    this.pin(false);
  }
  configure(o) {
    this.id = o.id;
    this.title = o.title;
    this._bounding.set(o.bounding);
    this.color = o.color;
    this.flags = o.flags || this.flags;
    if (o.font_size) this.font_size = o.font_size;
  }
  serialize() {
    const b = this._bounding;
    return {
      id: this.id,
      title: this.title,
      bounding: [...b],
      color: this.color,
      font_size: this.font_size,
      flags: this.flags
    };
  }
  /**
   * Draws the group on the canvas
   * @param graphCanvas
   * @param ctx
   */
  draw(graphCanvas, ctx) {
    const { padding, resizeLength, defaultColour } = _LGraphGroup;
    const font_size = this.font_size || LiteGraph.DEFAULT_GROUP_FONT_SIZE;
    const [x2, y] = this._pos;
    const [width2, height] = this._size;
    const color = this.color || defaultColour;
    ctx.globalAlpha = 0.25 * graphCanvas.editor_alpha;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.rect(x2 + 0.5, y + 0.5, width2, font_size * 1.4);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.rect(x2 + 0.5, y + 0.5, width2, height);
    ctx.fill();
    ctx.globalAlpha = graphCanvas.editor_alpha;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2 + width2, y + height);
    ctx.lineTo(x2 + width2 - resizeLength, y + height);
    ctx.lineTo(x2 + width2, y + height - resizeLength);
    ctx.fill();
    ctx.font = `${font_size}px Arial`;
    ctx.textAlign = "left";
    ctx.fillText(this.title + (this.pinned ? "\u{1F4CC}" : ""), x2 + padding, y + font_size);
    if (LiteGraph.highlight_selected_group && this.selected) {
      strokeShape(ctx, this._bounding, {
        title_height: this.titleHeight,
        padding
      });
    }
  }
  resize(width2, height) {
    if (this.pinned) return false;
    this._size[0] = Math.max(_LGraphGroup.minWidth, width2);
    this._size[1] = Math.max(_LGraphGroup.minHeight, height);
    return true;
  }
  move(deltaX, deltaY, skipChildren = false) {
    if (this.pinned) return;
    this._pos[0] += deltaX;
    this._pos[1] += deltaY;
    if (skipChildren === true) return;
    for (const item of this._children) {
      item.move(deltaX, deltaY);
    }
  }
  /** @inheritdoc */
  snapToGrid(snapTo) {
    return this.pinned ? false : snapPoint(this.pos, snapTo);
  }
  recomputeInsideNodes() {
    if (!this.graph) throw new NullGraphError();
    const { nodes, reroutes, groups } = this.graph;
    const children = this._children;
    this._nodes.length = 0;
    children.clear();
    for (const node2 of nodes) {
      if (containsCentre(this._bounding, node2.boundingRect)) {
        this._nodes.push(node2);
        children.add(node2);
      }
    }
    for (const reroute of reroutes.values()) {
      if (isPointInRect(reroute.pos, this._bounding))
        children.add(reroute);
    }
    for (const group of groups) {
      if (containsRect(this._bounding, group._bounding))
        children.add(group);
    }
    groups.sort((a, b) => {
      if (a === this) {
        return children.has(b) ? -1 : 0;
      } else if (b === this) {
        return children.has(a) ? 1 : 0;
      } else {
        return 0;
      }
    });
  }
  /**
   * Resizes and moves the group to neatly fit all given {@link objects}.
   * @param objects All objects that should be inside the group
   * @param padding Value in graph units to add to all sides of the group.  Default: 10
   */
  resizeTo(objects, padding = 10) {
    const boundingBox = createBounds(objects, padding);
    if (boundingBox === null) return;
    this.pos[0] = boundingBox[0];
    this.pos[1] = boundingBox[1] - this.titleHeight;
    this.size[0] = boundingBox[2];
    this.size[1] = boundingBox[3] + this.titleHeight;
  }
  /**
   * Add nodes to the group and adjust the group's position and size accordingly
   * @param nodes The nodes to add to the group
   * @param padding The padding around the group
   */
  addNodes(nodes, padding = 10) {
    if (!this._nodes && nodes.length === 0) return;
    this.resizeTo([...this.children, ...this._nodes, ...nodes], padding);
  }
  getMenuOptions() {
    return [
      {
        content: this.pinned ? "Unpin" : "Pin",
        callback: () => {
          if (this.pinned) this.unpin();
          else this.pin();
          this.setDirtyCanvas(false, true);
        }
      },
      null,
      { content: "Title", callback: LGraphCanvas.onShowPropertyEditor },
      {
        content: "Color",
        has_submenu: true,
        callback: LGraphCanvas.onMenuNodeColors
      },
      {
        content: "Font size",
        property: "font_size",
        type: "Number",
        callback: LGraphCanvas.onShowPropertyEditor
      },
      null,
      { content: "Remove", callback: LGraphCanvas.onMenuNodeRemove }
    ];
  }
  isPointInTitlebar(x2, y) {
    const b = this.boundingRect;
    return isInRectangle(x2, y, b[0], b[1], b[2], this.titleHeight);
  }
  isInResize(x2, y) {
    const b = this.boundingRect;
    const right = b[0] + b[2];
    const bottom = b[1] + b[3];
    return x2 < right && y < bottom && x2 - right + (y - bottom) > -_LGraphGroup.resizeLength;
  }
};
__publicField(_LGraphGroup, "minWidth", 140);
__publicField(_LGraphGroup, "minHeight", 80);
__publicField(_LGraphGroup, "resizeLength", 10);
__publicField(_LGraphGroup, "padding", 4);
__publicField(_LGraphGroup, "defaultColour", "#335");
var LGraphGroup = _LGraphGroup;
var _malloc, _network, _parentId, _pos, _lastRenderTime;
var _Reroute = class _Reroute {
  /**
   * Initialises a new link reroute object.
   * @param id Unique identifier for this reroute
   * @param network The network of links this reroute belongs to.  Internally converted to a WeakRef.
   * @param pos Position in graph coordinates
   * @param linkIds Link IDs ({@link LLink.id}) of all links that use this reroute
   */
  constructor(id, network, pos, parentId, linkIds, floatingLinkIds) {
    __privateAdd(this, _malloc, new Float32Array(8));
    /** The network this reroute belongs to.  Contains all valid links and reroutes. */
    __privateAdd(this, _network);
    __privateAdd(this, _parentId);
    /** This property is only defined on the last reroute of a floating reroute chain (closest to input end). */
    __publicField(this, "floating");
    __privateAdd(this, _pos, __privateGet(this, _malloc).subarray(0, 2));
    /** @inheritdoc */
    __publicField(this, "selected");
    /** The ID ({@link LLink.id}) of every link using this reroute */
    __publicField(this, "linkIds");
    /** The ID ({@link LLink.id}) of every floating link using this reroute */
    __publicField(this, "floatingLinkIds");
    /** Cached cos */
    __publicField(this, "cos", 0);
    __publicField(this, "sin", 0);
    /** Bezier curve control point for the "target" (input) side of the link */
    __publicField(this, "controlPoint", __privateGet(this, _malloc).subarray(4, 6));
    /** @inheritdoc */
    __publicField(this, "path");
    /** @inheritdoc */
    __publicField(this, "_centreAngle");
    /** @inheritdoc */
    __publicField(this, "_pos", __privateGet(this, _malloc).subarray(6, 8));
    /** @inheritdoc */
    __publicField(this, "_dragging");
    /** Colour of the first link that rendered this reroute */
    __publicField(this, "_colour");
    /**
     * Used to ensure reroute angles are only executed once per frame.
     * @todo Calculate on change instead.
     */
    __privateAdd(this, _lastRenderTime, -Infinity);
    this.id = id;
    __privateSet(this, _network, new WeakRef(network));
    this.parentId = parentId;
    if (pos) this.pos = pos;
    this.linkIds = new Set(linkIds);
    this.floatingLinkIds = new Set(floatingLinkIds);
  }
  get parentId() {
    return __privateGet(this, _parentId);
  }
  /** Ignores attempts to create an infinite loop. @inheritdoc */
  set parentId(value) {
    if (value === this.id) return;
    if (this.getReroutes() === null) return;
    __privateSet(this, _parentId, value);
  }
  get parent() {
    var _a2;
    return (_a2 = __privateGet(this, _network).deref()) == null ? void 0 : _a2.getReroute(__privateGet(this, _parentId));
  }
  /** @inheritdoc */
  get pos() {
    return __privateGet(this, _pos);
  }
  set pos(value) {
    if (!((value == null ? void 0 : value.length) >= 2))
      throw new TypeError("Reroute.pos is an x,y point, and expects an indexable with at least two values.");
    __privateGet(this, _pos)[0] = value[0];
    __privateGet(this, _pos)[1] = value[1];
  }
  /** @inheritdoc */
  get boundingRect() {
    const { radius } = _Reroute;
    const [x2, y] = __privateGet(this, _pos);
    return [x2 - radius, y - radius, 2 * radius, 2 * radius];
  }
  /** The total number of links & floating links using this reroute */
  get totalLinks() {
    return this.linkIds.size + this.floatingLinkIds.size;
  }
  get firstLink() {
    var _a2;
    const linkId = this.linkIds.values().next().value;
    return linkId === void 0 ? void 0 : (_a2 = __privateGet(this, _network).deref()) == null ? void 0 : _a2.links.get(linkId);
  }
  get firstFloatingLink() {
    var _a2;
    const linkId = this.floatingLinkIds.values().next().value;
    return linkId === void 0 ? void 0 : (_a2 = __privateGet(this, _network).deref()) == null ? void 0 : _a2.floatingLinks.get(linkId);
  }
  /** @inheritdoc */
  get origin_id() {
    var _a2;
    return (_a2 = this.firstLink) == null ? void 0 : _a2.origin_id;
  }
  /** @inheritdoc */
  get origin_slot() {
    var _a2;
    return (_a2 = this.firstLink) == null ? void 0 : _a2.origin_slot;
  }
  /**
   * Applies a new parentId to the reroute, and optinoally a new position and linkId.
   * Primarily used for deserialisation.
   * @param parentId The ID of the reroute prior to this reroute, or
   * `undefined` if it is the first reroute connected to a nodes output
   * @param pos The position of this reroute
   * @param linkIds All link IDs that pass through this reroute
   */
  update(parentId, pos, linkIds, floating) {
    this.parentId = parentId;
    if (pos) this.pos = pos;
    if (linkIds) this.linkIds = new Set(linkIds);
    this.floating = floating;
  }
  /**
   * Validates the linkIds this reroute has.  Removes broken links.
   * @param links Collection of valid links
   * @returns true if any links remain after validation
   */
  validateLinks(links, floatingLinks) {
    const { linkIds, floatingLinkIds } = this;
    for (const linkId of linkIds) {
      if (!links.has(linkId)) linkIds.delete(linkId);
    }
    for (const linkId of floatingLinkIds) {
      if (!floatingLinks.has(linkId)) floatingLinkIds.delete(linkId);
    }
    return linkIds.size > 0 || floatingLinkIds.size > 0;
  }
  /**
   * Retrieves an ordered array of all reroutes from the node output.
   * @param visited Internal.  A set of reroutes that this function
   * has already visited whilst recursing up the chain.
   * @returns An ordered array of all reroutes from the node output to this reroute, inclusive.
   * `null` if an infinite loop is detected.
   * `undefined` if the reroute chain or {@link LinkNetwork} are invalid.
   */
  getReroutes(visited = /* @__PURE__ */ new Set()) {
    var _a2;
    if (__privateGet(this, _parentId) === void 0) return [this];
    if (visited.has(this)) return null;
    visited.add(this);
    const parent = (_a2 = __privateGet(this, _network).deref()) == null ? void 0 : _a2.reroutes.get(__privateGet(this, _parentId));
    if (!parent) {
      __privateSet(this, _parentId, void 0);
      return [this];
    }
    const reroutes = parent.getReroutes(visited);
    reroutes == null ? void 0 : reroutes.push(this);
    return reroutes;
  }
  /**
   * Internal.  Called by {@link LLink.findNextReroute}.  Not intended for use by itself.
   * @param withParentId The rerouteId to look for
   * @param visited A set of reroutes that have already been visited
   * @returns The reroute that was found, `undefined` if no reroute was found, or `null` if an infinite loop was detected.
   */
  findNextReroute(withParentId, visited = /* @__PURE__ */ new Set()) {
    var _a2, _b;
    if (__privateGet(this, _parentId) === withParentId) return this;
    if (visited.has(this)) return null;
    visited.add(this);
    if (__privateGet(this, _parentId) === void 0) return;
    return (_b = (_a2 = __privateGet(this, _network).deref()) == null ? void 0 : _a2.reroutes.get(__privateGet(this, _parentId))) == null ? void 0 : _b.findNextReroute(withParentId, visited);
  }
  findSourceOutput() {
    var _a2, _b;
    const link2 = (_a2 = this.firstLink) != null ? _a2 : this.firstFloatingLink;
    if (!link2) return;
    const node2 = (_b = __privateGet(this, _network).deref()) == null ? void 0 : _b.getNodeById(link2.origin_id);
    if (!node2) return;
    return {
      node: node2,
      output: node2.outputs[link2.origin_slot],
      outputIndex: link2.origin_slot,
      link: link2
    };
  }
  /**
   * Finds the first input slot for links or floating links passing through this reroute.
   */
  findTargetInputs() {
    const network = __privateGet(this, _network).deref();
    if (!network) return;
    const results = [];
    addAllResults(network, this.linkIds, network.links);
    addAllResults(network, this.floatingLinkIds, network.floatingLinks);
    return results;
    function addAllResults(network2, linkIds, links) {
      for (const linkId of linkIds) {
        const link2 = links.get(linkId);
        if (!link2) continue;
        const node2 = network2.getNodeById(link2.target_id);
        const input = node2 == null ? void 0 : node2.inputs[link2.target_slot];
        if (!input) continue;
        results.push({ node: node2, input, inputIndex: link2.target_slot, link: link2 });
      }
    }
  }
  /**
   * Retrieves all floating links passing through this reroute.
   * @param from Filters the links by the currently connected link side.
   * @returns An array of floating links
   */
  getFloatingLinks(from) {
    var _a2;
    const floatingLinks = (_a2 = __privateGet(this, _network).deref()) == null ? void 0 : _a2.floatingLinks;
    if (!floatingLinks) return;
    const idProp = from === "input" ? "origin_id" : "target_id";
    const out = [];
    for (const linkId of this.floatingLinkIds) {
      const link2 = floatingLinks.get(linkId);
      if ((link2 == null ? void 0 : link2[idProp]) === -1) out.push(link2);
    }
    return out;
  }
  /**
   * Changes the origin node/output of all floating links that pass through this reroute.
   * @param node The new origin node
   * @param output The new origin output slot
   * @param index The slot index of {@link output}
   */
  setFloatingLinkOrigin(node2, output, index) {
    var _a2, _b, _c, _d;
    const network = __privateGet(this, _network).deref();
    const floatingOutLinks = this.getFloatingLinks("output");
    if (!floatingOutLinks) throw new Error("[setFloatingLinkOrigin]: Invalid network.");
    if (!floatingOutLinks.length) return;
    (_a2 = output._floatingLinks) != null ? _a2 : output._floatingLinks = /* @__PURE__ */ new Set();
    for (const link2 of floatingOutLinks) {
      output._floatingLinks.add(link2);
      (_d = (_c = (_b = network == null ? void 0 : network.getNodeById(link2.origin_id)) == null ? void 0 : _b.outputs[link2.origin_slot]) == null ? void 0 : _c._floatingLinks) == null ? void 0 : _d.delete(link2);
      link2.origin_id = node2.id;
      link2.origin_slot = index;
    }
  }
  /** @inheritdoc */
  move(deltaX, deltaY) {
    __privateGet(this, _pos)[0] += deltaX;
    __privateGet(this, _pos)[1] += deltaY;
  }
  /** @inheritdoc */
  snapToGrid(snapTo) {
    if (!snapTo) return false;
    const { pos } = this;
    pos[0] = snapTo * Math.round(pos[0] / snapTo);
    pos[1] = snapTo * Math.round(pos[1] / snapTo);
    return true;
  }
  removeAllFloatingLinks() {
    for (const linkId of this.floatingLinkIds) {
      this.removeFloatingLink(linkId);
    }
  }
  removeFloatingLink(linkId) {
    const network = __privateGet(this, _network).deref();
    if (!network) return;
    const floatingLink = network.floatingLinks.get(linkId);
    if (!floatingLink) {
      console.warn(`[Reroute.removeFloatingLink] Floating link not found: ${linkId}, ignoring and discarding ID.`);
      this.floatingLinkIds.delete(linkId);
      return;
    }
    network.removeFloatingLink(floatingLink);
  }
  /**
   * Removes a link or floating link from this reroute, by matching link object instance equality.
   * @param link The link to remove.
   * @remarks Does not remove the link from the network.
   */
  removeLink(link2) {
    const network = __privateGet(this, _network).deref();
    if (!network) return;
    const floatingLink = network.floatingLinks.get(link2.id);
    if (link2 === floatingLink) {
      this.floatingLinkIds.delete(link2.id);
    } else {
      this.linkIds.delete(link2.id);
    }
  }
  remove() {
    const network = __privateGet(this, _network).deref();
    if (!network) return;
    network.removeReroute(this.id);
  }
  calculateAngle(lastRenderTime, network, linkStart) {
    if (!(lastRenderTime > __privateGet(this, _lastRenderTime))) return;
    __privateSet(this, _lastRenderTime, lastRenderTime);
    const { id, pos: thisPos } = this;
    const angles = [];
    let sum = 0;
    calculateAngles(this.linkIds, network.links);
    calculateAngles(this.floatingLinkIds, network.floatingLinks);
    if (!angles.length) {
      this.cos = 0;
      this.sin = 0;
      this.controlPoint[0] = 0;
      this.controlPoint[1] = 0;
      return;
    }
    sum /= angles.length;
    const originToReroute = Math.atan2(
      __privateGet(this, _pos)[1] - linkStart[1],
      __privateGet(this, _pos)[0] - linkStart[0]
    );
    let diff = (originToReroute - sum) * 0.5;
    if (Math.abs(diff) > Math.PI * 0.5) diff += Math.PI;
    const dist = Math.min(_Reroute.maxSplineOffset, distance(linkStart, __privateGet(this, _pos)) * 0.25);
    const originDiff = originToReroute - diff;
    const cos = Math.cos(originDiff);
    const sin = Math.sin(originDiff);
    this.cos = cos;
    this.sin = sin;
    this.controlPoint[0] = dist * -cos;
    this.controlPoint[1] = dist * -sin;
    function calculateAngles(linkIds, links) {
      for (const linkId of linkIds) {
        const link2 = links.get(linkId);
        const pos = getNextPos(network, link2, id);
        if (!pos) continue;
        const angle = getDirection(thisPos, pos);
        angles.push(angle);
        sum += angle;
      }
    }
  }
  /**
   * Renders the reroute on the canvas.
   * @param ctx Canvas context to draw on
   * @param backgroundPattern The canvas background pattern; used to make floating reroutes appear washed out.
   * @remarks Leaves {@link ctx}.fillStyle, strokeStyle, and lineWidth dirty (perf.).
   */
  draw(ctx, backgroundPattern) {
    var _a2;
    const { globalAlpha } = ctx;
    const { pos } = this;
    ctx.beginPath();
    ctx.arc(pos[0], pos[1], _Reroute.radius, 0, 2 * Math.PI);
    if (this.linkIds.size === 0) {
      ctx.fillStyle = backgroundPattern != null ? backgroundPattern : "#797979";
      ctx.fill();
      ctx.globalAlpha = globalAlpha * 0.33;
    }
    ctx.fillStyle = (_a2 = this._colour) != null ? _a2 : "#18184d";
    ctx.lineWidth = _Reroute.radius * 0.1;
    ctx.strokeStyle = "rgb(0,0,0,0.5)";
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffffff55";
    ctx.strokeStyle = "rgb(0,0,0,0.3)";
    ctx.beginPath();
    ctx.arc(pos[0], pos[1], _Reroute.radius * 0.8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    if (this.selected) {
      ctx.strokeStyle = "#fff";
      ctx.beginPath();
      ctx.arc(pos[0], pos[1], _Reroute.radius * 1.2, 0, 2 * Math.PI);
      ctx.stroke();
    }
    if (_Reroute.drawIdBadge) {
      const idBadge = new LGraphBadge({ text: this.id.toString() });
      const x2 = pos[0] - idBadge.getWidth(ctx) * 0.5;
      const y = pos[1] - idBadge.height - _Reroute.radius - 2;
      idBadge.draw(ctx, x2, y);
    }
    ctx.globalAlpha = globalAlpha;
  }
  drawHighlight(ctx, colour) {
    const { pos } = this;
    const { strokeStyle, lineWidth } = ctx;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = colour;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(pos[0], pos[1], _Reroute.radius * 1.5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
  }
  /** @inheritdoc */
  asSerialisable() {
    const { id, parentId, pos, linkIds } = this;
    return {
      id,
      parentId,
      pos: [pos[0], pos[1]],
      linkIds: [...linkIds],
      floating: this.floating ? { slotType: this.floating.slotType } : void 0
    };
  }
};
_malloc = new WeakMap();
_network = new WeakMap();
_parentId = new WeakMap();
_pos = new WeakMap();
_lastRenderTime = new WeakMap();
__publicField(_Reroute, "radius", 10);
/** Maximum distance from reroutes to their bezier curve control points. */
__publicField(_Reroute, "maxSplineOffset", 80);
__publicField(_Reroute, "drawIdBadge", false);
var Reroute = _Reroute;
function getNextPos(network, link2, id) {
  var _a2, _b;
  if (!link2) return;
  const linkPos = (_a2 = LLink.findNextReroute(network, link2, id)) == null ? void 0 : _a2.pos;
  if (linkPos) return linkPos;
  if (link2.target_id === -1 || link2.target_slot === -1) return;
  return (_b = network.getNodeById(link2.target_id)) == null ? void 0 : _b.getInputPos(link2.target_slot);
}
function getDirection(fromPos, toPos) {
  return Math.atan2(toPos[1] - fromPos[1], toPos[0] - fromPos[0]);
}
function getBoundaryNodes(nodes) {
  const valid = nodes == null ? void 0 : nodes.find((x2) => x2);
  if (!valid) return null;
  let top = valid;
  let right = valid;
  let bottom = valid;
  let left = valid;
  for (const node2 of nodes) {
    if (!node2) continue;
    const [x2, y] = node2.pos;
    const [width2, height] = node2.size;
    if (y < top.pos[1]) top = node2;
    if (x2 + width2 > right.pos[0] + right.size[0]) right = node2;
    if (y + height > bottom.pos[1] + bottom.size[1]) bottom = node2;
    if (x2 < left.pos[0]) left = node2;
  }
  return {
    top,
    right,
    bottom,
    left
  };
}
function distributeNodes(nodes, horizontal) {
  const nodeCount = nodes == null ? void 0 : nodes.length;
  if (!(nodeCount > 1)) return;
  const index = horizontal ? 0 : 1;
  let total = 0;
  let highest = -Infinity;
  for (const node2 of nodes) {
    total += node2.size[index];
    const high = node2.pos[index] + node2.size[index];
    if (high > highest) highest = high;
  }
  const sorted = [...nodes].sort((a, b) => a.pos[index] - b.pos[index]);
  const lowest = sorted[0].pos[index];
  const gap = (highest - lowest - total) / (nodeCount - 1);
  let startAt = lowest;
  for (let i = 0; i < nodeCount; i++) {
    const node2 = sorted[i];
    node2.pos[index] = startAt + gap * i;
    startAt += node2.size[index];
  }
}
function alignNodes(nodes, direction, align_to) {
  if (!nodes) return;
  const boundary = align_to === void 0 ? getBoundaryNodes(nodes) : { top: align_to, right: align_to, bottom: align_to, left: align_to };
  if (boundary === null) return;
  for (const node2 of nodes) {
    switch (direction) {
      case "right":
        node2.pos[0] = boundary.right.pos[0] + boundary.right.size[0] - node2.size[0];
        break;
      case "left":
        node2.pos[0] = boundary.left.pos[0];
        break;
      case "top":
        node2.pos[1] = boundary.top.pos[1];
        break;
      case "bottom":
        node2.pos[1] = boundary.bottom.pos[1] + boundary.bottom.size[1] - node2.size[1];
        break;
    }
  }
}
var _temp, _temp_vec2, _tmp_area, _margin_area, _link_bounding, _lTempA, _lTempB, _lTempC, _LGraphCanvas_instances, updateCursorStyle_fn, _maximumFrameGap, _visible_node_ids, _snapToGrid, _shiftDown, _dragZoomStart, validateCanvas_fn, dirty_fn, processPrimaryButton_fn, processNodeClick_fn, processWidgetClick_fn, processMiddleButton_fn, processDragZoom_fn, startDraggingItems_fn, processDraggedItems_fn, handleMultiSelect_fn, getLinkCentreOnPos_fn, getHighlightPosition_fn, renderSnapHighlight_fn, renderFloatingLinks_fn, renderAllLinkSegments_fn, addSplineOffset_fn;
var _LGraphCanvas = class _LGraphCanvas {
  /**
   * Creates a new instance of LGraphCanvas.
   * @param canvas The canvas HTML element (or its id) to use, or null / undefined to leave blank.
   * @param graph The graph that owns this canvas.
   * @param options
   */
  constructor(canvas2, graph, options22) {
    __privateAdd(this, _LGraphCanvas_instances);
    /**
     * The state of this canvas, e.g. whether it is being dragged, or read-only.
     *
     * Implemented as a POCO that can be proxied without side-effects.
     */
    __publicField(this, "state", {
      draggingItems: false,
      draggingCanvas: false,
      readOnly: false,
      hoveringOver: CanvasItem.Nothing,
      shouldSetCursor: true
    });
    // Whether the canvas was previously being dragged prior to pressing space key.
    // null if space key is not pressed.
    __publicField(this, "_previously_dragging_canvas", null);
    __privateAdd(this, _maximumFrameGap, 0);
    __publicField(this, "options");
    __publicField(this, "background_image");
    __publicField(this, "ds");
    __publicField(this, "pointer");
    __publicField(this, "zoom_modify_alpha");
    __publicField(this, "zoom_speed");
    __publicField(this, "node_title_color");
    __publicField(this, "default_link_color");
    __publicField(this, "default_connection_color");
    __publicField(this, "default_connection_color_byType");
    __publicField(this, "default_connection_color_byTypeOff");
    __publicField(this, "highquality_render");
    __publicField(this, "use_gradients");
    __publicField(this, "editor_alpha");
    __publicField(this, "pause_rendering");
    __publicField(this, "clear_background");
    __publicField(this, "clear_background_color");
    __publicField(this, "render_only_selected");
    __publicField(this, "show_info");
    __publicField(this, "allow_dragcanvas");
    __publicField(this, "allow_dragnodes");
    __publicField(this, "allow_interaction");
    __publicField(this, "multi_select");
    __publicField(this, "allow_searchbox");
    __publicField(this, "allow_reconnect_links");
    __publicField(this, "align_to_grid");
    __publicField(this, "drag_mode");
    __publicField(this, "dragging_rectangle");
    __publicField(this, "filter");
    __publicField(this, "set_canvas_dirty_on_mouse_event");
    __publicField(this, "always_render_background");
    __publicField(this, "render_shadows");
    __publicField(this, "render_canvas_border");
    __publicField(this, "render_connections_shadows");
    __publicField(this, "render_connections_border");
    __publicField(this, "render_curved_connections");
    __publicField(this, "render_connection_arrows");
    __publicField(this, "render_collapsed_slots");
    __publicField(this, "render_execution_order");
    __publicField(this, "render_link_tooltip");
    /** Shape of the markers shown at the midpoint of links.  Default: Circle */
    __publicField(this, "linkMarkerShape", LinkMarkerShape.Circle);
    __publicField(this, "links_render_mode");
    /** Zoom threshold for low quality rendering. Zoom below this threshold will render low quality. */
    __publicField(this, "low_quality_zoom_threshold", 0.6);
    /** mouse in canvas coordinates, where 0,0 is the top-left corner of the blue rectangle */
    __publicField(this, "mouse");
    /** mouse in graph coordinates, where 0,0 is the top-left corner of the blue rectangle */
    __publicField(this, "graph_mouse");
    /** @deprecated LEGACY: REMOVE THIS, USE {@link graph_mouse} INSTEAD */
    __publicField(this, "canvas_mouse");
    /** to personalize the search box */
    __publicField(this, "onSearchBox");
    __publicField(this, "onSearchBoxSelection");
    __publicField(this, "onMouse");
    /** to render background objects (behind nodes and connections) in the canvas affected by transform */
    __publicField(this, "onDrawBackground");
    /** to render foreground objects (above nodes and connections) in the canvas affected by transform */
    __publicField(this, "onDrawForeground");
    __publicField(this, "connections_width");
    /** The current node being drawn by {@link drawNode}.  This should NOT be used to determine the currently selected node.  See {@link selectedItems} */
    __publicField(this, "current_node");
    /** used for widgets */
    __publicField(this, "node_widget");
    /** The link to draw a tooltip for. */
    __publicField(this, "over_link_center");
    __publicField(this, "last_mouse_position");
    /** The visible area of this canvas.  Tightly coupled with {@link ds}. */
    __publicField(this, "visible_area");
    /** Contains all links and reroutes that were rendered.  Repopulated every render cycle. */
    __publicField(this, "renderedPaths", /* @__PURE__ */ new Set());
    /** @deprecated Replaced by {@link renderedPaths}, but length is set to 0 by some extensions. */
    __publicField(this, "visible_links", []);
    /** @deprecated This array is populated and cleared to support legacy extensions. The contents are ignored by Litegraph. */
    __publicField(this, "connecting_links");
    __publicField(this, "linkConnector", new LinkConnector((links) => this.connecting_links = links));
    /** The viewport of this canvas.  Tightly coupled with {@link ds}. */
    __publicField(this, "viewport");
    __publicField(this, "autoresize");
    __publicField(this, "frame", 0);
    __publicField(this, "last_draw_time", 0);
    __publicField(this, "render_time", 0);
    __publicField(this, "fps", 0);
    /** @deprecated See {@link LGraphCanvas.selectedItems} */
    __publicField(this, "selected_nodes", {});
    /** All selected nodes, groups, and reroutes */
    __publicField(this, "selectedItems", /* @__PURE__ */ new Set());
    /** The group currently being resized. */
    __publicField(this, "resizingGroup", null);
    /** @deprecated See {@link LGraphCanvas.selectedItems} */
    __publicField(this, "selected_group", null);
    /** The nodes that are currently visible on the canvas. */
    __publicField(this, "visible_nodes", []);
    /**
     * The IDs of the nodes that are currently visible on the canvas. More
     * performant than {@link visible_nodes} for visibility checks.
     */
    __privateAdd(this, _visible_node_ids, /* @__PURE__ */ new Set());
    __publicField(this, "node_over");
    __publicField(this, "node_capturing_input");
    __publicField(this, "highlighted_links", {});
    __publicField(this, "dirty_canvas", true);
    __publicField(this, "dirty_bgcanvas", true);
    /** A map of nodes that require selective-redraw */
    __publicField(this, "dirty_nodes", /* @__PURE__ */ new Map());
    __publicField(this, "dirty_area");
    /** @deprecated Unused */
    __publicField(this, "node_in_panel");
    __publicField(this, "last_mouse", [0, 0]);
    __publicField(this, "last_mouseclick", 0);
    __publicField(this, "graph");
    __publicField(this, "canvas");
    __publicField(this, "bgcanvas");
    __publicField(this, "ctx");
    __publicField(this, "_events_binded");
    __publicField(this, "bgctx");
    __publicField(this, "is_rendering");
    /** @deprecated Panels */
    __publicField(this, "block_click");
    /** @deprecated Panels */
    __publicField(this, "last_click_position");
    __publicField(this, "resizing_node");
    /** @deprecated See {@link LGraphCanvas.resizingGroup} */
    __publicField(this, "selected_group_resizing");
    /** @deprecated See {@link pointer}.{@link CanvasPointer.dragStarted dragStarted} */
    __publicField(this, "last_mouse_dragging");
    __publicField(this, "onMouseDown");
    __publicField(this, "_highlight_pos");
    __publicField(this, "_highlight_input");
    // TODO: Check if panels are used
    /** @deprecated Panels */
    __publicField(this, "node_panel");
    /** @deprecated Panels */
    __publicField(this, "options_panel");
    __publicField(this, "_bg_img");
    __publicField(this, "_pattern");
    __publicField(this, "_pattern_img");
    // TODO: This looks like another panel thing
    __publicField(this, "prompt_box");
    __publicField(this, "search_box");
    /** @deprecated Panels */
    __publicField(this, "SELECTED_NODE");
    /** @deprecated Panels */
    __publicField(this, "NODEPANEL_IS_OPEN");
    /** Once per frame check of snap to grid value.  @todo Update on change. */
    __privateAdd(this, _snapToGrid);
    /** Set on keydown, keyup. @todo */
    __privateAdd(this, _shiftDown, false);
    /** If true, enable drag zoom. Ctrl+Shift+Drag Up/Down: zoom canvas. */
    __publicField(this, "dragZoomEnabled", false);
    /** The start position of the drag zoom. */
    __privateAdd(this, _dragZoomStart, null);
    __publicField(this, "onClear");
    /** called after moving a node @deprecated Does not handle multi-node move, and can return the wrong node. */
    __publicField(this, "onNodeMoved");
    /** called if the selection changes */
    __publicField(this, "onSelectionChange");
    /** called when rendering a tooltip */
    __publicField(this, "onDrawLinkTooltip");
    /** to render foreground objects not affected by transform (for GUIs) */
    __publicField(this, "onDrawOverlay");
    __publicField(this, "onRenderBackground");
    __publicField(this, "onNodeDblClicked");
    __publicField(this, "onShowNodePanel");
    __publicField(this, "onNodeSelected");
    __publicField(this, "onNodeDeselected");
    __publicField(this, "onRender");
    /** Implement this function to allow conversion of widget types to input types, e.g. number -> INT or FLOAT for widget link validation checks */
    __publicField(this, "getWidgetLinkType");
    options22 || (options22 = {});
    this.options = options22;
    this.background_image = _LGraphCanvas.DEFAULT_BACKGROUND_IMAGE;
    this.ds = new DragAndScale(canvas2);
    this.pointer = new CanvasPointer(canvas2);
    this.linkConnector.events.addEventListener("reset", () => {
      this.connecting_links = null;
    });
    this.linkConnector.events.addEventListener("dropped-on-canvas", (customEvent) => {
      var _a2;
      if (!this.connecting_links) return;
      const e2 = customEvent.detail;
      this.emitEvent({
        subType: "empty-release",
        originalEvent: e2,
        linkReleaseContext: { links: this.connecting_links }
      });
      const firstLink = this.linkConnector.renderLinks[0];
      if (LiteGraph.release_link_on_empty_shows_menu) {
        const linkReleaseContext = this.linkConnector.state.connectingTo === "input" ? {
          node_from: firstLink.node,
          slot_from: firstLink.fromSlot,
          type_filter_in: firstLink.fromSlot.type
        } : {
          node_to: firstLink.node,
          slot_from: firstLink.fromSlot,
          type_filter_out: firstLink.fromSlot.type
        };
        const afterRerouteId = (_a2 = firstLink.fromReroute) == null ? void 0 : _a2.id;
        if ("shiftKey" in e2 && e2.shiftKey) {
          if (this.allow_searchbox) {
            this.showSearchBox(e2, linkReleaseContext);
          }
        } else if (this.linkConnector.state.connectingTo === "input") {
          this.showConnectionMenu({ nodeFrom: firstLink.node, slotFrom: firstLink.fromSlot, e: e2, afterRerouteId });
        } else {
          this.showConnectionMenu({ nodeTo: firstLink.node, slotTo: firstLink.fromSlot, e: e2, afterRerouteId });
        }
      }
    });
    this.zoom_modify_alpha = true;
    this.zoom_speed = 1.1;
    this.node_title_color = LiteGraph.NODE_TITLE_COLOR;
    this.default_link_color = LiteGraph.LINK_COLOR;
    this.default_connection_color = {
      input_off: "#778",
      input_on: "#7F7",
      output_off: "#778",
      output_on: "#7F7"
    };
    this.default_connection_color_byType = {
      /* number: "#7F7",
            string: "#77F",
            boolean: "#F77", */
    };
    this.default_connection_color_byTypeOff = {
      /* number: "#474",
            string: "#447",
            boolean: "#744", */
    };
    this.highquality_render = true;
    this.use_gradients = false;
    this.editor_alpha = 1;
    this.pause_rendering = false;
    this.clear_background = true;
    this.clear_background_color = "#222";
    this.render_only_selected = true;
    this.show_info = true;
    this.allow_dragcanvas = true;
    this.allow_dragnodes = true;
    this.allow_interaction = true;
    this.multi_select = false;
    this.allow_searchbox = true;
    this.allow_reconnect_links = true;
    this.align_to_grid = false;
    this.drag_mode = false;
    this.dragging_rectangle = null;
    this.filter = null;
    this.set_canvas_dirty_on_mouse_event = true;
    this.always_render_background = false;
    this.render_shadows = true;
    this.render_canvas_border = true;
    this.render_connections_shadows = false;
    this.render_connections_border = true;
    this.render_curved_connections = false;
    this.render_connection_arrows = false;
    this.render_collapsed_slots = true;
    this.render_execution_order = false;
    this.render_link_tooltip = true;
    this.links_render_mode = LinkRenderType.SPLINE_LINK;
    this.mouse = [0, 0];
    this.graph_mouse = [0, 0];
    this.canvas_mouse = this.graph_mouse;
    this.connections_width = 3;
    this.current_node = null;
    this.node_widget = null;
    this.last_mouse_position = [0, 0];
    this.visible_area = this.ds.visible_area;
    this.connecting_links = null;
    this.viewport = options22.viewport || null;
    this.graph = graph;
    graph == null ? void 0 : graph.attachCanvas(this);
    this.canvas = void 0;
    this.bgcanvas = void 0;
    this.ctx = void 0;
    this.setCanvas(canvas2, options22.skip_events);
    this.clear();
    if (!options22.skip_render) {
      this.startRendering();
    }
    this.autoresize = options22.autoresize;
  }
  // #region Legacy accessors
  /** @deprecated @inheritdoc {@link LGraphCanvasState.readOnly} */
  get read_only() {
    return this.state.readOnly;
  }
  set read_only(value) {
    this.state.readOnly = value;
    __privateMethod(this, _LGraphCanvas_instances, updateCursorStyle_fn).call(this);
  }
  get isDragging() {
    return this.state.draggingItems;
  }
  set isDragging(value) {
    this.state.draggingItems = value;
  }
  get hoveringOver() {
    return this.state.hoveringOver;
  }
  set hoveringOver(value) {
    this.state.hoveringOver = value;
    __privateMethod(this, _LGraphCanvas_instances, updateCursorStyle_fn).call(this);
  }
  /** @deprecated Replace all references with {@link pointer}.{@link CanvasPointer.isDown isDown}. */
  get pointer_is_down() {
    return this.pointer.isDown;
  }
  /** @deprecated Replace all references with {@link pointer}.{@link CanvasPointer.isDouble isDouble}. */
  get pointer_is_double() {
    return this.pointer.isDouble;
  }
  /** @deprecated @inheritdoc {@link LGraphCanvasState.draggingCanvas} */
  get dragging_canvas() {
    return this.state.draggingCanvas;
  }
  set dragging_canvas(value) {
    this.state.draggingCanvas = value;
    __privateMethod(this, _LGraphCanvas_instances, updateCursorStyle_fn).call(this);
  }
  // #endregion Legacy accessors
  /**
   * @deprecated Use {@link LGraphNode.titleFontStyle} instead.
   */
  get title_text_font() {
    return `${LiteGraph.NODE_TEXT_SIZE}px Arial`;
  }
  get inner_text_font() {
    return `normal ${LiteGraph.NODE_SUBTEXT_SIZE}px Arial`;
  }
  /** Maximum frames per second to render. 0: unlimited. Default: 0 */
  get maximumFps() {
    return __privateGet(this, _maximumFrameGap) > Number.EPSILON ? __privateGet(this, _maximumFrameGap) / 1e3 : 0;
  }
  set maximumFps(value) {
    __privateSet(this, _maximumFrameGap, value > Number.EPSILON ? 1e3 / value : 0);
  }
  /**
   * @deprecated Use {@link LiteGraphGlobal.ROUND_RADIUS} instead.
   */
  get round_radius() {
    return LiteGraph.ROUND_RADIUS;
  }
  /**
   * @deprecated Use {@link LiteGraphGlobal.ROUND_RADIUS} instead.
   */
  set round_radius(value) {
    LiteGraph.ROUND_RADIUS = value;
  }
  /**
   * Render low quality when zoomed out.
   */
  get low_quality() {
    return this.ds.scale < this.low_quality_zoom_threshold;
  }
  static onGroupAdd(info, entry, mouse_event) {
    const canvas2 = _LGraphCanvas.active_canvas;
    const group = new LiteGraph.LGraphGroup();
    group.pos = canvas2.convertEventToCanvasOffset(mouse_event);
    if (!canvas2.graph) throw new NullGraphError();
    canvas2.graph.add(group);
  }
  /**
   * @deprecated Functionality moved to {@link getBoundaryNodes}.  The new function returns null on failure, instead of an object with all null properties.
   * Determines the furthest nodes in each direction
   * @param nodes the nodes to from which boundary nodes will be extracted
   * @returns
   */
  static getBoundaryNodes(nodes) {
    var _a2;
    const _nodes = Array.isArray(nodes) ? nodes : Object.values(nodes);
    return (_a2 = getBoundaryNodes(_nodes)) != null ? _a2 : {
      top: null,
      right: null,
      bottom: null,
      left: null
    };
  }
  /**
   * @deprecated Functionality moved to {@link alignNodes}.  The new function does not set dirty canvas.
   * @param nodes a list of nodes
   * @param direction Direction to align the nodes
   * @param align_to Node to align to (if null, align to the furthest node in the given direction)
   */
  static alignNodes(nodes, direction, align_to) {
    alignNodes(Object.values(nodes), direction, align_to);
    _LGraphCanvas.active_canvas.setDirty(true, true);
  }
  static onNodeAlign(value, options22, event, prev_menu, node2) {
    new LiteGraph.ContextMenu(["Top", "Bottom", "Left", "Right"], {
      event,
      callback: inner_clicked,
      parentMenu: prev_menu
    });
    function inner_clicked(value2) {
      alignNodes(
        Object.values(_LGraphCanvas.active_canvas.selected_nodes),
        value2.toLowerCase(),
        node2
      );
      _LGraphCanvas.active_canvas.setDirty(true, true);
    }
  }
  static onGroupAlign(value, options22, event, prev_menu) {
    new LiteGraph.ContextMenu(["Top", "Bottom", "Left", "Right"], {
      event,
      callback: inner_clicked,
      parentMenu: prev_menu
    });
    function inner_clicked(value2) {
      alignNodes(
        Object.values(_LGraphCanvas.active_canvas.selected_nodes),
        value2.toLowerCase()
      );
      _LGraphCanvas.active_canvas.setDirty(true, true);
    }
  }
  static createDistributeMenu(value, options22, event, prev_menu) {
    new LiteGraph.ContextMenu(["Vertically", "Horizontally"], {
      event,
      callback: inner_clicked,
      parentMenu: prev_menu
    });
    function inner_clicked(value2) {
      const canvas2 = _LGraphCanvas.active_canvas;
      distributeNodes(Object.values(canvas2.selected_nodes), value2 === "Horizontally");
      canvas2.setDirty(true, true);
    }
  }
  static onMenuAdd(value, options22, e2, prev_menu, callback) {
    const canvas2 = _LGraphCanvas.active_canvas;
    const ref_window = canvas2.getCanvasWindow();
    const { graph } = canvas2;
    if (!graph) return;
    inner_onMenuAdded("", prev_menu);
    return false;
    function inner_onMenuAdded(base_category, prev_menu2) {
      if (!graph) return;
      const categories = LiteGraph.getNodeTypesCategories(canvas2.filter || graph.filter).filter((category) => category.startsWith(base_category));
      const entries2 = [];
      for (const category of categories) {
        if (!category) continue;
        const base_category_regex = new RegExp(`^(${base_category})`);
        const category_name = category.replace(base_category_regex, "").split("/", 1)[0];
        const category_path = base_category === "" ? `${category_name}/` : `${base_category}${category_name}/`;
        let name = category_name;
        if (name.includes("::")) name = name.split("::", 2)[1];
        const index = entries2.findIndex((entry) => entry.value === category_path);
        if (index === -1) {
          entries2.push({
            value: category_path,
            content: name,
            has_submenu: true,
            callback: function(value2, event, mouseEvent, contextMenu) {
              inner_onMenuAdded(value2.value, contextMenu);
            }
          });
        }
      }
      const nodes = LiteGraph.getNodeTypesInCategory(
        base_category.slice(0, -1),
        canvas2.filter || graph.filter
      );
      for (const node2 of nodes) {
        if (node2.skip_list) continue;
        const entry = {
          value: node2.type,
          content: node2.title,
          has_submenu: false,
          callback: function(value2, event, mouseEvent, contextMenu) {
            if (!canvas2.graph) throw new NullGraphError();
            const first_event = contextMenu.getFirstEvent();
            canvas2.graph.beforeChange();
            const node22 = LiteGraph.createNode(value2.value);
            if (node22) {
              if (!first_event) throw new TypeError("Context menu event was null. This should not occure in normal usage.");
              node22.pos = canvas2.convertEventToCanvasOffset(first_event);
              canvas2.graph.add(node22);
            }
            callback == null ? void 0 : callback(node22);
            canvas2.graph.afterChange();
          }
        };
        entries2.push(entry);
      }
      new LiteGraph.ContextMenu(entries2, { event: e2, parentMenu: prev_menu2 }, ref_window);
    }
  }
  static onMenuCollapseAll() {
  }
  static onMenuNodeEdit() {
  }
  /** @param _options Parameter is never used */
  static showMenuNodeOptionalOutputs(v2, _options, e2, prev_menu, node2) {
    var _a2;
    if (!node2) return;
    const canvas2 = _LGraphCanvas.active_canvas;
    let entries2 = [];
    if (LiteGraph.do_add_triggers_slots && node2.findOutputSlot("onExecuted") == -1) {
      entries2.push({ content: "On Executed", value: ["onExecuted", LiteGraph.EVENT, { nameLocked: true }], className: "event" });
    }
    const retEntries = (_a2 = node2.onMenuNodeOutputs) == null ? void 0 : _a2.call(node2, entries2);
    if (retEntries) entries2 = retEntries;
    if (!entries2.length) return;
    new LiteGraph.ContextMenu(
      entries2,
      {
        event: e2,
        callback: inner_clicked,
        parentMenu: prev_menu,
        node: node2
      }
    );
    function inner_clicked(v22, e22, prev) {
      var _a3;
      if (!node2) return;
      if (v22.callback) v22.callback.call(this, node2, v22, e22, prev);
      if (!v22.value) return;
      const value = v22.value[1];
      if (value && (typeof value === "object" || Array.isArray(value))) {
        const entries22 = [];
        for (const i in value) {
          entries22.push({ content: i, value: value[i] });
        }
        new LiteGraph.ContextMenu(entries22, {
          event: e22,
          callback: inner_clicked,
          parentMenu: prev_menu,
          node: node2
        });
        return false;
      }
      const { graph } = node2;
      if (!graph) throw new NullGraphError();
      graph.beforeChange();
      node2.addOutput(v22.value[0], v22.value[1], v22.value[2]);
      (_a3 = node2.onNodeOutputAdd) == null ? void 0 : _a3.call(node2, v22.value);
      canvas2.setDirty(true, true);
      graph.afterChange();
    }
    return false;
  }
  /** @param value Parameter is never used */
  static onShowMenuNodeProperties(value, options22, e2, prev_menu, node2) {
    if (!node2 || !node2.properties) return;
    const canvas2 = _LGraphCanvas.active_canvas;
    const ref_window = canvas2.getCanvasWindow();
    const entries2 = [];
    for (const i in node2.properties) {
      value = node2.properties[i] !== void 0 ? node2.properties[i] : " ";
      if (typeof value == "object")
        value = JSON.stringify(value);
      const info = node2.getPropertyInfo(i);
      if (info.type == "enum" || info.type == "combo")
        value = _LGraphCanvas.getPropertyPrintableValue(value, info.values);
      value = _LGraphCanvas.decodeHTML(stringOrEmpty(value));
      entries2.push({
        content: `<span class='property_name'>${info.label || i}</span><span class='property_value'>${value}</span>`,
        value: i
      });
    }
    if (!entries2.length) {
      return;
    }
    new LiteGraph.ContextMenu(
      entries2,
      {
        event: e2,
        callback: inner_clicked,
        parentMenu: prev_menu,
        allow_html: true,
        node: node2
      },
      // @ts-expect-error Unused
      ref_window
    );
    function inner_clicked(v2) {
      if (!node2) return;
      const rect = this.getBoundingClientRect();
      canvas2.showEditPropertyValue(node2, v2.value, {
        position: [rect.left, rect.top]
      });
    }
    return false;
  }
  /** @deprecated */
  static decodeHTML(str) {
    const e2 = document.createElement("div");
    e2.textContent = str;
    return e2.innerHTML;
  }
  static onMenuResizeNode(value, options22, e2, menu, node2) {
    if (!node2) return;
    const fApplyMultiNode = function(node22) {
      node22.setSize(node22.computeSize());
    };
    const canvas2 = _LGraphCanvas.active_canvas;
    if (!canvas2.selected_nodes || Object.keys(canvas2.selected_nodes).length <= 1) {
      fApplyMultiNode(node2);
    } else {
      for (const i in canvas2.selected_nodes) {
        fApplyMultiNode(canvas2.selected_nodes[i]);
      }
    }
    canvas2.setDirty(true, true);
  }
  // TODO refactor :: this is used fot title but not for properties!
  static onShowPropertyEditor(item, options22, e2, menu, node2) {
    const property = item.property || "title";
    const value = node2[property];
    const title = document.createElement("span");
    title.className = "name";
    title.textContent = property;
    const input = document.createElement("input");
    Object.assign(input, { type: "text", className: "value", autofocus: true });
    const button = document.createElement("button");
    button.textContent = "OK";
    const dialog = Object.assign(document.createElement("div"), {
      is_modified: false,
      className: "graphdialog",
      close: () => dialog.remove()
    });
    dialog.append(title, input, button);
    input.value = String(value);
    input.addEventListener("blur", function() {
      this.focus();
    });
    input.addEventListener("keydown", (e22) => {
      dialog.is_modified = true;
      if (e22.key == "Escape") {
        dialog.close();
      } else if (e22.key == "Enter") {
        inner();
      } else if (!e22.target || !("localName" in e22.target) || e22.target.localName != "textarea") {
        return;
      }
      e22.preventDefault();
      e22.stopPropagation();
    });
    const canvas2 = _LGraphCanvas.active_canvas;
    const canvasEl = canvas2.canvas;
    const rect = canvasEl.getBoundingClientRect();
    const offsetx = rect ? -20 - rect.left : -20;
    const offsety = rect ? -20 - rect.top : -20;
    if (e2) {
      dialog.style.left = `${e2.clientX + offsetx}px`;
      dialog.style.top = `${e2.clientY + offsety}px`;
    } else {
      dialog.style.left = `${canvasEl.width * 0.5 + offsetx}px`;
      dialog.style.top = `${canvasEl.height * 0.5 + offsety}px`;
    }
    button.addEventListener("click", inner);
    if (canvasEl.parentNode == null) throw new TypeError("canvasEl.parentNode was null");
    canvasEl.parentNode.append(dialog);
    input.focus();
    let dialogCloseTimer;
    dialog.addEventListener("mouseleave", function() {
      if (LiteGraph.dialog_close_on_mouse_leave) {
        if (!dialog.is_modified && LiteGraph.dialog_close_on_mouse_leave) {
          dialogCloseTimer = setTimeout(
            dialog.close,
            LiteGraph.dialog_close_on_mouse_leave_delay
          );
        }
      }
    });
    dialog.addEventListener("mouseenter", function() {
      if (LiteGraph.dialog_close_on_mouse_leave) {
        if (dialogCloseTimer) clearTimeout(dialogCloseTimer);
      }
    });
    function inner() {
      if (input) setValue(input.value);
    }
    function setValue(value2) {
      if (item.type == "Number") {
        value2 = Number(value2);
      } else if (item.type == "Boolean") {
        value2 = Boolean(value2);
      }
      node2[property] = value2;
      dialog.remove();
      canvas2.setDirty(true, true);
    }
  }
  static getPropertyPrintableValue(value, values) {
    if (!values) return String(value);
    if (Array.isArray(values)) {
      return String(value);
    }
    if (typeof values === "object") {
      let desc_value = "";
      for (const k in values) {
        if (values[k] != value) continue;
        desc_value = k;
        break;
      }
      return `${String(value)} (${desc_value})`;
    }
  }
  static onMenuNodeCollapse(value, options22, e2, menu, node2) {
    if (!node2.graph) throw new NullGraphError();
    node2.graph.beforeChange();
    const fApplyMultiNode = function(node22) {
      node22.collapse();
    };
    const graphcanvas = _LGraphCanvas.active_canvas;
    if (!graphcanvas.selected_nodes || Object.keys(graphcanvas.selected_nodes).length <= 1) {
      fApplyMultiNode(node2);
    } else {
      for (const i in graphcanvas.selected_nodes) {
        fApplyMultiNode(graphcanvas.selected_nodes[i]);
      }
    }
    node2.graph.afterChange();
  }
  static onMenuToggleAdvanced(value, options22, e2, menu, node2) {
    if (!node2.graph) throw new NullGraphError();
    node2.graph.beforeChange();
    const fApplyMultiNode = function(node22) {
      node22.toggleAdvanced();
    };
    const graphcanvas = _LGraphCanvas.active_canvas;
    if (!graphcanvas.selected_nodes || Object.keys(graphcanvas.selected_nodes).length <= 1) {
      fApplyMultiNode(node2);
    } else {
      for (const i in graphcanvas.selected_nodes) {
        fApplyMultiNode(graphcanvas.selected_nodes[i]);
      }
    }
    node2.graph.afterChange();
  }
  static onMenuNodeMode(value, options22, e2, menu, node2) {
    new LiteGraph.ContextMenu(
      LiteGraph.NODE_MODES,
      { event: e2, callback: inner_clicked, parentMenu: menu, node: node2 }
    );
    function inner_clicked(v2) {
      if (!node2) return;
      const kV = Object.values(LiteGraph.NODE_MODES).indexOf(v2);
      const fApplyMultiNode = function(node22) {
        if (kV !== -1 && LiteGraph.NODE_MODES[kV]) {
          node22.changeMode(kV);
        } else {
          console.warn(`unexpected mode: ${v2}`);
          node22.changeMode(LGraphEventMode.ALWAYS);
        }
      };
      const graphcanvas = _LGraphCanvas.active_canvas;
      if (!graphcanvas.selected_nodes || Object.keys(graphcanvas.selected_nodes).length <= 1) {
        fApplyMultiNode(node2);
      } else {
        for (const i in graphcanvas.selected_nodes) {
          fApplyMultiNode(graphcanvas.selected_nodes[i]);
        }
      }
    }
    return false;
  }
  /** @param value Parameter is never used */
  static onMenuNodeColors(value, options22, e2, menu, node2) {
    if (!node2) throw "no node for color";
    const values = [];
    values.push({
      value: null,
      content: "<span style='display: block; padding-left: 4px;'>No color</span>"
    });
    for (const i in _LGraphCanvas.node_colors) {
      const color = _LGraphCanvas.node_colors[i];
      value = {
        value: i,
        content: `<span style='display: block; color: #999; padding-left: 4px; border-left: 8px solid ${color.color}; background-color:${color.bgcolor}'>${i}</span>`
      };
      values.push(value);
    }
    new LiteGraph.ContextMenu(values, {
      event: e2,
      callback: inner_clicked,
      parentMenu: menu,
      node: node2
    });
    function inner_clicked(v2) {
      if (!node2) return;
      const fApplyColor = function(item) {
        const colorOption = v2.value ? _LGraphCanvas.node_colors[v2.value] : null;
        item.setColorOption(colorOption);
      };
      const canvas2 = _LGraphCanvas.active_canvas;
      if (!canvas2.selected_nodes || Object.keys(canvas2.selected_nodes).length <= 1) {
        fApplyColor(node2);
      } else {
        for (const i in canvas2.selected_nodes) {
          fApplyColor(canvas2.selected_nodes[i]);
        }
      }
      canvas2.setDirty(true, true);
    }
    return false;
  }
  static onMenuNodeShapes(value, options22, e2, menu, node2) {
    if (!node2) throw "no node passed";
    new LiteGraph.ContextMenu(LiteGraph.VALID_SHAPES, {
      event: e2,
      callback: inner_clicked,
      parentMenu: menu,
      node: node2
    });
    function inner_clicked(v2) {
      if (!node2) return;
      if (!node2.graph) throw new NullGraphError();
      node2.graph.beforeChange();
      const fApplyMultiNode = function(node22) {
        node22.shape = v2;
      };
      const canvas2 = _LGraphCanvas.active_canvas;
      if (!canvas2.selected_nodes || Object.keys(canvas2.selected_nodes).length <= 1) {
        fApplyMultiNode(node2);
      } else {
        for (const i in canvas2.selected_nodes) {
          fApplyMultiNode(canvas2.selected_nodes[i]);
        }
      }
      node2.graph.afterChange();
      canvas2.setDirty(true);
    }
    return false;
  }
  static onMenuNodeRemove() {
    _LGraphCanvas.active_canvas.deleteSelected();
  }
  static onMenuNodeClone(value, options22, e2, menu, node2) {
    const { graph } = node2;
    if (!graph) throw new NullGraphError();
    graph.beforeChange();
    const newSelected = /* @__PURE__ */ new Set();
    const fApplyMultiNode = function(node22, newNodes) {
      if (node22.clonable === false) return;
      const newnode = node22.clone();
      if (!newnode) return;
      newnode.pos = [node22.pos[0] + 5, node22.pos[1] + 5];
      if (!node22.graph) throw new NullGraphError();
      node22.graph.add(newnode);
      newNodes.add(newnode);
    };
    const canvas2 = _LGraphCanvas.active_canvas;
    if (!canvas2.selected_nodes || Object.keys(canvas2.selected_nodes).length <= 1) {
      fApplyMultiNode(node2, newSelected);
    } else {
      for (const i in canvas2.selected_nodes) {
        fApplyMultiNode(canvas2.selected_nodes[i], newSelected);
      }
    }
    if (newSelected.size) {
      canvas2.selectNodes([...newSelected]);
    }
    graph.afterChange();
    canvas2.setDirty(true, true);
  }
  /**
   * clears all the data inside
   *
   */
  clear() {
    var _a2, _b;
    this.frame = 0;
    this.last_draw_time = 0;
    this.render_time = 0;
    this.fps = 0;
    this.dragging_rectangle = null;
    this.selected_nodes = {};
    this.selected_group = null;
    this.selectedItems.clear();
    (_a2 = this.onSelectionChange) == null ? void 0 : _a2.call(this, this.selected_nodes);
    this.visible_nodes = [];
    this.node_over = void 0;
    this.node_capturing_input = null;
    this.connecting_links = null;
    this.highlighted_links = {};
    this.dragging_canvas = false;
    __privateMethod(this, _LGraphCanvas_instances, dirty_fn).call(this);
    this.dirty_area = null;
    this.node_in_panel = null;
    this.node_widget = null;
    this.last_mouse = [0, 0];
    this.last_mouseclick = 0;
    this.pointer.reset();
    this.visible_area.set([0, 0, 0, 0]);
    (_b = this.onClear) == null ? void 0 : _b.call(this);
  }
  /**
   * assigns a graph, you can reassign graphs to the same canvas
   * @param graph
   */
  setGraph(graph, skip_clear) {
    if (this.graph == graph) return;
    if (!skip_clear) this.clear();
    if (!graph && this.graph) {
      this.graph.detachCanvas(this);
      return;
    }
    graph.attachCanvas(this);
    this.setDirty(true, true);
  }
  /**
   * @returns the visually active graph (in case there are more in the stack)
   */
  getCurrentGraph() {
    return this.graph;
  }
  /**
   * Sets the current HTML canvas element.
   * Calls bindEvents to add input event listeners, and (re)creates the background canvas.
   * @param canvas The canvas element to assign, or its HTML element ID.  If null or undefined, the current reference is cleared.
   * @param skip_events If true, events on the previous canvas will not be removed.  Has no effect on the first invocation.
   */
  setCanvas(canvas2, skip_events) {
    var _a2;
    const element = __privateMethod(this, _LGraphCanvas_instances, validateCanvas_fn).call(this, canvas2);
    if (element === this.canvas) return;
    if (!element && this.canvas && !skip_events) this.unbindEvents();
    this.canvas = element;
    this.ds.element = element;
    this.pointer.element = element;
    if (!element) return;
    element.className += " lgraphcanvas";
    element.data = this;
    this.bgcanvas = document.createElement("canvas");
    this.bgcanvas.width = this.canvas.width;
    this.bgcanvas.height = this.canvas.height;
    const ctx = (_a2 = element.getContext) == null ? void 0 : _a2.call(element, "2d");
    if (ctx == null) {
      if (element.localName != "canvas") {
        throw `Element supplied for LGraphCanvas must be a <canvas> element, you passed a ${element.localName}`;
      }
      throw "This browser doesn't support Canvas";
    }
    this.ctx = ctx;
    if (!skip_events) this.bindEvents();
  }
  /** Captures an event and prevents default - returns false. */
  _doNothing(e2) {
    e2.preventDefault();
    return false;
  }
  /** Captures an event and prevents default - returns true. */
  _doReturnTrue(e2) {
    e2.preventDefault();
    return true;
  }
  /**
   * binds mouse, keyboard, touch and drag events to the canvas
   */
  bindEvents() {
    if (this._events_binded) {
      console.warn("LGraphCanvas: events already binded");
      return;
    }
    const { canvas: canvas2 } = this;
    const { document: document2 } = this.getCanvasWindow();
    this._mousedown_callback = this.processMouseDown.bind(this);
    this._mousewheel_callback = this.processMouseWheel.bind(this);
    this._mousemove_callback = this.processMouseMove.bind(this);
    this._mouseup_callback = this.processMouseUp.bind(this);
    this._mouseout_callback = this.processMouseOut.bind(this);
    this._mousecancel_callback = this.processMouseCancel.bind(this);
    canvas2.addEventListener("pointerdown", this._mousedown_callback, true);
    canvas2.addEventListener("wheel", this._mousewheel_callback, false);
    canvas2.addEventListener("pointerup", this._mouseup_callback, true);
    canvas2.addEventListener("pointermove", this._mousemove_callback);
    canvas2.addEventListener("pointerout", this._mouseout_callback);
    canvas2.addEventListener("pointercancel", this._mousecancel_callback, true);
    canvas2.addEventListener("contextmenu", this._doNothing);
    this._key_callback = this.processKey.bind(this);
    canvas2.addEventListener("keydown", this._key_callback, true);
    document2.addEventListener("keyup", this._key_callback, true);
    canvas2.addEventListener("dragover", this._doNothing, false);
    canvas2.addEventListener("dragend", this._doNothing, false);
    canvas2.addEventListener("dragenter", this._doReturnTrue, false);
    this._events_binded = true;
  }
  /**
   * unbinds mouse events from the canvas
   */
  unbindEvents() {
    if (!this._events_binded) {
      console.warn("LGraphCanvas: no events binded");
      return;
    }
    const { document: document2 } = this.getCanvasWindow();
    const { canvas: canvas2 } = this;
    canvas2.removeEventListener("pointercancel", this._mousecancel_callback);
    canvas2.removeEventListener("pointerout", this._mouseout_callback);
    canvas2.removeEventListener("pointermove", this._mousemove_callback);
    canvas2.removeEventListener("pointerup", this._mouseup_callback);
    canvas2.removeEventListener("pointerdown", this._mousedown_callback);
    canvas2.removeEventListener("wheel", this._mousewheel_callback);
    canvas2.removeEventListener("keydown", this._key_callback);
    document2.removeEventListener("keyup", this._key_callback);
    canvas2.removeEventListener("contextmenu", this._doNothing);
    canvas2.removeEventListener("dragenter", this._doReturnTrue);
    this._mousedown_callback = void 0;
    this._mousewheel_callback = void 0;
    this._key_callback = void 0;
    this._events_binded = false;
  }
  /**
   * Ensures the canvas will be redrawn on the next frame by setting the dirty flag(s).
   * Without parameters, this function does nothing.
   * @todo Impl. `setDirty()` or similar as shorthand to redraw everything.
   * @param fgcanvas If true, marks the foreground canvas as dirty (nodes and anything drawn on top of them).  Default: false
   * @param bgcanvas If true, mark the background canvas as dirty (background, groups, links).  Default: false
   */
  setDirty(fgcanvas, bgcanvas) {
    if (fgcanvas) this.dirty_canvas = true;
    if (bgcanvas) this.dirty_bgcanvas = true;
  }
  /**
   * Used to attach the canvas in a popup
   * @returns returns the window where the canvas is attached (the DOM root node)
   */
  getCanvasWindow() {
    if (!this.canvas) return window;
    const doc = this.canvas.ownerDocument;
    return doc.defaultView || doc.parentWindow;
  }
  /**
   * starts rendering the content of the canvas when needed
   *
   */
  startRendering() {
    if (this.is_rendering) return;
    this.is_rendering = true;
    renderFrame.call(this);
    function renderFrame() {
      if (!this.pause_rendering) {
        this.draw();
      }
      const window2 = this.getCanvasWindow();
      if (this.is_rendering) {
        if (__privateGet(this, _maximumFrameGap) > 0) {
          const gap = __privateGet(this, _maximumFrameGap) - (LiteGraph.getTime() - this.last_draw_time);
          setTimeout(renderFrame.bind(this), Math.max(1, gap));
        } else {
          window2.requestAnimationFrame(renderFrame.bind(this));
        }
      }
    }
  }
  /**
   * stops rendering the content of the canvas (to save resources)
   *
   */
  stopRendering() {
    this.is_rendering = false;
  }
  /* LiteGraphCanvas input */
  // used to block future mouse events (because of im gui)
  blockClick() {
    this.block_click = true;
    this.last_mouseclick = 0;
  }
  /**
   * Gets the widget at the current cursor position
   * @param node Optional node to check for widgets under cursor
   * @returns The widget located at the current cursor position or null
   */
  getWidgetAtCursor(node2) {
    var _a2;
    node2 != null ? node2 : node2 = this.node_over;
    return (_a2 = node2 == null ? void 0 : node2.getWidgetOnPos(this.graph_mouse[0], this.graph_mouse[1], true)) != null ? _a2 : null;
  }
  /**
   * Clears highlight and mouse-over information from nodes that should not have it.
   *
   * Intended to be called when the pointer moves away from a node.
   * @param node The node that the mouse is now over
   * @param e MouseEvent that is triggering this
   */
  updateMouseOverNodes(node2, e2) {
    var _a2, _b;
    if (!this.graph) throw new NullGraphError();
    const nodes = this.graph._nodes;
    for (const otherNode of nodes) {
      if (otherNode.mouseOver && node2 != otherNode) {
        otherNode.mouseOver = null;
        this._highlight_input = void 0;
        this._highlight_pos = void 0;
        this.linkConnector.overWidget = void 0;
        otherNode.lostFocusAt = LiteGraph.getTime();
        (_b = (_a2 = this.node_over) == null ? void 0 : _a2.onMouseLeave) == null ? void 0 : _b.call(_a2, e2);
        this.node_over = void 0;
        this.dirty_canvas = true;
      }
    }
  }
  processMouseDown(e2) {
    var _a2, _b, _c;
    if (this.dragZoomEnabled && e2.ctrlKey && e2.shiftKey && !e2.altKey && e2.buttons) {
      __privateSet(this, _dragZoomStart, { pos: [e2.x, e2.y], scale: this.ds.scale });
      return;
    }
    const { graph, pointer } = this;
    this.adjustMouseEvent(e2);
    if (e2.isPrimary) pointer.down(e2);
    if (this.set_canvas_dirty_on_mouse_event) this.dirty_canvas = true;
    if (!graph) return;
    const ref_window = this.getCanvasWindow();
    _LGraphCanvas.active_canvas = this;
    const x2 = e2.clientX;
    const y = e2.clientY;
    this.ds.viewport = this.viewport;
    const is_inside = !this.viewport || isInRect(x2, y, this.viewport);
    if (!is_inside) return;
    const node2 = (_a2 = graph.getNodeOnPos(e2.canvasX, e2.canvasY, this.visible_nodes)) != null ? _a2 : void 0;
    this.mouse[0] = x2;
    this.mouse[1] = y;
    this.graph_mouse[0] = e2.canvasX;
    this.graph_mouse[1] = e2.canvasY;
    this.last_click_position = [this.mouse[0], this.mouse[1]];
    pointer.isDouble = pointer.isDown && e2.isPrimary;
    pointer.isDown = true;
    this.canvas.focus();
    LiteGraph.closeAllContextMenus(ref_window);
    if (((_b = this.onMouse) == null ? void 0 : _b.call(this, e2)) == true) return;
    if (e2.button === 0 && !pointer.isDouble) {
      __privateMethod(this, _LGraphCanvas_instances, processPrimaryButton_fn).call(this, e2, node2);
    } else if (e2.button === 1) {
      __privateMethod(this, _LGraphCanvas_instances, processMiddleButton_fn).call(this, e2, node2);
    } else if ((e2.button === 2 || pointer.isDouble) && this.allow_interaction && !this.read_only) {
      if (node2) this.processSelect(node2, e2, true);
      this.processContextMenu(node2, e2);
    }
    this.last_mouse = [x2, y];
    this.last_mouseclick = LiteGraph.getTime();
    this.last_mouse_dragging = true;
    graph.change();
    if (!ref_window.document.activeElement || ref_window.document.activeElement.nodeName.toLowerCase() != "input" && ref_window.document.activeElement.nodeName.toLowerCase() != "textarea") {
      e2.preventDefault();
    }
    e2.stopPropagation();
    (_c = this.onMouseDown) == null ? void 0 : _c.call(this, e2);
  }
  /**
   * Called when a mouse move event has to be processed
   */
  processMouseMove(e2) {
    var _a2, _b, _c, _d, _e, _f, _g;
    if (this.dragZoomEnabled && e2.ctrlKey && e2.shiftKey && __privateGet(this, _dragZoomStart)) {
      __privateMethod(this, _LGraphCanvas_instances, processDragZoom_fn).call(this, e2);
      return;
    }
    if (this.autoresize) this.resize();
    if (this.set_canvas_dirty_on_mouse_event) this.dirty_canvas = true;
    const { graph, resizingGroup, linkConnector } = this;
    if (!graph) return;
    _LGraphCanvas.active_canvas = this;
    this.adjustMouseEvent(e2);
    const mouse = [e2.clientX, e2.clientY];
    this.mouse[0] = mouse[0];
    this.mouse[1] = mouse[1];
    const delta2 = [
      mouse[0] - this.last_mouse[0],
      mouse[1] - this.last_mouse[1]
    ];
    this.last_mouse = mouse;
    this.graph_mouse[0] = e2.canvasX;
    this.graph_mouse[1] = e2.canvasY;
    if (e2.isPrimary) this.pointer.move(e2);
    if (this.block_click) {
      e2.preventDefault();
      return;
    }
    e2.dragging = this.last_mouse_dragging;
    if (this.node_widget) {
      const [node22, widget] = this.node_widget;
      if (widget == null ? void 0 : widget.mouse) {
        const x2 = e2.canvasX - node22.pos[0];
        const y = e2.canvasY - node22.pos[1];
        const result = widget.mouse(e2, [x2, y], node22);
        if (result != null) this.dirty_canvas = result;
      }
    }
    let underPointer = CanvasItem.Nothing;
    const node2 = graph.getNodeOnPos(
      e2.canvasX,
      e2.canvasY,
      this.visible_nodes
    );
    const dragRect = this.dragging_rectangle;
    if (dragRect) {
      dragRect[2] = e2.canvasX - dragRect[0];
      dragRect[3] = e2.canvasY - dragRect[1];
      this.dirty_canvas = true;
    } else if (resizingGroup) {
      underPointer |= CanvasItem.ResizeSe | CanvasItem.Group;
    } else if (this.dragging_canvas) {
      this.ds.offset[0] += delta2[0] / this.ds.scale;
      this.ds.offset[1] += delta2[1] / this.ds.scale;
      __privateMethod(this, _LGraphCanvas_instances, dirty_fn).call(this);
    } else if ((this.allow_interaction || (node2 == null ? void 0 : node2.flags.allow_interaction)) && !this.read_only) {
      if (linkConnector.isConnecting) this.dirty_canvas = true;
      this.updateMouseOverNodes(node2, e2);
      if (node2) {
        underPointer |= CanvasItem.Node;
        if (node2.redraw_on_mouse) this.dirty_canvas = true;
        const pos = [0, 0];
        const inputId = isOverNodeInput(node2, e2.canvasX, e2.canvasY, pos);
        const outputId = isOverNodeOutput(node2, e2.canvasX, e2.canvasY, pos);
        const overWidget = node2.getWidgetOnPos(e2.canvasX, e2.canvasY, true);
        if (!node2.mouseOver) {
          node2.mouseOver = {
            inputId: null,
            outputId: null,
            overWidget: null
          };
          this.node_over = node2;
          this.dirty_canvas = true;
          (_a2 = node2.onMouseEnter) == null ? void 0 : _a2.call(node2, e2);
        }
        (_b = node2.onMouseMove) == null ? void 0 : _b.call(node2, e2, [e2.canvasX - node2.pos[0], e2.canvasY - node2.pos[1]], this);
        if (node2.mouseOver.inputId !== inputId || node2.mouseOver.outputId !== outputId || node2.mouseOver.overWidget !== overWidget) {
          node2.mouseOver.inputId = inputId;
          node2.mouseOver.outputId = outputId;
          node2.mouseOver.overWidget = overWidget;
          linkConnector.overWidget = void 0;
          if (linkConnector.isConnecting) {
            const firstLink = linkConnector.renderLinks.at(0);
            let highlightPos;
            let highlightInput;
            if (!firstLink || !linkConnector.isNodeValidDrop(node2)) ;
            else if (linkConnector.state.connectingTo === "input") {
              if (inputId === -1 && outputId === -1) {
                if (this.getWidgetLinkType && overWidget) {
                  const widgetLinkType = this.getWidgetLinkType(overWidget, node2);
                  if (widgetLinkType && LiteGraph.isValidConnection((_c = linkConnector.renderLinks[0]) == null ? void 0 : _c.fromSlot.type, widgetLinkType) && ((_e = (_d = firstLink.node).isValidWidgetLink) == null ? void 0 : _e.call(_d, firstLink.fromSlotIndex, node2, overWidget)) !== false) {
                    const { pos: [nodeX, nodeY] } = node2;
                    highlightPos = [nodeX + 10, nodeY + 10 + overWidget.y];
                    linkConnector.overWidget = overWidget;
                    linkConnector.overWidgetType = widgetLinkType;
                  }
                }
                if (!linkConnector.overWidget) {
                  const result = node2.findInputByType(firstLink.fromSlot.type);
                  if (result) {
                    highlightInput = result.slot;
                    highlightPos = node2.getInputPos(result.index);
                  }
                }
              } else if (inputId != -1 && node2.inputs[inputId] && LiteGraph.isValidConnection(firstLink.fromSlot.type, node2.inputs[inputId].type)) {
                highlightPos = pos;
                highlightInput = node2.inputs[inputId];
              }
            } else if (linkConnector.state.connectingTo === "output") {
              if (inputId === -1 && outputId === -1) {
                const result = node2.findOutputByType(firstLink.fromSlot.type);
                if (result) {
                  highlightPos = node2.getOutputPos(result.index);
                }
              } else {
                if (outputId != -1 && node2.outputs[outputId] && LiteGraph.isValidConnection(firstLink.fromSlot.type, node2.outputs[outputId].type)) {
                  highlightPos = pos;
                }
              }
            }
            this._highlight_pos = highlightPos;
            this._highlight_input = highlightInput;
          }
          this.dirty_canvas = true;
        }
        if (node2.inResizeCorner(e2.canvasX, e2.canvasY)) {
          underPointer |= CanvasItem.ResizeSe;
        }
      } else {
        const reroute = graph.getRerouteOnPos(e2.canvasX, e2.canvasY);
        if (reroute) {
          underPointer |= CanvasItem.Reroute;
          linkConnector.overReroute = reroute;
          if (linkConnector.isConnecting && linkConnector.isRerouteValidDrop(reroute)) {
            this._highlight_pos = reroute.pos;
          }
        } else {
          this._highlight_pos && (this._highlight_pos = void 0);
          linkConnector.overReroute && (linkConnector.overReroute = void 0);
        }
        const segment = __privateMethod(this, _LGraphCanvas_instances, getLinkCentreOnPos_fn).call(this, e2);
        if (this.over_link_center !== segment) {
          underPointer |= CanvasItem.Link;
          this.over_link_center = segment;
          this.dirty_bgcanvas = true;
        }
        if (this.canvas) {
          const group = graph.getGroupOnPos(e2.canvasX, e2.canvasY);
          if (group && !e2.ctrlKey && !this.read_only && group.isInResize(e2.canvasX, e2.canvasY)) {
            underPointer |= CanvasItem.ResizeSe;
          }
        }
      }
      if (this.node_capturing_input && this.node_capturing_input != node2) {
        (_g = (_f = this.node_capturing_input).onMouseMove) == null ? void 0 : _g.call(
          _f,
          e2,
          [
            e2.canvasX - this.node_capturing_input.pos[0],
            e2.canvasY - this.node_capturing_input.pos[1]
          ],
          this
        );
      }
      if (this.isDragging) {
        const selected = this.selectedItems;
        const allItems = e2.ctrlKey ? selected : getAllNestedItems(selected);
        const deltaX = delta2[0] / this.ds.scale;
        const deltaY = delta2[1] / this.ds.scale;
        for (const item of allItems) {
          item.move(deltaX, deltaY, true);
        }
        __privateMethod(this, _LGraphCanvas_instances, dirty_fn).call(this);
      }
      if (this.resizing_node) underPointer |= CanvasItem.ResizeSe;
    }
    this.hoveringOver = underPointer;
    e2.preventDefault();
    return;
  }
  /**
   * Called when a mouse up event has to be processed
   */
  processMouseUp(e2) {
    var _a2, _b, _c, _d;
    if (e2.isPrimary === false) return;
    const { graph, pointer } = this;
    if (!graph) return;
    _LGraphCanvas.active_canvas = this;
    this.adjustMouseEvent(e2);
    const now = LiteGraph.getTime();
    e2.click_time = now - this.last_mouseclick;
    const isClick = pointer.up(e2);
    if (isClick === true) {
      pointer.isDown = false;
      pointer.isDouble = false;
      this.connecting_links = null;
      this.dragging_canvas = false;
      graph.change();
      e2.stopPropagation();
      e2.preventDefault();
      return;
    }
    this.last_mouse_dragging = false;
    this.last_click_position = null;
    this.block_click && (this.block_click = false);
    if (e2.button === 0) {
      this.selected_group = null;
      this.isDragging = false;
      const x2 = e2.canvasX;
      const y = e2.canvasY;
      if (!this.linkConnector.isConnecting) {
        this.dirty_canvas = true;
        (_b = (_a2 = this.node_over) == null ? void 0 : _a2.onMouseUp) == null ? void 0 : _b.call(_a2, e2, [x2 - this.node_over.pos[0], y - this.node_over.pos[1]], this);
        (_d = (_c = this.node_capturing_input) == null ? void 0 : _c.onMouseUp) == null ? void 0 : _d.call(_c, e2, [
          x2 - this.node_capturing_input.pos[0],
          y - this.node_capturing_input.pos[1]
        ]);
      }
    } else if (e2.button === 1) {
      this.dirty_canvas = true;
      this.dragging_canvas = false;
    } else if (e2.button === 2) {
      this.dirty_canvas = true;
    }
    pointer.isDown = false;
    pointer.isDouble = false;
    graph.change();
    e2.stopPropagation();
    e2.preventDefault();
    return;
  }
  /**
   * Called when the mouse moves off the canvas.  Clears all node hover states.
   * @param e
   */
  processMouseOut(e2) {
    this.adjustMouseEvent(e2);
    this.updateMouseOverNodes(null, e2);
  }
  processMouseCancel() {
    console.warn("Pointer cancel!");
    this.pointer.reset();
  }
  /**
   * Called when a mouse wheel event has to be processed
   */
  processMouseWheel(e2) {
    var _a2;
    if (!this.graph || !this.allow_dragcanvas) return;
    const delta2 = (_a2 = e2.wheelDeltaY) != null ? _a2 : e2.detail * -60;
    this.adjustMouseEvent(e2);
    const pos = [e2.clientX, e2.clientY];
    if (this.viewport && !isPointInRect(pos, this.viewport)) return;
    let { scale } = this.ds;
    if (delta2 > 0) scale *= this.zoom_speed;
    else if (delta2 < 0) scale *= 1 / this.zoom_speed;
    this.ds.changeScale(scale, [e2.clientX, e2.clientY]);
    this.graph.change();
    e2.preventDefault();
    return;
  }
  /**
   * process a key event
   */
  processKey(e2) {
    var _a2, _b, _c, _d, _e, _f, _g;
    __privateSet(this, _shiftDown, e2.shiftKey);
    if (!this.graph) return;
    let block_default = false;
    if (e2.target.localName == "input") return;
    if (e2.type == "keydown") {
      if (e2.key === " ") {
        this.read_only = true;
        if (this._previously_dragging_canvas === null) {
          this._previously_dragging_canvas = this.dragging_canvas;
        }
        this.dragging_canvas = this.pointer.isDown;
        block_default = true;
      } else if (e2.key === "Escape") {
        if (this.linkConnector.isConnecting) {
          this.linkConnector.reset();
          e2.preventDefault();
          return;
        }
        (_a2 = this.node_panel) == null ? void 0 : _a2.close();
        (_b = this.options_panel) == null ? void 0 : _b.close();
        block_default = true;
      } else if (e2.keyCode === 65 && e2.ctrlKey) {
        this.selectItems();
        block_default = true;
      } else if (e2.keyCode === 67 && (e2.metaKey || e2.ctrlKey) && !e2.shiftKey) {
        if (this.selected_nodes) {
          this.copyToClipboard();
          block_default = true;
        }
      } else if (e2.keyCode === 86 && (e2.metaKey || e2.ctrlKey)) {
        this.pasteFromClipboard({ connectInputs: e2.shiftKey });
      } else if (e2.key === "Delete" || e2.key === "Backspace") {
        if (e2.target.localName != "input" && e2.target.localName != "textarea") {
          this.deleteSelected();
          block_default = true;
        }
      }
      if (this.selected_nodes) {
        for (const i in this.selected_nodes) {
          (_d = (_c = this.selected_nodes[i]).onKeyDown) == null ? void 0 : _d.call(_c, e2);
        }
      }
    } else if (e2.type == "keyup") {
      if (e2.key === " ") {
        this.read_only = false;
        this.dragging_canvas = ((_e = this._previously_dragging_canvas) != null ? _e : false) && this.pointer.isDown;
        this._previously_dragging_canvas = null;
      }
      if (this.selected_nodes) {
        for (const i in this.selected_nodes) {
          (_g = (_f = this.selected_nodes[i]).onKeyUp) == null ? void 0 : _g.call(_f, e2);
        }
      }
    }
    this.graph.change();
    if (block_default) {
      e2.preventDefault();
      e2.stopImmediatePropagation();
      return false;
    }
  }
  /**
   * Copies canvas items to an internal, app-specific clipboard backed by local storage.
   * When called without parameters, it copies {@link selectedItems}.
   * @param items The items to copy.  If nullish, all selected items are copied.
   */
  copyToClipboard(items) {
    var _a2, _b, _c;
    const serialisable = {
      nodes: [],
      groups: [],
      reroutes: [],
      links: []
    };
    for (const item of items != null ? items : this.selectedItems) {
      if (item instanceof LGraphNode) {
        if (item.clonable === false) continue;
        const cloned = (_a2 = item.clone()) == null ? void 0 : _a2.serialize();
        if (!cloned) continue;
        cloned.id = item.id;
        serialisable.nodes.push(cloned);
        if (item.inputs) {
          for (const { link: linkId } of item.inputs) {
            if (linkId == null) continue;
            const link2 = (_c = (_b = this.graph) == null ? void 0 : _b._links.get(linkId)) == null ? void 0 : _c.asSerialisable();
            if (link2) serialisable.links.push(link2);
          }
        }
      } else if (item instanceof LGraphGroup) {
        serialisable.groups.push(item.serialize());
      } else if (item instanceof Reroute) {
        serialisable.reroutes.push(item.asSerialisable());
      }
    }
    localStorage.setItem(
      "litegrapheditor_clipboard",
      JSON.stringify(serialisable)
    );
  }
  emitEvent(detail) {
    this.canvas.dispatchEvent(
      new CustomEvent("litegraph:canvas", {
        bubbles: true,
        detail
      })
    );
  }
  /** @todo Refactor to where it belongs - e.g. Deleting / creating nodes is not actually canvas event. */
  emitBeforeChange() {
    this.emitEvent({
      subType: "before-change"
    });
  }
  /** @todo See {@link emitBeforeChange} */
  emitAfterChange() {
    this.emitEvent({
      subType: "after-change"
    });
  }
  /**
   * Pastes the items from the canvas "clipbaord" - a local storage variable.
   */
  _pasteFromClipboard(options22 = {}) {
    var _a2, _b, _c, _d, _e;
    const {
      connectInputs = false,
      position = this.graph_mouse
    } = options22;
    if (!LiteGraph.ctrl_shift_v_paste_connect_unselected_outputs && connectInputs) return;
    const data = localStorage.getItem("litegrapheditor_clipboard");
    if (!data) return;
    const { graph } = this;
    if (!graph) throw new NullGraphError();
    graph.beforeChange();
    const parsed = JSON.parse(data);
    (_a2 = parsed.nodes) != null ? _a2 : parsed.nodes = [];
    (_b = parsed.groups) != null ? _b : parsed.groups = [];
    (_c = parsed.reroutes) != null ? _c : parsed.reroutes = [];
    (_d = parsed.links) != null ? _d : parsed.links = [];
    let offsetX = Infinity;
    let offsetY = Infinity;
    for (const item of [...parsed.nodes, ...parsed.reroutes]) {
      if (item.pos == null) throw new TypeError("Invalid node encounterd on paste.  `pos` was null.");
      if (item.pos[0] < offsetX) offsetX = item.pos[0];
      if (item.pos[1] < offsetY) offsetY = item.pos[1];
    }
    if (parsed.groups) {
      for (const group of parsed.groups) {
        if (group.bounding[0] < offsetX) offsetX = group.bounding[0];
        if (group.bounding[1] < offsetY) offsetY = group.bounding[1];
      }
    }
    const results = {
      created: [],
      nodes: /* @__PURE__ */ new Map(),
      links: /* @__PURE__ */ new Map(),
      reroutes: /* @__PURE__ */ new Map()
    };
    const { created, nodes, links, reroutes } = results;
    for (const info of parsed.groups) {
      info.id = -1;
      const group = new LGraphGroup();
      group.configure(info);
      graph.add(group);
      created.push(group);
    }
    for (const info of parsed.nodes) {
      const node2 = info.type == null ? null : LiteGraph.createNode(info.type);
      if (!node2) {
        continue;
      }
      nodes.set(info.id, node2);
      info.id = -1;
      node2.configure(info);
      graph.add(node2);
      created.push(node2);
    }
    for (const info of parsed.reroutes) {
      const { id, ...rerouteInfo } = info;
      const reroute = graph.setReroute(rerouteInfo);
      created.push(reroute);
      reroutes.set(id, reroute);
    }
    for (const reroute of reroutes.values()) {
      if (reroute.parentId == null) continue;
      const mapped = reroutes.get(reroute.parentId);
      if (mapped) reroute.parentId = mapped.id;
    }
    for (const info of parsed.links) {
      let outNode = nodes.get(info.origin_id);
      let afterRerouteId;
      if (info.parentId != null) afterRerouteId = (_e = reroutes.get(info.parentId)) == null ? void 0 : _e.id;
      if (connectInputs && LiteGraph.ctrl_shift_v_paste_connect_unselected_outputs) {
        outNode != null ? outNode : outNode = graph.getNodeById(info.origin_id);
        afterRerouteId != null ? afterRerouteId : afterRerouteId = info.parentId;
      }
      const inNode = nodes.get(info.target_id);
      if (inNode) {
        const link2 = outNode == null ? void 0 : outNode.connect(
          info.origin_slot,
          inNode,
          info.target_slot,
          afterRerouteId
        );
        if (link2) links.set(info.id, link2);
      }
    }
    for (const reroute of reroutes.values()) {
      const ids = [...reroute.linkIds].map((x2) => {
        var _a3, _b2;
        return (_b2 = (_a3 = links.get(x2)) == null ? void 0 : _a3.id) != null ? _b2 : x2;
      });
      reroute.update(reroute.parentId, void 0, ids, reroute.floating);
      if (!reroute.validateLinks(graph.links, graph.floatingLinks)) {
        graph.removeReroute(reroute.id);
      }
    }
    for (const item of created) {
      item.pos[0] += position[0] - offsetX;
      item.pos[1] += position[1] - offsetY;
    }
    this.selectItems(created);
    graph.afterChange();
    return results;
  }
  pasteFromClipboard(options22 = {}) {
    this.emitBeforeChange();
    try {
      this._pasteFromClipboard(options22);
    } finally {
      this.emitAfterChange();
    }
  }
  processNodeDblClicked(n) {
    var _a2, _b;
    (_a2 = this.onShowNodePanel) == null ? void 0 : _a2.call(this, n);
    (_b = this.onNodeDblClicked) == null ? void 0 : _b.call(this, n);
    this.setDirty(true);
  }
  /**
   * Determines whether to select or deselect an item that has received a pointer event.  Will deselect other nodes if
   * @param item Canvas item to select/deselect
   * @param e The MouseEvent to handle
   * @param sticky Prevents deselecting individual nodes (as used by aux/right-click)
   * @remarks
   * Accessibility: anyone using {@link mutli_select} always deselects when clicking empty space.
   */
  processSelect(item, e2, sticky = false) {
    var _a2;
    const addModifier = e2 == null ? void 0 : e2.shiftKey;
    const subtractModifier = e2 != null && (e2.metaKey || e2.ctrlKey);
    const eitherModifier = addModifier || subtractModifier;
    const modifySelection = eitherModifier || this.multi_select;
    if (!item) {
      if (!eitherModifier || this.multi_select) this.deselectAll();
    } else if (!item.selected || !this.selectedItems.has(item)) {
      if (!modifySelection) this.deselectAll(item);
      this.select(item);
    } else if (modifySelection && !sticky) {
      this.deselect(item);
    } else if (!sticky) {
      this.deselectAll(item);
    } else {
      return;
    }
    (_a2 = this.onSelectionChange) == null ? void 0 : _a2.call(this, this.selected_nodes);
    this.setDirty(true);
  }
  /**
   * Selects a {@link Positionable} item.
   * @param item The canvas item to add to the selection.
   */
  select(item) {
    var _a2, _b;
    if (item.selected && this.selectedItems.has(item)) return;
    item.selected = true;
    this.selectedItems.add(item);
    if (!(item instanceof LGraphNode)) return;
    (_a2 = item.onSelected) == null ? void 0 : _a2.call(item);
    this.selected_nodes[item.id] = item;
    (_b = this.onNodeSelected) == null ? void 0 : _b.call(this, item);
    if (item.inputs) {
      for (const input of item.inputs) {
        if (input.link == null) continue;
        this.highlighted_links[input.link] = true;
      }
    }
    if (item.outputs) {
      for (const id of item.outputs.flatMap((x2) => x2.links)) {
        if (id == null) continue;
        this.highlighted_links[id] = true;
      }
    }
  }
  /**
   * Deselects a {@link Positionable} item.
   * @param item The canvas item to remove from the selection.
   */
  deselect(item) {
    var _a2, _b;
    if (!item.selected && !this.selectedItems.has(item)) return;
    item.selected = false;
    this.selectedItems.delete(item);
    if (!(item instanceof LGraphNode)) return;
    (_a2 = item.onDeselected) == null ? void 0 : _a2.call(item);
    delete this.selected_nodes[item.id];
    (_b = this.onNodeDeselected) == null ? void 0 : _b.call(this, item);
    if (item.inputs) {
      for (const input of item.inputs) {
        if (input.link == null) continue;
        delete this.highlighted_links[input.link];
      }
    }
    if (item.outputs) {
      for (const id of item.outputs.flatMap((x2) => x2.links)) {
        if (id == null) continue;
        delete this.highlighted_links[id];
      }
    }
  }
  /** @deprecated See {@link LGraphCanvas.processSelect} */
  processNodeSelected(item, e2) {
    this.processSelect(
      item,
      e2,
      e2 && (e2.shiftKey || e2.metaKey || e2.ctrlKey || this.multi_select)
    );
  }
  /** @deprecated See {@link LGraphCanvas.select} */
  selectNode(node2, add_to_current_selection) {
    if (node2 == null) {
      this.deselectAll();
    } else {
      this.selectNodes([node2], add_to_current_selection);
    }
  }
  get empty() {
    if (!this.graph) throw new NullGraphError();
    return this.graph.empty;
  }
  get positionableItems() {
    if (!this.graph) throw new NullGraphError();
    return this.graph.positionableItems();
  }
  /**
   * Selects several items.
   * @param items Items to select - if falsy, all items on the canvas will be selected
   * @param add_to_current_selection If set, the items will be added to the current selection instead of replacing it
   */
  selectItems(items, add_to_current_selection) {
    var _a2;
    const itemsToSelect = items != null ? items : this.positionableItems;
    if (!add_to_current_selection) this.deselectAll();
    for (const item of itemsToSelect) this.select(item);
    (_a2 = this.onSelectionChange) == null ? void 0 : _a2.call(this, this.selected_nodes);
    this.setDirty(true);
  }
  /**
   * selects several nodes (or adds them to the current selection)
   * @deprecated See {@link LGraphCanvas.selectItems}
   */
  selectNodes(nodes, add_to_current_selection) {
    this.selectItems(nodes, add_to_current_selection);
  }
  /** @deprecated See {@link LGraphCanvas.deselect} */
  deselectNode(node2) {
    this.deselect(node2);
  }
  /**
   * Deselects all items on the canvas.
   * @param keepSelected If set, this item will not be removed from the selection.
   */
  deselectAll(keepSelected) {
    var _a2, _b;
    if (!this.graph) return;
    const selected = this.selectedItems;
    if (!selected.size) return;
    let wasSelected;
    for (const sel of selected) {
      if (sel === keepSelected) {
        wasSelected = sel;
        continue;
      }
      (_a2 = sel.onDeselected) == null ? void 0 : _a2.call(sel);
      sel.selected = false;
    }
    selected.clear();
    if (wasSelected) selected.add(wasSelected);
    this.setDirty(true);
    const oldNode = (keepSelected == null ? void 0 : keepSelected.id) == null ? null : this.selected_nodes[keepSelected.id];
    this.selected_nodes = {};
    this.current_node = null;
    this.highlighted_links = {};
    if (keepSelected instanceof LGraphNode) {
      if (oldNode) this.selected_nodes[oldNode.id] = oldNode;
      if (keepSelected.inputs) {
        for (const input of keepSelected.inputs) {
          if (input.link == null) continue;
          this.highlighted_links[input.link] = true;
        }
      }
      if (keepSelected.outputs) {
        for (const id of keepSelected.outputs.flatMap((x2) => x2.links)) {
          if (id == null) continue;
          this.highlighted_links[id] = true;
        }
      }
    }
    (_b = this.onSelectionChange) == null ? void 0 : _b.call(this, this.selected_nodes);
  }
  /** @deprecated See {@link LGraphCanvas.deselectAll} */
  deselectAllNodes() {
    this.deselectAll();
  }
  /**
   * Deletes all selected items from the graph.
   * @todo Refactor deletion task to LGraph.  Selection is a canvas property, delete is a graph action.
   */
  deleteSelected() {
    var _a2, _b;
    const { graph } = this;
    if (!graph) throw new NullGraphError();
    this.emitBeforeChange();
    graph.beforeChange();
    for (const item of this.selectedItems) {
      if (item instanceof LGraphNode) {
        const node2 = item;
        if (node2.block_delete) continue;
        node2.connectInputToOutput();
        graph.remove(node2);
        (_a2 = this.onNodeDeselected) == null ? void 0 : _a2.call(this, node2);
      } else if (item instanceof LGraphGroup) {
        graph.remove(item);
      } else if (item instanceof Reroute) {
        graph.removeReroute(item.id);
      }
    }
    this.selected_nodes = {};
    this.selectedItems.clear();
    this.current_node = null;
    this.highlighted_links = {};
    (_b = this.onSelectionChange) == null ? void 0 : _b.call(this, this.selected_nodes);
    this.setDirty(true);
    graph.afterChange();
    this.emitAfterChange();
  }
  /**
   * deletes all nodes in the current selection from the graph
   * @deprecated See {@link LGraphCanvas.deleteSelected}
   */
  deleteSelectedNodes() {
    this.deleteSelected();
  }
  /**
   * centers the camera on a given node
   */
  centerOnNode(node2) {
    const dpi = (window == null ? void 0 : window.devicePixelRatio) || 1;
    this.ds.offset[0] = -node2.pos[0] - node2.size[0] * 0.5 + this.canvas.width * 0.5 / (this.ds.scale * dpi);
    this.ds.offset[1] = -node2.pos[1] - node2.size[1] * 0.5 + this.canvas.height * 0.5 / (this.ds.scale * dpi);
    this.setDirty(true, true);
  }
  /**
   * adds some useful properties to a mouse event, like the position in graph coordinates
   */
  adjustMouseEvent(e2) {
    let clientX_rel = e2.clientX;
    let clientY_rel = e2.clientY;
    if (this.canvas) {
      const b = this.canvas.getBoundingClientRect();
      clientX_rel -= b.left;
      clientY_rel -= b.top;
    }
    e2.safeOffsetX = clientX_rel;
    e2.safeOffsetY = clientY_rel;
    if (e2.deltaX === void 0)
      e2.deltaX = clientX_rel - this.last_mouse_position[0];
    if (e2.deltaY === void 0)
      e2.deltaY = clientY_rel - this.last_mouse_position[1];
    this.last_mouse_position[0] = clientX_rel;
    this.last_mouse_position[1] = clientY_rel;
    e2.canvasX = clientX_rel / this.ds.scale - this.ds.offset[0];
    e2.canvasY = clientY_rel / this.ds.scale - this.ds.offset[1];
  }
  /**
   * changes the zoom level of the graph (default is 1), you can pass also a place used to pivot the zoom
   */
  setZoom(value, zooming_center) {
    this.ds.changeScale(value, zooming_center);
    __privateMethod(this, _LGraphCanvas_instances, dirty_fn).call(this);
  }
  /**
   * converts a coordinate from graph coordinates to canvas2D coordinates
   */
  convertOffsetToCanvas(pos, out) {
    return this.ds.convertOffsetToCanvas(pos, out);
  }
  /**
   * converts a coordinate from Canvas2D coordinates to graph space
   */
  convertCanvasToOffset(pos, out) {
    return this.ds.convertCanvasToOffset(pos, out);
  }
  // converts event coordinates from canvas2D to graph coordinates
  convertEventToCanvasOffset(e2) {
    const rect = this.canvas.getBoundingClientRect();
    return this.convertCanvasToOffset([
      e2.clientX - rect.left,
      e2.clientY - rect.top
    ]);
  }
  /**
   * brings a node to front (above all other nodes)
   */
  bringToFront(node2) {
    const { graph } = this;
    if (!graph) throw new NullGraphError();
    const i = graph._nodes.indexOf(node2);
    if (i == -1) return;
    graph._nodes.splice(i, 1);
    graph._nodes.push(node2);
  }
  /**
   * sends a node to the back (below all other nodes)
   */
  sendToBack(node2) {
    const { graph } = this;
    if (!graph) throw new NullGraphError();
    const i = graph._nodes.indexOf(node2);
    if (i == -1) return;
    graph._nodes.splice(i, 1);
    graph._nodes.unshift(node2);
  }
  /**
   * Determines which nodes are visible and populates {@link out} with the results.
   * @param nodes The list of nodes to check - if falsy, all nodes in the graph will be checked
   * @param out Array to write visible nodes into - if falsy, a new array is created instead
   * @returns Array passed ({@link out}), or a new array containing all visible nodes
   */
  computeVisibleNodes(nodes, out) {
    const visible_nodes = out || [];
    visible_nodes.length = 0;
    if (!this.graph) throw new NullGraphError();
    const _nodes = nodes || this.graph._nodes;
    for (const node2 of _nodes) {
      node2.updateArea(this.ctx);
      if (!overlapBounding(this.visible_area, node2.renderArea)) continue;
      visible_nodes.push(node2);
    }
    return visible_nodes;
  }
  /**
   * Checks if a node is visible on the canvas.
   * @param node The node to check
   * @returns `true` if the node is visible, otherwise `false`
   */
  isNodeVisible(node2) {
    return __privateGet(this, _visible_node_ids).has(node2.id);
  }
  /**
   * renders the whole canvas content, by rendering in two separated canvas, one containing the background grid and the connections, and one containing the nodes)
   */
  draw(force_canvas, force_bgcanvas) {
    var _a2;
    if (!this.canvas || this.canvas.width == 0 || this.canvas.height == 0) return;
    const now = LiteGraph.getTime();
    this.render_time = (now - this.last_draw_time) * 1e-3;
    this.last_draw_time = now;
    if (this.graph) this.ds.computeVisibleArea(this.viewport);
    if (this.dirty_canvas || force_canvas) {
      this.computeVisibleNodes(void 0, this.visible_nodes);
      __privateSet(this, _visible_node_ids, new Set(this.visible_nodes.map((node2) => node2.id)));
    }
    if (this.dirty_bgcanvas || force_bgcanvas || this.always_render_background || ((_a2 = this.graph) == null ? void 0 : _a2._last_trigger_time) && now - this.graph._last_trigger_time < 1e3) {
      this.drawBackCanvas();
    }
    if (this.dirty_canvas || force_canvas) this.drawFrontCanvas();
    this.fps = this.render_time ? 1 / this.render_time : 0;
    this.frame++;
  }
  /**
   * draws the front canvas (the one containing all the nodes)
   */
  drawFrontCanvas() {
    var _a2, _b, _c, _d, _e;
    this.dirty_canvas = false;
    const { ctx, canvas: canvas2, linkConnector } = this;
    if (ctx.start2D && !this.viewport) {
      ctx.start2D();
      ctx.restore();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    const area = this.viewport || this.dirty_area;
    if (area) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(area[0], area[1], area[2], area[3]);
      ctx.clip();
    }
    __privateSet(this, _snapToGrid, __privateGet(this, _shiftDown) || LiteGraph.alwaysSnapToGrid ? (_a2 = this.graph) == null ? void 0 : _a2.getSnapToGridSize() : void 0);
    if (this.clear_background) {
      if (area) ctx.clearRect(area[0], area[1], area[2], area[3]);
      else ctx.clearRect(0, 0, canvas2.width, canvas2.height);
    }
    if (this.bgcanvas == this.canvas) {
      this.drawBackCanvas();
    } else {
      const scale = window.devicePixelRatio;
      ctx.drawImage(
        this.bgcanvas,
        0,
        0,
        this.bgcanvas.width / scale,
        this.bgcanvas.height / scale
      );
    }
    (_b = this.onRender) == null ? void 0 : _b.call(this, canvas2, ctx);
    if (this.show_info) {
      this.renderInfo(ctx, area ? area[0] : 0, area ? area[1] : 0);
    }
    if (this.graph) {
      ctx.save();
      this.ds.toCanvasContext(ctx);
      const { visible_nodes } = this;
      const drawSnapGuides = __privateGet(this, _snapToGrid) && this.isDragging;
      for (const node2 of visible_nodes) {
        ctx.save();
        if (drawSnapGuides && this.selectedItems.has(node2))
          this.drawSnapGuide(ctx, node2);
        ctx.translate(node2.pos[0], node2.pos[1]);
        this.drawNode(node2, ctx);
        ctx.restore();
      }
      if (this.render_execution_order) {
        this.drawExecutionOrder(ctx);
      }
      if (this.graph.config.links_ontop) {
        this.drawConnections(ctx);
      }
      if (linkConnector.isConnecting) {
        const { renderLinks } = linkConnector;
        const highlightPos = __privateMethod(this, _LGraphCanvas_instances, getHighlightPosition_fn).call(this);
        ctx.lineWidth = this.connections_width;
        for (const renderLink of renderLinks) {
          const { fromSlot, fromPos: pos, fromDirection, dragDirection } = renderLink;
          const connShape = fromSlot.shape;
          const connType = fromSlot.type;
          const colour = connType === LiteGraph.EVENT ? LiteGraph.EVENT_LINK_COLOR : LiteGraph.CONNECTING_LINK_COLOR;
          this.renderLink(
            ctx,
            pos,
            highlightPos,
            null,
            false,
            null,
            colour,
            fromDirection,
            dragDirection
          );
          ctx.beginPath();
          if (connType === LiteGraph.EVENT || connShape === RenderShape.BOX) {
            ctx.rect(pos[0] - 6 + 0.5, pos[1] - 5 + 0.5, 14, 10);
            ctx.fill();
            ctx.beginPath();
            ctx.rect(
              this.graph_mouse[0] - 6 + 0.5,
              this.graph_mouse[1] - 5 + 0.5,
              14,
              10
            );
          } else if (connShape === RenderShape.ARROW) {
            ctx.moveTo(pos[0] + 8, pos[1] + 0.5);
            ctx.lineTo(pos[0] - 4, pos[1] + 6 + 0.5);
            ctx.lineTo(pos[0] - 4, pos[1] - 6 + 0.5);
            ctx.closePath();
          } else {
            ctx.arc(pos[0], pos[1], 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.graph_mouse[0], this.graph_mouse[1], 4, 0, Math.PI * 2);
          }
          ctx.fill();
        }
        __privateMethod(this, _LGraphCanvas_instances, renderSnapHighlight_fn).call(this, ctx, highlightPos);
      }
      if (this.dragging_rectangle) {
        const { eDown, eMove } = this.pointer;
        ctx.strokeStyle = "#FFF";
        if (eDown && eMove) {
          const transform = ctx.getTransform();
          const ratio = Math.max(1, window.devicePixelRatio);
          ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
          const x2 = eDown.safeOffsetX;
          const y = eDown.safeOffsetY;
          ctx.strokeRect(x2, y, eMove.safeOffsetX - x2, eMove.safeOffsetY - y);
          ctx.setTransform(transform);
        } else {
          const [x2, y, w, h] = this.dragging_rectangle;
          ctx.strokeRect(x2, y, w, h);
        }
      }
      if (!this.isDragging && this.over_link_center && this.render_link_tooltip) {
        this.drawLinkTooltip(ctx, this.over_link_center);
      } else {
        (_c = this.onDrawLinkTooltip) == null ? void 0 : _c.call(this, ctx, null);
      }
      (_d = this.onDrawForeground) == null ? void 0 : _d.call(this, ctx, this.visible_area);
      ctx.restore();
    }
    (_e = this.onDrawOverlay) == null ? void 0 : _e.call(this, ctx);
    if (area) ctx.restore();
  }
  /**
   * draws some useful stats in the corner of the canvas
   */
  renderInfo(ctx, x2, y) {
    x2 = x2 || 10;
    y = y || this.canvas.offsetHeight - 80;
    ctx.save();
    ctx.translate(x2, y);
    ctx.font = "10px Arial";
    ctx.fillStyle = "#888";
    ctx.textAlign = "left";
    if (this.graph) {
      ctx.fillText(`T: ${this.graph.globaltime.toFixed(2)}s`, 5, 13 * 1);
      ctx.fillText(`I: ${this.graph.iteration}`, 5, 13 * 2);
      ctx.fillText(`N: ${this.graph._nodes.length} [${this.visible_nodes.length}]`, 5, 13 * 3);
      ctx.fillText(`V: ${this.graph._version}`, 5, 13 * 4);
      ctx.fillText(`FPS:${this.fps.toFixed(2)}`, 5, 13 * 5);
    } else {
      ctx.fillText("No graph selected", 5, 13 * 1);
    }
    ctx.restore();
  }
  /**
   * draws the back canvas (the one containing the background and the connections)
   */
  drawBackCanvas() {
    var _a2, _b;
    const canvas2 = this.bgcanvas;
    if (canvas2.width != this.canvas.width || canvas2.height != this.canvas.height) {
      canvas2.width = this.canvas.width;
      canvas2.height = this.canvas.height;
    }
    if (!this.bgctx) {
      this.bgctx = this.bgcanvas.getContext("2d");
    }
    const ctx = this.bgctx;
    if (!ctx) throw new TypeError("Background canvas context was null.");
    const viewport = this.viewport || [0, 0, ctx.canvas.width, ctx.canvas.height];
    if (this.clear_background) {
      ctx.clearRect(viewport[0], viewport[1], viewport[2], viewport[3]);
    }
    const bg_already_painted = this.onRenderBackground ? this.onRenderBackground(canvas2, ctx) : false;
    if (!this.viewport) {
      const scale = window.devicePixelRatio;
      ctx.restore();
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
    }
    if (this.graph) {
      ctx.save();
      this.ds.toCanvasContext(ctx);
      if (this.ds.scale < 1.5 && !bg_already_painted && this.clear_background_color) {
        ctx.fillStyle = this.clear_background_color;
        ctx.fillRect(
          this.visible_area[0],
          this.visible_area[1],
          this.visible_area[2],
          this.visible_area[3]
        );
      }
      if (this.background_image && this.ds.scale > 0.5 && !bg_already_painted) {
        if (this.zoom_modify_alpha) {
          ctx.globalAlpha = (1 - 0.5 / this.ds.scale) * this.editor_alpha;
        } else {
          ctx.globalAlpha = this.editor_alpha;
        }
        ctx.imageSmoothingEnabled = false;
        if (!this._bg_img || this._bg_img.name != this.background_image) {
          this._bg_img = new Image();
          this._bg_img.name = this.background_image;
          this._bg_img.src = this.background_image;
          const that = this;
          this._bg_img.addEventListener("load", function() {
            that.draw(true, true);
          });
        }
        let pattern = this._pattern;
        if (pattern == null && this._bg_img.width > 0) {
          pattern = (_a2 = ctx.createPattern(this._bg_img, "repeat")) != null ? _a2 : void 0;
          this._pattern_img = this._bg_img;
          this._pattern = pattern;
        }
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(
            this.visible_area[0],
            this.visible_area[1],
            this.visible_area[2],
            this.visible_area[3]
          );
          ctx.fillStyle = "transparent";
        }
        ctx.globalAlpha = 1;
        ctx.imageSmoothingEnabled = true;
      }
      if (this.graph._groups.length) {
        this.drawGroups(canvas2, ctx);
      }
      (_b = this.onDrawBackground) == null ? void 0 : _b.call(this, ctx, this.visible_area);
      if (this.render_canvas_border) {
        ctx.strokeStyle = "#235";
        ctx.strokeRect(0, 0, canvas2.width, canvas2.height);
      }
      if (this.render_connections_shadows) {
        ctx.shadowColor = "#000";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 6;
      } else {
        ctx.shadowColor = "rgba(0,0,0,0)";
      }
      this.drawConnections(ctx);
      ctx.shadowColor = "rgba(0,0,0,0)";
      ctx.restore();
    }
    this.dirty_bgcanvas = false;
    this.dirty_canvas = true;
  }
  /**
   * draws the given node inside the canvas
   */
  drawNode(node2, ctx) {
    var _a2, _b, _c;
    this.current_node = node2;
    const color = node2.renderingColor;
    const bgcolor = node2.renderingBgColor;
    const { low_quality, editor_alpha } = this;
    ctx.globalAlpha = editor_alpha;
    if (this.render_shadows && !low_quality) {
      ctx.shadowColor = LiteGraph.DEFAULT_SHADOW_COLOR;
      ctx.shadowOffsetX = 2 * this.ds.scale;
      ctx.shadowOffsetY = 2 * this.ds.scale;
      ctx.shadowBlur = 3 * this.ds.scale;
    } else {
      ctx.shadowColor = "transparent";
    }
    if (node2.flags.collapsed && ((_a2 = node2.onDrawCollapsed) == null ? void 0 : _a2.call(node2, ctx, this)) == true)
      return;
    const shape = node2._shape || RenderShape.BOX;
    const size = __privateGet(_LGraphCanvas, _temp_vec2);
    size.set(node2.renderingSize);
    if (node2.collapsed) {
      ctx.font = this.inner_text_font;
    }
    if (node2.clip_area) {
      ctx.save();
      ctx.beginPath();
      if (shape == RenderShape.BOX) {
        ctx.rect(0, 0, size[0], size[1]);
      } else if (shape == RenderShape.ROUND) {
        ctx.roundRect(0, 0, size[0], size[1], [10]);
      } else if (shape == RenderShape.CIRCLE) {
        ctx.arc(size[0] * 0.5, size[1] * 0.5, size[0] * 0.5, 0, Math.PI * 2);
      }
      ctx.clip();
    }
    this.drawNodeShape(
      node2,
      ctx,
      size,
      color,
      bgcolor,
      !!node2.selected
    );
    if (!low_quality) {
      node2.drawBadges(ctx);
    }
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = LiteGraph.NODE_BOX_OUTLINE_COLOR;
    (_b = node2.onDrawForeground) == null ? void 0 : _b.call(node2, ctx, this, this.canvas);
    ctx.font = this.inner_text_font;
    if (!node2.collapsed) {
      const slotsBounds = node2.layoutSlots();
      const widgetStartY = slotsBounds ? slotsBounds[1] + slotsBounds[3] : 0;
      node2.layoutWidgets({ widgetStartY });
      node2.layoutWidgetInputSlots();
      node2.drawSlots(ctx, {
        fromSlot: (_c = this.linkConnector.renderLinks[0]) == null ? void 0 : _c.fromSlot,
        colorContext: this,
        editorAlpha: this.editor_alpha,
        lowQuality: this.low_quality
      });
      ctx.textAlign = "left";
      ctx.globalAlpha = 1;
      this.drawNodeWidgets(node2, widgetStartY, ctx);
    } else if (this.render_collapsed_slots) {
      node2.drawCollapsedSlots(ctx);
    }
    if (node2.clip_area) {
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
  /**
   * Draws the link mouseover effect and tooltip.
   * @param ctx Canvas 2D context to draw on
   * @param link The link to render the mouseover effect for
   * @remarks
   * Called against {@link LGraphCanvas.over_link_center}.
   * @todo Split tooltip from hover, so it can be drawn / eased separately
   */
  drawLinkTooltip(ctx, link2) {
    var _a2;
    const pos = link2._pos;
    ctx.fillStyle = "black";
    ctx.beginPath();
    if (this.linkMarkerShape === LinkMarkerShape.Arrow) {
      const transform = ctx.getTransform();
      ctx.translate(pos[0], pos[1]);
      if (Number.isFinite(link2._centreAngle)) ctx.rotate(link2._centreAngle);
      ctx.moveTo(-2, -3);
      ctx.lineTo(4, 0);
      ctx.lineTo(-2, 3);
      ctx.setTransform(transform);
    } else if (this.linkMarkerShape == null || this.linkMarkerShape === LinkMarkerShape.Circle) {
      ctx.arc(pos[0], pos[1], 3, 0, Math.PI * 2);
    }
    ctx.fill();
    const { data } = link2;
    if (data == null) return;
    if (((_a2 = this.onDrawLinkTooltip) == null ? void 0 : _a2.call(this, ctx, link2, this)) == true) return;
    let text2 = null;
    if (typeof data === "number")
      text2 = data.toFixed(2);
    else if (typeof data === "string")
      text2 = `"${data}"`;
    else if (typeof data === "boolean")
      text2 = String(data);
    else if (data.toToolTip)
      text2 = data.toToolTip();
    else
      text2 = `[${data.constructor.name}]`;
    if (text2 == null) return;
    text2 = text2.substring(0, 30);
    ctx.font = "14px Courier New";
    const info = ctx.measureText(text2);
    const w = info.width + 20;
    const h = 24;
    ctx.shadowColor = "black";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 3;
    ctx.fillStyle = "#454";
    ctx.beginPath();
    ctx.roundRect(pos[0] - w * 0.5, pos[1] - 15 - h, w, h, [3]);
    ctx.moveTo(pos[0] - 10, pos[1] - 15);
    ctx.lineTo(pos[0] + 10, pos[1] - 15);
    ctx.lineTo(pos[0], pos[1] - 5);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.textAlign = "center";
    ctx.fillStyle = "#CEC";
    ctx.fillText(text2, pos[0], pos[1] - 15 - h * 0.3);
  }
  /**
   * Draws the shape of the given node on the canvas
   * @param node The node to draw
   * @param ctx 2D canvas rendering context used to draw
   * @param size Size of the background to draw, in graph units.  Differs from node size if collapsed, etc.
   * @param fgcolor Foreground colour - used for text
   * @param bgcolor Background colour of the node
   * @param _selected Whether to render the node as selected.  Likely to be removed in future, as current usage is simply the selected property of the node.
   */
  drawNodeShape(node2, ctx, size, fgcolor, bgcolor, _selected) {
    var _a2, _b;
    ctx.strokeStyle = fgcolor;
    ctx.fillStyle = bgcolor;
    const title_height = LiteGraph.NODE_TITLE_HEIGHT;
    const { low_quality } = this;
    const { collapsed } = node2.flags;
    const shape = node2.renderingShape;
    const { title_mode } = node2;
    const render_title = title_mode == TitleMode.TRANSPARENT_TITLE || title_mode == TitleMode.NO_TITLE ? false : true;
    const area = __privateGet(_LGraphCanvas, _tmp_area);
    area.set(node2.boundingRect);
    area[0] -= node2.pos[0];
    area[1] -= node2.pos[1];
    const old_alpha = ctx.globalAlpha;
    ctx.beginPath();
    if (shape == RenderShape.BOX || low_quality) {
      ctx.fillRect(area[0], area[1], area[2], area[3]);
    } else if (shape == RenderShape.ROUND || shape == RenderShape.CARD) {
      ctx.roundRect(
        area[0],
        area[1],
        area[2],
        area[3],
        shape == RenderShape.CARD ? [LiteGraph.ROUND_RADIUS, LiteGraph.ROUND_RADIUS, 0, 0] : [LiteGraph.ROUND_RADIUS]
      );
    } else if (shape == RenderShape.CIRCLE) {
      ctx.arc(size[0] * 0.5, size[1] * 0.5, size[0] * 0.5, 0, Math.PI * 2);
    }
    ctx.fill();
    if (!collapsed && render_title) {
      ctx.shadowColor = "transparent";
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, -1, area[2], 2);
    }
    ctx.shadowColor = "transparent";
    (_a2 = node2.onDrawBackground) == null ? void 0 : _a2.call(node2, ctx);
    if (render_title || title_mode == TitleMode.TRANSPARENT_TITLE) {
      node2.drawTitleBarBackground(ctx, {
        scale: this.ds.scale,
        low_quality
      });
      node2.drawTitleBox(ctx, {
        scale: this.ds.scale,
        low_quality,
        box_size: 10
      });
      ctx.globalAlpha = old_alpha;
      node2.drawTitleText(ctx, {
        scale: this.ds.scale,
        default_title_color: this.node_title_color,
        low_quality
      });
      (_b = node2.onDrawTitle) == null ? void 0 : _b.call(node2, ctx);
    }
    for (const getStyle of Object.values(node2.strokeStyles)) {
      const strokeStyle = getStyle.call(node2);
      if (strokeStyle) {
        strokeShape(ctx, area, {
          shape,
          title_height,
          title_mode,
          collapsed,
          ...strokeStyle
        });
      }
    }
    node2.drawProgressBar(ctx);
    if (node2.execute_triggered != null && node2.execute_triggered > 0) node2.execute_triggered--;
    if (node2.action_triggered != null && node2.action_triggered > 0) node2.action_triggered--;
  }
  /**
   * Draws a snap guide for a {@link Positionable} item.
   *
   * Initial design was a simple white rectangle representing the location the
   * item would land if dropped.
   * @param ctx The 2D canvas context to draw on
   * @param item The item to draw a snap guide for
   * @param shape The shape of the snap guide to draw
   * @todo Update to align snapping with boundingRect
   * @todo Shapes
   */
  drawSnapGuide(ctx, item, shape = RenderShape.ROUND) {
    const snapGuide = __privateGet(_LGraphCanvas, _temp);
    snapGuide.set(item.boundingRect);
    const { pos } = item;
    const offsetX = pos[0] - snapGuide[0];
    const offsetY = pos[1] - snapGuide[1];
    snapGuide[0] += offsetX;
    snapGuide[1] += offsetY;
    if (__privateGet(this, _snapToGrid)) snapPoint(snapGuide, __privateGet(this, _snapToGrid));
    snapGuide[0] -= offsetX;
    snapGuide[1] -= offsetY;
    const { globalAlpha } = ctx;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    const [x2, y, w, h] = snapGuide;
    if (shape === RenderShape.CIRCLE) {
      const midX = x2 + w * 0.5;
      const midY = y + h * 0.5;
      const radius = Math.min(w * 0.5, h * 0.5);
      ctx.arc(midX, midY, radius, 0, Math.PI * 2);
    } else {
      ctx.rect(x2, y, w, h);
    }
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "#FFFFFF66";
    ctx.fillStyle = "#FFFFFF22";
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = globalAlpha;
  }
  drawConnections(ctx) {
    this.renderedPaths.clear();
    if (this.links_render_mode === LinkRenderType.HIDDEN_LINK) return;
    const { graph } = this;
    if (!graph) throw new NullGraphError();
    const visibleReroutes = [];
    const now = LiteGraph.getTime();
    const { visible_area } = this;
    __privateGet(_LGraphCanvas, _margin_area)[0] = visible_area[0] - 20;
    __privateGet(_LGraphCanvas, _margin_area)[1] = visible_area[1] - 20;
    __privateGet(_LGraphCanvas, _margin_area)[2] = visible_area[2] + 40;
    __privateGet(_LGraphCanvas, _margin_area)[3] = visible_area[3] + 40;
    ctx.lineWidth = this.connections_width;
    ctx.fillStyle = "#AAA";
    ctx.strokeStyle = "#AAA";
    ctx.globalAlpha = this.editor_alpha;
    const nodes = graph._nodes;
    for (const node2 of nodes) {
      const { inputs } = node2;
      if (!(inputs == null ? void 0 : inputs.length)) continue;
      for (const [i, input] of inputs.entries()) {
        if (!input || input.link == null) continue;
        const link_id = input.link;
        const link2 = graph._links.get(link_id);
        if (!link2) continue;
        const endPos = node2.getInputPos(i);
        const start_node = graph.getNodeById(link2.origin_id);
        if (start_node == null) continue;
        const outputId = link2.origin_slot;
        const startPos = outputId === -1 ? [start_node.pos[0] + 10, start_node.pos[1] + 10] : start_node.getOutputPos(outputId);
        const output = start_node.outputs[outputId];
        if (!output) continue;
        __privateMethod(this, _LGraphCanvas_instances, renderAllLinkSegments_fn).call(this, ctx, link2, startPos, endPos, visibleReroutes, now, output.dir, input.dir);
      }
    }
    if (graph.floatingLinks.size > 0) {
      __privateMethod(this, _LGraphCanvas_instances, renderFloatingLinks_fn).call(this, ctx, graph, visibleReroutes, now);
    }
    visibleReroutes.sort((a, b) => a.linkIds.size - b.linkIds.size);
    for (const reroute of visibleReroutes) {
      if (__privateGet(this, _snapToGrid) && this.isDragging && this.selectedItems.has(reroute)) {
        this.drawSnapGuide(ctx, reroute, RenderShape.CIRCLE);
      }
      reroute.draw(ctx, this._pattern);
    }
    ctx.globalAlpha = 1;
  }
  /**
   * draws a link between two points
   * @param ctx Canvas 2D rendering context
   * @param a start pos
   * @param b end pos
   * @param link the link object with all the link info
   * @param skip_border ignore the shadow of the link
   * @param flow show flow animation (for events)
   * @param color the color for the link
   * @param start_dir the direction enum
   * @param end_dir the direction enum
   */
  renderLink(ctx, a, b, link2, skip_border, flow, color, start_dir, end_dir, {
    startControl,
    endControl,
    reroute,
    num_sublines = 1,
    disabled = false
  } = {}) {
    var _a2, _b;
    const linkColour = link2 != null && this.highlighted_links[link2.id] ? "#FFF" : color || (link2 == null ? void 0 : link2.color) || (link2 == null ? void 0 : link2.type) != null && _LGraphCanvas.link_type_colors[link2.type] || this.default_link_color;
    const startDir = start_dir || LinkDirection.RIGHT;
    const endDir = end_dir || LinkDirection.LEFT;
    const dist = this.links_render_mode == LinkRenderType.SPLINE_LINK && (!endControl || !startControl) ? distance(a, b) : 0;
    if (this.render_connections_border && !this.low_quality) {
      ctx.lineWidth = this.connections_width + 4;
    }
    ctx.lineJoin = "round";
    num_sublines || (num_sublines = 1);
    if (num_sublines > 1) ctx.lineWidth = 0.5;
    const path = new Path2D();
    const linkSegment = reroute != null ? reroute : link2;
    if (linkSegment) linkSegment.path = path;
    const innerA = __privateGet(_LGraphCanvas, _lTempA);
    const innerB = __privateGet(_LGraphCanvas, _lTempB);
    const pos = (_a2 = linkSegment == null ? void 0 : linkSegment._pos) != null ? _a2 : [0, 0];
    for (let i = 0; i < num_sublines; i++) {
      const offsety = (i - (num_sublines - 1) * 0.5) * 5;
      innerA[0] = a[0];
      innerA[1] = a[1];
      innerB[0] = b[0];
      innerB[1] = b[1];
      if (this.links_render_mode == LinkRenderType.SPLINE_LINK) {
        if (endControl) {
          innerB[0] = b[0] + endControl[0];
          innerB[1] = b[1] + endControl[1];
        } else {
          __privateMethod(this, _LGraphCanvas_instances, addSplineOffset_fn).call(this, innerB, endDir, dist);
        }
        if (startControl) {
          innerA[0] = a[0] + startControl[0];
          innerA[1] = a[1] + startControl[1];
        } else {
          __privateMethod(this, _LGraphCanvas_instances, addSplineOffset_fn).call(this, innerA, startDir, dist);
        }
        path.moveTo(a[0], a[1] + offsety);
        path.bezierCurveTo(
          innerA[0],
          innerA[1] + offsety,
          innerB[0],
          innerB[1] + offsety,
          b[0],
          b[1] + offsety
        );
        findPointOnCurve(pos, a, b, innerA, innerB, 0.5);
        if (linkSegment && this.linkMarkerShape === LinkMarkerShape.Arrow) {
          const justPastCentre = __privateGet(_LGraphCanvas, _lTempC);
          findPointOnCurve(justPastCentre, a, b, innerA, innerB, 0.51);
          linkSegment._centreAngle = Math.atan2(
            justPastCentre[1] - pos[1],
            justPastCentre[0] - pos[0]
          );
        }
      } else {
        const l = this.links_render_mode == LinkRenderType.LINEAR_LINK ? 15 : 10;
        switch (startDir) {
          case LinkDirection.LEFT:
            innerA[0] += -l;
            break;
          case LinkDirection.RIGHT:
            innerA[0] += l;
            break;
          case LinkDirection.UP:
            innerA[1] += -l;
            break;
          case LinkDirection.DOWN:
            innerA[1] += l;
            break;
        }
        switch (endDir) {
          case LinkDirection.LEFT:
            innerB[0] += -l;
            break;
          case LinkDirection.RIGHT:
            innerB[0] += l;
            break;
          case LinkDirection.UP:
            innerB[1] += -l;
            break;
          case LinkDirection.DOWN:
            innerB[1] += l;
            break;
        }
        if (this.links_render_mode == LinkRenderType.LINEAR_LINK) {
          path.moveTo(a[0], a[1] + offsety);
          path.lineTo(innerA[0], innerA[1] + offsety);
          path.lineTo(innerB[0], innerB[1] + offsety);
          path.lineTo(b[0], b[1] + offsety);
          pos[0] = (innerA[0] + innerB[0]) * 0.5;
          pos[1] = (innerA[1] + innerB[1]) * 0.5;
          if (linkSegment && this.linkMarkerShape === LinkMarkerShape.Arrow) {
            linkSegment._centreAngle = Math.atan2(
              innerB[1] - innerA[1],
              innerB[0] - innerA[0]
            );
          }
        } else if (this.links_render_mode == LinkRenderType.STRAIGHT_LINK) {
          const midX = (innerA[0] + innerB[0]) * 0.5;
          path.moveTo(a[0], a[1]);
          path.lineTo(innerA[0], innerA[1]);
          path.lineTo(midX, innerA[1]);
          path.lineTo(midX, innerB[1]);
          path.lineTo(innerB[0], innerB[1]);
          path.lineTo(b[0], b[1]);
          pos[0] = midX;
          pos[1] = (innerA[1] + innerB[1]) * 0.5;
          if (linkSegment && this.linkMarkerShape === LinkMarkerShape.Arrow) {
            const diff = innerB[1] - innerA[1];
            if (Math.abs(diff) < 4) linkSegment._centreAngle = 0;
            else if (diff > 0) linkSegment._centreAngle = Math.PI * 0.5;
            else linkSegment._centreAngle = -(Math.PI * 0.5);
          }
        } else {
          return;
        }
      }
    }
    if (this.render_connections_border && !this.low_quality && !skip_border) {
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.stroke(path);
    }
    ctx.lineWidth = this.connections_width;
    ctx.fillStyle = ctx.strokeStyle = linkColour;
    ctx.stroke(path);
    if (this.ds.scale >= 0.6 && this.highquality_render && linkSegment) {
      if (this.render_connection_arrows) {
        const posA = this.computeConnectionPoint(a, b, 0.25, startDir, endDir);
        const posB = this.computeConnectionPoint(a, b, 0.26, startDir, endDir);
        const posC = this.computeConnectionPoint(a, b, 0.75, startDir, endDir);
        const posD = this.computeConnectionPoint(a, b, 0.76, startDir, endDir);
        let angleA = 0;
        let angleB = 0;
        if (this.render_curved_connections) {
          angleA = -Math.atan2(posB[0] - posA[0], posB[1] - posA[1]);
          angleB = -Math.atan2(posD[0] - posC[0], posD[1] - posC[1]);
        } else {
          angleB = angleA = b[1] > a[1] ? 0 : Math.PI;
        }
        const transform = ctx.getTransform();
        ctx.translate(posA[0], posA[1]);
        ctx.rotate(angleA);
        ctx.beginPath();
        ctx.moveTo(-5, -3);
        ctx.lineTo(0, 7);
        ctx.lineTo(5, -3);
        ctx.fill();
        ctx.setTransform(transform);
        ctx.translate(posC[0], posC[1]);
        ctx.rotate(angleB);
        ctx.beginPath();
        ctx.moveTo(-5, -3);
        ctx.lineTo(0, 7);
        ctx.lineTo(5, -3);
        ctx.fill();
        ctx.setTransform(transform);
      }
      ctx.beginPath();
      if (this.linkMarkerShape === LinkMarkerShape.Arrow) {
        const transform = ctx.getTransform();
        ctx.translate(pos[0], pos[1]);
        if (linkSegment._centreAngle) ctx.rotate(linkSegment._centreAngle);
        ctx.moveTo(-3.2, -5);
        ctx.lineTo(7, 0);
        ctx.lineTo(-3.2, 5);
        ctx.setTransform(transform);
      } else if (this.linkMarkerShape == null || this.linkMarkerShape === LinkMarkerShape.Circle) {
        ctx.arc(pos[0], pos[1], 5, 0, Math.PI * 2);
      }
      if (disabled) {
        const { fillStyle, globalAlpha } = ctx;
        ctx.fillStyle = (_b = this._pattern) != null ? _b : "#797979";
        ctx.globalAlpha = 0.75;
        ctx.fill();
        ctx.globalAlpha = globalAlpha;
        ctx.fillStyle = fillStyle;
      }
      ctx.fill();
    }
    if (flow) {
      ctx.fillStyle = linkColour;
      for (let i = 0; i < 5; ++i) {
        const f = (LiteGraph.getTime() * 1e-3 + i * 0.2) % 1;
        const flowPos = this.computeConnectionPoint(a, b, f, startDir, endDir);
        ctx.beginPath();
        ctx.arc(flowPos[0], flowPos[1], 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
  /**
   * Finds a point along a spline represented by a to b, with spline endpoint directions dictacted by start_dir and end_dir.
   * @param a Start point
   * @param b End point
   * @param t Time: distance between points (e.g 0.25 is 25% along the line)
   * @param start_dir Spline start direction
   * @param end_dir Spline end direction
   * @returns The point at {@link t} distance along the spline a-b.
   */
  computeConnectionPoint(a, b, t, start_dir, end_dir) {
    start_dir || (start_dir = LinkDirection.RIGHT);
    end_dir || (end_dir = LinkDirection.LEFT);
    const dist = distance(a, b);
    const pa = [a[0], a[1]];
    const pb = [b[0], b[1]];
    __privateMethod(this, _LGraphCanvas_instances, addSplineOffset_fn).call(this, pa, start_dir, dist);
    __privateMethod(this, _LGraphCanvas_instances, addSplineOffset_fn).call(this, pb, end_dir, dist);
    const c1 = (1 - t) * (1 - t) * (1 - t);
    const c2 = 3 * ((1 - t) * (1 - t)) * t;
    const c3 = 3 * (1 - t) * (t * t);
    const c4 = t * t * t;
    const x2 = c1 * a[0] + c2 * pa[0] + c3 * pb[0] + c4 * b[0];
    const y = c1 * a[1] + c2 * pa[1] + c3 * pb[1] + c4 * b[1];
    return [x2, y];
  }
  drawExecutionOrder(ctx) {
    ctx.shadowColor = "transparent";
    ctx.globalAlpha = 0.25;
    ctx.textAlign = "center";
    ctx.strokeStyle = "white";
    ctx.globalAlpha = 0.75;
    const { visible_nodes } = this;
    for (const node2 of visible_nodes) {
      ctx.fillStyle = "black";
      ctx.fillRect(
        node2.pos[0] - LiteGraph.NODE_TITLE_HEIGHT,
        node2.pos[1] - LiteGraph.NODE_TITLE_HEIGHT,
        LiteGraph.NODE_TITLE_HEIGHT,
        LiteGraph.NODE_TITLE_HEIGHT
      );
      if (node2.order == 0) {
        ctx.strokeRect(
          node2.pos[0] - LiteGraph.NODE_TITLE_HEIGHT + 0.5,
          node2.pos[1] - LiteGraph.NODE_TITLE_HEIGHT + 0.5,
          LiteGraph.NODE_TITLE_HEIGHT,
          LiteGraph.NODE_TITLE_HEIGHT
        );
      }
      ctx.fillStyle = "#FFF";
      ctx.fillText(
        stringOrEmpty(node2.order),
        node2.pos[0] + LiteGraph.NODE_TITLE_HEIGHT * -0.5,
        node2.pos[1] - 6
      );
    }
    ctx.globalAlpha = 1;
  }
  /**
   * draws the widgets stored inside a node
   * @deprecated Use {@link LGraphNode.drawWidgets} instead.
   * @remarks Currently there are extensions hijacking this function, so we cannot remove it.
   */
  drawNodeWidgets(node2, posY, ctx) {
    const { linkConnector } = this;
    node2.drawWidgets(ctx, {
      colorContext: this,
      linkOverWidget: linkConnector.overWidget,
      linkOverWidgetType: linkConnector.overWidgetType,
      lowQuality: this.low_quality,
      editorAlpha: this.editor_alpha
    });
  }
  /**
   * draws every group area in the background
   */
  drawGroups(canvas2, ctx) {
    if (!this.graph) return;
    const groups = this.graph._groups;
    ctx.save();
    ctx.globalAlpha = 0.5 * this.editor_alpha;
    const drawSnapGuides = __privateGet(this, _snapToGrid) && this.isDragging;
    for (const group of groups) {
      if (!overlapBounding(this.visible_area, group._bounding)) {
        continue;
      }
      if (drawSnapGuides && this.selectedItems.has(group))
        this.drawSnapGuide(ctx, group);
      group.draw(this, ctx);
    }
    ctx.restore();
  }
  /**
   * resizes the canvas to a given size, if no size is passed, then it tries to fill the parentNode
   * @todo Remove or rewrite
   */
  resize(width2, height) {
    if (!width2 && !height) {
      const parent = this.canvas.parentElement;
      if (!parent) throw new TypeError("Attempted to resize canvas, but parent element was null.");
      width2 = parent.offsetWidth;
      height = parent.offsetHeight;
    }
    if (this.canvas.width == width2 && this.canvas.height == height) return;
    this.canvas.width = width2 != null ? width2 : 0;
    this.canvas.height = height != null ? height : 0;
    this.bgcanvas.width = this.canvas.width;
    this.bgcanvas.height = this.canvas.height;
    this.setDirty(true, true);
  }
  onNodeSelectionChange() {
  }
  /**
   * Determines the furthest nodes in each direction for the currently selected nodes
   */
  boundaryNodesForSelection() {
    return _LGraphCanvas.getBoundaryNodes(this.selected_nodes);
  }
  showLinkMenu(segment, e2) {
    var _a2, _b;
    const { graph } = this;
    if (!graph) throw new NullGraphError();
    const title = "data" in segment && segment.data != null ? segment.data.constructor.name : void 0;
    const { origin_id, origin_slot } = segment;
    if (origin_id == null || origin_slot == null) {
      new LiteGraph.ContextMenu(["Link has no origin"], {
        event: e2,
        title
      });
      return false;
    }
    const node_left = graph.getNodeById(origin_id);
    const fromType = (_b = (_a2 = node_left == null ? void 0 : node_left.outputs) == null ? void 0 : _a2[origin_slot]) == null ? void 0 : _b.type;
    const options22 = ["Add Node", "Add Reroute", null, "Delete", null];
    const menu = new LiteGraph.ContextMenu(options22, {
      event: e2,
      title,
      callback: inner_clicked.bind(this)
    });
    return false;
    function inner_clicked(v2, options222, e22) {
      if (!graph) throw new NullGraphError();
      switch (v2) {
        case "Add Node":
          _LGraphCanvas.onMenuAdd(null, null, e22, menu, (node2) => {
            var _a3, _b2;
            if (!((_a3 = node2 == null ? void 0 : node2.inputs) == null ? void 0 : _a3.length) || !((_b2 = node2 == null ? void 0 : node2.outputs) == null ? void 0 : _b2.length) || origin_slot == null) return;
            const options3 = { afterRerouteId: segment.parentId };
            if (node_left == null ? void 0 : node_left.connectByType(origin_slot, node2, fromType != null ? fromType : "*", options3)) {
              node2.pos[0] -= node2.size[0] * 0.5;
            }
          });
          break;
        case "Add Reroute": {
          try {
            this.emitBeforeChange();
            this.adjustMouseEvent(e22);
            graph.createReroute(segment._pos, segment);
            this.setDirty(false, true);
          } catch (error) {
            console.error(error);
          } finally {
            this.emitAfterChange();
          }
          break;
        }
        case "Delete":
          graph.removeLink(segment.id);
          break;
      }
    }
  }
  createDefaultNodeForSlot(optPass) {
    const opts = Object.assign({
      nodeFrom: null,
      slotFrom: null,
      nodeTo: null,
      slotTo: null,
      position: [0, 0],
      nodeType: void 0,
      posAdd: [0, 0],
      posSizeFix: [0, 0]
    }, optPass);
    const { afterRerouteId } = opts;
    const isFrom = opts.nodeFrom && opts.slotFrom !== null;
    const isTo = !isFrom && opts.nodeTo && opts.slotTo !== null;
    if (!isFrom && !isTo) {
      console.warn(`No data passed to createDefaultNodeForSlot`, opts.nodeFrom, opts.slotFrom, opts.nodeTo, opts.slotTo);
      return false;
    }
    if (!opts.nodeType) {
      console.warn("No type to createDefaultNodeForSlot");
      return false;
    }
    const nodeX = isFrom ? opts.nodeFrom : opts.nodeTo;
    if (!nodeX) throw new TypeError("nodeX was null when creating default node for slot.");
    let slotX = isFrom ? opts.slotFrom : opts.slotTo;
    let iSlotConn = false;
    switch (typeof slotX) {
      case "string":
        iSlotConn = isFrom ? nodeX.findOutputSlot(slotX, false) : nodeX.findInputSlot(slotX, false);
        slotX = isFrom ? nodeX.outputs[slotX] : nodeX.inputs[slotX];
        break;
      case "object":
        if (slotX === null) {
          console.warn("Cant get slot information", slotX);
          return false;
        }
        iSlotConn = isFrom ? nodeX.findOutputSlot(slotX.name) : nodeX.findInputSlot(slotX.name);
        break;
      case "number":
        iSlotConn = slotX;
        slotX = isFrom ? nodeX.outputs[slotX] : nodeX.inputs[slotX];
        break;
      case "undefined":
      default:
        console.warn("Cant get slot information", slotX);
        return false;
    }
    const fromSlotType = slotX.type == LiteGraph.EVENT ? "_event_" : slotX.type;
    const slotTypesDefault = isFrom ? LiteGraph.slot_types_default_out : LiteGraph.slot_types_default_in;
    if (slotTypesDefault == null ? void 0 : slotTypesDefault[fromSlotType]) {
      let nodeNewType = false;
      if (typeof slotTypesDefault[fromSlotType] == "object") {
        for (const typeX in slotTypesDefault[fromSlotType]) {
          if (opts.nodeType == slotTypesDefault[fromSlotType][typeX] || opts.nodeType == "AUTO") {
            nodeNewType = slotTypesDefault[fromSlotType][typeX];
            break;
          }
        }
      } else if (opts.nodeType == slotTypesDefault[fromSlotType] || opts.nodeType == "AUTO") {
        nodeNewType = slotTypesDefault[fromSlotType];
      }
      if (nodeNewType) {
        let nodeNewOpts = false;
        if (typeof nodeNewType == "object" && nodeNewType.node) {
          nodeNewOpts = nodeNewType;
          nodeNewType = nodeNewType.node;
        }
        const newNode = LiteGraph.createNode(nodeNewType);
        if (newNode) {
          if (nodeNewOpts) {
            if (nodeNewOpts.properties) {
              for (const i in nodeNewOpts.properties) {
                newNode.addProperty(i, nodeNewOpts.properties[i]);
              }
            }
            if (nodeNewOpts.inputs) {
              newNode.inputs = [];
              for (const i in nodeNewOpts.inputs) {
                newNode.addOutput(
                  nodeNewOpts.inputs[i][0],
                  nodeNewOpts.inputs[i][1]
                );
              }
            }
            if (nodeNewOpts.outputs) {
              newNode.outputs = [];
              for (const i in nodeNewOpts.outputs) {
                newNode.addOutput(
                  nodeNewOpts.outputs[i][0],
                  nodeNewOpts.outputs[i][1]
                );
              }
            }
            if (nodeNewOpts.title) {
              newNode.title = nodeNewOpts.title;
            }
            if (nodeNewOpts.json) {
              newNode.configure(nodeNewOpts.json);
            }
          }
          if (!this.graph) throw new NullGraphError();
          this.graph.add(newNode);
          newNode.pos = [
            opts.position[0] + opts.posAdd[0] + (opts.posSizeFix[0] ? opts.posSizeFix[0] * newNode.size[0] : 0),
            opts.position[1] + opts.posAdd[1] + (opts.posSizeFix[1] ? opts.posSizeFix[1] * newNode.size[1] : 0)
          ];
          if (isFrom) {
            if (!opts.nodeFrom) throw new TypeError("createDefaultNodeForSlot - nodeFrom was null");
            opts.nodeFrom.connectByType(iSlotConn, newNode, fromSlotType, { afterRerouteId });
          } else {
            if (!opts.nodeTo) throw new TypeError("createDefaultNodeForSlot - nodeTo was null");
            opts.nodeTo.connectByTypeOutput(iSlotConn, newNode, fromSlotType, { afterRerouteId });
          }
          return true;
        }
        console.log(`failed creating ${nodeNewType}`);
      }
    }
    return false;
  }
  showConnectionMenu(optPass) {
    const opts = Object.assign({
      nodeFrom: null,
      slotFrom: null,
      nodeTo: null,
      slotTo: null,
      e: void 0,
      allow_searchbox: this.allow_searchbox,
      showSearchBox: this.showSearchBox
    }, optPass || {});
    const that = this;
    const { graph } = this;
    const { afterRerouteId } = opts;
    const isFrom = opts.nodeFrom && opts.slotFrom;
    const isTo = !isFrom && opts.nodeTo && opts.slotTo;
    if (!isFrom && !isTo) {
      console.warn("No data passed to showConnectionMenu");
      return;
    }
    const nodeX = isFrom ? opts.nodeFrom : opts.nodeTo;
    if (!nodeX) throw new TypeError("nodeX was null when creating default node for slot.");
    let slotX = isFrom ? opts.slotFrom : opts.slotTo;
    let iSlotConn;
    switch (typeof slotX) {
      case "string":
        iSlotConn = isFrom ? nodeX.findOutputSlot(slotX, false) : nodeX.findInputSlot(slotX, false);
        slotX = isFrom ? nodeX.outputs[slotX] : nodeX.inputs[slotX];
        break;
      case "object":
        if (slotX === null) {
          console.warn("Cant get slot information", slotX);
          return;
        }
        iSlotConn = isFrom ? nodeX.findOutputSlot(slotX.name) : nodeX.findInputSlot(slotX.name);
        break;
      case "number":
        iSlotConn = slotX;
        slotX = isFrom ? nodeX.outputs[slotX] : nodeX.inputs[slotX];
        break;
      default:
        console.warn("Cant get slot information", slotX);
        return;
    }
    const options22 = ["Add Node", "Add Reroute", null];
    if (opts.allow_searchbox) {
      options22.push("Search", null);
    }
    const fromSlotType = slotX.type == LiteGraph.EVENT ? "_event_" : slotX.type;
    const slotTypesDefault = isFrom ? LiteGraph.slot_types_default_out : LiteGraph.slot_types_default_in;
    if (slotTypesDefault == null ? void 0 : slotTypesDefault[fromSlotType]) {
      if (typeof slotTypesDefault[fromSlotType] == "object") {
        for (const typeX in slotTypesDefault[fromSlotType]) {
          options22.push(slotTypesDefault[fromSlotType][typeX]);
        }
      } else {
        options22.push(slotTypesDefault[fromSlotType]);
      }
    }
    const menu = new LiteGraph.ContextMenu(options22, {
      event: opts.e,
      extra: slotX,
      title: (slotX && slotX.name != "" ? slotX.name + (fromSlotType ? " | " : "") : "") + (slotX && fromSlotType ? fromSlotType : ""),
      callback: inner_clicked
    });
    const dirty = () => __privateMethod(this, _LGraphCanvas_instances, dirty_fn).call(this);
    function inner_clicked(v2, options222, e2) {
      var _a2, _b, _c, _d;
      switch (v2) {
        case "Add Node":
          _LGraphCanvas.onMenuAdd(null, null, e2, menu, function(node2) {
            var _a3, _b2;
            if (!node2) return;
            if (isFrom) {
              (_a3 = opts.nodeFrom) == null ? void 0 : _a3.connectByType(iSlotConn, node2, fromSlotType, { afterRerouteId });
            } else {
              (_b2 = opts.nodeTo) == null ? void 0 : _b2.connectByTypeOutput(iSlotConn, node2, fromSlotType, { afterRerouteId });
            }
          });
          break;
        case "Add Reroute": {
          const node2 = isFrom ? opts.nodeFrom : opts.nodeTo;
          const slot = options222.extra;
          if (!graph) throw new NullGraphError();
          if (!node2) throw new TypeError("Cannot add reroute: node was null");
          if (!slot) throw new TypeError("Cannot add reroute: slot was null");
          if (!opts.e) throw new TypeError("Cannot add reroute: CanvasPointerEvent was null");
          const reroute = node2.connectFloatingReroute([opts.e.canvasX, opts.e.canvasY], slot, afterRerouteId);
          if (!reroute) throw new Error("Failed to create reroute");
          dirty();
          break;
        }
        case "Search":
          if (isFrom) {
            opts.showSearchBox(e2, { node_from: opts.nodeFrom, slot_from: slotX, type_filter_in: fromSlotType });
          } else {
            opts.showSearchBox(e2, { node_to: opts.nodeTo, slot_from: slotX, type_filter_out: fromSlotType });
          }
          break;
        default: {
          const customProps = {
            position: [(_b = (_a2 = opts.e) == null ? void 0 : _a2.canvasX) != null ? _b : 0, (_d = (_c = opts.e) == null ? void 0 : _c.canvasY) != null ? _d : 0],
            nodeType: v2,
            afterRerouteId
          };
          const options3 = Object.assign(opts, customProps);
          that.createDefaultNodeForSlot(options3);
          break;
        }
      }
    }
  }
  // refactor: there are different dialogs, some uses createDialog some dont
  prompt(title, value, callback, event, multiline) {
    var _a2;
    const that = this;
    title = title || "";
    const customProperties = {
      is_modified: false,
      className: "graphdialog rounded",
      innerHTML: multiline ? "<span class='name'></span> <textarea autofocus class='value'></textarea><button class='rounded'>OK</button>" : "<span class='name'></span> <input autofocus type='text' class='value'/><button class='rounded'>OK</button>",
      close() {
        that.prompt_box = null;
        if (dialog.parentNode) {
          dialog.remove();
        }
      }
    };
    const div = document.createElement("div");
    const dialog = Object.assign(div, customProperties);
    const graphcanvas = _LGraphCanvas.active_canvas;
    const { canvas: canvas2 } = graphcanvas;
    if (!canvas2.parentNode) throw new TypeError("canvas element parentNode was null when opening a prompt.");
    canvas2.parentNode.append(dialog);
    if (this.ds.scale > 1) dialog.style.transform = `scale(${this.ds.scale})`;
    let dialogCloseTimer;
    let prevent_timeout = 0;
    LiteGraph.pointerListenerAdd(dialog, "leave", function() {
      if (prevent_timeout) return;
      if (LiteGraph.dialog_close_on_mouse_leave) {
        if (!dialog.is_modified && LiteGraph.dialog_close_on_mouse_leave) {
          dialogCloseTimer = setTimeout(
            dialog.close,
            LiteGraph.dialog_close_on_mouse_leave_delay
          );
        }
      }
    });
    LiteGraph.pointerListenerAdd(dialog, "enter", function() {
      if (LiteGraph.dialog_close_on_mouse_leave && dialogCloseTimer)
        clearTimeout(dialogCloseTimer);
    });
    const selInDia = dialog.querySelectorAll("select");
    if (selInDia) {
      for (const selIn of selInDia) {
        selIn.addEventListener("click", function() {
          prevent_timeout++;
        });
        selIn.addEventListener("blur", function() {
          prevent_timeout = 0;
        });
        selIn.addEventListener("change", function() {
          prevent_timeout = -1;
        });
      }
    }
    (_a2 = this.prompt_box) == null ? void 0 : _a2.close();
    this.prompt_box = dialog;
    const name_element = dialog.querySelector(".name");
    if (!name_element) throw new TypeError("name_element was null");
    name_element.textContent = title;
    const value_element = dialog.querySelector(".value");
    if (!value_element) throw new TypeError("value_element was null");
    value_element.value = value;
    value_element.select();
    const input = value_element;
    input.addEventListener("keydown", function(e2) {
      dialog.is_modified = true;
      if (e2.key == "Escape") {
        dialog.close();
      } else if (e2.key == "Enter" && e2.target.localName != "textarea") {
        if (callback) {
          callback(this.value);
        }
        dialog.close();
      } else {
        return;
      }
      e2.preventDefault();
      e2.stopPropagation();
    });
    const button = dialog.querySelector("button");
    if (!button) throw new TypeError("button was null when opening prompt");
    button.addEventListener("click", function() {
      callback == null ? void 0 : callback(input.value);
      that.setDirty(true);
      dialog.close();
    });
    const rect = canvas2.getBoundingClientRect();
    let offsetx = -20;
    let offsety = -20;
    if (rect) {
      offsetx -= rect.left;
      offsety -= rect.top;
    }
    if (event) {
      dialog.style.left = `${event.clientX + offsetx}px`;
      dialog.style.top = `${event.clientY + offsety}px`;
    } else {
      dialog.style.left = `${canvas2.width * 0.5 + offsetx}px`;
      dialog.style.top = `${canvas2.height * 0.5 + offsety}px`;
    }
    setTimeout(function() {
      var _a3, _b;
      input.focus();
      const clickTime = Date.now();
      function handleOutsideClick(e2) {
        var _a4, _b2;
        if (e2.target === canvas2 && Date.now() - clickTime > 256) {
          dialog.close();
          (_a4 = canvas2.parentElement) == null ? void 0 : _a4.removeEventListener("click", handleOutsideClick);
          (_b2 = canvas2.parentElement) == null ? void 0 : _b2.removeEventListener("touchend", handleOutsideClick);
        }
      }
      (_a3 = canvas2.parentElement) == null ? void 0 : _a3.addEventListener("click", handleOutsideClick);
      (_b = canvas2.parentElement) == null ? void 0 : _b.addEventListener("touchend", handleOutsideClick);
    }, 10);
    return dialog;
  }
  showSearchBox(event, searchOptions) {
    var _a2;
    const options22 = {
      slot_from: null,
      node_from: null,
      node_to: null,
      // TODO check for registered_slot_[in/out]_types not empty
      // this will be checked for functionality enabled : filter on slot type, in and out
      do_type_filter: LiteGraph.search_filter_enabled,
      // these are default: pass to set initially set values
      // @ts-expect-error
      type_filter_in: false,
      type_filter_out: false,
      show_general_if_none_on_typefilter: true,
      show_general_after_typefiltered: true,
      hide_on_mouse_leave: LiteGraph.search_hide_on_mouse_leave,
      show_all_if_empty: true,
      show_all_on_open: LiteGraph.search_show_all_on_open
    };
    Object.assign(options22, searchOptions);
    const that = this;
    const graphcanvas = _LGraphCanvas.active_canvas;
    const { canvas: canvas2 } = graphcanvas;
    const root_document = canvas2.ownerDocument || document;
    const div = document.createElement("div");
    const dialog = Object.assign(div, {
      close() {
        that.search_box = void 0;
        this.blur();
        canvas2.focus();
        root_document.body.style.overflow = "";
        setTimeout(() => canvas2.focus(), 20);
        dialog.remove();
      }
    });
    dialog.className = "litegraph litesearchbox graphdialog rounded";
    dialog.innerHTML = "<span class='name'>Search</span> <input autofocus type='text' class='value rounded'/>";
    if (options22.do_type_filter) {
      dialog.innerHTML += "<select class='slot_in_type_filter'><option value=''></option></select>";
      dialog.innerHTML += "<select class='slot_out_type_filter'><option value=''></option></select>";
    }
    const helper = document.createElement("div");
    helper.className = "helper";
    dialog.append(helper);
    if (root_document.fullscreenElement) {
      root_document.fullscreenElement.append(dialog);
    } else {
      root_document.body.append(dialog);
      root_document.body.style.overflow = "hidden";
    }
    let selIn;
    let selOut;
    if (options22.do_type_filter) {
      selIn = dialog.querySelector(".slot_in_type_filter");
      selOut = dialog.querySelector(".slot_out_type_filter");
    }
    if (this.ds.scale > 1) {
      dialog.style.transform = `scale(${this.ds.scale})`;
    }
    if (options22.hide_on_mouse_leave) {
      let prevent_timeout = false;
      let timeout_close = null;
      LiteGraph.pointerListenerAdd(dialog, "enter", function() {
        if (timeout_close) {
          clearTimeout(timeout_close);
          timeout_close = null;
        }
      });
      dialog.addEventListener("pointerleave", function() {
        if (prevent_timeout) return;
        const hideDelay = options22.hide_on_mouse_leave;
        const delay = typeof hideDelay === "number" ? hideDelay : 500;
        timeout_close = setTimeout(dialog.close, delay);
      });
      if (options22.do_type_filter) {
        if (!selIn) throw new TypeError("selIn was null when showing search box");
        if (!selOut) throw new TypeError("selOut was null when showing search box");
        selIn.addEventListener("click", function() {
          prevent_timeout++;
        });
        selIn.addEventListener("blur", function() {
          prevent_timeout = 0;
        });
        selIn.addEventListener("change", function() {
          prevent_timeout = -1;
        });
        selOut.addEventListener("click", function() {
          prevent_timeout++;
        });
        selOut.addEventListener("blur", function() {
          prevent_timeout = 0;
        });
        selOut.addEventListener("change", function() {
          prevent_timeout = -1;
        });
      }
    }
    (_a2 = that.search_box) == null ? void 0 : _a2.close();
    that.search_box = dialog;
    let first = null;
    let timeout = null;
    let selected = null;
    const maybeInput = dialog.querySelector("input");
    if (!maybeInput) throw new TypeError("Could not create search input box.");
    const input = maybeInput;
    if (input) {
      input.addEventListener("blur", function() {
        this.focus();
      });
      input.addEventListener("keydown", function(e2) {
        if (e2.key == "ArrowUp") {
          changeSelection(false);
        } else if (e2.key == "ArrowDown") {
          changeSelection(true);
        } else if (e2.key == "Escape") {
          dialog.close();
        } else if (e2.key == "Enter") {
          if (selected instanceof HTMLElement) {
            select(unescape(String(selected.dataset.type)));
          } else if (first) {
            select(first);
          } else {
            dialog.close();
          }
        } else {
          if (timeout) {
            clearInterval(timeout);
          }
          timeout = setTimeout(refreshHelper, 10);
          return;
        }
        e2.preventDefault();
        e2.stopPropagation();
        e2.stopImmediatePropagation();
        return true;
      });
    }
    if (options22.do_type_filter) {
      if (selIn) {
        const aSlots = LiteGraph.slot_types_in;
        const nSlots = aSlots.length;
        if (options22.type_filter_in == LiteGraph.EVENT || options22.type_filter_in == LiteGraph.ACTION) {
          options22.type_filter_in = "_event_";
        }
        for (let iK = 0; iK < nSlots; iK++) {
          const opt = document.createElement("option");
          opt.value = aSlots[iK];
          opt.innerHTML = aSlots[iK];
          selIn.append(opt);
          if (
            // @ts-expect-error
            options22.type_filter_in !== false && String(options22.type_filter_in).toLowerCase() == String(aSlots[iK]).toLowerCase()
          ) {
            opt.selected = true;
          }
        }
        selIn.addEventListener("change", function() {
          refreshHelper();
        });
      }
      if (selOut) {
        const aSlots = LiteGraph.slot_types_out;
        if (options22.type_filter_out == LiteGraph.EVENT || options22.type_filter_out == LiteGraph.ACTION) {
          options22.type_filter_out = "_event_";
        }
        for (const aSlot of aSlots) {
          const opt = document.createElement("option");
          opt.value = aSlot;
          opt.innerHTML = aSlot;
          selOut.append(opt);
          if (options22.type_filter_out !== false && String(options22.type_filter_out).toLowerCase() == String(aSlot).toLowerCase()) {
            opt.selected = true;
          }
        }
        selOut.addEventListener("change", function() {
          refreshHelper();
        });
      }
    }
    const rect = canvas2.getBoundingClientRect();
    const left = (event ? event.clientX : rect.left + rect.width * 0.5) - 80;
    const top = (event ? event.clientY : rect.top + rect.height * 0.5) - 20;
    dialog.style.left = `${left}px`;
    dialog.style.top = `${top}px`;
    if (event.layerY > rect.height - 200) {
      helper.style.maxHeight = `${rect.height - event.layerY - 20}px`;
    }
    requestAnimationFrame(function() {
      input.focus();
    });
    if (options22.show_all_on_open) refreshHelper();
    function select(name) {
      if (name) {
        if (that.onSearchBoxSelection) {
          that.onSearchBoxSelection(name, event, graphcanvas);
        } else {
          if (!graphcanvas.graph) throw new NullGraphError();
          graphcanvas.graph.beforeChange();
          const node2 = LiteGraph.createNode(name);
          if (node2) {
            node2.pos = graphcanvas.convertEventToCanvasOffset(event);
            graphcanvas.graph.add(node2, false);
          }
          if (options22.node_from) {
            let iS = false;
            switch (typeof options22.slot_from) {
              case "string":
                iS = options22.node_from.findOutputSlot(options22.slot_from);
                break;
              case "object":
                if (options22.slot_from == null) throw new TypeError("options.slot_from was null when showing search box");
                iS = options22.slot_from.name ? options22.node_from.findOutputSlot(options22.slot_from.name) : -1;
                if (iS == -1 && options22.slot_from.slot_index !== void 0) iS = options22.slot_from.slot_index;
                break;
              case "number":
                iS = options22.slot_from;
                break;
              default:
                iS = 0;
            }
            if (options22.node_from.outputs[iS] !== void 0) {
              if (iS !== false && iS > -1) {
                if (node2 == null) throw new TypeError("options.slot_from was null when showing search box");
                options22.node_from.connectByType(iS, node2, options22.node_from.outputs[iS].type);
              }
            }
          }
          if (options22.node_to) {
            let iS = false;
            switch (typeof options22.slot_from) {
              case "string":
                iS = options22.node_to.findInputSlot(options22.slot_from);
                break;
              case "object":
                if (options22.slot_from == null) throw new TypeError("options.slot_from was null when showing search box");
                iS = options22.slot_from.name ? options22.node_to.findInputSlot(options22.slot_from.name) : -1;
                if (iS == -1 && options22.slot_from.slot_index !== void 0) iS = options22.slot_from.slot_index;
                break;
              case "number":
                iS = options22.slot_from;
                break;
              default:
                iS = 0;
            }
            if (options22.node_to.inputs[iS] !== void 0) {
              if (iS !== false && iS > -1) {
                if (node2 == null) throw new TypeError("options.slot_from was null when showing search box");
                options22.node_to.connectByTypeOutput(iS, node2, options22.node_to.inputs[iS].type);
              }
            }
          }
          graphcanvas.graph.afterChange();
        }
      }
      dialog.close();
    }
    function changeSelection(forward) {
      const prev = selected;
      if (!selected) {
        selected = forward ? helper.childNodes[0] : helper.childNodes[helper.childNodes.length];
      } else if (selected instanceof Element) {
        selected.classList.remove("selected");
        selected = forward ? selected.nextSibling : selected.previousSibling;
        selected || (selected = prev);
      }
      if (selected instanceof Element) {
        selected.classList.add("selected");
        selected.scrollIntoView({ block: "end", behavior: "smooth" });
      }
    }
    function refreshHelper() {
      timeout = null;
      let str = input.value;
      first = null;
      helper.innerHTML = "";
      if (!str && !options22.show_all_if_empty) return;
      if (that.onSearchBox) {
        const list2 = that.onSearchBox(helper, str, graphcanvas);
        if (list2) {
          for (const item of list2) {
            addResult(item);
          }
        }
      } else {
        let inner_test_filter = function(type, optsIn) {
          var _a3, _b;
          optsIn = optsIn || {};
          const optsDef = {
            skipFilter: false,
            inTypeOverride: false,
            outTypeOverride: false
          };
          const opts = Object.assign(optsDef, optsIn);
          const ctor = LiteGraph.registered_node_types[type];
          if (filter && ctor.filter != filter) return false;
          if ((!options22.show_all_if_empty || str) && !type.toLowerCase().includes(str) && (!ctor.title || !ctor.title.toLowerCase().includes(str))) {
            return false;
          }
          if (options22.do_type_filter && !opts.skipFilter) {
            const sType = type;
            let sV = opts.inTypeOverride !== false ? opts.inTypeOverride : sIn.value;
            if (sIn && sV && ((_a3 = LiteGraph.registered_slot_in_types[sV]) == null ? void 0 : _a3.nodes)) {
              const doesInc = LiteGraph.registered_slot_in_types[sV].nodes.includes(sType);
              if (doesInc === false) return false;
            }
            sV = sOut.value;
            if (opts.outTypeOverride !== false) sV = opts.outTypeOverride;
            if (sOut && sV && ((_b = LiteGraph.registered_slot_out_types[sV]) == null ? void 0 : _b.nodes)) {
              const doesInc = LiteGraph.registered_slot_out_types[sV].nodes.includes(sType);
              if (doesInc === false) return false;
            }
          }
          return true;
        };
        let c = 0;
        str = str.toLowerCase();
        if (!graphcanvas.graph) throw new NullGraphError();
        const filter = graphcanvas.filter || graphcanvas.graph.filter;
        let sIn = false;
        let sOut = false;
        if (options22.do_type_filter && that.search_box) {
          sIn = that.search_box.querySelector(".slot_in_type_filter");
          sOut = that.search_box.querySelector(".slot_out_type_filter");
        }
        const keys = Object.keys(LiteGraph.registered_node_types);
        const filtered = keys.filter((x2) => inner_test_filter(x2));
        for (const item of filtered) {
          addResult(item);
          if (_LGraphCanvas.search_limit !== -1 && c++ > _LGraphCanvas.search_limit)
            break;
        }
        if (options22.show_general_after_typefiltered && (sIn.value || sOut.value)) {
          filtered_extra = [];
          for (const i in LiteGraph.registered_node_types) {
            if (inner_test_filter(i, {
              inTypeOverride: sIn && sIn.value ? "*" : false,
              outTypeOverride: sOut && sOut.value ? "*" : false
            })) {
              filtered_extra.push(i);
            }
          }
          for (const extraItem of filtered_extra) {
            addResult(extraItem, "generic_type");
            if (_LGraphCanvas.search_limit !== -1 && c++ > _LGraphCanvas.search_limit)
              break;
          }
        }
        if ((sIn.value || sOut.value) && helper.childNodes.length == 0 && options22.show_general_if_none_on_typefilter) {
          filtered_extra = [];
          for (const i in LiteGraph.registered_node_types) {
            if (inner_test_filter(i, { skipFilter: true }))
              filtered_extra.push(i);
          }
          for (const extraItem of filtered_extra) {
            addResult(extraItem, "not_in_filter");
            if (_LGraphCanvas.search_limit !== -1 && c++ > _LGraphCanvas.search_limit)
              break;
          }
        }
      }
      function addResult(type, className) {
        const help = document.createElement("div");
        first || (first = type);
        const nodeType = LiteGraph.registered_node_types[type];
        if (nodeType == null ? void 0 : nodeType.title) {
          help.textContent = nodeType == null ? void 0 : nodeType.title;
          const typeEl = document.createElement("span");
          typeEl.className = "litegraph lite-search-item-type";
          typeEl.textContent = type;
          help.append(typeEl);
        } else {
          help.textContent = type;
        }
        help.dataset["type"] = escape(type);
        help.className = "litegraph lite-search-item";
        if (className) {
          help.className += ` ${className}`;
        }
        help.addEventListener("click", function() {
          select(unescape(String(this.dataset.type)));
        });
        helper.append(help);
      }
    }
    return dialog;
  }
  showEditPropertyValue(node2, property, options22) {
    if (!node2 || node2.properties[property] === void 0) return;
    options22 = options22 || {};
    const info = node2.getPropertyInfo(property);
    const { type } = info;
    let input_html = "";
    if (type == "string" || type == "number" || type == "array" || type == "object") {
      input_html = "<input autofocus type='text' class='value'/>";
    } else if ((type == "enum" || type == "combo") && info.values) {
      input_html = "<select autofocus type='text' class='value'>";
      for (const i in info.values) {
        const v2 = Array.isArray(info.values) ? info.values[i] : i;
        const selected = v2 == node2.properties[property] ? "selected" : "";
        input_html += `<option value='${v2}' ${selected}>${info.values[i]}</option>`;
      }
      input_html += "</select>";
    } else if (type == "boolean" || type == "toggle") {
      const checked = node2.properties[property] ? "checked" : "";
      input_html = `<input autofocus type='checkbox' class='value' ${checked}/>`;
    } else {
      console.warn(`unknown type: ${type}`);
      return;
    }
    const dialog = this.createDialog(
      `<span class='name'>${info.label || property}</span>${input_html}<button>OK</button>`,
      options22
    );
    let input;
    if ((type == "enum" || type == "combo") && info.values) {
      input = dialog.querySelector("select");
      input == null ? void 0 : input.addEventListener("change", function(e2) {
        var _a2;
        dialog.modified();
        setValue((_a2 = e2.target) == null ? void 0 : _a2.value);
      });
    } else if (type == "boolean" || type == "toggle") {
      input = dialog.querySelector("input");
      input == null ? void 0 : input.addEventListener("click", function() {
        dialog.modified();
        setValue(!!input.checked);
      });
    } else {
      input = dialog.querySelector("input");
      if (input) {
        input.addEventListener("blur", function() {
          this.focus();
        });
        let v2 = node2.properties[property] !== void 0 ? node2.properties[property] : "";
        if (type !== "string") {
          v2 = JSON.stringify(v2);
        }
        input.value = v2;
        input.addEventListener("keydown", function(e2) {
          if (e2.key == "Escape") {
            dialog.close();
          } else if (e2.key == "Enter") {
            inner();
          } else {
            dialog.modified();
            return;
          }
          e2.preventDefault();
          e2.stopPropagation();
        });
      }
    }
    input == null ? void 0 : input.focus();
    const button = dialog.querySelector("button");
    if (!button) throw new TypeError("Show edit property value button was null.");
    button.addEventListener("click", inner);
    function inner() {
      setValue(input == null ? void 0 : input.value);
    }
    const dirty = () => __privateMethod(this, _LGraphCanvas_instances, dirty_fn).call(this);
    function setValue(value) {
      var _a2, _b;
      if ((info == null ? void 0 : info.values) && typeof info.values === "object" && info.values[value] != void 0) {
        value = info.values[value];
      }
      if (typeof node2.properties[property] == "number") {
        value = Number(value);
      }
      if (type == "array" || type == "object") {
        value = JSON.parse(value);
      }
      node2.properties[property] = value;
      if (node2.graph) {
        node2.graph._version++;
      }
      (_a2 = node2.onPropertyChanged) == null ? void 0 : _a2.call(node2, property, value);
      (_b = options22.onclose) == null ? void 0 : _b.call(options22);
      dialog.close();
      dirty();
    }
    return dialog;
  }
  // TODO refactor, theer are different dialog, some uses createDialog, some dont
  createDialog(html3, options22) {
    const def_options = {
      checkForInput: false,
      closeOnLeave: true,
      closeOnLeave_checkModified: true
    };
    options22 = Object.assign(def_options, options22 || {});
    const customProperties = {
      className: "graphdialog",
      innerHTML: html3,
      is_modified: false,
      modified() {
        this.is_modified = true;
      },
      close() {
        this.remove();
      }
    };
    const div = document.createElement("div");
    const dialog = Object.assign(div, customProperties);
    const rect = this.canvas.getBoundingClientRect();
    let offsetx = -20;
    let offsety = -20;
    if (rect) {
      offsetx -= rect.left;
      offsety -= rect.top;
    }
    if (options22.position) {
      offsetx += options22.position[0];
      offsety += options22.position[1];
    } else if (options22.event) {
      offsetx += options22.event.clientX;
      offsety += options22.event.clientY;
    } else {
      offsetx += this.canvas.width * 0.5;
      offsety += this.canvas.height * 0.5;
    }
    dialog.style.left = `${offsetx}px`;
    dialog.style.top = `${offsety}px`;
    if (!this.canvas.parentNode) throw new TypeError("Canvas parent element was null.");
    this.canvas.parentNode.append(dialog);
    if (options22.checkForInput) {
      const aI = dialog.querySelectorAll("input");
      if (aI) {
        for (const iX of aI) {
          iX.addEventListener("keydown", function(e2) {
            dialog.modified();
            if (e2.key == "Escape") {
              dialog.close();
            } else if (e2.key != "Enter") {
              return;
            }
            e2.preventDefault();
            e2.stopPropagation();
          });
          iX.focus();
        }
      }
    }
    let dialogCloseTimer;
    let prevent_timeout = 0;
    dialog.addEventListener("mouseleave", function() {
      if (prevent_timeout) return;
      if (!dialog.is_modified && LiteGraph.dialog_close_on_mouse_leave) {
        dialogCloseTimer = setTimeout(
          dialog.close,
          LiteGraph.dialog_close_on_mouse_leave_delay
        );
      }
    });
    dialog.addEventListener("mouseenter", function() {
      if (options22.closeOnLeave || LiteGraph.dialog_close_on_mouse_leave) {
        if (dialogCloseTimer) clearTimeout(dialogCloseTimer);
      }
    });
    const selInDia = dialog.querySelectorAll("select");
    if (selInDia) {
      for (const selIn of selInDia) {
        selIn.addEventListener("click", function() {
          prevent_timeout++;
        });
        selIn.addEventListener("blur", function() {
          prevent_timeout = 0;
        });
        selIn.addEventListener("change", function() {
          prevent_timeout = -1;
        });
      }
    }
    return dialog;
  }
  createPanel(title, options22) {
    options22 = options22 || {};
    const ref_window = options22.window || window;
    const root = document.createElement("div");
    root.className = "litegraph dialog";
    root.innerHTML = "<div class='dialog-header'><span class='dialog-title'></span></div><div class='dialog-content'></div><div style='display:none;' class='dialog-alt-content'></div><div class='dialog-footer'></div>";
    root.header = root.querySelector(".dialog-header");
    if (options22.width)
      root.style.width = options22.width + (typeof options22.width === "number" ? "px" : "");
    if (options22.height)
      root.style.height = options22.height + (typeof options22.height === "number" ? "px" : "");
    if (options22.closable) {
      const close = document.createElement("span");
      close.innerHTML = "&#10005;";
      close.classList.add("close");
      close.addEventListener("click", function() {
        root.close();
      });
      root.header.append(close);
    }
    root.title_element = root.querySelector(".dialog-title");
    root.title_element.textContent = title;
    root.content = root.querySelector(".dialog-content");
    root.alt_content = root.querySelector(".dialog-alt-content");
    root.footer = root.querySelector(".dialog-footer");
    root.close = function() {
      if (typeof root.onClose == "function") root.onClose();
      root.remove();
      this.remove();
    };
    root.toggleAltContent = function(force) {
      let vTo;
      let vAlt;
      if (force !== void 0) {
        vTo = force ? "block" : "none";
        vAlt = force ? "none" : "block";
      } else {
        vTo = root.alt_content.style.display != "block" ? "block" : "none";
        vAlt = root.alt_content.style.display != "block" ? "none" : "block";
      }
      root.alt_content.style.display = vTo;
      root.content.style.display = vAlt;
    };
    root.toggleFooterVisibility = function(force) {
      let vTo;
      if (force !== void 0) {
        vTo = force ? "block" : "none";
      } else {
        vTo = root.footer.style.display != "block" ? "block" : "none";
      }
      root.footer.style.display = vTo;
    };
    root.clear = function() {
      this.content.innerHTML = "";
    };
    root.addHTML = function(code, classname, on_footer) {
      const elem = document.createElement("div");
      if (classname) elem.className = classname;
      elem.innerHTML = code;
      if (on_footer) root.footer.append(elem);
      else root.content.append(elem);
      return elem;
    };
    root.addButton = function(name, callback, options222) {
      const elem = document.createElement("button");
      elem.textContent = name;
      elem.options = options222;
      elem.classList.add("btn");
      elem.addEventListener("click", callback);
      root.footer.append(elem);
      return elem;
    };
    root.addSeparator = function() {
      const elem = document.createElement("div");
      elem.className = "separator";
      root.content.append(elem);
    };
    root.addWidget = function(type, name, value, options222, callback) {
      options222 = options222 || {};
      let str_value = String(value);
      type = type.toLowerCase();
      if (type == "number" && typeof value === "number") str_value = value.toFixed(3);
      const elem = document.createElement("div");
      elem.className = "property";
      elem.innerHTML = "<span class='property_name'></span><span class='property_value'></span>";
      const nameSpan = elem.querySelector(".property_name");
      if (!nameSpan) throw new TypeError("Property name element was null.");
      nameSpan.textContent = options222.label || name;
      const value_element = elem.querySelector(".property_value");
      if (!value_element) throw new TypeError("Property name element was null.");
      value_element.textContent = str_value;
      elem.dataset["property"] = name;
      elem.dataset["type"] = options222.type || type;
      elem.options = options222;
      elem.value = value;
      if (type == "code") {
        elem.addEventListener("click", function() {
          root.inner_showCodePad(this.dataset["property"]);
        });
      } else if (type == "boolean") {
        elem.classList.add("boolean");
        if (value) elem.classList.add("bool-on");
        elem.addEventListener("click", () => {
          const propname = elem.dataset["property"];
          elem.value = !elem.value;
          elem.classList.toggle("bool-on");
          if (!value_element) throw new TypeError("Property name element was null.");
          value_element.textContent = elem.value ? "true" : "false";
          innerChange(propname, elem.value);
        });
      } else if (type == "string" || type == "number") {
        if (!value_element) throw new TypeError("Property name element was null.");
        value_element.setAttribute("contenteditable", "true");
        value_element.addEventListener("keydown", function(e2) {
          if (e2.code == "Enter" && (type != "string" || !e2.shiftKey)) {
            e2.preventDefault();
            this.blur();
          }
        });
        value_element.addEventListener("blur", function() {
          var _a2, _b;
          let v2 = this.textContent;
          const propname = (_a2 = this.parentElement) == null ? void 0 : _a2.dataset["property"];
          const proptype = (_b = this.parentElement) == null ? void 0 : _b.dataset["type"];
          if (proptype == "number") v2 = Number(v2);
          innerChange(propname, v2);
        });
      } else if (type == "enum" || type == "combo") {
        const str_value2 = _LGraphCanvas.getPropertyPrintableValue(value, options222.values);
        if (!value_element) throw new TypeError("Property name element was null.");
        value_element.textContent = str_value2 != null ? str_value2 : "";
        value_element.addEventListener("click", function(event) {
          var _a2;
          const values = options222.values || [];
          const propname = (_a2 = this.parentElement) == null ? void 0 : _a2.dataset["property"];
          const inner_clicked = (v2) => {
            this.textContent = v2;
            innerChange(propname, v2);
            return false;
          };
          new LiteGraph.ContextMenu(
            values,
            {
              event,
              className: "dark",
              callback: inner_clicked
            },
            // @ts-expect-error
            ref_window
          );
        });
      }
      root.content.append(elem);
      function innerChange(name2, value2) {
        var _a2;
        (_a2 = options222.callback) == null ? void 0 : _a2.call(options222, name2, value2, options222);
        callback == null ? void 0 : callback(name2, value2, options222);
      }
      return elem;
    };
    if (typeof root.onOpen == "function") root.onOpen();
    return root;
  }
  closePanels() {
    var _a2, _b, _c, _d;
    (_b = (_a2 = document.querySelector("#node-panel")) == null ? void 0 : _a2.close) == null ? void 0 : _b.call(_a2);
    (_d = (_c = document.querySelector("#option-panel")) == null ? void 0 : _c.close) == null ? void 0 : _d.call(_c);
  }
  showShowNodePanel(node2) {
    this.SELECTED_NODE = node2;
    this.closePanels();
    const ref_window = this.getCanvasWindow();
    const panel = this.createPanel(node2.title || "", {
      closable: true,
      window: ref_window,
      onOpen: () => {
        this.NODEPANEL_IS_OPEN = true;
      },
      onClose: () => {
        this.NODEPANEL_IS_OPEN = false;
        this.node_panel = null;
      }
    });
    this.node_panel = panel;
    panel.id = "node-panel";
    panel.node = node2;
    panel.classList.add("settings");
    const inner_refresh = () => {
      var _a2, _b;
      panel.content.innerHTML = "";
      panel.addHTML(`<span class='node_type'>${node2.type}</span><span class='node_desc'>${node2.constructor.desc || ""}</span><span class='separator'></span>`);
      panel.addHTML("<h3>Properties</h3>");
      const fUpdate = (name, value) => {
        if (!this.graph) throw new NullGraphError();
        this.graph.beforeChange(node2);
        switch (name) {
          case "Title":
            if (typeof value !== "string") throw new TypeError("Attempting to set title to non-string value.");
            node2.title = value;
            break;
          case "Mode": {
            if (typeof value !== "string") throw new TypeError("Attempting to set mode to non-string value.");
            const kV = Object.values(LiteGraph.NODE_MODES).indexOf(value);
            if (kV !== -1 && LiteGraph.NODE_MODES[kV]) {
              node2.changeMode(kV);
            } else {
              console.warn(`unexpected mode: ${value}`);
            }
            break;
          }
          case "Color":
            if (typeof value !== "string") throw new TypeError("Attempting to set colour to non-string value.");
            if (_LGraphCanvas.node_colors[value]) {
              node2.color = _LGraphCanvas.node_colors[value].color;
              node2.bgcolor = _LGraphCanvas.node_colors[value].bgcolor;
            } else {
              console.warn(`unexpected color: ${value}`);
            }
            break;
          default:
            node2.setProperty(name, value);
            break;
        }
        this.graph.afterChange();
        this.dirty_canvas = true;
      };
      panel.addWidget("string", "Title", node2.title, {}, fUpdate);
      const mode = node2.mode == null ? void 0 : LiteGraph.NODE_MODES[node2.mode];
      panel.addWidget("combo", "Mode", mode, { values: LiteGraph.NODE_MODES }, fUpdate);
      const nodeCol = node2.color !== void 0 ? Object.keys(_LGraphCanvas.node_colors).filter(function(nK) {
        return _LGraphCanvas.node_colors[nK].color == node2.color;
      }) : "";
      panel.addWidget("combo", "Color", nodeCol, { values: Object.keys(_LGraphCanvas.node_colors) }, fUpdate);
      for (const pName in node2.properties) {
        const value = node2.properties[pName];
        const info = node2.getPropertyInfo(pName);
        if ((_a2 = node2.onAddPropertyToPanel) == null ? void 0 : _a2.call(node2, pName, panel)) continue;
        panel.addWidget(info.widget || info.type, pName, value, info, fUpdate);
      }
      panel.addSeparator();
      (_b = node2.onShowCustomPanelInfo) == null ? void 0 : _b.call(node2, panel);
      panel.footer.innerHTML = "";
      panel.addButton("Delete", function() {
        if (node2.block_delete) return;
        if (!node2.graph) throw new NullGraphError();
        node2.graph.remove(node2);
        panel.close();
      }).classList.add("delete");
    };
    panel.inner_showCodePad = function(propname) {
      panel.classList.remove("settings");
      panel.classList.add("centered");
      panel.alt_content.innerHTML = "<textarea class='code'></textarea>";
      const textarea = panel.alt_content.querySelector("textarea");
      const fDoneWith = function() {
        panel.toggleAltContent(false);
        panel.toggleFooterVisibility(true);
        textarea.remove();
        panel.classList.add("settings");
        panel.classList.remove("centered");
        inner_refresh();
      };
      textarea.value = String(node2.properties[propname]);
      textarea.addEventListener("keydown", function(e2) {
        if (e2.code == "Enter" && e2.ctrlKey) {
          node2.setProperty(propname, textarea.value);
          fDoneWith();
        }
      });
      panel.toggleAltContent(true);
      panel.toggleFooterVisibility(false);
      textarea.style.height = "calc(100% - 40px)";
      const assign = panel.addButton("Assign", function() {
        node2.setProperty(propname, textarea.value);
        fDoneWith();
      });
      panel.alt_content.append(assign);
      const button = panel.addButton("Close", fDoneWith);
      button.style.float = "right";
      panel.alt_content.append(button);
    };
    inner_refresh();
    if (!this.canvas.parentNode) throw new TypeError("showNodePanel - this.canvas.parentNode was null");
    this.canvas.parentNode.append(panel);
  }
  checkPanels() {
    if (!this.canvas) return;
    if (!this.canvas.parentNode) throw new TypeError("checkPanels - this.canvas.parentNode was null");
    const panels = this.canvas.parentNode.querySelectorAll(".litegraph.dialog");
    for (const panel of panels) {
      if (!panel.node) continue;
      if (!panel.node.graph || panel.graph != this.graph) panel.close();
    }
  }
  getCanvasMenuOptions() {
    var _a2;
    let options22;
    if (this.getMenuOptions) {
      options22 = this.getMenuOptions();
    } else {
      options22 = [
        {
          content: "Add Node",
          has_submenu: true,
          callback: _LGraphCanvas.onMenuAdd
        },
        { content: "Add Group", callback: _LGraphCanvas.onGroupAdd }
        // { content: "Arrange", callback: that.graph.arrange },
        // {content:"Collapse All", callback: LGraphCanvas.onMenuCollapseAll }
      ];
      if (Object.keys(this.selected_nodes).length > 1) {
        options22.push({
          content: "Align",
          has_submenu: true,
          callback: _LGraphCanvas.onGroupAlign
        });
      }
    }
    const extra = (_a2 = this.getExtraMenuOptions) == null ? void 0 : _a2.call(this, this, options22);
    return Array.isArray(extra) ? options22.concat(extra) : options22;
  }
  // called by processContextMenu to extract the menu list
  getNodeMenuOptions(node2) {
    var _a2, _b, _c, _d;
    let options22;
    if (node2.getMenuOptions) {
      options22 = node2.getMenuOptions(this);
    } else {
      options22 = [
        {
          content: "Inputs",
          has_submenu: true,
          disabled: true
        },
        {
          content: "Outputs",
          has_submenu: true,
          disabled: true,
          callback: _LGraphCanvas.showMenuNodeOptionalOutputs
        },
        null,
        {
          content: "Properties",
          has_submenu: true,
          callback: _LGraphCanvas.onShowMenuNodeProperties
        },
        {
          content: "Properties Panel",
          callback: function(item, options222, e2, menu, node22) {
            _LGraphCanvas.active_canvas.showShowNodePanel(node22);
          }
        },
        null,
        {
          content: "Title",
          callback: _LGraphCanvas.onShowPropertyEditor
        },
        {
          content: "Mode",
          has_submenu: true,
          callback: _LGraphCanvas.onMenuNodeMode
        }
      ];
      if (node2.resizable !== false) {
        options22.push({
          content: "Resize",
          callback: _LGraphCanvas.onMenuResizeNode
        });
      }
      if (node2.collapsible) {
        options22.push({
          content: node2.collapsed ? "Expand" : "Collapse",
          callback: _LGraphCanvas.onMenuNodeCollapse
        });
      }
      if ((_a2 = node2.widgets) == null ? void 0 : _a2.some((w) => w.advanced)) {
        options22.push({
          content: node2.showAdvanced ? "Hide Advanced" : "Show Advanced",
          callback: _LGraphCanvas.onMenuToggleAdvanced
        });
      }
      options22.push(
        {
          content: node2.pinned ? "Unpin" : "Pin",
          callback: () => {
            for (const i in this.selected_nodes) {
              const node22 = this.selected_nodes[i];
              node22.pin();
            }
            this.setDirty(true, true);
          }
        },
        {
          content: "Colors",
          has_submenu: true,
          callback: _LGraphCanvas.onMenuNodeColors
        },
        {
          content: "Shapes",
          has_submenu: true,
          callback: _LGraphCanvas.onMenuNodeShapes
        },
        null
      );
    }
    const extra = (_b = node2.getExtraMenuOptions) == null ? void 0 : _b.call(node2, this, options22);
    if (Array.isArray(extra) && extra.length > 0) {
      extra.push(null);
      options22 = extra.concat(options22);
    }
    if (node2.clonable !== false) {
      options22.push({
        content: "Clone",
        callback: _LGraphCanvas.onMenuNodeClone
      });
    }
    if (Object.keys(this.selected_nodes).length > 1) {
      options22.push({
        content: "Align Selected To",
        has_submenu: true,
        callback: _LGraphCanvas.onNodeAlign
      }, {
        content: "Distribute Nodes",
        has_submenu: true,
        callback: _LGraphCanvas.createDistributeMenu
      });
    }
    options22.push(null, {
      content: "Remove",
      disabled: !(node2.removable !== false && !node2.block_delete),
      callback: _LGraphCanvas.onMenuNodeRemove
    });
    (_d = (_c = node2.graph) == null ? void 0 : _c.onGetNodeMenuOptions) == null ? void 0 : _d.call(_c, options22, node2);
    return options22;
  }
  /** @deprecated */
  getGroupMenuOptions(group) {
    console.warn("LGraphCanvas.getGroupMenuOptions is deprecated, use LGraphGroup.getMenuOptions instead");
    return group.getMenuOptions();
  }
  processContextMenu(node2, event) {
    var _a2, _b, _c;
    const canvas2 = _LGraphCanvas.active_canvas;
    const ref_window = canvas2.getCanvasWindow();
    let menu_info;
    const options22 = {
      event,
      callback: inner_option_clicked,
      extra: node2
    };
    if (node2) {
      options22.title = (_a2 = node2.type) != null ? _a2 : void 0;
      _LGraphCanvas.active_node = node2;
      const slot = node2.getSlotInPosition(event.canvasX, event.canvasY);
      if (slot) {
        menu_info = [];
        if (node2.getSlotMenuOptions) {
          menu_info = node2.getSlotMenuOptions(slot);
        } else {
          if ((_c = (_b = slot == null ? void 0 : slot.output) == null ? void 0 : _b.links) == null ? void 0 : _c.length)
            menu_info.push({ content: "Disconnect Links", slot });
          const _slot = slot.input || slot.output;
          if (!_slot) throw new TypeError("Both in put and output slots were null when processing context menu.");
          if (_slot.removable) {
            menu_info.push(
              _slot.locked ? "Cannot remove" : { content: "Remove Slot", slot }
            );
          }
          if (!_slot.nameLocked)
            menu_info.push({ content: "Rename Slot", slot });
          if (node2.getExtraSlotMenuOptions) {
            menu_info.push(...node2.getExtraSlotMenuOptions(slot));
          }
        }
        options22.title = (slot.input ? slot.input.type : slot.output.type) || "*";
        if (slot.input && slot.input.type == LiteGraph.ACTION)
          options22.title = "Action";
        if (slot.output && slot.output.type == LiteGraph.EVENT)
          options22.title = "Event";
      } else {
        menu_info = this.getNodeMenuOptions(node2);
      }
    } else {
      menu_info = this.getCanvasMenuOptions();
      if (!this.graph) throw new NullGraphError();
      if (this.links_render_mode !== LinkRenderType.HIDDEN_LINK) {
        const reroute = this.graph.getRerouteOnPos(event.canvasX, event.canvasY);
        if (reroute) {
          menu_info.unshift({
            content: "Delete Reroute",
            callback: () => {
              if (!this.graph) throw new NullGraphError();
              this.graph.removeReroute(reroute.id);
            }
          }, null);
        }
      }
      const group = this.graph.getGroupOnPos(
        event.canvasX,
        event.canvasY
      );
      if (group) {
        menu_info.push(null, {
          content: "Edit Group",
          has_submenu: true,
          submenu: {
            title: "Group",
            extra: group,
            options: group.getMenuOptions()
          }
        });
      }
    }
    if (!menu_info) return;
    new LiteGraph.ContextMenu(menu_info, options22, ref_window);
    const createDialog = (options222) => this.createDialog(
      "<span class='name'>Name</span><input autofocus type='text'/><button>OK</button>",
      options222
    );
    const setDirty = () => this.setDirty(true);
    function inner_option_clicked(v2, options222) {
      var _a3;
      if (!v2) return;
      if (v2.content == "Remove Slot") {
        if (!(node2 == null ? void 0 : node2.graph)) throw new NullGraphError();
        const info = v2.slot;
        if (!info) throw new TypeError("Found-slot info was null when processing context menu.");
        node2.graph.beforeChange();
        if (info.input) {
          node2.removeInput(info.slot);
        } else if (info.output) {
          node2.removeOutput(info.slot);
        }
        node2.graph.afterChange();
        return;
      } else if (v2.content == "Disconnect Links") {
        if (!(node2 == null ? void 0 : node2.graph)) throw new NullGraphError();
        const info = v2.slot;
        if (!info) throw new TypeError("Found-slot info was null when processing context menu.");
        node2.graph.beforeChange();
        if (info.output) {
          node2.disconnectOutput(info.slot);
        } else if (info.input) {
          node2.disconnectInput(info.slot, true);
        }
        node2.graph.afterChange();
        return;
      } else if (v2.content == "Rename Slot") {
        if (!node2) throw new TypeError("`node` was null when processing the context menu.");
        const info = v2.slot;
        if (!info) throw new TypeError("Found-slot info was null when processing context menu.");
        const slot_info = info.input ? node2.getInputInfo(info.slot) : node2.getOutputInfo(info.slot);
        const dialog = createDialog(options222);
        const input = dialog.querySelector("input");
        if (input && slot_info) {
          input.value = slot_info.label || "";
        }
        const inner = function() {
          if (!node2.graph) throw new NullGraphError();
          node2.graph.beforeChange();
          if (input == null ? void 0 : input.value) {
            if (slot_info) {
              slot_info.label = input.value;
            }
            setDirty();
          }
          dialog.close();
          node2.graph.afterChange();
        };
        (_a3 = dialog.querySelector("button")) == null ? void 0 : _a3.addEventListener("click", inner);
        if (!input) throw new TypeError("Input element was null when processing context menu.");
        input.addEventListener("keydown", function(e2) {
          dialog.is_modified = true;
          if (e2.key == "Escape") {
            dialog.close();
          } else if (e2.key == "Enter") {
            inner();
          } else if (e2.target.localName != "textarea") {
            return;
          }
          e2.preventDefault();
          e2.stopPropagation();
        });
        input.focus();
      }
    }
  }
  /**
   * Starts an animation to fit the view around the specified selection of nodes.
   * @param bounds The bounds to animate the view to, defined by a rectangle.
   */
  animateToBounds(bounds, options22 = {}) {
    const setDirty = () => this.setDirty(true, true);
    this.ds.animateToBounds(bounds, setDirty, options22);
  }
  /**
   * Fits the view to the selected nodes with animation.
   * If nothing is selected, the view is fitted around all items in the graph.
   */
  fitViewToSelectionAnimated(options22 = {}) {
    const items = this.selectedItems.size ? Array.from(this.selectedItems) : this.positionableItems;
    const bounds = createBounds(items);
    if (!bounds) throw new TypeError("Attempted to fit to view but could not calculate bounds.");
    const setDirty = () => this.setDirty(true, true);
    this.ds.animateToBounds(bounds, setDirty, options22);
  }
};
_temp = new WeakMap();
_temp_vec2 = new WeakMap();
_tmp_area = new WeakMap();
_margin_area = new WeakMap();
_link_bounding = new WeakMap();
_lTempA = new WeakMap();
_lTempB = new WeakMap();
_lTempC = new WeakMap();
_LGraphCanvas_instances = new WeakSet();
updateCursorStyle_fn = function() {
  if (!this.state.shouldSetCursor) return;
  let cursor = "default";
  if (this.state.draggingCanvas) {
    cursor = "grabbing";
  } else if (this.state.readOnly) {
    cursor = "grab";
  } else if (this.state.hoveringOver & CanvasItem.ResizeSe) {
    cursor = "se-resize";
  } else if (this.state.hoveringOver & CanvasItem.Node) {
    cursor = "crosshair";
  }
  this.canvas.style.cursor = cursor;
};
_maximumFrameGap = new WeakMap();
_visible_node_ids = new WeakMap();
_snapToGrid = new WeakMap();
_shiftDown = new WeakMap();
_dragZoomStart = new WeakMap();
/**
 * Finds the canvas if required, throwing on failure.
 * @param canvas Canvas element, or its element ID
 * @returns The canvas element
 * @throws If {@link canvas} is an element ID that does not belong to a valid HTML canvas element
 */
validateCanvas_fn = function(canvas2) {
  if (typeof canvas2 === "string") {
    const el = document.getElementById(canvas2);
    if (!(el instanceof HTMLCanvasElement)) throw "Error validating LiteGraph canvas: Canvas element not found";
    return el;
  }
  return canvas2;
};
/** Marks the entire canvas as dirty. */
dirty_fn = function() {
  this.dirty_canvas = true;
  this.dirty_bgcanvas = true;
};
processPrimaryButton_fn = function(e2, node2) {
  var _a2;
  const { pointer, graph, linkConnector } = this;
  if (!graph) throw new NullGraphError();
  const x2 = e2.canvasX;
  const y = e2.canvasY;
  const ctrlOrMeta = e2.ctrlKey || e2.metaKey;
  if (ctrlOrMeta && !e2.altKey) {
    const dragRect = new Float32Array(4);
    dragRect[0] = x2;
    dragRect[1] = y;
    dragRect[2] = 1;
    dragRect[3] = 1;
    pointer.onClick = (eUp) => {
      var _a3;
      const clickedItem = (_a3 = node2 != null ? node2 : graph.getRerouteOnPos(eUp.canvasX, eUp.canvasY)) != null ? _a3 : graph.getGroupTitlebarOnPos(eUp.canvasX, eUp.canvasY);
      this.processSelect(clickedItem, eUp);
    };
    pointer.onDragStart = () => this.dragging_rectangle = dragRect;
    pointer.onDragEnd = (upEvent) => __privateMethod(this, _LGraphCanvas_instances, handleMultiSelect_fn).call(this, upEvent, dragRect);
    pointer.finally = () => this.dragging_rectangle = null;
    return;
  }
  if (this.read_only) {
    pointer.finally = () => this.dragging_canvas = false;
    this.dragging_canvas = true;
    return;
  }
  if (LiteGraph.alt_drag_do_clone_nodes && e2.altKey && !e2.ctrlKey && node2 && this.allow_interaction) {
    const node_data = (_a2 = node2.clone()) == null ? void 0 : _a2.serialize();
    if ((node_data == null ? void 0 : node_data.type) != null) {
      const cloned = LiteGraph.createNode(node_data.type);
      if (cloned) {
        cloned.configure(node_data);
        cloned.pos[0] += 5;
        cloned.pos[1] += 5;
        if (this.allow_dragnodes) {
          pointer.onDragStart = (pointer2) => {
            graph.add(cloned, false);
            __privateMethod(this, _LGraphCanvas_instances, startDraggingItems_fn).call(this, cloned, pointer2);
          };
          pointer.onDragEnd = (e22) => __privateMethod(this, _LGraphCanvas_instances, processDraggedItems_fn).call(this, e22);
        } else {
          graph.beforeChange();
          graph.add(cloned, false);
          graph.afterChange();
        }
        return;
      }
    }
  }
  if (node2 && (this.allow_interaction || node2.flags.allow_interaction)) {
    __privateMethod(this, _LGraphCanvas_instances, processNodeClick_fn).call(this, e2, ctrlOrMeta, node2);
  } else {
    if (this.links_render_mode !== LinkRenderType.HIDDEN_LINK) {
      const reroute = graph.getRerouteOnPos(x2, y);
      if (reroute) {
        if (e2.shiftKey) {
          linkConnector.dragFromReroute(graph, reroute);
          pointer.onDragEnd = (upEvent) => linkConnector.dropLinks(graph, upEvent);
          pointer.finally = () => linkConnector.reset(true);
          this.dirty_bgcanvas = true;
        }
        pointer.onClick = () => this.processSelect(reroute, e2);
        if (!pointer.onDragEnd) {
          pointer.onDragStart = (pointer2) => __privateMethod(this, _LGraphCanvas_instances, startDraggingItems_fn).call(this, reroute, pointer2, true);
          pointer.onDragEnd = (e22) => __privateMethod(this, _LGraphCanvas_instances, processDraggedItems_fn).call(this, e22);
        }
        return;
      }
    }
    const { lineWidth } = this.ctx;
    this.ctx.lineWidth = this.connections_width + 7;
    const dpi = (window == null ? void 0 : window.devicePixelRatio) || 1;
    for (const linkSegment of this.renderedPaths) {
      const centre = linkSegment._pos;
      if (!centre) continue;
      if ((e2.shiftKey || e2.altKey) && linkSegment.path && this.ctx.isPointInStroke(linkSegment.path, x2 * dpi, y * dpi)) {
        this.ctx.lineWidth = lineWidth;
        if (e2.shiftKey && !e2.altKey) {
          linkConnector.dragFromLinkSegment(graph, linkSegment);
          pointer.onDragEnd = (upEvent) => linkConnector.dropLinks(graph, upEvent);
          pointer.finally = () => linkConnector.reset(true);
          return;
        } else if (e2.altKey && !e2.shiftKey) {
          const newReroute = graph.createReroute([x2, y], linkSegment);
          pointer.onDragStart = (pointer2) => __privateMethod(this, _LGraphCanvas_instances, startDraggingItems_fn).call(this, newReroute, pointer2);
          pointer.onDragEnd = (e22) => __privateMethod(this, _LGraphCanvas_instances, processDraggedItems_fn).call(this, e22);
          return;
        }
      } else if (isInRectangle(x2, y, centre[0] - 4, centre[1] - 4, 8, 8)) {
        this.ctx.lineWidth = lineWidth;
        pointer.onClick = () => this.showLinkMenu(linkSegment, e2);
        pointer.onDragStart = () => this.dragging_canvas = true;
        pointer.finally = () => this.dragging_canvas = false;
        this.over_link_center = void 0;
        return;
      }
    }
    this.ctx.lineWidth = lineWidth;
    const group = graph.getGroupOnPos(x2, y);
    this.selected_group = group != null ? group : null;
    if (group) {
      if (group.isInResize(x2, y)) {
        const b = group.boundingRect;
        const offsetX = x2 - (b[0] + b[2]);
        const offsetY = y - (b[1] + b[3]);
        pointer.onDragStart = () => this.resizingGroup = group;
        pointer.onDrag = (eMove) => {
          if (this.read_only) return;
          const pos = [
            eMove.canvasX - group.pos[0] - offsetX,
            eMove.canvasY - group.pos[1] - offsetY
          ];
          if (__privateGet(this, _snapToGrid)) snapPoint(pos, __privateGet(this, _snapToGrid));
          const resized = group.resize(pos[0], pos[1]);
          if (resized) this.dirty_bgcanvas = true;
        };
        pointer.finally = () => this.resizingGroup = null;
      } else {
        const f = group.font_size || LiteGraph.DEFAULT_GROUP_FONT_SIZE;
        const headerHeight = f * 1.4;
        if (isInRectangle(
          x2,
          y,
          group.pos[0],
          group.pos[1],
          group.size[0],
          headerHeight
        )) {
          pointer.onClick = () => this.processSelect(group, e2);
          pointer.onDragStart = (pointer2) => {
            group.recomputeInsideNodes();
            __privateMethod(this, _LGraphCanvas_instances, startDraggingItems_fn).call(this, group, pointer2, true);
          };
          pointer.onDragEnd = (e22) => __privateMethod(this, _LGraphCanvas_instances, processDraggedItems_fn).call(this, e22);
        }
      }
      pointer.onDoubleClick = () => {
        this.emitEvent({
          subType: "group-double-click",
          originalEvent: e2,
          group
        });
      };
    } else {
      pointer.onDoubleClick = () => {
        if (this.allow_searchbox) {
          this.showSearchBox(e2);
          e2.preventDefault();
        }
        this.emitEvent({
          subType: "empty-double-click",
          originalEvent: e2
        });
      };
    }
  }
  if (!pointer.onDragStart && !pointer.onClick && !pointer.onDrag && this.allow_dragcanvas) {
    pointer.onClick = () => this.processSelect(null, e2);
    pointer.finally = () => this.dragging_canvas = false;
    this.dragging_canvas = true;
  }
};
/**
 * Processes a pointerdown event inside the bounds of a node.  Part of {@link processMouseDown}.
 * @param e The pointerdown event
 * @param ctrlOrMeta Ctrl or meta key is pressed
 * @param node The node to process a click event for
 */
processNodeClick_fn = function(e2, ctrlOrMeta, node2) {
  var _a2, _b, _c, _d;
  const { pointer, graph, linkConnector } = this;
  if (!graph) throw new NullGraphError();
  const x2 = e2.canvasX;
  const y = e2.canvasY;
  pointer.onClick = () => this.processSelect(node2, e2);
  if (!node2.flags.pinned) {
    this.bringToFront(node2);
  }
  const inCollapse = node2.isPointInCollapse(x2, y);
  if (inCollapse) {
    pointer.onClick = () => {
      node2.collapse();
      this.setDirty(true, true);
    };
  } else if (!node2.flags.collapsed) {
    if (node2.resizable !== false && node2.inResizeCorner(x2, y)) {
      const b = node2.boundingRect;
      const offsetX = x2 - (b[0] + b[2]);
      const offsetY = y - (b[1] + b[3]);
      pointer.onDragStart = () => {
        graph.beforeChange();
        this.resizing_node = node2;
      };
      pointer.onDrag = (eMove) => {
        if (this.read_only) return;
        const pos2 = [
          eMove.canvasX - node2.pos[0] - offsetX,
          eMove.canvasY - node2.pos[1] - offsetY
        ];
        if (__privateGet(this, _snapToGrid)) snapPoint(pos2, __privateGet(this, _snapToGrid));
        const min = node2.computeSize();
        pos2[0] = Math.max(min[0], pos2[0]);
        pos2[1] = Math.max(min[1], pos2[1]);
        node2.setSize(pos2);
        __privateMethod(this, _LGraphCanvas_instances, dirty_fn).call(this);
      };
      pointer.onDragEnd = () => {
        __privateMethod(this, _LGraphCanvas_instances, dirty_fn).call(this);
        graph.afterChange(this.resizing_node);
      };
      pointer.finally = () => this.resizing_node = null;
      this.canvas.style.cursor = "se-resize";
      return;
    }
    const { inputs, outputs } = node2;
    if (outputs) {
      for (const [i, output] of outputs.entries()) {
        const link_pos = node2.getOutputPos(i);
        if (isInRectangle(x2, y, link_pos[0] - 15, link_pos[1] - 10, 30, 20)) {
          if (e2.shiftKey && (((_a2 = output.links) == null ? void 0 : _a2.length) || ((_b = output._floatingLinks) == null ? void 0 : _b.size))) {
            linkConnector.moveOutputLink(graph, output);
            pointer.onDragEnd = (upEvent) => linkConnector.dropLinks(graph, upEvent);
            pointer.finally = () => linkConnector.reset(true);
            return;
          }
          linkConnector.dragNewFromOutput(graph, node2, output);
          pointer.onDragEnd = (upEvent) => linkConnector.dropLinks(graph, upEvent);
          pointer.finally = () => linkConnector.reset(true);
          if (LiteGraph.shift_click_do_break_link_from) {
            if (e2.shiftKey) {
              node2.disconnectOutput(i);
            }
          } else if (LiteGraph.ctrl_alt_click_do_break_link) {
            if (ctrlOrMeta && e2.altKey && !e2.shiftKey) {
              node2.disconnectOutput(i);
            }
          }
          pointer.onDoubleClick = () => {
            var _a3;
            return (_a3 = node2.onOutputDblClick) == null ? void 0 : _a3.call(node2, i, e2);
          };
          pointer.onClick = () => {
            var _a3;
            return (_a3 = node2.onOutputClick) == null ? void 0 : _a3.call(node2, i, e2);
          };
          return;
        }
      }
    }
    if (inputs) {
      for (const [i, input] of inputs.entries()) {
        const link_pos = node2.getInputPos(i);
        if (isInRectangle(x2, y, link_pos[0] - 15, link_pos[1] - 10, 30, 20)) {
          pointer.onDoubleClick = () => {
            var _a3;
            return (_a3 = node2.onInputDblClick) == null ? void 0 : _a3.call(node2, i, e2);
          };
          pointer.onClick = () => {
            var _a3;
            return (_a3 = node2.onInputClick) == null ? void 0 : _a3.call(node2, i, e2);
          };
          const shouldBreakLink = LiteGraph.ctrl_alt_click_do_break_link && ctrlOrMeta && e2.altKey && !e2.shiftKey;
          if (input.link !== null || ((_c = input._floatingLinks) == null ? void 0 : _c.size)) {
            if (shouldBreakLink || LiteGraph.click_do_break_link_to) {
              node2.disconnectInput(i, true);
            } else if (e2.shiftKey || this.allow_reconnect_links) {
              linkConnector.moveInputLink(graph, input);
            }
          }
          if (!linkConnector.isConnecting) {
            linkConnector.dragNewFromInput(graph, node2, input);
          }
          pointer.onDragEnd = (upEvent) => linkConnector.dropLinks(graph, upEvent);
          pointer.finally = () => linkConnector.reset(true);
          this.dirty_bgcanvas = true;
          return;
        }
      }
    }
  }
  const pos = [x2 - node2.pos[0], y - node2.pos[1]];
  const widget = node2.getWidgetOnPos(x2, y);
  if (widget) {
    __privateMethod(this, _LGraphCanvas_instances, processWidgetClick_fn).call(this, e2, node2, widget);
    this.node_widget = [node2, widget];
  } else {
    pointer.onDoubleClick = () => {
      var _a3, _b2;
      if (pos[1] < 0 && !inCollapse) {
        (_a3 = node2.onNodeTitleDblClick) == null ? void 0 : _a3.call(node2, e2, pos, this);
      }
      (_b2 = node2.onDblClick) == null ? void 0 : _b2.call(node2, e2, pos, this);
      this.emitEvent({
        subType: "node-double-click",
        originalEvent: e2,
        node: node2
      });
      this.processNodeDblClicked(node2);
    };
    if (((_d = node2.onMouseDown) == null ? void 0 : _d.call(node2, e2, pos, this)) || !this.allow_dragnodes)
      return;
    pointer.onDragStart = (pointer2) => __privateMethod(this, _LGraphCanvas_instances, startDraggingItems_fn).call(this, node2, pointer2, true);
    pointer.onDragEnd = (e22) => __privateMethod(this, _LGraphCanvas_instances, processDraggedItems_fn).call(this, e22);
  }
  this.dirty_canvas = true;
};
processWidgetClick_fn = function(e2, node2, widget) {
  var _a2;
  const { pointer } = this;
  if (typeof widget.onPointerDown === "function") {
    const handled = widget.onPointerDown(pointer, node2, this);
    if (handled) return;
  }
  const oldValue = widget.value;
  const pos = this.graph_mouse;
  const x2 = pos[0] - node2.pos[0];
  const y = pos[1] - node2.pos[1];
  const WidgetClass = WIDGET_TYPE_MAP[widget.type];
  if (WidgetClass) {
    const widgetInstance = toClass(WidgetClass, widget);
    pointer.onClick = () => widgetInstance.onClick({
      e: e2,
      node: node2,
      canvas: this
    });
    pointer.onDrag = (eMove) => {
      var _a3;
      return (_a3 = widgetInstance.onDrag) == null ? void 0 : _a3.call(widgetInstance, {
        e: eMove,
        node: node2,
        canvas: this
      });
    };
  } else if (widget.mouse) {
    const result = widget.mouse(e2, [x2, y], node2);
    if (result != null) this.dirty_canvas = result;
  }
  if (oldValue != widget.value) {
    (_a2 = node2.onWidgetChanged) == null ? void 0 : _a2.call(node2, widget.name, widget.value, oldValue, widget);
    if (!node2.graph) throw new NullGraphError();
    node2.graph._version++;
  }
  pointer.finally = () => {
    if (widget.mouse) {
      const { eUp } = pointer;
      if (!eUp) return;
      const { canvasX, canvasY } = eUp;
      widget.mouse(eUp, [canvasX - node2.pos[0], canvasY - node2.pos[1]], node2);
    }
    this.node_widget = null;
  };
};
/**
 * Pointer middle button click processing.  Part of {@link processMouseDown}.
 * @param e The pointerdown event
 * @param node The node to process a click event for
 */
processMiddleButton_fn = function(e2, node2) {
  const { pointer } = this;
  if (LiteGraph.middle_click_slot_add_default_node && node2 && this.allow_interaction && !this.read_only && !this.connecting_links && !node2.flags.collapsed) {
    let mClikSlot = false;
    let mClikSlot_index = false;
    let mClikSlot_isOut = false;
    const { inputs, outputs } = node2;
    if (outputs) {
      for (const [i, output] of outputs.entries()) {
        const link_pos = node2.getOutputPos(i);
        if (isInRectangle(e2.canvasX, e2.canvasY, link_pos[0] - 15, link_pos[1] - 10, 30, 20)) {
          mClikSlot = output;
          mClikSlot_index = i;
          mClikSlot_isOut = true;
          break;
        }
      }
    }
    if (inputs) {
      for (const [i, input] of inputs.entries()) {
        const link_pos = node2.getInputPos(i);
        if (isInRectangle(e2.canvasX, e2.canvasY, link_pos[0] - 15, link_pos[1] - 10, 30, 20)) {
          mClikSlot = input;
          mClikSlot_index = i;
          mClikSlot_isOut = false;
          break;
        }
      }
    }
    if (mClikSlot && mClikSlot_index !== false) {
      const alphaPosY = 0.5 - (mClikSlot_index + 1) / (mClikSlot_isOut ? outputs.length : inputs.length);
      const node_bounding = node2.getBounding();
      const posRef = [
        !mClikSlot_isOut ? node_bounding[0] : node_bounding[0] + node_bounding[2],
        e2.canvasY - 80
      ];
      pointer.onClick = () => this.createDefaultNodeForSlot({
        nodeFrom: !mClikSlot_isOut ? null : node2,
        slotFrom: !mClikSlot_isOut ? null : mClikSlot_index,
        nodeTo: !mClikSlot_isOut ? node2 : null,
        slotTo: !mClikSlot_isOut ? mClikSlot_index : null,
        position: posRef,
        nodeType: "AUTO",
        posAdd: [!mClikSlot_isOut ? -30 : 30, -alphaPosY * 130],
        posSizeFix: [!mClikSlot_isOut ? -1 : 0, 0]
      });
    }
  }
  if (this.allow_dragcanvas) {
    pointer.onDragStart = () => this.dragging_canvas = true;
    pointer.finally = () => this.dragging_canvas = false;
  }
};
processDragZoom_fn = function(e2) {
  if (!e2.buttons) {
    __privateSet(this, _dragZoomStart, null);
    return;
  }
  const start = __privateGet(this, _dragZoomStart);
  if (!start) throw new TypeError("Drag-zoom state object was null");
  if (!this.graph) throw new NullGraphError();
  const deltaY = e2.y - start.pos[1];
  const startScale = start.scale;
  const scale = startScale - deltaY / 100;
  this.ds.changeScale(scale, start.pos);
  this.graph.change();
};
/**
 * Start dragging an item, optionally including all other selected items.
 *
 * ** This function sets the {@link CanvasPointer.finally}() callback. **
 * @param item The item that the drag event started on
 * @param pointer The pointer event that initiated the drag, e.g. pointerdown
 * @param sticky If `true`, the item is added to the selection - see {@link processSelect}
 */
startDraggingItems_fn = function(item, pointer, sticky = false) {
  var _a2;
  this.emitBeforeChange();
  (_a2 = this.graph) == null ? void 0 : _a2.beforeChange();
  pointer.finally = () => {
    var _a3;
    this.isDragging = false;
    (_a3 = this.graph) == null ? void 0 : _a3.afterChange();
    this.emitAfterChange();
  };
  this.processSelect(item, pointer.eDown, sticky);
  this.isDragging = true;
};
/**
 * Handles shared clean up and placement after items have been dragged.
 * @param e The event that completed the drag, e.g. pointerup, pointermove
 */
processDraggedItems_fn = function(e2) {
  var _a2;
  const { graph } = this;
  if (e2.shiftKey || LiteGraph.alwaysSnapToGrid)
    graph == null ? void 0 : graph.snapToGrid(this.selectedItems);
  this.dirty_canvas = true;
  this.dirty_bgcanvas = true;
  (_a2 = this.onNodeMoved) == null ? void 0 : _a2.call(this, findFirstNode(this.selectedItems));
};
handleMultiSelect_fn = function(e2, dragRect) {
  var _a2;
  const { graph, selectedItems } = this;
  if (!graph) throw new NullGraphError();
  const w = Math.abs(dragRect[2]);
  const h = Math.abs(dragRect[3]);
  if (dragRect[2] < 0) dragRect[0] -= w;
  if (dragRect[3] < 0) dragRect[1] -= h;
  dragRect[2] = w;
  dragRect[3] = h;
  const isSelected = [];
  const notSelected = [];
  for (const nodeX of graph._nodes) {
    if (!overlapBounding(dragRect, nodeX.boundingRect)) continue;
    if (!nodeX.selected || !selectedItems.has(nodeX))
      notSelected.push(nodeX);
    else isSelected.push(nodeX);
  }
  for (const group of graph.groups) {
    if (!containsRect(dragRect, group._bounding)) continue;
    group.recomputeInsideNodes();
    if (!group.selected || !selectedItems.has(group))
      notSelected.push(group);
    else isSelected.push(group);
  }
  for (const reroute of graph.reroutes.values()) {
    if (!isPointInRect(reroute.pos, dragRect)) continue;
    selectedItems.add(reroute);
    reroute.selected = true;
    if (!reroute.selected || !selectedItems.has(reroute))
      notSelected.push(reroute);
    else isSelected.push(reroute);
  }
  if (e2.shiftKey) {
    for (const item of notSelected) this.select(item);
  } else if (e2.altKey) {
    for (const item of isSelected) this.deselect(item);
  } else {
    for (const item of selectedItems.values()) {
      if (!isSelected.includes(item)) this.deselect(item);
    }
    for (const item of notSelected) this.select(item);
  }
  (_a2 = this.onSelectionChange) == null ? void 0 : _a2.call(this, this.selected_nodes);
};
/** @returns If the pointer is over a link centre marker, the link segment it belongs to.  Otherwise, `undefined`.  */
getLinkCentreOnPos_fn = function(e2) {
  for (const linkSegment of this.renderedPaths) {
    const centre = linkSegment._pos;
    if (!centre) continue;
    if (isInRectangle(e2.canvasX, e2.canvasY, centre[0] - 4, centre[1] - 4, 8, 8)) {
      return linkSegment;
    }
  }
};
/** Get the target snap / highlight point in graph space */
getHighlightPosition_fn = function() {
  var _a2;
  return LiteGraph.snaps_for_comfy ? (_a2 = this._highlight_pos) != null ? _a2 : this.graph_mouse : this.graph_mouse;
};
/**
 * Renders indicators showing where a link will connect if released.
 * Partial border over target node and a highlight over the slot itself.
 * @param ctx Canvas 2D context
 */
renderSnapHighlight_fn = function(ctx, highlightPos) {
  var _a2, _b, _c;
  if (!this._highlight_pos) return;
  ctx.fillStyle = "#ffcc00";
  ctx.beginPath();
  const shape = (_a2 = this._highlight_input) == null ? void 0 : _a2.shape;
  if (shape === RenderShape.ARROW) {
    ctx.moveTo(highlightPos[0] + 8, highlightPos[1] + 0.5);
    ctx.lineTo(highlightPos[0] - 4, highlightPos[1] + 6 + 0.5);
    ctx.lineTo(highlightPos[0] - 4, highlightPos[1] - 6 + 0.5);
    ctx.closePath();
  } else {
    ctx.arc(highlightPos[0], highlightPos[1], 6, 0, Math.PI * 2);
  }
  ctx.fill();
  if (!LiteGraph.snap_highlights_node) return;
  const { linkConnector } = this;
  const { overReroute, overWidget } = linkConnector;
  if (overReroute) {
    const { globalAlpha } = ctx;
    ctx.globalAlpha = 1;
    overReroute.drawHighlight(ctx, "#ffcc00aa");
    ctx.globalAlpha = globalAlpha;
  }
  const node2 = this.node_over;
  if (!(node2 && linkConnector.isConnecting)) return;
  const { strokeStyle, lineWidth } = ctx;
  const area = node2.boundingRect;
  const gap = 3;
  const radius = LiteGraph.ROUND_RADIUS + gap;
  const x2 = area[0] - gap;
  const y = area[1] - gap;
  const width2 = area[2] + gap * 2;
  const height = area[3] + gap * 2;
  ctx.beginPath();
  ctx.roundRect(x2, y, width2, height, radius);
  const start = linkConnector.state.connectingTo === "output" ? 0 : 1;
  const inverter = start ? -1 : 1;
  const hx = highlightPos[0];
  const hy = highlightPos[1];
  const gRadius = width2 < height ? width2 : width2 * Math.max(height / width2, 0.5);
  const gradient = ctx.createRadialGradient(hx, hy, 0, hx, hy, gRadius);
  gradient.addColorStop(1, "#00000000");
  gradient.addColorStop(0, "#ffcc00aa");
  const linearGradient = ctx.createLinearGradient(x2, y, x2 + width2, y);
  linearGradient.addColorStop(0.5, "#00000000");
  linearGradient.addColorStop(start + 0.67 * inverter, "#ddeeff33");
  linearGradient.addColorStop(start + inverter, "#ffcc0055");
  ctx.setLineDash([radius, radius * 1e-3]);
  ctx.lineWidth = 1;
  ctx.strokeStyle = linearGradient;
  ctx.stroke();
  if (overWidget) {
    const { computedHeight } = overWidget;
    ctx.beginPath();
    const { pos: [nodeX, nodeY] } = node2;
    const height2 = LiteGraph.NODE_WIDGET_HEIGHT;
    if (overWidget.type.startsWith("custom") && computedHeight != null && computedHeight > height2 * 2) {
      ctx.rect(
        nodeX + 9,
        nodeY + overWidget.y + 9,
        ((_b = overWidget.width) != null ? _b : area[2]) - 18,
        computedHeight - 18
      );
    } else {
      ctx.roundRect(
        nodeX + 15,
        nodeY + overWidget.y,
        (_c = overWidget.width) != null ? _c : area[2],
        height2,
        height2 * 0.5
      );
    }
    ctx.stroke();
  }
  ctx.strokeStyle = gradient;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
};
renderFloatingLinks_fn = function(ctx, graph, visibleReroutes, now) {
  var _a2, _b;
  const { globalAlpha } = ctx;
  ctx.globalAlpha = globalAlpha * 0.33;
  for (const link2 of graph.floatingLinks.values()) {
    const reroutes = LLink.getReroutes(graph, link2);
    const firstReroute = reroutes[0];
    const reroute = reroutes.at(-1);
    if (!firstReroute || !(reroute == null ? void 0 : reroute.floating)) continue;
    if (reroute.floating.slotType === "input") {
      const node2 = graph.getNodeById(link2.target_id);
      if (!node2) continue;
      const startPos = firstReroute.pos;
      const endPos = node2.getInputPos(link2.target_slot);
      const endDirection = (_a2 = node2.inputs[link2.target_slot]) == null ? void 0 : _a2.dir;
      firstReroute._dragging = true;
      __privateMethod(this, _LGraphCanvas_instances, renderAllLinkSegments_fn).call(this, ctx, link2, startPos, endPos, visibleReroutes, now, LinkDirection.CENTER, endDirection, true);
    } else {
      const node2 = graph.getNodeById(link2.origin_id);
      if (!node2) continue;
      const startPos = node2.getOutputPos(link2.origin_slot);
      const endPos = reroute.pos;
      const startDirection = (_b = node2.outputs[link2.origin_slot]) == null ? void 0 : _b.dir;
      link2._dragging = true;
      __privateMethod(this, _LGraphCanvas_instances, renderAllLinkSegments_fn).call(this, ctx, link2, startPos, endPos, visibleReroutes, now, startDirection, LinkDirection.CENTER, true);
    }
  }
  ctx.globalAlpha = globalAlpha;
};
renderAllLinkSegments_fn = function(ctx, link2, startPos, endPos, visibleReroutes, now, startDirection, endDirection, disabled = false) {
  var _a2, _b, _c, _d, _e, _f;
  const { graph, renderedPaths } = this;
  if (!graph) return;
  const reroutes = LLink.getReroutes(graph, link2);
  const points = [
    startPos,
    ...reroutes.map((x2) => x2.pos),
    endPos
  ];
  const pointsX = points.map((x2) => x2[0]);
  const pointsY = points.map((x2) => x2[1]);
  __privateGet(_LGraphCanvas, _link_bounding)[0] = Math.min(...pointsX);
  __privateGet(_LGraphCanvas, _link_bounding)[1] = Math.min(...pointsY);
  __privateGet(_LGraphCanvas, _link_bounding)[2] = Math.max(...pointsX) - __privateGet(_LGraphCanvas, _link_bounding)[0];
  __privateGet(_LGraphCanvas, _link_bounding)[3] = Math.max(...pointsY) - __privateGet(_LGraphCanvas, _link_bounding)[1];
  if (!overlapBounding(__privateGet(_LGraphCanvas, _link_bounding), __privateGet(_LGraphCanvas, _margin_area)))
    return;
  const start_dir = startDirection || LinkDirection.RIGHT;
  const end_dir = endDirection || LinkDirection.LEFT;
  if (reroutes.length) {
    let startControl;
    const l = reroutes.length;
    for (let j = 0; j < l; j++) {
      const reroute = reroutes[j];
      if (!renderedPaths.has(reroute)) {
        renderedPaths.add(reroute);
        visibleReroutes.push(reroute);
        reroute._colour = link2.color || _LGraphCanvas.link_type_colors[link2.type] || this.default_link_color;
        const prevReroute = graph.getReroute(reroute.parentId);
        const rerouteStartPos = (_a2 = prevReroute == null ? void 0 : prevReroute.pos) != null ? _a2 : startPos;
        reroute.calculateAngle(this.last_draw_time, graph, rerouteStartPos);
        if (!reroute._dragging) {
          this.renderLink(
            ctx,
            rerouteStartPos,
            reroute.pos,
            link2,
            false,
            0,
            null,
            startControl === void 0 ? start_dir : LinkDirection.CENTER,
            LinkDirection.CENTER,
            {
              startControl,
              endControl: reroute.controlPoint,
              reroute,
              disabled
            }
          );
        }
      }
      if (!startControl && ((_c = (_b = reroutes.at(-1)) == null ? void 0 : _b.floating) == null ? void 0 : _c.slotType) === "input") {
        startControl = [0, 0];
      } else {
        const nextPos = (_e = (_d = reroutes[j + 1]) == null ? void 0 : _d.pos) != null ? _e : endPos;
        const dist = Math.min(Reroute.maxSplineOffset, distance(reroute.pos, nextPos) * 0.25);
        startControl = [dist * reroute.cos, dist * reroute.sin];
      }
    }
    if (link2._dragging) return;
    const segmentStartPos = (_f = points.at(-2)) != null ? _f : startPos;
    this.renderLink(
      ctx,
      segmentStartPos,
      endPos,
      link2,
      false,
      0,
      null,
      LinkDirection.CENTER,
      end_dir,
      { startControl, disabled }
    );
  } else if (!link2._dragging) {
    this.renderLink(
      ctx,
      startPos,
      endPos,
      link2,
      false,
      0,
      null,
      start_dir,
      end_dir
    );
  }
  renderedPaths.add(link2);
  if ((link2 == null ? void 0 : link2._last_time) && now - link2._last_time < 1e3) {
    const f = 2 - (now - link2._last_time) * 2e-3;
    const tmp = ctx.globalAlpha;
    ctx.globalAlpha = tmp * f;
    this.renderLink(
      ctx,
      startPos,
      endPos,
      link2,
      true,
      f,
      "white",
      start_dir,
      end_dir
    );
    ctx.globalAlpha = tmp;
  }
};
/**
 * Modifies an existing point, adding a single-axis offset.
 * @param point The point to add the offset to
 * @param direction The direction to add the offset in
 * @param dist Distance to offset
 * @param factor Distance is mulitplied by this value.  Default: 0.25
 */
addSplineOffset_fn = function(point, direction, dist, factor = 0.25) {
  switch (direction) {
    case LinkDirection.LEFT:
      point[0] += dist * -factor;
      break;
    case LinkDirection.RIGHT:
      point[0] += dist * factor;
      break;
    case LinkDirection.UP:
      point[1] += dist * -factor;
      break;
    case LinkDirection.DOWN:
      point[1] += dist * factor;
      break;
  }
};
// Optimised buffers used during rendering
__privateAdd(_LGraphCanvas, _temp, new Float32Array(4));
__privateAdd(_LGraphCanvas, _temp_vec2, new Float32Array(2));
__privateAdd(_LGraphCanvas, _tmp_area, new Float32Array(4));
__privateAdd(_LGraphCanvas, _margin_area, new Float32Array(4));
__privateAdd(_LGraphCanvas, _link_bounding, new Float32Array(4));
__privateAdd(_LGraphCanvas, _lTempA, new Float32Array(2));
__privateAdd(_LGraphCanvas, _lTempB, new Float32Array(2));
__privateAdd(_LGraphCanvas, _lTempC, new Float32Array(2));
__publicField(_LGraphCanvas, "DEFAULT_BACKGROUND_IMAGE", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQBJREFUeNrs1rEKwjAUhlETUkj3vP9rdmr1Ysammk2w5wdxuLgcMHyptfawuZX4pJSWZTnfnu/lnIe/jNNxHHGNn//HNbbv+4dr6V+11uF527arU7+u63qfa/bnmh8sWLBgwYJlqRf8MEptXPBXJXa37BSl3ixYsGDBMliwFLyCV/DeLIMFCxYsWLBMwSt4Be/NggXLYMGCBUvBK3iNruC9WbBgwYJlsGApeAWv4L1ZBgsWLFiwYJmCV/AK3psFC5bBggULloJX8BpdwXuzYMGCBctgwVLwCl7Be7MMFixYsGDBsu8FH1FaSmExVfAxBa/gvVmwYMGCZbBg/W4vAQYA5tRF9QYlv/QAAAAASUVORK5CYII=");
__publicField(_LGraphCanvas, "DEFAULT_EVENT_LINK_COLOR", "#A86");
/** Link type to colour dictionary. */
__publicField(_LGraphCanvas, "link_type_colors", {
  "-1": _LGraphCanvas.DEFAULT_EVENT_LINK_COLOR,
  "number": "#AAA",
  "node": "#DCA"
});
__publicField(_LGraphCanvas, "gradients", {});
__publicField(_LGraphCanvas, "search_limit", -1);
__publicField(_LGraphCanvas, "node_colors", {
  red: { color: "#322", bgcolor: "#533", groupcolor: "#A88" },
  brown: { color: "#332922", bgcolor: "#593930", groupcolor: "#b06634" },
  green: { color: "#232", bgcolor: "#353", groupcolor: "#8A8" },
  blue: { color: "#223", bgcolor: "#335", groupcolor: "#88A" },
  pale_blue: {
    color: "#2a363b",
    bgcolor: "#3f5159",
    groupcolor: "#3f789e"
  },
  cyan: { color: "#233", bgcolor: "#355", groupcolor: "#8AA" },
  purple: { color: "#323", bgcolor: "#535", groupcolor: "#a1309b" },
  yellow: { color: "#432", bgcolor: "#653", groupcolor: "#b58b2a" },
  black: { color: "#222", bgcolor: "#000", groupcolor: "#444" }
});
__publicField(_LGraphCanvas, "active_canvas");
__publicField(_LGraphCanvas, "active_node");
var LGraphCanvas = _LGraphCanvas;
var MapProxyHandler = class {
  getOwnPropertyDescriptor(target, p) {
    const value = this.get(target, p);
    if (value) {
      return {
        configurable: true,
        enumerable: true,
        value
      };
    }
  }
  has(target, p) {
    if (typeof p === "symbol") return false;
    const int = parseInt(p, 10);
    return target.has(!isNaN(int) ? int : p);
  }
  ownKeys(target) {
    return [...target.keys()].map(String);
  }
  get(target, p) {
    if (p in target) return Reflect.get(target, p, target);
    if (typeof p === "symbol") return;
    const int = parseInt(p, 10);
    return target.get(!isNaN(int) ? int : p);
  }
  set(target, p, newValue2) {
    if (typeof p === "symbol") return false;
    const int = parseInt(p, 10);
    target.set(!isNaN(int) ? int : p, newValue2);
    return true;
  }
  deleteProperty(target, p) {
    return target.delete(p);
  }
  static bindAllMethods(map) {
    map.clear = map.clear.bind(map);
    map.delete = map.delete.bind(map);
    map.forEach = map.forEach.bind(map);
    map.get = map.get.bind(map);
    map.has = map.has.bind(map);
    map.set = map.set.bind(map);
    map.entries = map.entries.bind(map);
    map.keys = map.keys.bind(map);
    map.values = map.values.bind(map);
  }
};
var _lastFloatingLinkId, _floatingLinks, _reroutes;
var _LGraph = class _LGraph {
  /**
   * See {@link LGraph}
   * @param o data from previous serialization [optional]
   */
  constructor(o) {
    __publicField(this, "id", zeroUuid);
    __publicField(this, "revision", 0);
    __publicField(this, "_version", -1);
    /** The backing store for links.  Keys are wrapped in String() */
    __publicField(this, "_links", /* @__PURE__ */ new Map());
    /**
     * Indexed property access is deprecated.
     * Backwards compatibility with a Proxy has been added, but will eventually be removed.
     *
     * Use {@link Map} methods:
     * ```
     * const linkId = 123
     * const link = graph.links.get(linkId)
     * // Deprecated: const link = graph.links[linkId]
     * ```
     */
    __publicField(this, "links");
    __publicField(this, "list_of_graphcanvas");
    __publicField(this, "status", _LGraph.STATUS_STOPPED);
    __publicField(this, "state", {
      lastGroupId: 0,
      lastNodeId: 0,
      lastLinkId: 0,
      lastRerouteId: 0
    });
    __publicField(this, "_nodes", []);
    __publicField(this, "_nodes_by_id", {});
    __publicField(this, "_nodes_in_order", []);
    __publicField(this, "_nodes_executable", null);
    __publicField(this, "_groups", []);
    __publicField(this, "iteration", 0);
    __publicField(this, "globaltime", 0);
    /** @deprecated Unused */
    __publicField(this, "runningtime", 0);
    __publicField(this, "fixedtime", 0);
    __publicField(this, "fixedtime_lapse", 0.01);
    __publicField(this, "elapsed_time", 0.01);
    __publicField(this, "last_update_time", 0);
    __publicField(this, "starttime", 0);
    __publicField(this, "catch_errors", true);
    __publicField(this, "execution_timer_id");
    __publicField(this, "errors_in_execution");
    /** @deprecated Unused */
    __publicField(this, "execution_time");
    __publicField(this, "_last_trigger_time");
    __publicField(this, "filter");
    /** Must contain serialisable values, e.g. primitive types */
    __publicField(this, "config", {});
    __publicField(this, "vars", {});
    __publicField(this, "nodes_executing", []);
    __publicField(this, "nodes_actioning", []);
    __publicField(this, "nodes_executedAction", []);
    __publicField(this, "extra", {});
    /** @deprecated Deserialising a workflow sets this unused property. */
    __publicField(this, "version");
    /** Internal only.  Not required for serialisation; calculated on deserialise. */
    __privateAdd(this, _lastFloatingLinkId, 0);
    __privateAdd(this, _floatingLinks, /* @__PURE__ */ new Map());
    __privateAdd(this, _reroutes, /* @__PURE__ */ new Map());
    __publicField(this, "_input_nodes");
    if (LiteGraph.debug) console.log("Graph created");
    const links = this._links;
    MapProxyHandler.bindAllMethods(links);
    const handler = new MapProxyHandler();
    this.links = new Proxy(links, handler);
    this.list_of_graphcanvas = null;
    this.clear();
    if (o) this.configure(o);
  }
  /** @returns Whether the graph has no items */
  get empty() {
    return this._nodes.length + this._groups.length + this.reroutes.size === 0;
  }
  /** @returns All items on the canvas that can be selected */
  *positionableItems() {
    for (const node2 of this._nodes) yield node2;
    for (const group of this._groups) yield group;
    for (const reroute of this.reroutes.values()) yield reroute;
    return;
  }
  get floatingLinks() {
    return __privateGet(this, _floatingLinks);
  }
  /** All reroutes in this graph. */
  get reroutes() {
    return __privateGet(this, _reroutes);
  }
  /** @deprecated See {@link state}.{@link LGraphState.lastNodeId lastNodeId} */
  get last_node_id() {
    return this.state.lastNodeId;
  }
  set last_node_id(value) {
    this.state.lastNodeId = value;
  }
  /** @deprecated See {@link state}.{@link LGraphState.lastLinkId lastLinkId} */
  get last_link_id() {
    return this.state.lastLinkId;
  }
  set last_link_id(value) {
    this.state.lastLinkId = value;
  }
  /**
   * Removes all nodes from this graph
   */
  clear() {
    var _a2;
    this.stop();
    this.status = _LGraph.STATUS_STOPPED;
    this.id = zeroUuid;
    this.revision = 0;
    this.state = {
      lastGroupId: 0,
      lastNodeId: 0,
      lastLinkId: 0,
      lastRerouteId: 0
    };
    this._version = -1;
    if (this._nodes) {
      for (const _node of this._nodes) {
        (_a2 = _node.onRemoved) == null ? void 0 : _a2.call(_node);
      }
    }
    this._nodes = [];
    this._nodes_by_id = {};
    this._nodes_in_order = [];
    this._nodes_executable = null;
    this._links.clear();
    this.reroutes.clear();
    __privateGet(this, _floatingLinks).clear();
    __privateSet(this, _lastFloatingLinkId, 0);
    this._groups = [];
    this.iteration = 0;
    this.config = {};
    this.vars = {};
    this.extra = {};
    this.globaltime = 0;
    this.runningtime = 0;
    this.fixedtime = 0;
    this.fixedtime_lapse = 0.01;
    this.elapsed_time = 0.01;
    this.last_update_time = 0;
    this.starttime = 0;
    this.catch_errors = true;
    this.nodes_executing = [];
    this.nodes_actioning = [];
    this.nodes_executedAction = [];
    this.change();
    this.canvasAction((c) => c.clear());
  }
  get nodes() {
    return this._nodes;
  }
  get groups() {
    return this._groups;
  }
  /**
   * Attach Canvas to this graph
   */
  attachCanvas(graphcanvas) {
    var _a2;
    if (graphcanvas.constructor != LGraphCanvas)
      throw "attachCanvas expects a LGraphCanvas instance";
    if (graphcanvas.graph != this)
      (_a2 = graphcanvas.graph) == null ? void 0 : _a2.detachCanvas(graphcanvas);
    graphcanvas.graph = this;
    this.list_of_graphcanvas || (this.list_of_graphcanvas = []);
    this.list_of_graphcanvas.push(graphcanvas);
  }
  /**
   * Detach Canvas from this graph
   */
  detachCanvas(graphcanvas) {
    if (!this.list_of_graphcanvas) return;
    const pos = this.list_of_graphcanvas.indexOf(graphcanvas);
    if (pos == -1) return;
    graphcanvas.graph = null;
    this.list_of_graphcanvas.splice(pos, 1);
  }
  /**
   * @deprecated Will be removed in 0.9
   * Starts running this graph every interval milliseconds.
   * @param interval amount of milliseconds between executions, if 0 then it renders to the monitor refresh rate
   */
  start(interval) {
    var _a2;
    if (this.status == _LGraph.STATUS_RUNNING) return;
    this.status = _LGraph.STATUS_RUNNING;
    (_a2 = this.onPlayEvent) == null ? void 0 : _a2.call(this);
    this.sendEventToAllNodes("onStart");
    this.starttime = LiteGraph.getTime();
    this.last_update_time = this.starttime;
    interval || (interval = 0);
    if (interval == 0 && typeof window != "undefined" && window.requestAnimationFrame) {
      const on_frame = () => {
        var _a3, _b;
        if (this.execution_timer_id != -1) return;
        window.requestAnimationFrame(on_frame);
        (_a3 = this.onBeforeStep) == null ? void 0 : _a3.call(this);
        this.runStep(1, !this.catch_errors);
        (_b = this.onAfterStep) == null ? void 0 : _b.call(this);
      };
      this.execution_timer_id = -1;
      on_frame();
    } else {
      this.execution_timer_id = setInterval(() => {
        var _a3, _b;
        (_a3 = this.onBeforeStep) == null ? void 0 : _a3.call(this);
        this.runStep(1, !this.catch_errors);
        (_b = this.onAfterStep) == null ? void 0 : _b.call(this);
      }, interval);
    }
  }
  /**
   * @deprecated Will be removed in 0.9
   * Stops the execution loop of the graph
   */
  stop() {
    var _a2;
    if (this.status == _LGraph.STATUS_STOPPED) return;
    this.status = _LGraph.STATUS_STOPPED;
    (_a2 = this.onStopEvent) == null ? void 0 : _a2.call(this);
    if (this.execution_timer_id != null) {
      if (this.execution_timer_id != -1) {
        clearInterval(this.execution_timer_id);
      }
      this.execution_timer_id = null;
    }
    this.sendEventToAllNodes("onStop");
  }
  /**
   * Run N steps (cycles) of the graph
   * @param num number of steps to run, default is 1
   * @param do_not_catch_errors [optional] if you want to try/catch errors
   * @param limit max number of nodes to execute (used to execute from start to a node)
   */
  runStep(num, do_not_catch_errors, limit) {
    var _a2, _b, _c, _d, _e, _f;
    num = num || 1;
    const start = LiteGraph.getTime();
    this.globaltime = 1e-3 * (start - this.starttime);
    const nodes = this._nodes_executable || this._nodes;
    if (!nodes) return;
    limit = limit || nodes.length;
    if (do_not_catch_errors) {
      for (let i = 0; i < num; i++) {
        for (let j = 0; j < limit; ++j) {
          const node2 = nodes[j];
          if (node2.mode == LGraphEventMode.ALWAYS && node2.onExecute) {
            (_a2 = node2.doExecute) == null ? void 0 : _a2.call(node2);
          }
        }
        this.fixedtime += this.fixedtime_lapse;
        (_b = this.onExecuteStep) == null ? void 0 : _b.call(this);
      }
      (_c = this.onAfterExecute) == null ? void 0 : _c.call(this);
    } else {
      try {
        for (let i = 0; i < num; i++) {
          for (let j = 0; j < limit; ++j) {
            const node2 = nodes[j];
            if (node2.mode == LGraphEventMode.ALWAYS) {
              (_d = node2.onExecute) == null ? void 0 : _d.call(node2);
            }
          }
          this.fixedtime += this.fixedtime_lapse;
          (_e = this.onExecuteStep) == null ? void 0 : _e.call(this);
        }
        (_f = this.onAfterExecute) == null ? void 0 : _f.call(this);
        this.errors_in_execution = false;
      } catch (error) {
        this.errors_in_execution = true;
        if (LiteGraph.throw_errors) throw error;
        if (LiteGraph.debug) console.log("Error during execution:", error);
        this.stop();
      }
    }
    const now = LiteGraph.getTime();
    let elapsed = now - start;
    if (elapsed == 0) elapsed = 1;
    this.execution_time = 1e-3 * elapsed;
    this.globaltime += 1e-3 * elapsed;
    this.iteration += 1;
    this.elapsed_time = (now - this.last_update_time) * 1e-3;
    this.last_update_time = now;
    this.nodes_executing = [];
    this.nodes_actioning = [];
    this.nodes_executedAction = [];
  }
  /**
   * Updates the graph execution order according to relevance of the nodes (nodes with only outputs have more relevance than
   * nodes with only inputs.
   */
  updateExecutionOrder() {
    this._nodes_in_order = this.computeExecutionOrder(false);
    this._nodes_executable = [];
    for (const node2 of this._nodes_in_order) {
      if (node2.onExecute) {
        this._nodes_executable.push(node2);
      }
    }
  }
  // This is more internal, it computes the executable nodes in order and returns it
  computeExecutionOrder(only_onExecute, set_level) {
    var _a2;
    const L = [];
    const S = [];
    const M = {};
    const visited_links = {};
    const remaining_links = {};
    for (const node2 of this._nodes) {
      if (only_onExecute && !node2.onExecute) {
        continue;
      }
      M[node2.id] = node2;
      let num = 0;
      if (node2.inputs) {
        for (const input of node2.inputs) {
          if ((input == null ? void 0 : input.link) != null) {
            num += 1;
          }
        }
      }
      if (num == 0) {
        S.push(node2);
        if (set_level) node2._level = 1;
      } else {
        if (set_level) node2._level = 0;
        remaining_links[node2.id] = num;
      }
    }
    while (true) {
      const node2 = S.shift();
      if (node2 === void 0) break;
      L.push(node2);
      delete M[node2.id];
      if (!node2.outputs) continue;
      for (const output of node2.outputs) {
        if ((output == null ? void 0 : output.links) == null || output.links.length == 0)
          continue;
        for (const link_id of output.links) {
          const link2 = this._links.get(link_id);
          if (!link2) continue;
          if (visited_links[link2.id]) continue;
          const target_node = this.getNodeById(link2.target_id);
          if (target_node == null) {
            visited_links[link2.id] = true;
            continue;
          }
          if (set_level) {
            (_a2 = node2._level) != null ? _a2 : node2._level = 0;
            if (!target_node._level || target_node._level <= node2._level) {
              target_node._level = node2._level + 1;
            }
          }
          visited_links[link2.id] = true;
          remaining_links[target_node.id] -= 1;
          if (remaining_links[target_node.id] == 0) S.push(target_node);
        }
      }
    }
    for (const i in M) {
      L.push(M[i]);
    }
    if (L.length != this._nodes.length && LiteGraph.debug)
      console.warn("something went wrong, nodes missing");
    function setOrder(nodes) {
      const l = nodes.length;
      for (let i = 0; i < l; ++i) {
        nodes[i].order = i;
      }
    }
    setOrder(L);
    L.sort(function(A, B) {
      const Ap = A.constructor.priority || A.priority || 0;
      const Bp = B.constructor.priority || B.priority || 0;
      return Ap == Bp ? A.order - B.order : Ap - Bp;
    });
    setOrder(L);
    return L;
  }
  /**
   * @deprecated Will be removed in 0.9
   * Returns all the nodes that could affect this one (ancestors) by crawling all the inputs recursively.
   * It doesn't include the node itself
   * @returns an array with all the LGraphNodes that affect this node, in order of execution
   */
  getAncestors(node2) {
    const ancestors = [];
    const pending = [node2];
    const visited = {};
    while (pending.length) {
      const current = pending.shift();
      if (!(current == null ? void 0 : current.inputs)) continue;
      if (!visited[current.id] && current != node2) {
        visited[current.id] = true;
        ancestors.push(current);
      }
      for (let i = 0; i < current.inputs.length; ++i) {
        const input = current.getInputNode(i);
        if (input && !ancestors.includes(input)) {
          pending.push(input);
        }
      }
    }
    ancestors.sort(function(a, b) {
      return a.order - b.order;
    });
    return ancestors;
  }
  /**
   * Positions every node in a more readable manner
   */
  arrange(margin, layout) {
    margin = margin || 100;
    const nodes = this.computeExecutionOrder(false, true);
    const columns = [];
    for (const node2 of nodes) {
      const col = node2._level || 1;
      columns[col] || (columns[col] = []);
      columns[col].push(node2);
    }
    let x2 = margin;
    for (const column of columns) {
      if (!column) continue;
      let max_size = 100;
      let y = margin + LiteGraph.NODE_TITLE_HEIGHT;
      for (const node2 of column) {
        node2.pos[0] = layout == LiteGraph.VERTICAL_LAYOUT ? y : x2;
        node2.pos[1] = layout == LiteGraph.VERTICAL_LAYOUT ? x2 : y;
        const max_size_index = layout == LiteGraph.VERTICAL_LAYOUT ? 1 : 0;
        if (node2.size[max_size_index] > max_size) {
          max_size = node2.size[max_size_index];
        }
        const node_size_index = layout == LiteGraph.VERTICAL_LAYOUT ? 0 : 1;
        y += node2.size[node_size_index] + margin + LiteGraph.NODE_TITLE_HEIGHT;
      }
      x2 += max_size + margin;
    }
    this.setDirtyCanvas(true, true);
  }
  /**
   * Returns the amount of time the graph has been running in milliseconds
   * @returns number of milliseconds the graph has been running
   */
  getTime() {
    return this.globaltime;
  }
  /**
   * Returns the amount of time accumulated using the fixedtime_lapse var.
   * This is used in context where the time increments should be constant
   * @returns number of milliseconds the graph has been running
   */
  getFixedTime() {
    return this.fixedtime;
  }
  /**
   * Returns the amount of time it took to compute the latest iteration.
   * Take into account that this number could be not correct
   * if the nodes are using graphical actions
   * @returns number of milliseconds it took the last cycle
   */
  getElapsedTime() {
    return this.elapsed_time;
  }
  /**
   * @deprecated Will be removed in 0.9
   * Sends an event to all the nodes, useful to trigger stuff
   * @param eventname the name of the event (function to be called)
   * @param params parameters in array format
   */
  sendEventToAllNodes(eventname, params, mode) {
    mode = mode || LGraphEventMode.ALWAYS;
    const nodes = this._nodes_in_order || this._nodes;
    if (!nodes) return;
    for (const node2 of nodes) {
      if (!node2[eventname] || node2.mode != mode) continue;
      if (params === void 0) {
        node2[eventname]();
      } else if (params && params.constructor === Array) {
        node2[eventname].apply(node2, params);
      } else {
        node2[eventname](params);
      }
    }
  }
  /**
   * Runs an action on every canvas registered to this graph.
   * @param action Action to run for every canvas
   */
  canvasAction(action) {
    const canvases = this.list_of_graphcanvas;
    if (!canvases) return;
    for (const canvas2 of canvases) action(canvas2);
  }
  /** @deprecated See {@link LGraph.canvasAction} */
  sendActionToCanvas(action, params) {
    var _a2;
    const { list_of_graphcanvas } = this;
    if (!list_of_graphcanvas) return;
    for (const c of list_of_graphcanvas) {
      (_a2 = c[action]) == null ? void 0 : _a2.apply(c, params);
    }
  }
  /**
   * Adds a new node instance to this graph
   * @param node the instance of the node
   */
  add(node2, skip_compute_order) {
    var _a2, _b;
    if (!node2) return;
    const { state } = this;
    if (LiteGraph.alwaysSnapToGrid) {
      const snapTo = this.getSnapToGridSize();
      if (snapTo) node2.snapToGrid(snapTo);
    }
    if (node2 instanceof LGraphGroup) {
      if (node2.id == null || node2.id === -1) node2.id = ++state.lastGroupId;
      if (node2.id > state.lastGroupId) state.lastGroupId = node2.id;
      this._groups.push(node2);
      this.setDirtyCanvas(true);
      this.change();
      node2.graph = this;
      this._version++;
      return;
    }
    if (node2.id != -1 && this._nodes_by_id[node2.id] != null) {
      console.warn(
        "LiteGraph: there is already a node with this ID, changing it"
      );
      node2.id = LiteGraph.use_uuids ? LiteGraph.uuidv4() : ++state.lastNodeId;
    }
    if (this._nodes.length >= LiteGraph.MAX_NUMBER_OF_NODES) {
      throw "LiteGraph: max number of nodes in a graph reached";
    }
    if (LiteGraph.use_uuids) {
      if (node2.id == null || node2.id == -1)
        node2.id = LiteGraph.uuidv4();
    } else {
      if (node2.id == null || node2.id == -1) {
        node2.id = ++state.lastNodeId;
      } else if (typeof node2.id === "number" && state.lastNodeId < node2.id) {
        state.lastNodeId = node2.id;
      }
    }
    node2.graph = this;
    this._version++;
    this._nodes.push(node2);
    this._nodes_by_id[node2.id] = node2;
    (_a2 = node2.onAdded) == null ? void 0 : _a2.call(node2, this);
    if (this.config.align_to_grid) node2.alignToGrid();
    if (!skip_compute_order) this.updateExecutionOrder();
    (_b = this.onNodeAdded) == null ? void 0 : _b.call(this, node2);
    this.setDirtyCanvas(true);
    this.change();
    return node2;
  }
  /**
   * Removes a node from the graph
   * @param node the instance of the node
   */
  remove(node2) {
    var _a2, _b, _c;
    if (node2 instanceof LGraphGroup) {
      const index = this._groups.indexOf(node2);
      if (index != -1) {
        this._groups.splice(index, 1);
      }
      node2.graph = void 0;
      this._version++;
      this.setDirtyCanvas(true, true);
      this.change();
      return;
    }
    if (this._nodes_by_id[node2.id] == null) return;
    if (node2.ignore_remove) return;
    this.beforeChange();
    const { inputs, outputs } = node2;
    if (inputs) {
      for (const [i, slot] of inputs.entries()) {
        if (slot.link != null) node2.disconnectInput(i, true);
      }
    }
    if (outputs) {
      for (const [i, slot] of outputs.entries()) {
        if ((_a2 = slot.links) == null ? void 0 : _a2.length) node2.disconnectOutput(i);
      }
    }
    for (const link2 of this.floatingLinks.values()) {
      if (link2.origin_id === node2.id || link2.target_id === node2.id) {
        this.removeFloatingLink(link2);
      }
    }
    (_b = node2.onRemoved) == null ? void 0 : _b.call(node2);
    node2.graph = null;
    this._version++;
    const { list_of_graphcanvas } = this;
    if (list_of_graphcanvas) {
      for (const canvas2 of list_of_graphcanvas) {
        if (canvas2.selected_nodes[node2.id])
          delete canvas2.selected_nodes[node2.id];
      }
    }
    const pos = this._nodes.indexOf(node2);
    if (pos != -1) this._nodes.splice(pos, 1);
    delete this._nodes_by_id[node2.id];
    (_c = this.onNodeRemoved) == null ? void 0 : _c.call(this, node2);
    this.canvasAction((c) => c.checkPanels());
    this.setDirtyCanvas(true, true);
    this.afterChange();
    this.change();
    this.updateExecutionOrder();
  }
  /**
   * Returns a node by its id.
   */
  getNodeById(id) {
    return id != null ? this._nodes_by_id[id] : null;
  }
  /**
   * Returns a list of nodes that matches a class
   * @param classObject the class itself (not an string)
   * @returns a list with all the nodes of this type
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  findNodesByClass(classObject, result) {
    result = result || [];
    result.length = 0;
    const { _nodes } = this;
    for (const node2 of _nodes) {
      if (node2.constructor === classObject)
        result.push(node2);
    }
    return result;
  }
  /**
   * Returns a list of nodes that matches a type
   * @param type the name of the node type
   * @returns a list with all the nodes of this type
   */
  findNodesByType(type, result) {
    var _a2;
    const matchType = type.toLowerCase();
    result = result || [];
    result.length = 0;
    const { _nodes } = this;
    for (const node2 of _nodes) {
      if (((_a2 = node2.type) == null ? void 0 : _a2.toLowerCase()) == matchType)
        result.push(node2);
    }
    return result;
  }
  /**
   * Returns the first node that matches a name in its title
   * @param title the name of the node to search
   * @returns the node or null
   */
  findNodeByTitle(title) {
    const { _nodes } = this;
    for (const node2 of _nodes) {
      if (node2.title == title)
        return node2;
    }
    return null;
  }
  /**
   * Returns a list of nodes that matches a name
   * @param title the name of the node to search
   * @returns a list with all the nodes with this name
   */
  findNodesByTitle(title) {
    const result = [];
    const { _nodes } = this;
    for (const node2 of _nodes) {
      if (node2.title == title)
        result.push(node2);
    }
    return result;
  }
  /**
   * Returns the top-most node in this position of the canvas
   * @param x the x coordinate in canvas space
   * @param y the y coordinate in canvas space
   * @param nodeList a list with all the nodes to search from, by default is all the nodes in the graph
   * @returns the node at this position or null
   */
  getNodeOnPos(x2, y, nodeList) {
    const nodes = nodeList || this._nodes;
    let i = nodes.length;
    while (--i >= 0) {
      const node2 = nodes[i];
      if (node2.isPointInside(x2, y)) return node2;
    }
    return null;
  }
  /**
   * Returns the top-most group in that position
   * @param x The x coordinate in canvas space
   * @param y The y coordinate in canvas space
   * @returns The group or null
   */
  getGroupOnPos(x2, y) {
    return this._groups.toReversed().find((g) => g.isPointInside(x2, y));
  }
  /**
   * Returns the top-most group with a titlebar in the provided position.
   * @param x The x coordinate in canvas space
   * @param y The y coordinate in canvas space
   * @returns The group or null
   */
  getGroupTitlebarOnPos(x2, y) {
    return this._groups.toReversed().find((g) => g.isPointInTitlebar(x2, y));
  }
  /**
   * Finds a reroute a the given graph point
   * @param x X co-ordinate in graph space
   * @param y Y co-ordinate in graph space
   * @returns The first reroute under the given co-ordinates, or undefined
   */
  getRerouteOnPos(x2, y) {
    for (const reroute of this.reroutes.values()) {
      const { pos } = reroute;
      if (isSortaInsideOctagon(x2 - pos[0], y - pos[1], 2 * Reroute.radius))
        return reroute;
    }
  }
  /**
   * Snaps the provided items to a grid.
   *
   * Item positions are reounded to the nearest multiple of {@link LiteGraph.CANVAS_GRID_SIZE}.
   *
   * When {@link LiteGraph.alwaysSnapToGrid} is enabled
   * and the grid size is falsy, a default of 1 is used.
   * @param items The items to be snapped to the grid
   * @todo Currently only snaps nodes.
   */
  snapToGrid(items) {
    const snapTo = this.getSnapToGridSize();
    if (!snapTo) return;
    for (const item of getAllNestedItems(items)) {
      if (!item.pinned) item.snapToGrid(snapTo);
    }
  }
  /**
   * Finds the size of the grid that items should be snapped to when moved.
   * @returns The size of the grid that items should be snapped to
   */
  getSnapToGridSize() {
    return LiteGraph.alwaysSnapToGrid ? LiteGraph.CANVAS_GRID_SIZE || 1 : LiteGraph.CANVAS_GRID_SIZE;
  }
  /**
   * @deprecated Will be removed in 0.9
   * Checks that the node type matches the node type registered,
   * used when replacing a nodetype by a newer version during execution
   * this replaces the ones using the old version with the new version
   */
  checkNodeTypes() {
    const { _nodes } = this;
    for (const [i, node2] of _nodes.entries()) {
      const ctor = LiteGraph.registered_node_types[node2.type];
      if (node2.constructor == ctor) continue;
      console.log("node being replaced by newer version:", node2.type);
      const newnode = LiteGraph.createNode(node2.type);
      if (!newnode) continue;
      _nodes[i] = newnode;
      newnode.configure(node2.serialize());
      newnode.graph = this;
      this._nodes_by_id[newnode.id] = newnode;
      if (node2.inputs) newnode.inputs = [...node2.inputs];
      if (node2.outputs) newnode.outputs = [...node2.outputs];
    }
    this.updateExecutionOrder();
  }
  // ********** GLOBALS *****************
  trigger(action, param) {
    var _a2;
    (_a2 = this.onTrigger) == null ? void 0 : _a2.call(this, action, param);
  }
  /** @todo Clean up - never implemented. */
  triggerInput(name, value) {
    const nodes = this.findNodesByTitle(name);
    for (const node2 of nodes) {
      node2.onTrigger(value);
    }
  }
  /** @todo Clean up - never implemented. */
  setCallback(name, func) {
    const nodes = this.findNodesByTitle(name);
    for (const node2 of nodes) {
      node2.setTrigger(func);
    }
  }
  // used for undo, called before any change is made to the graph
  beforeChange(info) {
    var _a2;
    (_a2 = this.onBeforeChange) == null ? void 0 : _a2.call(this, this, info);
    this.canvasAction((c) => {
      var _a3;
      return (_a3 = c.onBeforeChange) == null ? void 0 : _a3.call(c, this);
    });
  }
  // used to resend actions, called after any change is made to the graph
  afterChange(info) {
    var _a2;
    (_a2 = this.onAfterChange) == null ? void 0 : _a2.call(this, this, info);
    this.canvasAction((c) => {
      var _a3;
      return (_a3 = c.onAfterChange) == null ? void 0 : _a3.call(c, this);
    });
  }
  connectionChange(node2) {
    var _a2;
    this.updateExecutionOrder();
    (_a2 = this.onConnectionChange) == null ? void 0 : _a2.call(this, node2);
    this._version++;
    this.canvasAction((c) => {
      var _a3;
      return (_a3 = c.onConnectionChange) == null ? void 0 : _a3.call(c);
    });
  }
  /**
   * clears the triggered slot animation in all links (stop visual animation)
   */
  clearTriggeredSlots() {
    for (const link_info of this._links.values()) {
      if (!link_info) continue;
      if (link_info._last_time) link_info._last_time = 0;
    }
  }
  /* Called when something visually changed (not the graph!) */
  change() {
    var _a2;
    if (LiteGraph.debug) {
      console.log("Graph changed");
    }
    this.canvasAction((c) => c.setDirty(true, true));
    (_a2 = this.on_change) == null ? void 0 : _a2.call(this, this);
  }
  setDirtyCanvas(fg, bg) {
    this.canvasAction((c) => c.setDirty(fg, bg));
  }
  addFloatingLink(link2) {
    var _a2, _b, _c, _d, _e;
    if (link2.id === -1) {
      link2.id = ++__privateWrapper(this, _lastFloatingLinkId)._;
    }
    __privateGet(this, _floatingLinks).set(link2.id, link2);
    const slot = link2.target_id !== -1 ? (_b = (_a2 = this.getNodeById(link2.target_id)) == null ? void 0 : _a2.inputs) == null ? void 0 : _b[link2.target_slot] : (_d = (_c = this.getNodeById(link2.origin_id)) == null ? void 0 : _c.outputs) == null ? void 0 : _d[link2.origin_slot];
    if (slot) {
      (_e = slot._floatingLinks) != null ? _e : slot._floatingLinks = /* @__PURE__ */ new Set();
      slot._floatingLinks.add(link2);
    } else {
      console.warn(`Adding invalid floating link: target/slot: [${link2.target_id}/${link2.target_slot}] origin/slot: [${link2.origin_id}/${link2.origin_slot}]`);
    }
    const reroutes = LLink.getReroutes(this, link2);
    for (const reroute of reroutes) {
      reroute.floatingLinkIds.add(link2.id);
    }
    return link2;
  }
  removeFloatingLink(link2) {
    var _a2, _b, _c, _d, _e;
    __privateGet(this, _floatingLinks).delete(link2.id);
    const slot = link2.target_id !== -1 ? (_b = (_a2 = this.getNodeById(link2.target_id)) == null ? void 0 : _a2.inputs) == null ? void 0 : _b[link2.target_slot] : (_d = (_c = this.getNodeById(link2.origin_id)) == null ? void 0 : _c.outputs) == null ? void 0 : _d[link2.origin_slot];
    if (slot) {
      (_e = slot._floatingLinks) == null ? void 0 : _e.delete(link2);
    }
    const reroutes = LLink.getReroutes(this, link2);
    for (const reroute of reroutes) {
      reroute.floatingLinkIds.delete(link2.id);
      if (reroute.floatingLinkIds.size === 0) {
        delete reroute.floating;
      }
      if (reroute.totalLinks === 0) this.removeReroute(reroute.id);
    }
  }
  getReroute(id) {
    return id == null ? void 0 : this.reroutes.get(id);
  }
  /**
   * Configures a reroute on the graph where ID is already known (probably deserialisation).
   * Creates the object if it does not exist.
   * @param serialisedReroute See {@link SerialisableReroute}
   */
  setReroute({ id, parentId, pos, linkIds, floating }) {
    var _a2;
    id != null ? id : id = ++this.state.lastRerouteId;
    if (id > this.state.lastRerouteId) this.state.lastRerouteId = id;
    const reroute = (_a2 = this.reroutes.get(id)) != null ? _a2 : new Reroute(id, this);
    reroute.update(parentId, pos, linkIds, floating);
    this.reroutes.set(id, reroute);
    return reroute;
  }
  /**
   * Creates a new reroute and adds it to the graph.
   * @param pos Position in graph space
   * @param before The existing link segment (reroute, link) that will be after this reroute,
   * going from the node output to input.
   * @returns The newly created reroute - typically ignored.
   */
  createReroute(pos, before) {
    const rerouteId = ++this.state.lastRerouteId;
    const linkIds = before instanceof Reroute ? before.linkIds : [before.id];
    const floatingLinkIds = before instanceof Reroute ? before.floatingLinkIds : [before.id];
    const reroute = new Reroute(rerouteId, this, pos, before.parentId, linkIds, floatingLinkIds);
    this.reroutes.set(rerouteId, reroute);
    for (const linkId of linkIds) {
      const link2 = this._links.get(linkId);
      if (!link2) continue;
      if (link2.parentId === before.parentId) link2.parentId = rerouteId;
      const reroutes = LLink.getReroutes(this, link2);
      for (const x2 of reroutes.filter((x22) => x22.parentId === before.parentId)) {
        x2.parentId = rerouteId;
      }
    }
    for (const linkId of floatingLinkIds) {
      const link2 = this.floatingLinks.get(linkId);
      if (!link2) continue;
      if (link2.parentId === before.parentId) link2.parentId = rerouteId;
      const reroutes = LLink.getReroutes(this, link2);
      for (const x2 of reroutes.filter((x22) => x22.parentId === before.parentId)) {
        x2.parentId = rerouteId;
      }
    }
    return reroute;
  }
  /**
   * Removes a reroute from the graph
   * @param id ID of reroute to remove
   */
  removeReroute(id) {
    const { reroutes } = this;
    const reroute = reroutes.get(id);
    if (!reroute) return;
    const { parentId, linkIds, floatingLinkIds } = reroute;
    for (const reroute2 of reroutes.values()) {
      if (reroute2.parentId === id) reroute2.parentId = parentId;
    }
    for (const linkId of linkIds) {
      const link2 = this._links.get(linkId);
      if (link2 && link2.parentId === id) link2.parentId = parentId;
    }
    for (const linkId of floatingLinkIds) {
      const link2 = this.floatingLinks.get(linkId);
      if (!link2) {
        console.warn(`Removed reroute had floating link ID that did not exist [${linkId}]`);
        continue;
      }
      const floatingReroutes = LLink.getReroutes(this, link2);
      const lastReroute = floatingReroutes.at(-1);
      const secondLastReroute = floatingReroutes.at(-2);
      if (reroute !== lastReroute) {
        continue;
      } else if ((secondLastReroute == null ? void 0 : secondLastReroute.totalLinks) !== 1) {
        this.removeFloatingLink(link2);
      } else if (link2.parentId === id) {
        link2.parentId = parentId;
        secondLastReroute.floating = reroute.floating;
      }
    }
    reroutes.delete(id);
    this.setDirtyCanvas(false, true);
  }
  /**
   * Destroys a link
   */
  removeLink(link_id) {
    const link2 = this._links.get(link_id);
    if (!link2) return;
    const node2 = this.getNodeById(link2.target_id);
    node2 == null ? void 0 : node2.disconnectInput(link2.target_slot, false);
    link2.disconnect(this);
  }
  /**
   * Creates a Object containing all the info about this graph, it can be serialized
   * @deprecated Use {@link asSerialisable}, which returns the newer schema version.
   * @returns value of the node
   */
  serialize(option) {
    const { config, state, groups, nodes, reroutes, extra, floatingLinks } = this.asSerialisable(option);
    const linkArray = [...this._links.values()];
    const links = linkArray.map((x2) => x2.serialize());
    if (reroutes == null ? void 0 : reroutes.length) {
      extra.linkExtensions = linkArray.filter((x2) => x2.parentId !== void 0).map((x2) => ({ id: x2.id, parentId: x2.parentId }));
    }
    extra.reroutes = (reroutes == null ? void 0 : reroutes.length) ? reroutes : void 0;
    return {
      id: this.id,
      revision: this.revision,
      last_node_id: state.lastNodeId,
      last_link_id: state.lastLinkId,
      nodes,
      links,
      floatingLinks,
      groups,
      config,
      extra,
      version: LiteGraph.VERSION
    };
  }
  /**
   * Prepares a shallow copy of this object for immediate serialisation or structuredCloning.
   * The return value should be discarded immediately.
   * @param options Serialise options = currently `sortNodes: boolean`, whether to sort nodes by ID.
   * @returns A shallow copy of parts of this graph, with shallow copies of its serialisable objects.
   * Mutating the properties of the return object may result in changes to your graph.
   * It is intended for use with {@link structuredClone} or {@link JSON.stringify}.
   */
  asSerialisable(options22) {
    var _a2;
    const { id, revision, config, state, extra } = this;
    const nodeList = !LiteGraph.use_uuids && (options22 == null ? void 0 : options22.sortNodes) ? [...this._nodes].sort((a, b) => a.id - b.id) : this._nodes;
    const nodes = nodeList.map((node2) => node2.serialize());
    const groups = this._groups.map((x2) => x2.serialize());
    const links = this._links.size ? [...this._links.values()].map((x2) => x2.asSerialisable()) : void 0;
    const floatingLinks = this.floatingLinks.size ? [...this.floatingLinks.values()].map((x2) => x2.asSerialisable()) : void 0;
    const reroutes = this.reroutes.size ? [...this.reroutes.values()].map((x2) => x2.asSerialisable()) : void 0;
    const data = {
      id,
      revision,
      version: _LGraph.serialisedSchemaVersion,
      config,
      state,
      groups,
      nodes,
      links,
      floatingLinks,
      reroutes,
      extra
    };
    (_a2 = this.onSerialize) == null ? void 0 : _a2.call(this, data);
    return data;
  }
  /**
   * Configure a graph from a JSON string
   * @param data The deserialised object to configure this graph from
   * @param keep_old If `true`, the graph will not be cleared prior to
   * adding the configuration.
   */
  configure(data, keep_old) {
    var _a2;
    if (!data) return;
    if (!keep_old) this.clear();
    if (data.id) this.id = data.id;
    else if (this.id === zeroUuid) this.id = createUuidv4();
    let reroutes;
    if (data.version === 0.4) {
      const { extra } = data;
      if (Array.isArray(data.links)) {
        for (const linkData of data.links) {
          const link2 = LLink.createFromArray(linkData);
          this._links.set(link2.id, link2);
        }
      }
      if (Array.isArray(extra == null ? void 0 : extra.linkExtensions)) {
        for (const linkEx of extra.linkExtensions) {
          const link2 = this._links.get(linkEx.id);
          if (link2) link2.parentId = linkEx.parentId;
        }
      }
      reroutes = extra == null ? void 0 : extra.reroutes;
    } else {
      if (data.state) {
        const { state: { lastGroupId, lastLinkId, lastNodeId, lastRerouteId } } = data;
        if (lastGroupId != null) this.state.lastGroupId = lastGroupId;
        if (lastLinkId != null) this.state.lastLinkId = lastLinkId;
        if (lastNodeId != null) this.state.lastNodeId = lastNodeId;
        if (lastRerouteId != null) this.state.lastRerouteId = lastRerouteId;
      }
      if (Array.isArray(data.links)) {
        for (const linkData of data.links) {
          const link2 = LLink.create(linkData);
          this._links.set(link2.id, link2);
        }
      }
      reroutes = data.reroutes;
    }
    if (Array.isArray(reroutes)) {
      for (const rerouteData of reroutes) {
        this.setReroute(rerouteData);
      }
    }
    const nodesData = data.nodes;
    for (const i in data) {
      if (["nodes", "groups", "links", "state", "reroutes", "floatingLinks", "id"].includes(i)) {
        continue;
      }
      this[i] = data[i];
    }
    let error = false;
    this._nodes = [];
    if (nodesData) {
      for (const n_info of nodesData) {
        let node2 = LiteGraph.createNode(String(n_info.type), n_info.title);
        if (!node2) {
          if (LiteGraph.debug) console.log("Node not found or has errors:", n_info.type);
          node2 = new LGraphNode("");
          node2.last_serialization = n_info;
          node2.has_errors = true;
          error = true;
        }
        node2.id = n_info.id;
        this.add(node2, true);
      }
      for (const n_info of nodesData) {
        const node2 = this.getNodeById(n_info.id);
        node2 == null ? void 0 : node2.configure(n_info);
      }
    }
    if (Array.isArray(data.floatingLinks)) {
      for (const linkData of data.floatingLinks) {
        const floatingLink = LLink.create(linkData);
        this.addFloatingLink(floatingLink);
        if (floatingLink.id > __privateGet(this, _lastFloatingLinkId)) __privateSet(this, _lastFloatingLinkId, floatingLink.id);
      }
    }
    for (const reroute of this.reroutes.values()) {
      if (!reroute.validateLinks(this._links, this.floatingLinks)) {
        this.reroutes.delete(reroute.id);
      }
    }
    this._groups.length = 0;
    const groupData = data.groups;
    if (groupData) {
      for (const data2 of groupData) {
        const group = new LiteGraph.LGraphGroup();
        group.configure(data2);
        this.add(group);
      }
    }
    this.updateExecutionOrder();
    this.extra = data.extra || {};
    (_a2 = this.onConfigure) == null ? void 0 : _a2.call(this, data);
    this._version++;
    this.setDirtyCanvas(true, true);
    return error;
  }
  load(url, callback) {
    const that = this;
    if (url instanceof Blob || url instanceof File) {
      const reader = new FileReader();
      reader.addEventListener("load", function(event) {
        var _a2;
        const result = stringOrEmpty((_a2 = event.target) == null ? void 0 : _a2.result);
        const data = JSON.parse(result);
        that.configure(data);
        callback == null ? void 0 : callback();
      });
      reader.readAsText(url);
      return;
    }
    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.send(null);
    req.addEventListener("load", function() {
      if (req.status !== 200) {
        console.error("Error loading graph:", req.status, req.response);
        return;
      }
      const data = JSON.parse(req.response);
      that.configure(data);
      callback == null ? void 0 : callback();
    });
    req.addEventListener("error", (err) => {
      console.error("Error loading graph:", err);
    });
  }
};
_lastFloatingLinkId = new WeakMap();
_floatingLinks = new WeakMap();
_reroutes = new WeakMap();
__publicField(_LGraph, "serialisedSchemaVersion", 1);
__publicField(_LGraph, "STATUS_STOPPED", 1);
__publicField(_LGraph, "STATUS_RUNNING", 2);
var LGraph = _LGraph;
var LiteGraphGlobal = class {
  constructor() {
    // Enums
    __publicField(this, "SlotShape", SlotShape);
    __publicField(this, "SlotDirection", SlotDirection);
    __publicField(this, "SlotType", SlotType);
    __publicField(this, "LabelPosition", LabelPosition);
    /** Used in serialised graphs at one point. */
    __publicField(this, "VERSION", 0.4);
    __publicField(this, "CANVAS_GRID_SIZE", 10);
    __publicField(this, "NODE_TITLE_HEIGHT", 30);
    __publicField(this, "NODE_TITLE_TEXT_Y", 20);
    __publicField(this, "NODE_SLOT_HEIGHT", 20);
    __publicField(this, "NODE_WIDGET_HEIGHT", 20);
    __publicField(this, "NODE_WIDTH", 140);
    __publicField(this, "NODE_MIN_WIDTH", 50);
    __publicField(this, "NODE_COLLAPSED_RADIUS", 10);
    __publicField(this, "NODE_COLLAPSED_WIDTH", 80);
    __publicField(this, "NODE_TITLE_COLOR", "#999");
    __publicField(this, "NODE_SELECTED_TITLE_COLOR", "#FFF");
    __publicField(this, "NODE_TEXT_SIZE", 14);
    __publicField(this, "NODE_TEXT_COLOR", "#AAA");
    __publicField(this, "NODE_TEXT_HIGHLIGHT_COLOR", "#EEE");
    __publicField(this, "NODE_SUBTEXT_SIZE", 12);
    __publicField(this, "NODE_DEFAULT_COLOR", "#333");
    __publicField(this, "NODE_DEFAULT_BGCOLOR", "#353535");
    __publicField(this, "NODE_DEFAULT_BOXCOLOR", "#666");
    __publicField(this, "NODE_DEFAULT_SHAPE", RenderShape.ROUND);
    __publicField(this, "NODE_BOX_OUTLINE_COLOR", "#FFF");
    __publicField(this, "NODE_ERROR_COLOUR", "#E00");
    __publicField(this, "DEFAULT_SHADOW_COLOR", "rgba(0,0,0,0.5)");
    __publicField(this, "DEFAULT_GROUP_FONT", 24);
    __publicField(this, "DEFAULT_GROUP_FONT_SIZE");
    __publicField(this, "WIDGET_BGCOLOR", "#222");
    __publicField(this, "WIDGET_OUTLINE_COLOR", "#666");
    __publicField(this, "WIDGET_ADVANCED_OUTLINE_COLOR", "rgba(56, 139, 253, 0.8)");
    __publicField(this, "WIDGET_TEXT_COLOR", "#DDD");
    __publicField(this, "WIDGET_SECONDARY_TEXT_COLOR", "#999");
    __publicField(this, "LINK_COLOR", "#9A9");
    __publicField(this, "EVENT_LINK_COLOR", "#A86");
    __publicField(this, "CONNECTING_LINK_COLOR", "#AFA");
    /** avoid infinite loops */
    __publicField(this, "MAX_NUMBER_OF_NODES", 1e4);
    /** default node position */
    __publicField(this, "DEFAULT_POSITION", [100, 100]);
    /** ,"circle" */
    __publicField(this, "VALID_SHAPES", ["default", "box", "round", "card"]);
    __publicField(this, "ROUND_RADIUS", 8);
    // shapes are used for nodes but also for slots
    __publicField(this, "BOX_SHAPE", RenderShape.BOX);
    __publicField(this, "ROUND_SHAPE", RenderShape.ROUND);
    __publicField(this, "CIRCLE_SHAPE", RenderShape.CIRCLE);
    __publicField(this, "CARD_SHAPE", RenderShape.CARD);
    __publicField(this, "ARROW_SHAPE", RenderShape.ARROW);
    /** intended for slot arrays */
    __publicField(this, "GRID_SHAPE", RenderShape.GRID);
    // enums
    __publicField(this, "INPUT", NodeSlotType.INPUT);
    __publicField(this, "OUTPUT", NodeSlotType.OUTPUT);
    // TODO: -1 can lead to ambiguity in JS; these should be updated to a more explicit constant or Symbol.
    /** for outputs */
    __publicField(this, "EVENT", -1);
    /** for inputs */
    __publicField(this, "ACTION", -1);
    /** helper, will add "On Request" and more in the future */
    __publicField(this, "NODE_MODES", ["Always", "On Event", "Never", "On Trigger"]);
    /** use with node_box_coloured_by_mode */
    __publicField(this, "NODE_MODES_COLORS", ["#666", "#422", "#333", "#224", "#626"]);
    __publicField(this, "ALWAYS", LGraphEventMode.ALWAYS);
    __publicField(this, "ON_EVENT", LGraphEventMode.ON_EVENT);
    __publicField(this, "NEVER", LGraphEventMode.NEVER);
    __publicField(this, "ON_TRIGGER", LGraphEventMode.ON_TRIGGER);
    __publicField(this, "UP", LinkDirection.UP);
    __publicField(this, "DOWN", LinkDirection.DOWN);
    __publicField(this, "LEFT", LinkDirection.LEFT);
    __publicField(this, "RIGHT", LinkDirection.RIGHT);
    __publicField(this, "CENTER", LinkDirection.CENTER);
    /** helper */
    __publicField(this, "LINK_RENDER_MODES", ["Straight", "Linear", "Spline"]);
    __publicField(this, "HIDDEN_LINK", LinkRenderType.HIDDEN_LINK);
    __publicField(this, "STRAIGHT_LINK", LinkRenderType.STRAIGHT_LINK);
    __publicField(this, "LINEAR_LINK", LinkRenderType.LINEAR_LINK);
    __publicField(this, "SPLINE_LINK", LinkRenderType.SPLINE_LINK);
    __publicField(this, "NORMAL_TITLE", TitleMode.NORMAL_TITLE);
    __publicField(this, "NO_TITLE", TitleMode.NO_TITLE);
    __publicField(this, "TRANSPARENT_TITLE", TitleMode.TRANSPARENT_TITLE);
    __publicField(this, "AUTOHIDE_TITLE", TitleMode.AUTOHIDE_TITLE);
    /** arrange nodes vertically */
    __publicField(this, "VERTICAL_LAYOUT", "vertical");
    /** used to redirect calls */
    __publicField(this, "proxy", null);
    __publicField(this, "node_images_path", "");
    __publicField(this, "debug", false);
    __publicField(this, "catch_exceptions", true);
    __publicField(this, "throw_errors", true);
    /** if set to true some nodes like Formula would be allowed to evaluate code that comes from unsafe sources (like node configuration), which could lead to exploits */
    __publicField(this, "allow_scripts", false);
    /** nodetypes by string */
    __publicField(this, "registered_node_types", {});
    /** @deprecated used for dropping files in the canvas.  It appears the code that enables this was removed, but the object remains and is references by built-in drag drop. */
    __publicField(this, "node_types_by_file_extension", {});
    /** node types by classname */
    __publicField(this, "Nodes", {});
    /** used to store vars between graphs */
    __publicField(this, "Globals", {});
    /** @deprecated Unused and will be deleted. */
    __publicField(this, "searchbox_extras", {});
    /** [true!] this make the nodes box (top left circle) coloured when triggered (execute/action), visual feedback */
    __publicField(this, "node_box_coloured_when_on", false);
    /** [true!] nodebox based on node mode, visual feedback */
    __publicField(this, "node_box_coloured_by_mode", false);
    /** [false on mobile] better true if not touch device, TODO add an helper/listener to close if false */
    __publicField(this, "dialog_close_on_mouse_leave", false);
    __publicField(this, "dialog_close_on_mouse_leave_delay", 500);
    /** [false!] prefer false if results too easy to break links - implement with ALT or TODO custom keys */
    __publicField(this, "shift_click_do_break_link_from", false);
    /** [false!]prefer false, way too easy to break links */
    __publicField(this, "click_do_break_link_to", false);
    /** [true!] who accidentally ctrl-alt-clicks on an in/output? nobody! that's who! */
    __publicField(this, "ctrl_alt_click_do_break_link", true);
    /** [true!] snaps links when dragging connections over valid targets */
    __publicField(this, "snaps_for_comfy", true);
    /** [true!] renders a partial border to highlight when a dragged link is snapped to a node */
    __publicField(this, "snap_highlights_node", true);
    /**
     * If `true`, items always snap to the grid - modifier keys are ignored.
     * When {@link snapToGrid} is falsy, a value of `1` is used.
     * Default: `false`
     */
    __publicField(this, "alwaysSnapToGrid");
    /**
     * When set to a positive number, when nodes are moved their positions will
     * be rounded to the nearest multiple of this value.  Half up.
     * Default: `undefined`
     * @todo Not implemented - see {@link LiteGraph.CANVAS_GRID_SIZE}
     */
    __publicField(this, "snapToGrid");
    /** [false on mobile] better true if not touch device, TODO add an helper/listener to close if false */
    __publicField(this, "search_hide_on_mouse_leave", true);
    /**
     * [true!] enable filtering slots type in the search widget
     * !requires auto_load_slot_types or manual set registered_slot_[in/out]_types and slot_types_[in/out]
     */
    __publicField(this, "search_filter_enabled", false);
    /** [true!] opens the results list when opening the search widget */
    __publicField(this, "search_show_all_on_open", true);
    /**
     * [if want false, use true, run, get vars values to be statically set, than disable]
     * nodes types and nodeclass association with node types need to be calculated,
     * if dont want this, calculate once and set registered_slot_[in/out]_types and slot_types_[in/out]
     */
    __publicField(this, "auto_load_slot_types", false);
    // set these values if not using auto_load_slot_types
    /** slot types for nodeclass */
    __publicField(this, "registered_slot_in_types", {});
    /** slot types for nodeclass */
    __publicField(this, "registered_slot_out_types", {});
    /** slot types IN */
    __publicField(this, "slot_types_in", []);
    /** slot types OUT */
    __publicField(this, "slot_types_out", []);
    /**
     * specify for each IN slot type a(/many) default node(s), use single string, array, or object
     * (with node, title, parameters, ..) like for search
     */
    __publicField(this, "slot_types_default_in", {});
    /**
     * specify for each OUT slot type a(/many) default node(s), use single string, array, or object
     * (with node, title, parameters, ..) like for search
     */
    __publicField(this, "slot_types_default_out", {});
    /** [true!] very handy, ALT click to clone and drag the new node */
    __publicField(this, "alt_drag_do_clone_nodes", false);
    /**
     * [true!] will create and connect event slots when using action/events connections,
     * !WILL CHANGE node mode when using onTrigger (enable mode colors), onExecuted does not need this
     */
    __publicField(this, "do_add_triggers_slots", false);
    /** [false!] being events, it is strongly reccomended to use them sequentially, one by one */
    __publicField(this, "allow_multi_output_for_events", true);
    /** [true!] allows to create and connect a ndoe clicking with the third button (wheel) */
    __publicField(this, "middle_click_slot_add_default_node", false);
    /** [true!] dragging a link to empty space will open a menu, add from list, search or defaults */
    __publicField(this, "release_link_on_empty_shows_menu", false);
    /** "mouse"|"pointer" use mouse for retrocompatibility issues? (none found @ now) */
    __publicField(this, "pointerevents_method", "pointer");
    /**
     * [true!] allows ctrl + shift + v to paste nodes with the outputs of the unselected nodes connected
     * with the inputs of the newly pasted nodes
     */
    __publicField(this, "ctrl_shift_v_paste_connect_unselected_outputs", true);
    // if true, all newly created nodes/links will use string UUIDs for their id fields instead of integers.
    // use this if you must have node IDs that are unique across all graphs and subgraphs.
    __publicField(this, "use_uuids", false);
    // Whether to highlight the bounding box of selected groups
    __publicField(this, "highlight_selected_group", true);
    /** Whether to scale context with the graph when zooming in.  Zooming out never makes context menus smaller. */
    __publicField(this, "context_menu_scaling", false);
    // TODO: Remove legacy accessors
    __publicField(this, "LGraph", LGraph);
    __publicField(this, "LLink", LLink);
    __publicField(this, "LGraphNode", LGraphNode);
    __publicField(this, "LGraphGroup", LGraphGroup);
    __publicField(this, "DragAndScale", DragAndScale);
    __publicField(this, "LGraphCanvas", LGraphCanvas);
    __publicField(this, "ContextMenu", ContextMenu);
    __publicField(this, "CurveEditor", CurveEditor);
    __publicField(this, "Reroute", Reroute);
    __publicField(this, "InputIndicators", InputIndicators);
    /** @see {@link createUuidv4} @inheritdoc */
    __publicField(this, "uuidv4", createUuidv4);
    __publicField(this, "distance", distance);
    __publicField(this, "isInsideRectangle", isInsideRectangle);
    __publicField(this, "overlapBounding", overlapBounding);
  }
  /**
   * Register a node class so it can be listed when the user wants to create a new one
   * @param type name of the node and path
   * @param base_class class containing the structure of a node
   */
  registerNodeType(type, base_class) {
    var _a2, _b, _c;
    if (!base_class.prototype)
      throw "Cannot register a simple object, it must be a class with a prototype";
    base_class.type = type;
    if (this.debug) console.log("Node registered:", type);
    const classname = base_class.name;
    const pos = type.lastIndexOf("/");
    base_class.category = type.substring(0, pos);
    base_class.title || (base_class.title = classname);
    for (const i in LGraphNode.prototype) {
      (_a2 = base_class.prototype)[i] || (_a2[i] = LGraphNode.prototype[i]);
    }
    const prev = this.registered_node_types[type];
    if (prev) {
      console.log("replacing node type:", type);
    }
    this.registered_node_types[type] = base_class;
    if (base_class.constructor.name) this.Nodes[classname] = base_class;
    (_b = this.onNodeTypeRegistered) == null ? void 0 : _b.call(this, type, base_class);
    if (prev) (_c = this.onNodeTypeReplaced) == null ? void 0 : _c.call(this, type, base_class, prev);
    if (base_class.prototype.onPropertyChange)
      console.warn(`LiteGraph node class ${type} has onPropertyChange method, it must be called onPropertyChanged with d at the end`);
    if (this.auto_load_slot_types) new base_class(base_class.title || "tmpnode");
  }
  /**
   * removes a node type from the system
   * @param type name of the node or the node constructor itself
   */
  unregisterNodeType(type) {
    const base_class = typeof type === "string" ? this.registered_node_types[type] : type;
    if (!base_class) throw `node type not found: ${String(type)}`;
    delete this.registered_node_types[String(base_class.type)];
    const name = base_class.constructor.name;
    if (name) delete this.Nodes[name];
  }
  /**
   * Save a slot type and his node
   * @param type name of the node or the node constructor itself
   * @param slot_type name of the slot type (variable type), eg. string, number, array, boolean, ..
   */
  registerNodeAndSlotType(type, slot_type, out) {
    out || (out = false);
    const base_class = typeof type === "string" && this.registered_node_types[type] !== "anonymous" ? this.registered_node_types[type] : type;
    const class_type = base_class.constructor.type;
    let allTypes = [];
    if (typeof slot_type === "string") {
      allTypes = slot_type.split(",");
    } else if (slot_type == this.EVENT || slot_type == this.ACTION) {
      allTypes = ["_event_"];
    } else {
      allTypes = ["*"];
    }
    for (let slotType of allTypes) {
      if (slotType === "") slotType = "*";
      const registerTo = out ? "registered_slot_out_types" : "registered_slot_in_types";
      if (this[registerTo][slotType] === void 0)
        this[registerTo][slotType] = { nodes: [] };
      if (!this[registerTo][slotType].nodes.includes(class_type))
        this[registerTo][slotType].nodes.push(class_type);
      const types = out ? this.slot_types_out : this.slot_types_in;
      if (!types.includes(slotType.toLowerCase())) {
        types.push(slotType.toLowerCase());
        types.sort();
      }
    }
  }
  /**
   * Removes all previously registered node's types
   */
  clearRegisteredTypes() {
    this.registered_node_types = {};
    this.node_types_by_file_extension = {};
    this.Nodes = {};
    this.searchbox_extras = {};
  }
  /**
   * Create a node of a given type with a name. The node is not attached to any graph yet.
   * @param type full name of the node class. p.e. "math/sin"
   * @param title a name to distinguish from other nodes
   * @param options to set options
   */
  createNode(type, title, options22) {
    var _a2;
    const base_class = this.registered_node_types[type];
    if (!base_class) {
      if (this.debug) console.log(`GraphNode type "${type}" not registered.`);
      return null;
    }
    title = title || base_class.title || type;
    let node2 = null;
    if (this.catch_exceptions) {
      try {
        node2 = new base_class(title);
      } catch (error) {
        console.error(error);
        return null;
      }
    } else {
      node2 = new base_class(title);
    }
    node2.type = type;
    if (!node2.title && title) node2.title = title;
    node2.properties || (node2.properties = {});
    node2.properties_info || (node2.properties_info = []);
    node2.flags || (node2.flags = {});
    node2.size || (node2.size = node2.computeSize());
    node2.pos || (node2.pos = [this.DEFAULT_POSITION[0], this.DEFAULT_POSITION[1]]);
    node2.mode || (node2.mode = LGraphEventMode.ALWAYS);
    if (options22) {
      for (const i in options22) {
        node2[i] = options22[i];
      }
    }
    (_a2 = node2.onNodeCreated) == null ? void 0 : _a2.call(node2);
    return node2;
  }
  /**
   * Returns a registered node type with a given name
   * @param type full name of the node class. p.e. "math/sin"
   * @returns the node class
   */
  getNodeType(type) {
    return this.registered_node_types[type];
  }
  /**
   * Returns a list of node types matching one category
   * @param category category name
   * @returns array with all the node classes
   */
  getNodeTypesInCategory(category, filter) {
    const r = [];
    for (const i in this.registered_node_types) {
      const type = this.registered_node_types[i];
      if (type.filter != filter) continue;
      if (category == "") {
        if (type.category == null) r.push(type);
      } else if (type.category == category) {
        r.push(type);
      }
    }
    return r;
  }
  /**
   * Returns a list with all the node type categories
   * @param filter only nodes with ctor.filter equal can be shown
   * @returns array with all the names of the categories
   */
  getNodeTypesCategories(filter) {
    const categories = { "": 1 };
    for (const i in this.registered_node_types) {
      const type = this.registered_node_types[i];
      if (type.category && !type.skip_list) {
        if (type.filter != filter) continue;
        categories[type.category] = 1;
      }
    }
    const result = [];
    for (const i in categories) {
      result.push(i);
    }
    return result;
  }
  // debug purposes: reloads all the js scripts that matches a wildcard
  reloadNodes(folder_wildcard) {
    const tmp = document.getElementsByTagName("script");
    const script_files = [];
    for (const element of tmp) {
      script_files.push(element);
    }
    const docHeadObj = document.getElementsByTagName("head")[0];
    folder_wildcard = document.location.href + folder_wildcard;
    for (const script_file of script_files) {
      const src = script_file.src;
      if (!src || src.substr(0, folder_wildcard.length) != folder_wildcard)
        continue;
      try {
        if (this.debug) console.log("Reloading:", src);
        const dynamicScript = document.createElement("script");
        dynamicScript.type = "text/javascript";
        dynamicScript.src = src;
        docHeadObj.append(dynamicScript);
        script_file.remove();
      } catch (error) {
        if (this.throw_errors) throw error;
        if (this.debug) console.log("Error while reloading", src);
      }
    }
    if (this.debug) console.log("Nodes reloaded");
  }
  // separated just to improve if it doesn't work
  /** @deprecated Prefer {@link structuredClone} */
  cloneObject(obj, target) {
    if (obj == null) return null;
    const r = JSON.parse(JSON.stringify(obj));
    if (!target) return r;
    for (const i in r) {
      target[i] = r[i];
    }
    return target;
  }
  /**
   * Returns if the types of two slots are compatible (taking into account wildcards, etc)
   * @param type_a output
   * @param type_b input
   * @returns true if they can be connected
   */
  isValidConnection(type_a, type_b) {
    if (type_a == "" || type_a === "*") type_a = 0;
    if (type_b == "" || type_b === "*") type_b = 0;
    if (!type_a || !type_b || type_a == type_b || type_a == this.EVENT && type_b == this.ACTION) {
      return true;
    }
    type_a = String(type_a);
    type_b = String(type_b);
    type_a = type_a.toLowerCase();
    type_b = type_b.toLowerCase();
    if (!type_a.includes(",") && !type_b.includes(","))
      return type_a == type_b;
    const supported_types_a = type_a.split(",");
    const supported_types_b = type_b.split(",");
    for (const a of supported_types_a) {
      for (const b of supported_types_b) {
        if (this.isValidConnection(a, b))
          return true;
      }
    }
    return false;
  }
  // used to create nodes from wrapping functions
  getParameterNames(func) {
    return String(func).replaceAll(/\/\/.*$/gm, "").replaceAll(/\s+/g, "").replaceAll(/\/\*[^*/]*\*\//g, "").split("){", 1)[0].replace(/^[^(]*\(/, "").replaceAll(/=[^,]+/g, "").split(",").filter(Boolean);
  }
  /* helper for interaction: pointer, touch, mouse Listeners
    used by LGraphCanvas DragAndScale ContextMenu */
  pointerListenerAdd(oDOM, sEvIn, fCall, capture = false) {
    if (!oDOM || !oDOM.addEventListener || !sEvIn || typeof fCall !== "function") return;
    let sMethod = this.pointerevents_method;
    let sEvent = sEvIn;
    if (sMethod == "pointer" && !window.PointerEvent) {
      console.warn("sMethod=='pointer' && !window.PointerEvent");
      console.log(`Converting pointer[${sEvent}] : down move up cancel enter TO touchstart touchmove touchend, etc ..`);
      switch (sEvent) {
        case "down": {
          sMethod = "touch";
          sEvent = "start";
          break;
        }
        case "move": {
          sMethod = "touch";
          break;
        }
        case "up": {
          sMethod = "touch";
          sEvent = "end";
          break;
        }
        case "cancel": {
          sMethod = "touch";
          break;
        }
        case "enter": {
          console.log("debug: Should I send a move event?");
          break;
        }
        // case "over": case "out": not used at now
        default: {
          console.warn(`PointerEvent not available in this browser ? The event ${sEvent} would not be called`);
        }
      }
    }
    switch (sEvent) {
      // @ts-expect-error
      // both pointer and move events
      case "down":
      case "up":
      case "move":
      case "over":
      case "out":
      case "enter": {
        oDOM.addEventListener(sMethod + sEvent, fCall, capture);
      }
      // @ts-expect-error
      // only pointerevents
      case "leave":
      case "cancel":
      case "gotpointercapture":
      case "lostpointercapture": {
        if (sMethod != "mouse") {
          return oDOM.addEventListener(sMethod + sEvent, fCall, capture);
        }
      }
      // not "pointer" || "mouse"
      default:
        return oDOM.addEventListener(sEvent, fCall, capture);
    }
  }
  pointerListenerRemove(oDOM, sEvent, fCall, capture = false) {
    if (!oDOM || !oDOM.removeEventListener || !sEvent || typeof fCall !== "function") return;
    switch (sEvent) {
      // @ts-expect-error
      // both pointer and move events
      case "down":
      case "up":
      case "move":
      case "over":
      case "out":
      case "enter": {
        if (this.pointerevents_method == "pointer" || this.pointerevents_method == "mouse") {
          oDOM.removeEventListener(this.pointerevents_method + sEvent, fCall, capture);
        }
      }
      // @ts-expect-error
      // only pointerevents
      case "leave":
      case "cancel":
      case "gotpointercapture":
      case "lostpointercapture": {
        if (this.pointerevents_method == "pointer") {
          return oDOM.removeEventListener(this.pointerevents_method + sEvent, fCall, capture);
        }
      }
      // not "pointer" || "mouse"
      default:
        return oDOM.removeEventListener(sEvent, fCall, capture);
    }
  }
  getTime() {
    return performance.now();
  }
  colorToString(c) {
    return `rgba(${Math.round(c[0] * 255).toFixed()},${Math.round(c[1] * 255).toFixed()},${Math.round(c[2] * 255).toFixed()},${c.length == 4 ? c[3].toFixed(2) : "1.0"})`;
  }
  // [minx,miny,maxx,maxy]
  growBounding(bounding, x2, y) {
    if (x2 < bounding[0]) {
      bounding[0] = x2;
    } else if (x2 > bounding[2]) {
      bounding[2] = x2;
    }
    if (y < bounding[1]) {
      bounding[1] = y;
    } else if (y > bounding[3]) {
      bounding[3] = y;
    }
  }
  // point inside bounding box
  isInsideBounding(p, bb) {
    if (p[0] < bb[0][0] || p[1] < bb[0][1] || p[0] > bb[1][0] || p[1] > bb[1][1]) {
      return false;
    }
    return true;
  }
  // Convert a hex value to its decimal value - the inputted hex must be in the
  // format of a hex triplet - the kind we use for HTML colours. The function
  // will return an array with three values.
  hex2num(hex) {
    if (hex.charAt(0) == "#") {
      hex = hex.slice(1);
    }
    hex = hex.toUpperCase();
    const hex_alphabets = "0123456789ABCDEF";
    const value = new Array(3);
    let k = 0;
    let int1, int2;
    for (let i = 0; i < 6; i += 2) {
      int1 = hex_alphabets.indexOf(hex.charAt(i));
      int2 = hex_alphabets.indexOf(hex.charAt(i + 1));
      value[k] = int1 * 16 + int2;
      k++;
    }
    return value;
  }
  // Give a array with three values as the argument and the function will return
  // the corresponding hex triplet.
  num2hex(triplet) {
    const hex_alphabets = "0123456789ABCDEF";
    let hex = "#";
    let int1, int2;
    for (let i = 0; i < 3; i++) {
      int1 = triplet[i] / 16;
      int2 = triplet[i] % 16;
      hex += hex_alphabets.charAt(int1) + hex_alphabets.charAt(int2);
    }
    return hex;
  }
  closeAllContextMenus(ref_window) {
    ref_window = ref_window || window;
    const elements = ref_window.document.querySelectorAll(".litecontextmenu");
    if (!elements.length) return;
    const results = [];
    for (const element of elements) {
      results.push(element);
    }
    for (const result of results) {
      if ("close" in result && typeof result.close === "function") {
        result.close();
      } else if (result.parentNode) {
        result.remove();
      }
    }
  }
  extendClass(target, origin) {
    for (const i in origin) {
      if (target.hasOwnProperty(i)) continue;
      target[i] = origin[i];
    }
    if (origin.prototype) {
      for (const i in origin.prototype) {
        if (!origin.prototype.hasOwnProperty(i)) continue;
        if (target.prototype.hasOwnProperty(i)) continue;
        if (origin.prototype.__lookupGetter__(i)) {
          target.prototype.__defineGetter__(
            i,
            origin.prototype.__lookupGetter__(i)
          );
        } else {
          target.prototype[i] = origin.prototype[i];
        }
        if (origin.prototype.__lookupSetter__(i)) {
          target.prototype.__defineSetter__(
            i,
            origin.prototype.__lookupSetter__(i)
          );
        }
      }
    }
  }
};
function loadPolyfills() {
  if (typeof window != "undefined" && window.CanvasRenderingContext2D && !window.CanvasRenderingContext2D.prototype.roundRect) {
    window.CanvasRenderingContext2D.prototype.roundRect = function(x2, y, w, h, radius, radius_low) {
      let top_left_radius = 0;
      let top_right_radius = 0;
      let bottom_left_radius = 0;
      let bottom_right_radius = 0;
      if (radius === 0) {
        this.rect(x2, y, w, h);
        return;
      }
      if (radius_low === void 0) radius_low = radius;
      if (Array.isArray(radius)) {
        if (radius.length == 1) {
          top_left_radius = top_right_radius = bottom_left_radius = bottom_right_radius = radius[0];
        } else if (radius.length == 2) {
          top_left_radius = bottom_right_radius = radius[0];
          top_right_radius = bottom_left_radius = radius[1];
        } else if (radius.length == 4) {
          top_left_radius = radius[0];
          top_right_radius = radius[1];
          bottom_left_radius = radius[2];
          bottom_right_radius = radius[3];
        } else {
          return;
        }
      } else {
        top_left_radius = radius || 0;
        top_right_radius = radius || 0;
        const low = !Array.isArray(radius_low) && radius_low ? radius_low : 0;
        bottom_left_radius = low;
        bottom_right_radius = low;
      }
      this.moveTo(x2 + top_left_radius, y);
      this.lineTo(x2 + w - top_right_radius, y);
      this.quadraticCurveTo(x2 + w, y, x2 + w, y + top_right_radius);
      this.lineTo(x2 + w, y + h - bottom_right_radius);
      this.quadraticCurveTo(
        x2 + w,
        y + h,
        x2 + w - bottom_right_radius,
        y + h
      );
      this.lineTo(x2 + bottom_right_radius, y + h);
      this.quadraticCurveTo(x2, y + h, x2, y + h - bottom_left_radius);
      this.lineTo(x2, y + bottom_left_radius);
      this.quadraticCurveTo(x2, y, x2 + top_left_radius, y);
    };
  }
  if (typeof window != "undefined" && !window["requestAnimationFrame"]) {
    window.requestAnimationFrame = // @ts-expect-error Legacy code
    window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
      window.setTimeout(callback, 1e3 / 60);
    };
  }
}
var LiteGraph = new LiteGraphGlobal();
function clamp(v2, a, b) {
  return a > v2 ? a : b < v2 ? b : v2;
}
loadPolyfills();

// src_web/comfyui/base_node.ts
var _StoryboardBaseNode = class _StoryboardBaseNode extends LGraphNode {
  constructor(title = _StoryboardBaseNode.title, type) {
    super(title, type);
    this.widgets = [];
    this.comfyClass = "__NEED_COMFY_CLASS__";
    this.nickname = "storyboard";
    this.isVirtualNode = false;
    this.isDropEnabled = false;
    this.removed = false;
    this.__constructed__ = false;
    this.widgets = this.widgets || [];
    this.properties = this.properties || {};
    this.checkAndRunOnConstructed();
  }
  // Deep clone properties for safe duplication
  clone() {
    const cloned = super.clone();
    if ((cloned == null ? void 0 : cloned.properties) && !!window.structuredClone) {
      cloned.properties = structuredClone(cloned.properties);
    }
    return cloned;
  }
  // Widget management utilities
  removeWidget(widgetOrSlot) {
    var _a2;
    if (!this.widgets) return;
    const widget = typeof widgetOrSlot === "number" ? this.widgets[widgetOrSlot] : widgetOrSlot;
    if (widget) {
      const index = this.widgets.indexOf(widget);
      if (index > -1) this.widgets.splice(index, 1);
      (_a2 = widget.onRemove) == null ? void 0 : _a2.call(widget);
    }
  }
  replaceWidget(widgetOrSlot, newWidget) {
    let index = null;
    if (widgetOrSlot) {
      index = typeof widgetOrSlot === "number" ? widgetOrSlot : this.widgets.indexOf(widgetOrSlot);
      this.removeWidget(index);
    }
    index = index != null ? index : this.widgets.length - 1;
    if (this.widgets.includes(newWidget)) {
      this.widgets.splice(this.widgets.indexOf(newWidget), 1);
    }
    this.widgets.splice(index, 0, newWidget);
  }
  onRemoved() {
    var _a2;
    (_a2 = super.onRemoved) == null ? void 0 : _a2.call(this);
    this.removed = true;
  }
  onConstructed() {
    var _a2;
    if (this.__constructed__) return false;
    this.type = (_a2 = this.type) != null ? _a2 : void 0;
    this.serialize_widgets = true;
    this.__constructed__ = true;
    return true;
  }
  checkAndRunOnConstructed() {
    if (!this.__constructed__) {
      this.onConstructed();
    }
    return this.__constructed__;
  }
  static setUp() {
    if (this._category) {
      this.category = this._category;
    }
  }
};
_StoryboardBaseNode.title = "__NEED_CLASS_TITLE__";
_StoryboardBaseNode.type = "__NEED_CLASS_TYPE__";
_StoryboardBaseNode.category = "storyboard";
_StoryboardBaseNode._category = "storyboard";
var StoryboardBaseNode = _StoryboardBaseNode;

// src_web/comfyui/markdown_widget.ts
import { app } from "/scripts/app.js";
import { ComfyWidgets } from "/scripts/widgets.js";

// node_modules/dompurify/dist/purify.es.mjs
var {
  entries,
  setPrototypeOf,
  isFrozen,
  getPrototypeOf,
  getOwnPropertyDescriptor
} = Object;
var {
  freeze,
  seal,
  create
} = Object;
var {
  apply,
  construct
} = typeof Reflect !== "undefined" && Reflect;
if (!freeze) {
  freeze = function freeze2(x2) {
    return x2;
  };
}
if (!seal) {
  seal = function seal2(x2) {
    return x2;
  };
}
if (!apply) {
  apply = function apply2(fun, thisValue, args) {
    return fun.apply(thisValue, args);
  };
}
if (!construct) {
  construct = function construct2(Func, args) {
    return new Func(...args);
  };
}
var arrayForEach = unapply(Array.prototype.forEach);
var arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
var arrayPop = unapply(Array.prototype.pop);
var arrayPush = unapply(Array.prototype.push);
var arraySplice = unapply(Array.prototype.splice);
var stringToLowerCase = unapply(String.prototype.toLowerCase);
var stringToString = unapply(String.prototype.toString);
var stringMatch = unapply(String.prototype.match);
var stringReplace = unapply(String.prototype.replace);
var stringIndexOf = unapply(String.prototype.indexOf);
var stringTrim = unapply(String.prototype.trim);
var objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
var regExpTest = unapply(RegExp.prototype.test);
var typeErrorCreate = unconstruct(TypeError);
function unapply(func) {
  return function(thisArg) {
    if (thisArg instanceof RegExp) {
      thisArg.lastIndex = 0;
    }
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return apply(func, thisArg, args);
  };
}
function unconstruct(func) {
  return function() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return construct(func, args);
  };
}
function addToSet(set, array) {
  let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
  if (setPrototypeOf) {
    setPrototypeOf(set, null);
  }
  let l = array.length;
  while (l--) {
    let element = array[l];
    if (typeof element === "string") {
      const lcElement = transformCaseFunc(element);
      if (lcElement !== element) {
        if (!isFrozen(array)) {
          array[l] = lcElement;
        }
        element = lcElement;
      }
    }
    set[element] = true;
  }
  return set;
}
function cleanArray(array) {
  for (let index = 0; index < array.length; index++) {
    const isPropertyExist = objectHasOwnProperty(array, index);
    if (!isPropertyExist) {
      array[index] = null;
    }
  }
  return array;
}
function clone(object) {
  const newObject = create(null);
  for (const [property, value] of entries(object)) {
    const isPropertyExist = objectHasOwnProperty(object, property);
    if (isPropertyExist) {
      if (Array.isArray(value)) {
        newObject[property] = cleanArray(value);
      } else if (value && typeof value === "object" && value.constructor === Object) {
        newObject[property] = clone(value);
      } else {
        newObject[property] = value;
      }
    }
  }
  return newObject;
}
function lookupGetter(object, prop) {
  while (object !== null) {
    const desc = getOwnPropertyDescriptor(object, prop);
    if (desc) {
      if (desc.get) {
        return unapply(desc.get);
      }
      if (typeof desc.value === "function") {
        return unapply(desc.value);
      }
    }
    object = getPrototypeOf(object);
  }
  function fallbackValue() {
    return null;
  }
  return fallbackValue;
}
var html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
var svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
var svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
var svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
var mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
var mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
var text = freeze(["#text"]);
var html = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]);
var svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
var mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
var xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
var MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm);
var ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
var TMPLIT_EXPR = seal(/\$\{[\w\W]*/gm);
var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
var ARIA_ATTR = seal(/^aria-[\-\w]+$/);
var IS_ALLOWED_URI = seal(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
);
var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
var ATTR_WHITESPACE = seal(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
);
var DOCTYPE_NAME = seal(/^html$/i);
var CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
var EXPRESSIONS = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR,
  ATTR_WHITESPACE,
  CUSTOM_ELEMENT,
  DATA_ATTR,
  DOCTYPE_NAME,
  ERB_EXPR,
  IS_ALLOWED_URI,
  IS_SCRIPT_OR_DATA,
  MUSTACHE_EXPR,
  TMPLIT_EXPR
});
var NODE_TYPE = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  // Deprecated
  entityNode: 6,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12
  // Deprecated
};
var getGlobal = function getGlobal2() {
  return typeof window === "undefined" ? null : window;
};
var _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
  if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") {
    return null;
  }
  let suffix = null;
  const ATTR_NAME = "data-tt-policy-suffix";
  if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
    suffix = purifyHostElement.getAttribute(ATTR_NAME);
  }
  const policyName = "dompurify" + (suffix ? "#" + suffix : "");
  try {
    return trustedTypes.createPolicy(policyName, {
      createHTML(html3) {
        return html3;
      },
      createScriptURL(scriptUrl) {
        return scriptUrl;
      }
    });
  } catch (_) {
    console.warn("TrustedTypes policy " + policyName + " could not be created.");
    return null;
  }
};
var _createHooksMap = function _createHooksMap2() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function createDOMPurify() {
  let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
  const DOMPurify = (root) => createDOMPurify(root);
  DOMPurify.version = "3.2.6";
  DOMPurify.removed = [];
  if (!window2 || !window2.document || window2.document.nodeType !== NODE_TYPE.document || !window2.Element) {
    DOMPurify.isSupported = false;
    return DOMPurify;
  }
  let {
    document: document2
  } = window2;
  const originalDocument = document2;
  const currentScript = originalDocument.currentScript;
  const {
    DocumentFragment,
    HTMLTemplateElement,
    Node,
    Element: Element2,
    NodeFilter,
    NamedNodeMap = window2.NamedNodeMap || window2.MozNamedAttrMap,
    HTMLFormElement,
    DOMParser,
    trustedTypes
  } = window2;
  const ElementPrototype = Element2.prototype;
  const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
  const remove = lookupGetter(ElementPrototype, "remove");
  const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
  const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
  const getParentNode = lookupGetter(ElementPrototype, "parentNode");
  if (typeof HTMLTemplateElement === "function") {
    const template = document2.createElement("template");
    if (template.content && template.content.ownerDocument) {
      document2 = template.content.ownerDocument;
    }
  }
  let trustedTypesPolicy;
  let emptyHTML = "";
  const {
    implementation,
    createNodeIterator,
    createDocumentFragment,
    getElementsByTagName
  } = document2;
  const {
    importNode
  } = originalDocument;
  let hooks = _createHooksMap();
  DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: MUSTACHE_EXPR2,
    ERB_EXPR: ERB_EXPR2,
    TMPLIT_EXPR: TMPLIT_EXPR2,
    DATA_ATTR: DATA_ATTR2,
    ARIA_ATTR: ARIA_ATTR2,
    IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA2,
    ATTR_WHITESPACE: ATTR_WHITESPACE2,
    CUSTOM_ELEMENT: CUSTOM_ELEMENT2
  } = EXPRESSIONS;
  let {
    IS_ALLOWED_URI: IS_ALLOWED_URI$1
  } = EXPRESSIONS;
  let ALLOWED_TAGS2 = null;
  const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
  let ALLOWED_ATTR = null;
  const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
  let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
    tagNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: false
    }
  }));
  let FORBID_TAGS = null;
  let FORBID_ATTR = null;
  let ALLOW_ARIA_ATTR = true;
  let ALLOW_DATA_ATTR = true;
  let ALLOW_UNKNOWN_PROTOCOLS = false;
  let ALLOW_SELF_CLOSE_IN_ATTR = true;
  let SAFE_FOR_TEMPLATES = false;
  let SAFE_FOR_XML = true;
  let WHOLE_DOCUMENT = false;
  let SET_CONFIG = false;
  let FORCE_BODY = false;
  let RETURN_DOM = false;
  let RETURN_DOM_FRAGMENT = false;
  let RETURN_TRUSTED_TYPE = false;
  let SANITIZE_DOM = true;
  let SANITIZE_NAMED_PROPS = false;
  const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
  let KEEP_CONTENT = true;
  let IN_PLACE = false;
  let USE_PROFILES = {};
  let FORBID_CONTENTS = null;
  const DEFAULT_FORBID_CONTENTS = addToSet({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let DATA_URI_TAGS = null;
  const DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
  let URI_SAFE_ATTRIBUTES = null;
  const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
  const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
  let NAMESPACE = HTML_NAMESPACE;
  let IS_EMPTY_INPUT = false;
  let ALLOWED_NAMESPACES = null;
  const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
  let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ["mi", "mo", "mn", "ms", "mtext"]);
  let HTML_INTEGRATION_POINTS = addToSet({}, ["annotation-xml"]);
  const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
  let PARSER_MEDIA_TYPE = null;
  const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
  const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
  let transformCaseFunc = null;
  let CONFIG = null;
  const formElement = document2.createElement("form");
  const isRegexOrFunction = function isRegexOrFunction2(testValue) {
    return testValue instanceof RegExp || testValue instanceof Function;
  };
  const _parseConfig = function _parseConfig2() {
    let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (CONFIG && CONFIG === cfg) {
      return;
    }
    if (!cfg || typeof cfg !== "object") {
      cfg = {};
    }
    cfg = clone(cfg);
    PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
    SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
    transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
    ALLOWED_TAGS2 = objectHasOwnProperty(cfg, "ALLOWED_TAGS") ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
    ALLOWED_ATTR = objectHasOwnProperty(cfg, "ALLOWED_ATTR") ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
    ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, "ALLOWED_NAMESPACES") ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
    URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR, transformCaseFunc) : DEFAULT_URI_SAFE_ATTRIBUTES;
    DATA_URI_TAGS = objectHasOwnProperty(cfg, "ADD_DATA_URI_TAGS") ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS, transformCaseFunc) : DEFAULT_DATA_URI_TAGS;
    FORBID_CONTENTS = objectHasOwnProperty(cfg, "FORBID_CONTENTS") ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
    FORBID_TAGS = objectHasOwnProperty(cfg, "FORBID_TAGS") ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : clone({});
    FORBID_ATTR = objectHasOwnProperty(cfg, "FORBID_ATTR") ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : clone({});
    USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES : false;
    ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
    ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
    ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
    ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
    SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
    SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
    WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
    RETURN_DOM = cfg.RETURN_DOM || false;
    RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
    RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
    FORCE_BODY = cfg.FORCE_BODY || false;
    SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
    SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
    KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
    IN_PLACE = cfg.IN_PLACE || false;
    IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
    NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
    MATHML_TEXT_INTEGRATION_POINTS = cfg.MATHML_TEXT_INTEGRATION_POINTS || MATHML_TEXT_INTEGRATION_POINTS;
    HTML_INTEGRATION_POINTS = cfg.HTML_INTEGRATION_POINTS || HTML_INTEGRATION_POINTS;
    CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === "boolean") {
      CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
    }
    if (SAFE_FOR_TEMPLATES) {
      ALLOW_DATA_ATTR = false;
    }
    if (RETURN_DOM_FRAGMENT) {
      RETURN_DOM = true;
    }
    if (USE_PROFILES) {
      ALLOWED_TAGS2 = addToSet({}, text);
      ALLOWED_ATTR = [];
      if (USE_PROFILES.html === true) {
        addToSet(ALLOWED_TAGS2, html$1);
        addToSet(ALLOWED_ATTR, html);
      }
      if (USE_PROFILES.svg === true) {
        addToSet(ALLOWED_TAGS2, svg$1);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.svgFilters === true) {
        addToSet(ALLOWED_TAGS2, svgFilters);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.mathMl === true) {
        addToSet(ALLOWED_TAGS2, mathMl$1);
        addToSet(ALLOWED_ATTR, mathMl);
        addToSet(ALLOWED_ATTR, xml);
      }
    }
    if (cfg.ADD_TAGS) {
      if (ALLOWED_TAGS2 === DEFAULT_ALLOWED_TAGS) {
        ALLOWED_TAGS2 = clone(ALLOWED_TAGS2);
      }
      addToSet(ALLOWED_TAGS2, cfg.ADD_TAGS, transformCaseFunc);
    }
    if (cfg.ADD_ATTR) {
      if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
        ALLOWED_ATTR = clone(ALLOWED_ATTR);
      }
      addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
    }
    if (cfg.ADD_URI_SAFE_ATTR) {
      addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
    }
    if (cfg.FORBID_CONTENTS) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
    }
    if (KEEP_CONTENT) {
      ALLOWED_TAGS2["#text"] = true;
    }
    if (WHOLE_DOCUMENT) {
      addToSet(ALLOWED_TAGS2, ["html", "head", "body"]);
    }
    if (ALLOWED_TAGS2.table) {
      addToSet(ALLOWED_TAGS2, ["tbody"]);
      delete FORBID_TAGS.tbody;
    }
    if (cfg.TRUSTED_TYPES_POLICY) {
      if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      }
      if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      }
      trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
      emptyHTML = trustedTypesPolicy.createHTML("");
    } else {
      if (trustedTypesPolicy === void 0) {
        trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
      }
      if (trustedTypesPolicy !== null && typeof emptyHTML === "string") {
        emptyHTML = trustedTypesPolicy.createHTML("");
      }
    }
    if (freeze) {
      freeze(cfg);
    }
    CONFIG = cfg;
  };
  const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
  const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
  const _checkValidNamespace = function _checkValidNamespace2(element) {
    let parent = getParentNode(element);
    if (!parent || !parent.tagName) {
      parent = {
        namespaceURI: NAMESPACE,
        tagName: "template"
      };
    }
    const tagName = stringToLowerCase(element.tagName);
    const parentTagName = stringToLowerCase(parent.tagName);
    if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
      return false;
    }
    if (element.namespaceURI === SVG_NAMESPACE) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "svg";
      }
      if (parent.namespaceURI === MATHML_NAMESPACE) {
        return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
      }
      return Boolean(ALL_SVG_TAGS[tagName]);
    }
    if (element.namespaceURI === MATHML_NAMESPACE) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "math";
      }
      if (parent.namespaceURI === SVG_NAMESPACE) {
        return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
      }
      return Boolean(ALL_MATHML_TAGS[tagName]);
    }
    if (element.namespaceURI === HTML_NAMESPACE) {
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    }
    if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
      return true;
    }
    return false;
  };
  const _forceRemove = function _forceRemove2(node2) {
    arrayPush(DOMPurify.removed, {
      element: node2
    });
    try {
      getParentNode(node2).removeChild(node2);
    } catch (_) {
      remove(node2);
    }
  };
  const _removeAttribute = function _removeAttribute2(name, element) {
    try {
      arrayPush(DOMPurify.removed, {
        attribute: element.getAttributeNode(name),
        from: element
      });
    } catch (_) {
      arrayPush(DOMPurify.removed, {
        attribute: null,
        from: element
      });
    }
    element.removeAttribute(name);
    if (name === "is") {
      if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
        try {
          _forceRemove(element);
        } catch (_) {
        }
      } else {
        try {
          element.setAttribute(name, "");
        } catch (_) {
        }
      }
    }
  };
  const _initDocument = function _initDocument2(dirty) {
    let doc = null;
    let leadingWhitespace = null;
    if (FORCE_BODY) {
      dirty = "<remove></remove>" + dirty;
    } else {
      const matches = stringMatch(dirty, /^[\r\n\t ]+/);
      leadingWhitespace = matches && matches[0];
    }
    if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
      dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
    }
    const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
    if (NAMESPACE === HTML_NAMESPACE) {
      try {
        doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
      } catch (_) {
      }
    }
    if (!doc || !doc.documentElement) {
      doc = implementation.createDocument(NAMESPACE, "template", null);
      try {
        doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
      } catch (_) {
      }
    }
    const body = doc.body || doc.documentElement;
    if (dirty && leadingWhitespace) {
      body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
    }
    if (NAMESPACE === HTML_NAMESPACE) {
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
    }
    return WHOLE_DOCUMENT ? doc.documentElement : body;
  };
  const _createNodeIterator = function _createNodeIterator2(root) {
    return createNodeIterator.call(
      root.ownerDocument || root,
      root,
      // eslint-disable-next-line no-bitwise
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION,
      null
    );
  };
  const _isClobbered = function _isClobbered2(element) {
    return element instanceof HTMLFormElement && (typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || !(element.attributes instanceof NamedNodeMap) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function");
  };
  const _isNode = function _isNode2(value) {
    return typeof Node === "function" && value instanceof Node;
  };
  function _executeHooks(hooks2, currentNode, data) {
    arrayForEach(hooks2, (hook) => {
      hook.call(DOMPurify, currentNode, data, CONFIG);
    });
  }
  const _sanitizeElements = function _sanitizeElements2(currentNode) {
    let content = null;
    _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
    if (_isClobbered(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    const tagName = transformCaseFunc(currentNode.nodeName);
    _executeHooks(hooks.uponSanitizeElement, currentNode, {
      tagName,
      allowedTags: ALLOWED_TAGS2
    });
    if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w!]/g, currentNode.innerHTML) && regExpTest(/<[/\w!]/g, currentNode.textContent)) {
      _forceRemove(currentNode);
      return true;
    }
    if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
      _forceRemove(currentNode);
      return true;
    }
    if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
      _forceRemove(currentNode);
      return true;
    }
    if (!ALLOWED_TAGS2[tagName] || FORBID_TAGS[tagName]) {
      if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
          return false;
        }
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
          return false;
        }
      }
      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
        const parentNode = getParentNode(currentNode) || currentNode.parentNode;
        const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
        if (childNodes && parentNode) {
          const childCount = childNodes.length;
          for (let i = childCount - 1; i >= 0; --i) {
            const childClone = cloneNode(childNodes[i], true);
            childClone.__removalCount = (currentNode.__removalCount || 0) + 1;
            parentNode.insertBefore(childClone, getNextSibling(currentNode));
          }
        }
      }
      _forceRemove(currentNode);
      return true;
    }
    if (currentNode instanceof Element2 && !_checkValidNamespace(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
      _forceRemove(currentNode);
      return true;
    }
    if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
      content = currentNode.textContent;
      arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
        content = stringReplace(content, expr, " ");
      });
      if (currentNode.textContent !== content) {
        arrayPush(DOMPurify.removed, {
          element: currentNode.cloneNode()
        });
        currentNode.textContent = content;
      }
    }
    _executeHooks(hooks.afterSanitizeElements, currentNode, null);
    return false;
  };
  const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
    if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
      return false;
    }
    if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR2, lcName)) ;
    else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR2, lcName)) ;
    else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
      if (
        // First condition does a very basic check if a) it's basically a valid custom element tagname AND
        // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
        _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName)) || // Alternative, second condition checks if it's an `is`-attribute, AND
        // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))
      ) ;
      else {
        return false;
      }
    } else if (URI_SAFE_ATTRIBUTES[lcName]) ;
    else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
    else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) ;
    else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA2, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
    else if (value) {
      return false;
    } else ;
    return true;
  };
  const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
    return tagName !== "annotation-xml" && stringMatch(tagName, CUSTOM_ELEMENT2);
  };
  const _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
    _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
    const {
      attributes
    } = currentNode;
    if (!attributes || _isClobbered(currentNode)) {
      return;
    }
    const hookEvent = {
      attrName: "",
      attrValue: "",
      keepAttr: true,
      allowedAttributes: ALLOWED_ATTR,
      forceKeepAttr: void 0
    };
    let l = attributes.length;
    while (l--) {
      const attr = attributes[l];
      const {
        name,
        namespaceURI,
        value: attrValue
      } = attr;
      const lcName = transformCaseFunc(name);
      const initValue = attrValue;
      let value = name === "value" ? initValue : stringTrim(initValue);
      hookEvent.attrName = lcName;
      hookEvent.attrValue = value;
      hookEvent.keepAttr = true;
      hookEvent.forceKeepAttr = void 0;
      _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
      value = hookEvent.attrValue;
      if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name")) {
        _removeAttribute(name, currentNode);
        value = SANITIZE_NAMED_PROPS_PREFIX + value;
      }
      if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|title)/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (hookEvent.forceKeepAttr) {
        continue;
      }
      if (!hookEvent.keepAttr) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (SAFE_FOR_TEMPLATES) {
        arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
          value = stringReplace(value, expr, " ");
        });
      }
      const lcTag = transformCaseFunc(currentNode.nodeName);
      if (!_isValidAttribute(lcTag, lcName, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function") {
        if (namespaceURI) ;
        else {
          switch (trustedTypes.getAttributeType(lcTag, lcName)) {
            case "TrustedHTML": {
              value = trustedTypesPolicy.createHTML(value);
              break;
            }
            case "TrustedScriptURL": {
              value = trustedTypesPolicy.createScriptURL(value);
              break;
            }
          }
        }
      }
      if (value !== initValue) {
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            currentNode.setAttribute(name, value);
          }
          if (_isClobbered(currentNode)) {
            _forceRemove(currentNode);
          } else {
            arrayPop(DOMPurify.removed);
          }
        } catch (_) {
          _removeAttribute(name, currentNode);
        }
      }
    }
    _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
  };
  const _sanitizeShadowDOM = function _sanitizeShadowDOM2(fragment) {
    let shadowNode = null;
    const shadowIterator = _createNodeIterator(fragment);
    _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
    while (shadowNode = shadowIterator.nextNode()) {
      _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
      _sanitizeElements(shadowNode);
      _sanitizeAttributes(shadowNode);
      if (shadowNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM2(shadowNode.content);
      }
    }
    _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
  };
  DOMPurify.sanitize = function(dirty) {
    let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let body = null;
    let importedNode = null;
    let currentNode = null;
    let returnNode = null;
    IS_EMPTY_INPUT = !dirty;
    if (IS_EMPTY_INPUT) {
      dirty = "<!-->";
    }
    if (typeof dirty !== "string" && !_isNode(dirty)) {
      if (typeof dirty.toString === "function") {
        dirty = dirty.toString();
        if (typeof dirty !== "string") {
          throw typeErrorCreate("dirty is not a string, aborting");
        }
      } else {
        throw typeErrorCreate("toString is not a function");
      }
    }
    if (!DOMPurify.isSupported) {
      return dirty;
    }
    if (!SET_CONFIG) {
      _parseConfig(cfg);
    }
    DOMPurify.removed = [];
    if (typeof dirty === "string") {
      IN_PLACE = false;
    }
    if (IN_PLACE) {
      if (dirty.nodeName) {
        const tagName = transformCaseFunc(dirty.nodeName);
        if (!ALLOWED_TAGS2[tagName] || FORBID_TAGS[tagName]) {
          throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
        }
      }
    } else if (dirty instanceof Node) {
      body = _initDocument("<!---->");
      importedNode = body.ownerDocument.importNode(dirty, true);
      if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") {
        body = importedNode;
      } else if (importedNode.nodeName === "HTML") {
        body = importedNode;
      } else {
        body.appendChild(importedNode);
      }
    } else {
      if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
      dirty.indexOf("<") === -1) {
        return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
      }
      body = _initDocument(dirty);
      if (!body) {
        return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
      }
    }
    if (body && FORCE_BODY) {
      _forceRemove(body.firstChild);
    }
    const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
    while (currentNode = nodeIterator.nextNode()) {
      _sanitizeElements(currentNode);
      _sanitizeAttributes(currentNode);
      if (currentNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM(currentNode.content);
      }
    }
    if (IN_PLACE) {
      return dirty;
    }
    if (RETURN_DOM) {
      if (RETURN_DOM_FRAGMENT) {
        returnNode = createDocumentFragment.call(body.ownerDocument);
        while (body.firstChild) {
          returnNode.appendChild(body.firstChild);
        }
      } else {
        returnNode = body;
      }
      if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
        returnNode = importNode.call(originalDocument, returnNode, true);
      }
      return returnNode;
    }
    let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
    if (WHOLE_DOCUMENT && ALLOWED_TAGS2["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
      serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
    }
    if (SAFE_FOR_TEMPLATES) {
      arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
        serializedHTML = stringReplace(serializedHTML, expr, " ");
      });
    }
    return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
  };
  DOMPurify.setConfig = function() {
    let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    _parseConfig(cfg);
    SET_CONFIG = true;
  };
  DOMPurify.clearConfig = function() {
    CONFIG = null;
    SET_CONFIG = false;
  };
  DOMPurify.isValidAttribute = function(tag2, attr, value) {
    if (!CONFIG) {
      _parseConfig({});
    }
    const lcTag = transformCaseFunc(tag2);
    const lcName = transformCaseFunc(attr);
    return _isValidAttribute(lcTag, lcName, value);
  };
  DOMPurify.addHook = function(entryPoint, hookFunction) {
    if (typeof hookFunction !== "function") {
      return;
    }
    arrayPush(hooks[entryPoint], hookFunction);
  };
  DOMPurify.removeHook = function(entryPoint, hookFunction) {
    if (hookFunction !== void 0) {
      const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
      return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
    }
    return arrayPop(hooks[entryPoint]);
  };
  DOMPurify.removeHooks = function(entryPoint) {
    hooks[entryPoint] = [];
  };
  DOMPurify.removeAllHooks = function() {
    hooks = _createHooksMap();
  };
  return DOMPurify;
}
var purify = createDOMPurify();

// node_modules/marked/lib/marked.esm.js
function _getDefaults() {
  return {
    async: false,
    breaks: false,
    extensions: null,
    gfm: true,
    hooks: null,
    pedantic: false,
    renderer: null,
    silent: false,
    tokenizer: null,
    walkTokens: null
  };
}
var _defaults = _getDefaults();
function changeDefaults(newDefaults) {
  _defaults = newDefaults;
}
var noopTest = { exec: () => null };
function edit(regex, opt = "") {
  let source = typeof regex === "string" ? regex : regex.source;
  const obj = {
    replace: (name, val) => {
      let valSource = typeof val === "string" ? val : val.source;
      valSource = valSource.replace(other.caret, "$1");
      source = source.replace(name, valSource);
      return obj;
    },
    getRegex: () => {
      return new RegExp(source, opt);
    }
  };
  return obj;
}
var other = {
  codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
  outputLinkReplace: /\\([\[\]])/g,
  indentCodeCompensation: /^(\s+)(?:```)/,
  beginningSpace: /^\s+/,
  endingHash: /#$/,
  startingSpaceChar: /^ /,
  endingSpaceChar: / $/,
  nonSpaceChar: /[^ ]/,
  newLineCharGlobal: /\n/g,
  tabCharGlobal: /\t/g,
  multipleSpaceGlobal: /\s+/g,
  blankLine: /^[ \t]*$/,
  doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
  blockquoteStart: /^ {0,3}>/,
  blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
  blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
  listReplaceTabs: /^\t+/,
  listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
  listIsTask: /^\[[ xX]\] /,
  listReplaceTask: /^\[[ xX]\] +/,
  anyLine: /\n.*\n/,
  hrefBrackets: /^<(.*)>$/,
  tableDelimiter: /[:|]/,
  tableAlignChars: /^\||\| *$/g,
  tableRowBlankLine: /\n[ \t]*$/,
  tableAlignRight: /^ *-+: *$/,
  tableAlignCenter: /^ *:-+: *$/,
  tableAlignLeft: /^ *:-+ *$/,
  startATag: /^<a /i,
  endATag: /^<\/a>/i,
  startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
  endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
  startAngleBracket: /^</,
  endAngleBracket: />$/,
  pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
  unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
  escapeTest: /[&<>"']/,
  escapeReplace: /[&<>"']/g,
  escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
  escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
  unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
  caret: /(^|[^\[])\^/g,
  percentDecode: /%25/g,
  findPipe: /\|/g,
  splitPipe: / \|/,
  slashPipe: /\\\|/g,
  carriageReturn: /\r\n|\r/g,
  spaceLine: /^ +$/gm,
  notSpaceStart: /^\S*/,
  endingNewline: /\n$/,
  listItemRegex: (bull) => new RegExp(`^( {0,3}${bull})((?:[	 ][^\\n]*)?(?:\\n|$))`),
  nextBulletRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
  hrRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
  fencesBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`),
  headingBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`),
  htmlBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}<(?:[a-z].*>|!--)`, "i")
};
var newline = /^(?:[ \t]*(?:\n|$))+/;
var blockCode = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
var fences = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
var hr = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
var heading = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
var bullet = /(?:[*+-]|\d{1,9}[.)])/;
var lheadingCore = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
var lheading = edit(lheadingCore).replace(/bull/g, bullet).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
var lheadingGfm = edit(lheadingCore).replace(/bull/g, bullet).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
var _paragraph = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
var blockText = /^[^\n]+/;
var _blockLabel = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
var def = edit(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", _blockLabel).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
var list = edit(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, bullet).getRegex();
var _tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
var _comment = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
var html2 = edit(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", _comment).replace("tag", _tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
var paragraph = edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
var blockquote = edit(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", paragraph).getRegex();
var blockNormal = {
  blockquote,
  code: blockCode,
  def,
  fences,
  heading,
  hr,
  html: html2,
  lheading,
  list,
  newline,
  paragraph,
  table: noopTest,
  text: blockText
};
var gfmTable = edit(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
var blockGfm = {
  ...blockNormal,
  lheading: lheadingGfm,
  table: gfmTable,
  paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", gfmTable).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex()
};
var blockPedantic = {
  ...blockNormal,
  html: edit(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", _comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: noopTest,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", lheading).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
};
var escape2 = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
var inlineCode = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
var br = /^( {2,}|\\)\n(?!\s*$)/;
var inlineText = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
var _punctuation = /[\p{P}\p{S}]/u;
var _punctuationOrSpace = /[\s\p{P}\p{S}]/u;
var _notPunctuationOrSpace = /[^\s\p{P}\p{S}]/u;
var punctuation = edit(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, _punctuationOrSpace).getRegex();
var _punctuationGfmStrongEm = /(?!~)[\p{P}\p{S}]/u;
var _punctuationOrSpaceGfmStrongEm = /(?!~)[\s\p{P}\p{S}]/u;
var _notPunctuationOrSpaceGfmStrongEm = /(?:[^\s\p{P}\p{S}]|~)/u;
var blockSkip = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g;
var emStrongLDelimCore = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/;
var emStrongLDelim = edit(emStrongLDelimCore, "u").replace(/punct/g, _punctuation).getRegex();
var emStrongLDelimGfm = edit(emStrongLDelimCore, "u").replace(/punct/g, _punctuationGfmStrongEm).getRegex();
var emStrongRDelimAstCore = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
var emStrongRDelimAst = edit(emStrongRDelimAstCore, "gu").replace(/notPunctSpace/g, _notPunctuationOrSpace).replace(/punctSpace/g, _punctuationOrSpace).replace(/punct/g, _punctuation).getRegex();
var emStrongRDelimAstGfm = edit(emStrongRDelimAstCore, "gu").replace(/notPunctSpace/g, _notPunctuationOrSpaceGfmStrongEm).replace(/punctSpace/g, _punctuationOrSpaceGfmStrongEm).replace(/punct/g, _punctuationGfmStrongEm).getRegex();
var emStrongRDelimUnd = edit(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, _notPunctuationOrSpace).replace(/punctSpace/g, _punctuationOrSpace).replace(/punct/g, _punctuation).getRegex();
var anyPunctuation = edit(/\\(punct)/, "gu").replace(/punct/g, _punctuation).getRegex();
var autolink = edit(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
var _inlineComment = edit(_comment).replace("(?:-->|$)", "-->").getRegex();
var tag = edit(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", _inlineComment).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
var _inlineLabel = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
var link = edit(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", _inlineLabel).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
var reflink = edit(/^!?\[(label)\]\[(ref)\]/).replace("label", _inlineLabel).replace("ref", _blockLabel).getRegex();
var nolink = edit(/^!?\[(ref)\](?:\[\])?/).replace("ref", _blockLabel).getRegex();
var reflinkSearch = edit("reflink|nolink(?!\\()", "g").replace("reflink", reflink).replace("nolink", nolink).getRegex();
var inlineNormal = {
  _backpedal: noopTest,
  // only used for GFM url
  anyPunctuation,
  autolink,
  blockSkip,
  br,
  code: inlineCode,
  del: noopTest,
  emStrongLDelim,
  emStrongRDelimAst,
  emStrongRDelimUnd,
  escape: escape2,
  link,
  nolink,
  punctuation,
  reflink,
  reflinkSearch,
  tag,
  text: inlineText,
  url: noopTest
};
var inlinePedantic = {
  ...inlineNormal,
  link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", _inlineLabel).getRegex(),
  reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", _inlineLabel).getRegex()
};
var inlineGfm = {
  ...inlineNormal,
  emStrongRDelimAst: emStrongRDelimAstGfm,
  emStrongLDelim: emStrongLDelimGfm,
  url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
};
var inlineBreaks = {
  ...inlineGfm,
  br: edit(br).replace("{2,}", "*").getRegex(),
  text: edit(inlineGfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
};
var block = {
  normal: blockNormal,
  gfm: blockGfm,
  pedantic: blockPedantic
};
var inline = {
  normal: inlineNormal,
  gfm: inlineGfm,
  breaks: inlineBreaks,
  pedantic: inlinePedantic
};
var escapeReplacements = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
var getEscapeReplacement = (ch) => escapeReplacements[ch];
function escape22(html22, encode) {
  if (encode) {
    if (other.escapeTest.test(html22)) {
      return html22.replace(other.escapeReplace, getEscapeReplacement);
    }
  } else {
    if (other.escapeTestNoEncode.test(html22)) {
      return html22.replace(other.escapeReplaceNoEncode, getEscapeReplacement);
    }
  }
  return html22;
}
function cleanUrl(href) {
  try {
    href = encodeURI(href).replace(other.percentDecode, "%");
  } catch {
    return null;
  }
  return href;
}
function splitCells(tableRow, count) {
  var _a2;
  const row = tableRow.replace(other.findPipe, (match, offset, str) => {
    let escaped = false;
    let curr = offset;
    while (--curr >= 0 && str[curr] === "\\") escaped = !escaped;
    if (escaped) {
      return "|";
    } else {
      return " |";
    }
  }), cells = row.split(other.splitPipe);
  let i = 0;
  if (!cells[0].trim()) {
    cells.shift();
  }
  if (cells.length > 0 && !((_a2 = cells.at(-1)) == null ? void 0 : _a2.trim())) {
    cells.pop();
  }
  if (count) {
    if (cells.length > count) {
      cells.splice(count);
    } else {
      while (cells.length < count) cells.push("");
    }
  }
  for (; i < cells.length; i++) {
    cells[i] = cells[i].trim().replace(other.slashPipe, "|");
  }
  return cells;
}
function rtrim(str, c, invert) {
  const l = str.length;
  if (l === 0) {
    return "";
  }
  let suffLen = 0;
  while (suffLen < l) {
    const currChar = str.charAt(l - suffLen - 1);
    if (currChar === c && !invert) {
      suffLen++;
    } else if (currChar !== c && invert) {
      suffLen++;
    } else {
      break;
    }
  }
  return str.slice(0, l - suffLen);
}
function findClosingBracket(str, b) {
  if (str.indexOf(b[1]) === -1) {
    return -1;
  }
  let level = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "\\") {
      i++;
    } else if (str[i] === b[0]) {
      level++;
    } else if (str[i] === b[1]) {
      level--;
      if (level < 0) {
        return i;
      }
    }
  }
  if (level > 0) {
    return -2;
  }
  return -1;
}
function outputLink(cap, link2, raw, lexer2, rules) {
  const href = link2.href;
  const title = link2.title || null;
  const text2 = cap[1].replace(rules.other.outputLinkReplace, "$1");
  lexer2.state.inLink = true;
  const token = {
    type: cap[0].charAt(0) === "!" ? "image" : "link",
    raw,
    href,
    title,
    text: text2,
    tokens: lexer2.inlineTokens(text2)
  };
  lexer2.state.inLink = false;
  return token;
}
function indentCodeCompensation(raw, text2, rules) {
  const matchIndentToCode = raw.match(rules.other.indentCodeCompensation);
  if (matchIndentToCode === null) {
    return text2;
  }
  const indentToCode = matchIndentToCode[1];
  return text2.split("\n").map((node2) => {
    const matchIndentInNode = node2.match(rules.other.beginningSpace);
    if (matchIndentInNode === null) {
      return node2;
    }
    const [indentInNode] = matchIndentInNode;
    if (indentInNode.length >= indentToCode.length) {
      return node2.slice(indentToCode.length);
    }
    return node2;
  }).join("\n");
}
var _Tokenizer = class {
  // set by the lexer
  constructor(options22) {
    __publicField(this, "options");
    __publicField(this, "rules");
    // set by the lexer
    __publicField(this, "lexer");
    this.options = options22 || _defaults;
  }
  space(src) {
    const cap = this.rules.block.newline.exec(src);
    if (cap && cap[0].length > 0) {
      return {
        type: "space",
        raw: cap[0]
      };
    }
  }
  code(src) {
    const cap = this.rules.block.code.exec(src);
    if (cap) {
      const text2 = cap[0].replace(this.rules.other.codeRemoveIndent, "");
      return {
        type: "code",
        raw: cap[0],
        codeBlockStyle: "indented",
        text: !this.options.pedantic ? rtrim(text2, "\n") : text2
      };
    }
  }
  fences(src) {
    const cap = this.rules.block.fences.exec(src);
    if (cap) {
      const raw = cap[0];
      const text2 = indentCodeCompensation(raw, cap[3] || "", this.rules);
      return {
        type: "code",
        raw,
        lang: cap[2] ? cap[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : cap[2],
        text: text2
      };
    }
  }
  heading(src) {
    const cap = this.rules.block.heading.exec(src);
    if (cap) {
      let text2 = cap[2].trim();
      if (this.rules.other.endingHash.test(text2)) {
        const trimmed = rtrim(text2, "#");
        if (this.options.pedantic) {
          text2 = trimmed.trim();
        } else if (!trimmed || this.rules.other.endingSpaceChar.test(trimmed)) {
          text2 = trimmed.trim();
        }
      }
      return {
        type: "heading",
        raw: cap[0],
        depth: cap[1].length,
        text: text2,
        tokens: this.lexer.inline(text2)
      };
    }
  }
  hr(src) {
    const cap = this.rules.block.hr.exec(src);
    if (cap) {
      return {
        type: "hr",
        raw: rtrim(cap[0], "\n")
      };
    }
  }
  blockquote(src) {
    const cap = this.rules.block.blockquote.exec(src);
    if (cap) {
      let lines = rtrim(cap[0], "\n").split("\n");
      let raw = "";
      let text2 = "";
      const tokens = [];
      while (lines.length > 0) {
        let inBlockquote = false;
        const currentLines = [];
        let i;
        for (i = 0; i < lines.length; i++) {
          if (this.rules.other.blockquoteStart.test(lines[i])) {
            currentLines.push(lines[i]);
            inBlockquote = true;
          } else if (!inBlockquote) {
            currentLines.push(lines[i]);
          } else {
            break;
          }
        }
        lines = lines.slice(i);
        const currentRaw = currentLines.join("\n");
        const currentText = currentRaw.replace(this.rules.other.blockquoteSetextReplace, "\n    $1").replace(this.rules.other.blockquoteSetextReplace2, "");
        raw = raw ? `${raw}
${currentRaw}` : currentRaw;
        text2 = text2 ? `${text2}
${currentText}` : currentText;
        const top = this.lexer.state.top;
        this.lexer.state.top = true;
        this.lexer.blockTokens(currentText, tokens, true);
        this.lexer.state.top = top;
        if (lines.length === 0) {
          break;
        }
        const lastToken = tokens.at(-1);
        if ((lastToken == null ? void 0 : lastToken.type) === "code") {
          break;
        } else if ((lastToken == null ? void 0 : lastToken.type) === "blockquote") {
          const oldToken = lastToken;
          const newText = oldToken.raw + "\n" + lines.join("\n");
          const newToken = this.blockquote(newText);
          tokens[tokens.length - 1] = newToken;
          raw = raw.substring(0, raw.length - oldToken.raw.length) + newToken.raw;
          text2 = text2.substring(0, text2.length - oldToken.text.length) + newToken.text;
          break;
        } else if ((lastToken == null ? void 0 : lastToken.type) === "list") {
          const oldToken = lastToken;
          const newText = oldToken.raw + "\n" + lines.join("\n");
          const newToken = this.list(newText);
          tokens[tokens.length - 1] = newToken;
          raw = raw.substring(0, raw.length - lastToken.raw.length) + newToken.raw;
          text2 = text2.substring(0, text2.length - oldToken.raw.length) + newToken.raw;
          lines = newText.substring(tokens.at(-1).raw.length).split("\n");
          continue;
        }
      }
      return {
        type: "blockquote",
        raw,
        tokens,
        text: text2
      };
    }
  }
  list(src) {
    let cap = this.rules.block.list.exec(src);
    if (cap) {
      let bull = cap[1].trim();
      const isordered = bull.length > 1;
      const list2 = {
        type: "list",
        raw: "",
        ordered: isordered,
        start: isordered ? +bull.slice(0, -1) : "",
        loose: false,
        items: []
      };
      bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;
      if (this.options.pedantic) {
        bull = isordered ? bull : "[*+-]";
      }
      const itemRegex = this.rules.other.listItemRegex(bull);
      let endsWithBlankLine = false;
      while (src) {
        let endEarly = false;
        let raw = "";
        let itemContents = "";
        if (!(cap = itemRegex.exec(src))) {
          break;
        }
        if (this.rules.block.hr.test(src)) {
          break;
        }
        raw = cap[0];
        src = src.substring(raw.length);
        let line = cap[2].split("\n", 1)[0].replace(this.rules.other.listReplaceTabs, (t) => " ".repeat(3 * t.length));
        let nextLine = src.split("\n", 1)[0];
        let blankLine = !line.trim();
        let indent = 0;
        if (this.options.pedantic) {
          indent = 2;
          itemContents = line.trimStart();
        } else if (blankLine) {
          indent = cap[1].length + 1;
        } else {
          indent = cap[2].search(this.rules.other.nonSpaceChar);
          indent = indent > 4 ? 1 : indent;
          itemContents = line.slice(indent);
          indent += cap[1].length;
        }
        if (blankLine && this.rules.other.blankLine.test(nextLine)) {
          raw += nextLine + "\n";
          src = src.substring(nextLine.length + 1);
          endEarly = true;
        }
        if (!endEarly) {
          const nextBulletRegex = this.rules.other.nextBulletRegex(indent);
          const hrRegex = this.rules.other.hrRegex(indent);
          const fencesBeginRegex = this.rules.other.fencesBeginRegex(indent);
          const headingBeginRegex = this.rules.other.headingBeginRegex(indent);
          const htmlBeginRegex = this.rules.other.htmlBeginRegex(indent);
          while (src) {
            const rawLine = src.split("\n", 1)[0];
            let nextLineWithoutTabs;
            nextLine = rawLine;
            if (this.options.pedantic) {
              nextLine = nextLine.replace(this.rules.other.listReplaceNesting, "  ");
              nextLineWithoutTabs = nextLine;
            } else {
              nextLineWithoutTabs = nextLine.replace(this.rules.other.tabCharGlobal, "    ");
            }
            if (fencesBeginRegex.test(nextLine)) {
              break;
            }
            if (headingBeginRegex.test(nextLine)) {
              break;
            }
            if (htmlBeginRegex.test(nextLine)) {
              break;
            }
            if (nextBulletRegex.test(nextLine)) {
              break;
            }
            if (hrRegex.test(nextLine)) {
              break;
            }
            if (nextLineWithoutTabs.search(this.rules.other.nonSpaceChar) >= indent || !nextLine.trim()) {
              itemContents += "\n" + nextLineWithoutTabs.slice(indent);
            } else {
              if (blankLine) {
                break;
              }
              if (line.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4) {
                break;
              }
              if (fencesBeginRegex.test(line)) {
                break;
              }
              if (headingBeginRegex.test(line)) {
                break;
              }
              if (hrRegex.test(line)) {
                break;
              }
              itemContents += "\n" + nextLine;
            }
            if (!blankLine && !nextLine.trim()) {
              blankLine = true;
            }
            raw += rawLine + "\n";
            src = src.substring(rawLine.length + 1);
            line = nextLineWithoutTabs.slice(indent);
          }
        }
        if (!list2.loose) {
          if (endsWithBlankLine) {
            list2.loose = true;
          } else if (this.rules.other.doubleBlankLine.test(raw)) {
            endsWithBlankLine = true;
          }
        }
        let istask = null;
        let ischecked;
        if (this.options.gfm) {
          istask = this.rules.other.listIsTask.exec(itemContents);
          if (istask) {
            ischecked = istask[0] !== "[ ] ";
            itemContents = itemContents.replace(this.rules.other.listReplaceTask, "");
          }
        }
        list2.items.push({
          type: "list_item",
          raw,
          task: !!istask,
          checked: ischecked,
          loose: false,
          text: itemContents,
          tokens: []
        });
        list2.raw += raw;
      }
      const lastItem = list2.items.at(-1);
      if (lastItem) {
        lastItem.raw = lastItem.raw.trimEnd();
        lastItem.text = lastItem.text.trimEnd();
      } else {
        return;
      }
      list2.raw = list2.raw.trimEnd();
      for (let i = 0; i < list2.items.length; i++) {
        this.lexer.state.top = false;
        list2.items[i].tokens = this.lexer.blockTokens(list2.items[i].text, []);
        if (!list2.loose) {
          const spacers = list2.items[i].tokens.filter((t) => t.type === "space");
          const hasMultipleLineBreaks = spacers.length > 0 && spacers.some((t) => this.rules.other.anyLine.test(t.raw));
          list2.loose = hasMultipleLineBreaks;
        }
      }
      if (list2.loose) {
        for (let i = 0; i < list2.items.length; i++) {
          list2.items[i].loose = true;
        }
      }
      return list2;
    }
  }
  html(src) {
    const cap = this.rules.block.html.exec(src);
    if (cap) {
      const token = {
        type: "html",
        block: true,
        raw: cap[0],
        pre: cap[1] === "pre" || cap[1] === "script" || cap[1] === "style",
        text: cap[0]
      };
      return token;
    }
  }
  def(src) {
    const cap = this.rules.block.def.exec(src);
    if (cap) {
      const tag2 = cap[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " ");
      const href = cap[2] ? cap[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "";
      const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : cap[3];
      return {
        type: "def",
        tag: tag2,
        raw: cap[0],
        href,
        title
      };
    }
  }
  table(src) {
    var _a2;
    const cap = this.rules.block.table.exec(src);
    if (!cap) {
      return;
    }
    if (!this.rules.other.tableDelimiter.test(cap[2])) {
      return;
    }
    const headers = splitCells(cap[1]);
    const aligns = cap[2].replace(this.rules.other.tableAlignChars, "").split("|");
    const rows = ((_a2 = cap[3]) == null ? void 0 : _a2.trim()) ? cap[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [];
    const item = {
      type: "table",
      raw: cap[0],
      header: [],
      align: [],
      rows: []
    };
    if (headers.length !== aligns.length) {
      return;
    }
    for (const align of aligns) {
      if (this.rules.other.tableAlignRight.test(align)) {
        item.align.push("right");
      } else if (this.rules.other.tableAlignCenter.test(align)) {
        item.align.push("center");
      } else if (this.rules.other.tableAlignLeft.test(align)) {
        item.align.push("left");
      } else {
        item.align.push(null);
      }
    }
    for (let i = 0; i < headers.length; i++) {
      item.header.push({
        text: headers[i],
        tokens: this.lexer.inline(headers[i]),
        header: true,
        align: item.align[i]
      });
    }
    for (const row of rows) {
      item.rows.push(splitCells(row, item.header.length).map((cell, i) => {
        return {
          text: cell,
          tokens: this.lexer.inline(cell),
          header: false,
          align: item.align[i]
        };
      }));
    }
    return item;
  }
  lheading(src) {
    const cap = this.rules.block.lheading.exec(src);
    if (cap) {
      return {
        type: "heading",
        raw: cap[0],
        depth: cap[2].charAt(0) === "=" ? 1 : 2,
        text: cap[1],
        tokens: this.lexer.inline(cap[1])
      };
    }
  }
  paragraph(src) {
    const cap = this.rules.block.paragraph.exec(src);
    if (cap) {
      const text2 = cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1];
      return {
        type: "paragraph",
        raw: cap[0],
        text: text2,
        tokens: this.lexer.inline(text2)
      };
    }
  }
  text(src) {
    const cap = this.rules.block.text.exec(src);
    if (cap) {
      return {
        type: "text",
        raw: cap[0],
        text: cap[0],
        tokens: this.lexer.inline(cap[0])
      };
    }
  }
  escape(src) {
    const cap = this.rules.inline.escape.exec(src);
    if (cap) {
      return {
        type: "escape",
        raw: cap[0],
        text: cap[1]
      };
    }
  }
  tag(src) {
    const cap = this.rules.inline.tag.exec(src);
    if (cap) {
      if (!this.lexer.state.inLink && this.rules.other.startATag.test(cap[0])) {
        this.lexer.state.inLink = true;
      } else if (this.lexer.state.inLink && this.rules.other.endATag.test(cap[0])) {
        this.lexer.state.inLink = false;
      }
      if (!this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(cap[0])) {
        this.lexer.state.inRawBlock = true;
      } else if (this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(cap[0])) {
        this.lexer.state.inRawBlock = false;
      }
      return {
        type: "html",
        raw: cap[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: false,
        text: cap[0]
      };
    }
  }
  link(src) {
    const cap = this.rules.inline.link.exec(src);
    if (cap) {
      const trimmedUrl = cap[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(trimmedUrl)) {
        if (!this.rules.other.endAngleBracket.test(trimmedUrl)) {
          return;
        }
        const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
        if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
          return;
        }
      } else {
        const lastParenIndex = findClosingBracket(cap[2], "()");
        if (lastParenIndex === -2) {
          return;
        }
        if (lastParenIndex > -1) {
          const start = cap[0].indexOf("!") === 0 ? 5 : 4;
          const linkLen = start + cap[1].length + lastParenIndex;
          cap[2] = cap[2].substring(0, lastParenIndex);
          cap[0] = cap[0].substring(0, linkLen).trim();
          cap[3] = "";
        }
      }
      let href = cap[2];
      let title = "";
      if (this.options.pedantic) {
        const link2 = this.rules.other.pedanticHrefTitle.exec(href);
        if (link2) {
          href = link2[1];
          title = link2[3];
        }
      } else {
        title = cap[3] ? cap[3].slice(1, -1) : "";
      }
      href = href.trim();
      if (this.rules.other.startAngleBracket.test(href)) {
        if (this.options.pedantic && !this.rules.other.endAngleBracket.test(trimmedUrl)) {
          href = href.slice(1);
        } else {
          href = href.slice(1, -1);
        }
      }
      return outputLink(cap, {
        href: href ? href.replace(this.rules.inline.anyPunctuation, "$1") : href,
        title: title ? title.replace(this.rules.inline.anyPunctuation, "$1") : title
      }, cap[0], this.lexer, this.rules);
    }
  }
  reflink(src, links) {
    let cap;
    if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
      const linkString = (cap[2] || cap[1]).replace(this.rules.other.multipleSpaceGlobal, " ");
      const link2 = links[linkString.toLowerCase()];
      if (!link2) {
        const text2 = cap[0].charAt(0);
        return {
          type: "text",
          raw: text2,
          text: text2
        };
      }
      return outputLink(cap, link2, cap[0], this.lexer, this.rules);
    }
  }
  emStrong(src, maskedSrc, prevChar = "") {
    let match = this.rules.inline.emStrongLDelim.exec(src);
    if (!match) return;
    if (match[3] && prevChar.match(this.rules.other.unicodeAlphaNumeric)) return;
    const nextChar = match[1] || match[2] || "";
    if (!nextChar || !prevChar || this.rules.inline.punctuation.exec(prevChar)) {
      const lLength = [...match[0]].length - 1;
      let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
      const endReg = match[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      endReg.lastIndex = 0;
      maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
      while ((match = endReg.exec(maskedSrc)) != null) {
        rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
        if (!rDelim) continue;
        rLength = [...rDelim].length;
        if (match[3] || match[4]) {
          delimTotal += rLength;
          continue;
        } else if (match[5] || match[6]) {
          if (lLength % 3 && !((lLength + rLength) % 3)) {
            midDelimTotal += rLength;
            continue;
          }
        }
        delimTotal -= rLength;
        if (delimTotal > 0) continue;
        rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
        const lastCharLength = [...match[0]][0].length;
        const raw = src.slice(0, lLength + match.index + lastCharLength + rLength);
        if (Math.min(lLength, rLength) % 2) {
          const text22 = raw.slice(1, -1);
          return {
            type: "em",
            raw,
            text: text22,
            tokens: this.lexer.inlineTokens(text22)
          };
        }
        const text2 = raw.slice(2, -2);
        return {
          type: "strong",
          raw,
          text: text2,
          tokens: this.lexer.inlineTokens(text2)
        };
      }
    }
  }
  codespan(src) {
    const cap = this.rules.inline.code.exec(src);
    if (cap) {
      let text2 = cap[2].replace(this.rules.other.newLineCharGlobal, " ");
      const hasNonSpaceChars = this.rules.other.nonSpaceChar.test(text2);
      const hasSpaceCharsOnBothEnds = this.rules.other.startingSpaceChar.test(text2) && this.rules.other.endingSpaceChar.test(text2);
      if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
        text2 = text2.substring(1, text2.length - 1);
      }
      return {
        type: "codespan",
        raw: cap[0],
        text: text2
      };
    }
  }
  br(src) {
    const cap = this.rules.inline.br.exec(src);
    if (cap) {
      return {
        type: "br",
        raw: cap[0]
      };
    }
  }
  del(src) {
    const cap = this.rules.inline.del.exec(src);
    if (cap) {
      return {
        type: "del",
        raw: cap[0],
        text: cap[2],
        tokens: this.lexer.inlineTokens(cap[2])
      };
    }
  }
  autolink(src) {
    const cap = this.rules.inline.autolink.exec(src);
    if (cap) {
      let text2, href;
      if (cap[2] === "@") {
        text2 = cap[1];
        href = "mailto:" + text2;
      } else {
        text2 = cap[1];
        href = text2;
      }
      return {
        type: "link",
        raw: cap[0],
        text: text2,
        href,
        tokens: [
          {
            type: "text",
            raw: text2,
            text: text2
          }
        ]
      };
    }
  }
  url(src) {
    var _a2, _b;
    let cap;
    if (cap = this.rules.inline.url.exec(src)) {
      let text2, href;
      if (cap[2] === "@") {
        text2 = cap[0];
        href = "mailto:" + text2;
      } else {
        let prevCapZero;
        do {
          prevCapZero = cap[0];
          cap[0] = (_b = (_a2 = this.rules.inline._backpedal.exec(cap[0])) == null ? void 0 : _a2[0]) != null ? _b : "";
        } while (prevCapZero !== cap[0]);
        text2 = cap[0];
        if (cap[1] === "www.") {
          href = "http://" + cap[0];
        } else {
          href = cap[0];
        }
      }
      return {
        type: "link",
        raw: cap[0],
        text: text2,
        href,
        tokens: [
          {
            type: "text",
            raw: text2,
            text: text2
          }
        ]
      };
    }
  }
  inlineText(src) {
    const cap = this.rules.inline.text.exec(src);
    if (cap) {
      const escaped = this.lexer.state.inRawBlock;
      return {
        type: "text",
        raw: cap[0],
        text: cap[0],
        escaped
      };
    }
  }
};
var _Lexer = class __Lexer {
  constructor(options22) {
    __publicField(this, "tokens");
    __publicField(this, "options");
    __publicField(this, "state");
    __publicField(this, "tokenizer");
    __publicField(this, "inlineQueue");
    this.tokens = [];
    this.tokens.links = /* @__PURE__ */ Object.create(null);
    this.options = options22 || _defaults;
    this.options.tokenizer = this.options.tokenizer || new _Tokenizer();
    this.tokenizer = this.options.tokenizer;
    this.tokenizer.options = this.options;
    this.tokenizer.lexer = this;
    this.inlineQueue = [];
    this.state = {
      inLink: false,
      inRawBlock: false,
      top: true
    };
    const rules = {
      other,
      block: block.normal,
      inline: inline.normal
    };
    if (this.options.pedantic) {
      rules.block = block.pedantic;
      rules.inline = inline.pedantic;
    } else if (this.options.gfm) {
      rules.block = block.gfm;
      if (this.options.breaks) {
        rules.inline = inline.breaks;
      } else {
        rules.inline = inline.gfm;
      }
    }
    this.tokenizer.rules = rules;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block,
      inline
    };
  }
  /**
   * Static Lex Method
   */
  static lex(src, options22) {
    const lexer2 = new __Lexer(options22);
    return lexer2.lex(src);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(src, options22) {
    const lexer2 = new __Lexer(options22);
    return lexer2.inlineTokens(src);
  }
  /**
   * Preprocessing
   */
  lex(src) {
    src = src.replace(other.carriageReturn, "\n");
    this.blockTokens(src, this.tokens);
    for (let i = 0; i < this.inlineQueue.length; i++) {
      const next = this.inlineQueue[i];
      this.inlineTokens(next.src, next.tokens);
    }
    this.inlineQueue = [];
    return this.tokens;
  }
  blockTokens(src, tokens = [], lastParagraphClipped = false) {
    var _a2, _b, _c;
    if (this.options.pedantic) {
      src = src.replace(other.tabCharGlobal, "    ").replace(other.spaceLine, "");
    }
    while (src) {
      let token;
      if ((_b = (_a2 = this.options.extensions) == null ? void 0 : _a2.block) == null ? void 0 : _b.some((extTokenizer) => {
        if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          return true;
        }
        return false;
      })) {
        continue;
      }
      if (token = this.tokenizer.space(src)) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        if (token.raw.length === 1 && lastToken !== void 0) {
          lastToken.raw += "\n";
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.code(src)) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        if ((lastToken == null ? void 0 : lastToken.type) === "paragraph" || (lastToken == null ? void 0 : lastToken.type) === "text") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue.at(-1).src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.fences(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.heading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.hr(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.blockquote(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.list(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.html(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.def(src)) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        if ((lastToken == null ? void 0 : lastToken.type) === "paragraph" || (lastToken == null ? void 0 : lastToken.type) === "text") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.raw;
          this.inlineQueue.at(-1).src = lastToken.text;
        } else if (!this.tokens.links[token.tag]) {
          this.tokens.links[token.tag] = {
            href: token.href,
            title: token.title
          };
        }
        continue;
      }
      if (token = this.tokenizer.table(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.lheading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      let cutSrc = src;
      if ((_c = this.options.extensions) == null ? void 0 : _c.startBlock) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startBlock.forEach((getStartIndex) => {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === "number" && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
        const lastToken = tokens.at(-1);
        if (lastParagraphClipped && (lastToken == null ? void 0 : lastToken.type) === "paragraph") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue.pop();
          this.inlineQueue.at(-1).src = lastToken.text;
        } else {
          tokens.push(token);
        }
        lastParagraphClipped = cutSrc.length !== src.length;
        src = src.substring(token.raw.length);
        continue;
      }
      if (token = this.tokenizer.text(src)) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        if ((lastToken == null ? void 0 : lastToken.type) === "text") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue.pop();
          this.inlineQueue.at(-1).src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (src) {
        const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }
    this.state.top = true;
    return tokens;
  }
  inline(src, tokens = []) {
    this.inlineQueue.push({ src, tokens });
    return tokens;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(src, tokens = []) {
    var _a2, _b, _c;
    let maskedSrc = src;
    let match = null;
    if (this.tokens.links) {
      const links = Object.keys(this.tokens.links);
      if (links.length > 0) {
        while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
          if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) {
            maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
          }
        }
      }
    }
    while ((match = this.tokenizer.rules.inline.anyPunctuation.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + "++" + maskedSrc.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    }
    while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    }
    let keepPrevChar = false;
    let prevChar = "";
    while (src) {
      if (!keepPrevChar) {
        prevChar = "";
      }
      keepPrevChar = false;
      let token;
      if ((_b = (_a2 = this.options.extensions) == null ? void 0 : _a2.inline) == null ? void 0 : _b.some((extTokenizer) => {
        if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          return true;
        }
        return false;
      })) {
        continue;
      }
      if (token = this.tokenizer.escape(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.tag(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.link(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.reflink(src, this.tokens.links)) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        if (token.type === "text" && (lastToken == null ? void 0 : lastToken.type) === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.codespan(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.br(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.del(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.autolink(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (!this.state.inLink && (token = this.tokenizer.url(src))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      let cutSrc = src;
      if ((_c = this.options.extensions) == null ? void 0 : _c.startInline) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startInline.forEach((getStartIndex) => {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === "number" && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (token = this.tokenizer.inlineText(cutSrc)) {
        src = src.substring(token.raw.length);
        if (token.raw.slice(-1) !== "_") {
          prevChar = token.raw.slice(-1);
        }
        keepPrevChar = true;
        const lastToken = tokens.at(-1);
        if ((lastToken == null ? void 0 : lastToken.type) === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (src) {
        const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }
    return tokens;
  }
};
var _Renderer = class {
  // set by the parser
  constructor(options22) {
    __publicField(this, "options");
    __publicField(this, "parser");
    this.options = options22 || _defaults;
  }
  space(token) {
    return "";
  }
  code({ text: text2, lang, escaped }) {
    var _a2;
    const langString = (_a2 = (lang || "").match(other.notSpaceStart)) == null ? void 0 : _a2[0];
    const code = text2.replace(other.endingNewline, "") + "\n";
    if (!langString) {
      return "<pre><code>" + (escaped ? code : escape22(code, true)) + "</code></pre>\n";
    }
    return '<pre><code class="language-' + escape22(langString) + '">' + (escaped ? code : escape22(code, true)) + "</code></pre>\n";
  }
  blockquote({ tokens }) {
    const body = this.parser.parse(tokens);
    return `<blockquote>
${body}</blockquote>
`;
  }
  html({ text: text2 }) {
    return text2;
  }
  heading({ tokens, depth }) {
    return `<h${depth}>${this.parser.parseInline(tokens)}</h${depth}>
`;
  }
  hr(token) {
    return "<hr>\n";
  }
  list(token) {
    const ordered = token.ordered;
    const start = token.start;
    let body = "";
    for (let j = 0; j < token.items.length; j++) {
      const item = token.items[j];
      body += this.listitem(item);
    }
    const type = ordered ? "ol" : "ul";
    const startAttr = ordered && start !== 1 ? ' start="' + start + '"' : "";
    return "<" + type + startAttr + ">\n" + body + "</" + type + ">\n";
  }
  listitem(item) {
    var _a2;
    let itemBody = "";
    if (item.task) {
      const checkbox = this.checkbox({ checked: !!item.checked });
      if (item.loose) {
        if (((_a2 = item.tokens[0]) == null ? void 0 : _a2.type) === "paragraph") {
          item.tokens[0].text = checkbox + " " + item.tokens[0].text;
          if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
            item.tokens[0].tokens[0].text = checkbox + " " + escape22(item.tokens[0].tokens[0].text);
            item.tokens[0].tokens[0].escaped = true;
          }
        } else {
          item.tokens.unshift({
            type: "text",
            raw: checkbox + " ",
            text: checkbox + " ",
            escaped: true
          });
        }
      } else {
        itemBody += checkbox + " ";
      }
    }
    itemBody += this.parser.parse(item.tokens, !!item.loose);
    return `<li>${itemBody}</li>
`;
  }
  checkbox({ checked }) {
    return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens }) {
    return `<p>${this.parser.parseInline(tokens)}</p>
`;
  }
  table(token) {
    let header = "";
    let cell = "";
    for (let j = 0; j < token.header.length; j++) {
      cell += this.tablecell(token.header[j]);
    }
    header += this.tablerow({ text: cell });
    let body = "";
    for (let j = 0; j < token.rows.length; j++) {
      const row = token.rows[j];
      cell = "";
      for (let k = 0; k < row.length; k++) {
        cell += this.tablecell(row[k]);
      }
      body += this.tablerow({ text: cell });
    }
    if (body) body = `<tbody>${body}</tbody>`;
    return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
  }
  tablerow({ text: text2 }) {
    return `<tr>
${text2}</tr>
`;
  }
  tablecell(token) {
    const content = this.parser.parseInline(token.tokens);
    const type = token.header ? "th" : "td";
    const tag2 = token.align ? `<${type} align="${token.align}">` : `<${type}>`;
    return tag2 + content + `</${type}>
`;
  }
  /**
   * span level renderer
   */
  strong({ tokens }) {
    return `<strong>${this.parser.parseInline(tokens)}</strong>`;
  }
  em({ tokens }) {
    return `<em>${this.parser.parseInline(tokens)}</em>`;
  }
  codespan({ text: text2 }) {
    return `<code>${escape22(text2, true)}</code>`;
  }
  br(token) {
    return "<br>";
  }
  del({ tokens }) {
    return `<del>${this.parser.parseInline(tokens)}</del>`;
  }
  link({ href, title, tokens }) {
    const text2 = this.parser.parseInline(tokens);
    const cleanHref = cleanUrl(href);
    if (cleanHref === null) {
      return text2;
    }
    href = cleanHref;
    let out = '<a href="' + href + '"';
    if (title) {
      out += ' title="' + escape22(title) + '"';
    }
    out += ">" + text2 + "</a>";
    return out;
  }
  image({ href, title, text: text2, tokens }) {
    if (tokens) {
      text2 = this.parser.parseInline(tokens, this.parser.textRenderer);
    }
    const cleanHref = cleanUrl(href);
    if (cleanHref === null) {
      return escape22(text2);
    }
    href = cleanHref;
    let out = `<img src="${href}" alt="${text2}"`;
    if (title) {
      out += ` title="${escape22(title)}"`;
    }
    out += ">";
    return out;
  }
  text(token) {
    return "tokens" in token && token.tokens ? this.parser.parseInline(token.tokens) : "escaped" in token && token.escaped ? token.text : escape22(token.text);
  }
};
var _TextRenderer = class {
  // no need for block level renderers
  strong({ text: text2 }) {
    return text2;
  }
  em({ text: text2 }) {
    return text2;
  }
  codespan({ text: text2 }) {
    return text2;
  }
  del({ text: text2 }) {
    return text2;
  }
  html({ text: text2 }) {
    return text2;
  }
  text({ text: text2 }) {
    return text2;
  }
  link({ text: text2 }) {
    return "" + text2;
  }
  image({ text: text2 }) {
    return "" + text2;
  }
  br() {
    return "";
  }
};
var _Parser = class __Parser {
  constructor(options22) {
    __publicField(this, "options");
    __publicField(this, "renderer");
    __publicField(this, "textRenderer");
    this.options = options22 || _defaults;
    this.options.renderer = this.options.renderer || new _Renderer();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
    this.renderer.parser = this;
    this.textRenderer = new _TextRenderer();
  }
  /**
   * Static Parse Method
   */
  static parse(tokens, options22) {
    const parser2 = new __Parser(options22);
    return parser2.parse(tokens);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(tokens, options22) {
    const parser2 = new __Parser(options22);
    return parser2.parseInline(tokens);
  }
  /**
   * Parse Loop
   */
  parse(tokens, top = true) {
    var _a2, _b;
    let out = "";
    for (let i = 0; i < tokens.length; i++) {
      const anyToken = tokens[i];
      if ((_b = (_a2 = this.options.extensions) == null ? void 0 : _a2.renderers) == null ? void 0 : _b[anyToken.type]) {
        const genericToken = anyToken;
        const ret = this.options.extensions.renderers[genericToken.type].call({ parser: this }, genericToken);
        if (ret !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(genericToken.type)) {
          out += ret || "";
          continue;
        }
      }
      const token = anyToken;
      switch (token.type) {
        case "space": {
          out += this.renderer.space(token);
          continue;
        }
        case "hr": {
          out += this.renderer.hr(token);
          continue;
        }
        case "heading": {
          out += this.renderer.heading(token);
          continue;
        }
        case "code": {
          out += this.renderer.code(token);
          continue;
        }
        case "table": {
          out += this.renderer.table(token);
          continue;
        }
        case "blockquote": {
          out += this.renderer.blockquote(token);
          continue;
        }
        case "list": {
          out += this.renderer.list(token);
          continue;
        }
        case "html": {
          out += this.renderer.html(token);
          continue;
        }
        case "paragraph": {
          out += this.renderer.paragraph(token);
          continue;
        }
        case "text": {
          let textToken = token;
          let body = this.renderer.text(textToken);
          while (i + 1 < tokens.length && tokens[i + 1].type === "text") {
            textToken = tokens[++i];
            body += "\n" + this.renderer.text(textToken);
          }
          if (top) {
            out += this.renderer.paragraph({
              type: "paragraph",
              raw: body,
              text: body,
              tokens: [{ type: "text", raw: body, text: body, escaped: true }]
            });
          } else {
            out += body;
          }
          continue;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return "";
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(tokens, renderer = this.renderer) {
    var _a2, _b;
    let out = "";
    for (let i = 0; i < tokens.length; i++) {
      const anyToken = tokens[i];
      if ((_b = (_a2 = this.options.extensions) == null ? void 0 : _a2.renderers) == null ? void 0 : _b[anyToken.type]) {
        const ret = this.options.extensions.renderers[anyToken.type].call({ parser: this }, anyToken);
        if (ret !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(anyToken.type)) {
          out += ret || "";
          continue;
        }
      }
      const token = anyToken;
      switch (token.type) {
        case "escape": {
          out += renderer.text(token);
          break;
        }
        case "html": {
          out += renderer.html(token);
          break;
        }
        case "link": {
          out += renderer.link(token);
          break;
        }
        case "image": {
          out += renderer.image(token);
          break;
        }
        case "strong": {
          out += renderer.strong(token);
          break;
        }
        case "em": {
          out += renderer.em(token);
          break;
        }
        case "codespan": {
          out += renderer.codespan(token);
          break;
        }
        case "br": {
          out += renderer.br(token);
          break;
        }
        case "del": {
          out += renderer.del(token);
          break;
        }
        case "text": {
          out += renderer.text(token);
          break;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return "";
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
};
var _a;
var _Hooks = (_a = class {
  constructor(options22) {
    __publicField(this, "options");
    __publicField(this, "block");
    this.options = options22 || _defaults;
  }
  /**
   * Process markdown before marked
   */
  preprocess(markdown) {
    return markdown;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(html22) {
    return html22;
  }
  /**
   * Process all tokens before walk tokens
   */
  processAllTokens(tokens) {
    return tokens;
  }
  /**
   * Provide function to tokenize markdown
   */
  provideLexer() {
    return this.block ? _Lexer.lex : _Lexer.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? _Parser.parse : _Parser.parseInline;
  }
}, __publicField(_a, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
])), _a);
var Marked = class {
  constructor(...args) {
    __publicField(this, "defaults", _getDefaults());
    __publicField(this, "options", this.setOptions);
    __publicField(this, "parse", this.parseMarkdown(true));
    __publicField(this, "parseInline", this.parseMarkdown(false));
    __publicField(this, "Parser", _Parser);
    __publicField(this, "Renderer", _Renderer);
    __publicField(this, "TextRenderer", _TextRenderer);
    __publicField(this, "Lexer", _Lexer);
    __publicField(this, "Tokenizer", _Tokenizer);
    __publicField(this, "Hooks", _Hooks);
    this.use(...args);
  }
  /**
   * Run callback for every token
   */
  walkTokens(tokens, callback) {
    var _a2, _b;
    let values = [];
    for (const token of tokens) {
      values = values.concat(callback.call(this, token));
      switch (token.type) {
        case "table": {
          const tableToken = token;
          for (const cell of tableToken.header) {
            values = values.concat(this.walkTokens(cell.tokens, callback));
          }
          for (const row of tableToken.rows) {
            for (const cell of row) {
              values = values.concat(this.walkTokens(cell.tokens, callback));
            }
          }
          break;
        }
        case "list": {
          const listToken = token;
          values = values.concat(this.walkTokens(listToken.items, callback));
          break;
        }
        default: {
          const genericToken = token;
          if ((_b = (_a2 = this.defaults.extensions) == null ? void 0 : _a2.childTokens) == null ? void 0 : _b[genericToken.type]) {
            this.defaults.extensions.childTokens[genericToken.type].forEach((childTokens) => {
              const tokens2 = genericToken[childTokens].flat(Infinity);
              values = values.concat(this.walkTokens(tokens2, callback));
            });
          } else if (genericToken.tokens) {
            values = values.concat(this.walkTokens(genericToken.tokens, callback));
          }
        }
      }
    }
    return values;
  }
  use(...args) {
    const extensions = this.defaults.extensions || { renderers: {}, childTokens: {} };
    args.forEach((pack) => {
      const opts = { ...pack };
      opts.async = this.defaults.async || opts.async || false;
      if (pack.extensions) {
        pack.extensions.forEach((ext) => {
          if (!ext.name) {
            throw new Error("extension name required");
          }
          if ("renderer" in ext) {
            const prevRenderer = extensions.renderers[ext.name];
            if (prevRenderer) {
              extensions.renderers[ext.name] = function(...args2) {
                let ret = ext.renderer.apply(this, args2);
                if (ret === false) {
                  ret = prevRenderer.apply(this, args2);
                }
                return ret;
              };
            } else {
              extensions.renderers[ext.name] = ext.renderer;
            }
          }
          if ("tokenizer" in ext) {
            if (!ext.level || ext.level !== "block" && ext.level !== "inline") {
              throw new Error("extension level must be 'block' or 'inline'");
            }
            const extLevel = extensions[ext.level];
            if (extLevel) {
              extLevel.unshift(ext.tokenizer);
            } else {
              extensions[ext.level] = [ext.tokenizer];
            }
            if (ext.start) {
              if (ext.level === "block") {
                if (extensions.startBlock) {
                  extensions.startBlock.push(ext.start);
                } else {
                  extensions.startBlock = [ext.start];
                }
              } else if (ext.level === "inline") {
                if (extensions.startInline) {
                  extensions.startInline.push(ext.start);
                } else {
                  extensions.startInline = [ext.start];
                }
              }
            }
          }
          if ("childTokens" in ext && ext.childTokens) {
            extensions.childTokens[ext.name] = ext.childTokens;
          }
        });
        opts.extensions = extensions;
      }
      if (pack.renderer) {
        const renderer = this.defaults.renderer || new _Renderer(this.defaults);
        for (const prop in pack.renderer) {
          if (!(prop in renderer)) {
            throw new Error(`renderer '${prop}' does not exist`);
          }
          if (["options", "parser"].includes(prop)) {
            continue;
          }
          const rendererProp = prop;
          const rendererFunc = pack.renderer[rendererProp];
          const prevRenderer = renderer[rendererProp];
          renderer[rendererProp] = (...args2) => {
            let ret = rendererFunc.apply(renderer, args2);
            if (ret === false) {
              ret = prevRenderer.apply(renderer, args2);
            }
            return ret || "";
          };
        }
        opts.renderer = renderer;
      }
      if (pack.tokenizer) {
        const tokenizer = this.defaults.tokenizer || new _Tokenizer(this.defaults);
        for (const prop in pack.tokenizer) {
          if (!(prop in tokenizer)) {
            throw new Error(`tokenizer '${prop}' does not exist`);
          }
          if (["options", "rules", "lexer"].includes(prop)) {
            continue;
          }
          const tokenizerProp = prop;
          const tokenizerFunc = pack.tokenizer[tokenizerProp];
          const prevTokenizer = tokenizer[tokenizerProp];
          tokenizer[tokenizerProp] = (...args2) => {
            let ret = tokenizerFunc.apply(tokenizer, args2);
            if (ret === false) {
              ret = prevTokenizer.apply(tokenizer, args2);
            }
            return ret;
          };
        }
        opts.tokenizer = tokenizer;
      }
      if (pack.hooks) {
        const hooks = this.defaults.hooks || new _Hooks();
        for (const prop in pack.hooks) {
          if (!(prop in hooks)) {
            throw new Error(`hook '${prop}' does not exist`);
          }
          if (["options", "block"].includes(prop)) {
            continue;
          }
          const hooksProp = prop;
          const hooksFunc = pack.hooks[hooksProp];
          const prevHook = hooks[hooksProp];
          if (_Hooks.passThroughHooks.has(prop)) {
            hooks[hooksProp] = (arg) => {
              if (this.defaults.async) {
                return Promise.resolve(hooksFunc.call(hooks, arg)).then((ret2) => {
                  return prevHook.call(hooks, ret2);
                });
              }
              const ret = hooksFunc.call(hooks, arg);
              return prevHook.call(hooks, ret);
            };
          } else {
            hooks[hooksProp] = (...args2) => {
              let ret = hooksFunc.apply(hooks, args2);
              if (ret === false) {
                ret = prevHook.apply(hooks, args2);
              }
              return ret;
            };
          }
        }
        opts.hooks = hooks;
      }
      if (pack.walkTokens) {
        const walkTokens2 = this.defaults.walkTokens;
        const packWalktokens = pack.walkTokens;
        opts.walkTokens = function(token) {
          let values = [];
          values.push(packWalktokens.call(this, token));
          if (walkTokens2) {
            values = values.concat(walkTokens2.call(this, token));
          }
          return values;
        };
      }
      this.defaults = { ...this.defaults, ...opts };
    });
    return this;
  }
  setOptions(opt) {
    this.defaults = { ...this.defaults, ...opt };
    return this;
  }
  lexer(src, options22) {
    return _Lexer.lex(src, options22 != null ? options22 : this.defaults);
  }
  parser(tokens, options22) {
    return _Parser.parse(tokens, options22 != null ? options22 : this.defaults);
  }
  parseMarkdown(blockType) {
    const parse2 = (src, options22) => {
      const origOpt = { ...options22 };
      const opt = { ...this.defaults, ...origOpt };
      const throwError = this.onError(!!opt.silent, !!opt.async);
      if (this.defaults.async === true && origOpt.async === false) {
        return throwError(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      }
      if (typeof src === "undefined" || src === null) {
        return throwError(new Error("marked(): input parameter is undefined or null"));
      }
      if (typeof src !== "string") {
        return throwError(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected"));
      }
      if (opt.hooks) {
        opt.hooks.options = opt;
        opt.hooks.block = blockType;
      }
      const lexer2 = opt.hooks ? opt.hooks.provideLexer() : blockType ? _Lexer.lex : _Lexer.lexInline;
      const parser2 = opt.hooks ? opt.hooks.provideParser() : blockType ? _Parser.parse : _Parser.parseInline;
      if (opt.async) {
        return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src).then((src2) => lexer2(src2, opt)).then((tokens) => opt.hooks ? opt.hooks.processAllTokens(tokens) : tokens).then((tokens) => opt.walkTokens ? Promise.all(this.walkTokens(tokens, opt.walkTokens)).then(() => tokens) : tokens).then((tokens) => parser2(tokens, opt)).then((html22) => opt.hooks ? opt.hooks.postprocess(html22) : html22).catch(throwError);
      }
      try {
        if (opt.hooks) {
          src = opt.hooks.preprocess(src);
        }
        let tokens = lexer2(src, opt);
        if (opt.hooks) {
          tokens = opt.hooks.processAllTokens(tokens);
        }
        if (opt.walkTokens) {
          this.walkTokens(tokens, opt.walkTokens);
        }
        let html22 = parser2(tokens, opt);
        if (opt.hooks) {
          html22 = opt.hooks.postprocess(html22);
        }
        return html22;
      } catch (e2) {
        return throwError(e2);
      }
    };
    return parse2;
  }
  onError(silent, async) {
    return (e2) => {
      e2.message += "\nPlease report this to https://github.com/markedjs/marked.";
      if (silent) {
        const msg = "<p>An error occurred:</p><pre>" + escape22(e2.message + "", true) + "</pre>";
        if (async) {
          return Promise.resolve(msg);
        }
        return msg;
      }
      if (async) {
        return Promise.reject(e2);
      }
      throw e2;
    };
  }
};
var markedInstance = new Marked();
function marked(src, opt) {
  return markedInstance.parse(src, opt);
}
marked.options = marked.setOptions = function(options22) {
  markedInstance.setOptions(options22);
  marked.defaults = markedInstance.defaults;
  changeDefaults(marked.defaults);
  return marked;
};
marked.getDefaults = _getDefaults;
marked.defaults = _defaults;
marked.use = function(...args) {
  markedInstance.use(...args);
  marked.defaults = markedInstance.defaults;
  changeDefaults(marked.defaults);
  return marked;
};
marked.walkTokens = function(tokens, callback) {
  return markedInstance.walkTokens(tokens, callback);
};
marked.parseInline = markedInstance.parseInline;
marked.Parser = _Parser;
marked.parser = _Parser.parse;
marked.Renderer = _Renderer;
marked.TextRenderer = _TextRenderer;
marked.Lexer = _Lexer;
marked.lexer = _Lexer.lex;
marked.Tokenizer = _Tokenizer;
marked.Hooks = _Hooks;
marked.parse = marked;
var options2 = marked.options;
var setOptions = marked.setOptions;
var use = marked.use;
var walkTokens = marked.walkTokens;
var parseInline = marked.parseInline;
var parser = _Parser.parse;
var lexer = _Lexer.lex;

// node_modules/marked-highlight/src/index.js
function markedHighlight(options3) {
  if (typeof options3 === "function") {
    options3 = {
      highlight: options3
    };
  }
  if (!options3 || typeof options3.highlight !== "function") {
    throw new Error("Must provide highlight function");
  }
  if (typeof options3.langPrefix !== "string") {
    options3.langPrefix = "language-";
  }
  if (typeof options3.emptyLangClass !== "string") {
    options3.emptyLangClass = "";
  }
  return {
    async: !!options3.async,
    walkTokens(token) {
      if (token.type !== "code") {
        return;
      }
      const lang = getLang(token.lang);
      if (options3.async) {
        return Promise.resolve(options3.highlight(token.text, lang, token.lang || "")).then(updateToken(token));
      }
      const code = options3.highlight(token.text, lang, token.lang || "");
      if (code instanceof Promise) {
        throw new Error("markedHighlight is not set to async but the highlight function is async. Set the async option to true on markedHighlight to await the async highlight function.");
      }
      updateToken(token)(code);
    },
    useNewRenderer: true,
    renderer: {
      code(code, infoString, escaped) {
        if (typeof code === "object") {
          escaped = code.escaped;
          infoString = code.lang;
          code = code.text;
        }
        const lang = getLang(infoString);
        const classValue = lang ? options3.langPrefix + escape3(lang) : options3.emptyLangClass;
        const classAttr = classValue ? ` class="${classValue}"` : "";
        code = code.replace(/\n$/, "");
        return `<pre><code${classAttr}>${escaped ? code : escape3(code, true)}
</code></pre>`;
      }
    }
  };
}
function getLang(lang) {
  return (lang || "").match(/\S*/)[0];
}
function updateToken(token) {
  return (code) => {
    if (typeof code === "string" && code !== token.text) {
      token.escaped = true;
      token.text = code;
    }
  };
}
var escapeTest = /[&<>"']/;
var escapeReplace = new RegExp(escapeTest.source, "g");
var escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
var escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, "g");
var escapeReplacements2 = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
var getEscapeReplacement2 = (ch) => escapeReplacements2[ch];
function escape3(html3, encode) {
  if (encode) {
    if (escapeTest.test(html3)) {
      return html3.replace(escapeReplace, getEscapeReplacement2);
    }
  } else {
    if (escapeTestNoEncode.test(html3)) {
      return html3.replace(escapeReplaceNoEncode, getEscapeReplacement2);
    }
  }
  return html3;
}

// node_modules/highlight.js/es/core.js
var import_core = __toESM(require_core(), 1);
var core_default = import_core.default;

// node_modules/highlight.js/es/languages/json.js
function json(hljs) {
  const ATTRIBUTE = {
    className: "attr",
    begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
    relevance: 1.01
  };
  const PUNCTUATION = {
    match: /[{}[\],:]/,
    className: "punctuation",
    relevance: 0
  };
  const LITERALS = [
    "true",
    "false",
    "null"
  ];
  const LITERALS_MODE = {
    scope: "literal",
    beginKeywords: LITERALS.join(" ")
  };
  return {
    name: "JSON",
    aliases: ["jsonc"],
    keywords: {
      literal: LITERALS
    },
    contains: [
      ATTRIBUTE,
      PUNCTUATION,
      hljs.QUOTE_STRING_MODE,
      LITERALS_MODE,
      hljs.C_NUMBER_MODE,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE
    ],
    illegal: "\\S"
  };
}

// node_modules/highlight.js/es/languages/python.js
function python(hljs) {
  const regex = hljs.regex;
  const IDENT_RE = /[\p{XID_Start}_]\p{XID_Continue}*/u;
  const RESERVED_WORDS = [
    "and",
    "as",
    "assert",
    "async",
    "await",
    "break",
    "case",
    "class",
    "continue",
    "def",
    "del",
    "elif",
    "else",
    "except",
    "finally",
    "for",
    "from",
    "global",
    "if",
    "import",
    "in",
    "is",
    "lambda",
    "match",
    "nonlocal|10",
    "not",
    "or",
    "pass",
    "raise",
    "return",
    "try",
    "while",
    "with",
    "yield"
  ];
  const BUILT_INS = [
    "__import__",
    "abs",
    "all",
    "any",
    "ascii",
    "bin",
    "bool",
    "breakpoint",
    "bytearray",
    "bytes",
    "callable",
    "chr",
    "classmethod",
    "compile",
    "complex",
    "delattr",
    "dict",
    "dir",
    "divmod",
    "enumerate",
    "eval",
    "exec",
    "filter",
    "float",
    "format",
    "frozenset",
    "getattr",
    "globals",
    "hasattr",
    "hash",
    "help",
    "hex",
    "id",
    "input",
    "int",
    "isinstance",
    "issubclass",
    "iter",
    "len",
    "list",
    "locals",
    "map",
    "max",
    "memoryview",
    "min",
    "next",
    "object",
    "oct",
    "open",
    "ord",
    "pow",
    "print",
    "property",
    "range",
    "repr",
    "reversed",
    "round",
    "set",
    "setattr",
    "slice",
    "sorted",
    "staticmethod",
    "str",
    "sum",
    "super",
    "tuple",
    "type",
    "vars",
    "zip"
  ];
  const LITERALS = [
    "__debug__",
    "Ellipsis",
    "False",
    "None",
    "NotImplemented",
    "True"
  ];
  const TYPES = [
    "Any",
    "Callable",
    "Coroutine",
    "Dict",
    "List",
    "Literal",
    "Generic",
    "Optional",
    "Sequence",
    "Set",
    "Tuple",
    "Type",
    "Union"
  ];
  const KEYWORDS = {
    $pattern: /[A-Za-z]\w+|__\w+__/,
    keyword: RESERVED_WORDS,
    built_in: BUILT_INS,
    literal: LITERALS,
    type: TYPES
  };
  const PROMPT = {
    className: "meta",
    begin: /^(>>>|\.\.\.) /
  };
  const SUBST = {
    className: "subst",
    begin: /\{/,
    end: /\}/,
    keywords: KEYWORDS,
    illegal: /#/
  };
  const LITERAL_BRACKET = {
    begin: /\{\{/,
    relevance: 0
  };
  const STRING = {
    className: "string",
    contains: [hljs.BACKSLASH_ESCAPE],
    variants: [
      {
        begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
        end: /'''/,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          PROMPT
        ],
        relevance: 10
      },
      {
        begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
        end: /"""/,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          PROMPT
        ],
        relevance: 10
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])'''/,
        end: /'''/,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          PROMPT,
          LITERAL_BRACKET,
          SUBST
        ]
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])"""/,
        end: /"""/,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          PROMPT,
          LITERAL_BRACKET,
          SUBST
        ]
      },
      {
        begin: /([uU]|[rR])'/,
        end: /'/,
        relevance: 10
      },
      {
        begin: /([uU]|[rR])"/,
        end: /"/,
        relevance: 10
      },
      {
        begin: /([bB]|[bB][rR]|[rR][bB])'/,
        end: /'/
      },
      {
        begin: /([bB]|[bB][rR]|[rR][bB])"/,
        end: /"/
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])'/,
        end: /'/,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          LITERAL_BRACKET,
          SUBST
        ]
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])"/,
        end: /"/,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          LITERAL_BRACKET,
          SUBST
        ]
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE
    ]
  };
  const digitpart = "[0-9](_?[0-9])*";
  const pointfloat = `(\\b(${digitpart}))?\\.(${digitpart})|\\b(${digitpart})\\.`;
  const lookahead = `\\b|${RESERVED_WORDS.join("|")}`;
  const NUMBER = {
    className: "number",
    relevance: 0,
    variants: [
      // exponentfloat, pointfloat
      // https://docs.python.org/3.9/reference/lexical_analysis.html#floating-point-literals
      // optionally imaginary
      // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
      // Note: no leading \b because floats can start with a decimal point
      // and we don't want to mishandle e.g. `fn(.5)`,
      // no trailing \b for pointfloat because it can end with a decimal point
      // and we don't want to mishandle e.g. `0..hex()`; this should be safe
      // because both MUST contain a decimal point and so cannot be confused with
      // the interior part of an identifier
      {
        begin: `(\\b(${digitpart})|(${pointfloat}))[eE][+-]?(${digitpart})[jJ]?(?=${lookahead})`
      },
      {
        begin: `(${pointfloat})[jJ]?`
      },
      // decinteger, bininteger, octinteger, hexinteger
      // https://docs.python.org/3.9/reference/lexical_analysis.html#integer-literals
      // optionally "long" in Python 2
      // https://docs.python.org/2.7/reference/lexical_analysis.html#integer-and-long-integer-literals
      // decinteger is optionally imaginary
      // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
      {
        begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${lookahead})`
      },
      {
        begin: `\\b0[bB](_?[01])+[lL]?(?=${lookahead})`
      },
      {
        begin: `\\b0[oO](_?[0-7])+[lL]?(?=${lookahead})`
      },
      {
        begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${lookahead})`
      },
      // imagnumber (digitpart-based)
      // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
      {
        begin: `\\b(${digitpart})[jJ](?=${lookahead})`
      }
    ]
  };
  const COMMENT_TYPE = {
    className: "comment",
    begin: regex.lookahead(/# type:/),
    end: /$/,
    keywords: KEYWORDS,
    contains: [
      {
        // prevent keywords from coloring `type`
        begin: /# type:/
      },
      // comment within a datatype comment includes no keywords
      {
        begin: /#/,
        end: /\b\B/,
        endsWithParent: true
      }
    ]
  };
  const PARAMS = {
    className: "params",
    variants: [
      // Exclude params in functions without params
      {
        className: "",
        begin: /\(\s*\)/,
        skip: true
      },
      {
        begin: /\(/,
        end: /\)/,
        excludeBegin: true,
        excludeEnd: true,
        keywords: KEYWORDS,
        contains: [
          "self",
          PROMPT,
          NUMBER,
          STRING,
          hljs.HASH_COMMENT_MODE
        ]
      }
    ]
  };
  SUBST.contains = [
    STRING,
    NUMBER,
    PROMPT
  ];
  return {
    name: "Python",
    aliases: [
      "py",
      "gyp",
      "ipython"
    ],
    unicodeRegex: true,
    keywords: KEYWORDS,
    illegal: /(<\/|\?)|=>/,
    contains: [
      PROMPT,
      NUMBER,
      {
        // very common convention
        scope: "variable.language",
        match: /\bself\b/
      },
      {
        // eat "if" prior to string so that it won't accidentally be
        // labeled as an f-string
        beginKeywords: "if",
        relevance: 0
      },
      { match: /\bor\b/, scope: "keyword" },
      STRING,
      COMMENT_TYPE,
      hljs.HASH_COMMENT_MODE,
      {
        match: [
          /\bdef/,
          /\s+/,
          IDENT_RE
        ],
        scope: {
          1: "keyword",
          3: "title.function"
        },
        contains: [PARAMS]
      },
      {
        variants: [
          {
            match: [
              /\bclass/,
              /\s+/,
              IDENT_RE,
              /\s*/,
              /\(\s*/,
              IDENT_RE,
              /\s*\)/
            ]
          },
          {
            match: [
              /\bclass/,
              /\s+/,
              IDENT_RE
            ]
          }
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          6: "title.class.inherited"
        }
      },
      {
        className: "meta",
        begin: /^[\t ]*@/,
        end: /(?=#)|$/,
        contains: [
          NUMBER,
          PARAMS,
          STRING
        ]
      }
    ]
  };
}

// src_web/comfyui/common.ts
var LOG_VERBOSE = false;
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

// src_web/comfyui/markdown_utils.ts
console.log("=== MARKDOWN_UTILS_MODULE_LOADED ===");
core_default.registerLanguage("json", json);
core_default.registerLanguage("python", python);
function renderMarkdownToHtml(markdown, baseUrl) {
  console.log("=== RENDER_MARKDOWN_CALLED ===");
  console.log("RENDER_MARKDOWN_INPUT:", markdown);
  if (!markdown) {
    console.log("No markdown input, returning empty string");
    return "";
  }
  const markdownStr = Array.isArray(markdown) ? markdown.join("") : markdown;
  console.log("RENDER_MARKDOWN_STR:", markdownStr);
  const renderer = new _Renderer();
  const originalImage = renderer.image;
  renderer.image = ({ href, title, text: text2 }) => {
    let src = href;
    if (baseUrl && !/^(?:\/|https?:\/\/)/.test(href)) {
      src = `${baseUrl.replace(/\/+$/, "")}/${href}`;
    }
    const titleAttr = title ? ` title="${title}"` : "";
    return `<img src="${src}" alt="${text2}"${titleAttr} />`;
  };
  console.log("CUSTOM_IMAGE_RENDERER_REGISTERED");
  const markedInstance2 = new Marked({ renderer });
  if (typeof window !== "undefined") {
    window.markedInstance = markedInstance2;
  }
  console.log("MARKED_INSTANCE_CREATED", markedInstance2);
  markedInstance2.use(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight(code, lang) {
        console.log("=== HIGHLIGHT_FN_CALLED ===", { code, lang });
        let codeToHighlight = code;
        if (lang === "json") {
          try {
            const jsonObj = JSON.parse(code);
            codeToHighlight = JSON.stringify(jsonObj, null, 2);
            console.log("[highlight] pretty-printed JSON:", codeToHighlight);
          } catch (e2) {
            console.log("[highlight] Failed to parse JSON, using as-is.");
          }
        }
        const language = core_default.getLanguage(lang) ? lang : "plaintext";
        const highlighted = core_default.highlight(codeToHighlight, { language }).value;
        console.log("[highlight] highlighted output:", highlighted);
        return highlighted;
      }
    })
  );
  console.log("MARKED_HIGHLIGHT_PLUGIN_REGISTERED");
  console.log("About to parse markdown:", markdownStr);
  let html3 = markedInstance2.parse(markdownStr);
  console.log("MARKED_OUTPUT:", html3);
  if (baseUrl) {
    html3 = html3.replace(MEDIA_SRC_REGEX, `$1${baseUrl}$2$3`);
  }
  const sanitized = purify.sanitize(html3, {
    ADD_TAGS: ALLOWED_TAGS,
    ADD_ATTR: ALLOWED_ATTRS
  });
  console.log("SANITIZED_OUTPUT:", sanitized);
  return sanitized;
}

// src_web/comfyui/markdown_widget.ts
console.log("=== MARKDOWN_WIDGET_MODULE_LOADED ===");
function createMarkdownWidget(node2, config) {
  console.log("=== CREATE_MARKDOWN_WIDGET_CALLED ===", config);
  const {
    widgetName = "markdown_widget",
    isEditable = false,
    initialContent = "",
    htmlContent = "",
    sourceText = "",
    onContentChange = null
  } = config;
  let textWidget = ComfyWidgets.STRING(
    node2,
    "text",
    ["STRING", { hidden: true }],
    app
  ).widget;
  textWidget.value = initialContent;
  textWidget.draw = () => {
  };
  textWidget.computeLayoutSize = () => {
    return {
      minHeight: 0,
      maxHeight: 0,
      minWidth: 0,
      maxWidth: 0
    };
  };
  const originalCallback = textWidget.callback;
  textWidget.callback = function(v2) {
    if (originalCallback) originalCallback.call(this, v2);
    if (onContentChange) onContentChange(v2);
    node2._editableContent = v2;
    if (!node2.properties) node2.properties = {};
    node2.properties.text = v2;
    node2.properties.markdown_editor = v2;
  };
  const mainContainer = document.createElement("div");
  mainContainer.classList.add("storyboard-main-container");
  mainContainer.style.position = "relative";
  mainContainer.style.width = "100%";
  mainContainer.style.height = "100%";
  mainContainer.style.minWidth = "150px";
  mainContainer.style.minHeight = "60px";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.boxSizing = "border-box";
  mainContainer.style.overflow = "hidden";
  mainContainer.addEventListener("click", (e2) => {
    e2.stopPropagation();
  });
  const toolbar = document.createElement("div");
  toolbar.className = "markdown-editor-toolbar";
  toolbar.style.flex = "0 0 auto";
  toolbar.style.background = "#141414";
  toolbar.style.borderBottom = "1px solid #444";
  const charCount = document.createElement("div");
  charCount.className = "markdown-char-count";
  const toggleGroup = document.createElement("div");
  toggleGroup.className = "markdown-toggle-group";
  const markdownButton = document.createElement("button");
  markdownButton.className = "markdown-editor-button active";
  markdownButton.textContent = "MD";
  const textButton = document.createElement("button");
  textButton.className = "markdown-editor-button";
  textButton.textContent = "Text";
  const container = document.createElement("div");
  container.className = "markdown-content";
  container.style.flex = "1 1 0";
  container.style.height = "100%";
  container.style.minHeight = "60px";
  container.style.overflow = "auto";
  container.innerHTML = htmlContent || renderMarkdownToHtml(initialContent);
  const textarea = document.createElement("textarea");
  textarea.className = "markdown-editor-textarea";
  textarea.style.display = "none";
  textarea.style.flex = "1 1 0";
  textarea.style.height = "100%";
  textarea.style.minHeight = "60px";
  textarea.style.width = "100%";
  textarea.readOnly = !isEditable;
  textarea.placeholder = isEditable ? "Enter your markdown content here..." : "Source markdown from connected input...";
  textarea.value = sourceText || initialContent;
  let isSourceMode = false;
  let currentContent = initialContent;
  const updateCharCount = () => {
    const text2 = currentContent || "";
    charCount.textContent = `${text2.length} chars`;
  };
  updateCharCount();
  function showMarkdown() {
    container.style.display = "block";
    textarea.style.display = "none";
    markdownButton.classList.add("active");
    textButton.classList.remove("active");
    isSourceMode = false;
    if (isEditable) {
      container.innerHTML = renderMarkdownToHtml(currentContent);
    }
    updateCharCount();
  }
  function showText() {
    textarea.style.display = "block";
    container.style.display = "none";
    textButton.classList.add("active");
    markdownButton.classList.remove("active");
    isSourceMode = true;
    updateCharCount();
    setTimeout(() => textarea.focus(), 0);
  }
  markdownButton.addEventListener("click", (e2) => {
    e2.stopPropagation();
    if (isSourceMode) {
      showMarkdown();
    } else {
      showText();
    }
  });
  textButton.addEventListener("click", (e2) => {
    e2.stopPropagation();
    if (isSourceMode) {
      showMarkdown();
    } else {
      showText();
    }
  });
  const warningIndicator = document.createElement("div");
  warningIndicator.className = "markdown-warning-indicator";
  warningIndicator.style.display = isEditable ? "none" : "block";
  warningIndicator.textContent = "\u{1F512} Read-only";
  warningIndicator.title = "Editing is disabled while input is connected. Disconnect the input to enable manual editing.";
  if (isEditable) {
    container.addEventListener("click", (e2) => {
      if (toolbar.contains(e2.target)) {
        return;
      }
      e2.stopPropagation();
      if (!isSourceMode) {
        showText();
      }
    });
    container.style.cursor = "text";
    textarea.addEventListener("click", (e2) => {
      e2.stopPropagation();
    });
  } else {
    const tooltipText = "Editing is disabled while input is connected. Disconnect the input to enable manual editing.";
    container.title = tooltipText;
    textarea.title = tooltipText;
  }
  if (isEditable) {
    textarea.addEventListener("input", () => {
      currentContent = textarea.value;
      updateCharCount();
      textWidget.value = currentContent;
      if (onContentChange) onContentChange(currentContent);
    });
    const autoSaveAndPreview = () => {
      if (isSourceMode) {
        if (textarea.value !== currentContent) {
          currentContent = textarea.value;
          textWidget.value = currentContent;
          if (onContentChange) onContentChange(currentContent);
        }
        showMarkdown();
      }
    };
    const originalOnDeselected = node2.onDeselected;
    node2.onDeselected = function() {
      autoSaveAndPreview();
      if (originalOnDeselected) originalOnDeselected.call(this);
    };
    const handleDocumentClick = (e2) => {
      if (!mainContainer.contains(e2.target)) {
        autoSaveAndPreview();
      }
    };
    document.addEventListener("click", handleDocumentClick);
  }
  toggleGroup.append(markdownButton, textButton);
  if (isEditable) {
    toolbar.append(toggleGroup, charCount);
  } else {
    toolbar.append(toggleGroup, warningIndicator, charCount);
  }
  mainContainer.append(toolbar, container, textarea);
  node2._markdownWidgetElement = mainContainer;
  const widget = node2.addDOMWidget(
    "markdown_widget",
    "div",
    mainContainer,
    {}
  );
  function updateDOMSize() {
    mainContainer.style.width = "100%";
    mainContainer.style.height = "100%";
  }
  node2.updateDOMSize = updateDOMSize;
  updateDOMSize();
  widget.draw = () => {
  };
  widget.computeSize = function(width2) {
    var _a2;
    if (!node2 || node2.is_collapsed) {
      return [width2, 0];
    }
    const nodeHeight = node2.size[1];
    const titleHeight = 26;
    const inputsHeight = (((_a2 = node2.inputs) == null ? void 0 : _a2.length) || 0) * 21;
    const widgetPadding = 4;
    const availableHeight = nodeHeight - titleHeight - inputsHeight - widgetPadding;
    return [width2, Math.max(60, availableHeight)];
  };
  widget.onRemove = () => {
    if (node2._markdownWidgetElement === mainContainer && mainContainer.parentNode) {
      mainContainer.parentNode.removeChild(mainContainer);
      node2._markdownWidgetElement = null;
    }
  };
  return widget;
}
function showEditor(node2) {
  var _a2, _b, _c, _d, _e;
  log(node2.type, "showEditor called, this:", node2);
  if (!node2._editableContent) {
    let existingContent = "";
    if (node2.properties && node2.properties.text && node2.properties.text.trim()) {
      existingContent = node2.properties.text;
      log(
        "Restored content from node properties:",
        existingContent.substring(0, 50) + "..."
      );
    }
    node2._editableContent = existingContent || `Write your **markdown** content here!
- Bullet points
- *Italic text*
- \`Code snippets\``;
  }
  if (node2._hasInputConnection) {
    log("showEditor", "Showing content as read-only due to input connection");
    createMarkdownWidget(node2, {
      widgetName: "markdown_widget",
      isEditable: false,
      htmlContent: node2._storedHtml,
      sourceText: node2._sourceText || "",
      initialContent: node2._sourceText || ""
    });
  } else {
    log("showEditor", "Showing editable editor");
    createMarkdownWidget(node2, {
      widgetName: "markdown_widget",
      isEditable: true,
      initialContent: node2._editableContent,
      onContentChange: (content) => {
        node2._editableContent = content;
        if (!node2.properties) node2.properties = {};
        node2.properties.text = content;
        node2.properties.markdown_editor = content;
      }
    });
  }
  try {
    const overlayElements = (_e = (_d = node2._markdownWidgetElement || ((_c = (_b = (_a2 = node2 == null ? void 0 : node2.widgets) == null ? void 0 : _a2.find) == null ? void 0 : _b.call(_a2, (w) => w.name === "markdown_widget")) == null ? void 0 : _c.element)) == null ? void 0 : _d.querySelectorAll) == null ? void 0 : _e.call(
      _d,
      ".markdown-waiting-overlay"
    );
    if (overlayElements && overlayElements.length) {
      overlayElements.forEach((el) => el.remove());
      log("showEditor", "Removed lingering waiting overlay");
    }
  } catch (err) {
    log("showEditor", "Error while removing waiting overlay", err);
  }
}
function showWaitingForInput(node2) {
  log("showWaitingForInput called");
  if (!node2._editableContent) {
    node2._editableContent = `Write your **markdown** content here!
- Bullet points
- *Italic text*
- \`Code snippets\``;
  }
  const initialContent = Array.isArray(node2._editableContent) ? node2._editableContent.join("") : node2._editableContent;
  const widget = createMarkdownWidget(node2, {
    widgetName: "markdown_widget",
    isEditable: false,
    initialContent,
    htmlContent: renderMarkdownToHtml(initialContent),
    sourceText: initialContent
  });
  const mainContainer = widget.element;
  const overlay = document.createElement("div");
  overlay.className = "markdown-waiting-overlay";
  overlay.innerHTML = `
    <div class="markdown-waiting-icon">\u23F3</div>
    <div class="markdown-waiting-title">Waiting for Input</div>
    <div class="markdown-waiting-note">Manual content will be overridden</div>
  `;
  mainContainer.appendChild(overlay);
}

// src_web/comfyui/markdown_renderer.ts
console.log("=== MARKDOWN_RENDERER_MODULE_LOADED ===");
function setupMarkdownRenderer(nodeType, nodeData) {
}
function handleMarkdownRendererCreated(node2) {
}
var _MarkdownRendererNode = class _MarkdownRendererNode extends StoryboardBaseNode {
  // Debounce timeout
  constructor(title = _MarkdownRendererNode.title) {
    super(title);
    // Keep category consistent
    this._hasInputConnection = false;
    this._editableContent = "";
    this._storedHtml = "";
    this._sourceText = "";
    this._hasReceivedData = false;
    this._isUpdatingUI = false;
    // Add flag to prevent concurrent UI updates
    this._updateUITimeout = null;
    log(this.type, "Constructor called");
  }
  onConstructed() {
    var _a2, _b;
    if (this.__constructed__) return false;
    log(this.type, "Node constructed");
    this._hasInputConnection = false;
    this._editableContent = "";
    this._storedHtml = "";
    this._sourceText = "";
    this._hasReceivedData = false;
    this._isUpdatingUI = false;
    this._updateUITimeout = null;
    this.type = (_a2 = this.type) != null ? _a2 : void 0;
    this.__constructed__ = true;
    (_b = app2.graph) == null ? void 0 : _b.trigger("nodeCreated", this);
    log(this.type, "Node state initialized");
    return this.__constructed__;
  }
  clone() {
    log(this.type, "Cloning node");
    const cloned = super.clone();
    if (cloned) {
      log(this.type, "Cloned node properties:", cloned.properties);
      if (cloned.properties && !!window.structuredClone) {
        cloned.properties = structuredClone(cloned.properties);
        log(this.type, "Properties deep cloned");
      }
      cloned._hasInputConnection = this._hasInputConnection;
      cloned._editableContent = this._editableContent;
      cloned._storedHtml = this._storedHtml;
      cloned._sourceText = this._sourceText;
      cloned._hasReceivedData = this._hasReceivedData;
      cloned._isUpdatingUI = false;
      cloned._updateUITimeout = null;
      log(this.type, "State properties copied");
      if (!cloned.properties) cloned.properties = {};
      cloned.properties["text"] = this._editableContent;
      cloned.properties["storedHtml"] = this._storedHtml;
      cloned.properties["sourceText"] = this._sourceText;
      log(this.type, "Properties copied to cloned node");
      if (cloned.widgets) {
        cloned.widgets.length = 0;
      }
      cloned.onConstructed();
      log(this.type, "Cloned node constructed");
      cloned.updateUI();
      log(this.type, "Cloned node UI updated");
    }
    return cloned;
  }
  onConnectionsChange(type, index, connected, linkInfo, inputOrOutput) {
    if (type === 1 && index === 0) {
      log(this.type, "Input connection changed:", connected);
      this._hasInputConnection = connected;
      if (!connected) {
        this._hasReceivedData = false;
      }
      this.updateUI();
    }
  }
  onExecute() {
  }
  onExecuted(result) {
    log(this.type, "Node executed with result:", result);
    if (result && result.text) {
      const { text: textArray, html: htmlArray } = result;
      if (textArray.length > 0) {
        this._sourceText = Array.isArray(textArray) ? textArray.join("") : textArray;
        this._editableContent = this._sourceText;
        if (htmlArray && htmlArray.length > 0) {
          this._storedHtml = Array.isArray(htmlArray) ? htmlArray.join("") : htmlArray;
        } else {
          this._storedHtml = renderMarkdownToHtml(this._sourceText);
        }
        this._hasReceivedData = true;
        if (!this.properties) this.properties = {};
        this.properties["storedHtml"] = this._storedHtml;
        this.properties["sourceText"] = this._sourceText;
        this.properties["text"] = this._sourceText;
        log(this.type, "Received data - sourceText length:", this._sourceText.length, "storedHtml length:", this._storedHtml.length);
        this.updateUI();
      } else {
        log(this.type, "Received empty data from backend");
      }
    } else {
      log(this.type, "No valid data received from backend");
    }
  }
  onConfigure(info) {
    var _a2, _b;
    log(this.type, "Configuring node with info:", info);
    if (this.properties) {
      const props = this.properties;
      if (props["storedHtml"]) {
        log(this.type, "Restoring stored HTML from properties");
        this._storedHtml = String(props["storedHtml"]);
        this._sourceText = String(props["sourceText"] || "");
        this._hasReceivedData = true;
      }
      if (props["text"]) {
        log(this.type, "Restoring text content from properties");
        this._editableContent = String(props["text"]);
      }
    }
    this.cleanupAllWidgets();
    const hasConnection = Boolean((_b = (_a2 = this.inputs) == null ? void 0 : _a2[0]) == null ? void 0 : _b.link);
    log(this.type, "Has input connection:", hasConnection, "Has received data:", this._hasReceivedData);
    this._hasInputConnection = hasConnection;
    if (!hasConnection) {
      this._hasReceivedData = false;
    }
    this.updateUI();
  }
  onNodeCreated() {
    log(this.type, "Node created");
    if (this.inputs && this.inputs[0] && this.inputs[0].link) {
      log(this.type, "Found existing input connection");
      this._hasInputConnection = true;
    } else {
      this._hasInputConnection = false;
      this._hasReceivedData = false;
    }
    this.updateUI();
  }
  updateUI() {
    if (this._updateUITimeout !== null) {
      clearTimeout(this._updateUITimeout);
      this._updateUITimeout = null;
    }
    this._updateUITimeout = setTimeout(() => {
      this._updateUITimeout = null;
      this.doUpdateUI();
    }, 25);
  }
  doUpdateUI() {
    if (this._isUpdatingUI) {
      log(this.type, "UI update already in progress, skipping");
      return;
    }
    this._isUpdatingUI = true;
    log(this.type, "Updating UI - hasInputConnection:", this._hasInputConnection, "hasReceivedData:", this._hasReceivedData, "hasContent:", Boolean(this._editableContent), "hasStoredHtml:", Boolean(this._storedHtml));
    try {
      this.cleanupAllWidgets();
      if (this._hasInputConnection && !this._hasReceivedData && !this._storedHtml) {
        log(this.type, "Showing waiting UI - connected but no data received");
        showWaitingForInput(this);
      } else {
        log(this.type, "Showing editor - has content, data, or no connection");
        showEditor(this);
      }
      if (typeof this.computeSize === "function") {
        this.computeSize();
      }
      if (this.graph && typeof this.graph.setDirtyCanvas === "function") {
        this.graph.setDirtyCanvas(true, true);
      }
    } finally {
      this._isUpdatingUI = false;
    }
  }
  cleanupAllWidgets() {
    if (!this.widgets) return;
    log(this.type, "Cleaning up widgets, current count:", this.widgets.length);
    const widgetsToRemove = [...this.widgets];
    for (const widget of widgetsToRemove) {
      if (widget.name === "markdown_widget" || widget.name === "markdown_editor" || widget.name === "text") {
        log(this.type, "Removing widget:", widget.name);
        if (typeof widget.onRemove === "function") {
          widget.onRemove();
        }
        if (typeof this.removeWidget === "function") {
          this.removeWidget(widget);
        } else {
          const element = widget.element;
          if (element && element.parentNode) {
            element.parentNode.removeChild(element);
          }
          const index = this.widgets.indexOf(widget);
          if (index > -1) {
            this.widgets.splice(index, 1);
          }
        }
      }
    }
    this.widgets = this.widgets.filter(
      (w) => w.name !== "markdown_widget" && w.name !== "markdown_editor" && w.name !== "text"
    );
    log(this.type, "Widgets after cleanup:", this.widgets.length);
  }
  onRemoved() {
    var _a2;
    if (this._updateUITimeout !== null) {
      clearTimeout(this._updateUITimeout);
      this._updateUITimeout = null;
    }
    this.cleanupAllWidgets();
    (_a2 = super.onRemoved) == null ? void 0 : _a2.call(this);
  }
  computeSize(out) {
    const minW = 250;
    const minH = 220;
    const curW = Array.isArray(this.size) ? this.size[0] : minW;
    const curH = Array.isArray(this.size) ? this.size[1] : minH;
    return [Math.max(curW, minW), Math.max(curH, minH)];
  }
  // override onResize(size: any): void {
  //   (this as any).updateDOMSize?.();
  //   super.onResize?.(size);
  // }
};
_MarkdownRendererNode.title = "Markdown Renderer";
_MarkdownRendererNode.type = "MarkdownRenderer";
_MarkdownRendererNode.category = "storyboard";
_MarkdownRendererNode._category = "storyboard";
var MarkdownRendererNode = _MarkdownRendererNode;
if (!window.__mdRendererRegistered) {
  window.__mdRendererRegistered = true;
  app2.registerExtension({
    name: "comfyui-storyboard.markdown-renderer",
    async beforeRegisterNodeDef(nodeType, nodeData) {
      if (nodeData.name === "MarkdownRenderer") {
        log("MarkdownRenderer", "Registering node type");
        log("MarkdownRenderer", "Node data:", nodeData);
        const methods = [
          "onConnectionsChange",
          "onExecute",
          "onExecuted",
          "onConfigure",
          "onNodeCreated",
          "onRemoved",
          "clone",
          "onConstructed",
          "checkAndRunOnConstructed",
          "updateUI",
          "doUpdateUI",
          "cleanupAllWidgets",
          "computeSize",
          "onResize"
        ];
        for (const method of methods) {
          const prototype = MarkdownRendererNode.prototype;
          if (prototype[method]) {
            nodeType.prototype[method] = prototype[method];
            log("MarkdownRenderer", `Copied method: ${method}`);
          }
        }
        nodeType.title = MarkdownRendererNode.title;
        nodeType.type = MarkdownRendererNode.type;
        nodeType.category = MarkdownRendererNode.category;
        nodeType._category = MarkdownRendererNode._category;
        log("MarkdownRenderer", "Static properties copied");
        if (MarkdownRendererNode.type) {
          log("MarkdownRenderer", "Registering node type with LiteGraph");
          LiteGraph.registerNodeType(MarkdownRendererNode.type, nodeType);
        }
        MarkdownRendererNode.setUp();
      }
    },
    nodeCreated(node2) {
      var _a2;
      if (node2.comfyClass === "MarkdownRenderer") {
        log("MarkdownRenderer", "Node instance created");
        log("MarkdownRenderer", "Node properties:", node2.properties);
        node2._hasInputConnection = false;
        node2._editableContent = "";
        node2._storedHtml = "";
        node2._sourceText = "";
        node2._hasReceivedData = false;
        log("MarkdownRenderer", "Node state initialized");
        (_a2 = node2.onConstructed) == null ? void 0 : _a2.call(node2);
        log("MarkdownRenderer", "Node constructed");
      }
    }
  });
}
export {
  MarkdownRendererNode,
  handleMarkdownRendererCreated,
  setupMarkdownRenderer
};
/*! Bundled license information:

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.2.6 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.6/LICENSE *)
*/
