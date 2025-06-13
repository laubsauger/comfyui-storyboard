import { app } from "scripts/app.js";
import { StoryboardBaseNode } from "../base_node.js";
import { showEditor, showWaitingForInput } from "./markdown_widget.js";
import { renderMarkdownToHtml } from "./markdown_utils.js";
import { log } from "../../../common/shared_utils.js";
import { LiteGraph } from "@comfyorg/litegraph";

export function setupMarkdownRenderer(nodeType: any, nodeData: any) {
  // Setup any node-specific configuration here
}

export function handleMarkdownRendererCreated(node: any) {
  // Handle any node creation specific logic here
}

export class MarkdownRendererNode extends StoryboardBaseNode {
  static override title = "Markdown Renderer";
  static override type = "MarkdownRenderer";
  static override category = "storyboard";
  static override _category = "storyboard"; // Keep category consistent

  _hasInputConnection = false;
  _editableContent = "";
  _storedHtml = "";
  _sourceText = "";
  _hasReceivedData = false;
  _isUpdatingUI = false; // Add flag to prevent concurrent UI updates
  _updateUITimeout: number | null = null; // Debounce timeout

  constructor(title = MarkdownRendererNode.title) {
    super(title); // Remove skipOnConstructedCall parameter
    log(this.type, "Constructor called");
  }

  protected override onConstructed() {
    if (this.__constructed__) return false;
    log(this.type, "Node constructed");

    // Initialize node state
    this._hasInputConnection = false;
    this._editableContent = "";
    this._storedHtml = "";
    this._sourceText = "";
    this._hasReceivedData = false;
    this._isUpdatingUI = false;
    this._updateUITimeout = null;

    // This is kinda a hack, but if this.type is still null, then set it to undefined to match
    this.type = this.type ?? undefined;
    this.__constructed__ = true;

    // Notify extensions that this node was created
    app.graph?.trigger("nodeCreated", this);

    log(this.type, "Node state initialized");
    return this.__constructed__;
  }

  override clone() {
    log(this.type, "Cloning node");
    const cloned = super.clone()!;
    if (cloned) {
      log(this.type, "Cloned node properties:", cloned.properties);

      // Deep clone properties using structuredClone if available
      if (cloned.properties && !!window.structuredClone) {
        cloned.properties = structuredClone(cloned.properties);
        log(this.type, "Properties deep cloned");
      }

      // Copy all state properties
      (cloned as any)._hasInputConnection = this._hasInputConnection;
      (cloned as any)._editableContent = this._editableContent;
      (cloned as any)._storedHtml = this._storedHtml;
      (cloned as any)._sourceText = this._sourceText;
      (cloned as any)._hasReceivedData = this._hasReceivedData;
      (cloned as any)._isUpdatingUI = false; // Reset UI update flag
      (cloned as any)._updateUITimeout = null; // Reset timeout
      log(this.type, "State properties copied");

      // Ensure properties are properly copied
      if (!cloned.properties) cloned.properties = {};
      cloned.properties['text'] = this._editableContent;
      cloned.properties['storedHtml'] = this._storedHtml;
      cloned.properties['sourceText'] = this._sourceText;
      log(this.type, "Properties copied to cloned node");

      // Force clean widget removal from the clone
      if (cloned.widgets) {
        cloned.widgets.length = 0; // Clear widgets array completely
      }

      // Call onConstructed to ensure proper initialization
      (cloned as any).onConstructed();
      log(this.type, "Cloned node constructed");

      // Set node size before UI update
      // if (cloned.size[0] < 400) cloned.size[0] = 400;
      // if (cloned.size[1] < 350) cloned.size[1] = 350;

      // Update UI (now debounced to avoid race conditions)
      (cloned as any).updateUI();
      log(this.type, "Cloned node UI updated");
    }
    return cloned;
  }

  override onConnectionsChange(type: number, index: number, connected: boolean, linkInfo: any, inputOrOutput: any) {
    if (type === 1 && index === 0) { // type 1 = input, index 0 = first input
      log(this.type, "Input connection changed:", connected);
      this._hasInputConnection = connected;
      // If we're disconnecting, reset the received data flag
      if (!connected) {
        this._hasReceivedData = false;
      }
      this.updateUI();
    }
  }

  override onExecute() {
    // This is a placeholder, backend execution is handled by onExecuted
  }

