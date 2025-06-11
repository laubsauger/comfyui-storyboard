import { app } from "scripts/app.js";
import { ComfyWidgets } from "scripts/widgets.js";
import DOMPurify from "dompurify";
import { marked, Renderer } from "marked";

const LOG_VERBOSE = true;
const log = (...args: any[]) => {
  if (LOG_VERBOSE) {
    console.log(`[MarkdownRenderer]`, ...args);
  }
};

const ALLOWED_TAGS = ["video", "source"];
const ALLOWED_ATTRS = [
  "controls",
  "autoplay",
  "loop",
  "muted",
  "preload",
  "poster",
];

const MEDIA_SRC_REGEX =
  /(<(?:img|source|video)[^>]*\ssrc=['"])(?!(?:\/|https?:\/\/))([^'"\s>]+)(['"])/gi;

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
  markdown: string,
  baseUrl?: string
): string {
  if (!markdown) return "";

  let html = marked.parse(markdown, {
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

function createMarkdownWidget(node: any, config: any) {
  const {
    widgetName = "markdown_widget",
    isEditable = false,
    initialContent = "",
    htmlContent = "",
    sourceText = "",
    onContentChange = null,
  } = config;

  const mainContainer = document.createElement("div");
  mainContainer.classList.add("storyboard-main-container");
  mainContainer.style.position = "relative";

  mainContainer.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  const toolbar = document.createElement("div");
  toolbar.className = "markdown-editor-toolbar";
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
  container.style.flex = "1";
  container.innerHTML = htmlContent || renderMarkdownToHtml(initialContent);
  const textarea = document.createElement("textarea");
  textarea.className = "markdown-editor-textarea";
  textarea.style.display = "none";
  textarea.style.flex = "1";
  textarea.readOnly = !isEditable;
  textarea.placeholder = isEditable
    ? "Enter your markdown content here..."
    : "Source markdown from connected input...";
  textarea.value = sourceText || initialContent;

  let isSourceMode = false;
  let currentContent = initialContent;

  const updateCharCount = () => {
    const text = currentContent || "";
    charCount.textContent = `${text.length} chars`;
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

  markdownButton.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isSourceMode) {
      showMarkdown();
    } else {
      showText();
    }
  });

  textButton.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isSourceMode) {
      showMarkdown();
    } else {
      showText();
    }
  });

  const warningIndicator = document.createElement("div");
  warningIndicator.className = "markdown-warning-indicator";
  warningIndicator.style.display = isEditable ? "none" : "block";
  warningIndicator.textContent = "🔒 Read-only";
  warningIndicator.title =
    "Editing is disabled while input is connected. Disconnect the input to enable manual editing.";

  if (isEditable) {
    container.addEventListener("click", (e) => {
      if (toolbar.contains(e.target as Node)) {
        return;
      }
      e.stopPropagation();
      if (!isSourceMode) {
        showText();
      }
    });
    container.style.cursor = "text";
    textarea.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  } else {
    const tooltipText =
      "Editing is disabled while input is connected. Disconnect the input to enable manual editing.";
    container.title = tooltipText;
    textarea.title = tooltipText;
  }

  if (isEditable) {
    textarea.addEventListener("input", () => {
      currentContent = textarea.value;
      updateCharCount();
      if (onContentChange) onContentChange(currentContent);
    });

    const autoSaveAndPreview = () => {
      if (isSourceMode) {
        if (textarea.value !== currentContent) {
          currentContent = textarea.value;
          if (onContentChange) onContentChange(currentContent);
        }
        showMarkdown();
      }
    };

    const originalOnDeselected = node.onDeselected;
    node.onDeselected = function (this: any) {
      autoSaveAndPreview();
      if (originalOnDeselected) originalOnDeselected.call(this);
    };

    const handleDocumentClick = (e: any) => {
      if (!mainContainer.contains(e.target)) {
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

  const widget = node.addDOMWidget(
    widgetName,
    "div",
    mainContainer,
    {}
  );
  widget.draw = () => { };
  return widget;
}

export function populateMarkdownWidget(node: any, html: string | string[]) {
  log("populateMarkdownWidget called");
  if (!node.widgets) return;
  node._hasReceivedData = true;
  const finalHtml = Array.isArray(html) ? html.join("") : html;
  node._storedHtml = finalHtml;
  node._sourceText = node.properties?.sourceText || "";
  node.properties.storedHtml = node._storedHtml;

  let mdWidget = node.widgets.find(
    (w: any) => w.name === "markdown_widget"
  );
  if (mdWidget) {
    const mainContainer = mdWidget.element;
    const overlay = mainContainer.querySelector(".markdown-waiting-overlay");
    if (overlay) {
      overlay.remove();
    }
    const contentDiv = mainContainer.querySelector(".markdown-content");
    if (contentDiv) {
      contentDiv.innerHTML = finalHtml;
    }
    const textarea = mainContainer.querySelector(
      ".markdown-editor-textarea"
    );
    if (textarea) {
      (textarea as HTMLTextAreaElement).value = node._sourceText;
    }
  } else {
    showWaitingForInput(node);
    requestAnimationFrame(() => {
      const sourceText = node._sourceText
        ? Array.isArray(node._sourceText)
          ? node._sourceText.join("")
          : node._sourceText
        : "";
      const widget = createMarkdownWidget(node, {
        widgetName: "markdown_widget",
        isEditable: false,
        htmlContent: finalHtml,
        sourceText: sourceText,
        initialContent: sourceText,
      });
      node.widgets.splice(node.widgets.indexOf(widget), 1);
      node.addDOMWidget(widget.name, "div", widget.element, {});
    });
  }
}

export function showEditor(node: any) {
  log("showEditor called, this:", node);
  if (node.widgets) {
    const widgetsToRemove = [...node.widgets];
    for (let widget of widgetsToRemove) {
      widget.onRemove?.();
      const index = node.widgets.indexOf(widget);
      if (index > -1) {
        node.widgets.splice(index, 1);
      }
    }
  }

  if (!node._editableContent) {
    let existingContent = "";
    if (node.properties && node.properties.text && node.properties.text.trim()) {
      existingContent = node.properties.text;
      log(
        "Restored content from node properties:",
        existingContent.substring(0, 50) + "..."
      );
    }
    node._editableContent =
      existingContent ||
      `Write your **markdown** content here!
- Bullet points
- *Italic text*
- \`Code snippets\``;
  }

  let textWidget = ComfyWidgets.STRING(
    node,
    "text",
    ["STRING", { multiline: true }],
    app
  ).widget;
  textWidget.value = node._editableContent || "";
  (textWidget as any).type = "hidden";

  createMarkdownWidget(node, {
    widgetName: "markdown_editor",
    isEditable: true,
    initialContent: node._editableContent,
    onContentChange: (content: string) => {
      node._editableContent = content;
      if (textWidget) {
        textWidget.value = content;
      }
      if (!node.properties) node.properties = {};
      node.properties.text = content;
    },
  });

  if (node.size[0] < 400) node.size[0] = 400;
  if (node.size[1] < 350) node.size[1] = 350;
}

export function restoreRenderedContent(node: any) {
  log("restoreRenderedContent called");
  if (node.properties && node.properties.storedHtml) {
    node._storedHtml = node.properties.storedHtml;
    node._sourceText = node.properties.sourceText || [];
    node._hasReceivedData = true;
    log("Restored HTML and source from properties");
  }

  if (node._storedHtml) {
    populateMarkdownWidget(node, node._storedHtml);
  } else {
    showWaitingForInput(node);
  }
}

export function showWaitingForInput(node: any) {
  log("showWaitingForInput called");
  if (node.widgets) {
    const widgetsToRemove = [...node.widgets];
    for (let widget of widgetsToRemove) {
      widget.onRemove?.();
      const index = node.widgets.indexOf(widget);
      if (index > -1) {
        node.widgets.splice(index, 1);
      }
    }
  }

  if (!node._editableContent) {
    node._editableContent = `Write your **markdown** content here!
- Bullet points
- *Italic text*
- \`Code snippets\``;
  }
  const widget = createMarkdownWidget(node, {
    widgetName: "markdown_widget",
    isEditable: false,
    initialContent: node._editableContent,
    htmlContent: renderMarkdownToHtml(node._editableContent),
    sourceText: node._editableContent,
  });

  const mainContainer = widget.element;

  const overlay = document.createElement("div");
  overlay.className = "markdown-waiting-overlay";

  overlay.innerHTML = `
    <div class="markdown-waiting-icon">⏳</div>
    <div class="markdown-waiting-title">Waiting for Input</div>
    <div class="markdown-waiting-subtitle">This node is connected to an input source. Execute the workflow to see the rendered markdown content.</div>
    <div class="markdown-waiting-note">Manual content will be overridden</div>
  `;
  mainContainer.appendChild(overlay);

  if (node.size[0] < 400) node.size[0] = 400;
  if (node.size[1] < 350) node.size[1] = 350;
}

export function setupMarkdownRenderer(nodeType: any, _nodeData: any) {
  const onExecuted = nodeType.prototype.onExecuted;
  nodeType.prototype.onExecuted = function (message: any) {
    onExecuted?.apply(this, arguments);
    log("Node executed with message:", message);

    if (this._hasInputConnection && (message.html || message.text)) {
      this._hasReceivedData = true;
      let finalHtml;
      let sourceText = message.text || [];

      if (message.text) {
        const markdown = Array.isArray(sourceText)
          ? sourceText.join("\n")
          : sourceText;
        finalHtml = renderMarkdownToHtml(markdown);
      } else {
        const receivedHtml = Array.isArray(message.html)
          ? message.html.join("")
          : message.html;
        finalHtml = DOMPurify.sanitize(receivedHtml, {
          ADD_TAGS: ALLOWED_TAGS,
          ADD_ATTR: ALLOWED_ATTRS,
        });
      }

      this._sourceText = sourceText;
      this._storedHtml = finalHtml;

      if (!this.properties) this.properties = {};
      this.properties.storedHtml = finalHtml;
      this.properties.sourceText = sourceText;

      populateMarkdownWidget(this, finalHtml);
    }
  };

  const onConfigure = nodeType.prototype.onConfigure;
  nodeType.prototype.onConfigure = function () {
    onConfigure?.apply(this, arguments);

    if (this.properties) {
      if (this.properties.storedHtml) {
        this._storedHtml = this.properties.storedHtml;
        this._sourceText = this.properties.sourceText || [];
        this._hasReceivedData = true;
        log("Restored stored content in onConfigure");
      }
    }

    if (this.widgets_values?.length) {
      const hasConnection =
        this.inputs && this.inputs[0] && this.inputs[0].link;
      if (hasConnection) {
        requestAnimationFrame(() => {
          populateMarkdownWidget(this, this.widgets_values);
        });
      }
    }
  };
}

export function handleMarkdownRendererCreated(node: any) {
  node.title = "📝 " + (node.title || "Markdown Renderer");
  node._hasInputConnection = false;
  node._editableContent = "";
  node._hasReceivedData = false;
  node._storedHtml = null;
  node._sourceText = null;

  if (node.inputs && node.inputs[0] && node.inputs[0].link) {
    node._hasInputConnection = true;
    log("Found existing input connection");
  }

  const originalOnConnectionsChange = node.onConnectionsChange;
  node.onConnectionsChange = function (
    type: number,
    index: number,
    connected: boolean,
    link_info: any
  ) {
    originalOnConnectionsChange?.apply(this, arguments);
    if (type === 1 && index === 0) {
      this._hasInputConnection = connected;
      if (!connected) {
        this._hasReceivedData = false;
        showEditor(this);
      } else {
        this._hasReceivedData = false;
        showWaitingForInput(this);
      }
    }
  };

  const initializeUI = () => {
    const hasConnection =
      node.inputs && node.inputs[0] && node.inputs[0].link;
    node._hasInputConnection = !!hasConnection;

    if (!node._hasInputConnection) {
      showEditor(node);
    } else {
      const hasStoredContent =
        node._storedHtml || (node.properties && node.properties.storedHtml);
      if (hasStoredContent) {
        restoreRenderedContent(node);
      } else {
        showWaitingForInput(node);
      }
    }
  };
  requestAnimationFrame(initializeUI);
}