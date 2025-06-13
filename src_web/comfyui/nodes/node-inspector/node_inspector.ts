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

interface InputEntry {
  name: string;
  type: string;
  value: string;
  rawValue: any;
  isConnected: boolean;
  connectedNodeTitle?: string;
  connectedNodeId?: number;
  connectedOutputIndex?: number;
  sourceType: 'widget' | 'input' | 'connected_value';
}

interface FieldEntry {
  name: string;
  value: string;
  rawValue: any;
  type?: string;
  sourceType: 'widget' | 'input' | 'connected_value';
  isConnected?: boolean;
  connectedNodeTitle?: string;
}

export class NodeInspectorNode extends StoryboardBaseNode {
  static override title = "🔍 Node Inspector";
  static override type = "NodeInspector";
  static override category = "storyboard/Debug";
  static override _category = "storyboard/Debug";

  _connectedNode: LGraphNode | null = null;
  _availableFields: string[] = [];
  _fieldEntries: FieldEntry[] = [];
  _selectedFieldNames: string[] = [];
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

  // Get socket type color for any given type
  private getSocketTypeColor(type: string | undefined): string {
    const safeType = type || '*';

    // Use LiteGraph's built-in color system
    const canvas = (app as any).canvas;
    if (canvas?.default_connection_color_byType) {
      const color = canvas.default_connection_color_byType[safeType.toUpperCase()];
      if (color) {
        return color;
      }
    }

    // If that fails, try LiteGraph directly
    if ((window as any).LiteGraph?.getConnectionColor) {
      const color = (window as any).LiteGraph.getConnectionColor(safeType);
      if (color) {
        return color;
      }
    }

    // Fallback color mapping for common types
    const typeColorMap: Record<string, string> = {
      'STRING': '#a1c181',
      'TEXT': '#a1c181',
      'INT': '#6495ed',
      'INTEGER': '#6495ed',
      'FLOAT': '#87ceeb',
      'NUMBER': '#87ceeb',
      'BOOLEAN': '#daa520',
      'BOOL': '#daa520',
      'IMAGE': '#64b5f6',
      'LATENT': '#ff6b6b',
      'CONDITIONING': '#ffd700',
      'CLIP': '#ad7be9',
      'MODEL': '#ff8c00',
      'VAE': '#20b2aa',
      'CONTROL_NET': '#ff69b4',
      'COMBO': '#4169e1',
      '*': '#999999'
    };

    return typeColorMap[safeType.toUpperCase()] || typeColorMap['*'] || '#999999';
  }

  constructor(title = NodeInspectorNode.title) {
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
    this._selectedFieldNames = [];
    this._updateInterval = null;

    // Initialize backend widget properties to prevent validation errors
    if (!this.properties) this.properties = {};
    this.properties["selected_fieldnames"] = "";
    this.properties["field_names_input"] = "";
    this.properties["selected_values"] = "";

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
      (cloned as any)._selectedFieldNames = [...this._selectedFieldNames];
      (cloned as any)._updateInterval = null; // Reset interval
      log(this.type, "State properties copied");

      // Ensure properties are properly copied
      if (!cloned.properties) cloned.properties = {};
      cloned.properties['selected_fieldnames'] = this.properties?.['selected_fieldnames'] || "";
      cloned.properties['field_names_input'] = this.properties?.['field_names_input'] || "";
      cloned.properties['selected_values'] = this.properties?.['selected_values'] || "";
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
    if (!node) return [];

    const fieldEntries: FieldEntry[] = [];

    // Get widget entries (existing functionality)
    if (node.widgets) {
      const widgetEntries = node.widgets
        .filter((widget: IWidget) => widget.name && widget.name !== "preview")
        .map((widget: IWidget) => {
          const value = (widget as any).value;
          return {
            name: widget.name,
            value: this.formatWidgetValue({ name: widget.name, value, type: (widget as any).type }),
            rawValue: value,
            type: (widget as any).type,
            sourceType: 'widget' as const,
            isConnected: false
          };
        });
      fieldEntries.push(...widgetEntries);
    }

    // Get input entries (new functionality)
    if (node.inputs) {
      const inputEntries = node.inputs.map((input, index) => {
        const isConnected = Boolean(input.link);
        let value = "";
        let rawValue: any = null;
        let connectedNodeTitle = "";

        if (isConnected && input.link) {
          // Get connected node and its output value
          const link = app.graph.links[input.link];
          if (link) {
            const connectedNode = app.graph.getNodeById(link.origin_id);
            if (connectedNode) {
              connectedNodeTitle = connectedNode.title || "Unknown Node";

              // Try to get the actual value from the connected node
              const connectedValue = this.getConnectedNodeOutputValue(connectedNode, link.origin_slot);
              if (connectedValue !== null) {
                rawValue = connectedValue;
                value = this.formatValue(connectedValue);
              } else {
                value = `Connected to ${connectedNodeTitle}`;
              }
            }
          }
        } else {
          value = "Not connected";
        }

        return {
          name: input.name || `Input ${index}`,
          value: value,
          rawValue: rawValue,
          type: Array.isArray(input.type) ? input.type.join('|') : String(input.type || "*"),
          sourceType: 'input' as const,
          isConnected: isConnected,
          connectedNodeTitle: connectedNodeTitle
        };
      });
      fieldEntries.push(...inputEntries);
    }

    return fieldEntries;
  }

