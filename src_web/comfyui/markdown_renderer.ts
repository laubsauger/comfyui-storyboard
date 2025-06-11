import { app } from "scripts/app.js";
import { ComfyWidgets } from "scripts/widgets.js";
import DOMPurify from "dompurify";
import { marked, Renderer } from "marked";

const LOG_VERBOSE = false;
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
  mainContainer.style.minWidth = "240px";
  mainContainer.style.minHeight = "140px";
  mainContainer.style.width = "100%";
  mainContainer.style.height = "100%";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";

  mainContainer.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  const toolbar = document.createElement("div");
  toolbar.className = "markdown-editor-toolbar";
  toolbar.style.flex = "0 0 auto";
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
  container.style.flex = "1 1 auto";
  container.style.minHeight = "140px";
  container.style.overflow = "auto";
  container.innerHTML = htmlContent || renderMarkdownToHtml(initialContent);
  const textarea = document.createElement("textarea");
  textarea.className = "markdown-editor-textarea";
  textarea.style.display = "none";
  textarea.style.flex = "1 1 auto";
  textarea.style.minHeight = "120px";
  textarea.style.width = "100%";
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

  // Update node state
  node._hasReceivedData = true;
  const finalHtml = Array.isArray(html) ? html.join("") : html;
  node._storedHtml = finalHtml;
  node._sourceText = node.properties?.sourceText || "";
  node._editableContent = node._sourceText;

  // Update properties
  if (!node.properties) node.properties = {};
  node.properties.storedHtml = node._storedHtml;
  node.properties.sourceText = node._sourceText;
  node.properties.text = node._sourceText;
  node.properties.markdown_widget = finalHtml;

  // Update or create widget
  let mdWidget = node.widgets.find((w: any) => w.name === "markdown_widget");
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
    const textarea = mainContainer.querySelector(".markdown-editor-textarea");
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

  // Restore content from properties or default
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

  // Create hidden text widget for storage
  let textWidget = ComfyWidgets.STRING(
    node,
    "text",
    ["STRING", { multiline: true }],
    app
  ).widget;
  textWidget.value = node._editableContent || "";
  (textWidget as any).type = "hidden";

  // Create markdown editor widget
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
      node.properties.markdown_editor = content;
    },
  });

  if (node.size[0] < 400) node.size[0] = 400;
  if (node.size[1] < 350) node.size[1] = 350;
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

  const initialContent = Array.isArray(node._editableContent)
    ? node._editableContent.join("")
    : node._editableContent;

  const widget = createMarkdownWidget(node, {
    widgetName: "markdown_widget",
    isEditable: false,
    initialContent: initialContent,
    htmlContent: renderMarkdownToHtml(initialContent),
    sourceText: initialContent,
  });

  const mainContainer = widget.element;

  const overlay = document.createElement("div");
  overlay.className = "markdown-waiting-overlay";

  overlay.innerHTML = `
    <div class="markdown-waiting-icon">⏳</div>
    <div class="markdown-waiting-title">Waiting for Input</div>
    <div class="markdown-waiting-subtitle">This node is connected to an input source.</div>
    <div class="markdown-waiting-note">Manual content will be overridden</div>
  `;
  mainContainer.appendChild(overlay);

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

// Helper function to log node state
function logNodeState(node: any, context: string) {
  if (!LOG_VERBOSE) return;

  log(`${context} - Node State:`, {
    hasInputConnection: node._hasInputConnection,
    hasReceivedData: node._hasReceivedData,
    storedHtml: node._storedHtml ? `[${node._storedHtml.length} chars]` : null,
    sourceText: node._sourceText ? `[${node._sourceText.length} items]` : null,
    editableContent: node._editableContent ? `[${node._editableContent.length} chars]` : null,
    properties: node.properties ? {
      storedHtml: node.properties.storedHtml ? `[${node.properties.storedHtml.length} chars]` : null,
      sourceText: node.properties.sourceText ? `[${node.properties.sourceText.length} items]` : null,
      text: node.properties.text ? `[${node.properties.text.length} chars]` : null
    } : null,
    widgets: node.widgets ? `[${node.widgets.length} widgets]` : null
  });
}

