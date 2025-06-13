import { app } from "scripts/app.js";
import { StoryboardBaseNode } from "../base_node.js";
import type { IWidget, LGraphNode } from "@comfyorg/litegraph";
import { log } from "../../../common/shared_utils.js";
import { LiteGraph } from "@comfyorg/litegraph";

interface ConnectedNodeWidget {
  name: string;
  value: any;
  type?: string;
}

interface FieldEntry {
  name: string;
  value: string;
  rawValue: any;
  type?: string;
}

export class FieldInspectorNode extends StoryboardBaseNode {
  static override title = "🔍 Field Inspector";
  static override type = "FieldInspector";
  static override category = "storyboard/Debug";
  static override _category = "storyboard/Debug";

  _connectedNode: LGraphNode | null = null;
  _availableFields: string[] = [];
  _fieldEntries: FieldEntry[] = [];
  _selectedFieldName: string = "";
  _updateInterval: number | null = null;

  // Get the input socket type color from the inspector node itself
  private getInputSocketTypeColor(): string {
    // Get the color of our own input socket (the type flowing through the inspector)
    if (this.inputs?.[0]) {
      const inputType = String(this.inputs[0].type);

      // Use LiteGraph's built-in color system
      const canvas = (app as any).canvas;
      if (canvas?.default_connection_color_byType) {
        const color = canvas.default_connection_color_byType[inputType.toUpperCase()];
        if (color) {
          return color;
        }
      }

      // If that fails, try LiteGraph directly
      if ((window as any).LiteGraph?.getConnectionColor) {
        const color = (window as any).LiteGraph.getConnectionColor(inputType);
        if (color) {
          return color;
        }
      }
    }

    // Fallback to a neutral color
    return '#888888';
  }

  constructor(title = FieldInspectorNode.title) {
    super(title);
    log(this.type, "Constructor called");
  }