  onExecuted(result: any) {
    log(this.type, "Node executed with result:", result);

    // The Python backend returns the content of the "ui" key.
    // result should be: { text: [string], html: [string] }
    if (result && result.text) {
      // Handle array format (expected) - take the first item
      let textContent = result.text;
      log(this.type, "DEBUG: result.text:", result.text, "isArray:", Array.isArray(textContent));
      if (Array.isArray(textContent)) {
        log(this.type, "DEBUG: array length:", textContent.length, "first item:", textContent[0]);
        textContent = textContent[0] || "";
      } else if (typeof textContent !== 'string') {
        log(this.type, "WARNING: result.text is not string or array, coercing", textContent);
        textContent = String(textContent);
      }
      log(this.type, "DEBUG: final textContent:", textContent);
      this._sourceText = textContent;
      this._editableContent = this._sourceText;

      // Always use frontend renderer for HTML content
      this._storedHtml = renderMarkdownToHtml(this._sourceText);

      this._hasReceivedData = true;

      // Update properties for persistence
      if (!this.properties) this.properties = {};
      this.properties['storedHtml'] = this._storedHtml;
      this.properties['sourceText'] = this._sourceText;
      this.properties['text'] = this._sourceText;

      log(this.type, "Received data - sourceText length:", this._sourceText.length, "storedHtml length:", this._storedHtml.length);

      // Update UI to show the received content
      this.updateUI();
    } else {
      log(this.type, "No valid data received from backend");
    }
  }

  override onConfigure(info: any) {
    log(this.type, "Configuring node with info:", info);

    // Restore stored content from properties if available
    if (this.properties) {
      const props = this.properties as Record<string, any>;
      if (props['storedHtml']) {
        log(this.type, "Restoring stored HTML from properties");
        this._storedHtml = String(props['storedHtml']);
        this._sourceText = String(props['sourceText'] || "");
        this._hasReceivedData = true;
      }
      if (props['text']) {
        log(this.type, "Restoring text content from properties");
        this._editableContent = String(props['text']);
      }
    }

    // Clean up widgets before reconfiguring
    this.cleanupAllWidgets();

    // Check if we have an input connection
    const hasConnection = Boolean(this.inputs?.[0]?.link);
    log(this.type, "Has input connection:", hasConnection, "Has received data:", this._hasReceivedData);

    // Update connection state
    this._hasInputConnection = hasConnection;
    if (!hasConnection) {
      this._hasReceivedData = false;
    }

    // Set node size before UI update
    // if (this.size[0] < 400) this.size[0] = 400;
    // if (this.size[1] < 350) this.size[1] = 350;

    // Update UI (now debounced)
    this.updateUI();
  }

  override onNodeCreated() {
    log(this.type, "Node created");
    // Check for existing input connections (for loaded workflows)
    if (this.inputs && this.inputs[0] && this.inputs[0].link) {
      log(this.type, "Found existing input connection");
      this._hasInputConnection = true;
    } else {
      // If no connection, ensure we're in standalone mode
      this._hasInputConnection = false;
      this._hasReceivedData = false;
    }

    this.updateUI();
  }

  private updateUI() {
    // Clear any existing timeout
    if (this._updateUITimeout !== null) {
      clearTimeout(this._updateUITimeout);
      this._updateUITimeout = null;
    }

    // Debounce UI updates to prevent multiple rapid calls
    this._updateUITimeout = setTimeout(() => {
      this._updateUITimeout = null;
      this.doUpdateUI();
    }, 25); // Short delay to debounce rapid calls
  }

  private doUpdateUI() {
    // Prevent concurrent UI updates
    if (this._isUpdatingUI) {
      log(this.type, "UI update already in progress, skipping");
      return;
    }

    this._isUpdatingUI = true;
    log(this.type, "Updating UI - hasInputConnection:", this._hasInputConnection, "hasReceivedData:", this._hasReceivedData, "hasContent:", Boolean(this._editableContent), "hasStoredHtml:", Boolean(this._storedHtml));

    try {
      // Force complete widget cleanup
      this.cleanupAllWidgets();

      // Set node size before widget creation - increased width for better content display
      // if (this.size[0] < 480) this.size[0] = 480; // Increased minimum width to prevent cutoff
      // if (this.size[1] < 350) this.size[1] = 350;

      // Show waiting UI if we have an input connection but no data received
      // This takes priority over having editable content
      if (this._hasInputConnection && !this._hasReceivedData && !this._storedHtml) {
        log(this.type, "Showing waiting UI - connected but no data received");
        showWaitingForInput(this);
      }
      // Show editor in all other cases (no connection, has data, has stored content)
      else {
        log(this.type, "Showing editor - has content, data, or no connection");
        showEditor(this);
      }

      // Force a size recalculation to remove any reserved space
      if (typeof this.computeSize === 'function') {
        this.computeSize();
      }
      if (this.graph && typeof this.graph.setDirtyCanvas === 'function') {
        this.graph.setDirtyCanvas(true, true);
      }
    } finally {
      this._isUpdatingUI = false;
    }
  }

