import { app } from "scripts/app.js";
import { ComfyWidgets } from "scripts/widgets.js";
import { renderMarkdownToHtml } from "./markdown_renderer.js";

const LOG_VERBOSE = false;
const log = (...args: any[]) => {
  if (LOG_VERBOSE) {
    console.log(`[MarkdownWidget]`, ...args);
  }
};

export function createMarkdownWidget(node: any, config: any) {
  const {
    widgetName = "markdown_widget",
    isEditable = false,
    initialContent = "",
    htmlContent = "",
    sourceText = "",
    onContentChange = null,
  } = config;

  // Create hidden text widget for serialization FIRST
  // This ensures the text content gets properly serialized to widgets_values
  let textWidget = ComfyWidgets.STRING(
    node,
    "text",
    ["STRING", { multiline: true }],
    app
  ).widget;

  textWidget.value = initialContent;
  textWidget.type = "multiline";
  textWidget.computeSize = () => [0, 0]; // No visual size - this will hide it effectively

  // Add callback to update when widget value changes
  const originalCallback = textWidget.callback;
  textWidget.callback = function (v: any) {
    if (originalCallback) originalCallback.call(this, v);
    if (onContentChange) onContentChange(v);
    node._editableContent = v;
    if (!node.properties) node.properties = {};
    node.properties.text = v;
    node.properties.markdown_editor = v;
  };

  const mainContainer = document.createElement("div");
  mainContainer.classList.add("storyboard-main-container");
  mainContainer.style.position = "relative";
  mainContainer.style.minWidth = "300px";
  mainContainer.style.minHeight = "140px";
  mainContainer.style.width = "100%";
  mainContainer.style.height = "100%";
  mainContainer.style.maxWidth = "100%"; // Prevent overflow
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.boxSizing = "border-box"; // Include padding in size calculations
  mainContainer.style.overflow = "hidden"; // Prevent content overflow

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

      // Update the hidden text widget for serialization
      textWidget.value = currentContent;

      if (onContentChange) onContentChange(currentContent);
    });

    const autoSaveAndPreview = () => {
      if (isSourceMode) {
        if (textarea.value !== currentContent) {
          currentContent = textarea.value;
          textWidget.value = currentContent; // Update hidden widget
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

  // --- Track the DOM element on the node instance ---
  node._markdownWidgetElement = mainContainer;

  // --- Add the widget to the node, always with name 'markdown_widget' ---
  const widget = node.addDOMWidget(
    "markdown_widget",
    "div",
    mainContainer,
    {}
  );

  // Improved widget draw function for proper sizing
  widget.draw = function (ctx: any, nodeInstance: any, widgetWidth: number, y: number, widgetHeight: number) {
    // This is called during ComfyUI's rendering cycle
    // Ensure the container matches the widget dimensions
    if (mainContainer) {
      // Account for node padding/margins - typically 10-20px on each side
      const actualWidth = Math.max(widgetWidth - 10, 0);
      const actualHeight = Math.max(widgetHeight, 300);

      mainContainer.style.width = `${actualWidth}px`;
      mainContainer.style.height = `${actualHeight}px`;
      mainContainer.style.maxWidth = `${actualWidth}px`; // Prevent overflow
      mainContainer.style.overflow = 'hidden'; // Ensure content doesn't overflow
    }
  };

  widget.computeSize = function (width: number) {
    const minWidth = 480;
    const minHeight = 300;
    return [Math.max(width, minWidth), Math.max(minHeight, 350)];
  };

  widget.onRemove = () => {
    if (node._markdownWidgetElement === mainContainer && mainContainer.parentNode) {
      mainContainer.parentNode.removeChild(mainContainer);
      node._markdownWidgetElement = null;
    }
  };
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
    const sourceText = node._sourceText
      ? Array.isArray(node._sourceText)
        ? node._sourceText.join("")
        : node._sourceText
      : "";
    createMarkdownWidget(node, {
      widgetName: "markdown_widget",
      isEditable: false,
      htmlContent: finalHtml,
      sourceText: sourceText,
      initialContent: sourceText,
    });
    // Note: createMarkdownWidget already calls addDOMWidget internally
  }
}

export function showEditor(node: any) {
  log("showEditor called, this:", node);

  // Don't clean up here - let the main cleanupAllWidgets handle it
  // This prevents double cleanup and DOM manipulation race conditions

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
      `Write your **markdown** content here!\n- Bullet points\n- *Italic text*\n- \`Code snippets\``;
  }

  // If we have received data (stored HTML), show it as read-only
  if (node._hasReceivedData && node._storedHtml) {
    log("showEditor", "Showing received data as read-only");
    createMarkdownWidget(node, {
      widgetName: "markdown_widget",
      isEditable: false,
      htmlContent: node._storedHtml,
      sourceText: node._sourceText || "",
      initialContent: node._sourceText || "",
    });
  } else {
    // Show editable editor for manual content
    log("showEditor", "Showing editable editor");
    createMarkdownWidget(node, {
      widgetName: "markdown_widget",
      isEditable: true,
      initialContent: node._editableContent,
      onContentChange: (content: string) => {
        node._editableContent = content;
        if (!node.properties) node.properties = {};
        node.properties.text = content;
        node.properties.markdown_editor = content;
      },
    });
  }

  if (node.size[0] < 480) node.size[0] = 480;
  if (node.size[1] < 350) node.size[1] = 350;
}

export function showWaitingForInput(node: any) {
  log("showWaitingForInput called");

  // Don't clean up here - let the main cleanupAllWidgets handle it
  // This prevents double cleanup and DOM manipulation race conditions

  if (!node._editableContent) {
    node._editableContent = `Write your **markdown** content here!\n- Bullet points\n- *Italic text*\n- \`Code snippets\``;
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

  if (node.size[0] < 480) node.size[0] = 480;
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
    log("Populating widget with stored HTML");
    populateMarkdownWidget(node, node._storedHtml);
  } else {
    log("No stored HTML found, showing waiting UI");
    showWaitingForInput(node);
  }
} 