  protected override onConstructed() {
    if (this.__constructed__) return false;
    log(this.type, "Node constructed");

    // Initialize node state
    this._connectedNode = null;
    this._availableFields = [];
    this._fieldEntries = [];
    this._selectedFieldName = "";
    this._updateInterval = null;

    // Initialize backend widget properties to prevent validation errors
    if (!this.properties) this.properties = {};
    this.properties["selected_fieldname"] = "";
    this.properties["field_name_input"] = "";
    this.properties["selected_value"] = "";

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
      (cloned as any)._connectedNode = null; // Reset connection for cloned node
      (cloned as any)._availableFields = [...this._availableFields];
      (cloned as any)._fieldEntries = [...this._fieldEntries];
      (cloned as any)._selectedFieldName = this._selectedFieldName;
      (cloned as any)._updateInterval = null; // Reset interval
      log(this.type, "State properties copied");

      // Ensure properties are properly copied
      if (!cloned.properties) cloned.properties = {};
      cloned.properties['selected_fieldname'] = this.properties?.['selected_fieldname'] || "";
      cloned.properties['field_name'] = this.properties?.['field_name'] || "";
      cloned.properties['selected_value'] = this.properties?.['selected_value'] || "";
      log(this.type, "Properties copied to cloned node");

      // Call onConstructed to ensure proper initialization
      (cloned as any).onConstructed();
      log(this.type, "Cloned node constructed");
    }
    return cloned;
  }

  private findWidgetByName(node: LGraphNode, name: string): ConnectedNodeWidget | null {
    if (!node.widgets) return null;

    const widget = node.widgets.find((w: IWidget) => w.name === name);
    return widget ? {
      name: widget.name,
      value: (widget as any).value,
      type: (widget as any).type
    } : null;
  }

  private formatWidgetValue(widget: ConnectedNodeWidget): string {
    if (widget.value === null || widget.value === undefined) {
      return "";
    }

    if (typeof widget.value === "object") {
      try {
        return JSON.stringify(widget.value, null, 2);
      } catch {
        return String(widget.value);
      }
    }

    return String(widget.value);
  }

  private getAllFieldEntries(node: LGraphNode): FieldEntry[] {
    if (!node || !node.widgets) return [];

    return node.widgets
      .filter((widget: IWidget) => widget.name && widget.name !== "preview")
      .map((widget: IWidget) => {
        const value = (widget as any).value;
        return {
          name: widget.name,
          value: this.formatWidgetValue({ name: widget.name, value, type: (widget as any).type }),
          rawValue: value,
          type: (widget as any).type
        };
      });
  }

  private createFieldsDisplayWidget() {
    // Remove ALL existing field widgets
    if (this.widgets) {
      // Remove all field-related widgets (fields_display, field_0, field_1, etc.)
      const widgetsToRemove = this.widgets.filter((w: any) =>
        w.name === "fields_display" ||
        w.name === "truncated_info" ||
        w.name.startsWith("field_")
      );

      for (const widget of widgetsToRemove) {
        // Call cleanup if available
        if (widget && widget.onRemove) {
          widget.onRemove();
        }
        // Remove from array
        const index = this.widgets.indexOf(widget);
        if (index > -1) {
          this.widgets.splice(index, 1);
        }
      }
    }

    if (!this._fieldEntries.length) {
      // Show "No connection" message using a simple text widget
      const message = this._connectedNode ? "No fields found" : "Connect a node to inspect its fields";

      // Create a simple text display instead of custom widget
      if (!this.widgets) this.widgets = [];

      const textWidget = {
        name: "fields_display",
        type: "button", // Use button type to avoid text editing
        value: message,
        options: { readonly: true },
        y: 0,
        serialize: false,
        draw: function (ctx: any, node: any, widgetWidth: number, y: number, widgetHeight: number) {
          ctx.fillStyle = "#555";
          ctx.fillRect(0, y, widgetWidth, widgetHeight);
          ctx.fillStyle = "#888";
          ctx.font = "12px Arial";
          ctx.fillText(this.value, 10, y + 15);
          return widgetHeight;
        },
        computeSize: function (width: number) {
          return [width, 25];
        },
        mouse: function () { return false; }
      };

      this.widgets.push(textWidget as any);
      return;
    }

    // Create a simple field list instead of complex table
    if (!this.widgets) this.widgets = [];

    const self = this;

    // Add clickable field list (show max 10 fields to avoid excessive length)
    const fieldsToShow = this._fieldEntries.slice(0, 10);
    fieldsToShow.forEach((entry, index) => {
      const fieldName = entry.name; // Capture the field name
      // Truncate long values for display
      const displayValue = entry.value.length > 25 ? entry.value.substring(0, 25) + "..." : entry.value;
      // Format with type information
      const typeDisplay = entry.type ? ` (${entry.type})` : '';
      const fieldDisplayText = `${entry.name}${typeDisplay}: ${displayValue}`;

      const fieldWidget = {
        name: `field_${index}`,
        type: "button", // Use button type to avoid text editing
        value: fieldDisplayText,
        options: { readonly: true },
        y: 0,
        serialize: false,
        draw: function (ctx: any, node: any, widgetWidth: number, y: number, widgetHeight: number) {
          const isSelected = fieldName === self._selectedFieldName;

          // Use different background colors for selection vs normal
          if (isSelected) {
            // Selected item gets a brighter blue background
            ctx.fillStyle = "#4a7dc4";
          } else {
            // Normal items get dark background
            ctx.fillStyle = "#444";
          }
          ctx.fillRect(0, y, widgetWidth, widgetHeight);

          // Draw input socket type color circle (same for all fields)
          const typeColor = (self as any).getInputSocketTypeColor();
          ctx.fillStyle = typeColor;
          ctx.beginPath();
          ctx.arc(15, y + 10, 4, 0, 2 * Math.PI);
          ctx.fill();

          // Draw selection indicator with a distinct accent color
          if (isSelected) {
            ctx.fillStyle = "#ffa500"; // Orange selection indicator
            ctx.beginPath();
            ctx.arc(15, y + 10, 6, 0, 2 * Math.PI);
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          // Draw field name and type in one color, value in another
          const nameTypeText = `${entry.name}${typeDisplay}:`;
          const valueText = ` ${displayValue}`;

          ctx.font = "12px Arial";

          // Draw field name and type (shifted right to make room for circle)
          ctx.fillStyle = isSelected ? "#fff" : "#fff";
          ctx.fillText(nameTypeText, 25, y + 15);

          // Calculate width of name+type to position value text
          const nameTypeWidth = ctx.measureText(nameTypeText).width;

          // Draw value in slightly dimmed color
          ctx.fillStyle = isSelected ? "#e0e0e0" : "#aaa";
          ctx.fillText(valueText, 25 + nameTypeWidth, y + 15);

          return widgetHeight;
        },
        computeSize: function (width: number) {
          return [width, 20];
        },
        mouse: function (event: any, pos: any, node: any) {
          console.log("Widget mouse event:", event.type, "for field:", fieldName);

          if (event.type === "pointerdown" || event.type === "pointerup" || event.type === "click" || event.type === "mousedown" || event.type === "mouseup") {
            console.log("Processing click for field:", fieldName);
            log(self.type, `Field widget clicked: ${fieldName} (${entry.type || 'unknown'})`);

            // Call selectField directly on the node instance
            try {
              (self as any).selectField(fieldName);
              console.log("selectField called successfully");
            } catch (e) {
              console.error("Error calling selectField:", e);
            }

            // Force canvas redraw
            if ((app as any).graph) {
              (app as any).graph.setDirtyCanvas(true, false);
            }
            return true;
          }
          return false;
        }
      };

      self.widgets.push(fieldWidget as any);
    });

    // Add info about truncated fields if any
    if (this._fieldEntries.length > 10) {
      const truncatedWidget = {
        name: "truncated_info",
        type: "button",
        value: `... and ${this._fieldEntries.length - 10} more fields`,
        options: { readonly: true },
        y: 0,
        serialize: false,
        draw: function (ctx: any, node: any, widgetWidth: number, y: number, widgetHeight: number) {
          ctx.fillStyle = "#333";
          ctx.fillRect(0, y, widgetWidth, widgetHeight);
          ctx.fillStyle = "#888";
          ctx.font = "italic 11px Arial";
          ctx.fillText(this.value, 10, y + 15);
          return widgetHeight;
        },
        computeSize: function (width: number) {
          return [width, 18];
        },
        mouse: function () { return false; }
      };
      this.widgets.push(truncatedWidget as any);
    }
  }

  override addCustomWidget<T extends IWidget>(custom_widget: T): T {
    if (!this.widgets) this.widgets = [];
    this.widgets.push(custom_widget);
    return custom_widget;
  }

  private selectField(fieldName: string) {
    this._selectedFieldName = fieldName;

    const fieldEntry = this._fieldEntries.find(f => f.name === fieldName);
    if (!fieldEntry) return;

    // Update backend widget values (these are created by ComfyUI from the backend schema)
    const selectedFieldnameWidget = this.widgets?.find((w: any) => w.name === "selected_fieldname");
    const selectedValueWidget = this.widgets?.find((w: any) => w.name === "selected_value");

    if (selectedFieldnameWidget) {
      selectedFieldnameWidget.value = fieldName;
    }
    if (selectedValueWidget) {
      selectedValueWidget.value = fieldEntry.value;
    }

    // Update properties for backend (including hidden field_name_input)
    if (!this.properties) this.properties = {};
    this.properties["selected_fieldname"] = fieldName;
    this.properties["field_name_input"] = fieldName;
    this.properties["selected_value"] = fieldEntry.value;

    // Force redraw to update UI
    if (app.graph) {
      app.graph.setDirtyCanvas(true, false);
    }
  }

  private updateFieldsDisplay() {
    if (!this._connectedNode) {
      this._fieldEntries = [];
      this.createFieldsDisplayWidget();
      return;
    }

    // Get fresh field data
    const newFieldEntries = this.getAllFieldEntries(this._connectedNode);
    this._availableFields = newFieldEntries.map(f => f.name);

    // Only update if entries actually changed
    const currentEntriesStr = newFieldEntries.map(e => `${e.name}:${e.value}`).join('|');
    const previousEntriesStr = this._fieldEntries.map(e => `${e.name}:${e.value}`).join('|');

    if (currentEntriesStr !== previousEntriesStr) {
      this._fieldEntries = newFieldEntries;

      // Only log when there are actual changes - reduced verbosity
      log(this.type, `Fields updated for '${this._connectedNode.title}' (${this._fieldEntries.length} fields)`);

      // Recreate the display widget with new data
      this.createFieldsDisplayWidget();

      // If no field is selected and we have fields, select the first one
      if (!this._selectedFieldName && this._fieldEntries.length > 0 && this._fieldEntries[0]) {
        this.selectField(this._fieldEntries[0].name);
      }
    }
  }

  private startPeriodicUpdates() {
    this.stopPeriodicUpdates();

    // Update field values every 500ms when connected
    this._updateInterval = setInterval(() => {
      if (this._connectedNode) {
        const previousEntries = this._fieldEntries.map(e => `${e.name}:${e.value}`).join('|');
        const newEntries = this.getAllFieldEntries(this._connectedNode);
        const currentEntries = newEntries.map(e => `${e.name}:${e.value}`).join('|');

        // Only update display if something actually changed
        if (currentEntries !== previousEntries) {
          this._fieldEntries = newEntries;
          this.createFieldsDisplayWidget();

          // Update selected field value if it's still selected
          if (this._selectedFieldName) {
            const currentField = this._fieldEntries.find(f => f.name === this._selectedFieldName);
            if (currentField) {
              this.selectField(this._selectedFieldName);
            }
          }

          // Force redraw
          if (app.graph) {
            app.graph.setDirtyCanvas(true, false);
          }
        }
      }
    }, 500);
  }

  private stopPeriodicUpdates() {
    if (this._updateInterval !== null) {
      clearInterval(this._updateInterval);
      this._updateInterval = null;
    }
  }

  private inspectConnectedNode(connectedNode: LGraphNode | null) {
    this._connectedNode = connectedNode;

    if (!connectedNode) {
      this._availableFields = [];
      this._fieldEntries = [];
      this._selectedFieldName = "";
      this.stopPeriodicUpdates();
      this.updateFieldsDisplay();
      return;
    }

    this.updateFieldsDisplay();
    this.startPeriodicUpdates();
  }

  override onConnectionsChange(type: number, index: number, connected: boolean, linkInfo: any, inputOrOutput: any) {
    // Only handle input connections to the first slot (source_node)
    if (type === 1 && index === 0) { // type 1 = input
      if (connected && linkInfo) {
        // Find the connected node
        const link = app.graph.links[linkInfo.id];
        if (link) {
          const connectedNode = app.graph.getNodeById(link.origin_id);
          if (connectedNode) {
            this.inspectConnectedNode(connectedNode);
          }
        }
      } else {
        // Connection removed
        this.inspectConnectedNode(null);
        // Clear widget values
        const selectedFieldnameWidget = this.widgets?.find((w: any) => w.name === "selected_fieldname");
        const selectedValueWidget = this.widgets?.find((w: any) => w.name === "selected_value");
        if (selectedFieldnameWidget) selectedFieldnameWidget.value = "";
        if (selectedValueWidget) selectedValueWidget.value = "";
      }
    }
  }

  override onNodeCreated() {
    log(this.type, "Node created");

    // Initialize state
    this._connectedNode = null;
    this._availableFields = [];
    this._fieldEntries = [];
    this._selectedFieldName = "";
    if (!this.properties) this.properties = {};

    // Initialize backend widget properties to prevent validation errors
    this.properties["selected_fieldname"] = "";
    this.properties["field_name"] = "";
    this.properties["selected_value"] = "";

    // Ensure backend widgets exist (these are created by ComfyUI from the backend schema)
    // We need to let ComfyUI create these widgets first, then set their values
    setTimeout(() => {
      // Debug: log all available widgets
      log(this.type, "Available widgets:", this.widgets?.map((w: any) => w.name) || []);

      const selectedFieldnameWidget = this.widgets?.find((w: any) => w.name === "selected_fieldname");
      const selectedValueWidget = this.widgets?.find((w: any) => w.name === "selected_value");

      if (selectedFieldnameWidget) selectedFieldnameWidget.value = "";
      if (selectedValueWidget) selectedValueWidget.value = "";

      log(this.type, "Backend widgets initialized:", {
        selectedFieldnameWidget: !!selectedFieldnameWidget,
        selectedValueWidget: !!selectedValueWidget
      });
    }, 10);

    // Create the initial display immediately
    this.updateFieldsDisplay();
  }

  override onConfigure(info: any) {
    log(this.type, "Configuring node with info:", info);

    // Check if we have an input connection
    const hasConnection = Boolean(this.inputs?.[0]?.link);
    log(this.type, "Has input connection:", hasConnection);

    // Reset state for configuration
    if (!hasConnection) {
      this._connectedNode = null;
      this._availableFields = [];
      this._fieldEntries = [];
      this._selectedFieldName = "";
      this.stopPeriodicUpdates();
    } else {
      // Only restore selected field if we have a connection
      // Restore selected field from properties if available
      if (this.properties?.['selected_fieldname']) {
        this._selectedFieldName = this.properties['selected_fieldname'] as string;
      } else if (this.properties?.['field_name_input']) {
        this._selectedFieldName = this.properties['field_name_input'] as string;
      }
    }

    this.updateFieldsDisplay();
  }

  override onExecute() {
    // Ensure hidden field_name_input property is set before execution
    if (!this.properties) this.properties = {};
    if (!this.properties["field_name_input"]) {
      this.properties["field_name_input"] = this._selectedFieldName || "";
    }
  }

  override onRemoved() {
    this.stopPeriodicUpdates();
    super.onRemoved?.();
  }

  override computeSize(out?: any): any {
    // Dynamic size based on number of displayed fields (max 10)
    const baseWidth = 320;
    const baseHeight = 90; // Reduced base height
    const lineHeight = 20;
    const truncatedInfoHeight = (this._fieldEntries?.length || 0) > 10 ? 18 : 0;
    const topPadding = 5; // Minimal top padding
    const bottomPadding = 5; // Minimal bottom padding

    // Handle case where _fieldEntries might be undefined during initial construction
    const fieldCount = Math.min(this._fieldEntries?.length || 0, 10);
    const additionalHeight = Math.max(0, fieldCount * lineHeight + truncatedInfoHeight + topPadding + bottomPadding);

    return [baseWidth, baseHeight + additionalHeight] as any;
  }
}