  private getConnectedNodeOutputValue(node: LGraphNode, outputIndex: number): any {
    if (!node) return null;

    // Try to get value from widgets first (most common case)
    if (node.widgets) {
      // For many nodes, the output value comes from a widget with the same name as the output
      const output = node.outputs?.[outputIndex];
      if (output) {
        const widget = node.widgets.find((w: IWidget) => w.name === output.name);
        if (widget) {
          return (widget as any).value;
        }
      }

      // Fallback: try to find the primary widget (first non-preview widget)
      const primaryWidget = node.widgets.find((w: IWidget) => w.name !== "preview");
      if (primaryWidget) {
        return (primaryWidget as any).value;
      }
    }

    // If no widgets, try to traverse further back in the graph
    if (node.inputs) {
      for (const input of node.inputs) {
        if (input.link) {
          const link = app.graph.links[input.link];
          if (link) {
            const sourceNode = app.graph.getNodeById(link.origin_id);
            if (sourceNode) {
              const sourceValue = this.getConnectedNodeOutputValue(sourceNode, link.origin_slot);
              if (sourceValue !== null) {
                return sourceValue;
              }
            }
          }
        }
      }
    }

    return null;
  }

  private formatValue(value: any): string {
    if (value === null || value === undefined) {
      return "";
    }

    if (typeof value === "object") {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return String(value);
      }
    }

