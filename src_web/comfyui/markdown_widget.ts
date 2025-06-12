import { app } from "scripts/app.js";
import { ComfyWidgets } from "scripts/widgets.js";
import { renderMarkdownToHtml } from "./markdown_utils.js";
import { log } from "./common.js";

console.log("=== MARKDOWN_WIDGET_MODULE_LOADED ===");

export function createMarkdownWidget(node: any, config: any) {
  console.log("=== CREATE_MARKDOWN_WIDGET_CALLED ===", config);
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
    ["STRING", { hidden: true }],
    app
  ).widget;

  textWidget.value = initialContent;
  // textWidget.type = "text";
  // prevent canvas drawing for hidden widget
  textWidget.draw = () => { };
  textWidget.computeLayoutSize = () => {
    return {
      minHeight: 0,
      maxHeight: 0,
      minWidth: 0,
      maxWidth: 0,
    };
  }; // Ensure hidden widget occupies no canvas space

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
  mainContainer.style.width = "100%";
  mainContainer.style.height = "100%";
  mainContainer.style.minWidth = "150px";
  mainContainer.style.minHeight = "60px";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.boxSizing = "border-box";
  mainContainer.style.overflow = "hidden";

  mainContainer.addEventListener("click", (e) => {
    e.stopPropagation();
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
  container.style.height = "100%"; // Ensure it fills remaining space
  container.style.minHeight = "60px";
  container.style.overflow = "auto";
  container.innerHTML = htmlContent || renderMarkdownToHtml(initialContent);
  const textarea = document.createElement("textarea");
  textarea.className = "markdown-editor-textarea";
  textarea.style.display = "none";
  textarea.style.flex = "1 1 0";
  textarea.style.height = "100%"; // Fill remaining space
  textarea.style.minHeight = "60px";
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

  // Sync DOM size with node size
  function updateDOMSize() {
    mainContainer.style.width = "100%";
    mainContainer.style.height = "100%"; // wrapper height already excludes title bar
  }

  // Expose so node.onResize can call it
  (node as any).updateDOMSize = updateDOMSize;
  updateDOMSize();

  // Widget no longer affects sizing itself
  widget.draw = () => { };
  widget.computeSize = function (width: number): [number, number] {
    if (!node || node.is_collapsed) {
      return [width, 0];
    }
    const nodeHeight = node.size[1];
    const titleHeight = 26;
    const inputsHeight = (node.inputs?.length || 0) * 21;
    const widgetPadding = 4;
    const availableHeight = nodeHeight - titleHeight - inputsHeight - widgetPadding;
    return [width, Math.max(60, availableHeight)];
  }

  widget.onRemove = () => {
    if (node._markdownWidgetElement === mainContainer && mainContainer.parentNode) {
      mainContainer.parentNode.removeChild(mainContainer);
      node._markdownWidgetElement = null;
    }
  };
  return widget;
}

export function populateMarkdownWidget(node: any, html: string | string[]) {
  log(node.type, "populateMarkdownWidget called");
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
  log(node.type, "showEditor called, this:", node);

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

  // If there's an input connection, the widget should be read-only.
  // Otherwise, it's an editable, standalone node.
  if (node._hasInputConnection) {
    log("showEditor", "Showing content as read-only due to input connection");
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

  // Safeguard: remove any lingering waiting overlay that might still be attached to the DOM
  try {
    const overlayElements = (node._markdownWidgetElement || node?.widgets?.find?.((w: any) => w.name === "markdown_widget")?.element)?.querySelectorAll?.(
      ".markdown-waiting-overlay"
    );
    if (overlayElements && overlayElements.length) {
      overlayElements.forEach((el: Element) => el.remove());
      log("showEditor", "Removed lingering waiting overlay");
    }
  } catch (err) {
    log("showEditor", "Error while removing waiting overlay", err);
  }

  // no forced size here either
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
    <div class="markdown-waiting-note">Manual content will be overridden</div>
  `;
  mainContainer.appendChild(overlay);

  // no forced size here either
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