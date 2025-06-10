import { app } from "scripts/app.js";
import { showEditor, restoreRenderedContent, showWaitingForInput, populateMarkdownWidget, } from "./markdown_renderer.js";
const LOG_LEVEL = 4;
const LOGGER_PREFIX = "[Storyboard]";
class Storyboard extends EventTarget {
    constructor() {
        super();
        this.log(3, "Initialized");
        this.injectCss();
    }
    injectCss() {
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "extensions/comfyui-storyboard/storyboard.css";
        document.head.appendChild(link);
    }
    log(level, message, ...args) {
        if (level > LOG_LEVEL) {
            return;
        }
        const logFn = level === 1 ? "error" : level === 2 ? "warn" : "info";
        console[logFn](`${LOGGER_PREFIX} ${message}`, ...args);
    }
    async beforeRegisterNodeDef(nodeType, nodeData) {
        if (nodeData.name === "MarkdownRenderer") {
            const onExecuted = nodeType.prototype.onExecuted;
            nodeType.prototype.onExecuted = function (message) {
                onExecuted === null || onExecuted === void 0 ? void 0 : onExecuted.apply(this, arguments);
                storyboard.log(4, "Node executed with message:", message);
                if (this._hasInputConnection && message.html) {
                    this._sourceText = message.text || [];
                    this._storedHtml = message.html;
                    this._hasReceivedData = true;
                    if (!this.properties)
                        this.properties = {};
                    this.properties.storedHtml = message.html;
                    this.properties.sourceText = message.text || [];
                    populateMarkdownWidget(this, message.html);
                }
            };
            const onConfigure = nodeType.prototype.onConfigure;
            nodeType.prototype.onConfigure = function () {
                var _a;
                onConfigure === null || onConfigure === void 0 ? void 0 : onConfigure.apply(this, arguments);
                if (this.properties) {
                    if (this.properties.storedHtml) {
                        this._storedHtml = this.properties.storedHtml;
                        this._sourceText = this.properties.sourceText || [];
                        this._hasReceivedData = true;
                        storyboard.log(4, "Restored stored content in onConfigure");
                    }
                }
                if ((_a = this.widgets_values) === null || _a === void 0 ? void 0 : _a.length) {
                    const hasConnection = this.inputs && this.inputs[0] && this.inputs[0].link;
                    if (hasConnection) {
                        requestAnimationFrame(() => {
                            populateMarkdownWidget(this, this.widgets_values);
                        });
                    }
                }
            };
        }
    }
    async nodeCreated(node) {
        if (node.comfyClass === "MarkdownRenderer") {
            node.title = "📝 " + (node.title || "Markdown Renderer");
            node._hasInputConnection = false;
            node._editableContent = "";
            node._hasReceivedData = false;
            node._storedHtml = null;
            node._sourceText = null;
            if (node.inputs && node.inputs[0] && node.inputs[0].link) {
                node._hasInputConnection = true;
                storyboard.log(4, "Found existing input connection");
            }
            const originalOnConnectionsChange = node.onConnectionsChange;
            node.onConnectionsChange = function (type, index, connected, link_info) {
                originalOnConnectionsChange === null || originalOnConnectionsChange === void 0 ? void 0 : originalOnConnectionsChange.apply(this, arguments);
                if (type === 1 && index === 0) {
                    this._hasInputConnection = connected;
                    if (!connected) {
                        this._hasReceivedData = false;
                        showEditor(this);
                    }
                    else {
                        this._hasReceivedData = false;
                        showWaitingForInput(this);
                    }
                }
            };
            const initializeUI = () => {
                const hasConnection = node.inputs && node.inputs[0] && node.inputs[0].link;
                node._hasInputConnection = !!hasConnection;
                if (!node._hasInputConnection) {
                    showEditor(node);
                }
                else {
                    const hasStoredContent = node._storedHtml || (node.properties && node.properties.storedHtml);
                    if (hasStoredContent) {
                        restoreRenderedContent(node);
                    }
                    else {
                        showWaitingForInput(node);
                    }
                }
            };
            requestAnimationFrame(initializeUI);
        }
    }
}
export const storyboard = new Storyboard();
window.storyboard = storyboard;
app.registerExtension({
    name: "Comfy.Storyboard",
    beforeRegisterNodeDef: storyboard.beforeRegisterNodeDef.bind(storyboard),
    nodeCreated: storyboard.nodeCreated.bind(storyboard),
});