// Register the node type
if (!(window as any).__fieldInspectorRegistered) {
  (window as any).__fieldInspectorRegistered = true;

  app.registerExtension({
    name: "comfyui-storyboard.field-inspector",
    async beforeRegisterNodeDef(nodeType: any, nodeData: any) {
      if (nodeData.name === "FieldInspector") {
        log("FieldInspector", "Registering node type");
        log("FieldInspector", "Node data:", nodeData);

        // Copy methods individually to avoid prototype issues
        const methods = [
          "onConnectionsChange",
          "onExecute",
          "onConfigure",
          "onNodeCreated",
          "onRemoved",
          "clone",
          "onConstructed",
          "checkAndRunOnConstructed",
          "inspectConnectedNode",
          "updateFieldsDisplay",
          "selectField",
          "findWidgetByName",
          "formatWidgetValue",
          "getAllFieldEntries",
          "createFieldsDisplayWidget",
          "startPeriodicUpdates",
          "stopPeriodicUpdates",
          "computeSize",
          "getInputSocketTypeColor"
        ];

        for (const method of methods) {
          const prototype = FieldInspectorNode.prototype as any;
          if (prototype[method]) {
            nodeType.prototype[method] = prototype[method];
            log("FieldInspector", `Copied method: ${method}`);
          }
        }

        // Copy static properties
        nodeType.title = FieldInspectorNode.title;
        nodeType.type = FieldInspectorNode.type;
        nodeType.category = FieldInspectorNode.category;
        nodeType._category = FieldInspectorNode._category;
        log("FieldInspector", "Static properties copied");

        // Register the node type with LiteGraph
        if (FieldInspectorNode.type) {
          log("FieldInspector", "Registering node type with LiteGraph");
          LiteGraph.registerNodeType(FieldInspectorNode.type, nodeType);
        }

        // Set up the node type
        FieldInspectorNode.setUp();
      }
    },

    nodeCreated(node: any) {
      if (node.comfyClass === "FieldInspector") {
        log("FieldInspector", "Node instance created");
        log("FieldInspector", "Node properties:", node.properties);

        // Initialize node state
        node._connectedNode = null;
        node._availableFields = [];
        node._fieldEntries = [];
        node._selectedFieldName = "";
        node._updateInterval = null;

        // Initialize backend widget properties to prevent validation errors
        if (!node.properties) node.properties = {};
        node.properties["selected_fieldname"] = "";
        node.properties["field_name_input"] = "";
        node.properties["selected_value"] = "";

        log("FieldInspector", "Node state initialized");

        // Ensure backend widgets have default values
        setTimeout(() => {
          // Debug: log all available widgets
          log("FieldInspector", "Available widgets:", node.widgets?.map((w: any) => w.name) || []);

          const selectedFieldnameWidget = node.widgets?.find((w: any) => w.name === "selected_fieldname");
          const selectedValueWidget = node.widgets?.find((w: any) => w.name === "selected_value");

          if (selectedFieldnameWidget) selectedFieldnameWidget.value = "";
          if (selectedValueWidget) selectedValueWidget.value = "";

          log("FieldInspector", "Backend widgets initialized in nodeCreated");
        }, 10);

        // Call onConstructed to ensure proper initialization
        node.onConstructed?.();
        log("FieldInspector", "Node constructed");
      }
    }
  });
} 