  private cleanupAllWidgets() {
    if (!this.widgets) return;

    log(this.type, "Cleaning up widgets, current count:", this.widgets.length);

    // Create a copy of the widgets array to avoid modification during iteration
    const widgetsToRemove = [...this.widgets];

    for (const widget of widgetsToRemove) {
      if (widget.name === 'markdown_widget' || widget.name === 'markdown_editor' || widget.name === 'text') {
        log(this.type, "Removing widget:", widget.name);

        // Call widget's cleanup function first
        if (typeof widget.onRemove === 'function') {
          widget.onRemove();
        }

        // Use ComfyUI's removeWidget method if available
        if (typeof this.removeWidget === 'function') {
          this.removeWidget(widget);
        } else {
          // Fallback: manual removal
          const element = (widget as any).element;
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

    // Final cleanup: remove any remaining markdown widgets
    this.widgets = this.widgets.filter(w =>
      w.name !== 'markdown_widget' && w.name !== 'markdown_editor' && w.name !== 'text'
    );

    log(this.type, "Widgets after cleanup:", this.widgets.length);
  }

  override onRemoved(): void {
    // Clear any pending UI update timeout
    if (this._updateUITimeout !== null) {
      clearTimeout(this._updateUITimeout);
      this._updateUITimeout = null;
    }

    // Clean up all widgets
    this.cleanupAllWidgets();

    super.onRemoved?.();
  }

  override computeSize(out?: any): any {
    // Respect current node size but enforce minimum dimensions
    const minW = 280;
    const minH = 240; // Increased default height for better editor area
    // If this.size is defined, ensure we don't shrink the node when the user has resized it manually
    const curW = Array.isArray(this.size) ? this.size[0] : minW;
    const curH = Array.isArray(this.size) ? this.size[1] : minH;
    return [Math.max(curW, minW), Math.max(curH, minH)] as any;
  }

  // override onResize(size: any): void {
  //   (this as any).updateDOMSize?.();
  //   super.onResize?.(size);
  // }
}

// Register the node type
if (!(window as any).__mdRendererRegistered) {
  (window as any).__mdRendererRegistered = true;

  app.registerExtension({
    name: "comfyui-storyboard.markdown-renderer",
    async beforeRegisterNodeDef(nodeType: any, nodeData: any) {
      if (nodeData.name === "MarkdownRenderer") {
        log("MarkdownRenderer", "Registering node type");
        log("MarkdownRenderer", "Node data:", nodeData);

        // Copy methods individually to avoid prototype issues
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
          const prototype = MarkdownRendererNode.prototype as any;
          if (prototype[method]) {
            nodeType.prototype[method] = prototype[method];
            log("MarkdownRenderer", `Copied method: ${method}`);
          }
        }

        // Copy static properties
        nodeType.title = MarkdownRendererNode.title;
        nodeType.type = MarkdownRendererNode.type;
        nodeType.category = MarkdownRendererNode.category;
        nodeType._category = MarkdownRendererNode._category;
        log("MarkdownRenderer", "Static properties copied");

        // Register the node type with LiteGraph
        if (MarkdownRendererNode.type) {
          log("MarkdownRenderer", "Registering node type with LiteGraph");
          LiteGraph.registerNodeType(MarkdownRendererNode.type, nodeType);
        }

        // Set up the node type
        MarkdownRendererNode.setUp();
      }
    },

    nodeCreated(node: any) {
      if (node.comfyClass === "MarkdownRenderer") {
        log("MarkdownRenderer", "Node instance created");
        log("MarkdownRenderer", "Node properties:", node.properties);

        // Initialize node state
        node._hasInputConnection = false;
        node._editableContent = "";
        node._storedHtml = "";
        node._sourceText = "";
        node._hasReceivedData = false;
        log("MarkdownRenderer", "Node state initialized");

        // Call onConstructed to ensure proper initialization
        node.onConstructed?.();
        log("MarkdownRenderer", "Node constructed");
      }
    }
  });
}