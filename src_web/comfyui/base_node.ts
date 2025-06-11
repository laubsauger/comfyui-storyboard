import { LGraphNode } from "@comfyorg/litegraph";
import type { IWidget } from "@comfyorg/litegraph";

export class StoryboardBaseNode extends LGraphNode {
  static override title = "__NEED_CLASS_TITLE__";
  static override type = "__NEED_CLASS_TYPE__";
  static override category = "storyboard";
  static _category = "storyboard";

  override widgets: IWidget[] = [];
  comfyClass: string = "__NEED_COMFY_CLASS__";
  readonly nickname = "storyboard";
  readonly isVirtualNode: boolean = false;
  isDropEnabled = false;
  removed = false;
  protected __constructed__ = false;

  constructor(title = StoryboardBaseNode.title, type?: string) {
    super(title, type);
    this.widgets = this.widgets || [];
    this.properties = this.properties || {};
    this.checkAndRunOnConstructed();
  }

  // Deep clone properties for safe duplication
  override clone() {
    const cloned = super.clone()!;
    if (cloned?.properties && !!window.structuredClone) {
      cloned.properties = structuredClone(cloned.properties);
    }
    return cloned;
  }

  // Widget management utilities
  removeWidget(widgetOrSlot?: IWidget | number) {
    if (!this.widgets) return;
    const widget = typeof widgetOrSlot === "number" ? this.widgets[widgetOrSlot] : widgetOrSlot;
    if (widget) {
      const index = this.widgets.indexOf(widget);
      if (index > -1) this.widgets.splice(index, 1);
      widget.onRemove?.();
    }
  }

  replaceWidget(widgetOrSlot: IWidget | number | undefined, newWidget: IWidget) {
    let index = null;
    if (widgetOrSlot) {
      index = typeof widgetOrSlot === 'number' ? widgetOrSlot : this.widgets.indexOf(widgetOrSlot);
      this.removeWidget(index);
    }
    index = index != null ? index : this.widgets.length - 1;
    if (this.widgets.includes(newWidget)) {
      this.widgets.splice(this.widgets.indexOf(newWidget), 1);
    }
    this.widgets.splice(index, 0, newWidget);
  }

  override onRemoved(): void {
    super.onRemoved?.();
    this.removed = true;
  }

  protected onConstructed(): boolean {
    if (this.__constructed__) return false;
    // This is kinda a hack, but if this.type is still null, then set it to undefined to match
    this.type = this.type ?? undefined;
    // Ensure widget values are saved in workflows
    (this as any).serialize_widgets = true;
    this.__constructed__ = true;
    return true;
  }

  protected checkAndRunOnConstructed(): boolean {
    if (!this.__constructed__) {
      this.onConstructed();
    }
    return this.__constructed__;
  }

  static setUp() {
    // Remove the problematic LiteGraph registration - let ComfyUI handle it
    if (this._category) {
      this.category = this._category;
    }
  }
} 