export function handleMarkdownRendererCreated(node: any) {
  log("handleMarkdownRendererCreated called");
  node.title = "📝 " + (node.title || "Markdown Renderer");

  // Initialize state from properties
  const hasInput = node.inputs?.[0]?.link;
  node._hasInputConnection = hasInput || false;
  log(`Initial input connection state: ${hasInput}`);

  // Restore content from properties
  if (node.properties) {
    log("Restoring state from properties:", node.properties);
    // For standalone nodes, use text property
    if (!hasInput && node.properties.text) {
      node._editableContent = node.properties.text;
      node._storedHtml = renderMarkdownToHtml(node.properties.text);
      node._sourceText = [node.properties.text];
      node._hasReceivedData = true;
      log("Restored content for standalone node:", node._editableContent);
    } else {
      // For connected nodes, use storedHtml and sourceText
      node._editableContent = node.properties.text || "";
      node._storedHtml = node.properties.storedHtml || null;
      node._sourceText = node.properties.sourceText || null;
      node._hasReceivedData = !!node._storedHtml;
    }
  } else {
    log("No properties found, initializing empty state");
    node._editableContent = "";
    node._storedHtml = null;
    node._sourceText = null;
    node._hasReceivedData = false;
  }

  logNodeState(node, "After initialization");

  // Ensure widgets array exists
  if (!node.widgets) {
    node.widgets = [];
  }

  // Hide the text widget but keep it functional
  const textWidget = node.widgets.find((w: any) => w.name === "text");
  if (textWidget) {
    textWidget.type = "hidden";
    textWidget.hidden = true;
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
        showEditor(this);
      } else {
        showWaitingForInput(this);
      }
    }
  };

  // Initialize UI based on connection state and stored content
  if (hasInput) {
    if (node._storedHtml) {
      restoreRenderedContent(node);
    } else {
      showWaitingForInput(node);
    }
  } else {
    showEditor(node);
  }
}

export function setupMarkdownRenderer(nodeType: any, _nodeData: any) {
  const onExecuted = nodeType.prototype.onExecuted;
  nodeType.prototype.onExecuted = function (message: any) {
    onExecuted?.apply(this, arguments);
    log("onExecuted called with message:", message);

    // Only process execution results if we have an input connection and HTML content
    if (this._hasInputConnection && message.html) {
      log("Processing execution message for connected node");
      this._sourceText = message.text || [];
      this._storedHtml = message.html;
      this._hasReceivedData = true;

      if (!this.properties) this.properties = {};
      this.properties.storedHtml = message.html;
      this.properties.sourceText = message.text || [];
      this.properties.text = message.text || [];
      this.properties.markdown_widget = message.html;

      logNodeState(this, "Before populating widget");
      populateMarkdownWidget(this, message.html);
      logNodeState(this, "After populating widget");
    } else {
      log("Skipping execution message - no input connection or HTML content");
    }
  };

  const onConfigure = nodeType.prototype.onConfigure;
  nodeType.prototype.onConfigure = function () {
    onConfigure?.apply(this, arguments);
    log("onConfigure called");

    // Restore stored content from properties if available
    if (this.properties) {
      const hasConnection = this.inputs && this.inputs[0] && this.inputs[0].link;

      if (hasConnection && this.properties.storedHtml) {
        log("Restoring content from properties in onConfigure for connected node");
        this._storedHtml = this.properties.storedHtml;
        this._sourceText = this.properties.sourceText || [];
        this._editableContent = this.properties.text || "";
        this._hasReceivedData = true;
      } else if (!hasConnection && this.properties.text) {
        log("Restoring content from properties in onConfigure for standalone node");
        this._editableContent = this.properties.text;
        this._storedHtml = renderMarkdownToHtml(this.properties.text);
        this._sourceText = [this.properties.text];
        this._hasReceivedData = true;
      }
      logNodeState(this, "After restoring content");
    }

    const hasConnection = this.inputs && this.inputs[0] && this.inputs[0].link;
    log(`Input connection state in onConfigure: ${hasConnection}`);

    // Update connection state
    this._hasInputConnection = hasConnection;

    // Check if we need to update the UI
    const hasMarkdownWidget = this.widgets?.some((w: any) => w.name === "markdown_widget");
    const hasEditorWidget = this.widgets?.some((w: any) => w.name === "markdown_editor");

    if (hasConnection) {
      if (this._storedHtml) {
        log("Node has connection and stored HTML, restoring content");
        restoreRenderedContent(this);
      } else if (!hasMarkdownWidget) {
        log("Node has connection but no stored HTML, showing waiting UI");
        showWaitingForInput(this);
      }
    } else {
      if (!hasEditorWidget) {
        log("Node has no connection, showing editor");
        showEditor(this);
      }
    }
  };
}