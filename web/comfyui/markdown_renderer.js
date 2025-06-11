import { app } from "../../scripts/app.js";
import { ComfyWidgets } from "../../scripts/widgets.js";
const LOG_VERBOSE = false;
const log = (...args) => {
    if (LOG_VERBOSE) {
        console.log(`[MarkdownRenderer]`, ...args);
    }
};
function createMarkdownWidget(node, config) {
    const { widgetName = "markdown_widget", isEditable = false, initialContent = "", htmlContent = "", sourceText = "", onContentChange = null, } = config;
    const mainContainer = document.createElement("div");
    mainContainer.classList.add("storyboard-main-container");
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
    container.innerHTML = htmlContent || parseMarkdownSimple(initialContent);
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
            container.innerHTML = parseMarkdownSimple(currentContent);
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
        }
        else {
            showText();
        }
    });
    textButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (isSourceMode) {
            showMarkdown();
        }
        else {
            showText();
        }
    });
    const warningIndicator = document.createElement("div");
    warningIndicator.className = "markdown-warning-indicator";
    warningIndicator.style.color = "#6c757d";
    warningIndicator.style.fontSize = "12px";
    warningIndicator.style.fontWeight = "bold";
    warningIndicator.style.display = isEditable ? "none" : "block";
    warningIndicator.textContent = "🔒 Read-only";
    warningIndicator.title =
        "Editing is disabled while input is connected. Disconnect the input to enable manual editing.";
    if (isEditable) {
        container.addEventListener("click", (e) => {
            if (toolbar.contains(e.target)) {
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
    }
    else {
        const tooltipText = "Editing is disabled while input is connected. Disconnect the input to enable manual editing.";
        container.title = tooltipText;
        textarea.title = tooltipText;
    }
    if (isEditable) {
        textarea.addEventListener("input", () => {
            currentContent = textarea.value;
            updateCharCount();
            if (onContentChange)
                onContentChange(currentContent);
        });
        const autoSaveAndPreview = () => {
            if (isSourceMode) {
                if (textarea.value !== currentContent) {
                    currentContent = textarea.value;
                    if (onContentChange)
                        onContentChange(currentContent);
                }
                showMarkdown();
            }
        };
        const originalOnDeselected = node.onDeselected;
        node.onDeselected = function () {
            autoSaveAndPreview();
            if (originalOnDeselected)
                originalOnDeselected.call(this);
        };
        const handleDocumentClick = (e) => {
            if (!mainContainer.contains(e.target)) {
                autoSaveAndPreview();
            }
        };
        document.addEventListener("click", handleDocumentClick);
    }
    toggleGroup.append(markdownButton, textButton);
    if (isEditable) {
        toolbar.append(toggleGroup, charCount);
    }
    else {
        toolbar.append(toggleGroup, charCount, warningIndicator);
    }
    mainContainer.append(toolbar, container, textarea);
    const widget = node.addDOMWidget(widgetName, "div", mainContainer, {});
    widget.draw = () => { };
    return widget;
}
export function populateMarkdownWidget(node, html) {
    var _a;
    log("populateMarkdownWidget called");
    if (!node.widgets)
        return;
    node._hasReceivedData = true;
    const finalHtml = Array.isArray(html) ? html.join("") : html;
    node._storedHtml = finalHtml;
    node._sourceText = ((_a = node.properties) === null || _a === void 0 ? void 0 : _a.sourceText) || "";
    node.properties.storedHtml = node._storedHtml;
    let mdWidget = node.widgets.find((w) => w.name === "markdown_widget");
    if (mdWidget) {
        const mainContainer = mdWidget.element;
        const contentDiv = mainContainer.querySelector(".markdown-content");
        if (contentDiv) {
            contentDiv.innerHTML = finalHtml;
        }
        const textarea = mainContainer.querySelector(".markdown-editor-textarea");
        if (textarea) {
            textarea.value = node._sourceText;
        }
    }
    else {
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
export function showEditor(node) {
    var _a;
    log("showEditor called, this:", node);
    if (node.widgets) {
        const widgetsToRemove = [...node.widgets];
        for (let widget of widgetsToRemove) {
            (_a = widget.onRemove) === null || _a === void 0 ? void 0 : _a.call(widget);
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
            log("Restored content from node properties:", existingContent.substring(0, 50) + "...");
        }
        node._editableContent =
            existingContent ||
                `Write your **markdown** content here!
- Bullet points
- *Italic text*
- \`Code snippets\``;
    }
    let textWidget = ComfyWidgets.STRING(node, "text", ["STRING", { multiline: true }], app).widget;
    textWidget.value = node._editableContent || "";
    textWidget.type = "hidden";
    createMarkdownWidget(node, {
        widgetName: "markdown_editor",
        isEditable: true,
        initialContent: node._editableContent,
        onContentChange: (content) => {
            node._editableContent = content;
            if (textWidget) {
                textWidget.value = content;
            }
            if (!node.properties)
                node.properties = {};
            node.properties.text = content;
        },
    });
    if (node.size[0] < 400)
        node.size[0] = 400;
    if (node.size[1] < 350)
        node.size[1] = 350;
}
export function restoreRenderedContent(node) {
    log("restoreRenderedContent called");
    if (node.properties && node.properties.storedHtml) {
        node._storedHtml = node.properties.storedHtml;
        node._sourceText = node.properties.sourceText || [];
        node._hasReceivedData = true;
        log("Restored HTML and source from properties");
    }
    if (node._storedHtml) {
        populateMarkdownWidget(node, node._storedHtml);
    }
    else {
        showWaitingForInput(node);
    }
}
export function showWaitingForInput(node) {
    var _a;
    log("showWaitingForInput called");
    if (node.widgets) {
        const widgetsToRemove = [...node.widgets];
        for (let widget of widgetsToRemove) {
            (_a = widget.onRemove) === null || _a === void 0 ? void 0 : _a.call(widget);
            const index = node.widgets.indexOf(widget);
            if (index > -1) {
                node.widgets.splice(index, 1);
            }
        }
    }
    const mainContainer = document.createElement("div");
    mainContainer.classList.add("storyboard-main-container");
    const overlay = document.createElement("div");
    overlay.className = "markdown-waiting-overlay";
    overlay.innerHTML = `
    <div class="markdown-waiting-icon">⏳</div>
    <div class="markdown-waiting-title">Waiting for Input</div>
    <div class="markdown-waiting-subtitle">This node is connected to an input source. Execute the workflow to see the rendered markdown content.</div>
    <div class="markdown-waiting-note">Manual content will be overridden</div>
  `;
    mainContainer.appendChild(overlay);
    node.addDOMWidget("waiting_overlay", "div", mainContainer, {});
    if (node.size[0] < 400)
        node.size[0] = 400;
    if (node.size[1] < 350)
        node.size[1] = 350;
}
export function parseMarkdownSimple(text) {
    if (!text)
        return "";
    const lines = text.split('\n');
    let html = '', inCodeBlock = false, inList = false, listType = null;
    for (const line of lines) {
        if (line.startsWith('```')) {
            html += inCodeBlock ? '</code></pre>' : '<pre><code>';
            inCodeBlock = !inCodeBlock;
            continue;
        }
        if (inCodeBlock) {
            html += escapeHtml(line) + '\n';
            continue;
        }
        const closeList = () => {
            if (inList) {
                html += `</${listType}>`;
                inList = false;
                listType = null;
            }
        };
        const trimmed = line.trim();
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            if (!inList || listType !== 'ul') {
                closeList();
                html += '<ul>';
                inList = true;
                listType = 'ul';
            }
            html += `<li>${processInline(trimmed.substring(2))}</li>`;
        }
        else if (/^\d+\.\s/.test(trimmed)) {
            if (!inList || listType !== 'ol') {
                closeList();
                html += '<ol>';
                inList = true;
                listType = 'ol';
            }
            html += `<li>${processInline(trimmed.replace(/^\d+\.\s/, ''))}</li>`;
        }
        else {
            closeList();
            if (trimmed.startsWith('# '))
                html += `<h1>${processInline(trimmed.substring(2))}</h1>`;
            else if (trimmed.startsWith('## '))
                html += `<h2>${processInline(trimmed.substring(3))}</h2>`;
            else if (trimmed.startsWith('### '))
                html += `<h3>${processInline(trimmed.substring(4))}</h3>`;
            else if (trimmed.startsWith('> '))
                html += `<blockquote>${processInline(trimmed.substring(2))}</blockquote>`;
            else if (trimmed)
                html += `<p>${processInline(line)}</p>`;
        }
    }
    if (inList)
        html += `</${listType}>`;
    return html;
}
function processInline(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/~~(.*?)~~/g, '<del>$1</del>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
}
export function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