    return String(value);
  }

  private createFieldsDisplayWidget() {
    // Remove ALL existing field widgets including scrollable ones
    if (this.widgets) {
      // Remove all field-related widgets
      const widgetsToRemove = this.widgets.filter((w: any) =>
        w.name === "fields_display" ||
        w.name === "truncated_info" ||
        w.name === "fields_scrollable" ||
        w.name === "inputs_display" ||
        w.name === "widgets_display" ||
        w.name.startsWith("field_")
      );

      for (const widget of widgetsToRemove) {
        if (widget && widget.onRemove) {
          widget.onRemove();
        }
        const index = this.widgets.indexOf(widget);
        if (index > -1) {
          this.widgets.splice(index, 1);
        }
      }
    }

    if (!this._fieldEntries.length) {
      const message = this._connectedNode ? "No fields found" : "Connect a node to inspect its fields!";

      if (!this.widgets) this.widgets = [];

      const textWidget = {
        name: "fields_display",
        type: "button",
        value: message,
        options: { readonly: true },
        y: 0,
        serialize: false,
        draw: function (ctx: CanvasRenderingContext2D, node: NodeInspectorNode, widgetWidth: number, y: number, widgetHeight: number) {
          ctx.fillStyle = "#555";
          ctx.fillRect(0, y, widgetWidth, widgetHeight);
          ctx.fillStyle = "#888";
          ctx.font = "12px Arial";
          ctx.fillText(this.value, 10, y + 15);
          return widgetHeight;
        },
        computeSize: function (width: number) {
          return [width, 26];
        },
        mouse: function () { return false; }
      };

      this.widgets.push(textWidget as any);
      return;
    }

    // Separate inputs (informational) and widgets (selectable) for better UX
    const inputEntries = this._fieldEntries.filter(entry => entry.sourceType === 'input');
    const widgetEntries = this._fieldEntries.filter(entry => entry.sourceType === 'widget');

    if (!this.widgets) this.widgets = [];

    const self = this;
    const lineHeight = 20;
    const itemPadding = 10;
    const headerHeight = 25;

    let totalHeight = 0;

    // Create widgets section (selectable) - put first since it's most important
    if (widgetEntries.length > 0) {
      const maxFieldsBeforeScroll = 8;
      const shouldScroll = widgetEntries.length > maxFieldsBeforeScroll;
      const visibleFields = shouldScroll ? maxFieldsBeforeScroll : widgetEntries.length;
      const scrollableHeight = visibleFields * lineHeight;
      const widgetSectionHeight = headerHeight + scrollableHeight;

      const widgetWidget = {
        name: "widgets_display",
        type: "button",
        value: `Widgets (${widgetEntries.length})`,
        options: { readonly: true },
        y: 0,
        serialize: false,
        scrollOffset: 0,
        _desiredHeight: widgetSectionHeight,
        last_y: 0,
        size: [0, widgetSectionHeight],
        _lastClickTime: 0,
        _lastClickedField: "",

        draw: function (ctx: any, node: any, widgetWidth: number, y: number, widgetHeight: number) {
          this.last_y = y;

          // Header
          ctx.fillStyle = "#444";
          ctx.fillRect(itemPadding, y, widgetWidth - (itemPadding * 2), headerHeight);
          ctx.fillStyle = "#aaa";
          ctx.font = "bold 12px Arial";
          ctx.fillText("Widgets (Selectable)", itemPadding + 10, y + 16);

          // Scrollable area
          const scrollAreaY = y + headerHeight;
          const totalContentHeight = widgetEntries.length * lineHeight;
          const maxScrollOffset = Math.max(0, totalContentHeight - scrollableHeight);
          this.scrollOffset = Math.max(0, Math.min(this.scrollOffset, maxScrollOffset));

          // Clipping
          ctx.save();
          ctx.beginPath();
          ctx.rect(itemPadding, scrollAreaY, widgetWidth - (itemPadding * 2), scrollableHeight);
          ctx.clip();

          ctx.fillStyle = "#333";
          ctx.fillRect(itemPadding, scrollAreaY, widgetWidth - (itemPadding * 2), scrollableHeight);

          // Visible range
          const startIndex = Math.floor(this.scrollOffset / lineHeight);
          const endIndex = Math.min(widgetEntries.length, startIndex + Math.ceil(scrollableHeight / lineHeight) + 1);

          for (let i = startIndex; i < endIndex; i++) {
            const entry = widgetEntries[i];
            if (!entry) continue;

            const fieldY = scrollAreaY + (i * lineHeight) - this.scrollOffset;
            if (fieldY + lineHeight < scrollAreaY || fieldY > scrollAreaY + scrollableHeight) continue;

            const isSelected = self._selectedFieldNames.includes(entry.name);

            // Background
            ctx.fillStyle = isSelected ? "#2d4a6b" : "#3a3a3a";
            ctx.fillRect(itemPadding, fieldY, widgetWidth - (itemPadding * 2), lineHeight);

            if (isSelected) {
              ctx.strokeStyle = "#5a7fa0";
              ctx.lineWidth = 1;
              ctx.strokeRect(itemPadding, fieldY, widgetWidth - (itemPadding * 2), lineHeight);
            }

            // Checkbox
            const checkboxSize = 12;
            const checkboxX = itemPadding + 8;
            const checkboxY = fieldY + (lineHeight - checkboxSize) / 2;

            ctx.fillStyle = isSelected ? "#4a7dc4" : "#555";
            ctx.fillRect(checkboxX, checkboxY, checkboxSize, checkboxSize);

            ctx.strokeStyle = isSelected ? "#6a9de4" : "#aaa";
            ctx.lineWidth = 1;
            ctx.strokeRect(checkboxX, checkboxY, checkboxSize, checkboxSize);

            if (isSelected) {
              ctx.strokeStyle = "#fff";
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(checkboxX + 3, checkboxY + 6);
              ctx.lineTo(checkboxX + 5, checkboxY + 8);
              ctx.lineTo(checkboxX + 9, checkboxY + 4);
              ctx.stroke();
            }

            // Widget indicator
            ctx.fillStyle = "#4a9eff";
            ctx.font = "bold 10px Arial";
            ctx.fillText("W", itemPadding + 24, fieldY + 13);

            // Type color
            const typeColor = entry.type ? (self as any).getSocketTypeColor(entry.type) : "#888";
            ctx.fillStyle = typeColor;
            ctx.beginPath();
            ctx.arc(itemPadding + 40, fieldY + 10, 4, 0, 2 * Math.PI);
            ctx.fill();

            // Text
            const displayValue = entry.value.length > 25 ? entry.value.substring(0, 25) + "..." : entry.value;
            const typeDisplay = entry.type ? ` (${entry.type})` : '';

            ctx.font = "12px Arial";
            ctx.fillStyle = "#fff";
            ctx.fillText(`${entry.name}${typeDisplay}:`, itemPadding + 50, fieldY + 15);

            const nameWidth = ctx.measureText(`${entry.name}${typeDisplay}:`).width;
            ctx.fillStyle = "#ccc";
            ctx.fillText(` ${displayValue}`, itemPadding + 50 + nameWidth, fieldY + 15);

            // Connection inheritance info for widgets (if they get value from an input)
            if (entry.isConnected && entry.connectedNodeTitle) {
              const valueWidth = ctx.measureText(` ${displayValue}`).width;
              const connectionStartX = itemPadding + 50 + nameWidth + valueWidth + 10;

              // Check if there's enough space
              if (connectionStartX < widgetWidth - 80) {
                const availableWidth = widgetWidth - connectionStartX - itemPadding - 10;
                let connectionText = ` → ${entry.connectedNodeTitle}`;

                // Truncate if necessary
                ctx.font = "10px Arial";
                let connectionWidth = ctx.measureText(connectionText).width;
                if (connectionWidth > availableWidth) {
                  const maxTitleLength = Math.floor((availableWidth - 20) / 6);
                  const truncatedTitle = entry.connectedNodeTitle.length > maxTitleLength
                    ? entry.connectedNodeTitle.substring(0, maxTitleLength) + "..."
                    : entry.connectedNodeTitle;
                  connectionText = ` → ${truncatedTitle}`;
                }

                ctx.fillStyle = isSelected ? "#a0c4e0" : "#888";
                ctx.fillText(connectionText, connectionStartX, fieldY + 15);
              }
            }
          }

          // Scrollbar
          if (totalContentHeight > scrollableHeight) {
            const scrollbarWidth = 8;
            const scrollbarHeight = (scrollableHeight / totalContentHeight) * scrollableHeight;
            const scrollbarY = scrollAreaY + (this.scrollOffset / totalContentHeight) * scrollableHeight;

            ctx.fillStyle = "#2a2a2a";
            ctx.fillRect(widgetWidth - scrollbarWidth - itemPadding, scrollAreaY, scrollbarWidth, scrollableHeight);

            ctx.fillStyle = "#888";
            ctx.fillRect(widgetWidth - scrollbarWidth - itemPadding, scrollbarY, scrollbarWidth, scrollbarHeight);

            ctx.strokeStyle = "#aaa";
            ctx.lineWidth = 1;
            ctx.strokeRect(widgetWidth - scrollbarWidth - itemPadding, scrollbarY, scrollbarWidth, scrollbarHeight);
          }

          ctx.restore();
          return widgetSectionHeight;
        },

        computeSize: function (width: number) {
          return [width, widgetSectionHeight];
        },

        mouse: function (event: any, pos: any, node: any) {
          const [localX, localY] = pos;
          const widgetRelativeY = localY - (this.last_y || 0) - headerHeight; // Account for header

          // Scrolling
          if (event.type === "wheel" || event.type === "mousewheel") {
            const delta = event.deltaY || event.wheelDelta || 0;
            this.scrollOffset += delta > 0 ? 20 : -20;

            const totalContentHeight = widgetEntries.length * lineHeight;
            const maxScrollOffset = Math.max(0, totalContentHeight - scrollableHeight);
            this.scrollOffset = Math.max(0, Math.min(this.scrollOffset, maxScrollOffset));

            if ((app as any).graph) {
              (app as any).graph.setDirtyCanvas(true, false);
            }
            return true;
          }

          // Click handling - only widgets section
          if (event.type === "pointerup" || event.type === "click") {
            const clickedIndex = Math.floor((widgetRelativeY + this.scrollOffset) / lineHeight);

            if (clickedIndex >= 0 && clickedIndex < widgetEntries.length) {
              const entry = widgetEntries[clickedIndex];
              if (!entry) return false;

              const fieldName = entry.name;

              // Prevent rapid double clicks
              const now = Date.now();
              if (this._lastClickTime && this._lastClickedField === fieldName && (now - this._lastClickTime) < 300) {
                return true;
              }
              this._lastClickTime = now;
              this._lastClickedField = fieldName;

              try {
                self.selectField(fieldName);
              } catch (e) {
                console.error("Error calling selectField:", e);
              }

              if ((app as any).graph) {
                (app as any).graph.setDirtyCanvas(true, false);
              }
              return true;
            }
          }

          return false;
        }
      };

      this.widgets.push(widgetWidget as any);
    }

    // Create inputs section (informational only) - put after widgets
    if (inputEntries.length > 0) {
      const inputSectionHeight = headerHeight + (inputEntries.length * lineHeight);
      totalHeight += inputSectionHeight;

      const inputWidget = {
        name: "inputs_display",
        type: "button",
        value: `Inputs (${inputEntries.length})`,
        options: { readonly: true },
        y: 0,
        serialize: false,
        _desiredHeight: inputSectionHeight,

        draw: function (ctx: any, node: any, widgetWidth: number, y: number, widgetHeight: number) {
          // Header
          ctx.fillStyle = "#444";
          ctx.fillRect(itemPadding, y, widgetWidth - (itemPadding * 2), headerHeight);
          ctx.fillStyle = "#aaa";
          ctx.font = "bold 12px Arial";
          ctx.fillText("Inputs", itemPadding + 10, y + 16);

          // Entries
          for (let i = 0; i < inputEntries.length; i++) {
            const entry = inputEntries[i];
            if (!entry) continue;

            const fieldY = y + headerHeight + (i * lineHeight);

            ctx.fillStyle = "#3a3a3a";
            ctx.fillRect(itemPadding, fieldY, widgetWidth - (itemPadding * 2), lineHeight);

            // Connection indicator
            const sourceIcon = entry.isConnected ? "●" : "○";
            const sourceColor = entry.isConnected ? "#46d946" : "#999";
            ctx.fillStyle = sourceColor;
            ctx.font = "12px Arial";
            ctx.fillText(sourceIcon, itemPadding + 10, fieldY + 15);

            // Type color
            const typeColor = entry.type ? (self as any).getSocketTypeColor(entry.type) : "#888";
            ctx.fillStyle = typeColor;
            ctx.beginPath();
            ctx.arc(itemPadding + 30, fieldY + 10, 4, 0, 2 * Math.PI);
            ctx.fill();

            // Text
            const displayValue = entry.value.length > 30 ? entry.value.substring(0, 30) + "..." : entry.value;
            const typeDisplay = entry.type ? ` (${entry.type})` : '';

            ctx.fillStyle = "#fff";
            ctx.font = "12px Arial";
            ctx.fillText(`${entry.name}${typeDisplay}:`, itemPadding + 40, fieldY + 15);

            const nameWidth = ctx.measureText(`${entry.name}${typeDisplay}:`).width;
            ctx.fillStyle = entry.isConnected ? "#b8e6b8" : "#ccc";
            ctx.fillText(` ${displayValue}`, itemPadding + 40 + nameWidth, fieldY + 15);

            // Connection info for inputs (what they're connected to)
            if (entry.isConnected && entry.connectedNodeTitle) {
              const valueWidth = ctx.measureText(` ${displayValue}`).width;
              const connectionStartX = itemPadding + 40 + nameWidth + valueWidth + 10;

              // Check if there's enough space
              if (connectionStartX < widgetWidth - 80) {
                const availableWidth = widgetWidth - connectionStartX - itemPadding - 10;
                let connectionText = ` → ${entry.connectedNodeTitle}`;

                // Truncate if necessary
                ctx.font = "10px Arial";
                let connectionWidth = ctx.measureText(connectionText).width;
                if (connectionWidth > availableWidth) {
                  const maxTitleLength = Math.floor((availableWidth - 20) / 6);
                  const truncatedTitle = entry.connectedNodeTitle.length > maxTitleLength
                    ? entry.connectedNodeTitle.substring(0, maxTitleLength) + "..."
                    : entry.connectedNodeTitle;
                  connectionText = ` → ${truncatedTitle}`;
                }

                ctx.fillStyle = "#888";
                ctx.fillText(connectionText, connectionStartX, fieldY + 15);
              }
            }
          }

          return inputSectionHeight;
        },

        computeSize: function (width: number) {
          return [width, inputSectionHeight];
        },

        mouse: function () { return false; }
      };

      this.widgets.push(inputWidget as any);
    }

    // Force widget height updates
    setTimeout(() => {
      for (const widget of this.widgets) {
        if (widget.name === "inputs_display" || widget.name === "widgets_display") {
          (widget as any).size = [0, (widget as any)._desiredHeight];
        }
      }
      if (this.computeSize) {
        this.computeSize();
      }
    }, 0);
  }

  private createInformationalSection(title: string, entries: FieldEntry[], itemPadding: number, lineHeight: number, headerHeight: number) {
    // This method is no longer used - keeping for compatibility
  }

  private createSelectableSection(title: string, entries: FieldEntry[], itemPadding: number, lineHeight: number, headerHeight: number) {
    // This method is no longer used - keeping for compatibility
  }

  override addCustomWidget<T extends IWidget>(custom_widget: T): T {
    if (!this.widgets) this.widgets = [];
    this.widgets.push(custom_widget);
    return custom_widget;
  }

  private selectField(fieldName: string) {
    // Toggle selection for multi-select
    if (this._selectedFieldNames.includes(fieldName)) {
      // Remove from selection
      this._selectedFieldNames = this._selectedFieldNames.filter(name => name !== fieldName);
    } else {
      // Add to selection
      this._selectedFieldNames = [...this._selectedFieldNames, fieldName];
    }

    this.updateBackendProperties();

    // Force redraw to update UI
    if (app.graph) {
      app.graph.setDirtyCanvas(true, false);
    }
  }

  private updateBackendProperties() {
    // Update backend widget values (these are created by ComfyUI from the backend schema)
    const selectedFieldnamesWidget = this.widgets?.find((w: any) => w.name === "selected_fieldnames");
    const selectedValuesWidget = this.widgets?.find((w: any) => w.name === "selected_values");

    // Create comma-separated field names
    const fieldNamesString = this._selectedFieldNames.join(", ");

    // Create JSON object of field values
    const fieldValuesObj: Record<string, any> = {};
    for (const fieldName of this._selectedFieldNames) {
      const fieldEntry = this._fieldEntries.find(f => f.name === fieldName);
      if (fieldEntry) {
        fieldValuesObj[fieldName] = fieldEntry.rawValue;
      }
    }
    const fieldValuesString = JSON.stringify(fieldValuesObj);

    if (selectedFieldnamesWidget) {
      selectedFieldnamesWidget.value = fieldNamesString;
    }
    if (selectedValuesWidget) {
      selectedValuesWidget.value = fieldValuesString;
    }

    // Update properties for backend (including hidden field_names_input)
    if (!this.properties) this.properties = {};
    this.properties["selected_fieldnames"] = fieldNamesString;
    this.properties["field_names_input"] = fieldNamesString;
    this.properties["selected_values"] = fieldValuesString;

    log(this.type, "Updated backend properties:", {
      fieldNames: fieldNamesString,
      selectedCount: this._selectedFieldNames.length
    });
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

      // Update backend properties to ensure they're in sync
      if (this._selectedFieldNames.length > 0) {
        this.updateBackendProperties();
      }

      // If no fields are selected and we have fields, don't auto-select to preserve user choice
      // The user can manually select fields they want to inspect
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

          // Update selected field values if they're still selected
          if (this._selectedFieldNames.length > 0) {
            this.updateBackendProperties();
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
      this._selectedFieldNames = [];
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
        const selectedFieldnamesWidget = this.widgets?.find((w: any) => w.name === "selected_fieldnames");
        const selectedValuesWidget = this.widgets?.find((w: any) => w.name === "selected_values");
        if (selectedFieldnamesWidget) selectedFieldnamesWidget.value = "";
        if (selectedValuesWidget) selectedValuesWidget.value = "";
      }
    }
  }

  override onNodeCreated() {
    log(this.type, "Node created");

    // Initialize state
    this._connectedNode = null;
    this._availableFields = [];
    this._fieldEntries = [];
    this._selectedFieldNames = [];
    if (!this.properties) this.properties = {};

    // Initialize backend widget properties to prevent validation errors
    this.properties["selected_fieldnames"] = "";
    this.properties["field_names_input"] = "";
    this.properties["selected_values"] = "";

    // Ensure backend widgets exist (these are created by ComfyUI from the backend schema)
    // We need to let ComfyUI create these widgets first, then set their values
    setTimeout(() => {
      // Debug: log all available widgets
      log(this.type, "Available widgets:", this.widgets?.map((w: any) => w.name) || []);

      const selectedFieldnamesWidget = this.widgets?.find((w: any) => w.name === "selected_fieldnames");
      const selectedValuesWidget = this.widgets?.find((w: any) => w.name === "selected_values");

      if (selectedFieldnamesWidget) selectedFieldnamesWidget.value = "";
      if (selectedValuesWidget) selectedValuesWidget.value = "";

      log(this.type, "Backend widgets initialized:", {
        selectedFieldnamesWidget: !!selectedFieldnamesWidget,
        selectedValuesWidget: !!selectedValuesWidget
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

    // Always restore selected field names from properties first
    if (this.properties?.['selected_fieldnames']) {
      const fieldNamesString = this.properties['selected_fieldnames'] as string;
      this._selectedFieldNames = fieldNamesString ? fieldNamesString.split(",").map(s => s.trim()).filter(s => s) : [];
      log(this.type, "Restored selected field names:", this._selectedFieldNames);
    } else if (this.properties?.['field_names_input']) {
      const fieldNamesString = this.properties['field_names_input'] as string;
      this._selectedFieldNames = fieldNamesString ? fieldNamesString.split(",").map(s => s.trim()).filter(s => s) : [];
      log(this.type, "Restored field names from input:", this._selectedFieldNames);
    } else {
      this._selectedFieldNames = [];
    }

    // Reset state for configuration
    if (!hasConnection) {
      this._connectedNode = null;
      this._availableFields = [];
      this._fieldEntries = [];
      this.stopPeriodicUpdates();
    }

    this.updateFieldsDisplay();

    // After UI is updated, ensure backend properties are synchronized
    setTimeout(() => {
      this.updateBackendProperties();
    }, 100);
  }

  override onExecute() {
    // Ensure hidden field_names_input property is set before execution
    if (!this.properties) this.properties = {};
    if (!this.properties["field_names_input"]) {
      this.properties["field_names_input"] = this._selectedFieldNames.join(", ");
    }
  }

  override onRemoved() {
    this.stopPeriodicUpdates();
    super.onRemoved?.();
  }

  override onMouseDown(event: any, pos: any, canvas: any): boolean {
    console.log(`[NodeInspector] Node onMouseDown: pos=${pos}, event=${event.type}`);

    // Check if click is within our scrollable widget area
    const scrollableWidget = this.widgets?.find(w => w.name === "fields_scrollable");
    if (scrollableWidget && this._fieldEntries.length > 0) {
      // Calculate widget position (approximate) - widgets start after node title and other widgets
      const widgetY = 80; // Approximate Y position of widget within node (after title + other widgets)
      const widgetHeight = (scrollableWidget as any)._desiredHeight || 40;

      console.log(`[NodeInspector] Node click debug: pos[1]=${pos[1]}, widgetY=${widgetY}, widgetHeight=${widgetHeight}, range=${widgetY}-${widgetY + widgetHeight}`);

      if (pos[1] >= widgetY && pos[1] <= widgetY + widgetHeight) {
        const relativeY = pos[1] - widgetY;
        const lineHeight = 20;
        const scrollOffset = (scrollableWidget as any).scrollOffset || 0;
        const clickedIndex = Math.floor((relativeY + scrollOffset) / lineHeight);

        console.log(`[NodeInspector] Click in widget area: relativeY=${relativeY}, clickedIndex=${clickedIndex}, fieldsLength=${this._fieldEntries.length}`);

        if (clickedIndex >= 0 && clickedIndex < this._fieldEntries.length) {
          const entry = this._fieldEntries[clickedIndex];
          if (entry) {
            const fieldName = entry.name;

            console.log(`[NodeInspector] Field clicked via node handler: ${fieldName}`);
            this.selectField(fieldName);
            return true; // Consume the event
          }
        }
      }
    }

    return super.onMouseDown?.(event, pos, canvas) || false;
  }

  override computeSize(out?: any): any {
    // Dynamic size based on actual field count with new segmented layout
    const baseWidth = 380;
    const baseHeight = 90;
    const topPadding = 5;
    const bottomPadding = 5;

    // Handle case where _fieldEntries might be undefined during initial construction
    const fieldCount = this._fieldEntries?.length || 0;

    if (fieldCount === 0) {
      // No fields, just show the base message
      return [baseWidth, baseHeight + 25] as any;
    }

    // Calculate height for segmented layout
    const lineHeight = 20;
    const headerHeight = 25;
    const inputEntries = this._fieldEntries.filter(entry => entry.sourceType === 'input');
    const widgetEntries = this._fieldEntries.filter(entry => entry.sourceType === 'widget');

    let totalContentHeight = 0;

    // Add height for inputs section
    if (inputEntries.length > 0) {
      totalContentHeight += headerHeight + (inputEntries.length * lineHeight);
    }

    // Add height for widgets section
    if (widgetEntries.length > 0) {
      const maxFieldsBeforeScroll = 8;
      const shouldScroll = widgetEntries.length > maxFieldsBeforeScroll;
      const visibleFields = shouldScroll ? maxFieldsBeforeScroll : widgetEntries.length;
      totalContentHeight += headerHeight + (visibleFields * lineHeight);
    }

    const totalHeight = baseHeight + totalContentHeight + topPadding + bottomPadding;
    return [baseWidth, totalHeight] as any;
  }
}

// Register the node type
if (!(window as any).__nodeInspectorRegistered) {
  (window as any).__nodeInspectorRegistered = true;

  app.registerExtension({
    name: "comfyui-storyboard.node-inspector",
    async beforeRegisterNodeDef(nodeType: any, nodeData: any) {
      if (nodeData.name === "NodeInspector") {
        log("NodeInspector", "Registering node type");
        log("NodeInspector", "Node data:", nodeData);

        // Copy methods individually to avoid prototype issues
        const methods = [
          "onConnectionsChange",
          "onExecute",
          "onConfigure",
          "onNodeCreated",
          "onRemoved",
          "onMouseDown",
          "clone",
          "onConstructed",
          "checkAndRunOnConstructed",
          "inspectConnectedNode",
          "updateFieldsDisplay",
          "selectField",
          "findWidgetByName",
          "formatWidgetValue",
          "getAllFieldEntries",
          "getConnectedNodeOutputValue",
          "formatValue",
          "createFieldsDisplayWidget",
          "startPeriodicUpdates",
          "stopPeriodicUpdates",
          "computeSize",
          "getInputSocketTypeColor",
          "getSocketTypeColor",
          "updateBackendProperties"
        ];

        for (const method of methods) {
          const prototype = NodeInspectorNode.prototype as any;
          if (prototype[method]) {
            nodeType.prototype[method] = prototype[method];
            log("NodeInspector", `Copied method: ${method}`);
          }
        }

        // Copy static properties
        nodeType.title = NodeInspectorNode.title;
        nodeType.type = NodeInspectorNode.type;
        nodeType.category = NodeInspectorNode.category;
        nodeType._category = NodeInspectorNode._category;
        log("NodeInspector", "Static properties copied");

        // Register the node type with LiteGraph
        if (NodeInspectorNode.type) {
          log("NodeInspector", "Registering node type with LiteGraph");
          LiteGraph.registerNodeType(NodeInspectorNode.type, nodeType);
        }

        // Set up the node type
        NodeInspectorNode.setUp();
      }
    },

    nodeCreated(node: any) {
      if (node.comfyClass === "NodeInspector") {
        log("NodeInspector", "Node instance created");
        log("NodeInspector", "Node properties:", node.properties);

        // Initialize node state
        node._connectedNode = null;
        node._availableFields = [];
        node._fieldEntries = [];
        node._selectedFieldNames = [];
        node._updateInterval = null;

        // Initialize backend widget properties to prevent validation errors
        if (!node.properties) node.properties = {};
        node.properties["selected_fieldnames"] = "";
        node.properties["field_names_input"] = "";
        node.properties["selected_values"] = "";

        log("NodeInspector", "Node state initialized");

        // Ensure backend widgets have default values
        setTimeout(() => {
          // Debug: log all available widgets
          log("NodeInspector", "Available widgets:", node.widgets?.map((w: any) => w.name) || []);

          const selectedFieldnamesWidget = node.widgets?.find((w: any) => w.name === "selected_fieldnames");
          const selectedValuesWidget = node.widgets?.find((w: any) => w.name === "selected_values");

          if (selectedFieldnamesWidget) selectedFieldnamesWidget.value = "";
          if (selectedValuesWidget) selectedValuesWidget.value = "";

          log("NodeInspector", "Backend widgets initialized in nodeCreated");
        }, 10);

        // Call onConstructed to ensure proper initialization
        node.onConstructed?.();
        log("NodeInspector", "Node constructed");
      }
    }
  });
} 