var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});

// src_web/comfyui/nodes/node-inspector/node_inspector.ts
import { app } from "/scripts/app.js";

// node_modules/@comfyorg/litegraph/dist/litegraph.es.js
var _onPointerDownOrMove, _onPointerUp, _onKeyDownOrUp;
var InputIndicators = class {
  constructor(canvas2) {
    // #region config
    __publicField(this, "radius", 8);
    __publicField(this, "startAngle", 0);
    __publicField(this, "endAngle", Math.PI * 2);
    __publicField(this, "inactiveColour", "#ffffff10");
    __publicField(this, "colour1", "#ff5f00");
    __publicField(this, "colour2", "#00ff7c");
    __publicField(this, "colour3", "#dea7ff");
    __publicField(this, "fontString", "bold 12px Arial");
    // #endregion
    // #region state
    __publicField(this, "enabled", true);
    __publicField(this, "shiftDown", false);
    __publicField(this, "undoDown", false);
    __publicField(this, "redoDown", false);
    __publicField(this, "ctrlDown", false);
    __publicField(this, "altDown", false);
    __publicField(this, "mouse0Down", false);
    __publicField(this, "mouse1Down", false);
    __publicField(this, "mouse2Down", false);
    __publicField(this, "x", 0);
    __publicField(this, "y", 0);
    // #endregion
    __publicField(this, "controller");
    __privateAdd(this, _onPointerDownOrMove, this.onPointerDownOrMove.bind(this));
    __privateAdd(this, _onPointerUp, this.onPointerUp.bind(this));
    __privateAdd(this, _onKeyDownOrUp, this.onKeyDownOrUp.bind(this));
    this.canvas = canvas2;
    this.controller = new AbortController();
    const { signal } = this.controller;
    const element = canvas2.canvas;
    const options2 = { capture: true, signal };
    element.addEventListener("pointerdown", __privateGet(this, _onPointerDownOrMove), options2);
    element.addEventListener("pointermove", __privateGet(this, _onPointerDownOrMove), options2);
    element.addEventListener("pointerup", __privateGet(this, _onPointerUp), options2);
    element.addEventListener("keydown", __privateGet(this, _onKeyDownOrUp), options2);
    document.addEventListener("keyup", __privateGet(this, _onKeyDownOrUp), options2);
    const origDrawFrontCanvas = canvas2.drawFrontCanvas.bind(canvas2);
    signal.addEventListener("abort", () => {
      canvas2.drawFrontCanvas = origDrawFrontCanvas;
    });
    canvas2.drawFrontCanvas = () => {
      origDrawFrontCanvas();
      this.draw();
    };
  }
  onPointerDownOrMove(e2) {
    this.mouse0Down = (e2.buttons & 1) === 1;
    this.mouse1Down = (e2.buttons & 4) === 4;
    this.mouse2Down = (e2.buttons & 2) === 2;
    this.x = e2.clientX;
    this.y = e2.clientY;
    this.canvas.setDirty(true);
  }
  onPointerUp() {
    this.mouse0Down = false;
    this.mouse1Down = false;
    this.mouse2Down = false;
  }
  onKeyDownOrUp(e2) {
    this.ctrlDown = e2.ctrlKey;
    this.altDown = e2.altKey;
    this.shiftDown = e2.shiftKey;
    this.undoDown = e2.ctrlKey && e2.code === "KeyZ" && e2.type === "keydown";
    this.redoDown = e2.ctrlKey && e2.code === "KeyY" && e2.type === "keydown";
  }
  draw() {
    const {
      canvas: { ctx },
      radius,
      startAngle,
      endAngle,
      x: x2,
      y,
      inactiveColour,
      colour1,
      colour2,
      colour3,
      fontString
    } = this;
    const { fillStyle, font } = ctx;
    const mouseDotX = x2;
    const mouseDotY = y - 80;
    const textX = mouseDotX;
    const textY = mouseDotY - 15;
    ctx.font = fontString;
    textMarker(textX + 0, textY, "Shift", this.shiftDown ? colour1 : inactiveColour);
    textMarker(textX + 45, textY + 20, "Alt", this.altDown ? colour2 : inactiveColour);
    textMarker(textX + 30, textY, "Control", this.ctrlDown ? colour3 : inactiveColour);
    textMarker(textX - 30, textY, "\u21A9\uFE0F", this.undoDown ? "#000" : "transparent");
    textMarker(textX + 45, textY, "\u21AA\uFE0F", this.redoDown ? "#000" : "transparent");
    ctx.beginPath();
    drawDot(mouseDotX, mouseDotY);
    drawDot(mouseDotX + 15, mouseDotY);
    drawDot(mouseDotX + 30, mouseDotY);
    ctx.fillStyle = inactiveColour;
    ctx.fill();
    const leftButtonColour = this.mouse0Down ? colour1 : inactiveColour;
    const middleButtonColour = this.mouse1Down ? colour2 : inactiveColour;
    const rightButtonColour = this.mouse2Down ? colour3 : inactiveColour;
    if (this.mouse0Down) mouseMarker(mouseDotX, mouseDotY, leftButtonColour);
    if (this.mouse1Down) mouseMarker(mouseDotX + 15, mouseDotY, middleButtonColour);
    if (this.mouse2Down) mouseMarker(mouseDotX + 30, mouseDotY, rightButtonColour);
    ctx.fillStyle = fillStyle;
    ctx.font = font;
    function textMarker(x22, y2, text, colour) {
      ctx.fillStyle = colour;
      ctx.fillText(text, x22, y2);
    }
    function mouseMarker(x22, y2, colour) {
      ctx.beginPath();
      ctx.fillStyle = colour;
      drawDot(x22, y2);
      ctx.fill();
    }
    function drawDot(x22, y2) {
      ctx.arc(x22, y2, radius, startAngle, endAngle);
    }
  }
  dispose() {
    var _a;
    (_a = this.controller) == null ? void 0 : _a.abort();
    this.controller = void 0;
  }
};
_onPointerDownOrMove = new WeakMap();
_onPointerUp = new WeakMap();
_onKeyDownOrUp = new WeakMap();
var ContextMenu = class _ContextMenu {
  /**
   * @todo Interface for values requires functionality change - currently accepts
   * an array of strings, functions, objects, nulls, or undefined.
   * @param values (allows object { title: "Nice text", callback: function ... })
   * @param options [optional] Some options:\
   * - title: title to show on top of the menu
   * - callback: function to call when an option is clicked, it receives the item information
   * - ignore_item_callbacks: ignores the callback inside the item, it just calls the options.callback
   * - event: you can pass a MouseEvent, this way the ContextMenu appears in that position
   */
  constructor(values, options2) {
    __publicField(this, "options");
    __publicField(this, "parentMenu");
    __publicField(this, "root");
    __publicField(this, "current_submenu");
    __publicField(this, "lock");
    var _a, _b, _c;
    options2 || (options2 = {});
    this.options = options2;
    const parent = options2.parentMenu;
    if (parent) {
      if (!(parent instanceof _ContextMenu)) {
        console.error("parentMenu must be of class ContextMenu, ignoring it");
        options2.parentMenu = void 0;
      } else {
        this.parentMenu = parent;
        this.parentMenu.lock = true;
        this.parentMenu.current_submenu = this;
      }
      if (((_a = parent.options) == null ? void 0 : _a.className) === "dark") {
        options2.className = "dark";
      }
    }
    const eventClass = options2.event ? options2.event.constructor.name : null;
    if (eventClass !== "MouseEvent" && eventClass !== "CustomEvent" && eventClass !== "PointerEvent") {
      console.error(`Event passed to ContextMenu is not of type MouseEvent or CustomEvent. Ignoring it. (${eventClass})`);
      options2.event = void 0;
    }
    const root = document.createElement("div");
    let classes = "litegraph litecontextmenu litemenubar-panel";
    if (options2.className) classes += ` ${options2.className}`;
    root.className = classes;
    root.style.minWidth = "100";
    root.style.minHeight = "100";
    root.style.pointerEvents = "none";
    setTimeout(function() {
      root.style.pointerEvents = "auto";
    }, 100);
    root.addEventListener(
      "pointerup",
      function(e2) {
        e2.preventDefault();
        return true;
      },
      true
    );
    root.addEventListener(
      "contextmenu",
      function(e2) {
        if (e2.button != 2) return false;
        e2.preventDefault();
        return false;
      },
      true
    );
    root.addEventListener(
      "pointerdown",
      (e2) => {
        if (e2.button == 2) {
          this.close();
          e2.preventDefault();
          return true;
        }
      },
      true
    );
    this.root = root;
    if (options2.title) {
      const element = document.createElement("div");
      element.className = "litemenu-title";
      element.innerHTML = options2.title;
      root.append(element);
    }
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      let name = Array.isArray(values) ? value : String(i);
      if (typeof name !== "string") {
        name = name != null ? name.content === void 0 ? String(name) : name.content : name;
      }
      this.addItem(name, value, options2);
    }
    root.addEventListener("pointerenter", function() {
      if (root.closing_timer) {
        clearTimeout(root.closing_timer);
      }
    });
    const ownerDocument = (_c = (_b = options2.event) == null ? void 0 : _b.target) == null ? void 0 : _c.ownerDocument;
    const root_document = ownerDocument || document;
    if (root_document.fullscreenElement)
      root_document.fullscreenElement.append(root);
    else
      root_document.body.append(root);
    let left = options2.left || 0;
    let top = options2.top || 0;
    if (options2.event) {
      left = options2.event.clientX - 10;
      top = options2.event.clientY - 10;
      if (options2.title) top -= 20;
      if (parent) {
        const rect = parent.root.getBoundingClientRect();
        left = rect.left + rect.width;
      }
      const body_rect = document.body.getBoundingClientRect();
      const root_rect = root.getBoundingClientRect();
      if (body_rect.height == 0)
        console.error("document.body height is 0. That is dangerous, set html,body { height: 100%; }");
      if (body_rect.width && left > body_rect.width - root_rect.width - 10)
        left = body_rect.width - root_rect.width - 10;
      if (body_rect.height && top > body_rect.height - root_rect.height - 10)
        top = body_rect.height - root_rect.height - 10;
    }
    root.style.left = `${left}px`;
    root.style.top = `${top}px`;
    if (LiteGraph.context_menu_scaling && options2.scale) {
      root.style.transform = `scale(${Math.round(options2.scale * 4) * 0.25})`;
    }
  }
  addItem(name, value, options2) {
    var _a;
    options2 || (options2 = {});
    const element = document.createElement("div");
    element.className = "litemenu-entry submenu";
    let disabled = false;
    if (value === null) {
      element.classList.add("separator");
    } else {
      const innerHtml = name === null ? "" : String(name);
      if (typeof value === "string") {
        element.innerHTML = innerHtml;
      } else {
        element.innerHTML = (_a = value == null ? void 0 : value.title) != null ? _a : innerHtml;
        if (value.disabled) {
          disabled = true;
          element.classList.add("disabled");
          element.setAttribute("aria-disabled", "true");
        }
        if (value.submenu || value.has_submenu) {
          element.classList.add("has_submenu");
          element.setAttribute("aria-haspopup", "true");
          element.setAttribute("aria-expanded", "false");
        }
        if (value.className) element.className += ` ${value.className}`;
      }
      element.value = value;
      element.setAttribute("role", "menuitem");
      if (typeof value === "function") {
        element.dataset["value"] = String(name);
        element.onclick_callback = value;
      } else {
        element.dataset["value"] = String(value);
      }
    }
    this.root.append(element);
    if (!disabled) element.addEventListener("click", inner_onclick);
    if (!disabled && options2.autoopen)
      element.addEventListener("pointerenter", inner_over);
    const setAriaExpanded = () => {
      const entries = this.root.querySelectorAll("div.litemenu-entry.has_submenu");
      if (entries) {
        for (const entry of entries) {
          entry.setAttribute("aria-expanded", "false");
        }
      }
      element.setAttribute("aria-expanded", "true");
    };
    function inner_over(e2) {
      const value2 = this.value;
      if (!value2 || !value2.has_submenu) return;
      inner_onclick.call(this, e2);
      setAriaExpanded();
    }
    const that = this;
    function inner_onclick(e2) {
      var _a2;
      const value2 = this.value;
      let close_parent = true;
      (_a2 = that.current_submenu) == null ? void 0 : _a2.close(e2);
      if ((value2 == null ? void 0 : value2.has_submenu) || (value2 == null ? void 0 : value2.submenu)) {
        setAriaExpanded();
      }
      if (options2.callback) {
        const r = options2.callback.call(
          this,
          value2,
          options2,
          e2,
          that,
          options2.node
        );
        if (r === true) close_parent = false;
      }
      if (typeof value2 === "object") {
        if (value2.callback && !options2.ignore_item_callbacks && value2.disabled !== true) {
          const r = value2.callback.call(
            this,
            value2,
            options2,
            e2,
            that,
            options2.extra
          );
          if (r === true) close_parent = false;
        }
        if (value2.submenu) {
          if (!value2.submenu.options) throw "ContextMenu submenu needs options";
          new that.constructor(value2.submenu.options, {
            callback: value2.submenu.callback,
            event: e2,
            parentMenu: that,
            ignore_item_callbacks: value2.submenu.ignore_item_callbacks,
            title: value2.submenu.title,
            extra: value2.submenu.extra,
            autoopen: options2.autoopen
          });
          close_parent = false;
        }
      }
      if (close_parent && !that.lock) that.close();
    }
    return element;
  }
  close(e2, ignore_parent_menu) {
    var _a;
    this.root.remove();
    if (this.parentMenu && !ignore_parent_menu) {
      this.parentMenu.lock = false;
      this.parentMenu.current_submenu = void 0;
      if (e2 === void 0) {
        this.parentMenu.close();
      } else if (e2 && !_ContextMenu.isCursorOverElement(e2, this.parentMenu.root)) {
        _ContextMenu.trigger(
          this.parentMenu.root,
          `${LiteGraph.pointerevents_method}leave`,
          e2
        );
      }
    }
    (_a = this.current_submenu) == null ? void 0 : _a.close(e2, true);
    if (this.root.closing_timer) clearTimeout(this.root.closing_timer);
  }
  // this code is used to trigger events easily (used in the context menu mouseleave
  static trigger(element, event_name, params) {
    const evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event_name, true, true, params);
    if (element.dispatchEvent) element.dispatchEvent(evt);
    else if (element.__events) element.__events.dispatchEvent(evt);
    return evt;
  }
  // returns the top most menu
  getTopMenu() {
    return this.options.parentMenu ? this.options.parentMenu.getTopMenu() : this;
  }
  getFirstEvent() {
    return this.options.parentMenu ? this.options.parentMenu.getFirstEvent() : this.options.event;
  }
  static isCursorOverElement(event, element) {
    const left = event.clientX;
    const top = event.clientY;
    const rect = element.getBoundingClientRect();
    if (!rect) return false;
    if (top > rect.top && top < rect.top + rect.height && left > rect.left && left < rect.left + rect.width) {
      return true;
    }
    return false;
  }
};
var NodeSlotType = /* @__PURE__ */ ((NodeSlotType2) => {
  NodeSlotType2[NodeSlotType2["INPUT"] = 1] = "INPUT";
  NodeSlotType2[NodeSlotType2["OUTPUT"] = 2] = "OUTPUT";
  return NodeSlotType2;
})(NodeSlotType || {});
var RenderShape = /* @__PURE__ */ ((RenderShape2) => {
  RenderShape2[RenderShape2["BOX"] = 1] = "BOX";
  RenderShape2[RenderShape2["ROUND"] = 2] = "ROUND";
  RenderShape2[RenderShape2["CIRCLE"] = 3] = "CIRCLE";
  RenderShape2[RenderShape2["CARD"] = 4] = "CARD";
  RenderShape2[RenderShape2["ARROW"] = 5] = "ARROW";
  RenderShape2[RenderShape2["GRID"] = 6] = "GRID";
  RenderShape2[RenderShape2["HollowCircle"] = 7] = "HollowCircle";
  return RenderShape2;
})(RenderShape || {});
var CanvasItem = /* @__PURE__ */ ((CanvasItem2) => {
  CanvasItem2[CanvasItem2["Nothing"] = 0] = "Nothing";
  CanvasItem2[CanvasItem2["Node"] = 1] = "Node";
  CanvasItem2[CanvasItem2["Group"] = 2] = "Group";
  CanvasItem2[CanvasItem2["Reroute"] = 4] = "Reroute";
  CanvasItem2[CanvasItem2["Link"] = 8] = "Link";
  CanvasItem2[CanvasItem2["ResizeSe"] = 16] = "ResizeSe";
  return CanvasItem2;
})(CanvasItem || {});
var LinkDirection = /* @__PURE__ */ ((LinkDirection2) => {
  LinkDirection2[LinkDirection2["NONE"] = 0] = "NONE";
  LinkDirection2[LinkDirection2["UP"] = 1] = "UP";
  LinkDirection2[LinkDirection2["DOWN"] = 2] = "DOWN";
  LinkDirection2[LinkDirection2["LEFT"] = 3] = "LEFT";
  LinkDirection2[LinkDirection2["RIGHT"] = 4] = "RIGHT";
  LinkDirection2[LinkDirection2["CENTER"] = 5] = "CENTER";
  return LinkDirection2;
})(LinkDirection || {});
var LinkRenderType = /* @__PURE__ */ ((LinkRenderType2) => {
  LinkRenderType2[LinkRenderType2["HIDDEN_LINK"] = -1] = "HIDDEN_LINK";
  LinkRenderType2[LinkRenderType2["STRAIGHT_LINK"] = 0] = "STRAIGHT_LINK";
  LinkRenderType2[LinkRenderType2["LINEAR_LINK"] = 1] = "LINEAR_LINK";
  LinkRenderType2[LinkRenderType2["SPLINE_LINK"] = 2] = "SPLINE_LINK";
  return LinkRenderType2;
})(LinkRenderType || {});
var LinkMarkerShape = /* @__PURE__ */ ((LinkMarkerShape2) => {
  LinkMarkerShape2[LinkMarkerShape2["None"] = 0] = "None";
  LinkMarkerShape2[LinkMarkerShape2["Circle"] = 1] = "Circle";
  LinkMarkerShape2[LinkMarkerShape2["Arrow"] = 2] = "Arrow";
  return LinkMarkerShape2;
})(LinkMarkerShape || {});
var TitleMode = /* @__PURE__ */ ((TitleMode2) => {
  TitleMode2[TitleMode2["NORMAL_TITLE"] = 0] = "NORMAL_TITLE";
  TitleMode2[TitleMode2["NO_TITLE"] = 1] = "NO_TITLE";
  TitleMode2[TitleMode2["TRANSPARENT_TITLE"] = 2] = "TRANSPARENT_TITLE";
  TitleMode2[TitleMode2["AUTOHIDE_TITLE"] = 3] = "AUTOHIDE_TITLE";
  return TitleMode2;
})(TitleMode || {});
var LGraphEventMode = /* @__PURE__ */ ((LGraphEventMode2) => {
  LGraphEventMode2[LGraphEventMode2["ALWAYS"] = 0] = "ALWAYS";
  LGraphEventMode2[LGraphEventMode2["ON_EVENT"] = 1] = "ON_EVENT";
  LGraphEventMode2[LGraphEventMode2["NEVER"] = 2] = "NEVER";
  LGraphEventMode2[LGraphEventMode2["ON_TRIGGER"] = 3] = "ON_TRIGGER";
  LGraphEventMode2[LGraphEventMode2["BYPASS"] = 4] = "BYPASS";
  return LGraphEventMode2;
})(LGraphEventMode || {});
var EaseFunction = /* @__PURE__ */ ((EaseFunction2) => {
  EaseFunction2["LINEAR"] = "linear";
  EaseFunction2["EASE_IN_QUAD"] = "easeInQuad";
  EaseFunction2["EASE_OUT_QUAD"] = "easeOutQuad";
  EaseFunction2["EASE_IN_OUT_QUAD"] = "easeInOutQuad";
  return EaseFunction2;
})(EaseFunction || {});
function distance(a, b) {
  return Math.sqrt(
    (b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])
  );
}
function dist2(x1, y1, x2, y2) {
  return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
}
function isInRectangle(x2, y, left, top, width2, height) {
  return x2 >= left && x2 < left + width2 && y >= top && y < top + height;
}
function isPointInRect(point, rect) {
  return point[0] >= rect[0] && point[0] < rect[0] + rect[2] && point[1] >= rect[1] && point[1] < rect[1] + rect[3];
}
function isInRect(x2, y, rect) {
  return x2 >= rect[0] && x2 < rect[0] + rect[2] && y >= rect[1] && y < rect[1] + rect[3];
}
function isInsideRectangle(x2, y, left, top, width2, height) {
  return left < x2 && left + width2 > x2 && top < y && top + height > y;
}
function isSortaInsideOctagon(x2, y, radius) {
  const sum = Math.min(radius, Math.abs(x2)) + Math.min(radius, Math.abs(y));
  return sum < radius * 0.75;
}
function overlapBounding(a, b) {
  const aRight = a[0] + a[2];
  const aBottom = a[1] + a[3];
  const bRight = b[0] + b[2];
  const bBottom = b[1] + b[3];
  return a[0] > bRight || a[1] > bBottom || aRight < b[0] || aBottom < b[1] ? false : true;
}
function containsCentre(a, b) {
  const centreX = b[0] + b[2] * 0.5;
  const centreY = b[1] + b[3] * 0.5;
  return isInRect(centreX, centreY, a);
}
function containsRect(a, b) {
  const aRight = a[0] + a[2];
  const aBottom = a[1] + a[3];
  const bRight = b[0] + b[2];
  const bBottom = b[1] + b[3];
  const identical = a[0] === b[0] && a[1] === b[1] && aRight === bRight && aBottom === bBottom;
  return !identical && a[0] <= b[0] && a[1] <= b[1] && aRight >= bRight && aBottom >= bBottom;
}
function findPointOnCurve(out, a, b, controlA, controlB, t = 0.5) {
  const iT = 1 - t;
  const c1 = iT * iT * iT;
  const c2 = 3 * (iT * iT) * t;
  const c3 = 3 * iT * (t * t);
  const c4 = t * t * t;
  out[0] = c1 * a[0] + c2 * controlA[0] + c3 * controlB[0] + c4 * b[0];
  out[1] = c1 * a[1] + c2 * controlA[1] + c3 * controlB[1] + c4 * b[1];
}
function createBounds(objects, padding = 10) {
  const bounds = new Float32Array([Infinity, Infinity, -Infinity, -Infinity]);
  for (const obj of objects) {
    const rect = obj.boundingRect;
    bounds[0] = Math.min(bounds[0], rect[0]);
    bounds[1] = Math.min(bounds[1], rect[1]);
    bounds[2] = Math.max(bounds[2], rect[0] + rect[2]);
    bounds[3] = Math.max(bounds[3], rect[1] + rect[3]);
  }
  if (!bounds.every((x2) => isFinite(x2))) return null;
  return [
    bounds[0] - padding,
    bounds[1] - padding,
    bounds[2] - bounds[0] + 2 * padding,
    bounds[3] - bounds[1] + 2 * padding
  ];
}
function snapPoint(pos, snapTo) {
  if (!snapTo) return false;
  pos[0] = snapTo * Math.round(pos[0] / snapTo);
  pos[1] = snapTo * Math.round(pos[1] / snapTo);
  return true;
}
var CurveEditor = class {
  constructor(points) {
    __publicField(this, "points");
    __publicField(this, "selected");
    __publicField(this, "nearest");
    __publicField(this, "size");
    __publicField(this, "must_update");
    __publicField(this, "margin");
    __publicField(this, "_nearest");
    this.points = points;
    this.selected = -1;
    this.nearest = -1;
    this.size = null;
    this.must_update = true;
    this.margin = 5;
  }
  static sampleCurve(f, points) {
    if (!points) return;
    for (let i = 0; i < points.length - 1; ++i) {
      const p = points[i];
      const pn = points[i + 1];
      if (pn[0] < f) continue;
      const r = pn[0] - p[0];
      if (Math.abs(r) < 1e-5) return p[1];
      const local_f = (f - p[0]) / r;
      return p[1] * (1 - local_f) + pn[1] * local_f;
    }
    return 0;
  }
  draw(ctx, size, graphcanvas, background_color, line_color, inactive = false) {
    const points = this.points;
    if (!points) return;
    this.size = size;
    const w = size[0] - this.margin * 2;
    const h = size[1] - this.margin * 2;
    line_color = line_color || "#666";
    ctx.save();
    ctx.translate(this.margin, this.margin);
    if (background_color) {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#222";
      ctx.fillRect(w * 0.5, 0, 1, h);
      ctx.strokeStyle = "#333";
      ctx.strokeRect(0, 0, w, h);
    }
    ctx.strokeStyle = line_color;
    if (inactive) ctx.globalAlpha = 0.5;
    ctx.beginPath();
    for (const p of points) {
      ctx.lineTo(p[0] * w, (1 - p[1]) * h);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
    if (!inactive) {
      for (const [i, p] of points.entries()) {
        ctx.fillStyle = this.selected == i ? "#FFF" : this.nearest == i ? "#DDD" : "#AAA";
        ctx.beginPath();
        ctx.arc(p[0] * w, (1 - p[1]) * h, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
  // localpos is mouse in curve editor space
  onMouseDown(localpos, graphcanvas) {
    const points = this.points;
    if (!points) return;
    if (localpos[1] < 0) return;
    if (this.size == null) throw new Error("CurveEditor.size was null or undefined.");
    const w = this.size[0] - this.margin * 2;
    const h = this.size[1] - this.margin * 2;
    const x2 = localpos[0] - this.margin;
    const y = localpos[1] - this.margin;
    const pos = [x2, y];
    const max_dist = 30 / graphcanvas.ds.scale;
    this.selected = this.getCloserPoint(pos, max_dist);
    if (this.selected == -1) {
      const point = [x2 / w, 1 - y / h];
      points.push(point);
      points.sort(function(a, b) {
        return a[0] - b[0];
      });
      this.selected = points.indexOf(point);
      this.must_update = true;
    }
    if (this.selected != -1) return true;
  }
  onMouseMove(localpos, graphcanvas) {
    const points = this.points;
    if (!points) return;
    const s = this.selected;
    if (s < 0) return;
    if (this.size == null) throw new Error("CurveEditor.size was null or undefined.");
    const x2 = (localpos[0] - this.margin) / (this.size[0] - this.margin * 2);
    const y = (localpos[1] - this.margin) / (this.size[1] - this.margin * 2);
    const curvepos = [
      localpos[0] - this.margin,
      localpos[1] - this.margin
    ];
    const max_dist = 30 / graphcanvas.ds.scale;
    this._nearest = this.getCloserPoint(curvepos, max_dist);
    const point = points[s];
    if (point) {
      const is_edge_point = s == 0 || s == points.length - 1;
      if (!is_edge_point && (localpos[0] < -10 || localpos[0] > this.size[0] + 10 || localpos[1] < -10 || localpos[1] > this.size[1] + 10)) {
        points.splice(s, 1);
        this.selected = -1;
        return;
      }
      if (!is_edge_point) point[0] = clamp(x2, 0, 1);
      else point[0] = s == 0 ? 0 : 1;
      point[1] = 1 - clamp(y, 0, 1);
      points.sort(function(a, b) {
        return a[0] - b[0];
      });
      this.selected = points.indexOf(point);
      this.must_update = true;
    }
  }
  // Former params: localpos, graphcanvas
  onMouseUp() {
    this.selected = -1;
    return false;
  }
  getCloserPoint(pos, max_dist) {
    const points = this.points;
    if (!points) return -1;
    max_dist = max_dist || 30;
    if (this.size == null) throw new Error("CurveEditor.size was null or undefined.");
    const w = this.size[0] - this.margin * 2;
    const h = this.size[1] - this.margin * 2;
    const num = points.length;
    const p2 = [0, 0];
    let min_dist = 1e6;
    let closest = -1;
    for (let i = 0; i < num; ++i) {
      const p = points[i];
      p2[0] = p[0] * w;
      p2[1] = (1 - p[1]) * h;
      const dist = distance(pos, p2);
      if (dist > min_dist || dist > max_dist) continue;
      closest = i;
      min_dist = dist;
    }
    return closest;
  }
};
var DragAndScale = class {
  constructor(element) {
    /**
     * The state of this DragAndScale instance.
     *
     * Implemented as a POCO that can be proxied without side-effects.
     */
    __publicField(this, "state");
    /** Maximum scale (zoom in) */
    __publicField(this, "max_scale");
    /** Minimum scale (zoom out) */
    __publicField(this, "min_scale");
    __publicField(this, "enabled");
    __publicField(this, "last_mouse");
    __publicField(this, "element");
    __publicField(this, "visible_area");
    __publicField(this, "dragging");
    __publicField(this, "viewport");
    this.state = {
      offset: new Float32Array([0, 0]),
      scale: 1
    };
    this.max_scale = 10;
    this.min_scale = 0.1;
    this.enabled = true;
    this.last_mouse = [0, 0];
    this.visible_area = new Float32Array(4);
    this.element = element;
  }
  get offset() {
    return this.state.offset;
  }
  set offset(value) {
    this.state.offset = value;
  }
  get scale() {
    return this.state.scale;
  }
  set scale(value) {
    this.state.scale = value;
  }
  computeVisibleArea(viewport) {
    if (!this.element) {
      this.visible_area[0] = this.visible_area[1] = this.visible_area[2] = this.visible_area[3] = 0;
      return;
    }
    let width2 = this.element.width;
    let height = this.element.height;
    let startx = -this.offset[0];
    let starty = -this.offset[1];
    if (viewport) {
      startx += viewport[0] / this.scale;
      starty += viewport[1] / this.scale;
      width2 = viewport[2];
      height = viewport[3];
    }
    const endx = startx + width2 / this.scale;
    const endy = starty + height / this.scale;
    this.visible_area[0] = startx;
    this.visible_area[1] = starty;
    this.visible_area[2] = endx - startx;
    this.visible_area[3] = endy - starty;
  }
  toCanvasContext(ctx) {
    ctx.scale(this.scale, this.scale);
    ctx.translate(this.offset[0], this.offset[1]);
  }
  convertOffsetToCanvas(pos) {
    return [
      (pos[0] + this.offset[0]) * this.scale,
      (pos[1] + this.offset[1]) * this.scale
    ];
  }
  convertCanvasToOffset(pos, out) {
    out = out || [0, 0];
    out[0] = pos[0] / this.scale - this.offset[0];
    out[1] = pos[1] / this.scale - this.offset[1];
    return out;
  }
  /** @deprecated Has not been kept up to date */
  mouseDrag(x2, y) {
    var _a;
    this.offset[0] += x2 / this.scale;
    this.offset[1] += y / this.scale;
    (_a = this.onredraw) == null ? void 0 : _a.call(this, this);
  }
  changeScale(value, zooming_center) {
    var _a;
    if (value < this.min_scale) {
      value = this.min_scale;
    } else if (value > this.max_scale) {
      value = this.max_scale;
    }
    if (value == this.scale) return;
    if (!this.element) return;
    const rect = this.element.getBoundingClientRect();
    if (!rect) return;
    zooming_center = zooming_center != null ? zooming_center : [rect.width * 0.5, rect.height * 0.5];
    const normalizedCenter = [
      zooming_center[0] - rect.x,
      zooming_center[1] - rect.y
    ];
    const center = this.convertCanvasToOffset(normalizedCenter);
    this.scale = value;
    if (Math.abs(this.scale - 1) < 0.01) this.scale = 1;
    const new_center = this.convertCanvasToOffset(normalizedCenter);
    const delta_offset = [
      new_center[0] - center[0],
      new_center[1] - center[1]
    ];
    this.offset[0] += delta_offset[0];
    this.offset[1] += delta_offset[1];
    (_a = this.onredraw) == null ? void 0 : _a.call(this, this);
  }
  changeDeltaScale(value, zooming_center) {
    this.changeScale(this.scale * value, zooming_center);
  }
  /**
   * Starts an animation to fit the view around the specified selection of nodes.
   * @param bounds The bounds to animate the view to, defined by a rectangle.
   */
  animateToBounds(bounds, setDirty, {
    duration = 350,
    zoom = 0.75,
    easing = EaseFunction.EASE_IN_OUT_QUAD
  } = {}) {
    var _a;
    if (!(duration > 0)) throw new RangeError("Duration must be greater than 0");
    const easeFunctions = {
      linear: (t) => t,
      easeInQuad: (t) => t * t,
      easeOutQuad: (t) => t * (2 - t),
      easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    };
    const easeFunction = (_a = easeFunctions[easing]) != null ? _a : easeFunctions.linear;
    const startTimestamp = performance.now();
    const cw = this.element.width / window.devicePixelRatio;
    const ch = this.element.height / window.devicePixelRatio;
    const startX = this.offset[0];
    const startY = this.offset[1];
    const startX2 = startX - cw / this.scale;
    const startY2 = startY - ch / this.scale;
    const startScale = this.scale;
    let targetScale = startScale;
    if (zoom > 0) {
      const targetScaleX = zoom * cw / Math.max(bounds[2], 300);
      const targetScaleY = zoom * ch / Math.max(bounds[3], 300);
      targetScale = Math.min(targetScaleX, targetScaleY, this.max_scale);
    }
    const scaledWidth = cw / targetScale;
    const scaledHeight = ch / targetScale;
    const targetX = -bounds[0] - bounds[2] * 0.5 + scaledWidth * 0.5;
    const targetY = -bounds[1] - bounds[3] * 0.5 + scaledHeight * 0.5;
    const targetX2 = targetX - scaledWidth;
    const targetY2 = targetY - scaledHeight;
    const animate = (timestamp) => {
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeFunction(progress);
      const currentX = startX + (targetX - startX) * easedProgress;
      const currentY = startY + (targetY - startY) * easedProgress;
      this.offset[0] = currentX;
      this.offset[1] = currentY;
      if (zoom > 0) {
        const currentX2 = startX2 + (targetX2 - startX2) * easedProgress;
        const currentY2 = startY2 + (targetY2 - startY2) * easedProgress;
        const currentWidth = Math.abs(currentX2 - currentX);
        const currentHeight = Math.abs(currentY2 - currentY);
        this.scale = Math.min(cw / currentWidth, ch / currentHeight);
      }
      setDirty();
      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationId);
      }
    };
    let animationId = requestAnimationFrame(animate);
  }
  reset() {
    this.scale = 1;
    this.offset[0] = 0;
    this.offset[1] = 0;
  }
};
var SlotType = /* @__PURE__ */ ((SlotType2) => {
  SlotType2["Array"] = "array";
  SlotType2[SlotType2["Event"] = -1] = "Event";
  return SlotType2;
})(SlotType || {});
var SlotShape = ((SlotShape2) => {
  SlotShape2[SlotShape2["Box"] = RenderShape.BOX] = "Box";
  SlotShape2[SlotShape2["Arrow"] = RenderShape.ARROW] = "Arrow";
  SlotShape2[SlotShape2["Grid"] = RenderShape.GRID] = "Grid";
  SlotShape2[SlotShape2["Circle"] = RenderShape.CIRCLE] = "Circle";
  SlotShape2[SlotShape2["HollowCircle"] = RenderShape.HollowCircle] = "HollowCircle";
  return SlotShape2;
})(SlotShape || {});
var SlotDirection = ((SlotDirection2) => {
  SlotDirection2[SlotDirection2["Up"] = LinkDirection.UP] = "Up";
  SlotDirection2[SlotDirection2["Right"] = LinkDirection.RIGHT] = "Right";
  SlotDirection2[SlotDirection2["Down"] = LinkDirection.DOWN] = "Down";
  SlotDirection2[SlotDirection2["Left"] = LinkDirection.LEFT] = "Left";
  return SlotDirection2;
})(SlotDirection || {});
var LabelPosition = /* @__PURE__ */ ((LabelPosition2) => {
  LabelPosition2["Left"] = "left";
  LabelPosition2["Right"] = "right";
  return LabelPosition2;
})(LabelPosition || {});
function strokeShape(ctx, area, {
  shape = RenderShape.BOX,
  round_radius,
  title_height,
  title_mode = TitleMode.NORMAL_TITLE,
  color,
  padding = 6,
  collapsed = false,
  lineWidth: thickness = 1
} = {}) {
  round_radius != null ? round_radius : round_radius = LiteGraph.ROUND_RADIUS;
  color != null ? color : color = LiteGraph.NODE_BOX_OUTLINE_COLOR;
  if (title_mode === TitleMode.TRANSPARENT_TITLE) {
    const height2 = title_height != null ? title_height : LiteGraph.NODE_TITLE_HEIGHT;
    area[1] -= height2;
    area[3] += height2;
  }
  const { lineWidth, strokeStyle } = ctx;
  ctx.lineWidth = thickness;
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = color;
  ctx.beginPath();
  const [x2, y, width2, height] = area;
  switch (shape) {
    case RenderShape.BOX: {
      ctx.rect(
        x2 - padding,
        y - padding,
        width2 + 2 * padding,
        height + 2 * padding
      );
      break;
    }
    case RenderShape.ROUND:
    case RenderShape.CARD: {
      const radius = round_radius + padding;
      const isCollapsed = shape === RenderShape.CARD && collapsed;
      const cornerRadii = isCollapsed || shape === RenderShape.ROUND ? [radius] : [radius, 2, radius, 2];
      ctx.roundRect(
        x2 - padding,
        y - padding,
        width2 + 2 * padding,
        height + 2 * padding,
        cornerRadii
      );
      break;
    }
    case RenderShape.CIRCLE: {
      const centerX = x2 + width2 / 2;
      const centerY = y + height / 2;
      const radius = Math.max(width2, height) / 2 + padding;
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      break;
    }
  }
  ctx.stroke();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.globalAlpha = 1;
}
var zeroUuid = "00000000-0000-0000-0000-000000000000";
var randomStorage = new Uint32Array(31);
function createUuidv4() {
  if (typeof (crypto == null ? void 0 : crypto.randomUUID) === "function") return crypto.randomUUID();
  if (typeof (crypto == null ? void 0 : crypto.getRandomValues) === "function") {
    const random = crypto.getRandomValues(randomStorage);
    let i = 0;
    return "10000000-1000-4000-8000-100000000000".replaceAll(/[018]/g, (a) => (Number(a) ^ random[i++] * 3725290298461914e-24 >> Number(a) * 0.25).toString(16));
  }
  return "10000000-1000-4000-8000-100000000000".replaceAll(/[018]/g, (a) => (Number(a) ^ Math.random() * 16 >> Number(a) * 0.25).toString(16));
}
var LinkConnectorEventTarget = class extends EventTarget {
  dispatch(type, detail) {
    const event = new CustomEvent(type, { detail });
    return super.dispatchEvent(event);
  }
  addEventListener(type, listener, options2) {
    super.addEventListener(type, listener, options2);
  }
  removeEventListener(type, listener, options2) {
    super.removeEventListener(type, listener, options2);
  }
  /** @deprecated Use {@link dispatch}. */
  dispatchEvent(event) {
    return super.dispatchEvent(event);
  }
};
var _color;
var _LLink = class _LLink {
  constructor(id, type, origin_id, origin_slot, target_id, target_slot, parentId) {
    /** Link ID */
    __publicField(this, "id");
    __publicField(this, "parentId");
    __publicField(this, "type");
    /** Output node ID */
    __publicField(this, "origin_id");
    /** Output slot index */
    __publicField(this, "origin_slot");
    /** Input node ID */
    __publicField(this, "target_id");
    /** Input slot index */
    __publicField(this, "target_slot");
    __publicField(this, "data");
    __publicField(this, "_data");
    /** Centre point of the link, calculated during render only - can be inaccurate */
    __publicField(this, "_pos");
    /** @todo Clean up - never implemented in comfy. */
    __publicField(this, "_last_time");
    /** The last canvas 2D path that was used to render this link */
    __publicField(this, "path");
    /** @inheritdoc */
    __publicField(this, "_centreAngle");
    /** @inheritdoc */
    __publicField(this, "_dragging");
    __privateAdd(this, _color);
    this.id = id;
    this.type = type;
    this.origin_id = origin_id;
    this.origin_slot = origin_slot;
    this.target_id = target_id;
    this.target_slot = target_slot;
    this.parentId = parentId;
    this._data = null;
    this._pos = new Float32Array(2);
  }
  /** Custom colour for this link only */
  get color() {
    return __privateGet(this, _color);
  }
  set color(value) {
    __privateSet(this, _color, value === "" ? null : value);
  }
  get isFloatingOutput() {
    return this.origin_id === -1 && this.origin_slot === -1;
  }
  get isFloatingInput() {
    return this.target_id === -1 && this.target_slot === -1;
  }
  get isFloating() {
    return this.isFloatingOutput || this.isFloatingInput;
  }
  /** @deprecated Use {@link LLink.create} */
  static createFromArray(data) {
    return new _LLink(data[0], data[5], data[1], data[2], data[3], data[4]);
  }
  /**
   * LLink static factory: creates a new LLink from the provided data.
   * @param data Serialised LLink data to create the link from
   * @returns A new LLink
   */
  static create(data) {
    return new _LLink(
      data.id,
      data.type,
      data.origin_id,
      data.origin_slot,
      data.target_id,
      data.target_slot,
      data.parentId
    );
  }
  /**
   * Gets all reroutes from the output slot to this segment.  If this segment is a reroute, it will not be included.
   * @returns An ordered array of all reroutes from the node output to
   * this reroute or the reroute before it.  Otherwise, an empty array.
   */
  static getReroutes(network, linkSegment) {
    var _a, _b;
    if (!linkSegment.parentId) return [];
    return (_b = (_a = network.reroutes.get(linkSegment.parentId)) == null ? void 0 : _a.getReroutes()) != null ? _b : [];
  }
  static getFirstReroute(network, linkSegment) {
    return _LLink.getReroutes(network, linkSegment).at(0);
  }
  /**
   * Finds the reroute in the chain after the provided reroute ID.
   * @param network The network this link belongs to
   * @param linkSegment The starting point of the search (input side).
   * Typically the LLink object itself, but can be any link segment.
   * @param rerouteId The matching reroute will have this set as its {@link parentId}.
   * @returns The reroute that was found, `undefined` if no reroute was found, or `null` if an infinite loop was detected.
   */
  static findNextReroute(network, linkSegment, rerouteId) {
    var _a;
    if (!linkSegment.parentId) return;
    return (_a = network.reroutes.get(linkSegment.parentId)) == null ? void 0 : _a.findNextReroute(rerouteId);
  }
  configure(o) {
    if (Array.isArray(o)) {
      this.id = o[0];
      this.origin_id = o[1];
      this.origin_slot = o[2];
      this.target_id = o[3];
      this.target_slot = o[4];
      this.type = o[5];
    } else {
      this.id = o.id;
      this.type = o.type;
      this.origin_id = o.origin_id;
      this.origin_slot = o.origin_slot;
      this.target_id = o.target_id;
      this.target_slot = o.target_slot;
      this.parentId = o.parentId;
    }
  }
  /**
   * Checks if the specified node id and output index are this link's origin (output side).
   * @param nodeId ID of the node to check
   * @param outputIndex The array index of the node output
   * @returns `true` if the origin matches, otherwise `false`.
   */
  hasOrigin(nodeId, outputIndex) {
    return this.origin_id === nodeId && this.origin_slot === outputIndex;
  }
  /**
   * Checks if the specified node id and input index are this link's target (input side).
   * @param nodeId ID of the node to check
   * @param inputIndex The array index of the node input
   * @returns `true` if the target matches, otherwise `false`.
   */
  hasTarget(nodeId, inputIndex) {
    return this.target_id === nodeId && this.target_slot === inputIndex;
  }
  /**
   * Creates a floating link from this link.
   * @param slotType The side of the link that is still connected
   * @param parentId The parent reroute ID of the link
   * @returns A new LLink that is floating
   */
  toFloating(slotType, parentId) {
    const exported = this.asSerialisable();
    exported.id = -1;
    exported.parentId = parentId;
    if (slotType === "input") {
      exported.origin_id = -1;
      exported.origin_slot = -1;
    } else {
      exported.target_id = -1;
      exported.target_slot = -1;
    }
    return _LLink.create(exported);
  }
  /**
   * Disconnects a link and removes it from the graph, cleaning up any reroutes that are no longer used
   * @param network The container (LGraph) where reroutes should be updated
   * @param keepReroutes If `undefined`, reroutes will be automatically removed if no links remain.
   * If `input` or `output`, reroutes will not be automatically removed, and retain a connection to the input or output, respectively.
   */
  disconnect(network, keepReroutes) {
    const reroutes = _LLink.getReroutes(network, this);
    const lastReroute = reroutes.at(-1);
    const outputFloating = keepReroutes === "output" && (lastReroute == null ? void 0 : lastReroute.linkIds.size) === 1 && lastReroute.floatingLinkIds.size === 0;
    if (outputFloating || keepReroutes === "input" && lastReroute) {
      const newLink = _LLink.create(this);
      newLink.id = -1;
      if (keepReroutes === "input") {
        newLink.origin_id = -1;
        newLink.origin_slot = -1;
        lastReroute.floating = { slotType: "input" };
      } else {
        newLink.target_id = -1;
        newLink.target_slot = -1;
        lastReroute.floating = { slotType: "output" };
      }
      network.addFloatingLink(newLink);
    }
    for (const reroute of reroutes) {
      reroute.linkIds.delete(this.id);
      if (!keepReroutes && !reroute.totalLinks) {
        network.reroutes.delete(reroute.id);
      }
    }
    network.links.delete(this.id);
  }
  /**
   * @deprecated Prefer {@link LLink.asSerialisable} (returns an object, not an array)
   * @returns An array representing this LLink
   */
  serialize() {
    return [
      this.id,
      this.origin_id,
      this.origin_slot,
      this.target_id,
      this.target_slot,
      this.type
    ];
  }
  asSerialisable() {
    const copy = {
      id: this.id,
      origin_id: this.origin_id,
      origin_slot: this.origin_slot,
      target_id: this.target_id,
      target_slot: this.target_slot,
      type: this.type
    };
    if (this.parentId) copy.parentId = this.parentId;
    return copy;
  }
};
_color = new WeakMap();
var LLink = _LLink;
var FloatingRenderLink = class {
  constructor(network, link, toType, fromReroute, dragDirection = LinkDirection.CENTER) {
    __publicField(this, "node");
    __publicField(this, "fromSlot");
    __publicField(this, "fromPos");
    __publicField(this, "fromDirection");
    __publicField(this, "fromSlotIndex");
    __publicField(this, "outputNodeId", -1);
    __publicField(this, "outputNode");
    __publicField(this, "outputSlot");
    __publicField(this, "outputIndex", -1);
    __publicField(this, "outputPos");
    __publicField(this, "inputNodeId", -1);
    __publicField(this, "inputNode");
    __publicField(this, "inputSlot");
    __publicField(this, "inputIndex", -1);
    __publicField(this, "inputPos");
    var _a, _b, _c;
    this.network = network;
    this.link = link;
    this.toType = toType;
    this.fromReroute = fromReroute;
    this.dragDirection = dragDirection;
    const {
      origin_id: outputNodeId,
      target_id: inputNodeId,
      origin_slot: outputIndex,
      target_slot: inputIndex
    } = link;
    if (outputNodeId !== -1) {
      const outputNode = (_a = network.getNodeById(outputNodeId)) != null ? _a : void 0;
      if (!outputNode) throw new Error(`Creating DraggingRenderLink for link [${link.id}] failed: Output node [${outputNodeId}] not found.`);
      const outputSlot = outputNode == null ? void 0 : outputNode.outputs.at(outputIndex);
      if (!outputSlot) throw new Error(`Creating DraggingRenderLink for link [${link.id}] failed: Output slot [${outputIndex}] not found.`);
      this.outputNodeId = outputNodeId;
      this.outputNode = outputNode;
      this.outputSlot = outputSlot;
      this.outputIndex = outputIndex;
      this.outputPos = outputNode.getOutputPos(outputIndex);
      this.node = outputNode;
      this.fromSlot = outputSlot;
      this.fromPos = (_b = fromReroute == null ? void 0 : fromReroute.pos) != null ? _b : this.outputPos;
      this.fromDirection = LinkDirection.LEFT;
      this.dragDirection = LinkDirection.RIGHT;
      this.fromSlotIndex = outputIndex;
    } else {
      const inputNode = (_c = network.getNodeById(inputNodeId)) != null ? _c : void 0;
      if (!inputNode) throw new Error(`Creating DraggingRenderLink for link [${link.id}] failed: Input node [${inputNodeId}] not found.`);
      const inputSlot = inputNode == null ? void 0 : inputNode.inputs.at(inputIndex);
      if (!inputSlot) throw new Error(`Creating DraggingRenderLink for link [${link.id}] failed: Input slot [${inputIndex}] not found.`);
      this.inputNodeId = inputNodeId;
      this.inputNode = inputNode;
      this.inputSlot = inputSlot;
      this.inputIndex = inputIndex;
      this.inputPos = inputNode.getInputPos(inputIndex);
      this.node = inputNode;
      this.fromSlot = inputSlot;
      this.fromDirection = LinkDirection.RIGHT;
      this.fromSlotIndex = inputIndex;
    }
    this.fromPos = fromReroute.pos;
  }
  canConnectToInput() {
    return this.toType === "input";
  }
  canConnectToOutput() {
    return this.toType === "output";
  }
  canConnectToReroute(reroute) {
    var _a, _b;
    if (this.toType === "input") {
      if (reroute.origin_id === ((_a = this.inputNode) == null ? void 0 : _a.id)) return false;
    } else {
      if (reroute.origin_id === ((_b = this.outputNode) == null ? void 0 : _b.id)) return false;
    }
    return true;
  }
  connectToInput(node2, input, _events) {
    var _a, _b;
    const floatingLink = this.link;
    floatingLink.target_id = node2.id;
    floatingLink.target_slot = node2.inputs.indexOf(input);
    node2.disconnectInput(node2.inputs.indexOf(input));
    (_a = this.fromSlot._floatingLinks) == null ? void 0 : _a.delete(floatingLink);
    (_b = input._floatingLinks) != null ? _b : input._floatingLinks = /* @__PURE__ */ new Set();
    input._floatingLinks.add(floatingLink);
  }
  connectToOutput(node2, output, _events) {
    var _a, _b;
    const floatingLink = this.link;
    floatingLink.origin_id = node2.id;
    floatingLink.origin_slot = node2.outputs.indexOf(output);
    (_a = this.fromSlot._floatingLinks) == null ? void 0 : _a.delete(floatingLink);
    (_b = output._floatingLinks) != null ? _b : output._floatingLinks = /* @__PURE__ */ new Set();
    output._floatingLinks.add(floatingLink);
  }
  connectToRerouteInput(reroute, { node: inputNode, input }, events) {
    var _a, _b;
    const floatingLink = this.link;
    floatingLink.target_id = inputNode.id;
    floatingLink.target_slot = inputNode.inputs.indexOf(input);
    (_a = this.fromSlot._floatingLinks) == null ? void 0 : _a.delete(floatingLink);
    (_b = input._floatingLinks) != null ? _b : input._floatingLinks = /* @__PURE__ */ new Set();
    input._floatingLinks.add(floatingLink);
    events.dispatch("input-moved", this);
  }
  connectToRerouteOutput(reroute, outputNode, output, events) {
    var _a, _b;
    const floatingLink = this.link;
    floatingLink.origin_id = outputNode.id;
    floatingLink.origin_slot = outputNode.outputs.indexOf(output);
    (_a = this.fromSlot._floatingLinks) == null ? void 0 : _a.delete(floatingLink);
    (_b = output._floatingLinks) != null ? _b : output._floatingLinks = /* @__PURE__ */ new Set();
    output._floatingLinks.add(floatingLink);
    events.dispatch("output-moved", this);
  }
};
var MovingLinkBase = class {
  constructor(network, link, toType, fromReroute, dragDirection = LinkDirection.CENTER) {
    __publicField(this, "outputNodeId");
    __publicField(this, "outputNode");
    __publicField(this, "outputSlot");
    __publicField(this, "outputIndex");
    __publicField(this, "outputPos");
    __publicField(this, "inputNodeId");
    __publicField(this, "inputNode");
    __publicField(this, "inputSlot");
    __publicField(this, "inputIndex");
    __publicField(this, "inputPos");
    var _a, _b;
    this.network = network;
    this.link = link;
    this.toType = toType;
    this.fromReroute = fromReroute;
    this.dragDirection = dragDirection;
    const {
      origin_id: outputNodeId,
      target_id: inputNodeId,
      origin_slot: outputIndex,
      target_slot: inputIndex
    } = link;
    const outputNode = (_a = network.getNodeById(outputNodeId)) != null ? _a : void 0;
    if (!outputNode) throw new Error(`Creating MovingRenderLink for link [${link.id}] failed: Output node [${outputNodeId}] not found.`);
    const outputSlot = outputNode.outputs.at(outputIndex);
    if (!outputSlot) throw new Error(`Creating MovingRenderLink for link [${link.id}] failed: Output slot [${outputIndex}] not found.`);
    this.outputNodeId = outputNodeId;
    this.outputNode = outputNode;
    this.outputSlot = outputSlot;
    this.outputIndex = outputIndex;
    this.outputPos = outputNode.getOutputPos(outputIndex);
    const inputNode = (_b = network.getNodeById(inputNodeId)) != null ? _b : void 0;
    if (!inputNode) throw new Error(`Creating DraggingRenderLink for link [${link.id}] failed: Input node [${inputNodeId}] not found.`);
    const inputSlot = inputNode.inputs.at(inputIndex);
    if (!inputSlot) throw new Error(`Creating DraggingRenderLink for link [${link.id}] failed: Input slot [${inputIndex}] not found.`);
    this.inputNodeId = inputNodeId;
    this.inputNode = inputNode;
    this.inputSlot = inputSlot;
    this.inputIndex = inputIndex;
    this.inputPos = inputNode.getInputPos(inputIndex);
  }
};
var MovingInputLink = class extends MovingLinkBase {
  constructor(network, link, fromReroute, dragDirection = LinkDirection.CENTER) {
    var _a;
    super(network, link, "input", fromReroute, dragDirection);
    __publicField(this, "toType", "input");
    __publicField(this, "node");
    __publicField(this, "fromSlot");
    __publicField(this, "fromPos");
    __publicField(this, "fromDirection");
    __publicField(this, "fromSlotIndex");
    this.node = this.outputNode;
    this.fromSlot = this.outputSlot;
    this.fromPos = (_a = fromReroute == null ? void 0 : fromReroute.pos) != null ? _a : this.outputPos;
    this.fromDirection = LinkDirection.NONE;
    this.fromSlotIndex = this.outputIndex;
  }
  canConnectToInput(inputNode, input) {
    return this.node.canConnectTo(inputNode, input, this.outputSlot);
  }
  canConnectToOutput() {
    return false;
  }
  canConnectToReroute(reroute) {
    return reroute.origin_id !== this.inputNode.id;
  }
  connectToInput(inputNode, input, events) {
    var _a;
    if (input === this.inputSlot) return;
    this.inputNode.disconnectInput(this.inputIndex, true);
    const link = this.outputNode.connectSlots(this.outputSlot, inputNode, input, (_a = this.fromReroute) == null ? void 0 : _a.id);
    if (link) events.dispatch("input-moved", this);
    return link;
  }
  connectToOutput() {
    throw new Error("MovingInputLink cannot connect to an output.");
  }
  connectToRerouteInput(reroute, { node: inputNode, input, link: existingLink }, events, originalReroutes) {
    const { outputNode, outputSlot, fromReroute } = this;
    for (const reroute2 of originalReroutes) {
      if (reroute2.id === this.link.parentId) break;
      if (reroute2.totalLinks === 1) reroute2.remove();
    }
    reroute.parentId = fromReroute == null ? void 0 : fromReroute.id;
    const newLink = outputNode.connectSlots(outputSlot, inputNode, input, existingLink.parentId);
    if (newLink) events.dispatch("input-moved", this);
  }
  connectToRerouteOutput() {
    throw new Error("MovingInputLink cannot connect to an output.");
  }
};
var MovingOutputLink = class extends MovingLinkBase {
  constructor(network, link, fromReroute, dragDirection = LinkDirection.CENTER) {
    var _a;
    super(network, link, "output", fromReroute, dragDirection);
    __publicField(this, "toType", "output");
    __publicField(this, "node");
    __publicField(this, "fromSlot");
    __publicField(this, "fromPos");
    __publicField(this, "fromDirection");
    __publicField(this, "fromSlotIndex");
    this.node = this.inputNode;
    this.fromSlot = this.inputSlot;
    this.fromPos = (_a = fromReroute == null ? void 0 : fromReroute.pos) != null ? _a : this.inputPos;
    this.fromDirection = LinkDirection.LEFT;
    this.fromSlotIndex = this.inputIndex;
  }
  canConnectToInput() {
    return false;
  }
  canConnectToOutput(outputNode, output) {
    return outputNode.canConnectTo(this.node, this.inputSlot, output);
  }
  canConnectToReroute(reroute) {
    return reroute.origin_id !== this.outputNode.id;
  }
  connectToInput() {
    throw new Error("MovingOutputLink cannot connect to an input.");
  }
  connectToOutput(outputNode, output, events) {
    if (output === this.outputSlot) return;
    const link = outputNode.connectSlots(output, this.inputNode, this.inputSlot, this.link.parentId);
    if (link) events.dispatch("output-moved", this);
    return link;
  }
  connectToRerouteInput() {
    throw new Error("MovingOutputLink cannot connect to an input.");
  }
  connectToRerouteOutput(reroute, outputNode, output, events) {
    var _a;
    const { inputNode, inputSlot, fromReroute } = this;
    const floatingTerminus = ((_a = reroute == null ? void 0 : reroute.floating) == null ? void 0 : _a.slotType) === "output";
    if (fromReroute) {
      fromReroute.parentId = reroute.id;
    } else {
      this.link.parentId = reroute.id;
    }
    outputNode.connectSlots(output, inputNode, inputSlot, this.link.parentId);
    if (floatingTerminus) reroute.removeAllFloatingLinks();
    events.dispatch("output-moved", this);
  }
};
var ToInputRenderLink = class {
  constructor(network, node2, fromSlot, fromReroute, dragDirection = LinkDirection.CENTER) {
    __publicField(this, "toType", "input");
    __publicField(this, "fromPos");
    __publicField(this, "fromSlotIndex");
    __publicField(this, "fromDirection", LinkDirection.RIGHT);
    this.network = network;
    this.node = node2;
    this.fromSlot = fromSlot;
    this.fromReroute = fromReroute;
    this.dragDirection = dragDirection;
    const outputIndex = node2.outputs.indexOf(fromSlot);
    if (outputIndex === -1) throw new Error(`Creating render link for node [${this.node.id}] failed: Slot index not found.`);
    this.fromSlotIndex = outputIndex;
    this.fromPos = fromReroute ? fromReroute.pos : this.node.getOutputPos(outputIndex);
  }
  canConnectToInput(inputNode, input) {
    return this.node.canConnectTo(inputNode, input, this.fromSlot);
  }
  canConnectToOutput() {
    return false;
  }
  connectToInput(node2, input, events) {
    const { node: outputNode, fromSlot, fromReroute } = this;
    if (node2 === outputNode) return;
    const newLink = outputNode.connectSlots(fromSlot, node2, input, fromReroute == null ? void 0 : fromReroute.id);
    events.dispatch("link-created", newLink);
  }
  connectToRerouteInput(reroute, {
    node: inputNode,
    input,
    link: existingLink
  }, events, originalReroutes) {
    var _a;
    const { node: outputNode, fromSlot, fromReroute } = this;
    const floatingTerminus = ((_a = fromReroute == null ? void 0 : fromReroute.floating) == null ? void 0 : _a.slotType) === "output";
    reroute.parentId = fromReroute == null ? void 0 : fromReroute.id;
    const newLink = outputNode.connectSlots(fromSlot, inputNode, input, existingLink.parentId);
    if (floatingTerminus) fromReroute.removeAllFloatingLinks();
    for (const reroute2 of originalReroutes) {
      if (reroute2.id === (fromReroute == null ? void 0 : fromReroute.id)) break;
      reroute2.removeLink(existingLink);
      if (reroute2.totalLinks === 0) {
        if (existingLink.isFloating) {
          reroute2.remove();
        } else {
          const cl = existingLink.toFloating("output", reroute2.id);
          this.network.addFloatingLink(cl);
          reroute2.floating = { slotType: "output" };
        }
      }
    }
    events.dispatch("link-created", newLink);
  }
  connectToOutput() {
    throw new Error("ToInputRenderLink cannot connect to an output.");
  }
  connectToRerouteOutput() {
    throw new Error("ToInputRenderLink cannot connect to an output.");
  }
};
var ToOutputRenderLink = class {
  constructor(network, node2, fromSlot, fromReroute, dragDirection = LinkDirection.CENTER) {
    __publicField(this, "toType", "output");
    __publicField(this, "fromPos");
    __publicField(this, "fromSlotIndex");
    __publicField(this, "fromDirection", LinkDirection.LEFT);
    this.network = network;
    this.node = node2;
    this.fromSlot = fromSlot;
    this.fromReroute = fromReroute;
    this.dragDirection = dragDirection;
    const inputIndex = node2.inputs.indexOf(fromSlot);
    if (inputIndex === -1) throw new Error(`Creating render link for node [${this.node.id}] failed: Slot index not found.`);
    this.fromSlotIndex = inputIndex;
    this.fromPos = fromReroute ? fromReroute.pos : this.node.getInputPos(inputIndex);
  }
  canConnectToInput() {
    return false;
  }
  canConnectToOutput(outputNode, output) {
    return this.node.canConnectTo(outputNode, this.fromSlot, output);
  }
  canConnectToReroute(reroute) {
    if (reroute.origin_id === this.node.id) return false;
    return true;
  }
  connectToOutput(node2, output, events) {
    const { node: inputNode, fromSlot, fromReroute } = this;
    if (!inputNode) return;
    const newLink = node2.connectSlots(output, inputNode, fromSlot, fromReroute == null ? void 0 : fromReroute.id);
    events.dispatch("link-created", newLink);
  }
  connectToRerouteOutput(reroute, outputNode, output, events) {
    const { node: inputNode, fromSlot } = this;
    const newLink = outputNode.connectSlots(output, inputNode, fromSlot, reroute == null ? void 0 : reroute.id);
    events.dispatch("link-created", newLink);
  }
  connectToInput() {
    throw new Error("ToOutputRenderLink cannot connect to an input.");
  }
  connectToRerouteInput() {
    throw new Error("ToOutputRenderLink cannot connect to an input.");
  }
};
var _setConnectingLinks, _LinkConnector_instances, dropOnNodeBackground_fn, dropOnInput_fn, dropOnOutput_fn, setLegacyLinks_fn;
var LinkConnector = class {
  constructor(setConnectingLinks) {
    __privateAdd(this, _LinkConnector_instances);
    /**
     * Link connection state POJO. Source of truth for state of link drag operations.
     *
     * Can be replaced or proxied to allow notifications.
     * Is always dereferenced at the start of an operation.
     */
    __publicField(this, "state", {
      connectingTo: void 0,
      multi: false,
      draggingExistingLinks: false
    });
    __publicField(this, "events", new LinkConnectorEventTarget());
    /** Contains information for rendering purposes only. */
    __publicField(this, "renderLinks", []);
    /** Existing links that are being moved **to** a new input slot. */
    __publicField(this, "inputLinks", []);
    /** Existing links that are being moved **to** a new output slot. */
    __publicField(this, "outputLinks", []);
    /** Existing floating links that are being moved to a new slot. */
    __publicField(this, "floatingLinks", []);
    __publicField(this, "hiddenReroutes", /* @__PURE__ */ new Set());
    /** The widget beneath the pointer, if it is a valid connection target. */
    __publicField(this, "overWidget");
    /** The type (returned by downstream callback) for {@link overWidget} */
    __publicField(this, "overWidgetType");
    /** The reroute beneath the pointer, if it is a valid connection target. */
    __publicField(this, "overReroute");
    __privateAdd(this, _setConnectingLinks);
    __privateSet(this, _setConnectingLinks, setConnectingLinks);
  }
  get isConnecting() {
    return this.state.connectingTo !== void 0;
  }
  get draggingExistingLinks() {
    return this.state.draggingExistingLinks;
  }
  /** Drag an existing link to a different input. */
  moveInputLink(network, input) {
    var _a;
    if (this.isConnecting) throw new Error("Already dragging links.");
    const { state, inputLinks, renderLinks } = this;
    const linkId = input.link;
    if (linkId == null) {
      const floatingLink = (_a = input._floatingLinks) == null ? void 0 : _a.values().next().value;
      if ((floatingLink == null ? void 0 : floatingLink.parentId) == null) return;
      try {
        const reroute = network.reroutes.get(floatingLink.parentId);
        if (!reroute) throw new Error(`Invalid reroute id: [${floatingLink.parentId}] for floating link id: [${floatingLink.id}].`);
        const renderLink = new FloatingRenderLink(network, floatingLink, "input", reroute);
        const mayContinue = this.events.dispatch("before-move-input", renderLink);
        if (mayContinue === false) return;
        renderLinks.push(renderLink);
      } catch (error) {
        console.warn(`Could not create render link for link id: [${floatingLink.id}].`, floatingLink, error);
      }
      floatingLink._dragging = true;
      this.floatingLinks.push(floatingLink);
    } else {
      const link = network.links.get(linkId);
      if (!link) return;
      try {
        const reroute = network.getReroute(link.parentId);
        const renderLink = new MovingInputLink(network, link, reroute);
        const mayContinue = this.events.dispatch("before-move-input", renderLink);
        if (mayContinue === false) return;
        renderLinks.push(renderLink);
        this.listenUntilReset("input-moved", (e2) => {
          e2.detail.link.disconnect(network, "output");
        });
      } catch (error) {
        console.warn(`Could not create render link for link id: [${link.id}].`, link, error);
        return;
      }
      link._dragging = true;
      inputLinks.push(link);
    }
    state.connectingTo = "input";
    state.draggingExistingLinks = true;
    __privateMethod(this, _LinkConnector_instances, setLegacyLinks_fn).call(this, false);
  }
  /** Drag all links from an output to a new output. */
  moveOutputLink(network, output) {
    var _a, _b;
    if (this.isConnecting) throw new Error("Already dragging links.");
    const { state, renderLinks } = this;
    if ((_a = output._floatingLinks) == null ? void 0 : _a.size) {
      for (const floatingLink of output._floatingLinks.values()) {
        try {
          const reroute = LLink.getFirstReroute(network, floatingLink);
          if (!reroute) throw new Error(`Invalid reroute id: [${floatingLink.parentId}] for floating link id: [${floatingLink.id}].`);
          const renderLink = new FloatingRenderLink(network, floatingLink, "output", reroute);
          const mayContinue = this.events.dispatch("before-move-output", renderLink);
          if (mayContinue === false) continue;
          renderLinks.push(renderLink);
          this.floatingLinks.push(floatingLink);
        } catch (error) {
          console.warn(`Could not create render link for link id: [${floatingLink.id}].`, floatingLink, error);
        }
      }
    }
    if ((_b = output.links) == null ? void 0 : _b.length) {
      for (const linkId of output.links) {
        const link = network.links.get(linkId);
        if (!link) continue;
        const firstReroute = LLink.getFirstReroute(network, link);
        if (firstReroute) {
          firstReroute._dragging = true;
          this.hiddenReroutes.add(firstReroute);
        } else {
          link._dragging = true;
        }
        this.outputLinks.push(link);
        try {
          const renderLink = new MovingOutputLink(network, link, firstReroute, LinkDirection.RIGHT);
          const mayContinue = this.events.dispatch("before-move-output", renderLink);
          if (mayContinue === false) continue;
          renderLinks.push(renderLink);
        } catch (error) {
          console.warn(`Could not create render link for link id: [${link.id}].`, link, error);
          continue;
        }
      }
    }
    if (renderLinks.length === 0) return this.reset();
    state.draggingExistingLinks = true;
    state.multi = true;
    state.connectingTo = "output";
    __privateMethod(this, _LinkConnector_instances, setLegacyLinks_fn).call(this, true);
  }
  /**
   * Drags a new link from an output slot to an input slot.
   * @param network The network that the link being connected belongs to
   * @param node The node the link is being dragged from
   * @param output The output slot that the link is being dragged from
   */
  dragNewFromOutput(network, node2, output, fromReroute) {
    if (this.isConnecting) throw new Error("Already dragging links.");
    const { state } = this;
    const renderLink = new ToInputRenderLink(network, node2, output, fromReroute);
    this.renderLinks.push(renderLink);
    state.connectingTo = "input";
    __privateMethod(this, _LinkConnector_instances, setLegacyLinks_fn).call(this, false);
  }
  /**
   * Drags a new link from an input slot to an output slot.
   * @param network The network that the link being connected belongs to
   * @param node The node the link is being dragged from
   * @param input The input slot that the link is being dragged from
   */
  dragNewFromInput(network, node2, input, fromReroute) {
    if (this.isConnecting) throw new Error("Already dragging links.");
    const { state } = this;
    const renderLink = new ToOutputRenderLink(network, node2, input, fromReroute);
    this.renderLinks.push(renderLink);
    state.connectingTo = "output";
    __privateMethod(this, _LinkConnector_instances, setLegacyLinks_fn).call(this, true);
  }
  /**
   * Drags a new link from a reroute to an input slot.
   * @param network The network that the link being connected belongs to
   * @param reroute The reroute that the link is being dragged from
   */
  dragFromReroute(network, reroute) {
    var _a;
    if (this.isConnecting) throw new Error("Already dragging links.");
    const link = (_a = reroute.firstLink) != null ? _a : reroute.firstFloatingLink;
    if (!link) return;
    const outputNode = network.getNodeById(link.origin_id);
    if (!outputNode) return;
    const outputSlot = outputNode.outputs.at(link.origin_slot);
    if (!outputSlot) return;
    const renderLink = new ToInputRenderLink(network, outputNode, outputSlot, reroute);
    renderLink.fromDirection = LinkDirection.NONE;
    this.renderLinks.push(renderLink);
    this.state.connectingTo = "input";
    __privateMethod(this, _LinkConnector_instances, setLegacyLinks_fn).call(this, false);
  }
  dragFromLinkSegment(network, linkSegment) {
    if (this.isConnecting) throw new Error("Already dragging links.");
    const { state } = this;
    if (linkSegment.origin_id == null || linkSegment.origin_slot == null) return;
    const node2 = network.getNodeById(linkSegment.origin_id);
    if (!node2) return;
    const slot = node2.outputs.at(linkSegment.origin_slot);
    if (!slot) return;
    const reroute = network.getReroute(linkSegment.parentId);
    const renderLink = new ToInputRenderLink(network, node2, slot, reroute);
    renderLink.fromDirection = LinkDirection.NONE;
    this.renderLinks.push(renderLink);
    state.connectingTo = "input";
    __privateMethod(this, _LinkConnector_instances, setLegacyLinks_fn).call(this, false);
  }
  /**
   * Connects the links being droppe
   * @param event Contains the drop location, in canvas space
   */
  dropLinks(locator, event) {
    var _a;
    if (!this.isConnecting) return this.reset();
    const { renderLinks } = this;
    const mayContinue = this.events.dispatch("before-drop-links", { renderLinks, event });
    if (mayContinue === false) return this.reset();
    const { canvasX, canvasY } = event;
    const node2 = (_a = locator.getNodeOnPos(canvasX, canvasY)) != null ? _a : void 0;
    if (node2) {
      this.dropOnNode(node2, event);
    } else {
      const reroute = locator.getRerouteOnPos(canvasX, canvasY);
      if (reroute && this.isRerouteValidDrop(reroute)) {
        this.dropOnReroute(reroute, event);
      } else {
        this.dropOnNothing(event);
      }
    }
    this.events.dispatch("after-drop-links", { renderLinks, event });
    this.reset();
  }
  dropOnNode(node2, event) {
    const { renderLinks, state } = this;
    const { connectingTo } = state;
    const { canvasX, canvasY } = event;
    if (renderLinks.every((link) => link.node === node2)) return;
    if (connectingTo === "output") {
      const output = node2.getOutputOnPos([canvasX, canvasY]);
      if (output) {
        __privateMethod(this, _LinkConnector_instances, dropOnOutput_fn).call(this, node2, output);
      } else {
        __privateMethod(this, _LinkConnector_instances, dropOnNodeBackground_fn).call(this, node2, event);
      }
    } else if (connectingTo === "input") {
      const input = node2.getInputOnPos([canvasX, canvasY]);
      if (input) {
        __privateMethod(this, _LinkConnector_instances, dropOnInput_fn).call(this, node2, input);
      } else if (this.overWidget && renderLinks[0] instanceof ToInputRenderLink) {
        this.events.dispatch("dropped-on-widget", {
          link: renderLinks[0],
          node: node2,
          widget: this.overWidget
        });
        this.overWidget = void 0;
      } else {
        __privateMethod(this, _LinkConnector_instances, dropOnNodeBackground_fn).call(this, node2, event);
      }
    }
  }
  dropOnReroute(reroute, event) {
    const mayContinue = this.events.dispatch("dropped-on-reroute", { reroute, event });
    if (mayContinue === false) return;
    if (this.state.connectingTo === "input") {
      if (this.renderLinks.length !== 1) throw new Error(`Attempted to connect ${this.renderLinks.length} input links to a reroute.`);
      const renderLink = this.renderLinks[0];
      const results = reroute.findTargetInputs();
      if (!(results == null ? void 0 : results.length)) return;
      const maybeReroutes = reroute.getReroutes();
      if (maybeReroutes === null) throw new Error("Reroute loop detected.");
      const originalReroutes = maybeReroutes.slice(0, -1).reverse();
      if (renderLink instanceof ToInputRenderLink) {
        const { node: node2, fromSlot, fromSlotIndex, fromReroute } = renderLink;
        const floatingOutLinks = reroute.getFloatingLinks("output");
        const floatingInLinks = reroute.getFloatingLinks("input");
        reroute.setFloatingLinkOrigin(node2, fromSlot, fromSlotIndex);
        if (floatingOutLinks && floatingInLinks) {
          for (const link of floatingOutLinks) {
            link.origin_id = node2.id;
            link.origin_slot = fromSlotIndex;
            for (const originalReroute of originalReroutes) {
              if (fromReroute != null && originalReroute.id === fromReroute.id) break;
              originalReroute.floatingLinkIds.delete(link.id);
            }
          }
          for (const link of floatingInLinks) {
            for (const originalReroute of originalReroutes) {
              if (fromReroute != null && originalReroute.id === fromReroute.id) break;
              originalReroute.floatingLinkIds.delete(link.id);
            }
          }
        }
      }
      const better = this.renderLinks.flatMap((renderLink2) => results.map((result) => ({ renderLink: renderLink2, result }))).filter(({ renderLink: renderLink2, result }) => renderLink2.toType === "input" && canConnectInputLinkToReroute(renderLink2, result.node, result.input, reroute));
      for (const { renderLink: renderLink2, result } of better) {
        if (renderLink2.toType !== "input") continue;
        renderLink2.connectToRerouteInput(reroute, result, this.events, originalReroutes);
      }
      return;
    }
    for (const link of this.renderLinks) {
      if (link.toType !== "output") continue;
      const result = reroute.findSourceOutput();
      if (!result) continue;
      const { node: node2, output } = result;
      if (!link.canConnectToOutput(node2, output)) continue;
      link.connectToRerouteOutput(reroute, node2, output, this.events);
    }
  }
  dropOnNothing(event) {
    if (this.state.connectingTo === "input") {
      for (const link of this.renderLinks) {
        if (link instanceof MovingInputLink) {
          link.inputNode.disconnectInput(link.inputIndex, true);
        }
      }
    }
    this.events.dispatch("dropped-on-canvas", event);
  }
  isNodeValidDrop(node2) {
    var _a;
    if (this.state.connectingTo === "output") {
      return node2.outputs.some((output) => this.renderLinks.some((link) => link.canConnectToOutput(node2, output)));
    }
    if ((_a = node2.widgets) == null ? void 0 : _a.length) {
      return true;
    }
    return node2.inputs.some((input) => this.renderLinks.some((link) => link.canConnectToInput(node2, input)));
  }
  /**
   * Checks if a reroute is a valid drop target for any of the links being connected.
   * @param reroute The reroute that would be dropped on.
   * @returns `true` if any of the current links being connected are valid for the given reroute.
   */
  isRerouteValidDrop(reroute) {
    if (this.state.connectingTo === "input") {
      const results = reroute.findTargetInputs();
      if (!(results == null ? void 0 : results.length)) return false;
      for (const { node: node2, input } of results) {
        for (const renderLink of this.renderLinks) {
          if (renderLink.toType !== "input") continue;
          if (canConnectInputLinkToReroute(renderLink, node2, input, reroute)) return true;
        }
      }
    } else {
      const result = reroute.findSourceOutput();
      if (!result) return false;
      const { node: node2, output } = result;
      for (const renderLink of this.renderLinks) {
        if (renderLink.toType !== "output") continue;
        if (!renderLink.canConnectToReroute(reroute)) continue;
        if (renderLink.canConnectToOutput(node2, output)) return true;
      }
    }
    return false;
  }
  /**
   * Exports the current state of the link connector.
   * @param network The network that the links being connected belong to.
   * @returns A POJO with the state of the link connector, links being connected, and their network.
   * @remarks Other than {@link network}, all properties are shallow cloned.
   */
  export(network) {
    return {
      renderLinks: [...this.renderLinks],
      inputLinks: [...this.inputLinks],
      outputLinks: [...this.outputLinks],
      floatingLinks: [...this.floatingLinks],
      state: { ...this.state },
      network
    };
  }
  /**
   * Adds an event listener that will be automatically removed when the reset event is fired.
   * @param eventName The event to listen for.
   * @param listener The listener to call when the event is fired.
   */
  listenUntilReset(eventName, listener, options2) {
    this.events.addEventListener(eventName, listener, options2);
    this.events.addEventListener("reset", () => this.events.removeEventListener(eventName, listener), { once: true });
  }
  /**
   * Resets everything to its initial state.
   *
   * Effectively cancels moving or connecting links.
   */
  reset(force = false) {
    this.events.dispatch("reset", force);
    const { state, outputLinks, inputLinks, hiddenReroutes, renderLinks, floatingLinks } = this;
    if (!force && state.connectingTo === void 0) return;
    state.connectingTo = void 0;
    for (const link of outputLinks) delete link._dragging;
    for (const link of inputLinks) delete link._dragging;
    for (const link of floatingLinks) delete link._dragging;
    for (const reroute of hiddenReroutes) delete reroute._dragging;
    renderLinks.length = 0;
    inputLinks.length = 0;
    outputLinks.length = 0;
    floatingLinks.length = 0;
    hiddenReroutes.clear();
    state.multi = false;
    state.draggingExistingLinks = false;
  }
};
_setConnectingLinks = new WeakMap();
_LinkConnector_instances = new WeakSet();
/**
 * Connects the links being dropped onto a node.
 * @param node The node that the links are being dropped on
 * @param event Contains the drop location, in canvas space
 */
dropOnNodeBackground_fn = function(node2, event) {
  var _a, _b;
  const { state: { connectingTo } } = this;
  const mayContinue = this.events.dispatch("dropped-on-node", { node: node2, event });
  if (mayContinue === false) return;
  const firstLink = this.renderLinks[0];
  if (!firstLink) return;
  if (connectingTo === "output") {
    const output = (_a = node2.findOutputByType(firstLink.fromSlot.type)) == null ? void 0 : _a.slot;
    if (!output) {
      console.warn(`Could not find slot for link type: [${firstLink.fromSlot.type}].`);
      return;
    }
    __privateMethod(this, _LinkConnector_instances, dropOnOutput_fn).call(this, node2, output);
  } else if (connectingTo === "input") {
    const input = (_b = node2.findInputByType(firstLink.fromSlot.type)) == null ? void 0 : _b.slot;
    if (!input) {
      console.warn(`Could not find slot for link type: [${firstLink.fromSlot.type}].`);
      return;
    }
    __privateMethod(this, _LinkConnector_instances, dropOnInput_fn).call(this, node2, input);
  }
};
dropOnInput_fn = function(node2, input) {
  for (const link of this.renderLinks) {
    if (!link.canConnectToInput(node2, input)) continue;
    link.connectToInput(node2, input, this.events);
  }
};
dropOnOutput_fn = function(node2, output) {
  for (const link of this.renderLinks) {
    if (!link.canConnectToOutput(node2, output)) {
      if (link instanceof MovingOutputLink && link.link.parentId !== void 0) {
        link.outputNode.connectSlots(link.outputSlot, link.inputNode, link.inputSlot, void 0);
      }
      continue;
    }
    link.connectToOutput(node2, output, this.events);
  }
};
/** Sets connecting_links, used by some extensions still. */
setLegacyLinks_fn = function(fromSlotIsInput) {
  const links = this.renderLinks.map((link) => {
    var _a, _b;
    const input = fromSlotIsInput ? link.fromSlot : null;
    const output = fromSlotIsInput ? null : link.fromSlot;
    const afterRerouteId = link instanceof MovingLinkBase ? (_a = link.link) == null ? void 0 : _a.parentId : (_b = link.fromReroute) == null ? void 0 : _b.id;
    return {
      node: link.node,
      slot: link.fromSlotIndex,
      input,
      output,
      pos: link.fromPos,
      afterRerouteId
    };
  });
  __privateGet(this, _setConnectingLinks).call(this, links);
};
function canConnectInputLinkToReroute(link, inputNode, input, reroute) {
  var _a, _b, _c;
  const { fromReroute } = link;
  if (!link.canConnectToInput(inputNode, input) || // Would result in no change
  (fromReroute == null ? void 0 : fromReroute.id) === reroute.id || // Cannot connect from child to parent reroute
  ((_a = fromReroute == null ? void 0 : fromReroute.getReroutes()) == null ? void 0 : _a.includes(reroute))) {
    return false;
  }
  if (link instanceof ToInputRenderLink) {
    if (reroute.parentId == null) {
      if ((_b = reroute.firstLink) == null ? void 0 : _b.hasOrigin(link.node.id, link.fromSlotIndex)) return false;
    } else if (((_c = link.fromReroute) == null ? void 0 : _c.id) === reroute.parentId) {
      return false;
    }
  }
  return true;
}
function getNodeInputOnPos(node2, x2, y) {
  var _a, _b, _c, _d, _e;
  const { inputs } = node2;
  if (!inputs) return;
  for (const [index, input] of inputs.entries()) {
    const pos = node2.getInputPos(index);
    const nameLength = (_e = (_c = (_a = input.label) == null ? void 0 : _a.length) != null ? _c : (_b = input.localized_name) == null ? void 0 : _b.length) != null ? _e : (_d = input.name) == null ? void 0 : _d.length;
    const width2 = 20 + (nameLength || 3) * 7;
    if (isInRectangle(
      x2,
      y,
      pos[0] - 10,
      pos[1] - 10,
      width2,
      20
    )) {
      return { index, input, pos };
    }
  }
}
function getNodeOutputOnPos(node2, x2, y) {
  const { outputs } = node2;
  if (!outputs) return;
  for (const [index, output] of outputs.entries()) {
    const pos = node2.getOutputPos(index);
    if (isInRectangle(
      x2,
      y,
      pos[0] - 10,
      pos[1] - 10,
      40,
      20
    )) {
      return { index, output, pos };
    }
  }
}
function isOverNodeInput(node2, canvasx, canvasy, slot_pos) {
  const result = getNodeInputOnPos(node2, canvasx, canvasy);
  if (!result) return -1;
  if (slot_pos) {
    slot_pos[0] = result.pos[0];
    slot_pos[1] = result.pos[1];
  }
  return result.index;
}
function isOverNodeOutput(node2, canvasx, canvasy, slot_pos) {
  const result = getNodeOutputOnPos(node2, canvasx, canvasy);
  if (!result) return -1;
  if (slot_pos) {
    slot_pos[0] = result.pos[0];
    slot_pos[1] = result.pos[1];
  }
  return result.index;
}
var _maxClickDrift, _maxClickDrift2, _finally, _CanvasPointer_instances, completeClick_fn, hasSamePosition_fn, isDoubleClick_fn, setDragStarted_fn;
var _CanvasPointer = class _CanvasPointer {
  constructor(element) {
    __privateAdd(this, _CanvasPointer_instances);
    /** The element this PointerState should capture input against when dragging. */
    __publicField(this, "element");
    /** Pointer ID used by drag capture. */
    __publicField(this, "pointerId");
    /** Set to true when if the pointer moves far enough after a down event, before the corresponding up event is fired. */
    __publicField(this, "dragStarted", false);
    /** The {@link eUp} from the last successful click */
    __publicField(this, "eLastDown");
    /** Used downstream for touch event support. */
    __publicField(this, "isDouble", false);
    /** Used downstream for touch event support. */
    __publicField(this, "isDown", false);
    /**
     * If `true`, {@link eDown}, {@link eMove}, and {@link eUp} will be set to
     * `undefined` when {@link reset} is called.
     *
     * Default: `true`
     */
    __publicField(this, "clearEventsOnReset", true);
    /** The last pointerdown event for the primary button */
    __publicField(this, "eDown");
    /** The last pointermove event for the primary button */
    __publicField(this, "eMove");
    /** The last pointerup event for the primary button */
    __publicField(this, "eUp");
    __privateAdd(this, _finally);
    this.element = element;
  }
  /** Maximum offset from click location */
  static get maxClickDrift() {
    return __privateGet(this, _maxClickDrift);
  }
  static set maxClickDrift(value) {
    __privateSet(this, _maxClickDrift, value);
    __privateSet(this, _maxClickDrift2, value * value);
  }
  /**
   * Run-once callback, called at the end of any click or drag, whether or not it was successful in any way.
   *
   * The setter of this callback will call the existing value before replacing it.
   * Therefore, simply setting this value twice will execute the first callback.
   */
  get finally() {
    return __privateGet(this, _finally);
  }
  set finally(value) {
    var _a;
    try {
      (_a = __privateGet(this, _finally)) == null ? void 0 : _a.call(this);
    } finally {
      __privateSet(this, _finally, value);
    }
  }
  /**
   * Callback for `pointerdown` events.  To be used as the event handler (or called by it).
   * @param e The `pointerdown` event
   */
  down(e2) {
    this.reset();
    this.eDown = e2;
    this.pointerId = e2.pointerId;
    this.element.setPointerCapture(e2.pointerId);
  }
  /**
   * Callback for `pointermove` events.  To be used as the event handler (or called by it).
   * @param e The `pointermove` event
   */
  move(e2) {
    var _a;
    const { eDown } = this;
    if (!eDown) return;
    if (!e2.buttons) {
      this.reset();
      return;
    }
    if (!(e2.buttons & eDown.buttons)) {
      __privateMethod(this, _CanvasPointer_instances, completeClick_fn).call(this, e2);
      this.reset();
      return;
    }
    this.eMove = e2;
    (_a = this.onDrag) == null ? void 0 : _a.call(this, e2);
    if (this.dragStarted) return;
    const longerThanBufferTime = e2.timeStamp - eDown.timeStamp > _CanvasPointer.bufferTime;
    if (longerThanBufferTime || !__privateMethod(this, _CanvasPointer_instances, hasSamePosition_fn).call(this, e2, eDown)) {
      __privateMethod(this, _CanvasPointer_instances, setDragStarted_fn).call(this);
    }
  }
  /**
   * Callback for `pointerup` events.  To be used as the event handler (or called by it).
   * @param e The `pointerup` event
   */
  up(e2) {
    var _a;
    if (e2.button !== ((_a = this.eDown) == null ? void 0 : _a.button)) return false;
    __privateMethod(this, _CanvasPointer_instances, completeClick_fn).call(this, e2);
    const { dragStarted } = this;
    this.reset();
    return !dragStarted;
  }
  /**
   * Resets the state of this {@link CanvasPointer} instance.
   *
   * The {@link finally} callback is first executed, then all callbacks and intra-click
   * state is cleared.
   */
  reset() {
    this.finally = void 0;
    delete this.onClick;
    delete this.onDoubleClick;
    delete this.onDragStart;
    delete this.onDrag;
    delete this.onDragEnd;
    this.isDown = false;
    this.isDouble = false;
    this.dragStarted = false;
    if (this.clearEventsOnReset) {
      this.eDown = void 0;
      this.eMove = void 0;
      this.eUp = void 0;
    }
    const { element, pointerId } = this;
    this.pointerId = void 0;
    if (typeof pointerId === "number" && element.hasPointerCapture(pointerId)) {
      element.releasePointerCapture(pointerId);
    }
  }
};
_maxClickDrift = new WeakMap();
_maxClickDrift2 = new WeakMap();
_finally = new WeakMap();
_CanvasPointer_instances = new WeakSet();
completeClick_fn = function(e2) {
  var _a, _b, _c;
  const { eDown } = this;
  if (!eDown) return;
  this.eUp = e2;
  if (this.dragStarted) {
    (_a = this.onDragEnd) == null ? void 0 : _a.call(this, e2);
  } else if (!__privateMethod(this, _CanvasPointer_instances, hasSamePosition_fn).call(this, e2, eDown)) {
    __privateMethod(this, _CanvasPointer_instances, setDragStarted_fn).call(this);
    (_b = this.onDragEnd) == null ? void 0 : _b.call(this, e2);
  } else if (this.onDoubleClick && __privateMethod(this, _CanvasPointer_instances, isDoubleClick_fn).call(this)) {
    this.onDoubleClick(e2);
    this.eLastDown = void 0;
  } else {
    (_c = this.onClick) == null ? void 0 : _c.call(this, e2);
    this.eLastDown = eDown;
  }
};
/**
 * Checks if two events occurred near each other - not further apart than the maximum click drift.
 * @param a The first event to compare
 * @param b The second event to compare
 * @param tolerance2 The maximum distance (squared) before the positions are considered different
 * @returns `true` if the two events were no more than {@link maxClickDrift} apart, otherwise `false`
 */
hasSamePosition_fn = function(a, b, tolerance2 = __privateGet(_CanvasPointer, _maxClickDrift2)) {
  const drift = dist2(a.clientX, a.clientY, b.clientX, b.clientY);
  return drift <= tolerance2;
};
/**
 * Checks whether the pointer is currently past the max click drift threshold.
 * @returns `true` if the latest pointer event is past the the click drift threshold
 */
isDoubleClick_fn = function() {
  const { eDown, eLastDown } = this;
  if (!eDown || !eLastDown) return false;
  const tolerance2 = (3 * __privateGet(_CanvasPointer, _maxClickDrift)) ** 2;
  const diff = eDown.timeStamp - eLastDown.timeStamp;
  return diff > 0 && diff < _CanvasPointer.doubleClickTime && __privateMethod(this, _CanvasPointer_instances, hasSamePosition_fn).call(this, eDown, eLastDown, tolerance2);
};
setDragStarted_fn = function() {
  var _a;
  this.dragStarted = true;
  (_a = this.onDragStart) == null ? void 0 : _a.call(this, this);
  delete this.onDragStart;
};
/** Maximum time in milliseconds to ignore click drift */
__publicField(_CanvasPointer, "bufferTime", 150);
/** Maximum gap between pointerup and pointerdown events to be considered as a double click */
__publicField(_CanvasPointer, "doubleClickTime", 300);
__privateAdd(_CanvasPointer, _maxClickDrift, 6);
/** {@link maxClickDrift} squared.  Used to calculate click drift without `sqrt`. */
__privateAdd(_CanvasPointer, _maxClickDrift2, __privateGet(_CanvasPointer, _maxClickDrift) ** 2);
var CanvasPointer = _CanvasPointer;
var NullGraphError = class extends Error {
  constructor(message = "Attempted to access LGraph reference that was null or undefined.", cause) {
    super(message, { cause });
    this.name = "NullGraphError";
  }
};
var BadgePosition = /* @__PURE__ */ ((BadgePosition2) => {
  BadgePosition2["TopLeft"] = "top-left";
  BadgePosition2["TopRight"] = "top-right";
  return BadgePosition2;
})(BadgePosition || {});
var LGraphBadge = class {
  constructor({
    text,
    fgColor = "white",
    bgColor = "#0F1F0F",
    fontSize = 12,
    padding = 6,
    height = 20,
    cornerRadius = 5
  }) {
    __publicField(this, "text");
    __publicField(this, "fgColor");
    __publicField(this, "bgColor");
    __publicField(this, "fontSize");
    __publicField(this, "padding");
    __publicField(this, "height");
    __publicField(this, "cornerRadius");
    this.text = text;
    this.fgColor = fgColor;
    this.bgColor = bgColor;
    this.fontSize = fontSize;
    this.padding = padding;
    this.height = height;
    this.cornerRadius = cornerRadius;
  }
  get visible() {
    return this.text.length > 0;
  }
  getWidth(ctx) {
    if (!this.visible) return 0;
    const { font } = ctx;
    ctx.font = `${this.fontSize}px sans-serif`;
    const textWidth = ctx.measureText(this.text).width;
    ctx.font = font;
    return textWidth + this.padding * 2;
  }
  draw(ctx, x2, y) {
    if (!this.visible) return;
    const { fillStyle } = ctx;
    ctx.font = `${this.fontSize}px sans-serif`;
    const badgeWidth = this.getWidth(ctx);
    const badgeX = 0;
    ctx.fillStyle = this.bgColor;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x2 + badgeX, y, badgeWidth, this.height, this.cornerRadius);
    } else {
      ctx.rect(x2 + badgeX, y, badgeWidth, this.height);
    }
    ctx.fill();
    ctx.fillStyle = this.fgColor;
    ctx.fillText(
      this.text,
      x2 + badgeX + this.padding,
      y + this.height - this.padding
    );
    ctx.fillStyle = fillStyle;
  }
};
function shallowCloneCommonProps(slot) {
  const { color_off, color_on, dir, label, localized_name, locked, name, nameLocked, removable, shape, type } = slot;
  return { color_off, color_on, dir, label, localized_name, locked, name, nameLocked, removable, shape, type };
}
function inputAsSerialisable(slot) {
  const { link } = slot;
  const widgetOrPos = slot.widget ? { widget: { name: slot.widget.name } } : { pos: slot.pos };
  return {
    ...shallowCloneCommonProps(slot),
    ...widgetOrPos,
    link
  };
}
function outputAsSerialisable(slot) {
  const { pos, slot_index, links, widget } = slot;
  const outputWidget = widget ? { widget: { name: widget.name } } : null;
  return {
    ...shallowCloneCommonProps(slot),
    ...outputWidget,
    pos,
    slot_index,
    links
  };
}
function toNodeSlotClass(slot) {
  if (isINodeInputSlot(slot)) {
    return new NodeInputSlot(slot);
  } else if (isINodeOutputSlot(slot)) {
    return new NodeOutputSlot(slot);
  }
  throw new Error("Invalid slot type");
}
function isWidgetInputSlot(slot) {
  return isINodeInputSlot(slot) && !!slot.widget;
}
var NodeSlot = class {
  constructor(slot) {
    __publicField(this, "name");
    __publicField(this, "localized_name");
    __publicField(this, "label");
    __publicField(this, "type");
    __publicField(this, "dir");
    __publicField(this, "removable");
    __publicField(this, "shape");
    __publicField(this, "color_off");
    __publicField(this, "color_on");
    __publicField(this, "locked");
    __publicField(this, "nameLocked");
    __publicField(this, "pos");
    __publicField(this, "widget");
    __publicField(this, "hasErrors");
    Object.assign(this, slot);
    this.name = slot.name;
    this.type = slot.type;
  }
  /**
   * The label to display in the UI.
   */
  get renderingLabel() {
    return this.label || this.localized_name || this.name || "";
  }
  connectedColor(context) {
    return this.color_on || context.default_connection_color_byType[this.type] || context.default_connection_color.output_on;
  }
  disconnectedColor(context) {
    return this.color_off || context.default_connection_color_byTypeOff[this.type] || context.default_connection_color_byType[this.type] || context.default_connection_color.output_off;
  }
  renderingColor(context) {
    return this.isConnected() ? this.connectedColor(context) : this.disconnectedColor(context);
  }
  draw(ctx, options2) {
    const {
      pos,
      colorContext,
      labelColor = "#AAA",
      labelPosition = LabelPosition.Right,
      lowQuality = false,
      highlight = false
    } = options2;
    let { doStroke = false } = options2;
    const originalFillStyle = ctx.fillStyle;
    const originalStrokeStyle = ctx.strokeStyle;
    const originalLineWidth = ctx.lineWidth;
    const slot_type = this.type;
    const slot_shape = slot_type === SlotType.Array ? SlotShape.Grid : this.shape;
    ctx.beginPath();
    let doFill = true;
    ctx.fillStyle = this.renderingColor(colorContext);
    ctx.lineWidth = 1;
    if (slot_type === SlotType.Event || slot_shape === SlotShape.Box) {
      ctx.rect(pos[0] - 6 + 0.5, pos[1] - 5 + 0.5, 14, 10);
    } else if (slot_shape === SlotShape.Arrow) {
      ctx.moveTo(pos[0] + 8, pos[1] + 0.5);
      ctx.lineTo(pos[0] - 4, pos[1] + 6 + 0.5);
      ctx.lineTo(pos[0] - 4, pos[1] - 6 + 0.5);
      ctx.closePath();
    } else if (slot_shape === SlotShape.Grid) {
      const gridSize = 3;
      const cellSize = 2;
      const spacing = 3;
      for (let x2 = 0; x2 < gridSize; x2++) {
        for (let y = 0; y < gridSize; y++) {
          ctx.rect(
            pos[0] - 4 + x2 * spacing,
            pos[1] - 4 + y * spacing,
            cellSize,
            cellSize
          );
        }
      }
      doStroke = false;
    } else {
      if (lowQuality) {
        ctx.rect(pos[0] - 4, pos[1] - 4, 8, 8);
      } else {
        let radius;
        if (slot_shape === SlotShape.HollowCircle) {
          doFill = false;
          doStroke = true;
          ctx.lineWidth = 3;
          ctx.strokeStyle = ctx.fillStyle;
          radius = highlight ? 4 : 3;
        } else {
          radius = highlight ? 5 : 4;
        }
        ctx.arc(pos[0], pos[1], radius, 0, Math.PI * 2);
      }
    }
    if (doFill) ctx.fill();
    if (!lowQuality && doStroke) ctx.stroke();
    if (!lowQuality) {
      const text = this.renderingLabel;
      if (text) {
        ctx.fillStyle = labelColor;
        if (labelPosition === LabelPosition.Right) {
          if (this.dir == LinkDirection.UP) {
            ctx.fillText(text, pos[0], pos[1] - 10);
          } else {
            ctx.fillText(text, pos[0] + 10, pos[1] + 5);
          }
        } else {
          if (this.dir == LinkDirection.DOWN) {
            ctx.fillText(text, pos[0], pos[1] - 8);
          } else {
            ctx.fillText(text, pos[0] - 10, pos[1] + 5);
          }
        }
      }
    }
    if (this.hasErrors) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(pos[0], pos[1], 12, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = originalFillStyle;
    ctx.strokeStyle = originalStrokeStyle;
    ctx.lineWidth = originalLineWidth;
  }
  drawCollapsed(ctx, options2) {
    const [x2, y] = options2.pos;
    const originalFillStyle = ctx.fillStyle;
    ctx.fillStyle = "#686";
    ctx.beginPath();
    if (this.type === SlotType.Event || this.shape === RenderShape.BOX) {
      ctx.rect(x2 - 7 + 0.5, y - 4, 14, 8);
    } else if (this.shape === RenderShape.ARROW) {
      const isInput = this instanceof NodeInputSlot;
      if (isInput) {
        ctx.moveTo(x2 + 8, y);
        ctx.lineTo(x2 - 4, y - 4);
        ctx.lineTo(x2 - 4, y + 4);
      } else {
        ctx.moveTo(x2 + 6, y);
        ctx.lineTo(x2 - 6, y - 4);
        ctx.lineTo(x2 - 6, y + 4);
      }
      ctx.closePath();
    } else {
      ctx.arc(x2, y, 4, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.fillStyle = originalFillStyle;
  }
};
function isINodeInputSlot(slot) {
  return "link" in slot;
}
var NodeInputSlot = class extends NodeSlot {
  constructor(slot) {
    super(slot);
    __publicField(this, "link");
    this.link = slot.link;
  }
  isConnected() {
    return this.link != null;
  }
  isValidTarget(fromSlot) {
    return "links" in fromSlot && LiteGraph.isValidConnection(this.type, fromSlot.type);
  }
  draw(ctx, options2) {
    const originalTextAlign = ctx.textAlign;
    ctx.textAlign = "left";
    super.draw(ctx, {
      ...options2,
      labelPosition: LabelPosition.Right,
      doStroke: false
    });
    ctx.textAlign = originalTextAlign;
  }
};
function isINodeOutputSlot(slot) {
  return "links" in slot;
}
var NodeOutputSlot = class extends NodeSlot {
  constructor(slot) {
    super(slot);
    __publicField(this, "links");
    __publicField(this, "_data");
    __publicField(this, "slot_index");
    this.links = slot.links;
    this._data = slot._data;
    this.slot_index = slot.slot_index;
  }
  isValidTarget(fromSlot) {
    return "link" in fromSlot && LiteGraph.isValidConnection(this.type, fromSlot.type);
  }
  isConnected() {
    return this.links != null && this.links.length > 0;
  }
  draw(ctx, options2) {
    const originalTextAlign = ctx.textAlign;
    const originalStrokeStyle = ctx.strokeStyle;
    ctx.textAlign = "right";
    ctx.strokeStyle = "black";
    super.draw(ctx, {
      ...options2,
      labelPosition: LabelPosition.Left,
      doStroke: true
    });
    ctx.textAlign = originalTextAlign;
    ctx.strokeStyle = originalStrokeStyle;
  }
};
function stringOrEmpty(value) {
  return value == null ? "" : String(value);
}
function parseSlotTypes(type) {
  return type == "" || type == "0" ? ["*"] : String(type).toLowerCase().split(",");
}
function getAllNestedItems(items) {
  const allItems = /* @__PURE__ */ new Set();
  if (items) {
    for (const item of items) addRecursively(item, allItems);
  }
  return allItems;
  function addRecursively(item, flatSet) {
    if (flatSet.has(item) || item.pinned) return;
    flatSet.add(item);
    if (item.children) {
      for (const child of item.children) addRecursively(child, flatSet);
    }
  }
}
function findFirstNode(items) {
  for (const item of items) {
    if (item instanceof LGraphNode) return item;
  }
}
function findFreeSlotOfType(slots, type) {
  var _a, _b, _c;
  if (!(slots == null ? void 0 : slots.length)) return;
  let occupiedSlot;
  let wildSlot;
  let occupiedWildSlot;
  const validTypes = parseSlotTypes(type);
  for (const [index, slot] of slots.entries()) {
    const slotTypes = parseSlotTypes(slot.type);
    for (const validType of validTypes) {
      for (const slotType of slotTypes) {
        if (slotType === validType) {
          if (slot.link == null && !((_a = slot.links) == null ? void 0 : _a.length)) {
            return { index, slot };
          }
          occupiedSlot != null ? occupiedSlot : occupiedSlot = { index, slot };
        } else if (!wildSlot && (validType === "*" || slotType === "*")) {
          if (slot.link == null && !((_b = slot.links) == null ? void 0 : _b.length)) {
            wildSlot = { index, slot };
          } else {
            occupiedWildSlot != null ? occupiedWildSlot : occupiedWildSlot = { index, slot };
          }
        }
      }
    }
  }
  return (_c = wildSlot != null ? wildSlot : occupiedSlot) != null ? _c : occupiedWildSlot;
}
var LayoutElement = class {
  constructor(o) {
    __publicField(this, "value");
    __publicField(this, "boundingRect");
    this.value = o.value;
    this.boundingRect = o.boundingRect;
  }
  get center() {
    return [
      this.boundingRect[0] + this.boundingRect[2] / 2,
      this.boundingRect[1] + this.boundingRect[3] / 2
    ];
  }
};
function distributeSpace(totalSpace, requests) {
  if (requests.length === 0) return [];
  const totalMinSize = requests.reduce((sum, req) => sum + req.minSize, 0);
  if (totalSpace < totalMinSize) {
    return requests.map((req) => req.minSize);
  }
  let allocations = requests.map((req) => {
    var _a, _b;
    return {
      computedSize: req.minSize,
      maxSize: (_a = req.maxSize) != null ? _a : Infinity,
      remaining: ((_b = req.maxSize) != null ? _b : Infinity) - req.minSize
    };
  });
  let remainingSpace = totalSpace - totalMinSize;
  while (remainingSpace > 0 && allocations.some((alloc) => alloc.remaining > 0)) {
    const growableItems = allocations.filter(
      (alloc) => alloc.remaining > 0
    ).length;
    if (growableItems === 0) break;
    const sharePerItem = remainingSpace / growableItems;
    let spaceUsedThisRound = 0;
    allocations = allocations.map((alloc) => {
      if (alloc.remaining <= 0) return alloc;
      const growth = Math.min(sharePerItem, alloc.remaining);
      spaceUsedThisRound += growth;
      return {
        ...alloc,
        computedSize: alloc.computedSize + growth,
        remaining: alloc.remaining - growth
      };
    });
    remainingSpace -= spaceUsedThisRound;
    if (spaceUsedThisRound === 0) break;
  }
  return allocations.map(({ computedSize }) => computedSize);
}
function toClass(cls, obj) {
  return obj instanceof cls ? obj : new cls(obj);
}
function isColorable(obj) {
  return typeof obj === "object" && obj !== null && "setColorOption" in obj && "getColorOption" in obj;
}
var BaseWidget = class {
  constructor(widget) {
    __publicField(this, "linkedWidgets");
    __publicField(this, "name");
    __publicField(this, "options");
    __publicField(this, "label");
    __publicField(this, "type");
    __publicField(this, "value");
    __publicField(this, "y", 0);
    __publicField(this, "last_y");
    __publicField(this, "width");
    __publicField(this, "disabled");
    __publicField(this, "hidden");
    __publicField(this, "advanced");
    __publicField(this, "tooltip");
    __publicField(this, "element");
    Object.assign(this, widget);
    this.name = widget.name;
    this.options = widget.options;
    this.type = widget.type;
  }
  get outline_color() {
    return this.advanced ? LiteGraph.WIDGET_ADVANCED_OUTLINE_COLOR : LiteGraph.WIDGET_OUTLINE_COLOR;
  }
  get background_color() {
    return LiteGraph.WIDGET_BGCOLOR;
  }
  get height() {
    return LiteGraph.NODE_WIDGET_HEIGHT;
  }
  get text_color() {
    return LiteGraph.WIDGET_TEXT_COLOR;
  }
  get secondary_text_color() {
    return LiteGraph.WIDGET_SECONDARY_TEXT_COLOR;
  }
  /**
   * Sets the value of the widget
   * @param value The value to set
   * @param options The options for setting the value
   */
  setValue(value, options2) {
    var _a, _b, _c, _d;
    const { node: node2, canvas: canvas2, e: e2 } = options2;
    const oldValue = this.value;
    if (value === this.value) return;
    const v2 = this.type === "number" ? Number(value) : value;
    this.value = v2;
    if (((_a = this.options) == null ? void 0 : _a.property) && node2.properties[this.options.property] !== void 0) {
      node2.setProperty(this.options.property, v2);
    }
    const pos = canvas2.graph_mouse;
    (_b = this.callback) == null ? void 0 : _b.call(this, this.value, canvas2, node2, pos, e2);
    (_d = node2.onWidgetChanged) == null ? void 0 : _d.call(node2, (_c = this.name) != null ? _c : "", v2, oldValue, this);
    if (node2.graph) node2.graph._version++;
  }
};
var BooleanWidget = class extends BaseWidget {
  constructor(widget) {
    super(widget);
    this.type = "toggle";
    this.value = widget.value;
  }
  drawWidget(ctx, {
    y,
    width: width2,
    show_text = true,
    margin = 15
  }) {
    const { height } = this;
    ctx.textAlign = "left";
    ctx.strokeStyle = this.outline_color;
    ctx.fillStyle = this.background_color;
    ctx.beginPath();
    if (show_text)
      ctx.roundRect(margin, y, width2 - margin * 2, height, [height * 0.5]);
    else ctx.rect(margin, y, width2 - margin * 2, height);
    ctx.fill();
    if (show_text && !this.disabled) ctx.stroke();
    ctx.fillStyle = this.value ? "#89A" : "#333";
    ctx.beginPath();
    ctx.arc(
      width2 - margin * 2,
      y + height * 0.5,
      height * 0.36,
      0,
      Math.PI * 2
    );
    ctx.fill();
    if (show_text) {
      ctx.fillStyle = this.secondary_text_color;
      const label = this.label || this.name;
      if (label != null) {
        ctx.fillText(label, margin * 2, y + height * 0.7);
      }
      ctx.fillStyle = this.value ? this.text_color : this.secondary_text_color;
      ctx.textAlign = "right";
      ctx.fillText(
        this.value ? this.options.on || "true" : this.options.off || "false",
        width2 - 40,
        y + height * 0.7
      );
    }
  }
  onClick(options2) {
    this.setValue(!this.value, options2);
  }
};
var ButtonWidget = class extends BaseWidget {
  constructor(widget) {
    var _a;
    super(widget);
    this.type = "button";
    this.clicked = (_a = widget.clicked) != null ? _a : false;
  }
  /**
   * Draws the widget
   * @param ctx The canvas context
   * @param options The options for drawing the widget
   */
  drawWidget(ctx, {
    y,
    width: width2,
    show_text = true,
    margin = 15
  }) {
    const originalTextAlign = ctx.textAlign;
    const originalStrokeStyle = ctx.strokeStyle;
    const originalFillStyle = ctx.fillStyle;
    const { height } = this;
    ctx.fillStyle = this.background_color;
    if (this.clicked) {
      ctx.fillStyle = "#AAA";
      this.clicked = false;
    }
    ctx.fillRect(margin, y, width2 - margin * 2, height);
    if (show_text && !this.disabled) {
      ctx.strokeStyle = this.outline_color;
      ctx.strokeRect(margin, y, width2 - margin * 2, height);
    }
    if (show_text) {
      ctx.textAlign = "center";
      ctx.fillStyle = this.text_color;
      ctx.fillText(
        this.label || this.name || "",
        width2 * 0.5,
        y + height * 0.7
      );
    }
    ctx.textAlign = originalTextAlign;
    ctx.strokeStyle = originalStrokeStyle;
    ctx.fillStyle = originalFillStyle;
  }
  onClick(options2) {
    var _a;
    const { e: e2, node: node2, canvas: canvas2 } = options2;
    const pos = canvas2.graph_mouse;
    this.clicked = true;
    canvas2.setDirty(true);
    (_a = this.callback) == null ? void 0 : _a.call(this, this, canvas2, node2, pos, e2);
  }
};
var ComboWidget = class extends BaseWidget {
  constructor(widget) {
    super(widget);
    this.type = "combo";
    this.value = widget.value;
  }
  /**
   * Draws the widget
   * @param ctx The canvas context
   * @param options The options for drawing the widget
   */
  drawWidget(ctx, {
    y,
    width: width2,
    show_text = true,
    margin = 15
  }) {
    const originalTextAlign = ctx.textAlign;
    const originalStrokeStyle = ctx.strokeStyle;
    const originalFillStyle = ctx.fillStyle;
    const { height } = this;
    ctx.textAlign = "left";
    ctx.strokeStyle = this.outline_color;
    ctx.fillStyle = this.background_color;
    ctx.beginPath();
    if (show_text)
      ctx.roundRect(margin, y, width2 - margin * 2, height, [height * 0.5]);
    else
      ctx.rect(margin, y, width2 - margin * 2, height);
    ctx.fill();
    if (show_text) {
      if (!this.disabled) {
        ctx.stroke();
        ctx.fillStyle = this.text_color;
        ctx.beginPath();
        ctx.moveTo(margin + 16, y + 5);
        ctx.lineTo(margin + 6, y + height * 0.5);
        ctx.lineTo(margin + 16, y + height - 5);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(width2 - margin - 16, y + 5);
        ctx.lineTo(width2 - margin - 6, y + height * 0.5);
        ctx.lineTo(width2 - margin - 16, y + height - 5);
        ctx.fill();
      }
      ctx.fillStyle = this.secondary_text_color;
      const label = this.label || this.name;
      if (label != null) {
        ctx.fillText(label, margin * 2 + 5, y + height * 0.7);
      }
      ctx.fillStyle = this.text_color;
      ctx.textAlign = "right";
      let displayValue = typeof this.value === "number" ? String(this.value) : this.value;
      if (this.options.values) {
        let values = this.options.values;
        if (typeof values === "function") {
          values = values();
        }
        if (values && !Array.isArray(values)) {
          displayValue = values[this.value];
        }
      }
      const labelWidth = ctx.measureText(label || "").width + margin * 2;
      const inputWidth = width2 - margin * 4;
      const availableWidth = inputWidth - labelWidth;
      const textWidth = ctx.measureText(displayValue).width;
      if (textWidth > availableWidth) {
        const ELLIPSIS = "\u2026";
        const ellipsisWidth = ctx.measureText(ELLIPSIS).width;
        const charWidthAvg = ctx.measureText("a").width;
        if (availableWidth <= ellipsisWidth) {
          displayValue = "\u2024";
        } else {
          displayValue = `${displayValue}`;
          const overflowWidth = textWidth + ellipsisWidth - availableWidth;
          if (overflowWidth + charWidthAvg * 3 > availableWidth) {
            const preciseRange = availableWidth + charWidthAvg * 3;
            const preTruncateCt = Math.floor((preciseRange - ellipsisWidth) / charWidthAvg);
            displayValue = displayValue.substr(0, preTruncateCt);
          }
          while (ctx.measureText(displayValue).width + ellipsisWidth > availableWidth) {
            displayValue = displayValue.substr(0, displayValue.length - 1);
          }
          displayValue += ELLIPSIS;
        }
      }
      ctx.fillText(
        displayValue,
        width2 - margin * 2 - 20,
        y + height * 0.7
      );
    }
    ctx.textAlign = originalTextAlign;
    ctx.strokeStyle = originalStrokeStyle;
    ctx.fillStyle = originalFillStyle;
  }
  onClick(options2) {
    const { e: e2, node: node2, canvas: canvas2 } = options2;
    const x2 = e2.canvasX - node2.pos[0];
    const width2 = this.width || node2.size[0];
    const delta2 = x2 < 40 ? -1 : x2 > width2 - 40 ? 1 : 0;
    let values = this.options.values;
    if (typeof values === "function") {
      values = values(this, node2);
    }
    const values_list = Array.isArray(values) ? values : Object.keys(values);
    if (delta2) {
      let index = -1;
      canvas2.last_mouseclick = 0;
      index = typeof values === "object" ? values_list.indexOf(String(this.value)) + delta2 : values_list.indexOf(this.value) + delta2;
      if (index >= values_list.length) index = values_list.length - 1;
      if (index < 0) index = 0;
      this.setValue(
        Array.isArray(values) ? values[index] : index,
        {
          e: e2,
          node: node2,
          canvas: canvas2
        }
      );
      return;
    }
    const text_values = values != values_list ? Object.values(values) : values;
    new LiteGraph.ContextMenu(text_values, {
      scale: Math.max(1, canvas2.ds.scale),
      event: e2,
      className: "dark",
      callback: (value) => {
        this.setValue(
          values != values_list ? text_values.indexOf(value) : value,
          {
            e: e2,
            node: node2,
            canvas: canvas2
          }
        );
      }
    });
  }
};
function getWidgetStep(options2) {
  return options2.step2 || (options2.step || 10) * 0.1;
}
var KnobWidget = class extends BaseWidget {
  constructor(widget) {
    super(widget);
    __publicField(this, "computedHeight");
    __publicField(this, "current_drag_offset", 0);
    this.type = "knob";
    this.value = widget.value;
    this.options = widget.options;
  }
  /**
   * Compute the layout size of the widget.
   * @returns The layout size of the widget.
   */
  computeLayoutSize() {
    return {
      minHeight: 60,
      minWidth: 20,
      maxHeight: 1e6,
      maxWidth: 1e6
    };
  }
  get height() {
    return this.computedHeight || super.height;
  }
  drawWidget(ctx, {
    y,
    width: width2,
    show_text = true,
    margin = 15
  }) {
    var _a;
    const originalTextAlign = ctx.textAlign;
    const originalStrokeStyle = ctx.strokeStyle;
    const originalFillStyle = ctx.fillStyle;
    const { gradient_stops = "rgb(14, 182, 201); rgb(0, 216, 72)" } = this.options;
    const effective_height = this.computedHeight || this.height;
    const size_modifier = Math.min(this.computedHeight || this.height, this.width || 20) / 20;
    const arc_center = { x: width2 / 2, y: effective_height / 2 + y };
    ctx.lineWidth = (Math.min(width2, effective_height) - margin * size_modifier) / 6;
    const arc_size = (Math.min(width2, effective_height) - margin * size_modifier - ctx.lineWidth) / 2;
    {
      const gradient2 = ctx.createRadialGradient(
        arc_center.x,
        arc_center.y,
        arc_size + ctx.lineWidth,
        0,
        0,
        arc_size + ctx.lineWidth
      );
      gradient2.addColorStop(0, "rgb(29, 29, 29)");
      gradient2.addColorStop(1, "rgb(116, 116, 116)");
      ctx.fillStyle = gradient2;
    }
    ctx.beginPath();
    {
      ctx.arc(
        arc_center.x,
        arc_center.y,
        arc_size + ctx.lineWidth / 2,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
      ctx.closePath();
    }
    const arc = {
      start_angle: Math.PI * 0.6,
      end_angle: Math.PI * 2.4
    };
    ctx.beginPath();
    {
      const gradient2 = ctx.createRadialGradient(
        arc_center.x,
        arc_center.y,
        arc_size + ctx.lineWidth,
        0,
        0,
        arc_size + ctx.lineWidth
      );
      gradient2.addColorStop(0, "rgb(99, 99, 99)");
      gradient2.addColorStop(1, "rgb(36, 36, 36)");
      ctx.strokeStyle = gradient2;
    }
    ctx.arc(
      arc_center.x,
      arc_center.y,
      arc_size,
      arc.start_angle,
      arc.end_angle,
      false
    );
    ctx.stroke();
    ctx.closePath();
    const range = this.options.max - this.options.min;
    let nvalue = (this.value - this.options.min) / range;
    nvalue = clamp(nvalue, 0, 1);
    ctx.beginPath();
    const gradient = ctx.createConicGradient(
      arc.start_angle,
      arc_center.x,
      arc_center.y
    );
    const gs = gradient_stops.split(";");
    for (const [index, stop] of gs.entries()) {
      gradient.addColorStop(index, stop.trim());
    }
    ctx.strokeStyle = gradient;
    const value_end_angle = (arc.end_angle - arc.start_angle) * nvalue + arc.start_angle;
    ctx.arc(
      arc_center.x,
      arc_center.y,
      arc_size,
      arc.start_angle,
      value_end_angle,
      false
    );
    ctx.stroke();
    ctx.closePath();
    if (show_text && !this.disabled) {
      ctx.strokeStyle = this.outline_color;
      ctx.beginPath();
      ctx.strokeStyle = this.outline_color;
      ctx.arc(
        arc_center.x,
        arc_center.y,
        arc_size + ctx.lineWidth / 2,
        0,
        Math.PI * 2,
        false
      );
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.closePath();
    }
    if (show_text) {
      ctx.textAlign = "center";
      ctx.fillStyle = this.text_color;
      const fixedValue = Number(this.value).toFixed((_a = this.options.precision) != null ? _a : 3);
      ctx.fillText(
        `${this.label || this.name}
${fixedValue}`,
        width2 * 0.5,
        y + effective_height * 0.5
      );
    }
    ctx.textAlign = originalTextAlign;
    ctx.strokeStyle = originalStrokeStyle;
    ctx.fillStyle = originalFillStyle;
  }
  onClick() {
    this.current_drag_offset = 0;
  }
  onDrag(options2) {
    if (this.options.read_only) return;
    const { e: e2 } = options2;
    const step = getWidgetStep(this.options);
    const range = this.options.max - this.options.min;
    const range_10_percent = range / 10;
    const range_1_percent = range / 100;
    const step_for = {
      shift: range_10_percent > step ? range_10_percent - range_10_percent % step : step,
      delta_y: range_1_percent > step ? range_1_percent - range_1_percent % step : step
      // 1% increments
    };
    const use_y = Math.abs(e2.movementY) > Math.abs(e2.movementX);
    const delta2 = use_y ? -e2.movementY : e2.movementX;
    const drag_threshold = 15;
    this.current_drag_offset += delta2;
    let adjustment = 0;
    if (this.current_drag_offset > drag_threshold) {
      adjustment += 1;
      this.current_drag_offset -= drag_threshold;
    } else if (this.current_drag_offset < -15) {
      adjustment -= 1;
      this.current_drag_offset += drag_threshold;
    }
    const step_with_shift_modifier = e2.shiftKey ? step_for.shift : use_y ? step_for.delta_y : step;
    const deltaValue = adjustment * step_with_shift_modifier;
    const newValue2 = clamp(
      this.value + deltaValue,
      this.options.min,
      this.options.max
    );
    if (newValue2 !== this.value) {
      this.setValue(newValue2, options2);
    }
  }
};
var NumberWidget = class extends BaseWidget {
  constructor(widget) {
    super(widget);
    this.type = "number";
    this.value = widget.value;
  }
  setValue(value, options2) {
    let newValue2 = value;
    if (this.options.min != null && newValue2 < this.options.min) {
      newValue2 = this.options.min;
    }
    if (this.options.max != null && newValue2 > this.options.max) {
      newValue2 = this.options.max;
    }
    super.setValue(newValue2, options2);
  }
  /**
   * Draws the widget
   * @param ctx The canvas context
   * @param options The options for drawing the widget
   */
  drawWidget(ctx, {
    y,
    width: width2,
    show_text = true,
    margin = 15
  }) {
    const originalTextAlign = ctx.textAlign;
    const originalStrokeStyle = ctx.strokeStyle;
    const originalFillStyle = ctx.fillStyle;
    const { height } = this;
    ctx.textAlign = "left";
    ctx.strokeStyle = this.outline_color;
    ctx.fillStyle = this.background_color;
    ctx.beginPath();
    if (show_text)
      ctx.roundRect(margin, y, width2 - margin * 2, height, [height * 0.5]);
    else
      ctx.rect(margin, y, width2 - margin * 2, height);
    ctx.fill();
    if (show_text) {
      if (!this.disabled) {
        ctx.stroke();
        ctx.fillStyle = this.text_color;
        ctx.beginPath();
        ctx.moveTo(margin + 16, y + 5);
        ctx.lineTo(margin + 6, y + height * 0.5);
        ctx.lineTo(margin + 16, y + height - 5);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(width2 - margin - 16, y + 5);
        ctx.lineTo(width2 - margin - 6, y + height * 0.5);
        ctx.lineTo(width2 - margin - 16, y + height - 5);
        ctx.fill();
      }
      ctx.fillStyle = this.secondary_text_color;
      const label = this.label || this.name;
      if (label != null) {
        ctx.fillText(label, margin * 2 + 5, y + height * 0.7);
      }
      ctx.fillStyle = this.text_color;
      ctx.textAlign = "right";
      ctx.fillText(
        Number(this.value).toFixed(
          this.options.precision !== void 0 ? this.options.precision : 3
        ),
        width2 - margin * 2 - 20,
        y + height * 0.7
      );
    }
    ctx.textAlign = originalTextAlign;
    ctx.strokeStyle = originalStrokeStyle;
    ctx.fillStyle = originalFillStyle;
  }
  onClick(options) {
    const { e, node, canvas } = options;
    const x = e.canvasX - node.pos[0];
    const width = this.width || node.size[0];
    const delta = x < 40 ? -1 : x > width - 40 ? 1 : 0;
    if (delta) {
      this.setValue(this.value + delta * getWidgetStep(this.options), { e, node, canvas });
      return;
    }
    canvas.prompt("Value", this.value, (v) => {
      if (/^[\d\s()*+/-]+|\d+\.\d+$/.test(v)) {
        try {
          v = eval(v);
        } catch {
        }
      }
      const newValue = Number(v);
      if (!isNaN(newValue)) {
        this.setValue(newValue, { e, node, canvas });
      }
    }, e);
  }
  /**
   * Handles drag events for the number widget
   * @param options The options for handling the drag event
   */
  onDrag(options2) {
    var _a;
    const { e: e2, node: node2, canvas: canvas2 } = options2;
    const width2 = this.width || node2.width;
    const x2 = e2.canvasX - node2.pos[0];
    const delta2 = x2 < 40 ? -1 : x2 > width2 - 40 ? 1 : 0;
    if (delta2 && (x2 > -3 && x2 < width2 + 3)) return;
    this.setValue(this.value + ((_a = e2.deltaX) != null ? _a : 0) * getWidgetStep(this.options), { e: e2, node: node2, canvas: canvas2 });
  }
};
var SliderWidget = class extends BaseWidget {
  constructor(widget) {
    super(widget);
    __publicField(this, "marker");
    this.type = "slider";
    this.value = widget.value;
    this.options = widget.options;
    this.marker = widget.marker;
  }
  /**
   * Draws the widget
   * @param ctx The canvas context
   * @param options The options for drawing the widget
   */
  drawWidget(ctx, {
    y,
    width: width2,
    show_text = true,
    margin = 15
  }) {
    var _a, _b, _c;
    const originalTextAlign = ctx.textAlign;
    const originalStrokeStyle = ctx.strokeStyle;
    const originalFillStyle = ctx.fillStyle;
    const { height } = this;
    ctx.fillStyle = this.background_color;
    ctx.fillRect(margin, y, width2 - margin * 2, height);
    const range = this.options.max - this.options.min;
    let nvalue = (this.value - this.options.min) / range;
    nvalue = clamp(nvalue, 0, 1);
    ctx.fillStyle = (_a = this.options.slider_color) != null ? _a : "#678";
    ctx.fillRect(margin, y, nvalue * (width2 - margin * 2), height);
    if (show_text && !this.disabled) {
      ctx.strokeStyle = this.outline_color;
      ctx.strokeRect(margin, y, width2 - margin * 2, height);
    }
    if (this.marker != null) {
      let marker_nvalue = (this.marker - this.options.min) / range;
      marker_nvalue = clamp(marker_nvalue, 0, 1);
      ctx.fillStyle = (_b = this.options.marker_color) != null ? _b : "#AA9";
      ctx.fillRect(
        margin + marker_nvalue * (width2 - margin * 2),
        y,
        2,
        height
      );
    }
    if (show_text) {
      ctx.textAlign = "center";
      ctx.fillStyle = this.text_color;
      const fixedValue = Number(this.value).toFixed((_c = this.options.precision) != null ? _c : 3);
      ctx.fillText(
        `${this.label || this.name}  ${fixedValue}`,
        width2 * 0.5,
        y + height * 0.7
      );
    }
    ctx.textAlign = originalTextAlign;
    ctx.strokeStyle = originalStrokeStyle;
    ctx.fillStyle = originalFillStyle;
  }
  /**
   * Handles click events for the slider widget
   */
  onClick(options2) {
    if (this.options.read_only) return;
    const { e: e2, node: node2 } = options2;
    const width2 = this.width || node2.size[0];
    const x2 = e2.canvasX - node2.pos[0];
    const slideFactor = clamp((x2 - 15) / (width2 - 30), 0, 1);
    const newValue2 = this.options.min + (this.options.max - this.options.min) * slideFactor;
    if (newValue2 !== this.value) {
      this.setValue(newValue2, options2);
    }
  }
  /**
   * Handles drag events for the slider widget
   */
  onDrag(options2) {
    if (this.options.read_only) return false;
    const { e: e2, node: node2 } = options2;
    const width2 = this.width || node2.size[0];
    const x2 = e2.canvasX - node2.pos[0];
    const slideFactor = clamp((x2 - 15) / (width2 - 30), 0, 1);
    const newValue2 = this.options.min + (this.options.max - this.options.min) * slideFactor;
    if (newValue2 !== this.value) {
      this.setValue(newValue2, options2);
    }
  }
};
var TextWidget = class extends BaseWidget {
  constructor(widget) {
    var _a, _b, _c;
    super(widget);
    this.type = (_a = widget.type) != null ? _a : "string";
    this.value = (_c = (_b = widget.value) == null ? void 0 : _b.toString()) != null ? _c : "";
  }
  /**
   * Draws the widget
   * @param ctx The canvas context
   * @param options The options for drawing the widget
   */
  drawWidget(ctx, {
    y,
    width: width2,
    show_text = true,
    margin = 15
  }) {
    const originalTextAlign = ctx.textAlign;
    const originalStrokeStyle = ctx.strokeStyle;
    const originalFillStyle = ctx.fillStyle;
    const { height } = this;
    ctx.textAlign = "left";
    ctx.strokeStyle = this.outline_color;
    ctx.fillStyle = this.background_color;
    ctx.beginPath();
    if (show_text)
      ctx.roundRect(margin, y, width2 - margin * 2, height, [height * 0.5]);
    else
      ctx.rect(margin, y, width2 - margin * 2, height);
    ctx.fill();
    if (show_text) {
      if (!this.disabled) ctx.stroke();
      ctx.save();
      ctx.beginPath();
      ctx.rect(margin, y, width2 - margin * 2, height);
      ctx.clip();
      ctx.fillStyle = this.secondary_text_color;
      const label = this.label || this.name;
      if (label != null) {
        ctx.fillText(label, margin * 2, y + height * 0.7);
      }
      ctx.fillStyle = this.text_color;
      ctx.textAlign = "right";
      ctx.fillText(
        // 30 chars max
        String(this.value).substr(0, 30),
        width2 - margin * 2,
        y + height * 0.7
      );
      ctx.restore();
    }
    ctx.textAlign = originalTextAlign;
    ctx.strokeStyle = originalStrokeStyle;
    ctx.fillStyle = originalFillStyle;
  }
  onClick(options2) {
    var _a, _b;
    const { e: e2, node: node2, canvas: canvas2 } = options2;
    canvas2.prompt(
      "Value",
      this.value,
      (v2) => {
        if (v2 !== null) {
          this.setValue(v2, { e: e2, node: node2, canvas: canvas2 });
        }
      },
      e2,
      (_b = (_a = this.options) == null ? void 0 : _a.multiline) != null ? _b : false
    );
  }
};
var WIDGET_TYPE_MAP = {
  // @ts-expect-error https://github.com/Comfy-Org/litegraph.js/issues/616
  button: ButtonWidget,
  // @ts-expect-error #616
  toggle: BooleanWidget,
  // @ts-expect-error #616
  slider: SliderWidget,
  // @ts-expect-error #616
  knob: KnobWidget,
  // @ts-expect-error #616
  combo: ComboWidget,
  // @ts-expect-error #616
  number: NumberWidget,
  // @ts-expect-error #616
  string: TextWidget,
  // @ts-expect-error #616
  text: TextWidget
};
var _renderArea, _boundingRect, _LGraphNode_instances, getErrorStrokeStyle_fn, getSelectedStrokeStyle_fn, findFreeSlot_fn, findSlotByType_fn, getMouseOverSlot_fn, isMouseOverSlot_fn;
var _LGraphNode = class _LGraphNode {
  constructor(title, type) {
    __privateAdd(this, _LGraphNode_instances);
    /** The title text of the node. */
    __publicField(this, "title");
    __publicField(this, "graph", null);
    __publicField(this, "id");
    __publicField(this, "type", "");
    __publicField(this, "inputs", []);
    __publicField(this, "outputs", []);
    // Not used
    __publicField(this, "connections", []);
    __publicField(this, "properties", {});
    __publicField(this, "properties_info", []);
    __publicField(this, "flags", {});
    __publicField(this, "widgets");
    /**
     * The amount of space available for widgets to grow into.
     * @see {@link layoutWidgets}
     */
    __publicField(this, "freeWidgetSpace");
    __publicField(this, "locked");
    /** Execution order, automatically computed during run @see {@link LGraph.computeExecutionOrder} */
    __publicField(this, "order", 0);
    __publicField(this, "mode", LGraphEventMode.ALWAYS);
    __publicField(this, "last_serialization");
    __publicField(this, "serialize_widgets");
    /**
     * The overridden fg color used to render the node.
     * @see {@link renderingColor}
     */
    __publicField(this, "color");
    /**
     * The overridden bg color used to render the node.
     * @see {@link renderingBgColor}
     */
    __publicField(this, "bgcolor");
    /**
     * The overridden box color used to render the node.
     * @see {@link renderingBoxColor}
     */
    __publicField(this, "boxcolor");
    /**
     * The stroke styles that should be applied to the node.
     */
    __publicField(this, "strokeStyles");
    /**
     * The progress of node execution. Used to render a progress bar. Value between 0 and 1.
     */
    __publicField(this, "progress");
    __publicField(this, "exec_version");
    __publicField(this, "action_call");
    __publicField(this, "execute_triggered");
    __publicField(this, "action_triggered");
    __publicField(this, "widgets_up");
    __publicField(this, "widgets_start_y");
    __publicField(this, "lostFocusAt");
    __publicField(this, "gotFocusAt");
    __publicField(this, "badges", []);
    __publicField(this, "badgePosition", BadgePosition.TopLeft);
    /**
     * The width of the node when collapsed.
     * Updated by {@link LGraphCanvas.drawNode}
     */
    __publicField(this, "_collapsed_width");
    __publicField(this, "console");
    __publicField(this, "_level");
    __publicField(this, "_shape");
    __publicField(this, "mouseOver");
    __publicField(this, "redraw_on_mouse");
    __publicField(this, "resizable");
    __publicField(this, "clonable");
    __publicField(this, "_relative_id");
    __publicField(this, "clip_area");
    __publicField(this, "ignore_remove");
    __publicField(this, "has_errors");
    __publicField(this, "removable");
    __publicField(this, "block_delete");
    __publicField(this, "selected");
    __publicField(this, "showAdvanced");
    /** @inheritdoc {@link renderArea} */
    __privateAdd(this, _renderArea, new Float32Array(4));
    /** @inheritdoc {@link boundingRect} */
    __privateAdd(this, _boundingRect, new Float32Array(4));
    /** {@link pos} and {@link size} values are backed by this {@link Rect}. */
    __publicField(this, "_posSize", new Float32Array(4));
    __publicField(this, "_pos", this._posSize.subarray(0, 2));
    __publicField(this, "_size", this._posSize.subarray(2, 4));
    this.id = LiteGraph.use_uuids ? LiteGraph.uuidv4() : -1;
    this.title = title || "Unnamed";
    this.type = type != null ? type : "";
    this.size = [LiteGraph.NODE_WIDTH, 60];
    this.pos = [10, 10];
    this.strokeStyles = {
      error: __privateMethod(this, _LGraphNode_instances, getErrorStrokeStyle_fn),
      selected: __privateMethod(this, _LGraphNode_instances, getSelectedStrokeStyle_fn)
    };
  }
  /**
   * The font style used to render the node's title text.
   */
  get titleFontStyle() {
    return `${LiteGraph.NODE_TEXT_SIZE}px Arial`;
  }
  get innerFontStyle() {
    return `normal ${LiteGraph.NODE_SUBTEXT_SIZE}px Arial`;
  }
  /** The fg color used to render the node. */
  get renderingColor() {
    return this.color || this.constructor.color || LiteGraph.NODE_DEFAULT_COLOR;
  }
  /** The bg color used to render the node. */
  get renderingBgColor() {
    return this.bgcolor || this.constructor.bgcolor || LiteGraph.NODE_DEFAULT_BGCOLOR;
  }
  /** The box color used to render the node. */
  get renderingBoxColor() {
    var _a;
    if (this.boxcolor) return this.boxcolor;
    if (LiteGraph.node_box_coloured_when_on) {
      if (this.action_triggered) return "#FFF";
      if (this.execute_triggered) return "#AAA";
    }
    if (LiteGraph.node_box_coloured_by_mode) {
      const modeColour = LiteGraph.NODE_MODES_COLORS[(_a = this.mode) != null ? _a : LGraphEventMode.ALWAYS];
      if (modeColour) return modeColour;
    }
    return LiteGraph.NODE_DEFAULT_BOXCOLOR;
  }
  /** @inheritdoc {@link IColorable.setColorOption} */
  setColorOption(colorOption) {
    if (colorOption == null) {
      delete this.color;
      delete this.bgcolor;
    } else {
      this.color = colorOption.color;
      this.bgcolor = colorOption.bgcolor;
    }
  }
  /** @inheritdoc {@link IColorable.getColorOption} */
  getColorOption() {
    var _a;
    return (_a = Object.values(LGraphCanvas.node_colors).find(
      (colorOption) => colorOption.color === this.color && colorOption.bgcolor === this.bgcolor
    )) != null ? _a : null;
  }
  /**
   * Rect describing the node area, including shadows and any protrusions.
   * Determines if the node is visible.  Calculated once at the start of every frame.
   */
  get renderArea() {
    return __privateGet(this, _renderArea);
  }
  /**
   * Cached node position & area as `x, y, width, height`.  Includes changes made by {@link onBounding}, if present.
   *
   * Determines the node hitbox and other rendering effects.  Calculated once at the start of every frame.
   */
  get boundingRect() {
    return __privateGet(this, _boundingRect);
  }
  get pos() {
    return this._pos;
  }
  /** Node position does not necessarily correlate to the top-left corner. */
  set pos(value) {
    if (!value || value.length < 2) return;
    this._pos[0] = value[0];
    this._pos[1] = value[1];
  }
  get size() {
    return this._size;
  }
  set size(value) {
    if (!value || value.length < 2) return;
    this._size[0] = value[0];
    this._size[1] = value[1];
  }
  /**
   * The size of the node used for rendering.
   */
  get renderingSize() {
    var _a;
    return this.flags.collapsed ? [(_a = this._collapsed_width) != null ? _a : 0, 0] : this._size;
  }
  get shape() {
    return this._shape;
  }
  set shape(v2) {
    switch (v2) {
      case "default":
        delete this._shape;
        break;
      case "box":
        this._shape = RenderShape.BOX;
        break;
      case "round":
        this._shape = RenderShape.ROUND;
        break;
      case "circle":
        this._shape = RenderShape.CIRCLE;
        break;
      case "card":
        this._shape = RenderShape.CARD;
        break;
      default:
        this._shape = v2;
    }
  }
  /**
   * The shape of the node used for rendering. @see {@link RenderShape}
   */
  get renderingShape() {
    return this._shape || this.constructor.shape || LiteGraph.NODE_DEFAULT_SHAPE;
  }
  get is_selected() {
    return this.selected;
  }
  set is_selected(value) {
    this.selected = value;
  }
  get title_mode() {
    var _a;
    return (_a = this.constructor.title_mode) != null ? _a : TitleMode.NORMAL_TITLE;
  }
  /**
   * configure a node from an object containing the serialized info
   */
  configure(info) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    if (this.graph) {
      this.graph._version++;
    }
    for (const j in info) {
      if (j == "properties") {
        for (const k in info.properties) {
          this.properties[k] = info.properties[k];
          (_a = this.onPropertyChanged) == null ? void 0 : _a.call(this, k, info.properties[k]);
        }
        continue;
      }
      if (info[j] == null) {
        continue;
      } else if (typeof info[j] == "object") {
        if ((_b = this[j]) == null ? void 0 : _b.configure) {
          (_c = this[j]) == null ? void 0 : _c.configure(info[j]);
        } else {
          this[j] = LiteGraph.cloneObject(info[j], this[j]);
        }
      } else {
        this[j] = info[j];
      }
    }
    if (!info.title) {
      this.title = this.constructor.title;
    }
    (_d = this.inputs) != null ? _d : this.inputs = [];
    this.inputs = this.inputs.map((input) => toClass(NodeInputSlot, input));
    for (const [i, input] of this.inputs.entries()) {
      const link = this.graph && input.link != null ? this.graph._links.get(input.link) : null;
      (_e = this.onConnectionsChange) == null ? void 0 : _e.call(this, NodeSlotType.INPUT, i, true, link, input);
      (_f = this.onInputAdded) == null ? void 0 : _f.call(this, input);
    }
    (_g = this.outputs) != null ? _g : this.outputs = [];
    this.outputs = this.outputs.map((output) => toClass(NodeOutputSlot, output));
    for (const [i, output] of this.outputs.entries()) {
      if (!output.links) continue;
      for (const linkId of output.links) {
        const link = this.graph ? this.graph._links.get(linkId) : null;
        (_h = this.onConnectionsChange) == null ? void 0 : _h.call(this, NodeSlotType.OUTPUT, i, true, link, output);
      }
      (_i = this.onOutputAdded) == null ? void 0 : _i.call(this, output);
    }
    if (this.widgets) {
      for (const w of this.widgets) {
        if (!w) continue;
        if (((_j = w.options) == null ? void 0 : _j.property) && this.properties[w.options.property] != void 0)
          w.value = JSON.parse(JSON.stringify(this.properties[w.options.property]));
      }
      if (info.widgets_values) {
        for (let i = 0; i < info.widgets_values.length; ++i) {
          const widget = this.widgets[i];
          if (widget) {
            widget.value = info.widgets_values[i];
          }
        }
      }
    }
    if (this.pinned) this.resizable = false;
    (_k = this.onConfigure) == null ? void 0 : _k.call(this, info);
  }
  /**
   * serialize the content
   */
  serialize() {
    var _a;
    const o = {
      id: this.id,
      type: this.type,
      pos: [this.pos[0], this.pos[1]],
      size: [this.size[0], this.size[1]],
      flags: LiteGraph.cloneObject(this.flags),
      order: this.order,
      mode: this.mode,
      showAdvanced: this.showAdvanced
    };
    if (this.constructor === _LGraphNode && this.last_serialization)
      return this.last_serialization;
    if (this.inputs) o.inputs = this.inputs.map((input) => inputAsSerialisable(input));
    if (this.outputs) o.outputs = this.outputs.map((output) => outputAsSerialisable(output));
    if (this.title && this.title != this.constructor.title) o.title = this.title;
    if (this.properties) o.properties = LiteGraph.cloneObject(this.properties);
    const { widgets } = this;
    if (widgets && this.serialize_widgets) {
      o.widgets_values = [];
      for (const [i, widget] of widgets.entries()) {
        o.widgets_values[i] = widget ? widget.value : null;
      }
    }
    if (!o.type) o.type = this.constructor.type;
    if (this.color) o.color = this.color;
    if (this.bgcolor) o.bgcolor = this.bgcolor;
    if (this.boxcolor) o.boxcolor = this.boxcolor;
    if (this.shape) o.shape = this.shape;
    if ((_a = this.onSerialize) == null ? void 0 : _a.call(this, o)) console.warn("node onSerialize shouldnt return anything, data should be stored in the object pass in the first parameter");
    return o;
  }
  /* Creates a clone of this node */
  clone() {
    if (this.type == null) return null;
    const node2 = LiteGraph.createNode(this.type);
    if (!node2) return null;
    const data = LiteGraph.cloneObject(this.serialize());
    const { inputs, outputs } = data;
    if (inputs) {
      for (const input of inputs) {
        input.link = null;
      }
    }
    if (outputs) {
      for (const { links } of outputs) {
        if (links) links.length = 0;
      }
    }
    delete data.id;
    if (LiteGraph.use_uuids) data.id = LiteGraph.uuidv4();
    node2.configure(data);
    return node2;
  }
  /**
   * serialize and stringify
   */
  toString() {
    return JSON.stringify(this.serialize());
  }
  /**
   * get the title string
   */
  getTitle() {
    return this.title || this.constructor.title;
  }
  /**
   * sets the value of a property
   * @param name
   * @param value
   */
  setProperty(name, value) {
    var _a;
    this.properties || (this.properties = {});
    if (value === this.properties[name]) return;
    const prev_value = this.properties[name];
    this.properties[name] = value;
    if (((_a = this.onPropertyChanged) == null ? void 0 : _a.call(this, name, value, prev_value)) === false)
      this.properties[name] = prev_value;
    if (this.widgets) {
      for (const w of this.widgets) {
        if (!w) continue;
        if (w.options.property == name) {
          w.value = value;
          break;
        }
      }
    }
  }
  /**
   * sets the output data
   * @param slot
   * @param data
   */
  setOutputData(slot, data) {
    const { outputs } = this;
    if (!outputs) return;
    if (slot == -1 || slot >= outputs.length) return;
    const output_info = outputs[slot];
    if (!output_info) return;
    output_info._data = data;
    if (!this.graph) throw new NullGraphError();
    const { links } = outputs[slot];
    if (links) {
      for (const id of links) {
        const link = this.graph._links.get(id);
        if (link) link.data = data;
      }
    }
  }
  /**
   * sets the output data type, useful when you want to be able to overwrite the data type
   */
  setOutputDataType(slot, type) {
    const { outputs } = this;
    if (!outputs || (slot == -1 || slot >= outputs.length)) return;
    const output_info = outputs[slot];
    if (!output_info) return;
    output_info.type = type;
    if (!this.graph) throw new NullGraphError();
    const { links } = outputs[slot];
    if (links) {
      for (const id of links) {
        const link = this.graph._links.get(id);
        if (link) link.type = type;
      }
    }
  }
  /**
   * Retrieves the input data (data traveling through the connection) from one slot
   * @param slot
   * @param force_update if set to true it will force the connected node of this slot to output data into this link
   * @returns data or if it is not connected returns undefined
   */
  getInputData(slot, force_update) {
    var _a;
    if (!this.inputs) return;
    if (slot >= this.inputs.length || this.inputs[slot].link == null) return;
    if (!this.graph) throw new NullGraphError();
    const link_id = this.inputs[slot].link;
    const link = this.graph._links.get(link_id);
    if (!link) return null;
    if (!force_update) return link.data;
    const node2 = this.graph.getNodeById(link.origin_id);
    if (!node2) return link.data;
    if (node2.updateOutputData) {
      node2.updateOutputData(link.origin_slot);
    } else {
      (_a = node2.onExecute) == null ? void 0 : _a.call(node2);
    }
    return link.data;
  }
  /**
   * Retrieves the input data type (in case this supports multiple input types)
   * @param slot
   * @returns datatype in string format
   */
  getInputDataType(slot) {
    if (!this.inputs) return null;
    if (slot >= this.inputs.length || this.inputs[slot].link == null) return null;
    if (!this.graph) throw new NullGraphError();
    const link_id = this.inputs[slot].link;
    const link = this.graph._links.get(link_id);
    if (!link) return null;
    const node2 = this.graph.getNodeById(link.origin_id);
    if (!node2) return link.type;
    const output_info = node2.outputs[link.origin_slot];
    return output_info ? output_info.type : null;
  }
  /**
   * Retrieves the input data from one slot using its name instead of slot number
   * @param slot_name
   * @param force_update if set to true it will force the connected node of this slot to output data into this link
   * @returns data or if it is not connected returns null
   */
  getInputDataByName(slot_name, force_update) {
    const slot = this.findInputSlot(slot_name);
    return slot == -1 ? null : this.getInputData(slot, force_update);
  }
  /**
   * tells you if there is a connection in one input slot
   * @param slot The 0-based index of the input to check
   * @returns `true` if the input slot has a link ID (does not perform validation)
   */
  isInputConnected(slot) {
    if (!this.inputs) return false;
    return slot < this.inputs.length && this.inputs[slot].link != null;
  }
  /**
   * tells you info about an input connection (which node, type, etc)
   * @returns object or null { link: id, name: string, type: string or 0 }
   */
  getInputInfo(slot) {
    return !this.inputs || !(slot < this.inputs.length) ? null : this.inputs[slot];
  }
  /**
   * Returns the link info in the connection of an input slot
   * @returns object or null
   */
  getInputLink(slot) {
    var _a;
    if (!this.inputs) return null;
    if (slot < this.inputs.length) {
      if (!this.graph) throw new NullGraphError();
      const input = this.inputs[slot];
      if (input.link != null) {
        return (_a = this.graph._links.get(input.link)) != null ? _a : null;
      }
    }
    return null;
  }
  /**
   * returns the node connected in the input slot
   * @returns node or null
   */
  getInputNode(slot) {
    if (!this.inputs) return null;
    if (slot >= this.inputs.length) return null;
    const input = this.inputs[slot];
    if (!input || input.link === null) return null;
    if (!this.graph) throw new NullGraphError();
    const link_info = this.graph._links.get(input.link);
    if (!link_info) return null;
    return this.graph.getNodeById(link_info.origin_id);
  }
  /**
   * returns the value of an input with this name, otherwise checks if there is a property with that name
   * @returns value
   */
  getInputOrProperty(name) {
    const { inputs } = this;
    if (!(inputs == null ? void 0 : inputs.length)) {
      return this.properties ? this.properties[name] : null;
    }
    if (!this.graph) throw new NullGraphError();
    for (const input of inputs) {
      if (name == input.name && input.link != null) {
        const link = this.graph._links.get(input.link);
        if (link) return link.data;
      }
    }
    return this.properties[name];
  }
  /**
   * tells you the last output data that went in that slot
   * @returns object or null
   */
  getOutputData(slot) {
    if (!this.outputs) return null;
    if (slot >= this.outputs.length) return null;
    const info = this.outputs[slot];
    return info._data;
  }
  /**
   * tells you info about an output connection (which node, type, etc)
   * @returns object or null { name: string, type: string, links: [ ids of links in number ] }
   */
  getOutputInfo(slot) {
    return !this.outputs || !(slot < this.outputs.length) ? null : this.outputs[slot];
  }
  /**
   * tells you if there is a connection in one output slot
   */
  isOutputConnected(slot) {
    var _a;
    if (!this.outputs) return false;
    return slot < this.outputs.length && Number((_a = this.outputs[slot].links) == null ? void 0 : _a.length) > 0;
  }
  /**
   * tells you if there is any connection in the output slots
   */
  isAnyOutputConnected() {
    var _a;
    const { outputs } = this;
    if (!outputs) return false;
    for (const output of outputs) {
      if ((_a = output.links) == null ? void 0 : _a.length) return true;
    }
    return false;
  }
  /**
   * retrieves all the nodes connected to this output slot
   */
  getOutputNodes(slot) {
    const { outputs } = this;
    if (!outputs || outputs.length == 0) return null;
    if (slot >= outputs.length) return null;
    const { links } = outputs[slot];
    if (!links || links.length == 0) return null;
    if (!this.graph) throw new NullGraphError();
    const r = [];
    for (const id of links) {
      const link = this.graph._links.get(id);
      if (link) {
        const target_node = this.graph.getNodeById(link.target_id);
        if (target_node) {
          r.push(target_node);
        }
      }
    }
    return r;
  }
  addOnTriggerInput() {
    const trigS = this.findInputSlot("onTrigger");
    if (trigS == -1) {
      this.addInput("onTrigger", LiteGraph.EVENT, {
        nameLocked: true
      });
      return this.findInputSlot("onTrigger");
    }
    return trigS;
  }
  addOnExecutedOutput() {
    const trigS = this.findOutputSlot("onExecuted");
    if (trigS == -1) {
      this.addOutput("onExecuted", LiteGraph.ACTION, {
        nameLocked: true
      });
      return this.findOutputSlot("onExecuted");
    }
    return trigS;
  }
  onAfterExecuteNode(param, options2) {
    const trigS = this.findOutputSlot("onExecuted");
    if (trigS != -1) {
      this.triggerSlot(trigS, param, null, options2);
    }
  }
  changeMode(modeTo) {
    switch (modeTo) {
      case LGraphEventMode.ON_EVENT:
        break;
      case LGraphEventMode.ON_TRIGGER:
        this.addOnTriggerInput();
        this.addOnExecutedOutput();
        break;
      case LGraphEventMode.NEVER:
        break;
      case LGraphEventMode.ALWAYS:
        break;
      // @ts-expect-error Not impl.
      case LiteGraph.ON_REQUEST:
        break;
      default:
        return false;
    }
    this.mode = modeTo;
    return true;
  }
  /**
   * Triggers the node code execution, place a boolean/counter to mark the node as being executed
   */
  doExecute(param, options2) {
    var _a;
    options2 = options2 || {};
    if (this.onExecute) {
      options2.action_call || (options2.action_call = `${this.id}_exec_${Math.floor(Math.random() * 9999)}`);
      if (!this.graph) throw new NullGraphError();
      this.graph.nodes_executing[this.id] = true;
      this.onExecute(param, options2);
      this.graph.nodes_executing[this.id] = false;
      this.exec_version = this.graph.iteration;
      if (options2 == null ? void 0 : options2.action_call) {
        this.action_call = options2.action_call;
        this.graph.nodes_executedAction[this.id] = options2.action_call;
      }
    }
    this.execute_triggered = 2;
    (_a = this.onAfterExecuteNode) == null ? void 0 : _a.call(this, param, options2);
  }
  /**
   * Triggers an action, wrapped by logics to control execution flow
   * @param action name
   */
  actionDo(action, param, options2) {
    var _a;
    options2 = options2 || {};
    if (this.onAction) {
      options2.action_call || (options2.action_call = `${this.id}_${action || "action"}_${Math.floor(Math.random() * 9999)}`);
      if (!this.graph) throw new NullGraphError();
      this.graph.nodes_actioning[this.id] = action || "actioning";
      this.onAction(action, param, options2);
      this.graph.nodes_actioning[this.id] = false;
      if (options2 == null ? void 0 : options2.action_call) {
        this.action_call = options2.action_call;
        this.graph.nodes_executedAction[this.id] = options2.action_call;
      }
    }
    this.action_triggered = 2;
    (_a = this.onAfterExecuteNode) == null ? void 0 : _a.call(this, param, options2);
  }
  /**
   * Triggers an event in this node, this will trigger any output with the same name
   * @param action name ( "on_play", ... ) if action is equivalent to false then the event is send to all
   */
  trigger(action, param, options2) {
    const { outputs } = this;
    if (!outputs || !outputs.length) {
      return;
    }
    if (this.graph) this.graph._last_trigger_time = LiteGraph.getTime();
    for (const [i, output] of outputs.entries()) {
      if (!output || output.type !== LiteGraph.EVENT || action && output.name != action) {
        continue;
      }
      this.triggerSlot(i, param, null, options2);
    }
  }
  /**
   * Triggers a slot event in this node: cycle output slots and launch execute/action on connected nodes
   * @param slot the index of the output slot
   * @param link_id [optional] in case you want to trigger and specific output link in a slot
   */
  triggerSlot(slot, param, link_id, options2) {
    var _a;
    options2 = options2 || {};
    if (!this.outputs) return;
    if (slot == null) {
      console.error("slot must be a number");
      return;
    }
    if (typeof slot !== "number")
      console.warn("slot must be a number, use node.trigger('name') if you want to use a string");
    const output = this.outputs[slot];
    if (!output) return;
    const links = output.links;
    if (!links || !links.length) return;
    if (!this.graph) throw new NullGraphError();
    this.graph._last_trigger_time = LiteGraph.getTime();
    for (const id of links) {
      if (link_id != null && link_id != id) continue;
      const link_info = this.graph._links.get(id);
      if (!link_info) continue;
      link_info._last_time = LiteGraph.getTime();
      const node2 = this.graph.getNodeById(link_info.target_id);
      if (!node2) continue;
      if (node2.mode === LGraphEventMode.ON_TRIGGER) {
        if (!options2.action_call)
          options2.action_call = `${this.id}_trigg_${Math.floor(Math.random() * 9999)}`;
        (_a = node2.doExecute) == null ? void 0 : _a.call(node2, param, options2);
      } else if (node2.onAction) {
        if (!options2.action_call)
          options2.action_call = `${this.id}_act_${Math.floor(Math.random() * 9999)}`;
        const target_connection = node2.inputs[link_info.target_slot];
        node2.actionDo(target_connection.name, param, options2);
      }
    }
  }
  /**
   * clears the trigger slot animation
   * @param slot the index of the output slot
   * @param link_id [optional] in case you want to trigger and specific output link in a slot
   */
  clearTriggeredSlot(slot, link_id) {
    if (!this.outputs) return;
    const output = this.outputs[slot];
    if (!output) return;
    const links = output.links;
    if (!links || !links.length) return;
    if (!this.graph) throw new NullGraphError();
    for (const id of links) {
      if (link_id != null && link_id != id) continue;
      const link_info = this.graph._links.get(id);
      if (!link_info) continue;
      link_info._last_time = 0;
    }
  }
  /**
   * changes node size and triggers callback
   */
  setSize(size) {
    var _a;
    this.size = size;
    (_a = this.onResize) == null ? void 0 : _a.call(this, this.size);
  }
  /**
   * Expands the node size to fit its content.
   */
  expandToFitContent() {
    const newSize = this.computeSize();
    this.setSize([
      Math.max(this.size[0], newSize[0]),
      Math.max(this.size[1], newSize[1])
    ]);
  }
  /**
   * add a new property to this node
   * @param type string defining the output type ("vec3","number",...)
   * @param extra_info this can be used to have special properties of the property (like values, etc)
   */
  addProperty(name, default_value, type, extra_info) {
    const o = { name, type, default_value };
    if (extra_info) Object.assign(o, extra_info);
    this.properties_info || (this.properties_info = []);
    this.properties_info.push(o);
    this.properties || (this.properties = {});
    this.properties[name] = default_value;
    return o;
  }
  /**
   * add a new output slot to use in this node
   * @param type string defining the output type ("vec3","number",...)
   * @param extra_info this can be used to have special properties of an output (label, special color, position, etc)
   */
  addOutput(name, type, extra_info) {
    var _a;
    const output = new NodeOutputSlot({ name, type, links: null });
    if (extra_info) Object.assign(output, extra_info);
    this.outputs || (this.outputs = []);
    this.outputs.push(output);
    (_a = this.onOutputAdded) == null ? void 0 : _a.call(this, output);
    if (LiteGraph.auto_load_slot_types)
      LiteGraph.registerNodeAndSlotType(this, type, true);
    this.expandToFitContent();
    this.setDirtyCanvas(true, true);
    return output;
  }
  /**
   * add a new output slot to use in this node
   * @param array of triplets like [[name,type,extra_info],[...]]
   */
  addOutputs(array) {
    var _a;
    for (const info of array) {
      const o = new NodeOutputSlot({ name: info[0], type: info[1], links: null });
      if (array[2]) Object.assign(o, info[2]);
      this.outputs || (this.outputs = []);
      this.outputs.push(o);
      (_a = this.onOutputAdded) == null ? void 0 : _a.call(this, o);
      if (LiteGraph.auto_load_slot_types)
        LiteGraph.registerNodeAndSlotType(this, info[1], true);
    }
    this.expandToFitContent();
    this.setDirtyCanvas(true, true);
  }
  /**
   * remove an existing output slot
   */
  removeOutput(slot) {
    var _a;
    this.disconnectOutput(slot);
    const { outputs } = this;
    outputs.splice(slot, 1);
    for (let i = slot; i < outputs.length; ++i) {
      const output = outputs[i];
      if (!output || !output.links) continue;
      for (const linkId of output.links) {
        if (!this.graph) throw new NullGraphError();
        const link = this.graph._links.get(linkId);
        if (link) link.origin_slot--;
      }
    }
    (_a = this.onOutputRemoved) == null ? void 0 : _a.call(this, slot);
    this.setDirtyCanvas(true, true);
  }
  /**
   * add a new input slot to use in this node
   * @param type string defining the input type ("vec3","number",...), it its a generic one use 0
   * @param extra_info this can be used to have special properties of an input (label, color, position, etc)
   */
  addInput(name, type, extra_info) {
    var _a;
    type = type || 0;
    const input = new NodeInputSlot({ name, type, link: null });
    if (extra_info) Object.assign(input, extra_info);
    this.inputs || (this.inputs = []);
    this.inputs.push(input);
    this.expandToFitContent();
    (_a = this.onInputAdded) == null ? void 0 : _a.call(this, input);
    LiteGraph.registerNodeAndSlotType(this, type);
    this.setDirtyCanvas(true, true);
    return input;
  }
  /**
   * add several new input slots in this node
   * @param array of triplets like [[name,type,extra_info],[...]]
   */
  addInputs(array) {
    var _a;
    for (const info of array) {
      const o = new NodeInputSlot({ name: info[0], type: info[1], link: null });
      if (array[2]) Object.assign(o, info[2]);
      this.inputs || (this.inputs = []);
      this.inputs.push(o);
      (_a = this.onInputAdded) == null ? void 0 : _a.call(this, o);
      LiteGraph.registerNodeAndSlotType(this, info[1]);
    }
    this.expandToFitContent();
    this.setDirtyCanvas(true, true);
  }
  /**
   * remove an existing input slot
   */
  removeInput(slot) {
    var _a;
    this.disconnectInput(slot, true);
    const { inputs } = this;
    const slot_info = inputs.splice(slot, 1);
    for (let i = slot; i < inputs.length; ++i) {
      const input = inputs[i];
      if (!(input == null ? void 0 : input.link)) continue;
      if (!this.graph) throw new NullGraphError();
      const link = this.graph._links.get(input.link);
      if (link) link.target_slot--;
    }
    (_a = this.onInputRemoved) == null ? void 0 : _a.call(this, slot, slot_info[0]);
    this.setDirtyCanvas(true, true);
  }
  /**
   * add an special connection to this node (used for special kinds of graphs)
   * @param type string defining the input type ("vec3","number",...)
   * @param pos position of the connection inside the node
   * @param direction if is input or output
   */
  addConnection(name, type, pos, direction) {
    const o = {
      name,
      type,
      pos,
      direction,
      links: null
    };
    this.connections.push(o);
    return o;
  }
  /**
   * computes the minimum size of a node according to its inputs and output slots
   * @returns the total size
   */
  computeSize(out) {
    var _a, _b;
    const ctorSize = this.constructor.size;
    if (ctorSize) return [ctorSize[0], ctorSize[1]];
    const { inputs, outputs } = this;
    let rows = Math.max(
      inputs ? inputs.filter((input) => !isWidgetInputSlot(input)).length : 1,
      outputs ? outputs.length : 1
    );
    const size = out || new Float32Array([0, 0]);
    rows = Math.max(rows, 1);
    const font_size = LiteGraph.NODE_TEXT_SIZE;
    const title_width = compute_text_size(this.title);
    let input_width = 0;
    let output_width = 0;
    if (inputs) {
      for (const input of inputs) {
        const text = input.label || input.localized_name || input.name || "";
        const text_width = compute_text_size(text);
        if (input_width < text_width)
          input_width = text_width;
      }
    }
    if (outputs) {
      for (const output of outputs) {
        const text = output.label || output.localized_name || output.name || "";
        const text_width = compute_text_size(text);
        if (output_width < text_width)
          output_width = text_width;
      }
    }
    size[0] = Math.max(input_width + output_width + 10, title_width);
    size[0] = Math.max(size[0], LiteGraph.NODE_WIDTH);
    if ((_a = this.widgets) == null ? void 0 : _a.length)
      size[0] = Math.max(size[0], LiteGraph.NODE_WIDTH * 1.5);
    size[1] = (this.constructor.slot_start_y || 0) + rows * LiteGraph.NODE_SLOT_HEIGHT;
    let widgets_height = 0;
    if ((_b = this.widgets) == null ? void 0 : _b.length) {
      for (const widget of this.widgets) {
        if (widget.hidden || widget.advanced && !this.showAdvanced) continue;
        let widget_height = 0;
        if (widget.computeSize) {
          widget_height += widget.computeSize(size[0])[1];
        } else if (widget.computeLayoutSize) {
          widget_height += widget.computeLayoutSize(this).minHeight;
        } else {
          widget_height += LiteGraph.NODE_WIDGET_HEIGHT;
        }
        widgets_height += widget_height + 4;
      }
      widgets_height += 8;
    }
    if (this.widgets_up)
      size[1] = Math.max(size[1], widgets_height);
    else if (this.widgets_start_y != null)
      size[1] = Math.max(size[1], widgets_height + this.widgets_start_y);
    else
      size[1] += widgets_height;
    function compute_text_size(text) {
      return text ? font_size * text.length * 0.6 : 0;
    }
    if (this.constructor.min_height && size[1] < this.constructor.min_height) {
      size[1] = this.constructor.min_height;
    }
    size[1] += 6;
    return size;
  }
  inResizeCorner(canvasX, canvasY) {
    const rows = this.outputs ? this.outputs.length : 1;
    const outputs_offset = (this.constructor.slot_start_y || 0) + rows * LiteGraph.NODE_SLOT_HEIGHT;
    return isInRectangle(
      canvasX,
      canvasY,
      this.pos[0] + this.size[0] - 15,
      this.pos[1] + Math.max(this.size[1] - 15, outputs_offset),
      20,
      20
    );
  }
  /**
   * returns all the info available about a property of this node.
   * @param property name of the property
   * @returns the object with all the available info
   */
  getPropertyInfo(property) {
    var _a;
    let info = null;
    const { properties_info } = this;
    if (properties_info) {
      for (const propInfo of properties_info) {
        if (propInfo.name == property) {
          info = propInfo;
          break;
        }
      }
    }
    if (this.constructor[`@${property}`]) info = this.constructor[`@${property}`];
    if ((_a = this.constructor.widgets_info) == null ? void 0 : _a[property])
      info = this.constructor.widgets_info[property];
    if (!info && this.onGetPropertyInfo) {
      info = this.onGetPropertyInfo(property);
    }
    info || (info = {});
    info.type || (info.type = typeof this.properties[property]);
    if (info.widget == "combo") info.type = "enum";
    return info;
  }
  /**
   * Defines a widget inside the node, it will be rendered on top of the node, you can control lots of properties
   * @param type the widget type
   * @param name the text to show on the widget
   * @param value the default value
   * @param callback function to call when it changes (optionally, it can be the name of the property to modify)
   * @param options the object that contains special properties of this widget
   * @returns the created widget object
   */
  addWidget(type, name, value, callback, options2) {
    this.widgets || (this.widgets = []);
    if (!options2 && callback && typeof callback === "object") {
      options2 = callback;
      callback = null;
    }
    options2 || (options2 = {});
    if (typeof options2 === "string")
      options2 = { property: options2 };
    if (callback && typeof callback === "string") {
      options2.property = callback;
      callback = null;
    }
    const w = {
      // @ts-expect-error Type check or just assert?
      type: type.toLowerCase(),
      name,
      value,
      callback: typeof callback !== "function" ? void 0 : callback,
      options: options2,
      y: 0
    };
    if (w.options.y !== void 0) {
      w.y = w.options.y;
    }
    if (!callback && !w.options.callback && !w.options.property) {
      console.warn("LiteGraph addWidget(...) without a callback or property assigned");
    }
    if (type == "combo" && !w.options.values) {
      throw "LiteGraph addWidget('combo',...) requires to pass values in options: { values:['red','blue'] }";
    }
    const widget = this.addCustomWidget(w);
    this.expandToFitContent();
    return widget;
  }
  addCustomWidget(custom_widget) {
    this.widgets || (this.widgets = []);
    const WidgetClass = WIDGET_TYPE_MAP[custom_widget.type];
    const widget = WidgetClass ? new WidgetClass(custom_widget) : custom_widget;
    this.widgets.push(widget);
    return widget;
  }
  move(deltaX, deltaY) {
    if (this.pinned) return;
    this.pos[0] += deltaX;
    this.pos[1] += deltaY;
  }
  /**
   * Internal method to measure the node for rendering.  Prefer {@link boundingRect} where possible.
   *
   * Populates {@link out} with the results in graph space.
   * Populates {@link _collapsed_width} with the collapsed width if the node is collapsed.
   * Adjusts for title and collapsed status, but does not call {@link onBounding}.
   * @param out `x, y, width, height` are written to this array.
   * @param ctx The canvas context to use for measuring text.
   */
  measure(out, ctx) {
    var _a, _b;
    const titleMode = this.title_mode;
    const renderTitle = titleMode != TitleMode.TRANSPARENT_TITLE && titleMode != TitleMode.NO_TITLE;
    const titleHeight = renderTitle ? LiteGraph.NODE_TITLE_HEIGHT : 0;
    out[0] = this.pos[0];
    out[1] = this.pos[1] + -titleHeight;
    if (!((_a = this.flags) == null ? void 0 : _a.collapsed)) {
      out[2] = this.size[0];
      out[3] = this.size[1] + titleHeight;
    } else {
      ctx.font = this.innerFontStyle;
      this._collapsed_width = Math.min(
        this.size[0],
        ctx.measureText((_b = this.getTitle()) != null ? _b : "").width + LiteGraph.NODE_TITLE_HEIGHT * 2
      );
      out[2] = this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH;
      out[3] = LiteGraph.NODE_TITLE_HEIGHT;
    }
  }
  /**
   * returns the bounding of the object, used for rendering purposes
   * @param out {Float32Array[4]?} [optional] a place to store the output, to free garbage
   * @param includeExternal {boolean?} [optional] set to true to
   * include the shadow and connection points in the bounding calculation
   * @returns the bounding box in format of [topleft_cornerx, topleft_cornery, width, height]
   */
  getBounding(out, includeExternal) {
    out || (out = new Float32Array(4));
    const rect = includeExternal ? this.renderArea : this.boundingRect;
    out[0] = rect[0];
    out[1] = rect[1];
    out[2] = rect[2];
    out[3] = rect[3];
    return out;
  }
  /**
   * Calculates the render area of this node, populating both {@link boundingRect} and {@link renderArea}.
   * Called automatically at the start of every frame.
   */
  updateArea(ctx) {
    var _a;
    const bounds = __privateGet(this, _boundingRect);
    this.measure(bounds, ctx);
    (_a = this.onBounding) == null ? void 0 : _a.call(this, bounds);
    const renderArea = __privateGet(this, _renderArea);
    renderArea.set(bounds);
    renderArea[0] -= 4;
    renderArea[1] -= 4;
    renderArea[2] += 6 + 4;
    renderArea[3] += 5 + 4;
  }
  /**
   * checks if a point is inside the shape of a node
   */
  isPointInside(x2, y) {
    return isInRect(x2, y, this.boundingRect);
  }
  /**
   * Checks if the provided point is inside this node's collapse button area.
   * @param x X co-ordinate to check
   * @param y Y co-ordinate to check
   * @returns true if the x,y point is in the collapse button area, otherwise false
   */
  isPointInCollapse(x2, y) {
    const squareLength = LiteGraph.NODE_TITLE_HEIGHT;
    return isInRectangle(
      x2,
      y,
      this.pos[0],
      this.pos[1] - squareLength,
      squareLength,
      squareLength
    );
  }
  /**
   * Returns the input slot at the given position. Uses full 20 height, and approximates the label length.
   * @param pos The graph co-ordinates to check
   * @returns The input slot at the given position if found, otherwise `undefined`.
   */
  getInputOnPos(pos) {
    var _a;
    return (_a = getNodeInputOnPos(this, pos[0], pos[1])) == null ? void 0 : _a.input;
  }
  /**
   * Returns the output slot at the given position. Uses full 20x20 box for the slot.
   * @param pos The graph co-ordinates to check
   * @returns The output slot at the given position if found, otherwise `undefined`.
   */
  getOutputOnPos(pos) {
    var _a;
    return (_a = getNodeOutputOnPos(this, pos[0], pos[1])) == null ? void 0 : _a.output;
  }
  /**
   * Returns the input or output slot at the given position.
   *
   * Tries {@link getNodeInputOnPos} first, then {@link getNodeOutputOnPos}.
   * @param pos The graph co-ordinates to check
   * @returns The input or output slot at the given position if found, otherwise `undefined`.
   */
  getSlotOnPos(pos) {
    var _a;
    if (!isPointInRect(pos, this.boundingRect)) return;
    return (_a = this.getInputOnPos(pos)) != null ? _a : this.getOutputOnPos(pos);
  }
  /**
   * @deprecated Use {@link getSlotOnPos} instead.
   * checks if a point is inside a node slot, and returns info about which slot
   * @param x
   * @param y
   * @returns if found the object contains { input|output: slot object, slot: number, link_pos: [x,y] }
   */
  getSlotInPosition(x2, y) {
    const { inputs, outputs } = this;
    if (inputs) {
      for (const [i, input] of inputs.entries()) {
        const pos = this.getInputPos(i);
        if (isInRectangle(x2, y, pos[0] - 10, pos[1] - 10, 20, 20)) {
          return { input, slot: i, link_pos: pos };
        }
      }
    }
    if (outputs) {
      for (const [i, output] of outputs.entries()) {
        const pos = this.getOutputPos(i);
        if (isInRectangle(x2, y, pos[0] - 10, pos[1] - 10, 20, 20)) {
          return { output, slot: i, link_pos: pos };
        }
      }
    }
    return null;
  }
  /**
   * Gets the widget on this node at the given co-ordinates.
   * @param canvasX X co-ordinate in graph space
   * @param canvasY Y co-ordinate in graph space
   * @returns The widget found, otherwise `null`
   */
  getWidgetOnPos(canvasX, canvasY, includeDisabled = false) {
    var _a, _b, _c;
    const { widgets, pos, size } = this;
    if (!(widgets == null ? void 0 : widgets.length)) return null;
    const x2 = canvasX - pos[0];
    const y = canvasY - pos[1];
    const nodeWidth = size[0];
    for (const widget of widgets) {
      if (widget.disabled && !includeDisabled || widget.hidden || widget.advanced && !this.showAdvanced) {
        continue;
      }
      const h = (_c = (_b = widget.computedHeight) != null ? _b : (_a = widget.computeSize) == null ? void 0 : _a.call(widget, nodeWidth)[1]) != null ? _c : LiteGraph.NODE_WIDGET_HEIGHT;
      const w = widget.width || nodeWidth;
      if (widget.last_y !== void 0 && isInRectangle(x2, y, 6, widget.last_y, w - 12, h)) {
        return widget;
      }
    }
    return null;
  }
  findInputSlot(name, returnObj = false) {
    const { inputs } = this;
    if (!inputs) return -1;
    for (const [i, input] of inputs.entries()) {
      if (name == input.name) {
        return !returnObj ? i : input;
      }
    }
    return -1;
  }
  findOutputSlot(name, returnObj = false) {
    const { outputs } = this;
    if (!outputs) return -1;
    for (const [i, output] of outputs.entries()) {
      if (name == output.name) {
        return !returnObj ? i : output;
      }
    }
    return -1;
  }
  findInputSlotFree(optsIn) {
    return __privateMethod(this, _LGraphNode_instances, findFreeSlot_fn).call(this, this.inputs, optsIn);
  }
  findOutputSlotFree(optsIn) {
    return __privateMethod(this, _LGraphNode_instances, findFreeSlot_fn).call(this, this.outputs, optsIn);
  }
  findInputSlotByType(type, returnObj, preferFreeSlot, doNotUseOccupied) {
    return __privateMethod(this, _LGraphNode_instances, findSlotByType_fn).call(this, this.inputs, type, returnObj, preferFreeSlot, doNotUseOccupied);
  }
  findOutputSlotByType(type, returnObj, preferFreeSlot, doNotUseOccupied) {
    return __privateMethod(this, _LGraphNode_instances, findSlotByType_fn).call(this, this.outputs, type, returnObj, preferFreeSlot, doNotUseOccupied);
  }
  findSlotByType(input, type, returnObj, preferFreeSlot, doNotUseOccupied) {
    return input ? __privateMethod(this, _LGraphNode_instances, findSlotByType_fn).call(this, this.inputs, type, returnObj, preferFreeSlot, doNotUseOccupied) : __privateMethod(this, _LGraphNode_instances, findSlotByType_fn).call(this, this.outputs, type, returnObj, preferFreeSlot, doNotUseOccupied);
  }
  /**
   * Determines the slot index to connect to when attempting to connect by type.
   * @param findInputs If true, searches for an input.  Otherwise, an output.
   * @param node The node at the other end of the connection.
   * @param slotType The type of slot at the other end of the connection.
   * @param options Search restrictions to adhere to.
   * @see {connectByType}
   * @see {connectByTypeOutput}
   */
  findConnectByTypeSlot(findInputs, node2, slotType, options2) {
    if (options2 && typeof options2 === "object") {
      if ("firstFreeIfInputGeneralInCase" in options2) options2.wildcardToTyped = !!options2.firstFreeIfInputGeneralInCase;
      if ("firstFreeIfOutputGeneralInCase" in options2) options2.wildcardToTyped = !!options2.firstFreeIfOutputGeneralInCase;
      if ("generalTypeInCase" in options2) options2.typedToWildcard = !!options2.generalTypeInCase;
    }
    const optsDef = {
      createEventInCase: true,
      wildcardToTyped: true,
      typedToWildcard: true
    };
    const opts = Object.assign(optsDef, options2);
    if (!this.graph) throw new NullGraphError();
    if (node2 && typeof node2 === "number") {
      const nodeById = this.graph.getNodeById(node2);
      if (!nodeById) return;
      node2 = nodeById;
    }
    const slot = node2.findSlotByType(findInputs, slotType, false, true);
    if (slot >= 0 && slot !== null) return slot;
    if (opts.createEventInCase && slotType == LiteGraph.EVENT) {
      if (findInputs) return -1;
      if (LiteGraph.do_add_triggers_slots) return node2.addOnExecutedOutput();
    }
    if (opts.typedToWildcard) {
      const generalSlot = node2.findSlotByType(findInputs, 0, false, true, true);
      if (generalSlot >= 0) return generalSlot;
    }
    if (opts.wildcardToTyped && (slotType == 0 || slotType == "*" || slotType == "")) {
      const opt = { typesNotAccepted: [LiteGraph.EVENT] };
      const nonEventSlot = findInputs ? node2.findInputSlotFree(opt) : node2.findOutputSlotFree(opt);
      if (nonEventSlot >= 0) return nonEventSlot;
    }
  }
  /**
   * Finds the first free output slot with any of the comma-delimited types in {@link type}.
   *
   * If no slots are free, falls back in order to:
   * - The first free wildcard slot
   * - The first occupied slot
   * - The first occupied wildcard slot
   * @param type The {@link ISlotType type} of slot to find
   * @returns The index and slot if found, otherwise `undefined`.
   */
  findOutputByType(type) {
    return findFreeSlotOfType(this.outputs, type);
  }
  /**
   * Finds the first free input slot with any of the comma-delimited types in {@link type}.
   *
   * If no slots are free, falls back in order to:
   * - The first free wildcard slot
   * - The first occupied slot
   * - The first occupied wildcard slot
   * @param type The {@link ISlotType type} of slot to find
   * @returns The index and slot if found, otherwise `undefined`.
   */
  findInputByType(type) {
    return findFreeSlotOfType(this.inputs, type);
  }
  /**
   * connect this node output to the input of another node BY TYPE
   * @param slot (could be the number of the slot or the string with the name of the slot)
   * @param target_node the target node
   * @param target_slotType the input slot type of the target node
   * @returns the link_info is created, otherwise null
   */
  connectByType(slot, target_node, target_slotType, optsIn) {
    const slotIndex = this.findConnectByTypeSlot(
      true,
      target_node,
      target_slotType,
      optsIn
    );
    if (slotIndex !== void 0)
      return this.connect(slot, target_node, slotIndex, optsIn == null ? void 0 : optsIn.afterRerouteId);
    console.debug("[connectByType]: no way to connect type:", target_slotType, "to node:", target_node);
    return null;
  }
  /**
   * connect this node input to the output of another node BY TYPE
   * @param slot (could be the number of the slot or the string with the name of the slot)
   * @param source_node the target node
   * @param source_slotType the output slot type of the target node
   * @returns the link_info is created, otherwise null
   */
  connectByTypeOutput(slot, source_node, source_slotType, optsIn) {
    if (typeof optsIn === "object") {
      if ("firstFreeIfInputGeneralInCase" in optsIn) optsIn.wildcardToTyped = !!optsIn.firstFreeIfInputGeneralInCase;
      if ("generalTypeInCase" in optsIn) optsIn.typedToWildcard = !!optsIn.generalTypeInCase;
    }
    const slotIndex = this.findConnectByTypeSlot(
      false,
      source_node,
      source_slotType,
      optsIn
    );
    if (slotIndex !== void 0)
      return source_node.connect(slotIndex, this, slot, optsIn == null ? void 0 : optsIn.afterRerouteId);
    console.debug("[connectByType]: no way to connect type:", source_slotType, "to node:", source_node);
    return null;
  }
  canConnectTo(node2, toSlot, fromSlot) {
    return this.id !== node2.id && LiteGraph.isValidConnection(fromSlot.type, toSlot.type);
  }
  /**
   * Connect an output of this node to an input of another node
   * @param slot (could be the number of the slot or the string with the name of the slot)
   * @param target_node the target node
   * @param target_slot the input slot of the target node (could be the number of the slot or the string with the name of the slot, or -1 to connect a trigger)
   * @returns the link_info is created, otherwise null
   */
  connect(slot, target_node, target_slot, afterRerouteId) {
    var _a;
    let targetIndex;
    const { graph, outputs } = this;
    if (!graph) {
      console.log("Connect: Error, node doesn't belong to any graph. Nodes must be added first to a graph before connecting them.");
      return null;
    }
    if (typeof slot === "string") {
      slot = this.findOutputSlot(slot);
      if (slot == -1) {
        if (LiteGraph.debug) console.log(`Connect: Error, no slot of name ${slot}`);
        return null;
      }
    } else if (!outputs || slot >= outputs.length) {
      if (LiteGraph.debug) console.log("Connect: Error, slot number not found");
      return null;
    }
    if (target_node && typeof target_node === "number") {
      const nodeById = graph.getNodeById(target_node);
      if (!nodeById) throw "target node is null";
      target_node = nodeById;
    }
    if (!target_node) throw "target node is null";
    if (target_node == this) return null;
    if (typeof target_slot === "string") {
      targetIndex = target_node.findInputSlot(target_slot);
      if (targetIndex == -1) {
        if (LiteGraph.debug) console.log(`Connect: Error, no slot of name ${targetIndex}`);
        return null;
      }
    } else if (target_slot === LiteGraph.EVENT) {
      if (LiteGraph.do_add_triggers_slots) {
        target_node.changeMode(LGraphEventMode.ON_TRIGGER);
        targetIndex = target_node.findInputSlot("onTrigger");
      } else {
        return null;
      }
    } else if (typeof target_slot === "number") {
      targetIndex = target_slot;
    } else {
      targetIndex = 0;
    }
    if (target_node.onBeforeConnectInput) {
      const requestedIndex = target_node.onBeforeConnectInput(targetIndex, target_slot);
      targetIndex = typeof requestedIndex === "number" ? requestedIndex : null;
    }
    if (targetIndex === null || !target_node.inputs || targetIndex >= target_node.inputs.length) {
      if (LiteGraph.debug) console.log("Connect: Error, slot number not found");
      return null;
    }
    const input = target_node.inputs[targetIndex];
    const output = outputs[slot];
    if (!output) return null;
    if ((_a = output.links) == null ? void 0 : _a.length) {
      if (output.type === LiteGraph.EVENT && !LiteGraph.allow_multi_output_for_events) {
        graph.beforeChange();
        this.disconnectOutput(slot, false, { doProcessChange: false });
      }
    }
    const link = this.connectSlots(output, target_node, input, afterRerouteId);
    return link != null ? link : null;
  }
  /**
   * Connect two slots between two nodes
   * @param output The output slot to connect
   * @param inputNode The node that the input slot is on
   * @param input The input slot to connect
   * @param afterRerouteId The reroute ID to use for the link
   * @returns The link that was created, or null if the connection was blocked
   */
  connectSlots(output, inputNode, input, afterRerouteId) {
    var _a, _b, _c, _d, _e, _f;
    const { graph } = this;
    if (!graph) throw new NullGraphError();
    const outputIndex = this.outputs.indexOf(output);
    if (outputIndex === -1) {
      console.warn("connectSlots: output not found");
      return;
    }
    const inputIndex = inputNode.inputs.indexOf(input);
    if (inputIndex === -1) {
      console.warn("connectSlots: input not found");
      return;
    }
    if (!LiteGraph.isValidConnection(output.type, input.type)) {
      this.setDirtyCanvas(false, true);
      return null;
    }
    if (((_a = inputNode.onConnectInput) == null ? void 0 : _a.call(inputNode, inputIndex, output.type, output, this, outputIndex)) === false)
      return null;
    if (((_b = this.onConnectOutput) == null ? void 0 : _b.call(this, outputIndex, input.type, input, inputNode, inputIndex)) === false)
      return null;
    if (((_c = inputNode.inputs[inputIndex]) == null ? void 0 : _c.link) != null) {
      graph.beforeChange();
      inputNode.disconnectInput(inputIndex, true);
    }
    const link = new LLink(
      ++graph.state.lastLinkId,
      input.type || output.type,
      this.id,
      outputIndex,
      inputNode.id,
      inputIndex,
      afterRerouteId
    );
    graph._links.set(link.id, link);
    (_d = output.links) != null ? _d : output.links = [];
    output.links.push(link.id);
    inputNode.inputs[inputIndex].link = link.id;
    const reroutes = LLink.getReroutes(graph, link);
    for (const reroute of reroutes) {
      reroute.linkIds.add(link.id);
      if (reroute.floating) delete reroute.floating;
      reroute._dragging = void 0;
    }
    const lastReroute = reroutes.at(-1);
    if (lastReroute) {
      for (const linkId of lastReroute.floatingLinkIds) {
        const link2 = graph.floatingLinks.get(linkId);
        if ((link2 == null ? void 0 : link2.parentId) === lastReroute.id) {
          graph.removeFloatingLink(link2);
        }
      }
    }
    graph._version++;
    (_e = this.onConnectionsChange) == null ? void 0 : _e.call(
      this,
      NodeSlotType.OUTPUT,
      outputIndex,
      true,
      link,
      output
    );
    (_f = inputNode.onConnectionsChange) == null ? void 0 : _f.call(
      inputNode,
      NodeSlotType.INPUT,
      inputIndex,
      true,
      link,
      input
    );
    this.setDirtyCanvas(false, true);
    graph.afterChange();
    graph.connectionChange(this);
    return link;
  }
  connectFloatingReroute(pos, slot, afterRerouteId) {
    var _a, _b;
    const { graph, id } = this;
    if (!graph) throw new NullGraphError();
    const inputIndex = this.inputs.indexOf(slot);
    const outputIndex = this.outputs.indexOf(slot);
    if (inputIndex === -1 && outputIndex === -1) throw new Error("Invalid slot");
    const slotType = outputIndex === -1 ? "input" : "output";
    const reroute = graph.setReroute({
      pos,
      parentId: afterRerouteId,
      linkIds: [],
      floating: { slotType }
    });
    const parentReroute = graph.getReroute(afterRerouteId);
    const fromLastFloatingReroute = ((_a = parentReroute == null ? void 0 : parentReroute.floating) == null ? void 0 : _a.slotType) === "output";
    if (afterRerouteId == null || !fromLastFloatingReroute) {
      const link2 = new LLink(
        -1,
        slot.type,
        outputIndex === -1 ? -1 : id,
        outputIndex,
        inputIndex === -1 ? -1 : id,
        inputIndex
      );
      link2.parentId = reroute.id;
      graph.addFloatingLink(link2);
      return reroute;
    }
    if (!parentReroute) throw new Error("[connectFloatingReroute] Parent reroute not found");
    const link = (_b = parentReroute.getFloatingLinks("output")) == null ? void 0 : _b[0];
    if (!link) throw new Error("[connectFloatingReroute] Floating link not found");
    reroute.floatingLinkIds.add(link.id);
    link.parentId = reroute.id;
    delete parentReroute.floating;
    return reroute;
  }
  /**
   * disconnect one output to an specific node
   * @param slot (could be the number of the slot or the string with the name of the slot)
   * @param target_node the target node to which this slot is connected [Optional,
   * if not target_node is specified all nodes will be disconnected]
   * @returns if it was disconnected successfully
   */
  disconnectOutput(slot, target_node) {
    var _a, _b, _c, _d, _e;
    if (typeof slot === "string") {
      slot = this.findOutputSlot(slot);
      if (slot == -1) {
        if (LiteGraph.debug) console.log(`Connect: Error, no slot of name ${slot}`);
        return false;
      }
    } else if (!this.outputs || slot >= this.outputs.length) {
      if (LiteGraph.debug) console.log("Connect: Error, slot number not found");
      return false;
    }
    const output = this.outputs[slot];
    if (!output) return false;
    if (output._floatingLinks) {
      for (const link of output._floatingLinks) {
        if (link.hasOrigin(this.id, slot)) {
          (_a = this.graph) == null ? void 0 : _a.removeFloatingLink(link);
        }
      }
    }
    if (!output.links || output.links.length == 0) return false;
    const { links } = output;
    const graph = this.graph;
    if (!graph) throw new NullGraphError();
    if (target_node) {
      const target = typeof target_node === "number" ? graph.getNodeById(target_node) : target_node;
      if (!target) throw "Target Node not found";
      for (const [i, link_id] of links.entries()) {
        const link_info = graph._links.get(link_id);
        if ((link_info == null ? void 0 : link_info.target_id) != target.id) continue;
        links.splice(i, 1);
        const input = target.inputs[link_info.target_slot];
        input.link = null;
        link_info.disconnect(graph, "input");
        graph._version++;
        (_b = target.onConnectionsChange) == null ? void 0 : _b.call(
          target,
          NodeSlotType.INPUT,
          link_info.target_slot,
          false,
          link_info,
          input
        );
        (_c = this.onConnectionsChange) == null ? void 0 : _c.call(
          this,
          NodeSlotType.OUTPUT,
          slot,
          false,
          link_info,
          output
        );
        break;
      }
    } else {
      for (const link_id of links) {
        const link_info = graph._links.get(link_id);
        if (!link_info) continue;
        const target = graph.getNodeById(link_info.target_id);
        graph._version++;
        if (target) {
          const input = target.inputs[link_info.target_slot];
          input.link = null;
          (_d = target.onConnectionsChange) == null ? void 0 : _d.call(
            target,
            NodeSlotType.INPUT,
            link_info.target_slot,
            false,
            link_info,
            input
          );
        }
        link_info.disconnect(graph, "input");
        (_e = this.onConnectionsChange) == null ? void 0 : _e.call(
          this,
          NodeSlotType.OUTPUT,
          slot,
          false,
          link_info,
          output
        );
      }
      output.links = null;
    }
    this.setDirtyCanvas(false, true);
    graph.connectionChange(this);
    return true;
  }
  /**
   * Disconnect one input
   * @param slot Input slot index, or the name of the slot
   * @param keepReroutes If `true`, reroutes will not be garbage collected.
   * @returns true if disconnected successfully or already disconnected, otherwise false
   */
  disconnectInput(slot, keepReroutes) {
    var _a, _b, _c, _d;
    if (typeof slot === "string") {
      slot = this.findInputSlot(slot);
      if (slot == -1) {
        if (LiteGraph.debug) console.log(`Connect: Error, no slot of name ${slot}`);
        return false;
      }
    } else if (!this.inputs || slot >= this.inputs.length) {
      if (LiteGraph.debug) {
        console.log("Connect: Error, slot number not found");
      }
      return false;
    }
    const input = this.inputs[slot];
    if (!input) return false;
    const { graph } = this;
    if (!graph) throw new NullGraphError();
    if ((_a = input._floatingLinks) == null ? void 0 : _a.size) {
      for (const link of input._floatingLinks) {
        graph.removeFloatingLink(link);
      }
    }
    const link_id = this.inputs[slot].link;
    if (link_id != null) {
      this.inputs[slot].link = null;
      const link_info = graph._links.get(link_id);
      if (link_info) {
        const target_node = graph.getNodeById(link_info.origin_id);
        if (!target_node) return false;
        const output = target_node.outputs[link_info.origin_slot];
        if (!((_b = output == null ? void 0 : output.links) == null ? void 0 : _b.length)) return false;
        let i = 0;
        for (const l = output.links.length; i < l; i++) {
          if (output.links[i] == link_id) {
            output.links.splice(i, 1);
            break;
          }
        }
        link_info.disconnect(graph, keepReroutes ? "output" : void 0);
        if (graph) graph._version++;
        (_c = this.onConnectionsChange) == null ? void 0 : _c.call(
          this,
          NodeSlotType.INPUT,
          slot,
          false,
          link_info,
          input
        );
        (_d = target_node.onConnectionsChange) == null ? void 0 : _d.call(
          target_node,
          NodeSlotType.OUTPUT,
          i,
          false,
          link_info,
          output
        );
      }
    }
    this.setDirtyCanvas(false, true);
    graph == null ? void 0 : graph.connectionChange(this);
    return true;
  }
  /**
   * @deprecated Use {@link getInputPos} or {@link getOutputPos} instead.
   * returns the center of a connection point in canvas coords
   * @param is_input true if if a input slot, false if it is an output
   * @param slot_number (could be the number of the slot or the string with the name of the slot)
   * @param out [optional] a place to store the output, to free garbage
   * @returns the position
   */
  getConnectionPos(is_input, slot_number, out) {
    var _a, _b;
    out || (out = new Float32Array(2));
    const { pos: [nodeX, nodeY], inputs, outputs } = this;
    if (this.flags.collapsed) {
      const w = this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH;
      out[0] = is_input ? nodeX : nodeX + w;
      out[1] = nodeY - LiteGraph.NODE_TITLE_HEIGHT * 0.5;
      return out;
    }
    if (is_input && slot_number == -1) {
      out[0] = nodeX + LiteGraph.NODE_TITLE_HEIGHT * 0.5;
      out[1] = nodeY + LiteGraph.NODE_TITLE_HEIGHT * 0.5;
      return out;
    }
    const inputPos = (_a = inputs == null ? void 0 : inputs[slot_number]) == null ? void 0 : _a.pos;
    const outputPos = (_b = outputs == null ? void 0 : outputs[slot_number]) == null ? void 0 : _b.pos;
    if (is_input && inputPos) {
      out[0] = nodeX + inputPos[0];
      out[1] = nodeY + inputPos[1];
      return out;
    } else if (!is_input && outputPos) {
      out[0] = nodeX + outputPos[0];
      out[1] = nodeY + outputPos[1];
      return out;
    }
    const offset = LiteGraph.NODE_SLOT_HEIGHT * 0.5;
    out[0] = is_input ? nodeX + offset : nodeX + this.size[0] + 1 - offset;
    out[1] = nodeY + (slot_number + 0.7) * LiteGraph.NODE_SLOT_HEIGHT + (this.constructor.slot_start_y || 0);
    return out;
  }
  /**
   * Gets the position of an input slot, in graph co-ordinates.
   *
   * This method is preferred over the legacy {@link getConnectionPos} method.
   * @param slot Input slot index
   * @returns Position of the input slot
   */
  getInputPos(slot) {
    var _a;
    const { pos: [nodeX, nodeY], inputs } = this;
    if (this.flags.collapsed) {
      const halfTitle = LiteGraph.NODE_TITLE_HEIGHT * 0.5;
      return [nodeX, nodeY - halfTitle];
    }
    const inputPos = (_a = inputs == null ? void 0 : inputs[slot]) == null ? void 0 : _a.pos;
    if (inputPos) return [nodeX + inputPos[0], nodeY + inputPos[1]];
    const offsetX = LiteGraph.NODE_SLOT_HEIGHT * 0.5;
    const nodeOffsetY = this.constructor.slot_start_y || 0;
    const slotY = (slot + 0.7) * LiteGraph.NODE_SLOT_HEIGHT;
    return [nodeX + offsetX, nodeY + slotY + nodeOffsetY];
  }
  /**
   * Gets the position of an output slot, in graph co-ordinates.
   *
   * This method is preferred over the legacy {@link getConnectionPos} method.
   * @param slot Output slot index
   * @returns Position of the output slot
   */
  getOutputPos(slot) {
    var _a;
    const { pos: [nodeX, nodeY], outputs, size: [width2] } = this;
    if (this.flags.collapsed) {
      const width22 = this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH;
      const halfTitle = LiteGraph.NODE_TITLE_HEIGHT * 0.5;
      return [nodeX + width22, nodeY - halfTitle];
    }
    const outputPos = (_a = outputs == null ? void 0 : outputs[slot]) == null ? void 0 : _a.pos;
    if (outputPos) return outputPos;
    const offsetX = LiteGraph.NODE_SLOT_HEIGHT * 0.5;
    const nodeOffsetY = this.constructor.slot_start_y || 0;
    const slotY = (slot + 0.7) * LiteGraph.NODE_SLOT_HEIGHT;
    return [nodeX + width2 + 1 - offsetX, nodeY + slotY + nodeOffsetY];
  }
  /** @inheritdoc */
  snapToGrid(snapTo) {
    return this.pinned ? false : snapPoint(this.pos, snapTo);
  }
  /** @see {@link snapToGrid} */
  alignToGrid() {
    this.snapToGrid(LiteGraph.CANVAS_GRID_SIZE);
  }
  /* Console output */
  trace(msg) {
    this.console || (this.console = []);
    this.console.push(msg);
    if (this.console.length > _LGraphNode.MAX_CONSOLE)
      this.console.shift();
  }
  /* Forces to redraw or the main canvas (LGraphNode) or the bg canvas (links) */
  setDirtyCanvas(dirty_foreground, dirty_background) {
    var _a;
    (_a = this.graph) == null ? void 0 : _a.canvasAction((c) => c.setDirty(dirty_foreground, dirty_background));
  }
  loadImage(url) {
    const img = new Image();
    img.src = LiteGraph.node_images_path + url;
    img.ready = false;
    const dirty = () => this.setDirtyCanvas(true);
    img.addEventListener("load", function() {
      this.ready = true;
      dirty();
    });
    return img;
  }
  /* Allows to get onMouseMove and onMouseUp events even if the mouse is out of focus */
  captureInput(v2) {
    if (!this.graph || !this.graph.list_of_graphcanvas) return;
    const list = this.graph.list_of_graphcanvas;
    for (const c of list) {
      if (!v2 && c.node_capturing_input != this) continue;
      c.node_capturing_input = v2 ? this : null;
    }
  }
  get collapsed() {
    return !!this.flags.collapsed;
  }
  get collapsible() {
    return !this.pinned && this.constructor.collapsable !== false;
  }
  /**
   * Toggle node collapse (makes it smaller on the canvas)
   */
  collapse(force) {
    if (!this.collapsible && !force) return;
    if (!this.graph) throw new NullGraphError();
    this.graph._version++;
    this.flags.collapsed = !this.flags.collapsed;
    this.setDirtyCanvas(true, true);
  }
  /**
   * Toggles advanced mode of the node, showing advanced widgets
   */
  toggleAdvanced() {
    var _a;
    if (!((_a = this.widgets) == null ? void 0 : _a.some((w) => w.advanced))) return;
    if (!this.graph) throw new NullGraphError();
    this.graph._version++;
    this.showAdvanced = !this.showAdvanced;
    this.expandToFitContent();
    this.setDirtyCanvas(true, true);
  }
  get pinned() {
    return !!this.flags.pinned;
  }
  /**
   * Prevents the node being accidentally moved or resized by mouse interaction.
   * Toggles pinned state if no value is provided.
   */
  pin(v2) {
    if (!this.graph) throw new NullGraphError();
    this.graph._version++;
    this.flags.pinned = v2 != null ? v2 : !this.flags.pinned;
    this.resizable = !this.pinned;
    if (!this.pinned) delete this.flags.pinned;
  }
  unpin() {
    this.pin(false);
  }
  localToScreen(x2, y, dragAndScale) {
    return [
      (x2 + this.pos[0]) * dragAndScale.scale + dragAndScale.offset[0],
      (y + this.pos[1]) * dragAndScale.scale + dragAndScale.offset[1]
    ];
  }
  get width() {
    return this.collapsed ? this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH : this.size[0];
  }
  /**
   * Returns the height of the node, including the title bar.
   */
  get height() {
    return LiteGraph.NODE_TITLE_HEIGHT + this.bodyHeight;
  }
  /**
   * Returns the height of the node, excluding the title bar.
   */
  get bodyHeight() {
    return this.collapsed ? 0 : this.size[1];
  }
  drawBadges(ctx, { gap = 2 } = {}) {
    const badgeInstances = this.badges.map((badge) => badge instanceof LGraphBadge ? badge : badge());
    const isLeftAligned = this.badgePosition === BadgePosition.TopLeft;
    let currentX = isLeftAligned ? 0 : this.width - badgeInstances.reduce((acc, badge) => acc + badge.getWidth(ctx) + gap, 0);
    const y = -(LiteGraph.NODE_TITLE_HEIGHT + gap);
    for (const badge of badgeInstances) {
      badge.draw(ctx, currentX, y - badge.height);
      currentX += badge.getWidth(ctx) + gap;
    }
  }
  /**
   * Renders the node's title bar background
   */
  drawTitleBarBackground(ctx, options2) {
    const {
      scale,
      title_height = LiteGraph.NODE_TITLE_HEIGHT,
      low_quality = false
    } = options2;
    const fgcolor = this.renderingColor;
    const shape = this.renderingShape;
    const size = this.renderingSize;
    if (this.onDrawTitleBar) {
      this.onDrawTitleBar(ctx, title_height, size, scale, fgcolor);
      return;
    }
    if (this.title_mode === TitleMode.TRANSPARENT_TITLE) {
      return;
    }
    if (this.collapsed) {
      ctx.shadowColor = LiteGraph.DEFAULT_SHADOW_COLOR;
    }
    ctx.fillStyle = this.constructor.title_color || fgcolor;
    ctx.beginPath();
    if (shape == RenderShape.BOX || low_quality) {
      ctx.rect(0, -title_height, size[0], title_height);
    } else if (shape == RenderShape.ROUND || shape == RenderShape.CARD) {
      ctx.roundRect(
        0,
        -title_height,
        size[0],
        title_height,
        this.collapsed ? [LiteGraph.ROUND_RADIUS] : [LiteGraph.ROUND_RADIUS, LiteGraph.ROUND_RADIUS, 0, 0]
      );
    }
    ctx.fill();
    ctx.shadowColor = "transparent";
  }
  /**
   * Renders the node's title box, i.e. the dot in front of the title text that
   * when clicked toggles the node's collapsed state. The term `title box` comes
   * from the original LiteGraph implementation.
   */
  drawTitleBox(ctx, options2) {
    const {
      scale,
      low_quality = false,
      title_height = LiteGraph.NODE_TITLE_HEIGHT,
      box_size = 10
    } = options2;
    const size = this.renderingSize;
    const shape = this.renderingShape;
    if (this.onDrawTitleBox) {
      this.onDrawTitleBox(ctx, title_height, size, scale);
      return;
    }
    if ([RenderShape.ROUND, RenderShape.CIRCLE, RenderShape.CARD].includes(shape)) {
      if (low_quality) {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(
          title_height * 0.5,
          title_height * -0.5,
          box_size * 0.5 + 1,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.fillStyle = this.renderingBoxColor;
      if (low_quality) {
        ctx.fillRect(
          title_height * 0.5 - box_size * 0.5,
          title_height * -0.5 - box_size * 0.5,
          box_size,
          box_size
        );
      } else {
        ctx.beginPath();
        ctx.arc(
          title_height * 0.5,
          title_height * -0.5,
          box_size * 0.5,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    } else {
      if (low_quality) {
        ctx.fillStyle = "black";
        ctx.fillRect(
          (title_height - box_size) * 0.5 - 1,
          (title_height + box_size) * -0.5 - 1,
          box_size + 2,
          box_size + 2
        );
      }
      ctx.fillStyle = this.renderingBoxColor;
      ctx.fillRect(
        (title_height - box_size) * 0.5,
        (title_height + box_size) * -0.5,
        box_size,
        box_size
      );
    }
  }
  /**
   * Renders the node's title text.
   */
  drawTitleText(ctx, options2) {
    var _a;
    const {
      scale,
      default_title_color,
      low_quality = false,
      title_height = LiteGraph.NODE_TITLE_HEIGHT
    } = options2;
    const size = this.renderingSize;
    const selected = this.selected;
    if (this.onDrawTitleText) {
      this.onDrawTitleText(
        ctx,
        title_height,
        size,
        scale,
        this.titleFontStyle,
        selected
      );
      return;
    }
    if (low_quality) {
      return;
    }
    ctx.font = this.titleFontStyle;
    const rawTitle = (_a = this.getTitle()) != null ? _a : `\u274C ${this.type}`;
    const title = String(rawTitle) + (this.pinned ? "\u{1F4CC}" : "");
    if (title) {
      if (selected) {
        ctx.fillStyle = LiteGraph.NODE_SELECTED_TITLE_COLOR;
      } else {
        ctx.fillStyle = this.constructor.title_text_color || default_title_color;
      }
      if (this.collapsed) {
        ctx.textAlign = "left";
        ctx.fillText(
          // avoid urls too long
          title.substr(0, 20),
          title_height,
          LiteGraph.NODE_TITLE_TEXT_Y - title_height
        );
        ctx.textAlign = "left";
      } else {
        ctx.textAlign = "left";
        ctx.fillText(
          title,
          title_height,
          LiteGraph.NODE_TITLE_TEXT_Y - title_height
        );
      }
    }
  }
  /**
   * Attempts to gracefully bypass this node in all of its connections by reconnecting all links.
   *
   * Each input is checked against each output.  This is done on a matching index basis, i.e. input 3 -> output 3.
   * If there are any input links remaining,
   * and {@link flags}.{@link INodeFlags.keepAllLinksOnBypass keepAllLinksOnBypass} is `true`,
   * each input will check for outputs that match, and take the first one that matches
   * `true`: Try the index matching first, then every input to every output.
   * `false`: Only matches indexes, e.g. input 3 to output 3.
   *
   * If {@link flags}.{@link INodeFlags.keepAllLinksOnBypass keepAllLinksOnBypass} is `undefined`, it will fall back to
   * the static {@link keepAllLinksOnBypass}.
   * @returns `true` if any new links were established, otherwise `false`.
   * @todo Decision: Change API to return array of new links instead?
   */
  connectInputToOutput() {
    var _a;
    const { inputs, outputs, graph } = this;
    if (!inputs || !outputs) return;
    if (!graph) throw new NullGraphError();
    const { _links } = graph;
    let madeAnyConnections = false;
    for (const [index, input] of inputs.entries()) {
      if (input.link == null) continue;
      const output = outputs[index];
      if (!output || !LiteGraph.isValidConnection(input.type, output.type)) continue;
      const inLink = _links.get(input.link);
      if (!inLink) continue;
      const inNode = graph.getNodeById(inLink == null ? void 0 : inLink.origin_id);
      if (!inNode) continue;
      bypassAllLinks(output, inNode, inLink, graph);
    }
    if (!((_a = this.flags.keepAllLinksOnBypass) != null ? _a : _LGraphNode.keepAllLinksOnBypass))
      return madeAnyConnections;
    for (const input of inputs) {
      if (input.link == null) continue;
      const inLink = _links.get(input.link);
      if (!inLink) continue;
      const inNode = graph.getNodeById(inLink == null ? void 0 : inLink.origin_id);
      if (!inNode) continue;
      for (const output of outputs) {
        if (!LiteGraph.isValidConnection(input.type, output.type)) continue;
        bypassAllLinks(output, inNode, inLink, graph);
        break;
      }
    }
    return madeAnyConnections;
    function bypassAllLinks(output, inNode, inLink, graph2) {
      var _a2;
      const outLinks = (_a2 = output.links) == null ? void 0 : _a2.map((x2) => _links.get(x2)).filter((x2) => !!x2);
      if (!(outLinks == null ? void 0 : outLinks.length)) return;
      for (const outLink of outLinks) {
        const outNode = graph2.getNodeById(outLink.target_id);
        if (!outNode) continue;
        const result = inNode.connect(
          inLink.origin_slot,
          outNode,
          outLink.target_slot,
          inLink.parentId
        );
        madeAnyConnections || (madeAnyConnections = !!result);
      }
    }
  }
  drawWidgets(ctx, options2) {
    var _a;
    if (!this.widgets) return;
    const { colorContext, linkOverWidget, linkOverWidgetType, lowQuality = false, editorAlpha = 1 } = options2;
    const width2 = this.size[0];
    const widgets = this.widgets;
    const H = LiteGraph.NODE_WIDGET_HEIGHT;
    const show_text = !lowQuality;
    ctx.save();
    ctx.globalAlpha = editorAlpha;
    const margin = 15;
    for (const w of widgets) {
      if (w.hidden || w.advanced && !this.showAdvanced) continue;
      const y = w.y;
      const outline_color = w.advanced ? LiteGraph.WIDGET_ADVANCED_OUTLINE_COLOR : LiteGraph.WIDGET_OUTLINE_COLOR;
      if (w === linkOverWidget) {
        new NodeInputSlot({
          name: "",
          // @ts-expect-error https://github.com/Comfy-Org/litegraph.js/issues/616
          type: linkOverWidgetType,
          link: 0
        }).draw(ctx, { pos: [10, y + 10], colorContext });
      }
      w.last_y = y;
      ctx.strokeStyle = outline_color;
      ctx.fillStyle = "#222";
      ctx.textAlign = "left";
      if (w.disabled) ctx.globalAlpha *= 0.5;
      const widget_width = w.width || width2;
      const WidgetClass = WIDGET_TYPE_MAP[w.type];
      if (WidgetClass) {
        toClass(WidgetClass, w).drawWidget(ctx, { y, width: widget_width, show_text, margin });
      } else {
        (_a = w.draw) == null ? void 0 : _a.call(w, ctx, this, widget_width, y, H, lowQuality);
      }
      ctx.globalAlpha = editorAlpha;
    }
    ctx.restore();
  }
  /**
   * When {@link LGraphNode.collapsed} is `true`, this method draws the node's collapsed slots.
   */
  drawCollapsedSlots(ctx) {
    var _a, _b, _c;
    let input_slot = null;
    let output_slot = null;
    for (const slot of (_a = this.inputs) != null ? _a : []) {
      if (slot.link == null) {
        continue;
      }
      input_slot = slot;
      break;
    }
    for (const slot of (_b = this.outputs) != null ? _b : []) {
      if (!slot.links || !slot.links.length) {
        continue;
      }
      output_slot = slot;
      break;
    }
    if (input_slot) {
      const x2 = 0;
      const y = LiteGraph.NODE_TITLE_HEIGHT * -0.5;
      toClass(NodeInputSlot, input_slot).drawCollapsed(ctx, {
        pos: [x2, y]
      });
    }
    if (output_slot) {
      const x2 = (_c = this._collapsed_width) != null ? _c : LiteGraph.NODE_COLLAPSED_WIDTH;
      const y = LiteGraph.NODE_TITLE_HEIGHT * -0.5;
      toClass(NodeOutputSlot, output_slot).drawCollapsed(ctx, {
        pos: [x2, y]
      });
    }
  }
  get highlightColor() {
    var _a, _b;
    return (_b = (_a = LiteGraph.NODE_TEXT_HIGHLIGHT_COLOR) != null ? _a : LiteGraph.NODE_SELECTED_TITLE_COLOR) != null ? _b : LiteGraph.NODE_TEXT_COLOR;
  }
  get slots() {
    return [...this.inputs, ...this.outputs];
  }
  layoutSlot(slot, options2) {
    const { slotIndex } = options2;
    const isInput = isINodeInputSlot(slot);
    const pos = isInput ? this.getInputPos(slotIndex) : this.getOutputPos(slotIndex);
    slot._layoutElement = new LayoutElement({
      value: slot,
      boundingRect: [
        pos[0] - this.pos[0] - LiteGraph.NODE_SLOT_HEIGHT * 0.5,
        pos[1] - this.pos[1] - LiteGraph.NODE_SLOT_HEIGHT * 0.5,
        LiteGraph.NODE_SLOT_HEIGHT,
        LiteGraph.NODE_SLOT_HEIGHT
      ]
    });
  }
  layoutSlots() {
    var _a;
    const slots = [];
    for (const [i, slot] of this.inputs.entries()) {
      if (((_a = this.widgets) == null ? void 0 : _a.length) && isWidgetInputSlot(slot)) continue;
      this.layoutSlot(slot, {
        slotIndex: i
      });
      if (slot._layoutElement) {
        slots.push(slot._layoutElement);
      }
    }
    for (const [i, slot] of this.outputs.entries()) {
      this.layoutSlot(slot, {
        slotIndex: i
      });
      if (slot._layoutElement) {
        slots.push(slot._layoutElement);
      }
    }
    return slots.length ? createBounds(
      slots,
      /** padding= */
      0
    ) : null;
  }
  /**
   * Draws the node's input and output slots.
   */
  drawSlots(ctx, options2) {
    var _a;
    const { fromSlot, colorContext, editorAlpha, lowQuality } = options2;
    for (const slot of this.slots) {
      const layoutElement = slot._layoutElement;
      const slotInstance = toNodeSlotClass(slot);
      const isValid = !fromSlot || slotInstance.isValidTarget(fromSlot);
      const highlight = isValid && __privateMethod(this, _LGraphNode_instances, isMouseOverSlot_fn).call(this, slot);
      const labelColor = highlight ? this.highlightColor : LiteGraph.NODE_TEXT_COLOR;
      ctx.globalAlpha = isValid ? editorAlpha : 0.4 * editorAlpha;
      slotInstance.draw(ctx, {
        pos: (_a = layoutElement == null ? void 0 : layoutElement.center) != null ? _a : [0, 0],
        colorContext,
        labelColor,
        lowQuality,
        highlight
      });
    }
  }
  /**
   * Lays out the node's widgets vertically.
   * Sets following properties on each widget:
   * -  {@link IBaseWidget.computedHeight}
   * -  {@link IBaseWidget.y}
   */
  layoutWidgets(options2) {
    var _a, _b;
    if (!this.widgets || !this.widgets.length) return;
    const bodyHeight = this.bodyHeight;
    const widgetStartY = (_a = this.widgets_start_y) != null ? _a : (this.widgets_up ? 0 : options2.widgetStartY) + 2;
    let freeSpace = bodyHeight - widgetStartY;
    let fixedWidgetHeight = 0;
    const growableWidgets = [];
    for (const w of this.widgets) {
      if (w.computeSize) {
        const height = w.computeSize()[1] + 4;
        w.computedHeight = height;
        fixedWidgetHeight += height;
      } else if (w.computeLayoutSize) {
        const { minHeight, maxHeight } = w.computeLayoutSize(this);
        growableWidgets.push({
          minHeight,
          prefHeight: maxHeight,
          w
        });
      } else {
        const height = LiteGraph.NODE_WIDGET_HEIGHT + 4;
        w.computedHeight = height;
        fixedWidgetHeight += height;
      }
    }
    freeSpace -= fixedWidgetHeight;
    this.freeWidgetSpace = freeSpace;
    const spaceRequests = growableWidgets.map((d) => ({
      minSize: d.minHeight,
      maxSize: d.prefHeight
    }));
    const allocations = distributeSpace(Math.max(0, freeSpace), spaceRequests);
    for (const [i, d] of growableWidgets.entries()) {
      d.w.computedHeight = allocations[i];
    }
    let y = widgetStartY;
    for (const w of this.widgets) {
      w.y = y;
      y += (_b = w.computedHeight) != null ? _b : 0;
    }
    if (!this.graph) throw new NullGraphError();
    if (y > bodyHeight) {
      this.setSize([this.size[0], y]);
      this.graph.setDirtyCanvas(false, true);
    }
  }
  /**
   * Lays out the node's widget input slots.
   */
  layoutWidgetInputSlots() {
    var _a;
    if (!this.widgets) return;
    const slotByWidgetName = /* @__PURE__ */ new Map();
    for (const [i, slot] of this.inputs.entries()) {
      if (!isWidgetInputSlot(slot)) continue;
      slotByWidgetName.set((_a = slot.widget) == null ? void 0 : _a.name, { ...slot, index: i });
    }
    if (!slotByWidgetName.size) return;
    for (const widget of this.widgets) {
      const slot = slotByWidgetName.get(widget.name);
      if (!slot) continue;
      const actualSlot = this.inputs[slot.index];
      const offset = LiteGraph.NODE_SLOT_HEIGHT * 0.5;
      actualSlot.pos = [offset, widget.y + offset];
      this.layoutSlot(actualSlot, { slotIndex: slot.index });
    }
  }
  /**
   * Draws a progress bar on the node.
   * @param ctx The canvas context to draw on
   */
  drawProgressBar(ctx) {
    if (!this.progress) return;
    const originalFillStyle = ctx.fillStyle;
    ctx.fillStyle = "green";
    ctx.fillRect(
      0,
      0,
      this.width * this.progress,
      6
    );
    ctx.fillStyle = originalFillStyle;
  }
};
_renderArea = new WeakMap();
_boundingRect = new WeakMap();
_LGraphNode_instances = new WeakSet();
getErrorStrokeStyle_fn = function() {
  if (this.has_errors) {
    return {
      padding: 12,
      lineWidth: 10,
      color: LiteGraph.NODE_ERROR_COLOUR
    };
  }
};
getSelectedStrokeStyle_fn = function() {
  if (this.selected) {
    return {
      padding: this.has_errors ? 20 : void 0
    };
  }
};
/**
 * Finds the next free slot
 * @param slots The slots to search, i.e. this.inputs or this.outputs
 */
findFreeSlot_fn = function(slots, options2) {
  var _a, _b, _c;
  const defaults = {
    returnObj: false,
    typesNotAccepted: []
  };
  const opts = Object.assign(defaults, options2 || {});
  const length = slots == null ? void 0 : slots.length;
  if (!(length > 0)) return -1;
  for (let i = 0; i < length; ++i) {
    const slot = slots[i];
    if (!slot || slot.link || ((_a = slot.links) == null ? void 0 : _a.length)) continue;
    if ((_c = (_b = opts.typesNotAccepted) == null ? void 0 : _b.includes) == null ? void 0 : _c.call(_b, slot.type)) continue;
    return !opts.returnObj ? i : slot;
  }
  return -1;
};
/**
 * Finds a matching slot from those provided, returning the slot itself or its index in {@link slots}.
 * @param slots Slots to search (this.inputs or this.outputs)
 * @param type Type of slot to look for
 * @param returnObj If true, returns the slot itself.  Otherwise, the index.
 * @param preferFreeSlot Prefer a free slot, but if none are found, fall back to an occupied slot.
 * @param doNotUseOccupied Do not fall back to occupied slots.
 * @see {findSlotByType}
 * @see {findOutputSlotByType}
 * @see {findInputSlotByType}
 * @returns If a match is found, the slot if returnObj is true, otherwise the index.  If no matches are found, -1
 */
findSlotByType_fn = function(slots, type, returnObj, preferFreeSlot, doNotUseOccupied) {
  var _a;
  const length = slots == null ? void 0 : slots.length;
  if (!length) return -1;
  if (type == "" || type == "*") type = 0;
  const sourceTypes = String(type).toLowerCase().split(",");
  let occupiedSlot = null;
  for (let i = 0; i < length; ++i) {
    const slot = slots[i];
    const destTypes = slot.type == "0" || slot.type == "*" ? ["0"] : String(slot.type).toLowerCase().split(",");
    for (const sourceType of sourceTypes) {
      const source = sourceType == "_event_" ? LiteGraph.EVENT : sourceType;
      for (const destType of destTypes) {
        const dest = destType == "_event_" ? LiteGraph.EVENT : destType;
        if (source == dest || source === "*" || dest === "*") {
          if (preferFreeSlot && (((_a = slot.links) == null ? void 0 : _a.length) || slot.link != null)) {
            occupiedSlot != null ? occupiedSlot : occupiedSlot = returnObj ? slot : i;
            continue;
          }
          return returnObj ? slot : i;
        }
      }
    }
  }
  return doNotUseOccupied ? -1 : occupiedSlot != null ? occupiedSlot : -1;
};
getMouseOverSlot_fn = function(slot) {
  var _a, _b;
  const isInput = isINodeInputSlot(slot);
  const mouseOverId = (_b = (_a = this.mouseOver) == null ? void 0 : _a[isInput ? "inputId" : "outputId"]) != null ? _b : -1;
  if (mouseOverId === -1) {
    return null;
  }
  return isInput ? this.inputs[mouseOverId] : this.outputs[mouseOverId];
};
isMouseOverSlot_fn = function(slot) {
  return __privateMethod(this, _LGraphNode_instances, getMouseOverSlot_fn).call(this, slot) === slot;
};
// Static properties used by dynamic child classes
__publicField(_LGraphNode, "title");
__publicField(_LGraphNode, "MAX_CONSOLE");
__publicField(_LGraphNode, "type");
__publicField(_LGraphNode, "category");
__publicField(_LGraphNode, "filter");
__publicField(_LGraphNode, "skip_list");
/** Default setting for {@link LGraphNode.connectInputToOutput}. @see {@link INodeFlags.keepAllLinksOnBypass} */
__publicField(_LGraphNode, "keepAllLinksOnBypass", false);
var LGraphNode = _LGraphNode;
var _LGraphGroup = class _LGraphGroup {
  constructor(title, id) {
    __publicField(this, "id");
    __publicField(this, "color");
    __publicField(this, "title");
    __publicField(this, "font");
    __publicField(this, "font_size", LiteGraph.DEFAULT_GROUP_FONT || 24);
    __publicField(this, "_bounding", new Float32Array([
      10,
      10,
      _LGraphGroup.minWidth,
      _LGraphGroup.minHeight
    ]));
    __publicField(this, "_pos", this._bounding.subarray(0, 2));
    __publicField(this, "_size", this._bounding.subarray(2, 4));
    /** @deprecated See {@link _children} */
    __publicField(this, "_nodes", []);
    __publicField(this, "_children", /* @__PURE__ */ new Set());
    __publicField(this, "graph");
    __publicField(this, "flags", {});
    __publicField(this, "selected");
    __publicField(this, "isPointInside", LGraphNode.prototype.isPointInside);
    __publicField(this, "setDirtyCanvas", LGraphNode.prototype.setDirtyCanvas);
    this.id = id != null ? id : -1;
    this.title = title || "Group";
    this.color = LGraphCanvas.node_colors.pale_blue ? LGraphCanvas.node_colors.pale_blue.groupcolor : "#AAA";
  }
  /** @inheritdoc {@link IColorable.setColorOption} */
  setColorOption(colorOption) {
    if (colorOption == null) {
      delete this.color;
    } else {
      this.color = colorOption.groupcolor;
    }
  }
  /** @inheritdoc {@link IColorable.getColorOption} */
  getColorOption() {
    var _a;
    return (_a = Object.values(LGraphCanvas.node_colors).find(
      (colorOption) => colorOption.groupcolor === this.color
    )) != null ? _a : null;
  }
  /** Position of the group, as x,y co-ordinates in graph space */
  get pos() {
    return this._pos;
  }
  set pos(v2) {
    if (!v2 || v2.length < 2) return;
    this._pos[0] = v2[0];
    this._pos[1] = v2[1];
  }
  /** Size of the group, as width,height in graph units */
  get size() {
    return this._size;
  }
  set size(v2) {
    if (!v2 || v2.length < 2) return;
    this._size[0] = Math.max(_LGraphGroup.minWidth, v2[0]);
    this._size[1] = Math.max(_LGraphGroup.minHeight, v2[1]);
  }
  get boundingRect() {
    return this._bounding;
  }
  get nodes() {
    return this._nodes;
  }
  get titleHeight() {
    return this.font_size * 1.4;
  }
  get children() {
    return this._children;
  }
  get pinned() {
    return !!this.flags.pinned;
  }
  /**
   * Prevents the group being accidentally moved or resized by mouse interaction.
   * Toggles pinned state if no value is provided.
   */
  pin(value) {
    const newState = value === void 0 ? !this.pinned : value;
    if (newState) this.flags.pinned = true;
    else delete this.flags.pinned;
  }
  unpin() {
    this.pin(false);
  }
  configure(o) {
    this.id = o.id;
    this.title = o.title;
    this._bounding.set(o.bounding);
    this.color = o.color;
    this.flags = o.flags || this.flags;
    if (o.font_size) this.font_size = o.font_size;
  }
  serialize() {
    const b = this._bounding;
    return {
      id: this.id,
      title: this.title,
      bounding: [...b],
      color: this.color,
      font_size: this.font_size,
      flags: this.flags
    };
  }
  /**
   * Draws the group on the canvas
   * @param graphCanvas
   * @param ctx
   */
  draw(graphCanvas, ctx) {
    const { padding, resizeLength, defaultColour } = _LGraphGroup;
    const font_size = this.font_size || LiteGraph.DEFAULT_GROUP_FONT_SIZE;
    const [x2, y] = this._pos;
    const [width2, height] = this._size;
    const color = this.color || defaultColour;
    ctx.globalAlpha = 0.25 * graphCanvas.editor_alpha;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.rect(x2 + 0.5, y + 0.5, width2, font_size * 1.4);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.rect(x2 + 0.5, y + 0.5, width2, height);
    ctx.fill();
    ctx.globalAlpha = graphCanvas.editor_alpha;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2 + width2, y + height);
    ctx.lineTo(x2 + width2 - resizeLength, y + height);
    ctx.lineTo(x2 + width2, y + height - resizeLength);
    ctx.fill();
    ctx.font = `${font_size}px Arial`;
    ctx.textAlign = "left";
    ctx.fillText(this.title + (this.pinned ? "\u{1F4CC}" : ""), x2 + padding, y + font_size);
    if (LiteGraph.highlight_selected_group && this.selected) {
      strokeShape(ctx, this._bounding, {
        title_height: this.titleHeight,
        padding
      });
    }
  }
  resize(width2, height) {
    if (this.pinned) return false;
    this._size[0] = Math.max(_LGraphGroup.minWidth, width2);
    this._size[1] = Math.max(_LGraphGroup.minHeight, height);
    return true;
  }
  move(deltaX, deltaY, skipChildren = false) {
    if (this.pinned) return;
    this._pos[0] += deltaX;
    this._pos[1] += deltaY;
    if (skipChildren === true) return;
    for (const item of this._children) {
      item.move(deltaX, deltaY);
    }
  }
  /** @inheritdoc */
  snapToGrid(snapTo) {
    return this.pinned ? false : snapPoint(this.pos, snapTo);
  }
  recomputeInsideNodes() {
    if (!this.graph) throw new NullGraphError();
    const { nodes, reroutes, groups } = this.graph;
    const children = this._children;
    this._nodes.length = 0;
    children.clear();
    for (const node2 of nodes) {
      if (containsCentre(this._bounding, node2.boundingRect)) {
        this._nodes.push(node2);
        children.add(node2);
      }
    }
    for (const reroute of reroutes.values()) {
      if (isPointInRect(reroute.pos, this._bounding))
        children.add(reroute);
    }
    for (const group of groups) {
      if (containsRect(this._bounding, group._bounding))
        children.add(group);
    }
    groups.sort((a, b) => {
      if (a === this) {
        return children.has(b) ? -1 : 0;
      } else if (b === this) {
        return children.has(a) ? 1 : 0;
      } else {
        return 0;
      }
    });
  }
  /**
   * Resizes and moves the group to neatly fit all given {@link objects}.
   * @param objects All objects that should be inside the group
   * @param padding Value in graph units to add to all sides of the group.  Default: 10
   */
  resizeTo(objects, padding = 10) {
    const boundingBox = createBounds(objects, padding);
    if (boundingBox === null) return;
    this.pos[0] = boundingBox[0];
    this.pos[1] = boundingBox[1] - this.titleHeight;
    this.size[0] = boundingBox[2];
    this.size[1] = boundingBox[3] + this.titleHeight;
  }
  /**
   * Add nodes to the group and adjust the group's position and size accordingly
   * @param nodes The nodes to add to the group
   * @param padding The padding around the group
   */
  addNodes(nodes, padding = 10) {
    if (!this._nodes && nodes.length === 0) return;
    this.resizeTo([...this.children, ...this._nodes, ...nodes], padding);
  }
  getMenuOptions() {
    return [
      {
        content: this.pinned ? "Unpin" : "Pin",
        callback: () => {
          if (this.pinned) this.unpin();
          else this.pin();
          this.setDirtyCanvas(false, true);
        }
      },
      null,
      { content: "Title", callback: LGraphCanvas.onShowPropertyEditor },
      {
        content: "Color",
        has_submenu: true,
        callback: LGraphCanvas.onMenuNodeColors
      },
      {
        content: "Font size",
        property: "font_size",
        type: "Number",
        callback: LGraphCanvas.onShowPropertyEditor
      },
      null,
      { content: "Remove", callback: LGraphCanvas.onMenuNodeRemove }
    ];
  }
  isPointInTitlebar(x2, y) {
    const b = this.boundingRect;
    return isInRectangle(x2, y, b[0], b[1], b[2], this.titleHeight);
  }
  isInResize(x2, y) {
    const b = this.boundingRect;
    const right = b[0] + b[2];
    const bottom = b[1] + b[3];
    return x2 < right && y < bottom && x2 - right + (y - bottom) > -_LGraphGroup.resizeLength;
  }
};
__publicField(_LGraphGroup, "minWidth", 140);
__publicField(_LGraphGroup, "minHeight", 80);
__publicField(_LGraphGroup, "resizeLength", 10);
__publicField(_LGraphGroup, "padding", 4);
__publicField(_LGraphGroup, "defaultColour", "#335");
var LGraphGroup = _LGraphGroup;
var _malloc, _network, _parentId, _pos, _lastRenderTime;
var _Reroute = class _Reroute {
  /**
   * Initialises a new link reroute object.
   * @param id Unique identifier for this reroute
   * @param network The network of links this reroute belongs to.  Internally converted to a WeakRef.
   * @param pos Position in graph coordinates
   * @param linkIds Link IDs ({@link LLink.id}) of all links that use this reroute
   */
  constructor(id, network, pos, parentId, linkIds, floatingLinkIds) {
    __privateAdd(this, _malloc, new Float32Array(8));
    /** The network this reroute belongs to.  Contains all valid links and reroutes. */
    __privateAdd(this, _network);
    __privateAdd(this, _parentId);
    /** This property is only defined on the last reroute of a floating reroute chain (closest to input end). */
    __publicField(this, "floating");
    __privateAdd(this, _pos, __privateGet(this, _malloc).subarray(0, 2));
    /** @inheritdoc */
    __publicField(this, "selected");
    /** The ID ({@link LLink.id}) of every link using this reroute */
    __publicField(this, "linkIds");
    /** The ID ({@link LLink.id}) of every floating link using this reroute */
    __publicField(this, "floatingLinkIds");
    /** Cached cos */
    __publicField(this, "cos", 0);
    __publicField(this, "sin", 0);
    /** Bezier curve control point for the "target" (input) side of the link */
    __publicField(this, "controlPoint", __privateGet(this, _malloc).subarray(4, 6));
    /** @inheritdoc */
    __publicField(this, "path");
    /** @inheritdoc */
    __publicField(this, "_centreAngle");
    /** @inheritdoc */
    __publicField(this, "_pos", __privateGet(this, _malloc).subarray(6, 8));
    /** @inheritdoc */
    __publicField(this, "_dragging");
    /** Colour of the first link that rendered this reroute */
    __publicField(this, "_colour");
    /**
     * Used to ensure reroute angles are only executed once per frame.
     * @todo Calculate on change instead.
     */
    __privateAdd(this, _lastRenderTime, -Infinity);
    this.id = id;
    __privateSet(this, _network, new WeakRef(network));
    this.parentId = parentId;
    if (pos) this.pos = pos;
    this.linkIds = new Set(linkIds);
    this.floatingLinkIds = new Set(floatingLinkIds);
  }
  get parentId() {
    return __privateGet(this, _parentId);
  }
  /** Ignores attempts to create an infinite loop. @inheritdoc */
  set parentId(value) {
    if (value === this.id) return;
    if (this.getReroutes() === null) return;
    __privateSet(this, _parentId, value);
  }
  get parent() {
    var _a;
    return (_a = __privateGet(this, _network).deref()) == null ? void 0 : _a.getReroute(__privateGet(this, _parentId));
  }
  /** @inheritdoc */
  get pos() {
    return __privateGet(this, _pos);
  }
  set pos(value) {
    if (!((value == null ? void 0 : value.length) >= 2))
      throw new TypeError("Reroute.pos is an x,y point, and expects an indexable with at least two values.");
    __privateGet(this, _pos)[0] = value[0];
    __privateGet(this, _pos)[1] = value[1];
  }
  /** @inheritdoc */
  get boundingRect() {
    const { radius } = _Reroute;
    const [x2, y] = __privateGet(this, _pos);
    return [x2 - radius, y - radius, 2 * radius, 2 * radius];
  }
  /** The total number of links & floating links using this reroute */
  get totalLinks() {
    return this.linkIds.size + this.floatingLinkIds.size;
  }
  get firstLink() {
    var _a;
    const linkId = this.linkIds.values().next().value;
    return linkId === void 0 ? void 0 : (_a = __privateGet(this, _network).deref()) == null ? void 0 : _a.links.get(linkId);
  }
  get firstFloatingLink() {
    var _a;
    const linkId = this.floatingLinkIds.values().next().value;
    return linkId === void 0 ? void 0 : (_a = __privateGet(this, _network).deref()) == null ? void 0 : _a.floatingLinks.get(linkId);
  }
  /** @inheritdoc */
  get origin_id() {
    var _a;
    return (_a = this.firstLink) == null ? void 0 : _a.origin_id;
  }
  /** @inheritdoc */
  get origin_slot() {
    var _a;
    return (_a = this.firstLink) == null ? void 0 : _a.origin_slot;
  }
  /**
   * Applies a new parentId to the reroute, and optinoally a new position and linkId.
   * Primarily used for deserialisation.
   * @param parentId The ID of the reroute prior to this reroute, or
   * `undefined` if it is the first reroute connected to a nodes output
   * @param pos The position of this reroute
   * @param linkIds All link IDs that pass through this reroute
   */
  update(parentId, pos, linkIds, floating) {
    this.parentId = parentId;
    if (pos) this.pos = pos;
    if (linkIds) this.linkIds = new Set(linkIds);
    this.floating = floating;
  }
  /**
   * Validates the linkIds this reroute has.  Removes broken links.
   * @param links Collection of valid links
   * @returns true if any links remain after validation
   */
  validateLinks(links, floatingLinks) {
    const { linkIds, floatingLinkIds } = this;
    for (const linkId of linkIds) {
      if (!links.has(linkId)) linkIds.delete(linkId);
    }
    for (const linkId of floatingLinkIds) {
      if (!floatingLinks.has(linkId)) floatingLinkIds.delete(linkId);
    }
    return linkIds.size > 0 || floatingLinkIds.size > 0;
  }
  /**
   * Retrieves an ordered array of all reroutes from the node output.
   * @param visited Internal.  A set of reroutes that this function
   * has already visited whilst recursing up the chain.
   * @returns An ordered array of all reroutes from the node output to this reroute, inclusive.
   * `null` if an infinite loop is detected.
   * `undefined` if the reroute chain or {@link LinkNetwork} are invalid.
   */
  getReroutes(visited = /* @__PURE__ */ new Set()) {
    var _a;
    if (__privateGet(this, _parentId) === void 0) return [this];
    if (visited.has(this)) return null;
    visited.add(this);
    const parent = (_a = __privateGet(this, _network).deref()) == null ? void 0 : _a.reroutes.get(__privateGet(this, _parentId));
    if (!parent) {
      __privateSet(this, _parentId, void 0);
      return [this];
    }
    const reroutes = parent.getReroutes(visited);
    reroutes == null ? void 0 : reroutes.push(this);
    return reroutes;
  }
  /**
   * Internal.  Called by {@link LLink.findNextReroute}.  Not intended for use by itself.
   * @param withParentId The rerouteId to look for
   * @param visited A set of reroutes that have already been visited
   * @returns The reroute that was found, `undefined` if no reroute was found, or `null` if an infinite loop was detected.
   */
  findNextReroute(withParentId, visited = /* @__PURE__ */ new Set()) {
    var _a, _b;
    if (__privateGet(this, _parentId) === withParentId) return this;
    if (visited.has(this)) return null;
    visited.add(this);
    if (__privateGet(this, _parentId) === void 0) return;
    return (_b = (_a = __privateGet(this, _network).deref()) == null ? void 0 : _a.reroutes.get(__privateGet(this, _parentId))) == null ? void 0 : _b.findNextReroute(withParentId, visited);
  }
  findSourceOutput() {
    var _a, _b;
    const link = (_a = this.firstLink) != null ? _a : this.firstFloatingLink;
    if (!link) return;
    const node2 = (_b = __privateGet(this, _network).deref()) == null ? void 0 : _b.getNodeById(link.origin_id);
    if (!node2) return;
    return {
      node: node2,
      output: node2.outputs[link.origin_slot],
      outputIndex: link.origin_slot,
      link
    };
  }
  /**
   * Finds the first input slot for links or floating links passing through this reroute.
   */
  findTargetInputs() {
    const network = __privateGet(this, _network).deref();
    if (!network) return;
    const results = [];
    addAllResults(network, this.linkIds, network.links);
    addAllResults(network, this.floatingLinkIds, network.floatingLinks);
    return results;
    function addAllResults(network2, linkIds, links) {
      for (const linkId of linkIds) {
        const link = links.get(linkId);
        if (!link) continue;
        const node2 = network2.getNodeById(link.target_id);
        const input = node2 == null ? void 0 : node2.inputs[link.target_slot];
        if (!input) continue;
        results.push({ node: node2, input, inputIndex: link.target_slot, link });
      }
    }
  }
  /**
   * Retrieves all floating links passing through this reroute.
   * @param from Filters the links by the currently connected link side.
   * @returns An array of floating links
   */
  getFloatingLinks(from) {
    var _a;
    const floatingLinks = (_a = __privateGet(this, _network).deref()) == null ? void 0 : _a.floatingLinks;
    if (!floatingLinks) return;
    const idProp = from === "input" ? "origin_id" : "target_id";
    const out = [];
    for (const linkId of this.floatingLinkIds) {
      const link = floatingLinks.get(linkId);
      if ((link == null ? void 0 : link[idProp]) === -1) out.push(link);
    }
    return out;
  }
  /**
   * Changes the origin node/output of all floating links that pass through this reroute.
   * @param node The new origin node
   * @param output The new origin output slot
   * @param index The slot index of {@link output}
   */
  setFloatingLinkOrigin(node2, output, index) {
    var _a, _b, _c, _d;
    const network = __privateGet(this, _network).deref();
    const floatingOutLinks = this.getFloatingLinks("output");
    if (!floatingOutLinks) throw new Error("[setFloatingLinkOrigin]: Invalid network.");
    if (!floatingOutLinks.length) return;
    (_a = output._floatingLinks) != null ? _a : output._floatingLinks = /* @__PURE__ */ new Set();
    for (const link of floatingOutLinks) {
      output._floatingLinks.add(link);
      (_d = (_c = (_b = network == null ? void 0 : network.getNodeById(link.origin_id)) == null ? void 0 : _b.outputs[link.origin_slot]) == null ? void 0 : _c._floatingLinks) == null ? void 0 : _d.delete(link);
      link.origin_id = node2.id;
      link.origin_slot = index;
    }
  }
  /** @inheritdoc */
  move(deltaX, deltaY) {
    __privateGet(this, _pos)[0] += deltaX;
    __privateGet(this, _pos)[1] += deltaY;
  }
  /** @inheritdoc */
  snapToGrid(snapTo) {
    if (!snapTo) return false;
    const { pos } = this;
    pos[0] = snapTo * Math.round(pos[0] / snapTo);
    pos[1] = snapTo * Math.round(pos[1] / snapTo);
    return true;
  }
  removeAllFloatingLinks() {
    for (const linkId of this.floatingLinkIds) {
      this.removeFloatingLink(linkId);
    }
  }
  removeFloatingLink(linkId) {
    const network = __privateGet(this, _network).deref();
    if (!network) return;
    const floatingLink = network.floatingLinks.get(linkId);
    if (!floatingLink) {
      console.warn(`[Reroute.removeFloatingLink] Floating link not found: ${linkId}, ignoring and discarding ID.`);
      this.floatingLinkIds.delete(linkId);
      return;
    }
    network.removeFloatingLink(floatingLink);
  }
  /**
   * Removes a link or floating link from this reroute, by matching link object instance equality.
   * @param link The link to remove.
   * @remarks Does not remove the link from the network.
   */
  removeLink(link) {
    const network = __privateGet(this, _network).deref();
    if (!network) return;
    const floatingLink = network.floatingLinks.get(link.id);
    if (link === floatingLink) {
      this.floatingLinkIds.delete(link.id);
    } else {
      this.linkIds.delete(link.id);
    }
  }
  remove() {
    const network = __privateGet(this, _network).deref();
    if (!network) return;
    network.removeReroute(this.id);
  }
  calculateAngle(lastRenderTime, network, linkStart) {
    if (!(lastRenderTime > __privateGet(this, _lastRenderTime))) return;
    __privateSet(this, _lastRenderTime, lastRenderTime);
    const { id, pos: thisPos } = this;
    const angles = [];
    let sum = 0;
    calculateAngles(this.linkIds, network.links);
    calculateAngles(this.floatingLinkIds, network.floatingLinks);
    if (!angles.length) {
      this.cos = 0;
      this.sin = 0;
      this.controlPoint[0] = 0;
      this.controlPoint[1] = 0;
      return;
    }
    sum /= angles.length;
    const originToReroute = Math.atan2(
      __privateGet(this, _pos)[1] - linkStart[1],
      __privateGet(this, _pos)[0] - linkStart[0]
    );
    let diff = (originToReroute - sum) * 0.5;
    if (Math.abs(diff) > Math.PI * 0.5) diff += Math.PI;
    const dist = Math.min(_Reroute.maxSplineOffset, distance(linkStart, __privateGet(this, _pos)) * 0.25);
    const originDiff = originToReroute - diff;
    const cos = Math.cos(originDiff);
    const sin = Math.sin(originDiff);
    this.cos = cos;
    this.sin = sin;
    this.controlPoint[0] = dist * -cos;
    this.controlPoint[1] = dist * -sin;
    function calculateAngles(linkIds, links) {
      for (const linkId of linkIds) {
        const link = links.get(linkId);
        const pos = getNextPos(network, link, id);
        if (!pos) continue;
        const angle = getDirection(thisPos, pos);
        angles.push(angle);
        sum += angle;
      }
    }
  }
  /**
   * Renders the reroute on the canvas.
   * @param ctx Canvas context to draw on
   * @param backgroundPattern The canvas background pattern; used to make floating reroutes appear washed out.
   * @remarks Leaves {@link ctx}.fillStyle, strokeStyle, and lineWidth dirty (perf.).
   */
  draw(ctx, backgroundPattern) {
    var _a;
    const { globalAlpha } = ctx;
    const { pos } = this;
    ctx.beginPath();
    ctx.arc(pos[0], pos[1], _Reroute.radius, 0, 2 * Math.PI);
    if (this.linkIds.size === 0) {
      ctx.fillStyle = backgroundPattern != null ? backgroundPattern : "#797979";
      ctx.fill();
      ctx.globalAlpha = globalAlpha * 0.33;
    }
    ctx.fillStyle = (_a = this._colour) != null ? _a : "#18184d";
    ctx.lineWidth = _Reroute.radius * 0.1;
    ctx.strokeStyle = "rgb(0,0,0,0.5)";
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffffff55";
    ctx.strokeStyle = "rgb(0,0,0,0.3)";
    ctx.beginPath();
    ctx.arc(pos[0], pos[1], _Reroute.radius * 0.8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    if (this.selected) {
      ctx.strokeStyle = "#fff";
      ctx.beginPath();
      ctx.arc(pos[0], pos[1], _Reroute.radius * 1.2, 0, 2 * Math.PI);
      ctx.stroke();
    }
    if (_Reroute.drawIdBadge) {
      const idBadge = new LGraphBadge({ text: this.id.toString() });
      const x2 = pos[0] - idBadge.getWidth(ctx) * 0.5;
      const y = pos[1] - idBadge.height - _Reroute.radius - 2;
      idBadge.draw(ctx, x2, y);
    }
    ctx.globalAlpha = globalAlpha;
  }
  drawHighlight(ctx, colour) {
    const { pos } = this;
    const { strokeStyle, lineWidth } = ctx;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = colour;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(pos[0], pos[1], _Reroute.radius * 1.5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
  }
  /** @inheritdoc */
  asSerialisable() {
    const { id, parentId, pos, linkIds } = this;
    return {
      id,
      parentId,
      pos: [pos[0], pos[1]],
      linkIds: [...linkIds],
      floating: this.floating ? { slotType: this.floating.slotType } : void 0
    };
  }
};
_malloc = new WeakMap();
_network = new WeakMap();
_parentId = new WeakMap();
_pos = new WeakMap();
_lastRenderTime = new WeakMap();
__publicField(_Reroute, "radius", 10);
/** Maximum distance from reroutes to their bezier curve control points. */
__publicField(_Reroute, "maxSplineOffset", 80);
__publicField(_Reroute, "drawIdBadge", false);
var Reroute = _Reroute;
function getNextPos(network, link, id) {
  var _a, _b;
  if (!link) return;
  const linkPos = (_a = LLink.findNextReroute(network, link, id)) == null ? void 0 : _a.pos;
  if (linkPos) return linkPos;
  if (link.target_id === -1 || link.target_slot === -1) return;
  return (_b = network.getNodeById(link.target_id)) == null ? void 0 : _b.getInputPos(link.target_slot);
}
function getDirection(fromPos, toPos) {
  return Math.atan2(toPos[1] - fromPos[1], toPos[0] - fromPos[0]);
}
function getBoundaryNodes(nodes) {
  const valid = nodes == null ? void 0 : nodes.find((x2) => x2);
  if (!valid) return null;
  let top = valid;
  let right = valid;
  let bottom = valid;
  let left = valid;
  for (const node2 of nodes) {
    if (!node2) continue;
    const [x2, y] = node2.pos;
    const [width2, height] = node2.size;
    if (y < top.pos[1]) top = node2;
    if (x2 + width2 > right.pos[0] + right.size[0]) right = node2;
    if (y + height > bottom.pos[1] + bottom.size[1]) bottom = node2;
    if (x2 < left.pos[0]) left = node2;
  }
  return {
    top,
    right,
    bottom,
    left
  };
}
function distributeNodes(nodes, horizontal) {
  const nodeCount = nodes == null ? void 0 : nodes.length;
  if (!(nodeCount > 1)) return;
  const index = horizontal ? 0 : 1;
  let total = 0;
  let highest = -Infinity;
  for (const node2 of nodes) {
    total += node2.size[index];
    const high = node2.pos[index] + node2.size[index];
    if (high > highest) highest = high;
  }
  const sorted = [...nodes].sort((a, b) => a.pos[index] - b.pos[index]);
  const lowest = sorted[0].pos[index];
  const gap = (highest - lowest - total) / (nodeCount - 1);
  let startAt = lowest;
  for (let i = 0; i < nodeCount; i++) {
    const node2 = sorted[i];
    node2.pos[index] = startAt + gap * i;
    startAt += node2.size[index];
  }
}
function alignNodes(nodes, direction, align_to) {
  if (!nodes) return;
  const boundary = align_to === void 0 ? getBoundaryNodes(nodes) : { top: align_to, right: align_to, bottom: align_to, left: align_to };
  if (boundary === null) return;
  for (const node2 of nodes) {
    switch (direction) {
      case "right":
        node2.pos[0] = boundary.right.pos[0] + boundary.right.size[0] - node2.size[0];
        break;
      case "left":
        node2.pos[0] = boundary.left.pos[0];
        break;
      case "top":
        node2.pos[1] = boundary.top.pos[1];
        break;
      case "bottom":
        node2.pos[1] = boundary.bottom.pos[1] + boundary.bottom.size[1] - node2.size[1];
        break;
    }
  }
}
var _temp, _temp_vec2, _tmp_area, _margin_area, _link_bounding, _lTempA, _lTempB, _lTempC, _LGraphCanvas_instances, updateCursorStyle_fn, _maximumFrameGap, _visible_node_ids, _snapToGrid, _shiftDown, _dragZoomStart, validateCanvas_fn, dirty_fn, processPrimaryButton_fn, processNodeClick_fn, processWidgetClick_fn, processMiddleButton_fn, processDragZoom_fn, startDraggingItems_fn, processDraggedItems_fn, handleMultiSelect_fn, getLinkCentreOnPos_fn, getHighlightPosition_fn, renderSnapHighlight_fn, renderFloatingLinks_fn, renderAllLinkSegments_fn, addSplineOffset_fn;
var _LGraphCanvas = class _LGraphCanvas {
  /**
   * Creates a new instance of LGraphCanvas.
   * @param canvas The canvas HTML element (or its id) to use, or null / undefined to leave blank.
   * @param graph The graph that owns this canvas.
   * @param options
   */
  constructor(canvas2, graph, options2) {
    __privateAdd(this, _LGraphCanvas_instances);
    /**
     * The state of this canvas, e.g. whether it is being dragged, or read-only.
     *
     * Implemented as a POCO that can be proxied without side-effects.
     */
    __publicField(this, "state", {
      draggingItems: false,
      draggingCanvas: false,
      readOnly: false,
      hoveringOver: CanvasItem.Nothing,
      shouldSetCursor: true
    });
    // Whether the canvas was previously being dragged prior to pressing space key.
    // null if space key is not pressed.
    __publicField(this, "_previously_dragging_canvas", null);
    __privateAdd(this, _maximumFrameGap, 0);
    __publicField(this, "options");
    __publicField(this, "background_image");
    __publicField(this, "ds");
    __publicField(this, "pointer");
    __publicField(this, "zoom_modify_alpha");
    __publicField(this, "zoom_speed");
    __publicField(this, "node_title_color");
    __publicField(this, "default_link_color");
    __publicField(this, "default_connection_color");
    __publicField(this, "default_connection_color_byType");
    __publicField(this, "default_connection_color_byTypeOff");
    __publicField(this, "highquality_render");
    __publicField(this, "use_gradients");
    __publicField(this, "editor_alpha");
    __publicField(this, "pause_rendering");
    __publicField(this, "clear_background");
    __publicField(this, "clear_background_color");
    __publicField(this, "render_only_selected");
    __publicField(this, "show_info");
    __publicField(this, "allow_dragcanvas");
    __publicField(this, "allow_dragnodes");
    __publicField(this, "allow_interaction");
    __publicField(this, "multi_select");
    __publicField(this, "allow_searchbox");
    __publicField(this, "allow_reconnect_links");
    __publicField(this, "align_to_grid");
    __publicField(this, "drag_mode");
    __publicField(this, "dragging_rectangle");
    __publicField(this, "filter");
    __publicField(this, "set_canvas_dirty_on_mouse_event");
    __publicField(this, "always_render_background");
    __publicField(this, "render_shadows");
    __publicField(this, "render_canvas_border");
    __publicField(this, "render_connections_shadows");
    __publicField(this, "render_connections_border");
    __publicField(this, "render_curved_connections");
    __publicField(this, "render_connection_arrows");
    __publicField(this, "render_collapsed_slots");
    __publicField(this, "render_execution_order");
    __publicField(this, "render_link_tooltip");
    /** Shape of the markers shown at the midpoint of links.  Default: Circle */
    __publicField(this, "linkMarkerShape", LinkMarkerShape.Circle);
    __publicField(this, "links_render_mode");
    /** Zoom threshold for low quality rendering. Zoom below this threshold will render low quality. */
    __publicField(this, "low_quality_zoom_threshold", 0.6);
    /** mouse in canvas coordinates, where 0,0 is the top-left corner of the blue rectangle */
    __publicField(this, "mouse");
    /** mouse in graph coordinates, where 0,0 is the top-left corner of the blue rectangle */
    __publicField(this, "graph_mouse");
    /** @deprecated LEGACY: REMOVE THIS, USE {@link graph_mouse} INSTEAD */
    __publicField(this, "canvas_mouse");
    /** to personalize the search box */
    __publicField(this, "onSearchBox");
    __publicField(this, "onSearchBoxSelection");
    __publicField(this, "onMouse");
    /** to render background objects (behind nodes and connections) in the canvas affected by transform */
    __publicField(this, "onDrawBackground");
    /** to render foreground objects (above nodes and connections) in the canvas affected by transform */
    __publicField(this, "onDrawForeground");
    __publicField(this, "connections_width");
    /** The current node being drawn by {@link drawNode}.  This should NOT be used to determine the currently selected node.  See {@link selectedItems} */
    __publicField(this, "current_node");
    /** used for widgets */
    __publicField(this, "node_widget");
    /** The link to draw a tooltip for. */
    __publicField(this, "over_link_center");
    __publicField(this, "last_mouse_position");
    /** The visible area of this canvas.  Tightly coupled with {@link ds}. */
    __publicField(this, "visible_area");
    /** Contains all links and reroutes that were rendered.  Repopulated every render cycle. */
    __publicField(this, "renderedPaths", /* @__PURE__ */ new Set());
    /** @deprecated Replaced by {@link renderedPaths}, but length is set to 0 by some extensions. */
    __publicField(this, "visible_links", []);
    /** @deprecated This array is populated and cleared to support legacy extensions. The contents are ignored by Litegraph. */
    __publicField(this, "connecting_links");
    __publicField(this, "linkConnector", new LinkConnector((links) => this.connecting_links = links));
    /** The viewport of this canvas.  Tightly coupled with {@link ds}. */
    __publicField(this, "viewport");
    __publicField(this, "autoresize");
    __publicField(this, "frame", 0);
    __publicField(this, "last_draw_time", 0);
    __publicField(this, "render_time", 0);
    __publicField(this, "fps", 0);
    /** @deprecated See {@link LGraphCanvas.selectedItems} */
    __publicField(this, "selected_nodes", {});
    /** All selected nodes, groups, and reroutes */
    __publicField(this, "selectedItems", /* @__PURE__ */ new Set());
    /** The group currently being resized. */
    __publicField(this, "resizingGroup", null);
    /** @deprecated See {@link LGraphCanvas.selectedItems} */
    __publicField(this, "selected_group", null);
    /** The nodes that are currently visible on the canvas. */
    __publicField(this, "visible_nodes", []);
    /**
     * The IDs of the nodes that are currently visible on the canvas. More
     * performant than {@link visible_nodes} for visibility checks.
     */
    __privateAdd(this, _visible_node_ids, /* @__PURE__ */ new Set());
    __publicField(this, "node_over");
    __publicField(this, "node_capturing_input");
    __publicField(this, "highlighted_links", {});
    __publicField(this, "dirty_canvas", true);
    __publicField(this, "dirty_bgcanvas", true);
    /** A map of nodes that require selective-redraw */
    __publicField(this, "dirty_nodes", /* @__PURE__ */ new Map());
    __publicField(this, "dirty_area");
    /** @deprecated Unused */
    __publicField(this, "node_in_panel");
    __publicField(this, "last_mouse", [0, 0]);
    __publicField(this, "last_mouseclick", 0);
    __publicField(this, "graph");
    __publicField(this, "canvas");
    __publicField(this, "bgcanvas");
    __publicField(this, "ctx");
    __publicField(this, "_events_binded");
    __publicField(this, "bgctx");
    __publicField(this, "is_rendering");
    /** @deprecated Panels */
    __publicField(this, "block_click");
    /** @deprecated Panels */
    __publicField(this, "last_click_position");
    __publicField(this, "resizing_node");
    /** @deprecated See {@link LGraphCanvas.resizingGroup} */
    __publicField(this, "selected_group_resizing");
    /** @deprecated See {@link pointer}.{@link CanvasPointer.dragStarted dragStarted} */
    __publicField(this, "last_mouse_dragging");
    __publicField(this, "onMouseDown");
    __publicField(this, "_highlight_pos");
    __publicField(this, "_highlight_input");
    // TODO: Check if panels are used
    /** @deprecated Panels */
    __publicField(this, "node_panel");
    /** @deprecated Panels */
    __publicField(this, "options_panel");
    __publicField(this, "_bg_img");
    __publicField(this, "_pattern");
    __publicField(this, "_pattern_img");
    // TODO: This looks like another panel thing
    __publicField(this, "prompt_box");
    __publicField(this, "search_box");
    /** @deprecated Panels */
    __publicField(this, "SELECTED_NODE");
    /** @deprecated Panels */
    __publicField(this, "NODEPANEL_IS_OPEN");
    /** Once per frame check of snap to grid value.  @todo Update on change. */
    __privateAdd(this, _snapToGrid);
    /** Set on keydown, keyup. @todo */
    __privateAdd(this, _shiftDown, false);
    /** If true, enable drag zoom. Ctrl+Shift+Drag Up/Down: zoom canvas. */
    __publicField(this, "dragZoomEnabled", false);
    /** The start position of the drag zoom. */
    __privateAdd(this, _dragZoomStart, null);
    __publicField(this, "onClear");
    /** called after moving a node @deprecated Does not handle multi-node move, and can return the wrong node. */
    __publicField(this, "onNodeMoved");
    /** called if the selection changes */
    __publicField(this, "onSelectionChange");
    /** called when rendering a tooltip */
    __publicField(this, "onDrawLinkTooltip");
    /** to render foreground objects not affected by transform (for GUIs) */
    __publicField(this, "onDrawOverlay");
    __publicField(this, "onRenderBackground");
    __publicField(this, "onNodeDblClicked");
    __publicField(this, "onShowNodePanel");
    __publicField(this, "onNodeSelected");
    __publicField(this, "onNodeDeselected");
    __publicField(this, "onRender");
    /** Implement this function to allow conversion of widget types to input types, e.g. number -> INT or FLOAT for widget link validation checks */
    __publicField(this, "getWidgetLinkType");
    options2 || (options2 = {});
    this.options = options2;
    this.background_image = _LGraphCanvas.DEFAULT_BACKGROUND_IMAGE;
    this.ds = new DragAndScale(canvas2);
    this.pointer = new CanvasPointer(canvas2);
    this.linkConnector.events.addEventListener("reset", () => {
      this.connecting_links = null;
    });
    this.linkConnector.events.addEventListener("dropped-on-canvas", (customEvent) => {
      var _a;
      if (!this.connecting_links) return;
      const e2 = customEvent.detail;
      this.emitEvent({
        subType: "empty-release",
        originalEvent: e2,
        linkReleaseContext: { links: this.connecting_links }
      });
      const firstLink = this.linkConnector.renderLinks[0];
      if (LiteGraph.release_link_on_empty_shows_menu) {
        const linkReleaseContext = this.linkConnector.state.connectingTo === "input" ? {
          node_from: firstLink.node,
          slot_from: firstLink.fromSlot,
          type_filter_in: firstLink.fromSlot.type
        } : {
          node_to: firstLink.node,
          slot_from: firstLink.fromSlot,
          type_filter_out: firstLink.fromSlot.type
        };
        const afterRerouteId = (_a = firstLink.fromReroute) == null ? void 0 : _a.id;
        if ("shiftKey" in e2 && e2.shiftKey) {
          if (this.allow_searchbox) {
            this.showSearchBox(e2, linkReleaseContext);
          }
        } else if (this.linkConnector.state.connectingTo === "input") {
          this.showConnectionMenu({ nodeFrom: firstLink.node, slotFrom: firstLink.fromSlot, e: e2, afterRerouteId });
        } else {
          this.showConnectionMenu({ nodeTo: firstLink.node, slotTo: firstLink.fromSlot, e: e2, afterRerouteId });
        }
      }
    });
    this.zoom_modify_alpha = true;
    this.zoom_speed = 1.1;
    this.node_title_color = LiteGraph.NODE_TITLE_COLOR;
    this.default_link_color = LiteGraph.LINK_COLOR;
    this.default_connection_color = {
      input_off: "#778",
      input_on: "#7F7",
      output_off: "#778",
      output_on: "#7F7"
    };
    this.default_connection_color_byType = {
      /* number: "#7F7",
            string: "#77F",
            boolean: "#F77", */
    };
    this.default_connection_color_byTypeOff = {
      /* number: "#474",
            string: "#447",
            boolean: "#744", */
    };
    this.highquality_render = true;
    this.use_gradients = false;
    this.editor_alpha = 1;
    this.pause_rendering = false;
    this.clear_background = true;
    this.clear_background_color = "#222";
    this.render_only_selected = true;
    this.show_info = true;
    this.allow_dragcanvas = true;
    this.allow_dragnodes = true;
    this.allow_interaction = true;
    this.multi_select = false;
    this.allow_searchbox = true;
    this.allow_reconnect_links = true;
    this.align_to_grid = false;
    this.drag_mode = false;
    this.dragging_rectangle = null;
    this.filter = null;
    this.set_canvas_dirty_on_mouse_event = true;
    this.always_render_background = false;
    this.render_shadows = true;
    this.render_canvas_border = true;
    this.render_connections_shadows = false;
    this.render_connections_border = true;
    this.render_curved_connections = false;
    this.render_connection_arrows = false;
    this.render_collapsed_slots = true;
    this.render_execution_order = false;
    this.render_link_tooltip = true;
    this.links_render_mode = LinkRenderType.SPLINE_LINK;
    this.mouse = [0, 0];
    this.graph_mouse = [0, 0];
    this.canvas_mouse = this.graph_mouse;
    this.connections_width = 3;
    this.current_node = null;
    this.node_widget = null;
    this.last_mouse_position = [0, 0];
    this.visible_area = this.ds.visible_area;
    this.connecting_links = null;
    this.viewport = options2.viewport || null;
    this.graph = graph;
    graph == null ? void 0 : graph.attachCanvas(this);
    this.canvas = void 0;
    this.bgcanvas = void 0;
    this.ctx = void 0;
    this.setCanvas(canvas2, options2.skip_events);
    this.clear();
    if (!options2.skip_render) {
      this.startRendering();
    }
    this.autoresize = options2.autoresize;
  }
  // #region Legacy accessors
  /** @deprecated @inheritdoc {@link LGraphCanvasState.readOnly} */
  get read_only() {
    return this.state.readOnly;
  }
  set read_only(value) {
    this.state.readOnly = value;
    __privateMethod(this, _LGraphCanvas_instances, updateCursorStyle_fn).call(this);
  }
  get isDragging() {
    return this.state.draggingItems;
  }
  set isDragging(value) {
    this.state.draggingItems = value;
  }
  get hoveringOver() {
    return this.state.hoveringOver;
  }
  set hoveringOver(value) {
    this.state.hoveringOver = value;
    __privateMethod(this, _LGraphCanvas_instances, updateCursorStyle_fn).call(this);
  }
  /** @deprecated Replace all references with {@link pointer}.{@link CanvasPointer.isDown isDown}. */
  get pointer_is_down() {
    return this.pointer.isDown;
  }
  /** @deprecated Replace all references with {@link pointer}.{@link CanvasPointer.isDouble isDouble}. */
  get pointer_is_double() {
    return this.pointer.isDouble;
  }
  /** @deprecated @inheritdoc {@link LGraphCanvasState.draggingCanvas} */
  get dragging_canvas() {
    return this.state.draggingCanvas;
  }
  set dragging_canvas(value) {
    this.state.draggingCanvas = value;
    __privateMethod(this, _LGraphCanvas_instances, updateCursorStyle_fn).call(this);
  }
  // #endregion Legacy accessors
  /**
   * @deprecated Use {@link LGraphNode.titleFontStyle} instead.
   */
  get title_text_font() {
    return `${LiteGraph.NODE_TEXT_SIZE}px Arial`;
  }
  get inner_text_font() {
    return `normal ${LiteGraph.NODE_SUBTEXT_SIZE}px Arial`;
  }
  /** Maximum frames per second to render. 0: unlimited. Default: 0 */
  get maximumFps() {
    return __privateGet(this, _maximumFrameGap) > Number.EPSILON ? __privateGet(this, _maximumFrameGap) / 1e3 : 0;
  }
  set maximumFps(value) {
    __privateSet(this, _maximumFrameGap, value > Number.EPSILON ? 1e3 / value : 0);
  }
  /**
   * @deprecated Use {@link LiteGraphGlobal.ROUND_RADIUS} instead.
   */
  get round_radius() {
    return LiteGraph.ROUND_RADIUS;
  }
  /**
   * @deprecated Use {@link LiteGraphGlobal.ROUND_RADIUS} instead.
   */
  set round_radius(value) {
    LiteGraph.ROUND_RADIUS = value;
  }
  /**
   * Render low quality when zoomed out.
   */
  get low_quality() {
    return this.ds.scale < this.low_quality_zoom_threshold;
  }
  static onGroupAdd(info, entry, mouse_event) {
    const canvas2 = _LGraphCanvas.active_canvas;
    const group = new LiteGraph.LGraphGroup();
    group.pos = canvas2.convertEventToCanvasOffset(mouse_event);
    if (!canvas2.graph) throw new NullGraphError();
    canvas2.graph.add(group);
  }
  /**
   * @deprecated Functionality moved to {@link getBoundaryNodes}.  The new function returns null on failure, instead of an object with all null properties.
   * Determines the furthest nodes in each direction
   * @param nodes the nodes to from which boundary nodes will be extracted
   * @returns
   */
  static getBoundaryNodes(nodes) {
    var _a;
    const _nodes = Array.isArray(nodes) ? nodes : Object.values(nodes);
    return (_a = getBoundaryNodes(_nodes)) != null ? _a : {
      top: null,
      right: null,
      bottom: null,
      left: null
    };
  }
  /**
   * @deprecated Functionality moved to {@link alignNodes}.  The new function does not set dirty canvas.
   * @param nodes a list of nodes
   * @param direction Direction to align the nodes
   * @param align_to Node to align to (if null, align to the furthest node in the given direction)
   */
  static alignNodes(nodes, direction, align_to) {
    alignNodes(Object.values(nodes), direction, align_to);
    _LGraphCanvas.active_canvas.setDirty(true, true);
  }
  static onNodeAlign(value, options2, event, prev_menu, node2) {
    new LiteGraph.ContextMenu(["Top", "Bottom", "Left", "Right"], {
      event,
      callback: inner_clicked,
      parentMenu: prev_menu
    });
    function inner_clicked(value2) {
      alignNodes(
        Object.values(_LGraphCanvas.active_canvas.selected_nodes),
        value2.toLowerCase(),
        node2
      );
      _LGraphCanvas.active_canvas.setDirty(true, true);
    }
  }
  static onGroupAlign(value, options2, event, prev_menu) {
    new LiteGraph.ContextMenu(["Top", "Bottom", "Left", "Right"], {
      event,
      callback: inner_clicked,
      parentMenu: prev_menu
    });
    function inner_clicked(value2) {
      alignNodes(
        Object.values(_LGraphCanvas.active_canvas.selected_nodes),
        value2.toLowerCase()
      );
      _LGraphCanvas.active_canvas.setDirty(true, true);
    }
  }
  static createDistributeMenu(value, options2, event, prev_menu) {
    new LiteGraph.ContextMenu(["Vertically", "Horizontally"], {
      event,
      callback: inner_clicked,
      parentMenu: prev_menu
    });
    function inner_clicked(value2) {
      const canvas2 = _LGraphCanvas.active_canvas;
      distributeNodes(Object.values(canvas2.selected_nodes), value2 === "Horizontally");
      canvas2.setDirty(true, true);
    }
  }
  static onMenuAdd(value, options2, e2, prev_menu, callback) {
    const canvas2 = _LGraphCanvas.active_canvas;
    const ref_window = canvas2.getCanvasWindow();
    const { graph } = canvas2;
    if (!graph) return;
    inner_onMenuAdded("", prev_menu);
    return false;
    function inner_onMenuAdded(base_category, prev_menu2) {
      if (!graph) return;
      const categories = LiteGraph.getNodeTypesCategories(canvas2.filter || graph.filter).filter((category) => category.startsWith(base_category));
      const entries = [];
      for (const category of categories) {
        if (!category) continue;
        const base_category_regex = new RegExp(`^(${base_category})`);
        const category_name = category.replace(base_category_regex, "").split("/", 1)[0];
        const category_path = base_category === "" ? `${category_name}/` : `${base_category}${category_name}/`;
        let name = category_name;
        if (name.includes("::")) name = name.split("::", 2)[1];
        const index = entries.findIndex((entry) => entry.value === category_path);
        if (index === -1) {
          entries.push({
            value: category_path,
            content: name,
            has_submenu: true,
            callback: function(value2, event, mouseEvent, contextMenu) {
              inner_onMenuAdded(value2.value, contextMenu);
            }
          });
        }
      }
      const nodes = LiteGraph.getNodeTypesInCategory(
        base_category.slice(0, -1),
        canvas2.filter || graph.filter
      );
      for (const node2 of nodes) {
        if (node2.skip_list) continue;
        const entry = {
          value: node2.type,
          content: node2.title,
          has_submenu: false,
          callback: function(value2, event, mouseEvent, contextMenu) {
            if (!canvas2.graph) throw new NullGraphError();
            const first_event = contextMenu.getFirstEvent();
            canvas2.graph.beforeChange();
            const node22 = LiteGraph.createNode(value2.value);
            if (node22) {
              if (!first_event) throw new TypeError("Context menu event was null. This should not occure in normal usage.");
              node22.pos = canvas2.convertEventToCanvasOffset(first_event);
              canvas2.graph.add(node22);
            }
            callback == null ? void 0 : callback(node22);
            canvas2.graph.afterChange();
          }
        };
        entries.push(entry);
      }
      new LiteGraph.ContextMenu(entries, { event: e2, parentMenu: prev_menu2 }, ref_window);
    }
  }
  static onMenuCollapseAll() {
  }
  static onMenuNodeEdit() {
  }
  /** @param _options Parameter is never used */
  static showMenuNodeOptionalOutputs(v2, _options, e2, prev_menu, node2) {
    var _a;
    if (!node2) return;
    const canvas2 = _LGraphCanvas.active_canvas;
    let entries = [];
    if (LiteGraph.do_add_triggers_slots && node2.findOutputSlot("onExecuted") == -1) {
      entries.push({ content: "On Executed", value: ["onExecuted", LiteGraph.EVENT, { nameLocked: true }], className: "event" });
    }
    const retEntries = (_a = node2.onMenuNodeOutputs) == null ? void 0 : _a.call(node2, entries);
    if (retEntries) entries = retEntries;
    if (!entries.length) return;
    new LiteGraph.ContextMenu(
      entries,
      {
        event: e2,
        callback: inner_clicked,
        parentMenu: prev_menu,
        node: node2
      }
    );
    function inner_clicked(v22, e22, prev) {
      var _a2;
      if (!node2) return;
      if (v22.callback) v22.callback.call(this, node2, v22, e22, prev);
      if (!v22.value) return;
      const value = v22.value[1];
      if (value && (typeof value === "object" || Array.isArray(value))) {
        const entries2 = [];
        for (const i in value) {
          entries2.push({ content: i, value: value[i] });
        }
        new LiteGraph.ContextMenu(entries2, {
          event: e22,
          callback: inner_clicked,
          parentMenu: prev_menu,
          node: node2
        });
        return false;
      }
      const { graph } = node2;
      if (!graph) throw new NullGraphError();
      graph.beforeChange();
      node2.addOutput(v22.value[0], v22.value[1], v22.value[2]);
      (_a2 = node2.onNodeOutputAdd) == null ? void 0 : _a2.call(node2, v22.value);
      canvas2.setDirty(true, true);
      graph.afterChange();
    }
    return false;
  }
  /** @param value Parameter is never used */
  static onShowMenuNodeProperties(value, options2, e2, prev_menu, node2) {
    if (!node2 || !node2.properties) return;
    const canvas2 = _LGraphCanvas.active_canvas;
    const ref_window = canvas2.getCanvasWindow();
    const entries = [];
    for (const i in node2.properties) {
      value = node2.properties[i] !== void 0 ? node2.properties[i] : " ";
      if (typeof value == "object")
        value = JSON.stringify(value);
      const info = node2.getPropertyInfo(i);
      if (info.type == "enum" || info.type == "combo")
        value = _LGraphCanvas.getPropertyPrintableValue(value, info.values);
      value = _LGraphCanvas.decodeHTML(stringOrEmpty(value));
      entries.push({
        content: `<span class='property_name'>${info.label || i}</span><span class='property_value'>${value}</span>`,
        value: i
      });
    }
    if (!entries.length) {
      return;
    }
    new LiteGraph.ContextMenu(
      entries,
      {
        event: e2,
        callback: inner_clicked,
        parentMenu: prev_menu,
        allow_html: true,
        node: node2
      },
      // @ts-expect-error Unused
      ref_window
    );
    function inner_clicked(v2) {
      if (!node2) return;
      const rect = this.getBoundingClientRect();
      canvas2.showEditPropertyValue(node2, v2.value, {
        position: [rect.left, rect.top]
      });
    }
    return false;
  }
  /** @deprecated */
  static decodeHTML(str) {
    const e2 = document.createElement("div");
    e2.textContent = str;
    return e2.innerHTML;
  }
  static onMenuResizeNode(value, options2, e2, menu, node2) {
    if (!node2) return;
    const fApplyMultiNode = function(node22) {
      node22.setSize(node22.computeSize());
    };
    const canvas2 = _LGraphCanvas.active_canvas;
    if (!canvas2.selected_nodes || Object.keys(canvas2.selected_nodes).length <= 1) {
      fApplyMultiNode(node2);
    } else {
      for (const i in canvas2.selected_nodes) {
        fApplyMultiNode(canvas2.selected_nodes[i]);
      }
    }
    canvas2.setDirty(true, true);
  }
  // TODO refactor :: this is used fot title but not for properties!
  static onShowPropertyEditor(item, options2, e2, menu, node2) {
    const property = item.property || "title";
    const value = node2[property];
    const title = document.createElement("span");
    title.className = "name";
    title.textContent = property;
    const input = document.createElement("input");
    Object.assign(input, { type: "text", className: "value", autofocus: true });
    const button = document.createElement("button");
    button.textContent = "OK";
    const dialog = Object.assign(document.createElement("div"), {
      is_modified: false,
      className: "graphdialog",
      close: () => dialog.remove()
    });
    dialog.append(title, input, button);
    input.value = String(value);
    input.addEventListener("blur", function() {
      this.focus();
    });
    input.addEventListener("keydown", (e22) => {
      dialog.is_modified = true;
      if (e22.key == "Escape") {
        dialog.close();
      } else if (e22.key == "Enter") {
        inner();
      } else if (!e22.target || !("localName" in e22.target) || e22.target.localName != "textarea") {
        return;
      }
      e22.preventDefault();
      e22.stopPropagation();
    });
    const canvas2 = _LGraphCanvas.active_canvas;
    const canvasEl = canvas2.canvas;
    const rect = canvasEl.getBoundingClientRect();
    const offsetx = rect ? -20 - rect.left : -20;
    const offsety = rect ? -20 - rect.top : -20;
    if (e2) {
      dialog.style.left = `${e2.clientX + offsetx}px`;
      dialog.style.top = `${e2.clientY + offsety}px`;
    } else {
      dialog.style.left = `${canvasEl.width * 0.5 + offsetx}px`;
      dialog.style.top = `${canvasEl.height * 0.5 + offsety}px`;
    }
    button.addEventListener("click", inner);
    if (canvasEl.parentNode == null) throw new TypeError("canvasEl.parentNode was null");
    canvasEl.parentNode.append(dialog);
    input.focus();
    let dialogCloseTimer;
    dialog.addEventListener("mouseleave", function() {
      if (LiteGraph.dialog_close_on_mouse_leave) {
        if (!dialog.is_modified && LiteGraph.dialog_close_on_mouse_leave) {
          dialogCloseTimer = setTimeout(
            dialog.close,
            LiteGraph.dialog_close_on_mouse_leave_delay
          );
        }
      }
    });
    dialog.addEventListener("mouseenter", function() {
      if (LiteGraph.dialog_close_on_mouse_leave) {
        if (dialogCloseTimer) clearTimeout(dialogCloseTimer);
      }
    });
    function inner() {
      if (input) setValue(input.value);
    }
    function setValue(value2) {
      if (item.type == "Number") {
        value2 = Number(value2);
      } else if (item.type == "Boolean") {
        value2 = Boolean(value2);
      }
      node2[property] = value2;
      dialog.remove();
      canvas2.setDirty(true, true);
    }
  }
  static getPropertyPrintableValue(value, values) {
    if (!values) return String(value);
    if (Array.isArray(values)) {
      return String(value);
    }
    if (typeof values === "object") {
      let desc_value = "";
      for (const k in values) {
        if (values[k] != value) continue;
        desc_value = k;
        break;
      }
      return `${String(value)} (${desc_value})`;
    }
  }
  static onMenuNodeCollapse(value, options2, e2, menu, node2) {
    if (!node2.graph) throw new NullGraphError();
    node2.graph.beforeChange();
    const fApplyMultiNode = function(node22) {
      node22.collapse();
    };
    const graphcanvas = _LGraphCanvas.active_canvas;
    if (!graphcanvas.selected_nodes || Object.keys(graphcanvas.selected_nodes).length <= 1) {
      fApplyMultiNode(node2);
    } else {
      for (const i in graphcanvas.selected_nodes) {
        fApplyMultiNode(graphcanvas.selected_nodes[i]);
      }
    }
    node2.graph.afterChange();
  }
  static onMenuToggleAdvanced(value, options2, e2, menu, node2) {
    if (!node2.graph) throw new NullGraphError();
    node2.graph.beforeChange();
    const fApplyMultiNode = function(node22) {
      node22.toggleAdvanced();
    };
    const graphcanvas = _LGraphCanvas.active_canvas;
    if (!graphcanvas.selected_nodes || Object.keys(graphcanvas.selected_nodes).length <= 1) {
      fApplyMultiNode(node2);
    } else {
      for (const i in graphcanvas.selected_nodes) {
        fApplyMultiNode(graphcanvas.selected_nodes[i]);
      }
    }
    node2.graph.afterChange();
  }
  static onMenuNodeMode(value, options2, e2, menu, node2) {
    new LiteGraph.ContextMenu(
      LiteGraph.NODE_MODES,
      { event: e2, callback: inner_clicked, parentMenu: menu, node: node2 }
    );
    function inner_clicked(v2) {
      if (!node2) return;
      const kV = Object.values(LiteGraph.NODE_MODES).indexOf(v2);
      const fApplyMultiNode = function(node22) {
        if (kV !== -1 && LiteGraph.NODE_MODES[kV]) {
          node22.changeMode(kV);
        } else {
          console.warn(`unexpected mode: ${v2}`);
          node22.changeMode(LGraphEventMode.ALWAYS);
        }
      };
      const graphcanvas = _LGraphCanvas.active_canvas;
      if (!graphcanvas.selected_nodes || Object.keys(graphcanvas.selected_nodes).length <= 1) {
        fApplyMultiNode(node2);
      } else {
        for (const i in graphcanvas.selected_nodes) {
          fApplyMultiNode(graphcanvas.selected_nodes[i]);
        }
      }
    }
    return false;
  }
  /** @param value Parameter is never used */
  static onMenuNodeColors(value, options2, e2, menu, node2) {
    if (!node2) throw "no node for color";
    const values = [];
    values.push({
      value: null,
      content: "<span style='display: block; padding-left: 4px;'>No color</span>"
    });
    for (const i in _LGraphCanvas.node_colors) {
      const color = _LGraphCanvas.node_colors[i];
      value = {
        value: i,
        content: `<span style='display: block; color: #999; padding-left: 4px; border-left: 8px solid ${color.color}; background-color:${color.bgcolor}'>${i}</span>`
      };
      values.push(value);
    }
    new LiteGraph.ContextMenu(values, {
      event: e2,
      callback: inner_clicked,
      parentMenu: menu,
      node: node2
    });
    function inner_clicked(v2) {
      if (!node2) return;
      const fApplyColor = function(item) {
        const colorOption = v2.value ? _LGraphCanvas.node_colors[v2.value] : null;
        item.setColorOption(colorOption);
      };
      const canvas2 = _LGraphCanvas.active_canvas;
      if (!canvas2.selected_nodes || Object.keys(canvas2.selected_nodes).length <= 1) {
        fApplyColor(node2);
      } else {
        for (const i in canvas2.selected_nodes) {
          fApplyColor(canvas2.selected_nodes[i]);
        }
      }
      canvas2.setDirty(true, true);
    }
    return false;
  }
  static onMenuNodeShapes(value, options2, e2, menu, node2) {
    if (!node2) throw "no node passed";
    new LiteGraph.ContextMenu(LiteGraph.VALID_SHAPES, {
      event: e2,
      callback: inner_clicked,
      parentMenu: menu,
      node: node2
    });
    function inner_clicked(v2) {
      if (!node2) return;
      if (!node2.graph) throw new NullGraphError();
      node2.graph.beforeChange();
      const fApplyMultiNode = function(node22) {
        node22.shape = v2;
      };
      const canvas2 = _LGraphCanvas.active_canvas;
      if (!canvas2.selected_nodes || Object.keys(canvas2.selected_nodes).length <= 1) {
        fApplyMultiNode(node2);
      } else {
        for (const i in canvas2.selected_nodes) {
          fApplyMultiNode(canvas2.selected_nodes[i]);
        }
      }
      node2.graph.afterChange();
      canvas2.setDirty(true);
    }
    return false;
  }
  static onMenuNodeRemove() {
    _LGraphCanvas.active_canvas.deleteSelected();
  }
  static onMenuNodeClone(value, options2, e2, menu, node2) {
    const { graph } = node2;
    if (!graph) throw new NullGraphError();
    graph.beforeChange();
    const newSelected = /* @__PURE__ */ new Set();
    const fApplyMultiNode = function(node22, newNodes) {
      if (node22.clonable === false) return;
      const newnode = node22.clone();
      if (!newnode) return;
      newnode.pos = [node22.pos[0] + 5, node22.pos[1] + 5];
      if (!node22.graph) throw new NullGraphError();
      node22.graph.add(newnode);
      newNodes.add(newnode);
    };
    const canvas2 = _LGraphCanvas.active_canvas;
    if (!canvas2.selected_nodes || Object.keys(canvas2.selected_nodes).length <= 1) {
      fApplyMultiNode(node2, newSelected);
    } else {
      for (const i in canvas2.selected_nodes) {
        fApplyMultiNode(canvas2.selected_nodes[i], newSelected);
      }
    }
    if (newSelected.size) {
      canvas2.selectNodes([...newSelected]);
    }
    graph.afterChange();
    canvas2.setDirty(true, true);
  }
  /**
   * clears all the data inside
   *
   */
  clear() {
    var _a, _b;
    this.frame = 0;
    this.last_draw_time = 0;
    this.render_time = 0;
    this.fps = 0;
    this.dragging_rectangle = null;
    this.selected_nodes = {};
    this.selected_group = null;
    this.selectedItems.clear();
    (_a = this.onSelectionChange) == null ? void 0 : _a.call(this, this.selected_nodes);
    this.visible_nodes = [];
    this.node_over = void 0;
    this.node_capturing_input = null;
    this.connecting_links = null;
    this.highlighted_links = {};
    this.dragging_canvas = false;
    __privateMethod(this, _LGraphCanvas_instances, dirty_fn).call(this);
    this.dirty_area = null;
    this.node_in_panel = null;
    this.node_widget = null;
    this.last_mouse = [0, 0];
    this.last_mouseclick = 0;
    this.pointer.reset();
    this.visible_area.set([0, 0, 0, 0]);
    (_b = this.onClear) == null ? void 0 : _b.call(this);
  }
  /**
   * assigns a graph, you can reassign graphs to the same canvas
   * @param graph
   */
  setGraph(graph, skip_clear) {
    if (this.graph == graph) return;
    if (!skip_clear) this.clear();
    if (!graph && this.graph) {
      this.graph.detachCanvas(this);
      return;
    }
    graph.attachCanvas(this);
    this.setDirty(true, true);
  }
  /**
   * @returns the visually active graph (in case there are more in the stack)
   */
  getCurrentGraph() {
    return this.graph;
  }
  /**
   * Sets the current HTML canvas element.
   * Calls bindEvents to add input event listeners, and (re)creates the background canvas.
   * @param canvas The canvas element to assign, or its HTML element ID.  If null or undefined, the current reference is cleared.
   * @param skip_events If true, events on the previous canvas will not be removed.  Has no effect on the first invocation.
   */
  setCanvas(canvas2, skip_events) {
    var _a;
    const element = __privateMethod(this, _LGraphCanvas_instances, validateCanvas_fn).call(this, canvas2);
    if (element === this.canvas) return;
    if (!element && this.canvas && !skip_events) this.unbindEvents();
    this.canvas = element;
    this.ds.element = element;
    this.pointer.element = element;
    if (!element) return;
    element.className += " lgraphcanvas";
    element.data = this;
    this.bgcanvas = document.createElement("canvas");
    this.bgcanvas.width = this.canvas.width;
    this.bgcanvas.height = this.canvas.height;
    const ctx = (_a = element.getContext) == null ? void 0 : _a.call(element, "2d");
    if (ctx == null) {
      if (element.localName != "canvas") {
        throw `Element supplied for LGraphCanvas must be a <canvas> element, you passed a ${element.localName}`;
      }
      throw "This browser doesn't support Canvas";
    }
    this.ctx = ctx;
    if (!skip_events) this.bindEvents();
  }
  /** Captures an event and prevents default - returns false. */
  _doNothing(e2) {
    e2.preventDefault();
    return false;
  }
  /** Captures an event and prevents default - returns true. */
  _doReturnTrue(e2) {
    e2.preventDefault();
    return true;
  }
  /**
   * binds mouse, keyboard, touch and drag events to the canvas
   */
  bindEvents() {
    if (this._events_binded) {
      console.warn("LGraphCanvas: events already binded");
      return;
    }
    const { canvas: canvas2 } = this;
    const { document: document2 } = this.getCanvasWindow();
    this._mousedown_callback = this.processMouseDown.bind(this);
    this._mousewheel_callback = this.processMouseWheel.bind(this);
    this._mousemove_callback = this.processMouseMove.bind(this);
    this._mouseup_callback = this.processMouseUp.bind(this);
    this._mouseout_callback = this.processMouseOut.bind(this);
    this._mousecancel_callback = this.processMouseCancel.bind(this);
    canvas2.addEventListener("pointerdown", this._mousedown_callback, true);
    canvas2.addEventListener("wheel", this._mousewheel_callback, false);
    canvas2.addEventListener("pointerup", this._mouseup_callback, true);
    canvas2.addEventListener("pointermove", this._mousemove_callback);
    canvas2.addEventListener("pointerout", this._mouseout_callback);
    canvas2.addEventListener("pointercancel", this._mousecancel_callback, true);
    canvas2.addEventListener("contextmenu", this._doNothing);
    this._key_callback = this.processKey.bind(this);
    canvas2.addEventListener("keydown", this._key_callback, true);
    document2.addEventListener("keyup", this._key_callback, true);
    canvas2.addEventListener("dragover", this._doNothing, false);
    canvas2.addEventListener("dragend", this._doNothing, false);
    canvas2.addEventListener("dragenter", this._doReturnTrue, false);
    this._events_binded = true;
  }
  /**
   * unbinds mouse events from the canvas
   */
  unbindEvents() {
    if (!this._events_binded) {
      console.warn("LGraphCanvas: no events binded");
      return;
    }
    const { document: document2 } = this.getCanvasWindow();
    const { canvas: canvas2 } = this;
    canvas2.removeEventListener("pointercancel", this._mousecancel_callback);
    canvas2.removeEventListener("pointerout", this._mouseout_callback);
    canvas2.removeEventListener("pointermove", this._mousemove_callback);
    canvas2.removeEventListener("pointerup", this._mouseup_callback);
    canvas2.removeEventListener("pointerdown", this._mousedown_callback);
    canvas2.removeEventListener("wheel", this._mousewheel_callback);
    canvas2.removeEventListener("keydown", this._key_callback);
    document2.removeEventListener("keyup", this._key_callback);
    canvas2.removeEventListener("contextmenu", this._doNothing);
    canvas2.removeEventListener("dragenter", this._doReturnTrue);
    this._mousedown_callback = void 0;
    this._mousewheel_callback = void 0;
    this._key_callback = void 0;
    this._events_binded = false;
  }
  /**
   * Ensures the canvas will be redrawn on the next frame by setting the dirty flag(s).
   * Without parameters, this function does nothing.
   * @todo Impl. `setDirty()` or similar as shorthand to redraw everything.
   * @param fgcanvas If true, marks the foreground canvas as dirty (nodes and anything drawn on top of them).  Default: false
   * @param bgcanvas If true, mark the background canvas as dirty (background, groups, links).  Default: false
   */
  setDirty(fgcanvas, bgcanvas) {
    if (fgcanvas) this.dirty_canvas = true;
    if (bgcanvas) this.dirty_bgcanvas = true;
  }
  /**
   * Used to attach the canvas in a popup
   * @returns returns the window where the canvas is attached (the DOM root node)
   */
  getCanvasWindow() {
    if (!this.canvas) return window;
    const doc = this.canvas.ownerDocument;
    return doc.defaultView || doc.parentWindow;
  }
  /**
   * starts rendering the content of the canvas when needed
   *
   */
  startRendering() {
    if (this.is_rendering) return;
    this.is_rendering = true;
    renderFrame.call(this);
    function renderFrame() {
      if (!this.pause_rendering) {
        this.draw();
      }
      const window2 = this.getCanvasWindow();
      if (this.is_rendering) {
        if (__privateGet(this, _maximumFrameGap) > 0) {
          const gap = __privateGet(this, _maximumFrameGap) - (LiteGraph.getTime() - this.last_draw_time);
          setTimeout(renderFrame.bind(this), Math.max(1, gap));
        } else {
          window2.requestAnimationFrame(renderFrame.bind(this));
        }
      }
    }
  }
  /**
   * stops rendering the content of the canvas (to save resources)
   *
   */
  stopRendering() {
    this.is_rendering = false;
  }
  /* LiteGraphCanvas input */
  // used to block future mouse events (because of im gui)
  blockClick() {
    this.block_click = true;
    this.last_mouseclick = 0;
  }
  /**
   * Gets the widget at the current cursor position
   * @param node Optional node to check for widgets under cursor
   * @returns The widget located at the current cursor position or null
   */
  getWidgetAtCursor(node2) {
    var _a;
    node2 != null ? node2 : node2 = this.node_over;
    return (_a = node2 == null ? void 0 : node2.getWidgetOnPos(this.graph_mouse[0], this.graph_mouse[1], true)) != null ? _a : null;
  }
  /**
   * Clears highlight and mouse-over information from nodes that should not have it.
   *
   * Intended to be called when the pointer moves away from a node.
   * @param node The node that the mouse is now over
   * @param e MouseEvent that is triggering this
   */
  updateMouseOverNodes(node2, e2) {
    var _a, _b;
    if (!this.graph) throw new NullGraphError();
    const nodes = this.graph._nodes;
    for (const otherNode of nodes) {
      if (otherNode.mouseOver && node2 != otherNode) {
        otherNode.mouseOver = null;
        this._highlight_input = void 0;
        this._highlight_pos = void 0;
        this.linkConnector.overWidget = void 0;
        otherNode.lostFocusAt = LiteGraph.getTime();
        (_b = (_a = this.node_over) == null ? void 0 : _a.onMouseLeave) == null ? void 0 : _b.call(_a, e2);
        this.node_over = void 0;
        this.dirty_canvas = true;
      }
    }
  }
  processMouseDown(e2) {
    var _a, _b, _c;
    if (this.dragZoomEnabled && e2.ctrlKey && e2.shiftKey && !e2.altKey && e2.buttons) {
      __privateSet(this, _dragZoomStart, { pos: [e2.x, e2.y], scale: this.ds.scale });
      return;
    }
    const { graph, pointer } = this;
    this.adjustMouseEvent(e2);
    if (e2.isPrimary) pointer.down(e2);
    if (this.set_canvas_dirty_on_mouse_event) this.dirty_canvas = true;
    if (!graph) return;
    const ref_window = this.getCanvasWindow();
    _LGraphCanvas.active_canvas = this;
    const x2 = e2.clientX;
    const y = e2.clientY;
    this.ds.viewport = this.viewport;
    const is_inside = !this.viewport || isInRect(x2, y, this.viewport);
    if (!is_inside) return;
    const node2 = (_a = graph.getNodeOnPos(e2.canvasX, e2.canvasY, this.visible_nodes)) != null ? _a : void 0;
    this.mouse[0] = x2;
    this.mouse[1] = y;
    this.graph_mouse[0] = e2.canvasX;
    this.graph_mouse[1] = e2.canvasY;
    this.last_click_position = [this.mouse[0], this.mouse[1]];
    pointer.isDouble = pointer.isDown && e2.isPrimary;
    pointer.isDown = true;
    this.canvas.focus();
    LiteGraph.closeAllContextMenus(ref_window);
    if (((_b = this.onMouse) == null ? void 0 : _b.call(this, e2)) == true) return;
    if (e2.button === 0 && !pointer.isDouble) {
      __privateMethod(this, _LGraphCanvas_instances, processPrimaryButton_fn).call(this, e2, node2);
    } else if (e2.button === 1) {
      __privateMethod(this, _LGraphCanvas_instances, processMiddleButton_fn).call(this, e2, node2);
    } else if ((e2.button === 2 || pointer.isDouble) && this.allow_interaction && !this.read_only) {
      if (node2) this.processSelect(node2, e2, true);
      this.processContextMenu(node2, e2);
    }
    this.last_mouse = [x2, y];
    this.last_mouseclick = LiteGraph.getTime();
    this.last_mouse_dragging = true;
    graph.change();
    if (!ref_window.document.activeElement || ref_window.document.activeElement.nodeName.toLowerCase() != "input" && ref_window.document.activeElement.nodeName.toLowerCase() != "textarea") {
      e2.preventDefault();
    }
    e2.stopPropagation();
    (_c = this.onMouseDown) == null ? void 0 : _c.call(this, e2);
  }
  /**
   * Called when a mouse move event has to be processed
   */
  processMouseMove(e2) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (this.dragZoomEnabled && e2.ctrlKey && e2.shiftKey && __privateGet(this, _dragZoomStart)) {
      __privateMethod(this, _LGraphCanvas_instances, processDragZoom_fn).call(this, e2);
      return;
    }
    if (this.autoresize) this.resize();
    if (this.set_canvas_dirty_on_mouse_event) this.dirty_canvas = true;
    const { graph, resizingGroup, linkConnector } = this;
    if (!graph) return;
    _LGraphCanvas.active_canvas = this;
    this.adjustMouseEvent(e2);
    const mouse = [e2.clientX, e2.clientY];
    this.mouse[0] = mouse[0];
    this.mouse[1] = mouse[1];
    const delta2 = [
      mouse[0] - this.last_mouse[0],
      mouse[1] - this.last_mouse[1]
    ];
    this.last_mouse = mouse;
    this.graph_mouse[0] = e2.canvasX;
    this.graph_mouse[1] = e2.canvasY;
    if (e2.isPrimary) this.pointer.move(e2);
    if (this.block_click) {
      e2.preventDefault();
      return;
    }
    e2.dragging = this.last_mouse_dragging;
    if (this.node_widget) {
      const [node22, widget] = this.node_widget;
      if (widget == null ? void 0 : widget.mouse) {
        const x2 = e2.canvasX - node22.pos[0];
        const y = e2.canvasY - node22.pos[1];
        const result = widget.mouse(e2, [x2, y], node22);
        if (result != null) this.dirty_canvas = result;
      }
    }
    let underPointer = CanvasItem.Nothing;
    const node2 = graph.getNodeOnPos(
      e2.canvasX,
      e2.canvasY,
      this.visible_nodes
    );
    const dragRect = this.dragging_rectangle;
    if (dragRect) {
      dragRect[2] = e2.canvasX - dragRect[0];
      dragRect[3] = e2.canvasY - dragRect[1];
      this.dirty_canvas = true;
    } else if (resizingGroup) {
      underPointer |= CanvasItem.ResizeSe | CanvasItem.Group;
    } else if (this.dragging_canvas) {
      this.ds.offset[0] += delta2[0] / this.ds.scale;
      this.ds.offset[1] += delta2[1] / this.ds.scale;
      __privateMethod(this, _LGraphCanvas_instances, dirty_fn).call(this);
    } else if ((this.allow_interaction || (node2 == null ? void 0 : node2.flags.allow_interaction)) && !this.read_only) {
      if (linkConnector.isConnecting) this.dirty_canvas = true;
      this.updateMouseOverNodes(node2, e2);
      if (node2) {
        underPointer |= CanvasItem.Node;
        if (node2.redraw_on_mouse) this.dirty_canvas = true;
        const pos = [0, 0];
        const inputId = isOverNodeInput(node2, e2.canvasX, e2.canvasY, pos);
        const outputId = isOverNodeOutput(node2, e2.canvasX, e2.canvasY, pos);
        const overWidget = node2.getWidgetOnPos(e2.canvasX, e2.canvasY, true);
        if (!node2.mouseOver) {
          node2.mouseOver = {
            inputId: null,
            outputId: null,
            overWidget: null
          };
          this.node_over = node2;
          this.dirty_canvas = true;
          (_a = node2.onMouseEnter) == null ? void 0 : _a.call(node2, e2);
        }
        (_b = node2.onMouseMove) == null ? void 0 : _b.call(node2, e2, [e2.canvasX - node2.pos[0], e2.canvasY - node2.pos[1]], this);
        if (node2.mouseOver.inputId !== inputId || node2.mouseOver.outputId !== outputId || node2.mouseOver.overWidget !== overWidget) {
          node2.mouseOver.inputId = inputId;
          node2.mouseOver.outputId = outputId;
          node2.mouseOver.overWidget = overWidget;
          linkConnector.overWidget = void 0;
          if (linkConnector.isConnecting) {
            const firstLink = linkConnector.renderLinks.at(0);
            let highlightPos;
            let highlightInput;
            if (!firstLink || !linkConnector.isNodeValidDrop(node2)) ;
            else if (linkConnector.state.connectingTo === "input") {
              if (inputId === -1 && outputId === -1) {
                if (this.getWidgetLinkType && overWidget) {
                  const widgetLinkType = this.getWidgetLinkType(overWidget, node2);
                  if (widgetLinkType && LiteGraph.isValidConnection((_c = linkConnector.renderLinks[0]) == null ? void 0 : _c.fromSlot.type, widgetLinkType) && ((_e = (_d = firstLink.node).isValidWidgetLink) == null ? void 0 : _e.call(_d, firstLink.fromSlotIndex, node2, overWidget)) !== false) {
                    const { pos: [nodeX, nodeY] } = node2;
                    highlightPos = [nodeX + 10, nodeY + 10 + overWidget.y];
                    linkConnector.overWidget = overWidget;
                    linkConnector.overWidgetType = widgetLinkType;
                  }
                }
                if (!linkConnector.overWidget) {
                  const result = node2.findInputByType(firstLink.fromSlot.type);
                  if (result) {
                    highlightInput = result.slot;
                    highlightPos = node2.getInputPos(result.index);
                  }
                }
              } else if (inputId != -1 && node2.inputs[inputId] && LiteGraph.isValidConnection(firstLink.fromSlot.type, node2.inputs[inputId].type)) {
                highlightPos = pos;
                highlightInput = node2.inputs[inputId];
              }
            } else if (linkConnector.state.connectingTo === "output") {
              if (inputId === -1 && outputId === -1) {
                const result = node2.findOutputByType(firstLink.fromSlot.type);
                if (result) {
                  highlightPos = node2.getOutputPos(result.index);
                }
              } else {
                if (outputId != -1 && node2.outputs[outputId] && LiteGraph.isValidConnection(firstLink.fromSlot.type, node2.outputs[outputId].type)) {
                  highlightPos = pos;
                }
              }
            }
            this._highlight_pos = highlightPos;
            this._highlight_input = highlightInput;
          }
          this.dirty_canvas = true;
        }
        if (node2.inResizeCorner(e2.canvasX, e2.canvasY)) {
          underPointer |= CanvasItem.ResizeSe;
        }
      } else {
        const reroute = graph.getRerouteOnPos(e2.canvasX, e2.canvasY);
        if (reroute) {
          underPointer |= CanvasItem.Reroute;
          linkConnector.overReroute = reroute;
          if (linkConnector.isConnecting && linkConnector.isRerouteValidDrop(reroute)) {
            this._highlight_pos = reroute.pos;
          }
        } else {
          this._highlight_pos && (this._highlight_pos = void 0);
          linkConnector.overReroute && (linkConnector.overReroute = void 0);
        }
        const segment = __privateMethod(this, _LGraphCanvas_instances, getLinkCentreOnPos_fn).call(this, e2);
        if (this.over_link_center !== segment) {
          underPointer |= CanvasItem.Link;
          this.over_link_center = segment;
          this.dirty_bgcanvas = true;
        }
        if (this.canvas) {
          const group = graph.getGroupOnPos(e2.canvasX, e2.canvasY);
          if (group && !e2.ctrlKey && !this.read_only && group.isInResize(e2.canvasX, e2.canvasY)) {
            underPointer |= CanvasItem.ResizeSe;
          }
        }
      }
      if (this.node_capturing_input && this.node_capturing_input != node2) {
        (_g = (_f = this.node_capturing_input).onMouseMove) == null ? void 0 : _g.call(
          _f,
          e2,
          [
            e2.canvasX - this.node_capturing_input.pos[0],
            e2.canvasY - this.node_capturing_input.pos[1]
          ],
          this
        );
      }
      if (this.isDragging) {
        const selected = this.selectedItems;
        const allItems = e2.ctrlKey ? selected : getAllNestedItems(selected);
        const deltaX = delta2[0] / this.ds.scale;
        const deltaY = delta2[1] / this.ds.scale;
        for (const item of allItems) {
          item.move(deltaX, deltaY, true);
        }
        __privateMethod(this, _LGraphCanvas_instances, dirty_fn).call(this);
      }
      if (this.resizing_node) underPointer |= CanvasItem.ResizeSe;
    }
    this.hoveringOver = underPointer;
    e2.preventDefault();
    return;
  }
  /**
   * Called when a mouse up event has to be processed
   */
  processMouseUp(e2) {
    var _a, _b, _c, _d;
    if (e2.isPrimary === false) return;
    const { graph, pointer } = this;
    if (!graph) return;
    _LGraphCanvas.active_canvas = this;
    this.adjustMouseEvent(e2);
    const now = LiteGraph.getTime();
    e2.click_time = now - this.last_mouseclick;
    const isClick = pointer.up(e2);
    if (isClick === true) {
      pointer.isDown = false;
      pointer.isDouble = false;
      this.connecting_links = null;
      this.dragging_canvas = false;
      graph.change();
      e2.stopPropagation();
      e2.preventDefault();
      return;
    }
    this.last_mouse_dragging = false;
    this.last_click_position = null;
    this.block_click && (this.block_click = false);
    if (e2.button === 0) {
      this.selected_group = null;
      this.isDragging = false;
      const x2 = e2.canvasX;
      const y = e2.canvasY;
      if (!this.linkConnector.isConnecting) {
        this.dirty_canvas = true;
        (_b = (_a = this.node_over) == null ? void 0 : _a.onMouseUp) == null ? void 0 : _b.call(_a, e2, [x2 - this.node_over.pos[0], y - this.node_over.pos[1]], this);
        (_d = (_c = this.node_capturing_input) == null ? void 0 : _c.onMouseUp) == null ? void 0 : _d.call(_c, e2, [
          x2 - this.node_capturing_input.pos[0],
          y - this.node_capturing_input.pos[1]
        ]);
      }
    } else if (e2.button === 1) {
      this.dirty_canvas = true;
      this.dragging_canvas = false;
    } else if (e2.button === 2) {
      this.dirty_canvas = true;
    }
    pointer.isDown = false;
    pointer.isDouble = false;
    graph.change();
    e2.stopPropagation();
    e2.preventDefault();
    return;
  }
  /**
   * Called when the mouse moves off the canvas.  Clears all node hover states.
   * @param e
   */
  processMouseOut(e2) {
    this.adjustMouseEvent(e2);
    this.updateMouseOverNodes(null, e2);
  }
  processMouseCancel() {
    console.warn("Pointer cancel!");
    this.pointer.reset();
  }
  /**
   * Called when a mouse wheel event has to be processed
   */
  processMouseWheel(e2) {
    var _a;
    if (!this.graph || !this.allow_dragcanvas) return;
    const delta2 = (_a = e2.wheelDeltaY) != null ? _a : e2.detail * -60;
    this.adjustMouseEvent(e2);
    const pos = [e2.clientX, e2.clientY];
    if (this.viewport && !isPointInRect(pos, this.viewport)) return;
    let { scale } = this.ds;
    if (delta2 > 0) scale *= this.zoom_speed;
    else if (delta2 < 0) scale *= 1 / this.zoom_speed;
    this.ds.changeScale(scale, [e2.clientX, e2.clientY]);
    this.graph.change();
    e2.preventDefault();
    return;
  }
  /**
   * process a key event
   */
  processKey(e2) {
    var _a, _b, _c, _d, _e, _f, _g;
    __privateSet(this, _shiftDown, e2.shiftKey);
    if (!this.graph) return;
    let block_default = false;
    if (e2.target.localName == "input") return;
    if (e2.type == "keydown") {
      if (e2.key === " ") {
        this.read_only = true;
        if (this._previously_dragging_canvas === null) {
          this._previously_dragging_canvas = this.dragging_canvas;
        }
        this.dragging_canvas = this.pointer.isDown;
        block_default = true;
      } else if (e2.key === "Escape") {
        if (this.linkConnector.isConnecting) {
          this.linkConnector.reset();
          e2.preventDefault();
          return;
        }
        (_a = this.node_panel) == null ? void 0 : _a.close();
        (_b = this.options_panel) == null ? void 0 : _b.close();
        block_default = true;
      } else if (e2.keyCode === 65 && e2.ctrlKey) {
        this.selectItems();
        block_default = true;
      } else if (e2.keyCode === 67 && (e2.metaKey || e2.ctrlKey) && !e2.shiftKey) {
        if (this.selected_nodes) {
          this.copyToClipboard();
          block_default = true;
        }
      } else if (e2.keyCode === 86 && (e2.metaKey || e2.ctrlKey)) {
        this.pasteFromClipboard({ connectInputs: e2.shiftKey });
      } else if (e2.key === "Delete" || e2.key === "Backspace") {
        if (e2.target.localName != "input" && e2.target.localName != "textarea") {
          this.deleteSelected();
          block_default = true;
        }
      }
      if (this.selected_nodes) {
        for (const i in this.selected_nodes) {
          (_d = (_c = this.selected_nodes[i]).onKeyDown) == null ? void 0 : _d.call(_c, e2);
        }
      }
    } else if (e2.type == "keyup") {
      if (e2.key === " ") {
        this.read_only = false;
        this.dragging_canvas = ((_e = this._previously_dragging_canvas) != null ? _e : false) && this.pointer.isDown;
        this._previously_dragging_canvas = null;
      }
      if (this.selected_nodes) {
        for (const i in this.selected_nodes) {
          (_g = (_f = this.selected_nodes[i]).onKeyUp) == null ? void 0 : _g.call(_f, e2);
        }
      }
    }
    this.graph.change();
    if (block_default) {
      e2.preventDefault();
      e2.stopImmediatePropagation();
      return false;
    }
  }
  /**
   * Copies canvas items to an internal, app-specific clipboard backed by local storage.
   * When called without parameters, it copies {@link selectedItems}.
   * @param items The items to copy.  If nullish, all selected items are copied.
   */
  copyToClipboard(items) {
    var _a, _b, _c;
    const serialisable = {
      nodes: [],
      groups: [],
      reroutes: [],
      links: []
    };
    for (const item of items != null ? items : this.selectedItems) {
      if (item instanceof LGraphNode) {
        if (item.clonable === false) continue;
        const cloned = (_a = item.clone()) == null ? void 0 : _a.serialize();
        if (!cloned) continue;
        cloned.id = item.id;
        serialisable.nodes.push(cloned);
        if (item.inputs) {
          for (const { link: linkId } of item.inputs) {
            if (linkId == null) continue;
            const link = (_c = (_b = this.graph) == null ? void 0 : _b._links.get(linkId)) == null ? void 0 : _c.asSerialisable();
            if (link) serialisable.links.push(link);
          }
        }
      } else if (item instanceof LGraphGroup) {
        serialisable.groups.push(item.serialize());
      } else if (item instanceof Reroute) {
        serialisable.reroutes.push(item.asSerialisable());
      }
    }
    localStorage.setItem(
      "litegrapheditor_clipboard",
      JSON.stringify(serialisable)
    );
  }
  emitEvent(detail) {
    this.canvas.dispatchEvent(
      new CustomEvent("litegraph:canvas", {
        bubbles: true,
        detail
      })
    );
  }
  /** @todo Refactor to where it belongs - e.g. Deleting / creating nodes is not actually canvas event. */
  emitBeforeChange() {
    this.emitEvent({
      subType: "before-change"
    });
  }
  /** @todo See {@link emitBeforeChange} */
  emitAfterChange() {
    this.emitEvent({
      subType: "after-change"
    });
  }
  /**
   * Pastes the items from the canvas "clipbaord" - a local storage variable.
   */
  _pasteFromClipboard(options2 = {}) {
    var _a, _b, _c, _d, _e;
    const {
      connectInputs = false,
      position = this.graph_mouse
    } = options2;
    if (!LiteGraph.ctrl_shift_v_paste_connect_unselected_outputs && connectInputs) return;
    const data = localStorage.getItem("litegrapheditor_clipboard");
    if (!data) return;
    const { graph } = this;
    if (!graph) throw new NullGraphError();
    graph.beforeChange();
    const parsed = JSON.parse(data);
    (_a = parsed.nodes) != null ? _a : parsed.nodes = [];
    (_b = parsed.groups) != null ? _b : parsed.groups = [];
    (_c = parsed.reroutes) != null ? _c : parsed.reroutes = [];
    (_d = parsed.links) != null ? _d : parsed.links = [];
    let offsetX = Infinity;
    let offsetY = Infinity;
    for (const item of [...parsed.nodes, ...parsed.reroutes]) {
      if (item.pos == null) throw new TypeError("Invalid node encounterd on paste.  `pos` was null.");
      if (item.pos[0] < offsetX) offsetX = item.pos[0];
      if (item.pos[1] < offsetY) offsetY = item.pos[1];
    }
    if (parsed.groups) {
      for (const group of parsed.groups) {
        if (group.bounding[0] < offsetX) offsetX = group.bounding[0];
        if (group.bounding[1] < offsetY) offsetY = group.bounding[1];
      }
    }
    const results = {
      created: [],
      nodes: /* @__PURE__ */ new Map(),
      links: /* @__PURE__ */ new Map(),
      reroutes: /* @__PURE__ */ new Map()
    };
    const { created, nodes, links, reroutes } = results;
    for (const info of parsed.groups) {
      info.id = -1;
      const group = new LGraphGroup();
      group.configure(info);
      graph.add(group);
      created.push(group);
    }
    for (const info of parsed.nodes) {
      const node2 = info.type == null ? null : LiteGraph.createNode(info.type);
      if (!node2) {
        continue;
      }
      nodes.set(info.id, node2);
      info.id = -1;
      node2.configure(info);
      graph.add(node2);
      created.push(node2);
    }
    for (const info of parsed.reroutes) {
      const { id, ...rerouteInfo } = info;
      const reroute = graph.setReroute(rerouteInfo);
      created.push(reroute);
      reroutes.set(id, reroute);
    }
    for (const reroute of reroutes.values()) {
      if (reroute.parentId == null) continue;
      const mapped = reroutes.get(reroute.parentId);
      if (mapped) reroute.parentId = mapped.id;
    }
    for (const info of parsed.links) {
      let outNode = nodes.get(info.origin_id);
      let afterRerouteId;
      if (info.parentId != null) afterRerouteId = (_e = reroutes.get(info.parentId)) == null ? void 0 : _e.id;
      if (connectInputs && LiteGraph.ctrl_shift_v_paste_connect_unselected_outputs) {
        outNode != null ? outNode : outNode = graph.getNodeById(info.origin_id);
        afterRerouteId != null ? afterRerouteId : afterRerouteId = info.parentId;
      }
      const inNode = nodes.get(info.target_id);
      if (inNode) {
        const link = outNode == null ? void 0 : outNode.connect(
          info.origin_slot,
          inNode,
          info.target_slot,
          afterRerouteId
        );
        if (link) links.set(info.id, link);
      }
    }
    for (const reroute of reroutes.values()) {
      const ids = [...reroute.linkIds].map((x2) => {
        var _a2, _b2;
        return (_b2 = (_a2 = links.get(x2)) == null ? void 0 : _a2.id) != null ? _b2 : x2;
      });
      reroute.update(reroute.parentId, void 0, ids, reroute.floating);
      if (!reroute.validateLinks(graph.links, graph.floatingLinks)) {
        graph.removeReroute(reroute.id);
      }
    }
    for (const item of created) {
      item.pos[0] += position[0] - offsetX;
      item.pos[1] += position[1] - offsetY;
    }
    this.selectItems(created);
    graph.afterChange();
    return results;
  }
  pasteFromClipboard(options2 = {}) {
    this.emitBeforeChange();
    try {
      this._pasteFromClipboard(options2);
    } finally {
      this.emitAfterChange();
    }
  }
  processNodeDblClicked(n) {
    var _a, _b;
    (_a = this.onShowNodePanel) == null ? void 0 : _a.call(this, n);
    (_b = this.onNodeDblClicked) == null ? void 0 : _b.call(this, n);
    this.setDirty(true);
  }
  /**
   * Determines whether to select or deselect an item that has received a pointer event.  Will deselect other nodes if
   * @param item Canvas item to select/deselect
   * @param e The MouseEvent to handle
   * @param sticky Prevents deselecting individual nodes (as used by aux/right-click)
   * @remarks
   * Accessibility: anyone using {@link mutli_select} always deselects when clicking empty space.
   */
  processSelect(item, e2, sticky = false) {
    var _a;
    const addModifier = e2 == null ? void 0 : e2.shiftKey;
    const subtractModifier = e2 != null && (e2.metaKey || e2.ctrlKey);
    const eitherModifier = addModifier || subtractModifier;
    const modifySelection = eitherModifier || this.multi_select;
    if (!item) {
      if (!eitherModifier || this.multi_select) this.deselectAll();
    } else if (!item.selected || !this.selectedItems.has(item)) {
      if (!modifySelection) this.deselectAll(item);
      this.select(item);
    } else if (modifySelection && !sticky) {
      this.deselect(item);
    } else if (!sticky) {
      this.deselectAll(item);
    } else {
      return;
    }
    (_a = this.onSelectionChange) == null ? void 0 : _a.call(this, this.selected_nodes);
    this.setDirty(true);
  }
  /**
   * Selects a {@link Positionable} item.
   * @param item The canvas item to add to the selection.
   */
  select(item) {
    var _a, _b;
    if (item.selected && this.selectedItems.has(item)) return;
    item.selected = true;
    this.selectedItems.add(item);
    if (!(item instanceof LGraphNode)) return;
    (_a = item.onSelected) == null ? void 0 : _a.call(item);
    this.selected_nodes[item.id] = item;
    (_b = this.onNodeSelected) == null ? void 0 : _b.call(this, item);
    if (item.inputs) {
      for (const input of item.inputs) {
        if (input.link == null) continue;
        this.highlighted_links[input.link] = true;
      }
    }
    if (item.outputs) {
      for (const id of item.outputs.flatMap((x2) => x2.links)) {
        if (id == null) continue;
        this.highlighted_links[id] = true;
      }
    }
  }
  /**
   * Deselects a {@link Positionable} item.
   * @param item The canvas item to remove from the selection.
   */
  deselect(item) {
    var _a, _b;
    if (!item.selected && !this.selectedItems.has(item)) return;
    item.selected = false;
    this.selectedItems.delete(item);
    if (!(item instanceof LGraphNode)) return;
    (_a = item.onDeselected) == null ? void 0 : _a.call(item);
    delete this.selected_nodes[item.id];
    (_b = this.onNodeDeselected) == null ? void 0 : _b.call(this, item);
    if (item.inputs) {
      for (const input of item.inputs) {
        if (input.link == null) continue;
        delete this.highlighted_links[input.link];
      }
    }
    if (item.outputs) {
      for (const id of item.outputs.flatMap((x2) => x2.links)) {
        if (id == null) continue;
        delete this.highlighted_links[id];
      }
    }
  }
  /** @deprecated See {@link LGraphCanvas.processSelect} */
  processNodeSelected(item, e2) {
    this.processSelect(
      item,
      e2,
      e2 && (e2.shiftKey || e2.metaKey || e2.ctrlKey || this.multi_select)
    );
  }
  /** @deprecated See {@link LGraphCanvas.select} */
  selectNode(node2, add_to_current_selection) {
    if (node2 == null) {
      this.deselectAll();
    } else {
      this.selectNodes([node2], add_to_current_selection);
    }
  }
  get empty() {
    if (!this.graph) throw new NullGraphError();
    return this.graph.empty;
  }
  get positionableItems() {
    if (!this.graph) throw new NullGraphError();
    return this.graph.positionableItems();
  }
  /**
   * Selects several items.
   * @param items Items to select - if falsy, all items on the canvas will be selected
   * @param add_to_current_selection If set, the items will be added to the current selection instead of replacing it
   */
  selectItems(items, add_to_current_selection) {
    var _a;
    const itemsToSelect = items != null ? items : this.positionableItems;
    if (!add_to_current_selection) this.deselectAll();
    for (const item of itemsToSelect) this.select(item);
    (_a = this.onSelectionChange) == null ? void 0 : _a.call(this, this.selected_nodes);
    this.setDirty(true);
  }
  /**
   * selects several nodes (or adds them to the current selection)
   * @deprecated See {@link LGraphCanvas.selectItems}
   */
  selectNodes(nodes, add_to_current_selection) {
    this.selectItems(nodes, add_to_current_selection);
  }
  /** @deprecated See {@link LGraphCanvas.deselect} */
  deselectNode(node2) {
    this.deselect(node2);
  }
  /**
   * Deselects all items on the canvas.
   * @param keepSelected If set, this item will not be removed from the selection.
   */
  deselectAll(keepSelected) {
    var _a, _b;
    if (!this.graph) return;
    const selected = this.selectedItems;
    if (!selected.size) return;
    let wasSelected;
    for (const sel of selected) {
      if (sel === keepSelected) {
        wasSelected = sel;
        continue;
      }
      (_a = sel.onDeselected) == null ? void 0 : _a.call(sel);
      sel.selected = false;
    }
    selected.clear();
    if (wasSelected) selected.add(wasSelected);
    this.setDirty(true);
    const oldNode = (keepSelected == null ? void 0 : keepSelected.id) == null ? null : this.selected_nodes[keepSelected.id];
    this.selected_nodes = {};
    this.current_node = null;
    this.highlighted_links = {};
    if (keepSelected instanceof LGraphNode) {
      if (oldNode) this.selected_nodes[oldNode.id] = oldNode;
      if (keepSelected.inputs) {
        for (const input of keepSelected.inputs) {
          if (input.link == null) continue;
          this.highlighted_links[input.link] = true;
        }
      }
      if (keepSelected.outputs) {
        for (const id of keepSelected.outputs.flatMap((x2) => x2.links)) {
          if (id == null) continue;
          this.highlighted_links[id] = true;
        }
      }
    }
    (_b = this.onSelectionChange) == null ? void 0 : _b.call(this, this.selected_nodes);
  }
  /** @deprecated See {@link LGraphCanvas.deselectAll} */
  deselectAllNodes() {
    this.deselectAll();
  }
  /**
   * Deletes all selected items from the graph.
   * @todo Refactor deletion task to LGraph.  Selection is a canvas property, delete is a graph action.
   */
  deleteSelected() {
    var _a, _b;
    const { graph } = this;
    if (!graph) throw new NullGraphError();
    this.emitBeforeChange();
    graph.beforeChange();
    for (const item of this.selectedItems) {
      if (item instanceof LGraphNode) {
        const node2 = item;
        if (node2.block_delete) continue;
        node2.connectInputToOutput();
        graph.remove(node2);
        (_a = this.onNodeDeselected) == null ? void 0 : _a.call(this, node2);
      } else if (item instanceof LGraphGroup) {
        graph.remove(item);
      } else if (item instanceof Reroute) {
        graph.removeReroute(item.id);
      }
    }
    this.selected_nodes = {};
    this.selectedItems.clear();
    this.current_node = null;
    this.highlighted_links = {};
    (_b = this.onSelectionChange) == null ? void 0 : _b.call(this, this.selected_nodes);
    this.setDirty(true);
    graph.afterChange();
    this.emitAfterChange();
  }
  /**
   * deletes all nodes in the current selection from the graph
   * @deprecated See {@link LGraphCanvas.deleteSelected}
   */
  deleteSelectedNodes() {
    this.deleteSelected();
  }
  /**
   * centers the camera on a given node
   */
  centerOnNode(node2) {
    const dpi = (window == null ? void 0 : window.devicePixelRatio) || 1;
    this.ds.offset[0] = -node2.pos[0] - node2.size[0] * 0.5 + this.canvas.width * 0.5 / (this.ds.scale * dpi);
    this.ds.offset[1] = -node2.pos[1] - node2.size[1] * 0.5 + this.canvas.height * 0.5 / (this.ds.scale * dpi);
    this.setDirty(true, true);
  }
  /**
   * adds some useful properties to a mouse event, like the position in graph coordinates
   */
  adjustMouseEvent(e2) {
    let clientX_rel = e2.clientX;
    let clientY_rel = e2.clientY;
    if (this.canvas) {
      const b = this.canvas.getBoundingClientRect();
      clientX_rel -= b.left;
      clientY_rel -= b.top;
    }
    e2.safeOffsetX = clientX_rel;
    e2.safeOffsetY = clientY_rel;
    if (e2.deltaX === void 0)
      e2.deltaX = clientX_rel - this.last_mouse_position[0];
    if (e2.deltaY === void 0)
      e2.deltaY = clientY_rel - this.last_mouse_position[1];
    this.last_mouse_position[0] = clientX_rel;
    this.last_mouse_position[1] = clientY_rel;
    e2.canvasX = clientX_rel / this.ds.scale - this.ds.offset[0];
    e2.canvasY = clientY_rel / this.ds.scale - this.ds.offset[1];
  }
  /**
   * changes the zoom level of the graph (default is 1), you can pass also a place used to pivot the zoom
   */
  setZoom(value, zooming_center) {
    this.ds.changeScale(value, zooming_center);
    __privateMethod(this, _LGraphCanvas_instances, dirty_fn).call(this);
  }
  /**
   * converts a coordinate from graph coordinates to canvas2D coordinates
   */
  convertOffsetToCanvas(pos, out) {
    return this.ds.convertOffsetToCanvas(pos, out);
  }
  /**
   * converts a coordinate from Canvas2D coordinates to graph space
   */
  convertCanvasToOffset(pos, out) {
    return this.ds.convertCanvasToOffset(pos, out);
  }
  // converts event coordinates from canvas2D to graph coordinates
  convertEventToCanvasOffset(e2) {
    const rect = this.canvas.getBoundingClientRect();
    return this.convertCanvasToOffset([
      e2.clientX - rect.left,
      e2.clientY - rect.top
    ]);
  }
  /**
   * brings a node to front (above all other nodes)
   */
  bringToFront(node2) {
    const { graph } = this;
    if (!graph) throw new NullGraphError();
    const i = graph._nodes.indexOf(node2);
    if (i == -1) return;
    graph._nodes.splice(i, 1);
    graph._nodes.push(node2);
  }
  /**
   * sends a node to the back (below all other nodes)
   */
  sendToBack(node2) {
    const { graph } = this;
    if (!graph) throw new NullGraphError();
    const i = graph._nodes.indexOf(node2);
    if (i == -1) return;
    graph._nodes.splice(i, 1);
    graph._nodes.unshift(node2);
  }
  /**
   * Determines which nodes are visible and populates {@link out} with the results.
   * @param nodes The list of nodes to check - if falsy, all nodes in the graph will be checked
   * @param out Array to write visible nodes into - if falsy, a new array is created instead
   * @returns Array passed ({@link out}), or a new array containing all visible nodes
   */
  computeVisibleNodes(nodes, out) {
    const visible_nodes = out || [];
    visible_nodes.length = 0;
    if (!this.graph) throw new NullGraphError();
    const _nodes = nodes || this.graph._nodes;
    for (const node2 of _nodes) {
      node2.updateArea(this.ctx);
      if (!overlapBounding(this.visible_area, node2.renderArea)) continue;
      visible_nodes.push(node2);
    }
    return visible_nodes;
  }
  /**
   * Checks if a node is visible on the canvas.
   * @param node The node to check
   * @returns `true` if the node is visible, otherwise `false`
   */
  isNodeVisible(node2) {
    return __privateGet(this, _visible_node_ids).has(node2.id);
  }
  /**
   * renders the whole canvas content, by rendering in two separated canvas, one containing the background grid and the connections, and one containing the nodes)
   */
  draw(force_canvas, force_bgcanvas) {
    var _a;
    if (!this.canvas || this.canvas.width == 0 || this.canvas.height == 0) return;
    const now = LiteGraph.getTime();
    this.render_time = (now - this.last_draw_time) * 1e-3;
    this.last_draw_time = now;
    if (this.graph) this.ds.computeVisibleArea(this.viewport);
    if (this.dirty_canvas || force_canvas) {
      this.computeVisibleNodes(void 0, this.visible_nodes);
      __privateSet(this, _visible_node_ids, new Set(this.visible_nodes.map((node2) => node2.id)));
    }
    if (this.dirty_bgcanvas || force_bgcanvas || this.always_render_background || ((_a = this.graph) == null ? void 0 : _a._last_trigger_time) && now - this.graph._last_trigger_time < 1e3) {
      this.drawBackCanvas();
    }
    if (this.dirty_canvas || force_canvas) this.drawFrontCanvas();
    this.fps = this.render_time ? 1 / this.render_time : 0;
    this.frame++;
  }
  /**
   * draws the front canvas (the one containing all the nodes)
   */
  drawFrontCanvas() {
    var _a, _b, _c, _d, _e;
    this.dirty_canvas = false;
    const { ctx, canvas: canvas2, linkConnector } = this;
    if (ctx.start2D && !this.viewport) {
      ctx.start2D();
      ctx.restore();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    const area = this.viewport || this.dirty_area;
    if (area) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(area[0], area[1], area[2], area[3]);
      ctx.clip();
    }
    __privateSet(this, _snapToGrid, __privateGet(this, _shiftDown) || LiteGraph.alwaysSnapToGrid ? (_a = this.graph) == null ? void 0 : _a.getSnapToGridSize() : void 0);
    if (this.clear_background) {
      if (area) ctx.clearRect(area[0], area[1], area[2], area[3]);
      else ctx.clearRect(0, 0, canvas2.width, canvas2.height);
    }
    if (this.bgcanvas == this.canvas) {
      this.drawBackCanvas();
    } else {
      const scale = window.devicePixelRatio;
      ctx.drawImage(
        this.bgcanvas,
        0,
        0,
        this.bgcanvas.width / scale,
        this.bgcanvas.height / scale
      );
    }
    (_b = this.onRender) == null ? void 0 : _b.call(this, canvas2, ctx);
    if (this.show_info) {
      this.renderInfo(ctx, area ? area[0] : 0, area ? area[1] : 0);
    }
    if (this.graph) {
      ctx.save();
      this.ds.toCanvasContext(ctx);
      const { visible_nodes } = this;
      const drawSnapGuides = __privateGet(this, _snapToGrid) && this.isDragging;
      for (const node2 of visible_nodes) {
        ctx.save();
        if (drawSnapGuides && this.selectedItems.has(node2))
          this.drawSnapGuide(ctx, node2);
        ctx.translate(node2.pos[0], node2.pos[1]);
        this.drawNode(node2, ctx);
        ctx.restore();
      }
      if (this.render_execution_order) {
        this.drawExecutionOrder(ctx);
      }
      if (this.graph.config.links_ontop) {
        this.drawConnections(ctx);
      }
      if (linkConnector.isConnecting) {
        const { renderLinks } = linkConnector;
        const highlightPos = __privateMethod(this, _LGraphCanvas_instances, getHighlightPosition_fn).call(this);
        ctx.lineWidth = this.connections_width;
        for (const renderLink of renderLinks) {
          const { fromSlot, fromPos: pos, fromDirection, dragDirection } = renderLink;
          const connShape = fromSlot.shape;
          const connType = fromSlot.type;
          const colour = connType === LiteGraph.EVENT ? LiteGraph.EVENT_LINK_COLOR : LiteGraph.CONNECTING_LINK_COLOR;
          this.renderLink(
            ctx,
            pos,
            highlightPos,
            null,
            false,
            null,
            colour,
            fromDirection,
            dragDirection
          );
          ctx.beginPath();
          if (connType === LiteGraph.EVENT || connShape === RenderShape.BOX) {
            ctx.rect(pos[0] - 6 + 0.5, pos[1] - 5 + 0.5, 14, 10);
            ctx.fill();
            ctx.beginPath();
            ctx.rect(
              this.graph_mouse[0] - 6 + 0.5,
              this.graph_mouse[1] - 5 + 0.5,
              14,
              10
            );
          } else if (connShape === RenderShape.ARROW) {
            ctx.moveTo(pos[0] + 8, pos[1] + 0.5);
            ctx.lineTo(pos[0] - 4, pos[1] + 6 + 0.5);
            ctx.lineTo(pos[0] - 4, pos[1] - 6 + 0.5);
            ctx.closePath();
          } else {
            ctx.arc(pos[0], pos[1], 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.graph_mouse[0], this.graph_mouse[1], 4, 0, Math.PI * 2);
          }
          ctx.fill();
        }
        __privateMethod(this, _LGraphCanvas_instances, renderSnapHighlight_fn).call(this, ctx, highlightPos);
      }
      if (this.dragging_rectangle) {
        const { eDown, eMove } = this.pointer;
        ctx.strokeStyle = "#FFF";
        if (eDown && eMove) {
          const transform = ctx.getTransform();
          const ratio = Math.max(1, window.devicePixelRatio);
          ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
          const x2 = eDown.safeOffsetX;
          const y = eDown.safeOffsetY;
          ctx.strokeRect(x2, y, eMove.safeOffsetX - x2, eMove.safeOffsetY - y);
          ctx.setTransform(transform);
        } else {
          const [x2, y, w, h] = this.dragging_rectangle;
          ctx.strokeRect(x2, y, w, h);
        }
      }
      if (!this.isDragging && this.over_link_center && this.render_link_tooltip) {
        this.drawLinkTooltip(ctx, this.over_link_center);
      } else {
        (_c = this.onDrawLinkTooltip) == null ? void 0 : _c.call(this, ctx, null);
      }
      (_d = this.onDrawForeground) == null ? void 0 : _d.call(this, ctx, this.visible_area);
      ctx.restore();
    }
    (_e = this.onDrawOverlay) == null ? void 0 : _e.call(this, ctx);
    if (area) ctx.restore();
  }
  /**
   * draws some useful stats in the corner of the canvas
   */
  renderInfo(ctx, x2, y) {
    x2 = x2 || 10;
    y = y || this.canvas.offsetHeight - 80;
    ctx.save();
    ctx.translate(x2, y);
    ctx.font = "10px Arial";
    ctx.fillStyle = "#888";
    ctx.textAlign = "left";
    if (this.graph) {
      ctx.fillText(`T: ${this.graph.globaltime.toFixed(2)}s`, 5, 13 * 1);
      ctx.fillText(`I: ${this.graph.iteration}`, 5, 13 * 2);
      ctx.fillText(`N: ${this.graph._nodes.length} [${this.visible_nodes.length}]`, 5, 13 * 3);
      ctx.fillText(`V: ${this.graph._version}`, 5, 13 * 4);
      ctx.fillText(`FPS:${this.fps.toFixed(2)}`, 5, 13 * 5);
    } else {
      ctx.fillText("No graph selected", 5, 13 * 1);
    }
    ctx.restore();
  }
  /**
   * draws the back canvas (the one containing the background and the connections)
   */
  drawBackCanvas() {
    var _a, _b;
    const canvas2 = this.bgcanvas;
    if (canvas2.width != this.canvas.width || canvas2.height != this.canvas.height) {
      canvas2.width = this.canvas.width;
      canvas2.height = this.canvas.height;
    }
    if (!this.bgctx) {
      this.bgctx = this.bgcanvas.getContext("2d");
    }
    const ctx = this.bgctx;
    if (!ctx) throw new TypeError("Background canvas context was null.");
    const viewport = this.viewport || [0, 0, ctx.canvas.width, ctx.canvas.height];
    if (this.clear_background) {
      ctx.clearRect(viewport[0], viewport[1], viewport[2], viewport[3]);
    }
    const bg_already_painted = this.onRenderBackground ? this.onRenderBackground(canvas2, ctx) : false;
    if (!this.viewport) {
      const scale = window.devicePixelRatio;
      ctx.restore();
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
    }
    if (this.graph) {
      ctx.save();
      this.ds.toCanvasContext(ctx);
      if (this.ds.scale < 1.5 && !bg_already_painted && this.clear_background_color) {
        ctx.fillStyle = this.clear_background_color;
        ctx.fillRect(
          this.visible_area[0],
          this.visible_area[1],
          this.visible_area[2],
          this.visible_area[3]
        );
      }
      if (this.background_image && this.ds.scale > 0.5 && !bg_already_painted) {
        if (this.zoom_modify_alpha) {
          ctx.globalAlpha = (1 - 0.5 / this.ds.scale) * this.editor_alpha;
        } else {
          ctx.globalAlpha = this.editor_alpha;
        }
        ctx.imageSmoothingEnabled = false;
        if (!this._bg_img || this._bg_img.name != this.background_image) {
          this._bg_img = new Image();
          this._bg_img.name = this.background_image;
          this._bg_img.src = this.background_image;
          const that = this;
          this._bg_img.addEventListener("load", function() {
            that.draw(true, true);
          });
        }
        let pattern = this._pattern;
        if (pattern == null && this._bg_img.width > 0) {
          pattern = (_a = ctx.createPattern(this._bg_img, "repeat")) != null ? _a : void 0;
          this._pattern_img = this._bg_img;
          this._pattern = pattern;
        }
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(
            this.visible_area[0],
            this.visible_area[1],
            this.visible_area[2],
            this.visible_area[3]
          );
          ctx.fillStyle = "transparent";
        }
        ctx.globalAlpha = 1;
        ctx.imageSmoothingEnabled = true;
      }
      if (this.graph._groups.length) {
        this.drawGroups(canvas2, ctx);
      }
      (_b = this.onDrawBackground) == null ? void 0 : _b.call(this, ctx, this.visible_area);
      if (this.render_canvas_border) {
        ctx.strokeStyle = "#235";
        ctx.strokeRect(0, 0, canvas2.width, canvas2.height);
      }
      if (this.render_connections_shadows) {
        ctx.shadowColor = "#000";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 6;
      } else {
        ctx.shadowColor = "rgba(0,0,0,0)";
      }
      this.drawConnections(ctx);
      ctx.shadowColor = "rgba(0,0,0,0)";
      ctx.restore();
    }
    this.dirty_bgcanvas = false;
    this.dirty_canvas = true;
  }
  /**
   * draws the given node inside the canvas
   */
  drawNode(node2, ctx) {
    var _a, _b, _c;
    this.current_node = node2;
    const color = node2.renderingColor;
    const bgcolor = node2.renderingBgColor;
    const { low_quality, editor_alpha } = this;
    ctx.globalAlpha = editor_alpha;
    if (this.render_shadows && !low_quality) {
      ctx.shadowColor = LiteGraph.DEFAULT_SHADOW_COLOR;
      ctx.shadowOffsetX = 2 * this.ds.scale;
      ctx.shadowOffsetY = 2 * this.ds.scale;
      ctx.shadowBlur = 3 * this.ds.scale;
    } else {
      ctx.shadowColor = "transparent";
    }
    if (node2.flags.collapsed && ((_a = node2.onDrawCollapsed) == null ? void 0 : _a.call(node2, ctx, this)) == true)
      return;
    const shape = node2._shape || RenderShape.BOX;
    const size = __privateGet(_LGraphCanvas, _temp_vec2);
    size.set(node2.renderingSize);
    if (node2.collapsed) {
      ctx.font = this.inner_text_font;
    }
    if (node2.clip_area) {
      ctx.save();
      ctx.beginPath();
      if (shape == RenderShape.BOX) {
        ctx.rect(0, 0, size[0], size[1]);
      } else if (shape == RenderShape.ROUND) {
        ctx.roundRect(0, 0, size[0], size[1], [10]);
      } else if (shape == RenderShape.CIRCLE) {
        ctx.arc(size[0] * 0.5, size[1] * 0.5, size[0] * 0.5, 0, Math.PI * 2);
      }
      ctx.clip();
    }
    this.drawNodeShape(
      node2,
      ctx,
      size,
      color,
      bgcolor,
      !!node2.selected
    );
    if (!low_quality) {
      node2.drawBadges(ctx);
    }
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = LiteGraph.NODE_BOX_OUTLINE_COLOR;
    (_b = node2.onDrawForeground) == null ? void 0 : _b.call(node2, ctx, this, this.canvas);
    ctx.font = this.inner_text_font;
    if (!node2.collapsed) {
      const slotsBounds = node2.layoutSlots();
      const widgetStartY = slotsBounds ? slotsBounds[1] + slotsBounds[3] : 0;
      node2.layoutWidgets({ widgetStartY });
      node2.layoutWidgetInputSlots();
      node2.drawSlots(ctx, {
        fromSlot: (_c = this.linkConnector.renderLinks[0]) == null ? void 0 : _c.fromSlot,
        colorContext: this,
        editorAlpha: this.editor_alpha,
        lowQuality: this.low_quality
      });
      ctx.textAlign = "left";
      ctx.globalAlpha = 1;
      this.drawNodeWidgets(node2, widgetStartY, ctx);
    } else if (this.render_collapsed_slots) {
      node2.drawCollapsedSlots(ctx);
    }
    if (node2.clip_area) {
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
  /**
   * Draws the link mouseover effect and tooltip.
   * @param ctx Canvas 2D context to draw on
   * @param link The link to render the mouseover effect for
   * @remarks
   * Called against {@link LGraphCanvas.over_link_center}.
   * @todo Split tooltip from hover, so it can be drawn / eased separately
   */
  drawLinkTooltip(ctx, link) {
    var _a;
    const pos = link._pos;
    ctx.fillStyle = "black";
    ctx.beginPath();
    if (this.linkMarkerShape === LinkMarkerShape.Arrow) {
      const transform = ctx.getTransform();
      ctx.translate(pos[0], pos[1]);
      if (Number.isFinite(link._centreAngle)) ctx.rotate(link._centreAngle);
      ctx.moveTo(-2, -3);
      ctx.lineTo(4, 0);
      ctx.lineTo(-2, 3);
      ctx.setTransform(transform);
    } else if (this.linkMarkerShape == null || this.linkMarkerShape === LinkMarkerShape.Circle) {
      ctx.arc(pos[0], pos[1], 3, 0, Math.PI * 2);
    }
    ctx.fill();
    const { data } = link;
    if (data == null) return;
    if (((_a = this.onDrawLinkTooltip) == null ? void 0 : _a.call(this, ctx, link, this)) == true) return;
    let text = null;
    if (typeof data === "number")
      text = data.toFixed(2);
    else if (typeof data === "string")
      text = `"${data}"`;
    else if (typeof data === "boolean")
      text = String(data);
    else if (data.toToolTip)
      text = data.toToolTip();
    else
      text = `[${data.constructor.name}]`;
    if (text == null) return;
    text = text.substring(0, 30);
    ctx.font = "14px Courier New";
    const info = ctx.measureText(text);
    const w = info.width + 20;
    const h = 24;
    ctx.shadowColor = "black";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 3;
    ctx.fillStyle = "#454";
    ctx.beginPath();
    ctx.roundRect(pos[0] - w * 0.5, pos[1] - 15 - h, w, h, [3]);
    ctx.moveTo(pos[0] - 10, pos[1] - 15);
    ctx.lineTo(pos[0] + 10, pos[1] - 15);
    ctx.lineTo(pos[0], pos[1] - 5);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.textAlign = "center";
    ctx.fillStyle = "#CEC";
    ctx.fillText(text, pos[0], pos[1] - 15 - h * 0.3);
  }
  /**
   * Draws the shape of the given node on the canvas
   * @param node The node to draw
   * @param ctx 2D canvas rendering context used to draw
   * @param size Size of the background to draw, in graph units.  Differs from node size if collapsed, etc.
   * @param fgcolor Foreground colour - used for text
   * @param bgcolor Background colour of the node
   * @param _selected Whether to render the node as selected.  Likely to be removed in future, as current usage is simply the selected property of the node.
   */
  drawNodeShape(node2, ctx, size, fgcolor, bgcolor, _selected) {
    var _a, _b;
    ctx.strokeStyle = fgcolor;
    ctx.fillStyle = bgcolor;
    const title_height = LiteGraph.NODE_TITLE_HEIGHT;
    const { low_quality } = this;
    const { collapsed } = node2.flags;
    const shape = node2.renderingShape;
    const { title_mode } = node2;
    const render_title = title_mode == TitleMode.TRANSPARENT_TITLE || title_mode == TitleMode.NO_TITLE ? false : true;
    const area = __privateGet(_LGraphCanvas, _tmp_area);
    area.set(node2.boundingRect);
    area[0] -= node2.pos[0];
    area[1] -= node2.pos[1];
    const old_alpha = ctx.globalAlpha;
    ctx.beginPath();
    if (shape == RenderShape.BOX || low_quality) {
      ctx.fillRect(area[0], area[1], area[2], area[3]);
    } else if (shape == RenderShape.ROUND || shape == RenderShape.CARD) {
      ctx.roundRect(
        area[0],
        area[1],
        area[2],
        area[3],
        shape == RenderShape.CARD ? [LiteGraph.ROUND_RADIUS, LiteGraph.ROUND_RADIUS, 0, 0] : [LiteGraph.ROUND_RADIUS]
      );
    } else if (shape == RenderShape.CIRCLE) {
      ctx.arc(size[0] * 0.5, size[1] * 0.5, size[0] * 0.5, 0, Math.PI * 2);
    }
    ctx.fill();
    if (!collapsed && render_title) {
      ctx.shadowColor = "transparent";
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, -1, area[2], 2);
    }
    ctx.shadowColor = "transparent";
    (_a = node2.onDrawBackground) == null ? void 0 : _a.call(node2, ctx);
    if (render_title || title_mode == TitleMode.TRANSPARENT_TITLE) {
      node2.drawTitleBarBackground(ctx, {
        scale: this.ds.scale,
        low_quality
      });
      node2.drawTitleBox(ctx, {
        scale: this.ds.scale,
        low_quality,
        box_size: 10
      });
      ctx.globalAlpha = old_alpha;
      node2.drawTitleText(ctx, {
        scale: this.ds.scale,
        default_title_color: this.node_title_color,
        low_quality
      });
      (_b = node2.onDrawTitle) == null ? void 0 : _b.call(node2, ctx);
    }
    for (const getStyle of Object.values(node2.strokeStyles)) {
      const strokeStyle = getStyle.call(node2);
      if (strokeStyle) {
        strokeShape(ctx, area, {
          shape,
          title_height,
          title_mode,
          collapsed,
          ...strokeStyle
        });
      }
    }
    node2.drawProgressBar(ctx);
    if (node2.execute_triggered != null && node2.execute_triggered > 0) node2.execute_triggered--;
    if (node2.action_triggered != null && node2.action_triggered > 0) node2.action_triggered--;
  }
  /**
   * Draws a snap guide for a {@link Positionable} item.
   *
   * Initial design was a simple white rectangle representing the location the
   * item would land if dropped.
   * @param ctx The 2D canvas context to draw on
   * @param item The item to draw a snap guide for
   * @param shape The shape of the snap guide to draw
   * @todo Update to align snapping with boundingRect
   * @todo Shapes
   */
  drawSnapGuide(ctx, item, shape = RenderShape.ROUND) {
    const snapGuide = __privateGet(_LGraphCanvas, _temp);
    snapGuide.set(item.boundingRect);
    const { pos } = item;
    const offsetX = pos[0] - snapGuide[0];
    const offsetY = pos[1] - snapGuide[1];
    snapGuide[0] += offsetX;
    snapGuide[1] += offsetY;
    if (__privateGet(this, _snapToGrid)) snapPoint(snapGuide, __privateGet(this, _snapToGrid));
    snapGuide[0] -= offsetX;
    snapGuide[1] -= offsetY;
    const { globalAlpha } = ctx;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    const [x2, y, w, h] = snapGuide;
    if (shape === RenderShape.CIRCLE) {
      const midX = x2 + w * 0.5;
      const midY = y + h * 0.5;
      const radius = Math.min(w * 0.5, h * 0.5);
      ctx.arc(midX, midY, radius, 0, Math.PI * 2);
    } else {
      ctx.rect(x2, y, w, h);
    }
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "#FFFFFF66";
    ctx.fillStyle = "#FFFFFF22";
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = globalAlpha;
  }
  drawConnections(ctx) {
    this.renderedPaths.clear();
    if (this.links_render_mode === LinkRenderType.HIDDEN_LINK) return;
    const { graph } = this;
    if (!graph) throw new NullGraphError();
    const visibleReroutes = [];
    const now = LiteGraph.getTime();
    const { visible_area } = this;
    __privateGet(_LGraphCanvas, _margin_area)[0] = visible_area[0] - 20;
    __privateGet(_LGraphCanvas, _margin_area)[1] = visible_area[1] - 20;
    __privateGet(_LGraphCanvas, _margin_area)[2] = visible_area[2] + 40;
    __privateGet(_LGraphCanvas, _margin_area)[3] = visible_area[3] + 40;
    ctx.lineWidth = this.connections_width;
    ctx.fillStyle = "#AAA";
    ctx.strokeStyle = "#AAA";
    ctx.globalAlpha = this.editor_alpha;
    const nodes = graph._nodes;
    for (const node2 of nodes) {
      const { inputs } = node2;
      if (!(inputs == null ? void 0 : inputs.length)) continue;
      for (const [i, input] of inputs.entries()) {
        if (!input || input.link == null) continue;
        const link_id = input.link;
        const link = graph._links.get(link_id);
        if (!link) continue;
        const endPos = node2.getInputPos(i);
        const start_node = graph.getNodeById(link.origin_id);
        if (start_node == null) continue;
        const outputId = link.origin_slot;
        const startPos = outputId === -1 ? [start_node.pos[0] + 10, start_node.pos[1] + 10] : start_node.getOutputPos(outputId);
        const output = start_node.outputs[outputId];
        if (!output) continue;
        __privateMethod(this, _LGraphCanvas_instances, renderAllLinkSegments_fn).call(this, ctx, link, startPos, endPos, visibleReroutes, now, output.dir, input.dir);
      }
    }
    if (graph.floatingLinks.size > 0) {
      __privateMethod(this, _LGraphCanvas_instances, renderFloatingLinks_fn).call(this, ctx, graph, visibleReroutes, now);
    }
    visibleReroutes.sort((a, b) => a.linkIds.size - b.linkIds.size);
    for (const reroute of visibleReroutes) {
      if (__privateGet(this, _snapToGrid) && this.isDragging && this.selectedItems.has(reroute)) {
        this.drawSnapGuide(ctx, reroute, RenderShape.CIRCLE);
      }
      reroute.draw(ctx, this._pattern);
    }
    ctx.globalAlpha = 1;
  }
  /**
   * draws a link between two points
   * @param ctx Canvas 2D rendering context
   * @param a start pos
   * @param b end pos
   * @param link the link object with all the link info
   * @param skip_border ignore the shadow of the link
   * @param flow show flow animation (for events)
   * @param color the color for the link
   * @param start_dir the direction enum
   * @param end_dir the direction enum
   */
  renderLink(ctx, a, b, link, skip_border, flow, color, start_dir, end_dir, {
    startControl,
    endControl,
    reroute,
    num_sublines = 1,
    disabled = false
  } = {}) {
    var _a, _b;
    const linkColour = link != null && this.highlighted_links[link.id] ? "#FFF" : color || (link == null ? void 0 : link.color) || (link == null ? void 0 : link.type) != null && _LGraphCanvas.link_type_colors[link.type] || this.default_link_color;
    const startDir = start_dir || LinkDirection.RIGHT;
    const endDir = end_dir || LinkDirection.LEFT;
    const dist = this.links_render_mode == LinkRenderType.SPLINE_LINK && (!endControl || !startControl) ? distance(a, b) : 0;
    if (this.render_connections_border && !this.low_quality) {
      ctx.lineWidth = this.connections_width + 4;
    }
    ctx.lineJoin = "round";
    num_sublines || (num_sublines = 1);
    if (num_sublines > 1) ctx.lineWidth = 0.5;
    const path = new Path2D();
    const linkSegment = reroute != null ? reroute : link;
    if (linkSegment) linkSegment.path = path;
    const innerA = __privateGet(_LGraphCanvas, _lTempA);
    const innerB = __privateGet(_LGraphCanvas, _lTempB);
    const pos = (_a = linkSegment == null ? void 0 : linkSegment._pos) != null ? _a : [0, 0];
    for (let i = 0; i < num_sublines; i++) {
      const offsety = (i - (num_sublines - 1) * 0.5) * 5;
      innerA[0] = a[0];
      innerA[1] = a[1];
      innerB[0] = b[0];
      innerB[1] = b[1];
      if (this.links_render_mode == LinkRenderType.SPLINE_LINK) {
        if (endControl) {
          innerB[0] = b[0] + endControl[0];
          innerB[1] = b[1] + endControl[1];
        } else {
          __privateMethod(this, _LGraphCanvas_instances, addSplineOffset_fn).call(this, innerB, endDir, dist);
        }
        if (startControl) {
          innerA[0] = a[0] + startControl[0];
          innerA[1] = a[1] + startControl[1];
        } else {
          __privateMethod(this, _LGraphCanvas_instances, addSplineOffset_fn).call(this, innerA, startDir, dist);
        }
        path.moveTo(a[0], a[1] + offsety);
        path.bezierCurveTo(
          innerA[0],
          innerA[1] + offsety,
          innerB[0],
          innerB[1] + offsety,
          b[0],
          b[1] + offsety
        );
        findPointOnCurve(pos, a, b, innerA, innerB, 0.5);
        if (linkSegment && this.linkMarkerShape === LinkMarkerShape.Arrow) {
          const justPastCentre = __privateGet(_LGraphCanvas, _lTempC);
          findPointOnCurve(justPastCentre, a, b, innerA, innerB, 0.51);
          linkSegment._centreAngle = Math.atan2(
            justPastCentre[1] - pos[1],
            justPastCentre[0] - pos[0]
          );
        }
      } else {
        const l = this.links_render_mode == LinkRenderType.LINEAR_LINK ? 15 : 10;
        switch (startDir) {
          case LinkDirection.LEFT:
            innerA[0] += -l;
            break;
          case LinkDirection.RIGHT:
            innerA[0] += l;
            break;
          case LinkDirection.UP:
            innerA[1] += -l;
            break;
          case LinkDirection.DOWN:
            innerA[1] += l;
            break;
        }
        switch (endDir) {
          case LinkDirection.LEFT:
            innerB[0] += -l;
            break;
          case LinkDirection.RIGHT:
            innerB[0] += l;
            break;
          case LinkDirection.UP:
            innerB[1] += -l;
            break;
          case LinkDirection.DOWN:
            innerB[1] += l;
            break;
        }
        if (this.links_render_mode == LinkRenderType.LINEAR_LINK) {
          path.moveTo(a[0], a[1] + offsety);
          path.lineTo(innerA[0], innerA[1] + offsety);
          path.lineTo(innerB[0], innerB[1] + offsety);
          path.lineTo(b[0], b[1] + offsety);
          pos[0] = (innerA[0] + innerB[0]) * 0.5;
          pos[1] = (innerA[1] + innerB[1]) * 0.5;
          if (linkSegment && this.linkMarkerShape === LinkMarkerShape.Arrow) {
            linkSegment._centreAngle = Math.atan2(
              innerB[1] - innerA[1],
              innerB[0] - innerA[0]
            );
          }
        } else if (this.links_render_mode == LinkRenderType.STRAIGHT_LINK) {
          const midX = (innerA[0] + innerB[0]) * 0.5;
          path.moveTo(a[0], a[1]);
          path.lineTo(innerA[0], innerA[1]);
          path.lineTo(midX, innerA[1]);
          path.lineTo(midX, innerB[1]);
          path.lineTo(innerB[0], innerB[1]);
          path.lineTo(b[0], b[1]);
          pos[0] = midX;
          pos[1] = (innerA[1] + innerB[1]) * 0.5;
          if (linkSegment && this.linkMarkerShape === LinkMarkerShape.Arrow) {
            const diff = innerB[1] - innerA[1];
            if (Math.abs(diff) < 4) linkSegment._centreAngle = 0;
            else if (diff > 0) linkSegment._centreAngle = Math.PI * 0.5;
            else linkSegment._centreAngle = -(Math.PI * 0.5);
          }
        } else {
          return;
        }
      }
    }
    if (this.render_connections_border && !this.low_quality && !skip_border) {
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.stroke(path);
    }
    ctx.lineWidth = this.connections_width;
    ctx.fillStyle = ctx.strokeStyle = linkColour;
    ctx.stroke(path);
    if (this.ds.scale >= 0.6 && this.highquality_render && linkSegment) {
      if (this.render_connection_arrows) {
        const posA = this.computeConnectionPoint(a, b, 0.25, startDir, endDir);
        const posB = this.computeConnectionPoint(a, b, 0.26, startDir, endDir);
        const posC = this.computeConnectionPoint(a, b, 0.75, startDir, endDir);
        const posD = this.computeConnectionPoint(a, b, 0.76, startDir, endDir);
        let angleA = 0;
        let angleB = 0;
        if (this.render_curved_connections) {
          angleA = -Math.atan2(posB[0] - posA[0], posB[1] - posA[1]);
          angleB = -Math.atan2(posD[0] - posC[0], posD[1] - posC[1]);
        } else {
          angleB = angleA = b[1] > a[1] ? 0 : Math.PI;
        }
        const transform = ctx.getTransform();
        ctx.translate(posA[0], posA[1]);
        ctx.rotate(angleA);
        ctx.beginPath();
        ctx.moveTo(-5, -3);
        ctx.lineTo(0, 7);
        ctx.lineTo(5, -3);
        ctx.fill();
        ctx.setTransform(transform);
        ctx.translate(posC[0], posC[1]);
        ctx.rotate(angleB);
        ctx.beginPath();
        ctx.moveTo(-5, -3);
        ctx.lineTo(0, 7);
        ctx.lineTo(5, -3);
        ctx.fill();
        ctx.setTransform(transform);
      }
      ctx.beginPath();
      if (this.linkMarkerShape === LinkMarkerShape.Arrow) {
        const transform = ctx.getTransform();
        ctx.translate(pos[0], pos[1]);
        if (linkSegment._centreAngle) ctx.rotate(linkSegment._centreAngle);
        ctx.moveTo(-3.2, -5);
        ctx.lineTo(7, 0);
        ctx.lineTo(-3.2, 5);
        ctx.setTransform(transform);
      } else if (this.linkMarkerShape == null || this.linkMarkerShape === LinkMarkerShape.Circle) {
        ctx.arc(pos[0], pos[1], 5, 0, Math.PI * 2);
      }
      if (disabled) {
        const { fillStyle, globalAlpha } = ctx;
        ctx.fillStyle = (_b = this._pattern) != null ? _b : "#797979";
        ctx.globalAlpha = 0.75;
        ctx.fill();
        ctx.globalAlpha = globalAlpha;
        ctx.fillStyle = fillStyle;
      }
      ctx.fill();
    }
    if (flow) {
      ctx.fillStyle = linkColour;
      for (let i = 0; i < 5; ++i) {
        const f = (LiteGraph.getTime() * 1e-3 + i * 0.2) % 1;
        const flowPos = this.computeConnectionPoint(a, b, f, startDir, endDir);
        ctx.beginPath();
        ctx.arc(flowPos[0], flowPos[1], 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
  /**
   * Finds a point along a spline represented by a to b, with spline endpoint directions dictacted by start_dir and end_dir.
   * @param a Start point
   * @param b End point
   * @param t Time: distance between points (e.g 0.25 is 25% along the line)
   * @param start_dir Spline start direction
   * @param end_dir Spline end direction
   * @returns The point at {@link t} distance along the spline a-b.
   */
  computeConnectionPoint(a, b, t, start_dir, end_dir) {
    start_dir || (start_dir = LinkDirection.RIGHT);
    end_dir || (end_dir = LinkDirection.LEFT);
    const dist = distance(a, b);
    const pa = [a[0], a[1]];
    const pb = [b[0], b[1]];
    __privateMethod(this, _LGraphCanvas_instances, addSplineOffset_fn).call(this, pa, start_dir, dist);
    __privateMethod(this, _LGraphCanvas_instances, addSplineOffset_fn).call(this, pb, end_dir, dist);
    const c1 = (1 - t) * (1 - t) * (1 - t);
    const c2 = 3 * ((1 - t) * (1 - t)) * t;
    const c3 = 3 * (1 - t) * (t * t);
    const c4 = t * t * t;
    const x2 = c1 * a[0] + c2 * pa[0] + c3 * pb[0] + c4 * b[0];
    const y = c1 * a[1] + c2 * pa[1] + c3 * pb[1] + c4 * b[1];
    return [x2, y];
  }
  drawExecutionOrder(ctx) {
    ctx.shadowColor = "transparent";
    ctx.globalAlpha = 0.25;
    ctx.textAlign = "center";
    ctx.strokeStyle = "white";
    ctx.globalAlpha = 0.75;
    const { visible_nodes } = this;
    for (const node2 of visible_nodes) {
      ctx.fillStyle = "black";
      ctx.fillRect(
        node2.pos[0] - LiteGraph.NODE_TITLE_HEIGHT,
        node2.pos[1] - LiteGraph.NODE_TITLE_HEIGHT,
        LiteGraph.NODE_TITLE_HEIGHT,
        LiteGraph.NODE_TITLE_HEIGHT
      );
      if (node2.order == 0) {
        ctx.strokeRect(
          node2.pos[0] - LiteGraph.NODE_TITLE_HEIGHT + 0.5,
          node2.pos[1] - LiteGraph.NODE_TITLE_HEIGHT + 0.5,
          LiteGraph.NODE_TITLE_HEIGHT,
          LiteGraph.NODE_TITLE_HEIGHT
        );
      }
      ctx.fillStyle = "#FFF";
      ctx.fillText(
        stringOrEmpty(node2.order),
        node2.pos[0] + LiteGraph.NODE_TITLE_HEIGHT * -0.5,
        node2.pos[1] - 6
      );
    }
    ctx.globalAlpha = 1;
  }
  /**
   * draws the widgets stored inside a node
   * @deprecated Use {@link LGraphNode.drawWidgets} instead.
   * @remarks Currently there are extensions hijacking this function, so we cannot remove it.
   */
  drawNodeWidgets(node2, posY, ctx) {
    const { linkConnector } = this;
    node2.drawWidgets(ctx, {
      colorContext: this,
      linkOverWidget: linkConnector.overWidget,
      linkOverWidgetType: linkConnector.overWidgetType,
      lowQuality: this.low_quality,
      editorAlpha: this.editor_alpha
    });
  }
  /**
   * draws every group area in the background
   */
  drawGroups(canvas2, ctx) {
    if (!this.graph) return;
    const groups = this.graph._groups;
    ctx.save();
    ctx.globalAlpha = 0.5 * this.editor_alpha;
    const drawSnapGuides = __privateGet(this, _snapToGrid) && this.isDragging;
    for (const group of groups) {
      if (!overlapBounding(this.visible_area, group._bounding)) {
        continue;
      }
      if (drawSnapGuides && this.selectedItems.has(group))
        this.drawSnapGuide(ctx, group);
      group.draw(this, ctx);
    }
    ctx.restore();
  }
  /**
   * resizes the canvas to a given size, if no size is passed, then it tries to fill the parentNode
   * @todo Remove or rewrite
   */
  resize(width2, height) {
    if (!width2 && !height) {
      const parent = this.canvas.parentElement;
      if (!parent) throw new TypeError("Attempted to resize canvas, but parent element was null.");
      width2 = parent.offsetWidth;
      height = parent.offsetHeight;
    }
    if (this.canvas.width == width2 && this.canvas.height == height) return;
    this.canvas.width = width2 != null ? width2 : 0;
    this.canvas.height = height != null ? height : 0;
    this.bgcanvas.width = this.canvas.width;
    this.bgcanvas.height = this.canvas.height;
    this.setDirty(true, true);
  }
  onNodeSelectionChange() {
  }
  /**
   * Determines the furthest nodes in each direction for the currently selected nodes
   */
  boundaryNodesForSelection() {
    return _LGraphCanvas.getBoundaryNodes(this.selected_nodes);
  }
  showLinkMenu(segment, e2) {
    var _a, _b;
    const { graph } = this;
    if (!graph) throw new NullGraphError();
    const title = "data" in segment && segment.data != null ? segment.data.constructor.name : void 0;
    const { origin_id, origin_slot } = segment;
    if (origin_id == null || origin_slot == null) {
      new LiteGraph.ContextMenu(["Link has no origin"], {
        event: e2,
        title
      });
      return false;
    }
    const node_left = graph.getNodeById(origin_id);
    const fromType = (_b = (_a = node_left == null ? void 0 : node_left.outputs) == null ? void 0 : _a[origin_slot]) == null ? void 0 : _b.type;
    const options2 = ["Add Node", "Add Reroute", null, "Delete", null];
    const menu = new LiteGraph.ContextMenu(options2, {
      event: e2,
      title,
      callback: inner_clicked.bind(this)
    });
    return false;
    function inner_clicked(v2, options22, e22) {
      if (!graph) throw new NullGraphError();
      switch (v2) {
        case "Add Node":
          _LGraphCanvas.onMenuAdd(null, null, e22, menu, (node2) => {
            var _a2, _b2;
            if (!((_a2 = node2 == null ? void 0 : node2.inputs) == null ? void 0 : _a2.length) || !((_b2 = node2 == null ? void 0 : node2.outputs) == null ? void 0 : _b2.length) || origin_slot == null) return;
            const options3 = { afterRerouteId: segment.parentId };
            if (node_left == null ? void 0 : node_left.connectByType(origin_slot, node2, fromType != null ? fromType : "*", options3)) {
              node2.pos[0] -= node2.size[0] * 0.5;
            }
          });
          break;
        case "Add Reroute": {
          try {
            this.emitBeforeChange();
            this.adjustMouseEvent(e22);
            graph.createReroute(segment._pos, segment);
            this.setDirty(false, true);
          } catch (error) {
            console.error(error);
          } finally {
            this.emitAfterChange();
          }
          break;
        }
        case "Delete":
          graph.removeLink(segment.id);
          break;
      }
    }
  }
  createDefaultNodeForSlot(optPass) {
    const opts = Object.assign({
      nodeFrom: null,
      slotFrom: null,
      nodeTo: null,
      slotTo: null,
      position: [0, 0],
      nodeType: void 0,
      posAdd: [0, 0],
      posSizeFix: [0, 0]
    }, optPass);
    const { afterRerouteId } = opts;
    const isFrom = opts.nodeFrom && opts.slotFrom !== null;
    const isTo = !isFrom && opts.nodeTo && opts.slotTo !== null;
    if (!isFrom && !isTo) {
      console.warn(`No data passed to createDefaultNodeForSlot`, opts.nodeFrom, opts.slotFrom, opts.nodeTo, opts.slotTo);
      return false;
    }
    if (!opts.nodeType) {
      console.warn("No type to createDefaultNodeForSlot");
      return false;
    }
    const nodeX = isFrom ? opts.nodeFrom : opts.nodeTo;
    if (!nodeX) throw new TypeError("nodeX was null when creating default node for slot.");
    let slotX = isFrom ? opts.slotFrom : opts.slotTo;
    let iSlotConn = false;
    switch (typeof slotX) {
      case "string":
        iSlotConn = isFrom ? nodeX.findOutputSlot(slotX, false) : nodeX.findInputSlot(slotX, false);
        slotX = isFrom ? nodeX.outputs[slotX] : nodeX.inputs[slotX];
        break;
      case "object":
        if (slotX === null) {
          console.warn("Cant get slot information", slotX);
          return false;
        }
        iSlotConn = isFrom ? nodeX.findOutputSlot(slotX.name) : nodeX.findInputSlot(slotX.name);
        break;
      case "number":
        iSlotConn = slotX;
        slotX = isFrom ? nodeX.outputs[slotX] : nodeX.inputs[slotX];
        break;
      case "undefined":
      default:
        console.warn("Cant get slot information", slotX);
        return false;
    }
    const fromSlotType = slotX.type == LiteGraph.EVENT ? "_event_" : slotX.type;
    const slotTypesDefault = isFrom ? LiteGraph.slot_types_default_out : LiteGraph.slot_types_default_in;
    if (slotTypesDefault == null ? void 0 : slotTypesDefault[fromSlotType]) {
      let nodeNewType = false;
      if (typeof slotTypesDefault[fromSlotType] == "object") {
        for (const typeX in slotTypesDefault[fromSlotType]) {
          if (opts.nodeType == slotTypesDefault[fromSlotType][typeX] || opts.nodeType == "AUTO") {
            nodeNewType = slotTypesDefault[fromSlotType][typeX];
            break;
          }
        }
      } else if (opts.nodeType == slotTypesDefault[fromSlotType] || opts.nodeType == "AUTO") {
        nodeNewType = slotTypesDefault[fromSlotType];
      }
      if (nodeNewType) {
        let nodeNewOpts = false;
        if (typeof nodeNewType == "object" && nodeNewType.node) {
          nodeNewOpts = nodeNewType;
          nodeNewType = nodeNewType.node;
        }
        const newNode = LiteGraph.createNode(nodeNewType);
        if (newNode) {
          if (nodeNewOpts) {
            if (nodeNewOpts.properties) {
              for (const i in nodeNewOpts.properties) {
                newNode.addProperty(i, nodeNewOpts.properties[i]);
              }
            }
            if (nodeNewOpts.inputs) {
              newNode.inputs = [];
              for (const i in nodeNewOpts.inputs) {
                newNode.addOutput(
                  nodeNewOpts.inputs[i][0],
                  nodeNewOpts.inputs[i][1]
                );
              }
            }
            if (nodeNewOpts.outputs) {
              newNode.outputs = [];
              for (const i in nodeNewOpts.outputs) {
                newNode.addOutput(
                  nodeNewOpts.outputs[i][0],
                  nodeNewOpts.outputs[i][1]
                );
              }
            }
            if (nodeNewOpts.title) {
              newNode.title = nodeNewOpts.title;
            }
            if (nodeNewOpts.json) {
              newNode.configure(nodeNewOpts.json);
            }
          }
          if (!this.graph) throw new NullGraphError();
          this.graph.add(newNode);
          newNode.pos = [
            opts.position[0] + opts.posAdd[0] + (opts.posSizeFix[0] ? opts.posSizeFix[0] * newNode.size[0] : 0),
            opts.position[1] + opts.posAdd[1] + (opts.posSizeFix[1] ? opts.posSizeFix[1] * newNode.size[1] : 0)
          ];
          if (isFrom) {
            if (!opts.nodeFrom) throw new TypeError("createDefaultNodeForSlot - nodeFrom was null");
            opts.nodeFrom.connectByType(iSlotConn, newNode, fromSlotType, { afterRerouteId });
          } else {
            if (!opts.nodeTo) throw new TypeError("createDefaultNodeForSlot - nodeTo was null");
            opts.nodeTo.connectByTypeOutput(iSlotConn, newNode, fromSlotType, { afterRerouteId });
          }
          return true;
        }
        console.log(`failed creating ${nodeNewType}`);
      }
    }
    return false;
  }
  showConnectionMenu(optPass) {
    const opts = Object.assign({
      nodeFrom: null,
      slotFrom: null,
      nodeTo: null,
      slotTo: null,
      e: void 0,
      allow_searchbox: this.allow_searchbox,
      showSearchBox: this.showSearchBox
    }, optPass || {});
    const that = this;
    const { graph } = this;
    const { afterRerouteId } = opts;
    const isFrom = opts.nodeFrom && opts.slotFrom;
    const isTo = !isFrom && opts.nodeTo && opts.slotTo;
    if (!isFrom && !isTo) {
      console.warn("No data passed to showConnectionMenu");
      return;
    }
    const nodeX = isFrom ? opts.nodeFrom : opts.nodeTo;
    if (!nodeX) throw new TypeError("nodeX was null when creating default node for slot.");
    let slotX = isFrom ? opts.slotFrom : opts.slotTo;
    let iSlotConn;
    switch (typeof slotX) {
      case "string":
        iSlotConn = isFrom ? nodeX.findOutputSlot(slotX, false) : nodeX.findInputSlot(slotX, false);
        slotX = isFrom ? nodeX.outputs[slotX] : nodeX.inputs[slotX];
        break;
      case "object":
        if (slotX === null) {
          console.warn("Cant get slot information", slotX);
          return;
        }
        iSlotConn = isFrom ? nodeX.findOutputSlot(slotX.name) : nodeX.findInputSlot(slotX.name);
        break;
      case "number":
        iSlotConn = slotX;
        slotX = isFrom ? nodeX.outputs[slotX] : nodeX.inputs[slotX];
        break;
      default:
        console.warn("Cant get slot information", slotX);
        return;
    }
    const options2 = ["Add Node", "Add Reroute", null];
    if (opts.allow_searchbox) {
      options2.push("Search", null);
    }
    const fromSlotType = slotX.type == LiteGraph.EVENT ? "_event_" : slotX.type;
    const slotTypesDefault = isFrom ? LiteGraph.slot_types_default_out : LiteGraph.slot_types_default_in;
    if (slotTypesDefault == null ? void 0 : slotTypesDefault[fromSlotType]) {
      if (typeof slotTypesDefault[fromSlotType] == "object") {
        for (const typeX in slotTypesDefault[fromSlotType]) {
          options2.push(slotTypesDefault[fromSlotType][typeX]);
        }
      } else {
        options2.push(slotTypesDefault[fromSlotType]);
      }
    }
    const menu = new LiteGraph.ContextMenu(options2, {
      event: opts.e,
      extra: slotX,
      title: (slotX && slotX.name != "" ? slotX.name + (fromSlotType ? " | " : "") : "") + (slotX && fromSlotType ? fromSlotType : ""),
      callback: inner_clicked
    });
    const dirty = () => __privateMethod(this, _LGraphCanvas_instances, dirty_fn).call(this);
    function inner_clicked(v2, options22, e2) {
      var _a, _b, _c, _d;
      switch (v2) {
        case "Add Node":
          _LGraphCanvas.onMenuAdd(null, null, e2, menu, function(node2) {
            var _a2, _b2;
            if (!node2) return;
            if (isFrom) {
              (_a2 = opts.nodeFrom) == null ? void 0 : _a2.connectByType(iSlotConn, node2, fromSlotType, { afterRerouteId });
            } else {
              (_b2 = opts.nodeTo) == null ? void 0 : _b2.connectByTypeOutput(iSlotConn, node2, fromSlotType, { afterRerouteId });
            }
          });
          break;
        case "Add Reroute": {
          const node2 = isFrom ? opts.nodeFrom : opts.nodeTo;
          const slot = options22.extra;
          if (!graph) throw new NullGraphError();
          if (!node2) throw new TypeError("Cannot add reroute: node was null");
          if (!slot) throw new TypeError("Cannot add reroute: slot was null");
          if (!opts.e) throw new TypeError("Cannot add reroute: CanvasPointerEvent was null");
          const reroute = node2.connectFloatingReroute([opts.e.canvasX, opts.e.canvasY], slot, afterRerouteId);
          if (!reroute) throw new Error("Failed to create reroute");
          dirty();
          break;
        }
        case "Search":
          if (isFrom) {
            opts.showSearchBox(e2, { node_from: opts.nodeFrom, slot_from: slotX, type_filter_in: fromSlotType });
          } else {
            opts.showSearchBox(e2, { node_to: opts.nodeTo, slot_from: slotX, type_filter_out: fromSlotType });
          }
          break;
        default: {
          const customProps = {
            position: [(_b = (_a = opts.e) == null ? void 0 : _a.canvasX) != null ? _b : 0, (_d = (_c = opts.e) == null ? void 0 : _c.canvasY) != null ? _d : 0],
            nodeType: v2,
            afterRerouteId
          };
          const options3 = Object.assign(opts, customProps);
          that.createDefaultNodeForSlot(options3);
          break;
        }
      }
    }
  }
  // refactor: there are different dialogs, some uses createDialog some dont
  prompt(title, value, callback, event, multiline) {
    var _a;
    const that = this;
    title = title || "";
    const customProperties = {
      is_modified: false,
      className: "graphdialog rounded",
      innerHTML: multiline ? "<span class='name'></span> <textarea autofocus class='value'></textarea><button class='rounded'>OK</button>" : "<span class='name'></span> <input autofocus type='text' class='value'/><button class='rounded'>OK</button>",
      close() {
        that.prompt_box = null;
        if (dialog.parentNode) {
          dialog.remove();
        }
      }
    };
    const div = document.createElement("div");
    const dialog = Object.assign(div, customProperties);
    const graphcanvas = _LGraphCanvas.active_canvas;
    const { canvas: canvas2 } = graphcanvas;
    if (!canvas2.parentNode) throw new TypeError("canvas element parentNode was null when opening a prompt.");
    canvas2.parentNode.append(dialog);
    if (this.ds.scale > 1) dialog.style.transform = `scale(${this.ds.scale})`;
    let dialogCloseTimer;
    let prevent_timeout = 0;
    LiteGraph.pointerListenerAdd(dialog, "leave", function() {
      if (prevent_timeout) return;
      if (LiteGraph.dialog_close_on_mouse_leave) {
        if (!dialog.is_modified && LiteGraph.dialog_close_on_mouse_leave) {
          dialogCloseTimer = setTimeout(
            dialog.close,
            LiteGraph.dialog_close_on_mouse_leave_delay
          );
        }
      }
    });
    LiteGraph.pointerListenerAdd(dialog, "enter", function() {
      if (LiteGraph.dialog_close_on_mouse_leave && dialogCloseTimer)
        clearTimeout(dialogCloseTimer);
    });
    const selInDia = dialog.querySelectorAll("select");
    if (selInDia) {
      for (const selIn of selInDia) {
        selIn.addEventListener("click", function() {
          prevent_timeout++;
        });
        selIn.addEventListener("blur", function() {
          prevent_timeout = 0;
        });
        selIn.addEventListener("change", function() {
          prevent_timeout = -1;
        });
      }
    }
    (_a = this.prompt_box) == null ? void 0 : _a.close();
    this.prompt_box = dialog;
    const name_element = dialog.querySelector(".name");
    if (!name_element) throw new TypeError("name_element was null");
    name_element.textContent = title;
    const value_element = dialog.querySelector(".value");
    if (!value_element) throw new TypeError("value_element was null");
    value_element.value = value;
    value_element.select();
    const input = value_element;
    input.addEventListener("keydown", function(e2) {
      dialog.is_modified = true;
      if (e2.key == "Escape") {
        dialog.close();
      } else if (e2.key == "Enter" && e2.target.localName != "textarea") {
        if (callback) {
          callback(this.value);
        }
        dialog.close();
      } else {
        return;
      }
      e2.preventDefault();
      e2.stopPropagation();
    });
    const button = dialog.querySelector("button");
    if (!button) throw new TypeError("button was null when opening prompt");
    button.addEventListener("click", function() {
      callback == null ? void 0 : callback(input.value);
      that.setDirty(true);
      dialog.close();
    });
    const rect = canvas2.getBoundingClientRect();
    let offsetx = -20;
    let offsety = -20;
    if (rect) {
      offsetx -= rect.left;
      offsety -= rect.top;
    }
    if (event) {
      dialog.style.left = `${event.clientX + offsetx}px`;
      dialog.style.top = `${event.clientY + offsety}px`;
    } else {
      dialog.style.left = `${canvas2.width * 0.5 + offsetx}px`;
      dialog.style.top = `${canvas2.height * 0.5 + offsety}px`;
    }
    setTimeout(function() {
      var _a2, _b;
      input.focus();
      const clickTime = Date.now();
      function handleOutsideClick(e2) {
        var _a3, _b2;
        if (e2.target === canvas2 && Date.now() - clickTime > 256) {
          dialog.close();
          (_a3 = canvas2.parentElement) == null ? void 0 : _a3.removeEventListener("click", handleOutsideClick);
          (_b2 = canvas2.parentElement) == null ? void 0 : _b2.removeEventListener("touchend", handleOutsideClick);
        }
      }
      (_a2 = canvas2.parentElement) == null ? void 0 : _a2.addEventListener("click", handleOutsideClick);
      (_b = canvas2.parentElement) == null ? void 0 : _b.addEventListener("touchend", handleOutsideClick);
    }, 10);
    return dialog;
  }
  showSearchBox(event, searchOptions) {
    var _a;
    const options2 = {
      slot_from: null,
      node_from: null,
      node_to: null,
      // TODO check for registered_slot_[in/out]_types not empty
      // this will be checked for functionality enabled : filter on slot type, in and out
      do_type_filter: LiteGraph.search_filter_enabled,
      // these are default: pass to set initially set values
      // @ts-expect-error
      type_filter_in: false,
      type_filter_out: false,
      show_general_if_none_on_typefilter: true,
      show_general_after_typefiltered: true,
      hide_on_mouse_leave: LiteGraph.search_hide_on_mouse_leave,
      show_all_if_empty: true,
      show_all_on_open: LiteGraph.search_show_all_on_open
    };
    Object.assign(options2, searchOptions);
    const that = this;
    const graphcanvas = _LGraphCanvas.active_canvas;
    const { canvas: canvas2 } = graphcanvas;
    const root_document = canvas2.ownerDocument || document;
    const div = document.createElement("div");
    const dialog = Object.assign(div, {
      close() {
        that.search_box = void 0;
        this.blur();
        canvas2.focus();
        root_document.body.style.overflow = "";
        setTimeout(() => canvas2.focus(), 20);
        dialog.remove();
      }
    });
    dialog.className = "litegraph litesearchbox graphdialog rounded";
    dialog.innerHTML = "<span class='name'>Search</span> <input autofocus type='text' class='value rounded'/>";
    if (options2.do_type_filter) {
      dialog.innerHTML += "<select class='slot_in_type_filter'><option value=''></option></select>";
      dialog.innerHTML += "<select class='slot_out_type_filter'><option value=''></option></select>";
    }
    const helper = document.createElement("div");
    helper.className = "helper";
    dialog.append(helper);
    if (root_document.fullscreenElement) {
      root_document.fullscreenElement.append(dialog);
    } else {
      root_document.body.append(dialog);
      root_document.body.style.overflow = "hidden";
    }
    let selIn;
    let selOut;
    if (options2.do_type_filter) {
      selIn = dialog.querySelector(".slot_in_type_filter");
      selOut = dialog.querySelector(".slot_out_type_filter");
    }
    if (this.ds.scale > 1) {
      dialog.style.transform = `scale(${this.ds.scale})`;
    }
    if (options2.hide_on_mouse_leave) {
      let prevent_timeout = false;
      let timeout_close = null;
      LiteGraph.pointerListenerAdd(dialog, "enter", function() {
        if (timeout_close) {
          clearTimeout(timeout_close);
          timeout_close = null;
        }
      });
      dialog.addEventListener("pointerleave", function() {
        if (prevent_timeout) return;
        const hideDelay = options2.hide_on_mouse_leave;
        const delay = typeof hideDelay === "number" ? hideDelay : 500;
        timeout_close = setTimeout(dialog.close, delay);
      });
      if (options2.do_type_filter) {
        if (!selIn) throw new TypeError("selIn was null when showing search box");
        if (!selOut) throw new TypeError("selOut was null when showing search box");
        selIn.addEventListener("click", function() {
          prevent_timeout++;
        });
        selIn.addEventListener("blur", function() {
          prevent_timeout = 0;
        });
        selIn.addEventListener("change", function() {
          prevent_timeout = -1;
        });
        selOut.addEventListener("click", function() {
          prevent_timeout++;
        });
        selOut.addEventListener("blur", function() {
          prevent_timeout = 0;
        });
        selOut.addEventListener("change", function() {
          prevent_timeout = -1;
        });
      }
    }
    (_a = that.search_box) == null ? void 0 : _a.close();
    that.search_box = dialog;
    let first = null;
    let timeout = null;
    let selected = null;
    const maybeInput = dialog.querySelector("input");
    if (!maybeInput) throw new TypeError("Could not create search input box.");
    const input = maybeInput;
    if (input) {
      input.addEventListener("blur", function() {
        this.focus();
      });
      input.addEventListener("keydown", function(e2) {
        if (e2.key == "ArrowUp") {
          changeSelection(false);
        } else if (e2.key == "ArrowDown") {
          changeSelection(true);
        } else if (e2.key == "Escape") {
          dialog.close();
        } else if (e2.key == "Enter") {
          if (selected instanceof HTMLElement) {
            select(unescape(String(selected.dataset.type)));
          } else if (first) {
            select(first);
          } else {
            dialog.close();
          }
        } else {
          if (timeout) {
            clearInterval(timeout);
          }
          timeout = setTimeout(refreshHelper, 10);
          return;
        }
        e2.preventDefault();
        e2.stopPropagation();
        e2.stopImmediatePropagation();
        return true;
      });
    }
    if (options2.do_type_filter) {
      if (selIn) {
        const aSlots = LiteGraph.slot_types_in;
        const nSlots = aSlots.length;
        if (options2.type_filter_in == LiteGraph.EVENT || options2.type_filter_in == LiteGraph.ACTION) {
          options2.type_filter_in = "_event_";
        }
        for (let iK = 0; iK < nSlots; iK++) {
          const opt = document.createElement("option");
          opt.value = aSlots[iK];
          opt.innerHTML = aSlots[iK];
          selIn.append(opt);
          if (
            // @ts-expect-error
            options2.type_filter_in !== false && String(options2.type_filter_in).toLowerCase() == String(aSlots[iK]).toLowerCase()
          ) {
            opt.selected = true;
          }
        }
        selIn.addEventListener("change", function() {
          refreshHelper();
        });
      }
      if (selOut) {
        const aSlots = LiteGraph.slot_types_out;
        if (options2.type_filter_out == LiteGraph.EVENT || options2.type_filter_out == LiteGraph.ACTION) {
          options2.type_filter_out = "_event_";
        }
        for (const aSlot of aSlots) {
          const opt = document.createElement("option");
          opt.value = aSlot;
          opt.innerHTML = aSlot;
          selOut.append(opt);
          if (options2.type_filter_out !== false && String(options2.type_filter_out).toLowerCase() == String(aSlot).toLowerCase()) {
            opt.selected = true;
          }
        }
        selOut.addEventListener("change", function() {
          refreshHelper();
        });
      }
    }
    const rect = canvas2.getBoundingClientRect();
    const left = (event ? event.clientX : rect.left + rect.width * 0.5) - 80;
    const top = (event ? event.clientY : rect.top + rect.height * 0.5) - 20;
    dialog.style.left = `${left}px`;
    dialog.style.top = `${top}px`;
    if (event.layerY > rect.height - 200) {
      helper.style.maxHeight = `${rect.height - event.layerY - 20}px`;
    }
    requestAnimationFrame(function() {
      input.focus();
    });
    if (options2.show_all_on_open) refreshHelper();
    function select(name) {
      if (name) {
        if (that.onSearchBoxSelection) {
          that.onSearchBoxSelection(name, event, graphcanvas);
        } else {
          if (!graphcanvas.graph) throw new NullGraphError();
          graphcanvas.graph.beforeChange();
          const node2 = LiteGraph.createNode(name);
          if (node2) {
            node2.pos = graphcanvas.convertEventToCanvasOffset(event);
            graphcanvas.graph.add(node2, false);
          }
          if (options2.node_from) {
            let iS = false;
            switch (typeof options2.slot_from) {
              case "string":
                iS = options2.node_from.findOutputSlot(options2.slot_from);
                break;
              case "object":
                if (options2.slot_from == null) throw new TypeError("options.slot_from was null when showing search box");
                iS = options2.slot_from.name ? options2.node_from.findOutputSlot(options2.slot_from.name) : -1;
                if (iS == -1 && options2.slot_from.slot_index !== void 0) iS = options2.slot_from.slot_index;
                break;
              case "number":
                iS = options2.slot_from;
                break;
              default:
                iS = 0;
            }
            if (options2.node_from.outputs[iS] !== void 0) {
              if (iS !== false && iS > -1) {
                if (node2 == null) throw new TypeError("options.slot_from was null when showing search box");
                options2.node_from.connectByType(iS, node2, options2.node_from.outputs[iS].type);
              }
            }
          }
          if (options2.node_to) {
            let iS = false;
            switch (typeof options2.slot_from) {
              case "string":
                iS = options2.node_to.findInputSlot(options2.slot_from);
                break;
              case "object":
                if (options2.slot_from == null) throw new TypeError("options.slot_from was null when showing search box");
                iS = options2.slot_from.name ? options2.node_to.findInputSlot(options2.slot_from.name) : -1;
                if (iS == -1 && options2.slot_from.slot_index !== void 0) iS = options2.slot_from.slot_index;
                break;
              case "number":
                iS = options2.slot_from;
                break;
              default:
                iS = 0;
            }
            if (options2.node_to.inputs[iS] !== void 0) {
              if (iS !== false && iS > -1) {
                if (node2 == null) throw new TypeError("options.slot_from was null when showing search box");
                options2.node_to.connectByTypeOutput(iS, node2, options2.node_to.inputs[iS].type);
              }
            }
          }
          graphcanvas.graph.afterChange();
        }
      }
      dialog.close();
    }
    function changeSelection(forward) {
      const prev = selected;
      if (!selected) {
        selected = forward ? helper.childNodes[0] : helper.childNodes[helper.childNodes.length];
      } else if (selected instanceof Element) {
        selected.classList.remove("selected");
        selected = forward ? selected.nextSibling : selected.previousSibling;
        selected || (selected = prev);
      }
      if (selected instanceof Element) {
        selected.classList.add("selected");
        selected.scrollIntoView({ block: "end", behavior: "smooth" });
      }
    }
    function refreshHelper() {
      timeout = null;
      let str = input.value;
      first = null;
      helper.innerHTML = "";
      if (!str && !options2.show_all_if_empty) return;
      if (that.onSearchBox) {
        const list = that.onSearchBox(helper, str, graphcanvas);
        if (list) {
          for (const item of list) {
            addResult(item);
          }
        }
      } else {
        let inner_test_filter = function(type, optsIn) {
          var _a2, _b;
          optsIn = optsIn || {};
          const optsDef = {
            skipFilter: false,
            inTypeOverride: false,
            outTypeOverride: false
          };
          const opts = Object.assign(optsDef, optsIn);
          const ctor = LiteGraph.registered_node_types[type];
          if (filter && ctor.filter != filter) return false;
          if ((!options2.show_all_if_empty || str) && !type.toLowerCase().includes(str) && (!ctor.title || !ctor.title.toLowerCase().includes(str))) {
            return false;
          }
          if (options2.do_type_filter && !opts.skipFilter) {
            const sType = type;
            let sV = opts.inTypeOverride !== false ? opts.inTypeOverride : sIn.value;
            if (sIn && sV && ((_a2 = LiteGraph.registered_slot_in_types[sV]) == null ? void 0 : _a2.nodes)) {
              const doesInc = LiteGraph.registered_slot_in_types[sV].nodes.includes(sType);
              if (doesInc === false) return false;
            }
            sV = sOut.value;
            if (opts.outTypeOverride !== false) sV = opts.outTypeOverride;
            if (sOut && sV && ((_b = LiteGraph.registered_slot_out_types[sV]) == null ? void 0 : _b.nodes)) {
              const doesInc = LiteGraph.registered_slot_out_types[sV].nodes.includes(sType);
              if (doesInc === false) return false;
            }
          }
          return true;
        };
        let c = 0;
        str = str.toLowerCase();
        if (!graphcanvas.graph) throw new NullGraphError();
        const filter = graphcanvas.filter || graphcanvas.graph.filter;
        let sIn = false;
        let sOut = false;
        if (options2.do_type_filter && that.search_box) {
          sIn = that.search_box.querySelector(".slot_in_type_filter");
          sOut = that.search_box.querySelector(".slot_out_type_filter");
        }
        const keys = Object.keys(LiteGraph.registered_node_types);
        const filtered = keys.filter((x2) => inner_test_filter(x2));
        for (const item of filtered) {
          addResult(item);
          if (_LGraphCanvas.search_limit !== -1 && c++ > _LGraphCanvas.search_limit)
            break;
        }
        if (options2.show_general_after_typefiltered && (sIn.value || sOut.value)) {
          filtered_extra = [];
          for (const i in LiteGraph.registered_node_types) {
            if (inner_test_filter(i, {
              inTypeOverride: sIn && sIn.value ? "*" : false,
              outTypeOverride: sOut && sOut.value ? "*" : false
            })) {
              filtered_extra.push(i);
            }
          }
          for (const extraItem of filtered_extra) {
            addResult(extraItem, "generic_type");
            if (_LGraphCanvas.search_limit !== -1 && c++ > _LGraphCanvas.search_limit)
              break;
          }
        }
        if ((sIn.value || sOut.value) && helper.childNodes.length == 0 && options2.show_general_if_none_on_typefilter) {
          filtered_extra = [];
          for (const i in LiteGraph.registered_node_types) {
            if (inner_test_filter(i, { skipFilter: true }))
              filtered_extra.push(i);
          }
          for (const extraItem of filtered_extra) {
            addResult(extraItem, "not_in_filter");
            if (_LGraphCanvas.search_limit !== -1 && c++ > _LGraphCanvas.search_limit)
              break;
          }
        }
      }
      function addResult(type, className) {
        const help = document.createElement("div");
        first || (first = type);
        const nodeType = LiteGraph.registered_node_types[type];
        if (nodeType == null ? void 0 : nodeType.title) {
          help.textContent = nodeType == null ? void 0 : nodeType.title;
          const typeEl = document.createElement("span");
          typeEl.className = "litegraph lite-search-item-type";
          typeEl.textContent = type;
          help.append(typeEl);
        } else {
          help.textContent = type;
        }
        help.dataset["type"] = escape(type);
        help.className = "litegraph lite-search-item";
        if (className) {
          help.className += ` ${className}`;
        }
        help.addEventListener("click", function() {
          select(unescape(String(this.dataset.type)));
        });
        helper.append(help);
      }
    }
    return dialog;
  }
  showEditPropertyValue(node2, property, options2) {
    if (!node2 || node2.properties[property] === void 0) return;
    options2 = options2 || {};
    const info = node2.getPropertyInfo(property);
    const { type } = info;
    let input_html = "";
    if (type == "string" || type == "number" || type == "array" || type == "object") {
      input_html = "<input autofocus type='text' class='value'/>";
    } else if ((type == "enum" || type == "combo") && info.values) {
      input_html = "<select autofocus type='text' class='value'>";
      for (const i in info.values) {
        const v2 = Array.isArray(info.values) ? info.values[i] : i;
        const selected = v2 == node2.properties[property] ? "selected" : "";
        input_html += `<option value='${v2}' ${selected}>${info.values[i]}</option>`;
      }
      input_html += "</select>";
    } else if (type == "boolean" || type == "toggle") {
      const checked = node2.properties[property] ? "checked" : "";
      input_html = `<input autofocus type='checkbox' class='value' ${checked}/>`;
    } else {
      console.warn(`unknown type: ${type}`);
      return;
    }
    const dialog = this.createDialog(
      `<span class='name'>${info.label || property}</span>${input_html}<button>OK</button>`,
      options2
    );
    let input;
    if ((type == "enum" || type == "combo") && info.values) {
      input = dialog.querySelector("select");
      input == null ? void 0 : input.addEventListener("change", function(e2) {
        var _a;
        dialog.modified();
        setValue((_a = e2.target) == null ? void 0 : _a.value);
      });
    } else if (type == "boolean" || type == "toggle") {
      input = dialog.querySelector("input");
      input == null ? void 0 : input.addEventListener("click", function() {
        dialog.modified();
        setValue(!!input.checked);
      });
    } else {
      input = dialog.querySelector("input");
      if (input) {
        input.addEventListener("blur", function() {
          this.focus();
        });
        let v2 = node2.properties[property] !== void 0 ? node2.properties[property] : "";
        if (type !== "string") {
          v2 = JSON.stringify(v2);
        }
        input.value = v2;
        input.addEventListener("keydown", function(e2) {
          if (e2.key == "Escape") {
            dialog.close();
          } else if (e2.key == "Enter") {
            inner();
          } else {
            dialog.modified();
            return;
          }
          e2.preventDefault();
          e2.stopPropagation();
        });
      }
    }
    input == null ? void 0 : input.focus();
    const button = dialog.querySelector("button");
    if (!button) throw new TypeError("Show edit property value button was null.");
    button.addEventListener("click", inner);
    function inner() {
      setValue(input == null ? void 0 : input.value);
    }
    const dirty = () => __privateMethod(this, _LGraphCanvas_instances, dirty_fn).call(this);
    function setValue(value) {
      var _a, _b;
      if ((info == null ? void 0 : info.values) && typeof info.values === "object" && info.values[value] != void 0) {
        value = info.values[value];
      }
      if (typeof node2.properties[property] == "number") {
        value = Number(value);
      }
      if (type == "array" || type == "object") {
        value = JSON.parse(value);
      }
      node2.properties[property] = value;
      if (node2.graph) {
        node2.graph._version++;
      }
      (_a = node2.onPropertyChanged) == null ? void 0 : _a.call(node2, property, value);
      (_b = options2.onclose) == null ? void 0 : _b.call(options2);
      dialog.close();
      dirty();
    }
    return dialog;
  }
  // TODO refactor, theer are different dialog, some uses createDialog, some dont
  createDialog(html, options2) {
    const def_options = {
      checkForInput: false,
      closeOnLeave: true,
      closeOnLeave_checkModified: true
    };
    options2 = Object.assign(def_options, options2 || {});
    const customProperties = {
      className: "graphdialog",
      innerHTML: html,
      is_modified: false,
      modified() {
        this.is_modified = true;
      },
      close() {
        this.remove();
      }
    };
    const div = document.createElement("div");
    const dialog = Object.assign(div, customProperties);
    const rect = this.canvas.getBoundingClientRect();
    let offsetx = -20;
    let offsety = -20;
    if (rect) {
      offsetx -= rect.left;
      offsety -= rect.top;
    }
    if (options2.position) {
      offsetx += options2.position[0];
      offsety += options2.position[1];
    } else if (options2.event) {
      offsetx += options2.event.clientX;
      offsety += options2.event.clientY;
    } else {
      offsetx += this.canvas.width * 0.5;
      offsety += this.canvas.height * 0.5;
    }
    dialog.style.left = `${offsetx}px`;
    dialog.style.top = `${offsety}px`;
    if (!this.canvas.parentNode) throw new TypeError("Canvas parent element was null.");
    this.canvas.parentNode.append(dialog);
    if (options2.checkForInput) {
      const aI = dialog.querySelectorAll("input");
      if (aI) {
        for (const iX of aI) {
          iX.addEventListener("keydown", function(e2) {
            dialog.modified();
            if (e2.key == "Escape") {
              dialog.close();
            } else if (e2.key != "Enter") {
              return;
            }
            e2.preventDefault();
            e2.stopPropagation();
          });
          iX.focus();
        }
      }
    }
    let dialogCloseTimer;
    let prevent_timeout = 0;
    dialog.addEventListener("mouseleave", function() {
      if (prevent_timeout) return;
      if (!dialog.is_modified && LiteGraph.dialog_close_on_mouse_leave) {
        dialogCloseTimer = setTimeout(
          dialog.close,
          LiteGraph.dialog_close_on_mouse_leave_delay
        );
      }
    });
    dialog.addEventListener("mouseenter", function() {
      if (options2.closeOnLeave || LiteGraph.dialog_close_on_mouse_leave) {
        if (dialogCloseTimer) clearTimeout(dialogCloseTimer);
      }
    });
    const selInDia = dialog.querySelectorAll("select");
    if (selInDia) {
      for (const selIn of selInDia) {
        selIn.addEventListener("click", function() {
          prevent_timeout++;
        });
        selIn.addEventListener("blur", function() {
          prevent_timeout = 0;
        });
        selIn.addEventListener("change", function() {
          prevent_timeout = -1;
        });
      }
    }
    return dialog;
  }
  createPanel(title, options2) {
    options2 = options2 || {};
    const ref_window = options2.window || window;
    const root = document.createElement("div");
    root.className = "litegraph dialog";
    root.innerHTML = "<div class='dialog-header'><span class='dialog-title'></span></div><div class='dialog-content'></div><div style='display:none;' class='dialog-alt-content'></div><div class='dialog-footer'></div>";
    root.header = root.querySelector(".dialog-header");
    if (options2.width)
      root.style.width = options2.width + (typeof options2.width === "number" ? "px" : "");
    if (options2.height)
      root.style.height = options2.height + (typeof options2.height === "number" ? "px" : "");
    if (options2.closable) {
      const close = document.createElement("span");
      close.innerHTML = "&#10005;";
      close.classList.add("close");
      close.addEventListener("click", function() {
        root.close();
      });
      root.header.append(close);
    }
    root.title_element = root.querySelector(".dialog-title");
    root.title_element.textContent = title;
    root.content = root.querySelector(".dialog-content");
    root.alt_content = root.querySelector(".dialog-alt-content");
    root.footer = root.querySelector(".dialog-footer");
    root.close = function() {
      if (typeof root.onClose == "function") root.onClose();
      root.remove();
      this.remove();
    };
    root.toggleAltContent = function(force) {
      let vTo;
      let vAlt;
      if (force !== void 0) {
        vTo = force ? "block" : "none";
        vAlt = force ? "none" : "block";
      } else {
        vTo = root.alt_content.style.display != "block" ? "block" : "none";
        vAlt = root.alt_content.style.display != "block" ? "none" : "block";
      }
      root.alt_content.style.display = vTo;
      root.content.style.display = vAlt;
    };
    root.toggleFooterVisibility = function(force) {
      let vTo;
      if (force !== void 0) {
        vTo = force ? "block" : "none";
      } else {
        vTo = root.footer.style.display != "block" ? "block" : "none";
      }
      root.footer.style.display = vTo;
    };
    root.clear = function() {
      this.content.innerHTML = "";
    };
    root.addHTML = function(code, classname, on_footer) {
      const elem = document.createElement("div");
      if (classname) elem.className = classname;
      elem.innerHTML = code;
      if (on_footer) root.footer.append(elem);
      else root.content.append(elem);
      return elem;
    };
    root.addButton = function(name, callback, options22) {
      const elem = document.createElement("button");
      elem.textContent = name;
      elem.options = options22;
      elem.classList.add("btn");
      elem.addEventListener("click", callback);
      root.footer.append(elem);
      return elem;
    };
    root.addSeparator = function() {
      const elem = document.createElement("div");
      elem.className = "separator";
      root.content.append(elem);
    };
    root.addWidget = function(type, name, value, options22, callback) {
      options22 = options22 || {};
      let str_value = String(value);
      type = type.toLowerCase();
      if (type == "number" && typeof value === "number") str_value = value.toFixed(3);
      const elem = document.createElement("div");
      elem.className = "property";
      elem.innerHTML = "<span class='property_name'></span><span class='property_value'></span>";
      const nameSpan = elem.querySelector(".property_name");
      if (!nameSpan) throw new TypeError("Property name element was null.");
      nameSpan.textContent = options22.label || name;
      const value_element = elem.querySelector(".property_value");
      if (!value_element) throw new TypeError("Property name element was null.");
      value_element.textContent = str_value;
      elem.dataset["property"] = name;
      elem.dataset["type"] = options22.type || type;
      elem.options = options22;
      elem.value = value;
      if (type == "code") {
        elem.addEventListener("click", function() {
          root.inner_showCodePad(this.dataset["property"]);
        });
      } else if (type == "boolean") {
        elem.classList.add("boolean");
        if (value) elem.classList.add("bool-on");
        elem.addEventListener("click", () => {
          const propname = elem.dataset["property"];
          elem.value = !elem.value;
          elem.classList.toggle("bool-on");
          if (!value_element) throw new TypeError("Property name element was null.");
          value_element.textContent = elem.value ? "true" : "false";
          innerChange(propname, elem.value);
        });
      } else if (type == "string" || type == "number") {
        if (!value_element) throw new TypeError("Property name element was null.");
        value_element.setAttribute("contenteditable", "true");
        value_element.addEventListener("keydown", function(e2) {
          if (e2.code == "Enter" && (type != "string" || !e2.shiftKey)) {
            e2.preventDefault();
            this.blur();
          }
        });
        value_element.addEventListener("blur", function() {
          var _a, _b;
          let v2 = this.textContent;
          const propname = (_a = this.parentElement) == null ? void 0 : _a.dataset["property"];
          const proptype = (_b = this.parentElement) == null ? void 0 : _b.dataset["type"];
          if (proptype == "number") v2 = Number(v2);
          innerChange(propname, v2);
        });
      } else if (type == "enum" || type == "combo") {
        const str_value2 = _LGraphCanvas.getPropertyPrintableValue(value, options22.values);
        if (!value_element) throw new TypeError("Property name element was null.");
        value_element.textContent = str_value2 != null ? str_value2 : "";
        value_element.addEventListener("click", function(event) {
          var _a;
          const values = options22.values || [];
          const propname = (_a = this.parentElement) == null ? void 0 : _a.dataset["property"];
          const inner_clicked = (v2) => {
            this.textContent = v2;
            innerChange(propname, v2);
            return false;
          };
          new LiteGraph.ContextMenu(
            values,
            {
              event,
              className: "dark",
              callback: inner_clicked
            },
            // @ts-expect-error
            ref_window
          );
        });
      }
      root.content.append(elem);
      function innerChange(name2, value2) {
        var _a;
        (_a = options22.callback) == null ? void 0 : _a.call(options22, name2, value2, options22);
        callback == null ? void 0 : callback(name2, value2, options22);
      }
      return elem;
    };
    if (typeof root.onOpen == "function") root.onOpen();
    return root;
  }
  closePanels() {
    var _a, _b, _c, _d;
    (_b = (_a = document.querySelector("#node-panel")) == null ? void 0 : _a.close) == null ? void 0 : _b.call(_a);
    (_d = (_c = document.querySelector("#option-panel")) == null ? void 0 : _c.close) == null ? void 0 : _d.call(_c);
  }
  showShowNodePanel(node2) {
    this.SELECTED_NODE = node2;
    this.closePanels();
    const ref_window = this.getCanvasWindow();
    const panel = this.createPanel(node2.title || "", {
      closable: true,
      window: ref_window,
      onOpen: () => {
        this.NODEPANEL_IS_OPEN = true;
      },
      onClose: () => {
        this.NODEPANEL_IS_OPEN = false;
        this.node_panel = null;
      }
    });
    this.node_panel = panel;
    panel.id = "node-panel";
    panel.node = node2;
    panel.classList.add("settings");
    const inner_refresh = () => {
      var _a, _b;
      panel.content.innerHTML = "";
      panel.addHTML(`<span class='node_type'>${node2.type}</span><span class='node_desc'>${node2.constructor.desc || ""}</span><span class='separator'></span>`);
      panel.addHTML("<h3>Properties</h3>");
      const fUpdate = (name, value) => {
        if (!this.graph) throw new NullGraphError();
        this.graph.beforeChange(node2);
        switch (name) {
          case "Title":
            if (typeof value !== "string") throw new TypeError("Attempting to set title to non-string value.");
            node2.title = value;
            break;
          case "Mode": {
            if (typeof value !== "string") throw new TypeError("Attempting to set mode to non-string value.");
            const kV = Object.values(LiteGraph.NODE_MODES).indexOf(value);
            if (kV !== -1 && LiteGraph.NODE_MODES[kV]) {
              node2.changeMode(kV);
            } else {
              console.warn(`unexpected mode: ${value}`);
            }
            break;
          }
          case "Color":
            if (typeof value !== "string") throw new TypeError("Attempting to set colour to non-string value.");
            if (_LGraphCanvas.node_colors[value]) {
              node2.color = _LGraphCanvas.node_colors[value].color;
              node2.bgcolor = _LGraphCanvas.node_colors[value].bgcolor;
            } else {
              console.warn(`unexpected color: ${value}`);
            }
            break;
          default:
            node2.setProperty(name, value);
            break;
        }
        this.graph.afterChange();
        this.dirty_canvas = true;
      };
      panel.addWidget("string", "Title", node2.title, {}, fUpdate);
      const mode = node2.mode == null ? void 0 : LiteGraph.NODE_MODES[node2.mode];
      panel.addWidget("combo", "Mode", mode, { values: LiteGraph.NODE_MODES }, fUpdate);
      const nodeCol = node2.color !== void 0 ? Object.keys(_LGraphCanvas.node_colors).filter(function(nK) {
        return _LGraphCanvas.node_colors[nK].color == node2.color;
      }) : "";
      panel.addWidget("combo", "Color", nodeCol, { values: Object.keys(_LGraphCanvas.node_colors) }, fUpdate);
      for (const pName in node2.properties) {
        const value = node2.properties[pName];
        const info = node2.getPropertyInfo(pName);
        if ((_a = node2.onAddPropertyToPanel) == null ? void 0 : _a.call(node2, pName, panel)) continue;
        panel.addWidget(info.widget || info.type, pName, value, info, fUpdate);
      }
      panel.addSeparator();
      (_b = node2.onShowCustomPanelInfo) == null ? void 0 : _b.call(node2, panel);
      panel.footer.innerHTML = "";
      panel.addButton("Delete", function() {
        if (node2.block_delete) return;
        if (!node2.graph) throw new NullGraphError();
        node2.graph.remove(node2);
        panel.close();
      }).classList.add("delete");
    };
    panel.inner_showCodePad = function(propname) {
      panel.classList.remove("settings");
      panel.classList.add("centered");
      panel.alt_content.innerHTML = "<textarea class='code'></textarea>";
      const textarea = panel.alt_content.querySelector("textarea");
      const fDoneWith = function() {
        panel.toggleAltContent(false);
        panel.toggleFooterVisibility(true);
        textarea.remove();
        panel.classList.add("settings");
        panel.classList.remove("centered");
        inner_refresh();
      };
      textarea.value = String(node2.properties[propname]);
      textarea.addEventListener("keydown", function(e2) {
        if (e2.code == "Enter" && e2.ctrlKey) {
          node2.setProperty(propname, textarea.value);
          fDoneWith();
        }
      });
      panel.toggleAltContent(true);
      panel.toggleFooterVisibility(false);
      textarea.style.height = "calc(100% - 40px)";
      const assign = panel.addButton("Assign", function() {
        node2.setProperty(propname, textarea.value);
        fDoneWith();
      });
      panel.alt_content.append(assign);
      const button = panel.addButton("Close", fDoneWith);
      button.style.float = "right";
      panel.alt_content.append(button);
    };
    inner_refresh();
    if (!this.canvas.parentNode) throw new TypeError("showNodePanel - this.canvas.parentNode was null");
    this.canvas.parentNode.append(panel);
  }
  checkPanels() {
    if (!this.canvas) return;
    if (!this.canvas.parentNode) throw new TypeError("checkPanels - this.canvas.parentNode was null");
    const panels = this.canvas.parentNode.querySelectorAll(".litegraph.dialog");
    for (const panel of panels) {
      if (!panel.node) continue;
      if (!panel.node.graph || panel.graph != this.graph) panel.close();
    }
  }
  getCanvasMenuOptions() {
    var _a;
    let options2;
    if (this.getMenuOptions) {
      options2 = this.getMenuOptions();
    } else {
      options2 = [
        {
          content: "Add Node",
          has_submenu: true,
          callback: _LGraphCanvas.onMenuAdd
        },
        { content: "Add Group", callback: _LGraphCanvas.onGroupAdd }
        // { content: "Arrange", callback: that.graph.arrange },
        // {content:"Collapse All", callback: LGraphCanvas.onMenuCollapseAll }
      ];
      if (Object.keys(this.selected_nodes).length > 1) {
        options2.push({
          content: "Align",
          has_submenu: true,
          callback: _LGraphCanvas.onGroupAlign
        });
      }
    }
    const extra = (_a = this.getExtraMenuOptions) == null ? void 0 : _a.call(this, this, options2);
    return Array.isArray(extra) ? options2.concat(extra) : options2;
  }
  // called by processContextMenu to extract the menu list
  getNodeMenuOptions(node2) {
    var _a, _b, _c, _d;
    let options2;
    if (node2.getMenuOptions) {
      options2 = node2.getMenuOptions(this);
    } else {
      options2 = [
        {
          content: "Inputs",
          has_submenu: true,
          disabled: true
        },
        {
          content: "Outputs",
          has_submenu: true,
          disabled: true,
          callback: _LGraphCanvas.showMenuNodeOptionalOutputs
        },
        null,
        {
          content: "Properties",
          has_submenu: true,
          callback: _LGraphCanvas.onShowMenuNodeProperties
        },
        {
          content: "Properties Panel",
          callback: function(item, options22, e2, menu, node22) {
            _LGraphCanvas.active_canvas.showShowNodePanel(node22);
          }
        },
        null,
        {
          content: "Title",
          callback: _LGraphCanvas.onShowPropertyEditor
        },
        {
          content: "Mode",
          has_submenu: true,
          callback: _LGraphCanvas.onMenuNodeMode
        }
      ];
      if (node2.resizable !== false) {
        options2.push({
          content: "Resize",
          callback: _LGraphCanvas.onMenuResizeNode
        });
      }
      if (node2.collapsible) {
        options2.push({
          content: node2.collapsed ? "Expand" : "Collapse",
          callback: _LGraphCanvas.onMenuNodeCollapse
        });
      }
      if ((_a = node2.widgets) == null ? void 0 : _a.some((w) => w.advanced)) {
        options2.push({
          content: node2.showAdvanced ? "Hide Advanced" : "Show Advanced",
          callback: _LGraphCanvas.onMenuToggleAdvanced
        });
      }
      options2.push(
        {
          content: node2.pinned ? "Unpin" : "Pin",
          callback: () => {
            for (const i in this.selected_nodes) {
              const node22 = this.selected_nodes[i];
              node22.pin();
            }
            this.setDirty(true, true);
          }
        },
        {
          content: "Colors",
          has_submenu: true,
          callback: _LGraphCanvas.onMenuNodeColors
        },
        {
          content: "Shapes",
          has_submenu: true,
          callback: _LGraphCanvas.onMenuNodeShapes
        },
        null
      );
    }
    const extra = (_b = node2.getExtraMenuOptions) == null ? void 0 : _b.call(node2, this, options2);
    if (Array.isArray(extra) && extra.length > 0) {
      extra.push(null);
      options2 = extra.concat(options2);
    }
    if (node2.clonable !== false) {
      options2.push({
        content: "Clone",
        callback: _LGraphCanvas.onMenuNodeClone
      });
    }
    if (Object.keys(this.selected_nodes).length > 1) {
      options2.push({
        content: "Align Selected To",
        has_submenu: true,
        callback: _LGraphCanvas.onNodeAlign
      }, {
        content: "Distribute Nodes",
        has_submenu: true,
        callback: _LGraphCanvas.createDistributeMenu
      });
    }
    options2.push(null, {
      content: "Remove",
      disabled: !(node2.removable !== false && !node2.block_delete),
      callback: _LGraphCanvas.onMenuNodeRemove
    });
    (_d = (_c = node2.graph) == null ? void 0 : _c.onGetNodeMenuOptions) == null ? void 0 : _d.call(_c, options2, node2);
    return options2;
  }
  /** @deprecated */
  getGroupMenuOptions(group) {
    console.warn("LGraphCanvas.getGroupMenuOptions is deprecated, use LGraphGroup.getMenuOptions instead");
    return group.getMenuOptions();
  }
  processContextMenu(node2, event) {
    var _a, _b, _c;
    const canvas2 = _LGraphCanvas.active_canvas;
    const ref_window = canvas2.getCanvasWindow();
    let menu_info;
    const options2 = {
      event,
      callback: inner_option_clicked,
      extra: node2
    };
    if (node2) {
      options2.title = (_a = node2.type) != null ? _a : void 0;
      _LGraphCanvas.active_node = node2;
      const slot = node2.getSlotInPosition(event.canvasX, event.canvasY);
      if (slot) {
        menu_info = [];
        if (node2.getSlotMenuOptions) {
          menu_info = node2.getSlotMenuOptions(slot);
        } else {
          if ((_c = (_b = slot == null ? void 0 : slot.output) == null ? void 0 : _b.links) == null ? void 0 : _c.length)
            menu_info.push({ content: "Disconnect Links", slot });
          const _slot = slot.input || slot.output;
          if (!_slot) throw new TypeError("Both in put and output slots were null when processing context menu.");
          if (_slot.removable) {
            menu_info.push(
              _slot.locked ? "Cannot remove" : { content: "Remove Slot", slot }
            );
          }
          if (!_slot.nameLocked)
            menu_info.push({ content: "Rename Slot", slot });
          if (node2.getExtraSlotMenuOptions) {
            menu_info.push(...node2.getExtraSlotMenuOptions(slot));
          }
        }
        options2.title = (slot.input ? slot.input.type : slot.output.type) || "*";
        if (slot.input && slot.input.type == LiteGraph.ACTION)
          options2.title = "Action";
        if (slot.output && slot.output.type == LiteGraph.EVENT)
          options2.title = "Event";
      } else {
        menu_info = this.getNodeMenuOptions(node2);
      }
    } else {
      menu_info = this.getCanvasMenuOptions();
      if (!this.graph) throw new NullGraphError();
      if (this.links_render_mode !== LinkRenderType.HIDDEN_LINK) {
        const reroute = this.graph.getRerouteOnPos(event.canvasX, event.canvasY);
        if (reroute) {
          menu_info.unshift({
            content: "Delete Reroute",
            callback: () => {
              if (!this.graph) throw new NullGraphError();
              this.graph.removeReroute(reroute.id);
            }
          }, null);
        }
      }
      const group = this.graph.getGroupOnPos(
        event.canvasX,
        event.canvasY
      );
      if (group) {
        menu_info.push(null, {
          content: "Edit Group",
          has_submenu: true,
          submenu: {
            title: "Group",
            extra: group,
            options: group.getMenuOptions()
          }
        });
      }
    }
    if (!menu_info) return;
    new LiteGraph.ContextMenu(menu_info, options2, ref_window);
    const createDialog = (options22) => this.createDialog(
      "<span class='name'>Name</span><input autofocus type='text'/><button>OK</button>",
      options22
    );
    const setDirty = () => this.setDirty(true);
    function inner_option_clicked(v2, options22) {
      var _a2;
      if (!v2) return;
      if (v2.content == "Remove Slot") {
        if (!(node2 == null ? void 0 : node2.graph)) throw new NullGraphError();
        const info = v2.slot;
        if (!info) throw new TypeError("Found-slot info was null when processing context menu.");
        node2.graph.beforeChange();
        if (info.input) {
          node2.removeInput(info.slot);
        } else if (info.output) {
          node2.removeOutput(info.slot);
        }
        node2.graph.afterChange();
        return;
      } else if (v2.content == "Disconnect Links") {
        if (!(node2 == null ? void 0 : node2.graph)) throw new NullGraphError();
        const info = v2.slot;
        if (!info) throw new TypeError("Found-slot info was null when processing context menu.");
        node2.graph.beforeChange();
        if (info.output) {
          node2.disconnectOutput(info.slot);
        } else if (info.input) {
          node2.disconnectInput(info.slot, true);
        }
        node2.graph.afterChange();
        return;
      } else if (v2.content == "Rename Slot") {
        if (!node2) throw new TypeError("`node` was null when processing the context menu.");
        const info = v2.slot;
        if (!info) throw new TypeError("Found-slot info was null when processing context menu.");
        const slot_info = info.input ? node2.getInputInfo(info.slot) : node2.getOutputInfo(info.slot);
        const dialog = createDialog(options22);
        const input = dialog.querySelector("input");
        if (input && slot_info) {
          input.value = slot_info.label || "";
        }
        const inner = function() {
          if (!node2.graph) throw new NullGraphError();
          node2.graph.beforeChange();
          if (input == null ? void 0 : input.value) {
            if (slot_info) {
              slot_info.label = input.value;
            }
            setDirty();
          }
          dialog.close();
          node2.graph.afterChange();
        };
        (_a2 = dialog.querySelector("button")) == null ? void 0 : _a2.addEventListener("click", inner);
        if (!input) throw new TypeError("Input element was null when processing context menu.");
        input.addEventListener("keydown", function(e2) {
          dialog.is_modified = true;
          if (e2.key == "Escape") {
            dialog.close();
          } else if (e2.key == "Enter") {
            inner();
          } else if (e2.target.localName != "textarea") {
            return;
          }
          e2.preventDefault();
          e2.stopPropagation();
        });
        input.focus();
      }
    }
  }
  /**
   * Starts an animation to fit the view around the specified selection of nodes.
   * @param bounds The bounds to animate the view to, defined by a rectangle.
   */
  animateToBounds(bounds, options2 = {}) {
    const setDirty = () => this.setDirty(true, true);
    this.ds.animateToBounds(bounds, setDirty, options2);
  }
  /**
   * Fits the view to the selected nodes with animation.
   * If nothing is selected, the view is fitted around all items in the graph.
   */
  fitViewToSelectionAnimated(options2 = {}) {
    const items = this.selectedItems.size ? Array.from(this.selectedItems) : this.positionableItems;
    const bounds = createBounds(items);
    if (!bounds) throw new TypeError("Attempted to fit to view but could not calculate bounds.");
    const setDirty = () => this.setDirty(true, true);
    this.ds.animateToBounds(bounds, setDirty, options2);
  }
};
_temp = new WeakMap();
_temp_vec2 = new WeakMap();
_tmp_area = new WeakMap();
_margin_area = new WeakMap();
_link_bounding = new WeakMap();
_lTempA = new WeakMap();
_lTempB = new WeakMap();
_lTempC = new WeakMap();
_LGraphCanvas_instances = new WeakSet();
updateCursorStyle_fn = function() {
  if (!this.state.shouldSetCursor) return;
  let cursor = "default";
  if (this.state.draggingCanvas) {
    cursor = "grabbing";
  } else if (this.state.readOnly) {
    cursor = "grab";
  } else if (this.state.hoveringOver & CanvasItem.ResizeSe) {
    cursor = "se-resize";
  } else if (this.state.hoveringOver & CanvasItem.Node) {
    cursor = "crosshair";
  }
  this.canvas.style.cursor = cursor;
};
_maximumFrameGap = new WeakMap();
_visible_node_ids = new WeakMap();
_snapToGrid = new WeakMap();
_shiftDown = new WeakMap();
_dragZoomStart = new WeakMap();
/**
 * Finds the canvas if required, throwing on failure.
 * @param canvas Canvas element, or its element ID
 * @returns The canvas element
 * @throws If {@link canvas} is an element ID that does not belong to a valid HTML canvas element
 */
validateCanvas_fn = function(canvas2) {
  if (typeof canvas2 === "string") {
    const el = document.getElementById(canvas2);
    if (!(el instanceof HTMLCanvasElement)) throw "Error validating LiteGraph canvas: Canvas element not found";
    return el;
  }
  return canvas2;
};
/** Marks the entire canvas as dirty. */
dirty_fn = function() {
  this.dirty_canvas = true;
  this.dirty_bgcanvas = true;
};
processPrimaryButton_fn = function(e2, node2) {
  var _a;
  const { pointer, graph, linkConnector } = this;
  if (!graph) throw new NullGraphError();
  const x2 = e2.canvasX;
  const y = e2.canvasY;
  const ctrlOrMeta = e2.ctrlKey || e2.metaKey;
  if (ctrlOrMeta && !e2.altKey) {
    const dragRect = new Float32Array(4);
    dragRect[0] = x2;
    dragRect[1] = y;
    dragRect[2] = 1;
    dragRect[3] = 1;
    pointer.onClick = (eUp) => {
      var _a2;
      const clickedItem = (_a2 = node2 != null ? node2 : graph.getRerouteOnPos(eUp.canvasX, eUp.canvasY)) != null ? _a2 : graph.getGroupTitlebarOnPos(eUp.canvasX, eUp.canvasY);
      this.processSelect(clickedItem, eUp);
    };
    pointer.onDragStart = () => this.dragging_rectangle = dragRect;
    pointer.onDragEnd = (upEvent) => __privateMethod(this, _LGraphCanvas_instances, handleMultiSelect_fn).call(this, upEvent, dragRect);
    pointer.finally = () => this.dragging_rectangle = null;
    return;
  }
  if (this.read_only) {
    pointer.finally = () => this.dragging_canvas = false;
    this.dragging_canvas = true;
    return;
  }
  if (LiteGraph.alt_drag_do_clone_nodes && e2.altKey && !e2.ctrlKey && node2 && this.allow_interaction) {
    const node_data = (_a = node2.clone()) == null ? void 0 : _a.serialize();
    if ((node_data == null ? void 0 : node_data.type) != null) {
      const cloned = LiteGraph.createNode(node_data.type);
      if (cloned) {
        cloned.configure(node_data);
        cloned.pos[0] += 5;
        cloned.pos[1] += 5;
        if (this.allow_dragnodes) {
          pointer.onDragStart = (pointer2) => {
            graph.add(cloned, false);
            __privateMethod(this, _LGraphCanvas_instances, startDraggingItems_fn).call(this, cloned, pointer2);
          };
          pointer.onDragEnd = (e22) => __privateMethod(this, _LGraphCanvas_instances, processDraggedItems_fn).call(this, e22);
        } else {
          graph.beforeChange();
          graph.add(cloned, false);
          graph.afterChange();
        }
        return;
      }
    }
  }
  if (node2 && (this.allow_interaction || node2.flags.allow_interaction)) {
    __privateMethod(this, _LGraphCanvas_instances, processNodeClick_fn).call(this, e2, ctrlOrMeta, node2);
  } else {
    if (this.links_render_mode !== LinkRenderType.HIDDEN_LINK) {
      const reroute = graph.getRerouteOnPos(x2, y);
      if (reroute) {
        if (e2.shiftKey) {
          linkConnector.dragFromReroute(graph, reroute);
          pointer.onDragEnd = (upEvent) => linkConnector.dropLinks(graph, upEvent);
          pointer.finally = () => linkConnector.reset(true);
          this.dirty_bgcanvas = true;
        }
        pointer.onClick = () => this.processSelect(reroute, e2);
        if (!pointer.onDragEnd) {
          pointer.onDragStart = (pointer2) => __privateMethod(this, _LGraphCanvas_instances, startDraggingItems_fn).call(this, reroute, pointer2, true);
          pointer.onDragEnd = (e22) => __privateMethod(this, _LGraphCanvas_instances, processDraggedItems_fn).call(this, e22);
        }
        return;
      }
    }
    const { lineWidth } = this.ctx;
    this.ctx.lineWidth = this.connections_width + 7;
    const dpi = (window == null ? void 0 : window.devicePixelRatio) || 1;
    for (const linkSegment of this.renderedPaths) {
      const centre = linkSegment._pos;
      if (!centre) continue;
      if ((e2.shiftKey || e2.altKey) && linkSegment.path && this.ctx.isPointInStroke(linkSegment.path, x2 * dpi, y * dpi)) {
        this.ctx.lineWidth = lineWidth;
        if (e2.shiftKey && !e2.altKey) {
          linkConnector.dragFromLinkSegment(graph, linkSegment);
          pointer.onDragEnd = (upEvent) => linkConnector.dropLinks(graph, upEvent);
          pointer.finally = () => linkConnector.reset(true);
          return;
        } else if (e2.altKey && !e2.shiftKey) {
          const newReroute = graph.createReroute([x2, y], linkSegment);
          pointer.onDragStart = (pointer2) => __privateMethod(this, _LGraphCanvas_instances, startDraggingItems_fn).call(this, newReroute, pointer2);
          pointer.onDragEnd = (e22) => __privateMethod(this, _LGraphCanvas_instances, processDraggedItems_fn).call(this, e22);
          return;
        }
      } else if (isInRectangle(x2, y, centre[0] - 4, centre[1] - 4, 8, 8)) {
        this.ctx.lineWidth = lineWidth;
        pointer.onClick = () => this.showLinkMenu(linkSegment, e2);
        pointer.onDragStart = () => this.dragging_canvas = true;
        pointer.finally = () => this.dragging_canvas = false;
        this.over_link_center = void 0;
        return;
      }
    }
    this.ctx.lineWidth = lineWidth;
    const group = graph.getGroupOnPos(x2, y);
    this.selected_group = group != null ? group : null;
    if (group) {
      if (group.isInResize(x2, y)) {
        const b = group.boundingRect;
        const offsetX = x2 - (b[0] + b[2]);
        const offsetY = y - (b[1] + b[3]);
        pointer.onDragStart = () => this.resizingGroup = group;
        pointer.onDrag = (eMove) => {
          if (this.read_only) return;
          const pos = [
            eMove.canvasX - group.pos[0] - offsetX,
            eMove.canvasY - group.pos[1] - offsetY
          ];
          if (__privateGet(this, _snapToGrid)) snapPoint(pos, __privateGet(this, _snapToGrid));
          const resized = group.resize(pos[0], pos[1]);
          if (resized) this.dirty_bgcanvas = true;
        };
        pointer.finally = () => this.resizingGroup = null;
      } else {
        const f = group.font_size || LiteGraph.DEFAULT_GROUP_FONT_SIZE;
        const headerHeight = f * 1.4;
        if (isInRectangle(
          x2,
          y,
          group.pos[0],
          group.pos[1],
          group.size[0],
          headerHeight
        )) {
          pointer.onClick = () => this.processSelect(group, e2);
          pointer.onDragStart = (pointer2) => {
            group.recomputeInsideNodes();
            __privateMethod(this, _LGraphCanvas_instances, startDraggingItems_fn).call(this, group, pointer2, true);
          };
          pointer.onDragEnd = (e22) => __privateMethod(this, _LGraphCanvas_instances, processDraggedItems_fn).call(this, e22);
        }
      }
      pointer.onDoubleClick = () => {
        this.emitEvent({
          subType: "group-double-click",
          originalEvent: e2,
          group
        });
      };
    } else {
      pointer.onDoubleClick = () => {
        if (this.allow_searchbox) {
          this.showSearchBox(e2);
          e2.preventDefault();
        }
        this.emitEvent({
          subType: "empty-double-click",
          originalEvent: e2
        });
      };
    }
  }
  if (!pointer.onDragStart && !pointer.onClick && !pointer.onDrag && this.allow_dragcanvas) {
    pointer.onClick = () => this.processSelect(null, e2);
    pointer.finally = () => this.dragging_canvas = false;
    this.dragging_canvas = true;
  }
};
/**
 * Processes a pointerdown event inside the bounds of a node.  Part of {@link processMouseDown}.
 * @param e The pointerdown event
 * @param ctrlOrMeta Ctrl or meta key is pressed
 * @param node The node to process a click event for
 */
processNodeClick_fn = function(e2, ctrlOrMeta, node2) {
  var _a, _b, _c, _d;
  const { pointer, graph, linkConnector } = this;
  if (!graph) throw new NullGraphError();
  const x2 = e2.canvasX;
  const y = e2.canvasY;
  pointer.onClick = () => this.processSelect(node2, e2);
  if (!node2.flags.pinned) {
    this.bringToFront(node2);
  }
  const inCollapse = node2.isPointInCollapse(x2, y);
  if (inCollapse) {
    pointer.onClick = () => {
      node2.collapse();
      this.setDirty(true, true);
    };
  } else if (!node2.flags.collapsed) {
    if (node2.resizable !== false && node2.inResizeCorner(x2, y)) {
      const b = node2.boundingRect;
      const offsetX = x2 - (b[0] + b[2]);
      const offsetY = y - (b[1] + b[3]);
      pointer.onDragStart = () => {
        graph.beforeChange();
        this.resizing_node = node2;
      };
      pointer.onDrag = (eMove) => {
        if (this.read_only) return;
        const pos2 = [
          eMove.canvasX - node2.pos[0] - offsetX,
          eMove.canvasY - node2.pos[1] - offsetY
        ];
        if (__privateGet(this, _snapToGrid)) snapPoint(pos2, __privateGet(this, _snapToGrid));
        const min = node2.computeSize();
        pos2[0] = Math.max(min[0], pos2[0]);
        pos2[1] = Math.max(min[1], pos2[1]);
        node2.setSize(pos2);
        __privateMethod(this, _LGraphCanvas_instances, dirty_fn).call(this);
      };
      pointer.onDragEnd = () => {
        __privateMethod(this, _LGraphCanvas_instances, dirty_fn).call(this);
        graph.afterChange(this.resizing_node);
      };
      pointer.finally = () => this.resizing_node = null;
      this.canvas.style.cursor = "se-resize";
      return;
    }
    const { inputs, outputs } = node2;
    if (outputs) {
      for (const [i, output] of outputs.entries()) {
        const link_pos = node2.getOutputPos(i);
        if (isInRectangle(x2, y, link_pos[0] - 15, link_pos[1] - 10, 30, 20)) {
          if (e2.shiftKey && (((_a = output.links) == null ? void 0 : _a.length) || ((_b = output._floatingLinks) == null ? void 0 : _b.size))) {
            linkConnector.moveOutputLink(graph, output);
            pointer.onDragEnd = (upEvent) => linkConnector.dropLinks(graph, upEvent);
            pointer.finally = () => linkConnector.reset(true);
            return;
          }
          linkConnector.dragNewFromOutput(graph, node2, output);
          pointer.onDragEnd = (upEvent) => linkConnector.dropLinks(graph, upEvent);
          pointer.finally = () => linkConnector.reset(true);
          if (LiteGraph.shift_click_do_break_link_from) {
            if (e2.shiftKey) {
              node2.disconnectOutput(i);
            }
          } else if (LiteGraph.ctrl_alt_click_do_break_link) {
            if (ctrlOrMeta && e2.altKey && !e2.shiftKey) {
              node2.disconnectOutput(i);
            }
          }
          pointer.onDoubleClick = () => {
            var _a2;
            return (_a2 = node2.onOutputDblClick) == null ? void 0 : _a2.call(node2, i, e2);
          };
          pointer.onClick = () => {
            var _a2;
            return (_a2 = node2.onOutputClick) == null ? void 0 : _a2.call(node2, i, e2);
          };
          return;
        }
      }
    }
    if (inputs) {
      for (const [i, input] of inputs.entries()) {
        const link_pos = node2.getInputPos(i);
        if (isInRectangle(x2, y, link_pos[0] - 15, link_pos[1] - 10, 30, 20)) {
          pointer.onDoubleClick = () => {
            var _a2;
            return (_a2 = node2.onInputDblClick) == null ? void 0 : _a2.call(node2, i, e2);
          };
          pointer.onClick = () => {
            var _a2;
            return (_a2 = node2.onInputClick) == null ? void 0 : _a2.call(node2, i, e2);
          };
          const shouldBreakLink = LiteGraph.ctrl_alt_click_do_break_link && ctrlOrMeta && e2.altKey && !e2.shiftKey;
          if (input.link !== null || ((_c = input._floatingLinks) == null ? void 0 : _c.size)) {
            if (shouldBreakLink || LiteGraph.click_do_break_link_to) {
              node2.disconnectInput(i, true);
            } else if (e2.shiftKey || this.allow_reconnect_links) {
              linkConnector.moveInputLink(graph, input);
            }
          }
          if (!linkConnector.isConnecting) {
            linkConnector.dragNewFromInput(graph, node2, input);
          }
          pointer.onDragEnd = (upEvent) => linkConnector.dropLinks(graph, upEvent);
          pointer.finally = () => linkConnector.reset(true);
          this.dirty_bgcanvas = true;
          return;
        }
      }
    }
  }
  const pos = [x2 - node2.pos[0], y - node2.pos[1]];
  const widget = node2.getWidgetOnPos(x2, y);
  if (widget) {
    __privateMethod(this, _LGraphCanvas_instances, processWidgetClick_fn).call(this, e2, node2, widget);
    this.node_widget = [node2, widget];
  } else {
    pointer.onDoubleClick = () => {
      var _a2, _b2;
      if (pos[1] < 0 && !inCollapse) {
        (_a2 = node2.onNodeTitleDblClick) == null ? void 0 : _a2.call(node2, e2, pos, this);
      }
      (_b2 = node2.onDblClick) == null ? void 0 : _b2.call(node2, e2, pos, this);
      this.emitEvent({
        subType: "node-double-click",
        originalEvent: e2,
        node: node2
      });
      this.processNodeDblClicked(node2);
    };
    if (((_d = node2.onMouseDown) == null ? void 0 : _d.call(node2, e2, pos, this)) || !this.allow_dragnodes)
      return;
    pointer.onDragStart = (pointer2) => __privateMethod(this, _LGraphCanvas_instances, startDraggingItems_fn).call(this, node2, pointer2, true);
    pointer.onDragEnd = (e22) => __privateMethod(this, _LGraphCanvas_instances, processDraggedItems_fn).call(this, e22);
  }
  this.dirty_canvas = true;
};
processWidgetClick_fn = function(e2, node2, widget) {
  var _a;
  const { pointer } = this;
  if (typeof widget.onPointerDown === "function") {
    const handled = widget.onPointerDown(pointer, node2, this);
    if (handled) return;
  }
  const oldValue = widget.value;
  const pos = this.graph_mouse;
  const x2 = pos[0] - node2.pos[0];
  const y = pos[1] - node2.pos[1];
  const WidgetClass = WIDGET_TYPE_MAP[widget.type];
  if (WidgetClass) {
    const widgetInstance = toClass(WidgetClass, widget);
    pointer.onClick = () => widgetInstance.onClick({
      e: e2,
      node: node2,
      canvas: this
    });
    pointer.onDrag = (eMove) => {
      var _a2;
      return (_a2 = widgetInstance.onDrag) == null ? void 0 : _a2.call(widgetInstance, {
        e: eMove,
        node: node2,
        canvas: this
      });
    };
  } else if (widget.mouse) {
    const result = widget.mouse(e2, [x2, y], node2);
    if (result != null) this.dirty_canvas = result;
  }
  if (oldValue != widget.value) {
    (_a = node2.onWidgetChanged) == null ? void 0 : _a.call(node2, widget.name, widget.value, oldValue, widget);
    if (!node2.graph) throw new NullGraphError();
    node2.graph._version++;
  }
  pointer.finally = () => {
    if (widget.mouse) {
      const { eUp } = pointer;
      if (!eUp) return;
      const { canvasX, canvasY } = eUp;
      widget.mouse(eUp, [canvasX - node2.pos[0], canvasY - node2.pos[1]], node2);
    }
    this.node_widget = null;
  };
};
/**
 * Pointer middle button click processing.  Part of {@link processMouseDown}.
 * @param e The pointerdown event
 * @param node The node to process a click event for
 */
processMiddleButton_fn = function(e2, node2) {
  const { pointer } = this;
  if (LiteGraph.middle_click_slot_add_default_node && node2 && this.allow_interaction && !this.read_only && !this.connecting_links && !node2.flags.collapsed) {
    let mClikSlot = false;
    let mClikSlot_index = false;
    let mClikSlot_isOut = false;
    const { inputs, outputs } = node2;
    if (outputs) {
      for (const [i, output] of outputs.entries()) {
        const link_pos = node2.getOutputPos(i);
        if (isInRectangle(e2.canvasX, e2.canvasY, link_pos[0] - 15, link_pos[1] - 10, 30, 20)) {
          mClikSlot = output;
          mClikSlot_index = i;
          mClikSlot_isOut = true;
          break;
        }
      }
    }
    if (inputs) {
      for (const [i, input] of inputs.entries()) {
        const link_pos = node2.getInputPos(i);
        if (isInRectangle(e2.canvasX, e2.canvasY, link_pos[0] - 15, link_pos[1] - 10, 30, 20)) {
          mClikSlot = input;
          mClikSlot_index = i;
          mClikSlot_isOut = false;
          break;
        }
      }
    }
    if (mClikSlot && mClikSlot_index !== false) {
      const alphaPosY = 0.5 - (mClikSlot_index + 1) / (mClikSlot_isOut ? outputs.length : inputs.length);
      const node_bounding = node2.getBounding();
      const posRef = [
        !mClikSlot_isOut ? node_bounding[0] : node_bounding[0] + node_bounding[2],
        e2.canvasY - 80
      ];
      pointer.onClick = () => this.createDefaultNodeForSlot({
        nodeFrom: !mClikSlot_isOut ? null : node2,
        slotFrom: !mClikSlot_isOut ? null : mClikSlot_index,
        nodeTo: !mClikSlot_isOut ? node2 : null,
        slotTo: !mClikSlot_isOut ? mClikSlot_index : null,
        position: posRef,
        nodeType: "AUTO",
        posAdd: [!mClikSlot_isOut ? -30 : 30, -alphaPosY * 130],
        posSizeFix: [!mClikSlot_isOut ? -1 : 0, 0]
      });
    }
  }
  if (this.allow_dragcanvas) {
    pointer.onDragStart = () => this.dragging_canvas = true;
    pointer.finally = () => this.dragging_canvas = false;
  }
};
processDragZoom_fn = function(e2) {
  if (!e2.buttons) {
    __privateSet(this, _dragZoomStart, null);
    return;
  }
  const start = __privateGet(this, _dragZoomStart);
  if (!start) throw new TypeError("Drag-zoom state object was null");
  if (!this.graph) throw new NullGraphError();
  const deltaY = e2.y - start.pos[1];
  const startScale = start.scale;
  const scale = startScale - deltaY / 100;
  this.ds.changeScale(scale, start.pos);
  this.graph.change();
};
/**
 * Start dragging an item, optionally including all other selected items.
 *
 * ** This function sets the {@link CanvasPointer.finally}() callback. **
 * @param item The item that the drag event started on
 * @param pointer The pointer event that initiated the drag, e.g. pointerdown
 * @param sticky If `true`, the item is added to the selection - see {@link processSelect}
 */
startDraggingItems_fn = function(item, pointer, sticky = false) {
  var _a;
  this.emitBeforeChange();
  (_a = this.graph) == null ? void 0 : _a.beforeChange();
  pointer.finally = () => {
    var _a2;
    this.isDragging = false;
    (_a2 = this.graph) == null ? void 0 : _a2.afterChange();
    this.emitAfterChange();
  };
  this.processSelect(item, pointer.eDown, sticky);
  this.isDragging = true;
};
/**
 * Handles shared clean up and placement after items have been dragged.
 * @param e The event that completed the drag, e.g. pointerup, pointermove
 */
processDraggedItems_fn = function(e2) {
  var _a;
  const { graph } = this;
  if (e2.shiftKey || LiteGraph.alwaysSnapToGrid)
    graph == null ? void 0 : graph.snapToGrid(this.selectedItems);
  this.dirty_canvas = true;
  this.dirty_bgcanvas = true;
  (_a = this.onNodeMoved) == null ? void 0 : _a.call(this, findFirstNode(this.selectedItems));
};
handleMultiSelect_fn = function(e2, dragRect) {
  var _a;
  const { graph, selectedItems } = this;
  if (!graph) throw new NullGraphError();
  const w = Math.abs(dragRect[2]);
  const h = Math.abs(dragRect[3]);
  if (dragRect[2] < 0) dragRect[0] -= w;
  if (dragRect[3] < 0) dragRect[1] -= h;
  dragRect[2] = w;
  dragRect[3] = h;
  const isSelected = [];
  const notSelected = [];
  for (const nodeX of graph._nodes) {
    if (!overlapBounding(dragRect, nodeX.boundingRect)) continue;
    if (!nodeX.selected || !selectedItems.has(nodeX))
      notSelected.push(nodeX);
    else isSelected.push(nodeX);
  }
  for (const group of graph.groups) {
    if (!containsRect(dragRect, group._bounding)) continue;
    group.recomputeInsideNodes();
    if (!group.selected || !selectedItems.has(group))
      notSelected.push(group);
    else isSelected.push(group);
  }
  for (const reroute of graph.reroutes.values()) {
    if (!isPointInRect(reroute.pos, dragRect)) continue;
    selectedItems.add(reroute);
    reroute.selected = true;
    if (!reroute.selected || !selectedItems.has(reroute))
      notSelected.push(reroute);
    else isSelected.push(reroute);
  }
  if (e2.shiftKey) {
    for (const item of notSelected) this.select(item);
  } else if (e2.altKey) {
    for (const item of isSelected) this.deselect(item);
  } else {
    for (const item of selectedItems.values()) {
      if (!isSelected.includes(item)) this.deselect(item);
    }
    for (const item of notSelected) this.select(item);
  }
  (_a = this.onSelectionChange) == null ? void 0 : _a.call(this, this.selected_nodes);
};
/** @returns If the pointer is over a link centre marker, the link segment it belongs to.  Otherwise, `undefined`.  */
getLinkCentreOnPos_fn = function(e2) {
  for (const linkSegment of this.renderedPaths) {
    const centre = linkSegment._pos;
    if (!centre) continue;
    if (isInRectangle(e2.canvasX, e2.canvasY, centre[0] - 4, centre[1] - 4, 8, 8)) {
      return linkSegment;
    }
  }
};
/** Get the target snap / highlight point in graph space */
getHighlightPosition_fn = function() {
  var _a;
  return LiteGraph.snaps_for_comfy ? (_a = this._highlight_pos) != null ? _a : this.graph_mouse : this.graph_mouse;
};
/**
 * Renders indicators showing where a link will connect if released.
 * Partial border over target node and a highlight over the slot itself.
 * @param ctx Canvas 2D context
 */
renderSnapHighlight_fn = function(ctx, highlightPos) {
  var _a, _b, _c;
  if (!this._highlight_pos) return;
  ctx.fillStyle = "#ffcc00";
  ctx.beginPath();
  const shape = (_a = this._highlight_input) == null ? void 0 : _a.shape;
  if (shape === RenderShape.ARROW) {
    ctx.moveTo(highlightPos[0] + 8, highlightPos[1] + 0.5);
    ctx.lineTo(highlightPos[0] - 4, highlightPos[1] + 6 + 0.5);
    ctx.lineTo(highlightPos[0] - 4, highlightPos[1] - 6 + 0.5);
    ctx.closePath();
  } else {
    ctx.arc(highlightPos[0], highlightPos[1], 6, 0, Math.PI * 2);
  }
  ctx.fill();
  if (!LiteGraph.snap_highlights_node) return;
  const { linkConnector } = this;
  const { overReroute, overWidget } = linkConnector;
  if (overReroute) {
    const { globalAlpha } = ctx;
    ctx.globalAlpha = 1;
    overReroute.drawHighlight(ctx, "#ffcc00aa");
    ctx.globalAlpha = globalAlpha;
  }
  const node2 = this.node_over;
  if (!(node2 && linkConnector.isConnecting)) return;
  const { strokeStyle, lineWidth } = ctx;
  const area = node2.boundingRect;
  const gap = 3;
  const radius = LiteGraph.ROUND_RADIUS + gap;
  const x2 = area[0] - gap;
  const y = area[1] - gap;
  const width2 = area[2] + gap * 2;
  const height = area[3] + gap * 2;
  ctx.beginPath();
  ctx.roundRect(x2, y, width2, height, radius);
  const start = linkConnector.state.connectingTo === "output" ? 0 : 1;
  const inverter = start ? -1 : 1;
  const hx = highlightPos[0];
  const hy = highlightPos[1];
  const gRadius = width2 < height ? width2 : width2 * Math.max(height / width2, 0.5);
  const gradient = ctx.createRadialGradient(hx, hy, 0, hx, hy, gRadius);
  gradient.addColorStop(1, "#00000000");
  gradient.addColorStop(0, "#ffcc00aa");
  const linearGradient = ctx.createLinearGradient(x2, y, x2 + width2, y);
  linearGradient.addColorStop(0.5, "#00000000");
  linearGradient.addColorStop(start + 0.67 * inverter, "#ddeeff33");
  linearGradient.addColorStop(start + inverter, "#ffcc0055");
  ctx.setLineDash([radius, radius * 1e-3]);
  ctx.lineWidth = 1;
  ctx.strokeStyle = linearGradient;
  ctx.stroke();
  if (overWidget) {
    const { computedHeight } = overWidget;
    ctx.beginPath();
    const { pos: [nodeX, nodeY] } = node2;
    const height2 = LiteGraph.NODE_WIDGET_HEIGHT;
    if (overWidget.type.startsWith("custom") && computedHeight != null && computedHeight > height2 * 2) {
      ctx.rect(
        nodeX + 9,
        nodeY + overWidget.y + 9,
        ((_b = overWidget.width) != null ? _b : area[2]) - 18,
        computedHeight - 18
      );
    } else {
      ctx.roundRect(
        nodeX + 15,
        nodeY + overWidget.y,
        (_c = overWidget.width) != null ? _c : area[2],
        height2,
        height2 * 0.5
      );
    }
    ctx.stroke();
  }
  ctx.strokeStyle = gradient;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
};
renderFloatingLinks_fn = function(ctx, graph, visibleReroutes, now) {
  var _a, _b;
  const { globalAlpha } = ctx;
  ctx.globalAlpha = globalAlpha * 0.33;
  for (const link of graph.floatingLinks.values()) {
    const reroutes = LLink.getReroutes(graph, link);
    const firstReroute = reroutes[0];
    const reroute = reroutes.at(-1);
    if (!firstReroute || !(reroute == null ? void 0 : reroute.floating)) continue;
    if (reroute.floating.slotType === "input") {
      const node2 = graph.getNodeById(link.target_id);
      if (!node2) continue;
      const startPos = firstReroute.pos;
      const endPos = node2.getInputPos(link.target_slot);
      const endDirection = (_a = node2.inputs[link.target_slot]) == null ? void 0 : _a.dir;
      firstReroute._dragging = true;
      __privateMethod(this, _LGraphCanvas_instances, renderAllLinkSegments_fn).call(this, ctx, link, startPos, endPos, visibleReroutes, now, LinkDirection.CENTER, endDirection, true);
    } else {
      const node2 = graph.getNodeById(link.origin_id);
      if (!node2) continue;
      const startPos = node2.getOutputPos(link.origin_slot);
      const endPos = reroute.pos;
      const startDirection = (_b = node2.outputs[link.origin_slot]) == null ? void 0 : _b.dir;
      link._dragging = true;
      __privateMethod(this, _LGraphCanvas_instances, renderAllLinkSegments_fn).call(this, ctx, link, startPos, endPos, visibleReroutes, now, startDirection, LinkDirection.CENTER, true);
    }
  }
  ctx.globalAlpha = globalAlpha;
};
renderAllLinkSegments_fn = function(ctx, link, startPos, endPos, visibleReroutes, now, startDirection, endDirection, disabled = false) {
  var _a, _b, _c, _d, _e, _f;
  const { graph, renderedPaths } = this;
  if (!graph) return;
  const reroutes = LLink.getReroutes(graph, link);
  const points = [
    startPos,
    ...reroutes.map((x2) => x2.pos),
    endPos
  ];
  const pointsX = points.map((x2) => x2[0]);
  const pointsY = points.map((x2) => x2[1]);
  __privateGet(_LGraphCanvas, _link_bounding)[0] = Math.min(...pointsX);
  __privateGet(_LGraphCanvas, _link_bounding)[1] = Math.min(...pointsY);
  __privateGet(_LGraphCanvas, _link_bounding)[2] = Math.max(...pointsX) - __privateGet(_LGraphCanvas, _link_bounding)[0];
  __privateGet(_LGraphCanvas, _link_bounding)[3] = Math.max(...pointsY) - __privateGet(_LGraphCanvas, _link_bounding)[1];
  if (!overlapBounding(__privateGet(_LGraphCanvas, _link_bounding), __privateGet(_LGraphCanvas, _margin_area)))
    return;
  const start_dir = startDirection || LinkDirection.RIGHT;
  const end_dir = endDirection || LinkDirection.LEFT;
  if (reroutes.length) {
    let startControl;
    const l = reroutes.length;
    for (let j = 0; j < l; j++) {
      const reroute = reroutes[j];
      if (!renderedPaths.has(reroute)) {
        renderedPaths.add(reroute);
        visibleReroutes.push(reroute);
        reroute._colour = link.color || _LGraphCanvas.link_type_colors[link.type] || this.default_link_color;
        const prevReroute = graph.getReroute(reroute.parentId);
        const rerouteStartPos = (_a = prevReroute == null ? void 0 : prevReroute.pos) != null ? _a : startPos;
        reroute.calculateAngle(this.last_draw_time, graph, rerouteStartPos);
        if (!reroute._dragging) {
          this.renderLink(
            ctx,
            rerouteStartPos,
            reroute.pos,
            link,
            false,
            0,
            null,
            startControl === void 0 ? start_dir : LinkDirection.CENTER,
            LinkDirection.CENTER,
            {
              startControl,
              endControl: reroute.controlPoint,
              reroute,
              disabled
            }
          );
        }
      }
      if (!startControl && ((_c = (_b = reroutes.at(-1)) == null ? void 0 : _b.floating) == null ? void 0 : _c.slotType) === "input") {
        startControl = [0, 0];
      } else {
        const nextPos = (_e = (_d = reroutes[j + 1]) == null ? void 0 : _d.pos) != null ? _e : endPos;
        const dist = Math.min(Reroute.maxSplineOffset, distance(reroute.pos, nextPos) * 0.25);
        startControl = [dist * reroute.cos, dist * reroute.sin];
      }
    }
    if (link._dragging) return;
    const segmentStartPos = (_f = points.at(-2)) != null ? _f : startPos;
    this.renderLink(
      ctx,
      segmentStartPos,
      endPos,
      link,
      false,
      0,
      null,
      LinkDirection.CENTER,
      end_dir,
      { startControl, disabled }
    );
  } else if (!link._dragging) {
    this.renderLink(
      ctx,
      startPos,
      endPos,
      link,
      false,
      0,
      null,
      start_dir,
      end_dir
    );
  }
  renderedPaths.add(link);
  if ((link == null ? void 0 : link._last_time) && now - link._last_time < 1e3) {
    const f = 2 - (now - link._last_time) * 2e-3;
    const tmp = ctx.globalAlpha;
    ctx.globalAlpha = tmp * f;
    this.renderLink(
      ctx,
      startPos,
      endPos,
      link,
      true,
      f,
      "white",
      start_dir,
      end_dir
    );
    ctx.globalAlpha = tmp;
  }
};
/**
 * Modifies an existing point, adding a single-axis offset.
 * @param point The point to add the offset to
 * @param direction The direction to add the offset in
 * @param dist Distance to offset
 * @param factor Distance is mulitplied by this value.  Default: 0.25
 */
addSplineOffset_fn = function(point, direction, dist, factor = 0.25) {
  switch (direction) {
    case LinkDirection.LEFT:
      point[0] += dist * -factor;
      break;
    case LinkDirection.RIGHT:
      point[0] += dist * factor;
      break;
    case LinkDirection.UP:
      point[1] += dist * -factor;
      break;
    case LinkDirection.DOWN:
      point[1] += dist * factor;
      break;
  }
};
// Optimised buffers used during rendering
__privateAdd(_LGraphCanvas, _temp, new Float32Array(4));
__privateAdd(_LGraphCanvas, _temp_vec2, new Float32Array(2));
__privateAdd(_LGraphCanvas, _tmp_area, new Float32Array(4));
__privateAdd(_LGraphCanvas, _margin_area, new Float32Array(4));
__privateAdd(_LGraphCanvas, _link_bounding, new Float32Array(4));
__privateAdd(_LGraphCanvas, _lTempA, new Float32Array(2));
__privateAdd(_LGraphCanvas, _lTempB, new Float32Array(2));
__privateAdd(_LGraphCanvas, _lTempC, new Float32Array(2));
__publicField(_LGraphCanvas, "DEFAULT_BACKGROUND_IMAGE", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQBJREFUeNrs1rEKwjAUhlETUkj3vP9rdmr1Ysammk2w5wdxuLgcMHyptfawuZX4pJSWZTnfnu/lnIe/jNNxHHGNn//HNbbv+4dr6V+11uF527arU7+u63qfa/bnmh8sWLBgwYJlqRf8MEptXPBXJXa37BSl3ixYsGDBMliwFLyCV/DeLIMFCxYsWLBMwSt4Be/NggXLYMGCBUvBK3iNruC9WbBgwYJlsGApeAWv4L1ZBgsWLFiwYJmCV/AK3psFC5bBggULloJX8BpdwXuzYMGCBctgwVLwCl7Be7MMFixYsGDBsu8FH1FaSmExVfAxBa/gvVmwYMGCZbBg/W4vAQYA5tRF9QYlv/QAAAAASUVORK5CYII=");
__publicField(_LGraphCanvas, "DEFAULT_EVENT_LINK_COLOR", "#A86");
/** Link type to colour dictionary. */
__publicField(_LGraphCanvas, "link_type_colors", {
  "-1": _LGraphCanvas.DEFAULT_EVENT_LINK_COLOR,
  "number": "#AAA",
  "node": "#DCA"
});
__publicField(_LGraphCanvas, "gradients", {});
__publicField(_LGraphCanvas, "search_limit", -1);
__publicField(_LGraphCanvas, "node_colors", {
  red: { color: "#322", bgcolor: "#533", groupcolor: "#A88" },
  brown: { color: "#332922", bgcolor: "#593930", groupcolor: "#b06634" },
  green: { color: "#232", bgcolor: "#353", groupcolor: "#8A8" },
  blue: { color: "#223", bgcolor: "#335", groupcolor: "#88A" },
  pale_blue: {
    color: "#2a363b",
    bgcolor: "#3f5159",
    groupcolor: "#3f789e"
  },
  cyan: { color: "#233", bgcolor: "#355", groupcolor: "#8AA" },
  purple: { color: "#323", bgcolor: "#535", groupcolor: "#a1309b" },
  yellow: { color: "#432", bgcolor: "#653", groupcolor: "#b58b2a" },
  black: { color: "#222", bgcolor: "#000", groupcolor: "#444" }
});
__publicField(_LGraphCanvas, "active_canvas");
__publicField(_LGraphCanvas, "active_node");
var LGraphCanvas = _LGraphCanvas;
var MapProxyHandler = class {
  getOwnPropertyDescriptor(target, p) {
    const value = this.get(target, p);
    if (value) {
      return {
        configurable: true,
        enumerable: true,
        value
      };
    }
  }
  has(target, p) {
    if (typeof p === "symbol") return false;
    const int = parseInt(p, 10);
    return target.has(!isNaN(int) ? int : p);
  }
  ownKeys(target) {
    return [...target.keys()].map(String);
  }
  get(target, p) {
    if (p in target) return Reflect.get(target, p, target);
    if (typeof p === "symbol") return;
    const int = parseInt(p, 10);
    return target.get(!isNaN(int) ? int : p);
  }
  set(target, p, newValue2) {
    if (typeof p === "symbol") return false;
    const int = parseInt(p, 10);
    target.set(!isNaN(int) ? int : p, newValue2);
    return true;
  }
  deleteProperty(target, p) {
    return target.delete(p);
  }
  static bindAllMethods(map) {
    map.clear = map.clear.bind(map);
    map.delete = map.delete.bind(map);
    map.forEach = map.forEach.bind(map);
    map.get = map.get.bind(map);
    map.has = map.has.bind(map);
    map.set = map.set.bind(map);
    map.entries = map.entries.bind(map);
    map.keys = map.keys.bind(map);
    map.values = map.values.bind(map);
  }
};
var _lastFloatingLinkId, _floatingLinks, _reroutes;
var _LGraph = class _LGraph {
  /**
   * See {@link LGraph}
   * @param o data from previous serialization [optional]
   */
  constructor(o) {
    __publicField(this, "id", zeroUuid);
    __publicField(this, "revision", 0);
    __publicField(this, "_version", -1);
    /** The backing store for links.  Keys are wrapped in String() */
    __publicField(this, "_links", /* @__PURE__ */ new Map());
    /**
     * Indexed property access is deprecated.
     * Backwards compatibility with a Proxy has been added, but will eventually be removed.
     *
     * Use {@link Map} methods:
     * ```
     * const linkId = 123
     * const link = graph.links.get(linkId)
     * // Deprecated: const link = graph.links[linkId]
     * ```
     */
    __publicField(this, "links");
    __publicField(this, "list_of_graphcanvas");
    __publicField(this, "status", _LGraph.STATUS_STOPPED);
    __publicField(this, "state", {
      lastGroupId: 0,
      lastNodeId: 0,
      lastLinkId: 0,
      lastRerouteId: 0
    });
    __publicField(this, "_nodes", []);
    __publicField(this, "_nodes_by_id", {});
    __publicField(this, "_nodes_in_order", []);
    __publicField(this, "_nodes_executable", null);
    __publicField(this, "_groups", []);
    __publicField(this, "iteration", 0);
    __publicField(this, "globaltime", 0);
    /** @deprecated Unused */
    __publicField(this, "runningtime", 0);
    __publicField(this, "fixedtime", 0);
    __publicField(this, "fixedtime_lapse", 0.01);
    __publicField(this, "elapsed_time", 0.01);
    __publicField(this, "last_update_time", 0);
    __publicField(this, "starttime", 0);
    __publicField(this, "catch_errors", true);
    __publicField(this, "execution_timer_id");
    __publicField(this, "errors_in_execution");
    /** @deprecated Unused */
    __publicField(this, "execution_time");
    __publicField(this, "_last_trigger_time");
    __publicField(this, "filter");
    /** Must contain serialisable values, e.g. primitive types */
    __publicField(this, "config", {});
    __publicField(this, "vars", {});
    __publicField(this, "nodes_executing", []);
    __publicField(this, "nodes_actioning", []);
    __publicField(this, "nodes_executedAction", []);
    __publicField(this, "extra", {});
    /** @deprecated Deserialising a workflow sets this unused property. */
    __publicField(this, "version");
    /** Internal only.  Not required for serialisation; calculated on deserialise. */
    __privateAdd(this, _lastFloatingLinkId, 0);
    __privateAdd(this, _floatingLinks, /* @__PURE__ */ new Map());
    __privateAdd(this, _reroutes, /* @__PURE__ */ new Map());
    __publicField(this, "_input_nodes");
    if (LiteGraph.debug) console.log("Graph created");
    const links = this._links;
    MapProxyHandler.bindAllMethods(links);
    const handler = new MapProxyHandler();
    this.links = new Proxy(links, handler);
    this.list_of_graphcanvas = null;
    this.clear();
    if (o) this.configure(o);
  }
  /** @returns Whether the graph has no items */
  get empty() {
    return this._nodes.length + this._groups.length + this.reroutes.size === 0;
  }
  /** @returns All items on the canvas that can be selected */
  *positionableItems() {
    for (const node2 of this._nodes) yield node2;
    for (const group of this._groups) yield group;
    for (const reroute of this.reroutes.values()) yield reroute;
    return;
  }
  get floatingLinks() {
    return __privateGet(this, _floatingLinks);
  }
  /** All reroutes in this graph. */
  get reroutes() {
    return __privateGet(this, _reroutes);
  }
  /** @deprecated See {@link state}.{@link LGraphState.lastNodeId lastNodeId} */
  get last_node_id() {
    return this.state.lastNodeId;
  }
  set last_node_id(value) {
    this.state.lastNodeId = value;
  }
  /** @deprecated See {@link state}.{@link LGraphState.lastLinkId lastLinkId} */
  get last_link_id() {
    return this.state.lastLinkId;
  }
  set last_link_id(value) {
    this.state.lastLinkId = value;
  }
  /**
   * Removes all nodes from this graph
   */
  clear() {
    var _a;
    this.stop();
    this.status = _LGraph.STATUS_STOPPED;
    this.id = zeroUuid;
    this.revision = 0;
    this.state = {
      lastGroupId: 0,
      lastNodeId: 0,
      lastLinkId: 0,
      lastRerouteId: 0
    };
    this._version = -1;
    if (this._nodes) {
      for (const _node of this._nodes) {
        (_a = _node.onRemoved) == null ? void 0 : _a.call(_node);
      }
    }
    this._nodes = [];
    this._nodes_by_id = {};
    this._nodes_in_order = [];
    this._nodes_executable = null;
    this._links.clear();
    this.reroutes.clear();
    __privateGet(this, _floatingLinks).clear();
    __privateSet(this, _lastFloatingLinkId, 0);
    this._groups = [];
    this.iteration = 0;
    this.config = {};
    this.vars = {};
    this.extra = {};
    this.globaltime = 0;
    this.runningtime = 0;
    this.fixedtime = 0;
    this.fixedtime_lapse = 0.01;
    this.elapsed_time = 0.01;
    this.last_update_time = 0;
    this.starttime = 0;
    this.catch_errors = true;
    this.nodes_executing = [];
    this.nodes_actioning = [];
    this.nodes_executedAction = [];
    this.change();
    this.canvasAction((c) => c.clear());
  }
  get nodes() {
    return this._nodes;
  }
  get groups() {
    return this._groups;
  }
  /**
   * Attach Canvas to this graph
   */
  attachCanvas(graphcanvas) {
    var _a;
    if (graphcanvas.constructor != LGraphCanvas)
      throw "attachCanvas expects a LGraphCanvas instance";
    if (graphcanvas.graph != this)
      (_a = graphcanvas.graph) == null ? void 0 : _a.detachCanvas(graphcanvas);
    graphcanvas.graph = this;
    this.list_of_graphcanvas || (this.list_of_graphcanvas = []);
    this.list_of_graphcanvas.push(graphcanvas);
  }
  /**
   * Detach Canvas from this graph
   */
  detachCanvas(graphcanvas) {
    if (!this.list_of_graphcanvas) return;
    const pos = this.list_of_graphcanvas.indexOf(graphcanvas);
    if (pos == -1) return;
    graphcanvas.graph = null;
    this.list_of_graphcanvas.splice(pos, 1);
  }
  /**
   * @deprecated Will be removed in 0.9
   * Starts running this graph every interval milliseconds.
   * @param interval amount of milliseconds between executions, if 0 then it renders to the monitor refresh rate
   */
  start(interval) {
    var _a;
    if (this.status == _LGraph.STATUS_RUNNING) return;
    this.status = _LGraph.STATUS_RUNNING;
    (_a = this.onPlayEvent) == null ? void 0 : _a.call(this);
    this.sendEventToAllNodes("onStart");
    this.starttime = LiteGraph.getTime();
    this.last_update_time = this.starttime;
    interval || (interval = 0);
    if (interval == 0 && typeof window != "undefined" && window.requestAnimationFrame) {
      const on_frame = () => {
        var _a2, _b;
        if (this.execution_timer_id != -1) return;
        window.requestAnimationFrame(on_frame);
        (_a2 = this.onBeforeStep) == null ? void 0 : _a2.call(this);
        this.runStep(1, !this.catch_errors);
        (_b = this.onAfterStep) == null ? void 0 : _b.call(this);
      };
      this.execution_timer_id = -1;
      on_frame();
    } else {
      this.execution_timer_id = setInterval(() => {
        var _a2, _b;
        (_a2 = this.onBeforeStep) == null ? void 0 : _a2.call(this);
        this.runStep(1, !this.catch_errors);
        (_b = this.onAfterStep) == null ? void 0 : _b.call(this);
      }, interval);
    }
  }
  /**
   * @deprecated Will be removed in 0.9
   * Stops the execution loop of the graph
   */
  stop() {
    var _a;
    if (this.status == _LGraph.STATUS_STOPPED) return;
    this.status = _LGraph.STATUS_STOPPED;
    (_a = this.onStopEvent) == null ? void 0 : _a.call(this);
    if (this.execution_timer_id != null) {
      if (this.execution_timer_id != -1) {
        clearInterval(this.execution_timer_id);
      }
      this.execution_timer_id = null;
    }
    this.sendEventToAllNodes("onStop");
  }
  /**
   * Run N steps (cycles) of the graph
   * @param num number of steps to run, default is 1
   * @param do_not_catch_errors [optional] if you want to try/catch errors
   * @param limit max number of nodes to execute (used to execute from start to a node)
   */
  runStep(num, do_not_catch_errors, limit) {
    var _a, _b, _c, _d, _e, _f;
    num = num || 1;
    const start = LiteGraph.getTime();
    this.globaltime = 1e-3 * (start - this.starttime);
    const nodes = this._nodes_executable || this._nodes;
    if (!nodes) return;
    limit = limit || nodes.length;
    if (do_not_catch_errors) {
      for (let i = 0; i < num; i++) {
        for (let j = 0; j < limit; ++j) {
          const node2 = nodes[j];
          if (node2.mode == LGraphEventMode.ALWAYS && node2.onExecute) {
            (_a = node2.doExecute) == null ? void 0 : _a.call(node2);
          }
        }
        this.fixedtime += this.fixedtime_lapse;
        (_b = this.onExecuteStep) == null ? void 0 : _b.call(this);
      }
      (_c = this.onAfterExecute) == null ? void 0 : _c.call(this);
    } else {
      try {
        for (let i = 0; i < num; i++) {
          for (let j = 0; j < limit; ++j) {
            const node2 = nodes[j];
            if (node2.mode == LGraphEventMode.ALWAYS) {
              (_d = node2.onExecute) == null ? void 0 : _d.call(node2);
            }
          }
          this.fixedtime += this.fixedtime_lapse;
          (_e = this.onExecuteStep) == null ? void 0 : _e.call(this);
        }
        (_f = this.onAfterExecute) == null ? void 0 : _f.call(this);
        this.errors_in_execution = false;
      } catch (error) {
        this.errors_in_execution = true;
        if (LiteGraph.throw_errors) throw error;
        if (LiteGraph.debug) console.log("Error during execution:", error);
        this.stop();
      }
    }
    const now = LiteGraph.getTime();
    let elapsed = now - start;
    if (elapsed == 0) elapsed = 1;
    this.execution_time = 1e-3 * elapsed;
    this.globaltime += 1e-3 * elapsed;
    this.iteration += 1;
    this.elapsed_time = (now - this.last_update_time) * 1e-3;
    this.last_update_time = now;
    this.nodes_executing = [];
    this.nodes_actioning = [];
    this.nodes_executedAction = [];
  }
  /**
   * Updates the graph execution order according to relevance of the nodes (nodes with only outputs have more relevance than
   * nodes with only inputs.
   */
  updateExecutionOrder() {
    this._nodes_in_order = this.computeExecutionOrder(false);
    this._nodes_executable = [];
    for (const node2 of this._nodes_in_order) {
      if (node2.onExecute) {
        this._nodes_executable.push(node2);
      }
    }
  }
  // This is more internal, it computes the executable nodes in order and returns it
  computeExecutionOrder(only_onExecute, set_level) {
    var _a;
    const L = [];
    const S = [];
    const M = {};
    const visited_links = {};
    const remaining_links = {};
    for (const node2 of this._nodes) {
      if (only_onExecute && !node2.onExecute) {
        continue;
      }
      M[node2.id] = node2;
      let num = 0;
      if (node2.inputs) {
        for (const input of node2.inputs) {
          if ((input == null ? void 0 : input.link) != null) {
            num += 1;
          }
        }
      }
      if (num == 0) {
        S.push(node2);
        if (set_level) node2._level = 1;
      } else {
        if (set_level) node2._level = 0;
        remaining_links[node2.id] = num;
      }
    }
    while (true) {
      const node2 = S.shift();
      if (node2 === void 0) break;
      L.push(node2);
      delete M[node2.id];
      if (!node2.outputs) continue;
      for (const output of node2.outputs) {
        if ((output == null ? void 0 : output.links) == null || output.links.length == 0)
          continue;
        for (const link_id of output.links) {
          const link = this._links.get(link_id);
          if (!link) continue;
          if (visited_links[link.id]) continue;
          const target_node = this.getNodeById(link.target_id);
          if (target_node == null) {
            visited_links[link.id] = true;
            continue;
          }
          if (set_level) {
            (_a = node2._level) != null ? _a : node2._level = 0;
            if (!target_node._level || target_node._level <= node2._level) {
              target_node._level = node2._level + 1;
            }
          }
          visited_links[link.id] = true;
          remaining_links[target_node.id] -= 1;
          if (remaining_links[target_node.id] == 0) S.push(target_node);
        }
      }
    }
    for (const i in M) {
      L.push(M[i]);
    }
    if (L.length != this._nodes.length && LiteGraph.debug)
      console.warn("something went wrong, nodes missing");
    function setOrder(nodes) {
      const l = nodes.length;
      for (let i = 0; i < l; ++i) {
        nodes[i].order = i;
      }
    }
    setOrder(L);
    L.sort(function(A, B) {
      const Ap = A.constructor.priority || A.priority || 0;
      const Bp = B.constructor.priority || B.priority || 0;
      return Ap == Bp ? A.order - B.order : Ap - Bp;
    });
    setOrder(L);
    return L;
  }
  /**
   * @deprecated Will be removed in 0.9
   * Returns all the nodes that could affect this one (ancestors) by crawling all the inputs recursively.
   * It doesn't include the node itself
   * @returns an array with all the LGraphNodes that affect this node, in order of execution
   */
  getAncestors(node2) {
    const ancestors = [];
    const pending = [node2];
    const visited = {};
    while (pending.length) {
      const current = pending.shift();
      if (!(current == null ? void 0 : current.inputs)) continue;
      if (!visited[current.id] && current != node2) {
        visited[current.id] = true;
        ancestors.push(current);
      }
      for (let i = 0; i < current.inputs.length; ++i) {
        const input = current.getInputNode(i);
        if (input && !ancestors.includes(input)) {
          pending.push(input);
        }
      }
    }
    ancestors.sort(function(a, b) {
      return a.order - b.order;
    });
    return ancestors;
  }
  /**
   * Positions every node in a more readable manner
   */
  arrange(margin, layout) {
    margin = margin || 100;
    const nodes = this.computeExecutionOrder(false, true);
    const columns = [];
    for (const node2 of nodes) {
      const col = node2._level || 1;
      columns[col] || (columns[col] = []);
      columns[col].push(node2);
    }
    let x2 = margin;
    for (const column of columns) {
      if (!column) continue;
      let max_size = 100;
      let y = margin + LiteGraph.NODE_TITLE_HEIGHT;
      for (const node2 of column) {
        node2.pos[0] = layout == LiteGraph.VERTICAL_LAYOUT ? y : x2;
        node2.pos[1] = layout == LiteGraph.VERTICAL_LAYOUT ? x2 : y;
        const max_size_index = layout == LiteGraph.VERTICAL_LAYOUT ? 1 : 0;
        if (node2.size[max_size_index] > max_size) {
          max_size = node2.size[max_size_index];
        }
        const node_size_index = layout == LiteGraph.VERTICAL_LAYOUT ? 0 : 1;
        y += node2.size[node_size_index] + margin + LiteGraph.NODE_TITLE_HEIGHT;
      }
      x2 += max_size + margin;
    }
    this.setDirtyCanvas(true, true);
  }
  /**
   * Returns the amount of time the graph has been running in milliseconds
   * @returns number of milliseconds the graph has been running
   */
  getTime() {
    return this.globaltime;
  }
  /**
   * Returns the amount of time accumulated using the fixedtime_lapse var.
   * This is used in context where the time increments should be constant
   * @returns number of milliseconds the graph has been running
   */
  getFixedTime() {
    return this.fixedtime;
  }
  /**
   * Returns the amount of time it took to compute the latest iteration.
   * Take into account that this number could be not correct
   * if the nodes are using graphical actions
   * @returns number of milliseconds it took the last cycle
   */
  getElapsedTime() {
    return this.elapsed_time;
  }
  /**
   * @deprecated Will be removed in 0.9
   * Sends an event to all the nodes, useful to trigger stuff
   * @param eventname the name of the event (function to be called)
   * @param params parameters in array format
   */
  sendEventToAllNodes(eventname, params, mode) {
    mode = mode || LGraphEventMode.ALWAYS;
    const nodes = this._nodes_in_order || this._nodes;
    if (!nodes) return;
    for (const node2 of nodes) {
      if (!node2[eventname] || node2.mode != mode) continue;
      if (params === void 0) {
        node2[eventname]();
      } else if (params && params.constructor === Array) {
        node2[eventname].apply(node2, params);
      } else {
        node2[eventname](params);
      }
    }
  }
  /**
   * Runs an action on every canvas registered to this graph.
   * @param action Action to run for every canvas
   */
  canvasAction(action) {
    const canvases = this.list_of_graphcanvas;
    if (!canvases) return;
    for (const canvas2 of canvases) action(canvas2);
  }
  /** @deprecated See {@link LGraph.canvasAction} */
  sendActionToCanvas(action, params) {
    var _a;
    const { list_of_graphcanvas } = this;
    if (!list_of_graphcanvas) return;
    for (const c of list_of_graphcanvas) {
      (_a = c[action]) == null ? void 0 : _a.apply(c, params);
    }
  }
  /**
   * Adds a new node instance to this graph
   * @param node the instance of the node
   */
  add(node2, skip_compute_order) {
    var _a, _b;
    if (!node2) return;
    const { state } = this;
    if (LiteGraph.alwaysSnapToGrid) {
      const snapTo = this.getSnapToGridSize();
      if (snapTo) node2.snapToGrid(snapTo);
    }
    if (node2 instanceof LGraphGroup) {
      if (node2.id == null || node2.id === -1) node2.id = ++state.lastGroupId;
      if (node2.id > state.lastGroupId) state.lastGroupId = node2.id;
      this._groups.push(node2);
      this.setDirtyCanvas(true);
      this.change();
      node2.graph = this;
      this._version++;
      return;
    }
    if (node2.id != -1 && this._nodes_by_id[node2.id] != null) {
      console.warn(
        "LiteGraph: there is already a node with this ID, changing it"
      );
      node2.id = LiteGraph.use_uuids ? LiteGraph.uuidv4() : ++state.lastNodeId;
    }
    if (this._nodes.length >= LiteGraph.MAX_NUMBER_OF_NODES) {
      throw "LiteGraph: max number of nodes in a graph reached";
    }
    if (LiteGraph.use_uuids) {
      if (node2.id == null || node2.id == -1)
        node2.id = LiteGraph.uuidv4();
    } else {
      if (node2.id == null || node2.id == -1) {
        node2.id = ++state.lastNodeId;
      } else if (typeof node2.id === "number" && state.lastNodeId < node2.id) {
        state.lastNodeId = node2.id;
      }
    }
    node2.graph = this;
    this._version++;
    this._nodes.push(node2);
    this._nodes_by_id[node2.id] = node2;
    (_a = node2.onAdded) == null ? void 0 : _a.call(node2, this);
    if (this.config.align_to_grid) node2.alignToGrid();
    if (!skip_compute_order) this.updateExecutionOrder();
    (_b = this.onNodeAdded) == null ? void 0 : _b.call(this, node2);
    this.setDirtyCanvas(true);
    this.change();
    return node2;
  }
  /**
   * Removes a node from the graph
   * @param node the instance of the node
   */
  remove(node2) {
    var _a, _b, _c;
    if (node2 instanceof LGraphGroup) {
      const index = this._groups.indexOf(node2);
      if (index != -1) {
        this._groups.splice(index, 1);
      }
      node2.graph = void 0;
      this._version++;
      this.setDirtyCanvas(true, true);
      this.change();
      return;
    }
    if (this._nodes_by_id[node2.id] == null) return;
    if (node2.ignore_remove) return;
    this.beforeChange();
    const { inputs, outputs } = node2;
    if (inputs) {
      for (const [i, slot] of inputs.entries()) {
        if (slot.link != null) node2.disconnectInput(i, true);
      }
    }
    if (outputs) {
      for (const [i, slot] of outputs.entries()) {
        if ((_a = slot.links) == null ? void 0 : _a.length) node2.disconnectOutput(i);
      }
    }
    for (const link of this.floatingLinks.values()) {
      if (link.origin_id === node2.id || link.target_id === node2.id) {
        this.removeFloatingLink(link);
      }
    }
    (_b = node2.onRemoved) == null ? void 0 : _b.call(node2);
    node2.graph = null;
    this._version++;
    const { list_of_graphcanvas } = this;
    if (list_of_graphcanvas) {
      for (const canvas2 of list_of_graphcanvas) {
        if (canvas2.selected_nodes[node2.id])
          delete canvas2.selected_nodes[node2.id];
      }
    }
    const pos = this._nodes.indexOf(node2);
    if (pos != -1) this._nodes.splice(pos, 1);
    delete this._nodes_by_id[node2.id];
    (_c = this.onNodeRemoved) == null ? void 0 : _c.call(this, node2);
    this.canvasAction((c) => c.checkPanels());
    this.setDirtyCanvas(true, true);
    this.afterChange();
    this.change();
    this.updateExecutionOrder();
  }
  /**
   * Returns a node by its id.
   */
  getNodeById(id) {
    return id != null ? this._nodes_by_id[id] : null;
  }
  /**
   * Returns a list of nodes that matches a class
   * @param classObject the class itself (not an string)
   * @returns a list with all the nodes of this type
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  findNodesByClass(classObject, result) {
    result = result || [];
    result.length = 0;
    const { _nodes } = this;
    for (const node2 of _nodes) {
      if (node2.constructor === classObject)
        result.push(node2);
    }
    return result;
  }
  /**
   * Returns a list of nodes that matches a type
   * @param type the name of the node type
   * @returns a list with all the nodes of this type
   */
  findNodesByType(type, result) {
    var _a;
    const matchType = type.toLowerCase();
    result = result || [];
    result.length = 0;
    const { _nodes } = this;
    for (const node2 of _nodes) {
      if (((_a = node2.type) == null ? void 0 : _a.toLowerCase()) == matchType)
        result.push(node2);
    }
    return result;
  }
  /**
   * Returns the first node that matches a name in its title
   * @param title the name of the node to search
   * @returns the node or null
   */
  findNodeByTitle(title) {
    const { _nodes } = this;
    for (const node2 of _nodes) {
      if (node2.title == title)
        return node2;
    }
    return null;
  }
  /**
   * Returns a list of nodes that matches a name
   * @param title the name of the node to search
   * @returns a list with all the nodes with this name
   */
  findNodesByTitle(title) {
    const result = [];
    const { _nodes } = this;
    for (const node2 of _nodes) {
      if (node2.title == title)
        result.push(node2);
    }
    return result;
  }
  /**
   * Returns the top-most node in this position of the canvas
   * @param x the x coordinate in canvas space
   * @param y the y coordinate in canvas space
   * @param nodeList a list with all the nodes to search from, by default is all the nodes in the graph
   * @returns the node at this position or null
   */
  getNodeOnPos(x2, y, nodeList) {
    const nodes = nodeList || this._nodes;
    let i = nodes.length;
    while (--i >= 0) {
      const node2 = nodes[i];
      if (node2.isPointInside(x2, y)) return node2;
    }
    return null;
  }
  /**
   * Returns the top-most group in that position
   * @param x The x coordinate in canvas space
   * @param y The y coordinate in canvas space
   * @returns The group or null
   */
  getGroupOnPos(x2, y) {
    return this._groups.toReversed().find((g) => g.isPointInside(x2, y));
  }
  /**
   * Returns the top-most group with a titlebar in the provided position.
   * @param x The x coordinate in canvas space
   * @param y The y coordinate in canvas space
   * @returns The group or null
   */
  getGroupTitlebarOnPos(x2, y) {
    return this._groups.toReversed().find((g) => g.isPointInTitlebar(x2, y));
  }
  /**
   * Finds a reroute a the given graph point
   * @param x X co-ordinate in graph space
   * @param y Y co-ordinate in graph space
   * @returns The first reroute under the given co-ordinates, or undefined
   */
  getRerouteOnPos(x2, y) {
    for (const reroute of this.reroutes.values()) {
      const { pos } = reroute;
      if (isSortaInsideOctagon(x2 - pos[0], y - pos[1], 2 * Reroute.radius))
        return reroute;
    }
  }
  /**
   * Snaps the provided items to a grid.
   *
   * Item positions are reounded to the nearest multiple of {@link LiteGraph.CANVAS_GRID_SIZE}.
   *
   * When {@link LiteGraph.alwaysSnapToGrid} is enabled
   * and the grid size is falsy, a default of 1 is used.
   * @param items The items to be snapped to the grid
   * @todo Currently only snaps nodes.
   */
  snapToGrid(items) {
    const snapTo = this.getSnapToGridSize();
    if (!snapTo) return;
    for (const item of getAllNestedItems(items)) {
      if (!item.pinned) item.snapToGrid(snapTo);
    }
  }
  /**
   * Finds the size of the grid that items should be snapped to when moved.
   * @returns The size of the grid that items should be snapped to
   */
  getSnapToGridSize() {
    return LiteGraph.alwaysSnapToGrid ? LiteGraph.CANVAS_GRID_SIZE || 1 : LiteGraph.CANVAS_GRID_SIZE;
  }
  /**
   * @deprecated Will be removed in 0.9
   * Checks that the node type matches the node type registered,
   * used when replacing a nodetype by a newer version during execution
   * this replaces the ones using the old version with the new version
   */
  checkNodeTypes() {
    const { _nodes } = this;
    for (const [i, node2] of _nodes.entries()) {
      const ctor = LiteGraph.registered_node_types[node2.type];
      if (node2.constructor == ctor) continue;
      console.log("node being replaced by newer version:", node2.type);
      const newnode = LiteGraph.createNode(node2.type);
      if (!newnode) continue;
      _nodes[i] = newnode;
      newnode.configure(node2.serialize());
      newnode.graph = this;
      this._nodes_by_id[newnode.id] = newnode;
      if (node2.inputs) newnode.inputs = [...node2.inputs];
      if (node2.outputs) newnode.outputs = [...node2.outputs];
    }
    this.updateExecutionOrder();
  }
  // ********** GLOBALS *****************
  trigger(action, param) {
    var _a;
    (_a = this.onTrigger) == null ? void 0 : _a.call(this, action, param);
  }
  /** @todo Clean up - never implemented. */
  triggerInput(name, value) {
    const nodes = this.findNodesByTitle(name);
    for (const node2 of nodes) {
      node2.onTrigger(value);
    }
  }
  /** @todo Clean up - never implemented. */
  setCallback(name, func) {
    const nodes = this.findNodesByTitle(name);
    for (const node2 of nodes) {
      node2.setTrigger(func);
    }
  }
  // used for undo, called before any change is made to the graph
  beforeChange(info) {
    var _a;
    (_a = this.onBeforeChange) == null ? void 0 : _a.call(this, this, info);
    this.canvasAction((c) => {
      var _a2;
      return (_a2 = c.onBeforeChange) == null ? void 0 : _a2.call(c, this);
    });
  }
  // used to resend actions, called after any change is made to the graph
  afterChange(info) {
    var _a;
    (_a = this.onAfterChange) == null ? void 0 : _a.call(this, this, info);
    this.canvasAction((c) => {
      var _a2;
      return (_a2 = c.onAfterChange) == null ? void 0 : _a2.call(c, this);
    });
  }
  connectionChange(node2) {
    var _a;
    this.updateExecutionOrder();
    (_a = this.onConnectionChange) == null ? void 0 : _a.call(this, node2);
    this._version++;
    this.canvasAction((c) => {
      var _a2;
      return (_a2 = c.onConnectionChange) == null ? void 0 : _a2.call(c);
    });
  }
  /**
   * clears the triggered slot animation in all links (stop visual animation)
   */
  clearTriggeredSlots() {
    for (const link_info of this._links.values()) {
      if (!link_info) continue;
      if (link_info._last_time) link_info._last_time = 0;
    }
  }
  /* Called when something visually changed (not the graph!) */
  change() {
    var _a;
    if (LiteGraph.debug) {
      console.log("Graph changed");
    }
    this.canvasAction((c) => c.setDirty(true, true));
    (_a = this.on_change) == null ? void 0 : _a.call(this, this);
  }
  setDirtyCanvas(fg, bg) {
    this.canvasAction((c) => c.setDirty(fg, bg));
  }
  addFloatingLink(link) {
    var _a, _b, _c, _d, _e;
    if (link.id === -1) {
      link.id = ++__privateWrapper(this, _lastFloatingLinkId)._;
    }
    __privateGet(this, _floatingLinks).set(link.id, link);
    const slot = link.target_id !== -1 ? (_b = (_a = this.getNodeById(link.target_id)) == null ? void 0 : _a.inputs) == null ? void 0 : _b[link.target_slot] : (_d = (_c = this.getNodeById(link.origin_id)) == null ? void 0 : _c.outputs) == null ? void 0 : _d[link.origin_slot];
    if (slot) {
      (_e = slot._floatingLinks) != null ? _e : slot._floatingLinks = /* @__PURE__ */ new Set();
      slot._floatingLinks.add(link);
    } else {
      console.warn(`Adding invalid floating link: target/slot: [${link.target_id}/${link.target_slot}] origin/slot: [${link.origin_id}/${link.origin_slot}]`);
    }
    const reroutes = LLink.getReroutes(this, link);
    for (const reroute of reroutes) {
      reroute.floatingLinkIds.add(link.id);
    }
    return link;
  }
  removeFloatingLink(link) {
    var _a, _b, _c, _d, _e;
    __privateGet(this, _floatingLinks).delete(link.id);
    const slot = link.target_id !== -1 ? (_b = (_a = this.getNodeById(link.target_id)) == null ? void 0 : _a.inputs) == null ? void 0 : _b[link.target_slot] : (_d = (_c = this.getNodeById(link.origin_id)) == null ? void 0 : _c.outputs) == null ? void 0 : _d[link.origin_slot];
    if (slot) {
      (_e = slot._floatingLinks) == null ? void 0 : _e.delete(link);
    }
    const reroutes = LLink.getReroutes(this, link);
    for (const reroute of reroutes) {
      reroute.floatingLinkIds.delete(link.id);
      if (reroute.floatingLinkIds.size === 0) {
        delete reroute.floating;
      }
      if (reroute.totalLinks === 0) this.removeReroute(reroute.id);
    }
  }
  getReroute(id) {
    return id == null ? void 0 : this.reroutes.get(id);
  }
  /**
   * Configures a reroute on the graph where ID is already known (probably deserialisation).
   * Creates the object if it does not exist.
   * @param serialisedReroute See {@link SerialisableReroute}
   */
  setReroute({ id, parentId, pos, linkIds, floating }) {
    var _a;
    id != null ? id : id = ++this.state.lastRerouteId;
    if (id > this.state.lastRerouteId) this.state.lastRerouteId = id;
    const reroute = (_a = this.reroutes.get(id)) != null ? _a : new Reroute(id, this);
    reroute.update(parentId, pos, linkIds, floating);
    this.reroutes.set(id, reroute);
    return reroute;
  }
  /**
   * Creates a new reroute and adds it to the graph.
   * @param pos Position in graph space
   * @param before The existing link segment (reroute, link) that will be after this reroute,
   * going from the node output to input.
   * @returns The newly created reroute - typically ignored.
   */
  createReroute(pos, before) {
    const rerouteId = ++this.state.lastRerouteId;
    const linkIds = before instanceof Reroute ? before.linkIds : [before.id];
    const floatingLinkIds = before instanceof Reroute ? before.floatingLinkIds : [before.id];
    const reroute = new Reroute(rerouteId, this, pos, before.parentId, linkIds, floatingLinkIds);
    this.reroutes.set(rerouteId, reroute);
    for (const linkId of linkIds) {
      const link = this._links.get(linkId);
      if (!link) continue;
      if (link.parentId === before.parentId) link.parentId = rerouteId;
      const reroutes = LLink.getReroutes(this, link);
      for (const x2 of reroutes.filter((x22) => x22.parentId === before.parentId)) {
        x2.parentId = rerouteId;
      }
    }
    for (const linkId of floatingLinkIds) {
      const link = this.floatingLinks.get(linkId);
      if (!link) continue;
      if (link.parentId === before.parentId) link.parentId = rerouteId;
      const reroutes = LLink.getReroutes(this, link);
      for (const x2 of reroutes.filter((x22) => x22.parentId === before.parentId)) {
        x2.parentId = rerouteId;
      }
    }
    return reroute;
  }
  /**
   * Removes a reroute from the graph
   * @param id ID of reroute to remove
   */
  removeReroute(id) {
    const { reroutes } = this;
    const reroute = reroutes.get(id);
    if (!reroute) return;
    const { parentId, linkIds, floatingLinkIds } = reroute;
    for (const reroute2 of reroutes.values()) {
      if (reroute2.parentId === id) reroute2.parentId = parentId;
    }
    for (const linkId of linkIds) {
      const link = this._links.get(linkId);
      if (link && link.parentId === id) link.parentId = parentId;
    }
    for (const linkId of floatingLinkIds) {
      const link = this.floatingLinks.get(linkId);
      if (!link) {
        console.warn(`Removed reroute had floating link ID that did not exist [${linkId}]`);
        continue;
      }
      const floatingReroutes = LLink.getReroutes(this, link);
      const lastReroute = floatingReroutes.at(-1);
      const secondLastReroute = floatingReroutes.at(-2);
      if (reroute !== lastReroute) {
        continue;
      } else if ((secondLastReroute == null ? void 0 : secondLastReroute.totalLinks) !== 1) {
        this.removeFloatingLink(link);
      } else if (link.parentId === id) {
        link.parentId = parentId;
        secondLastReroute.floating = reroute.floating;
      }
    }
    reroutes.delete(id);
    this.setDirtyCanvas(false, true);
  }
  /**
   * Destroys a link
   */
  removeLink(link_id) {
    const link = this._links.get(link_id);
    if (!link) return;
    const node2 = this.getNodeById(link.target_id);
    node2 == null ? void 0 : node2.disconnectInput(link.target_slot, false);
    link.disconnect(this);
  }
  /**
   * Creates a Object containing all the info about this graph, it can be serialized
   * @deprecated Use {@link asSerialisable}, which returns the newer schema version.
   * @returns value of the node
   */
  serialize(option) {
    const { config, state, groups, nodes, reroutes, extra, floatingLinks } = this.asSerialisable(option);
    const linkArray = [...this._links.values()];
    const links = linkArray.map((x2) => x2.serialize());
    if (reroutes == null ? void 0 : reroutes.length) {
      extra.linkExtensions = linkArray.filter((x2) => x2.parentId !== void 0).map((x2) => ({ id: x2.id, parentId: x2.parentId }));
    }
    extra.reroutes = (reroutes == null ? void 0 : reroutes.length) ? reroutes : void 0;
    return {
      id: this.id,
      revision: this.revision,
      last_node_id: state.lastNodeId,
      last_link_id: state.lastLinkId,
      nodes,
      links,
      floatingLinks,
      groups,
      config,
      extra,
      version: LiteGraph.VERSION
    };
  }
  /**
   * Prepares a shallow copy of this object for immediate serialisation or structuredCloning.
   * The return value should be discarded immediately.
   * @param options Serialise options = currently `sortNodes: boolean`, whether to sort nodes by ID.
   * @returns A shallow copy of parts of this graph, with shallow copies of its serialisable objects.
   * Mutating the properties of the return object may result in changes to your graph.
   * It is intended for use with {@link structuredClone} or {@link JSON.stringify}.
   */
  asSerialisable(options2) {
    var _a;
    const { id, revision, config, state, extra } = this;
    const nodeList = !LiteGraph.use_uuids && (options2 == null ? void 0 : options2.sortNodes) ? [...this._nodes].sort((a, b) => a.id - b.id) : this._nodes;
    const nodes = nodeList.map((node2) => node2.serialize());
    const groups = this._groups.map((x2) => x2.serialize());
    const links = this._links.size ? [...this._links.values()].map((x2) => x2.asSerialisable()) : void 0;
    const floatingLinks = this.floatingLinks.size ? [...this.floatingLinks.values()].map((x2) => x2.asSerialisable()) : void 0;
    const reroutes = this.reroutes.size ? [...this.reroutes.values()].map((x2) => x2.asSerialisable()) : void 0;
    const data = {
      id,
      revision,
      version: _LGraph.serialisedSchemaVersion,
      config,
      state,
      groups,
      nodes,
      links,
      floatingLinks,
      reroutes,
      extra
    };
    (_a = this.onSerialize) == null ? void 0 : _a.call(this, data);
    return data;
  }
  /**
   * Configure a graph from a JSON string
   * @param data The deserialised object to configure this graph from
   * @param keep_old If `true`, the graph will not be cleared prior to
   * adding the configuration.
   */
  configure(data, keep_old) {
    var _a;
    if (!data) return;
    if (!keep_old) this.clear();
    if (data.id) this.id = data.id;
    else if (this.id === zeroUuid) this.id = createUuidv4();
    let reroutes;
    if (data.version === 0.4) {
      const { extra } = data;
      if (Array.isArray(data.links)) {
        for (const linkData of data.links) {
          const link = LLink.createFromArray(linkData);
          this._links.set(link.id, link);
        }
      }
      if (Array.isArray(extra == null ? void 0 : extra.linkExtensions)) {
        for (const linkEx of extra.linkExtensions) {
          const link = this._links.get(linkEx.id);
          if (link) link.parentId = linkEx.parentId;
        }
      }
      reroutes = extra == null ? void 0 : extra.reroutes;
    } else {
      if (data.state) {
        const { state: { lastGroupId, lastLinkId, lastNodeId, lastRerouteId } } = data;
        if (lastGroupId != null) this.state.lastGroupId = lastGroupId;
        if (lastLinkId != null) this.state.lastLinkId = lastLinkId;
        if (lastNodeId != null) this.state.lastNodeId = lastNodeId;
        if (lastRerouteId != null) this.state.lastRerouteId = lastRerouteId;
      }
      if (Array.isArray(data.links)) {
        for (const linkData of data.links) {
          const link = LLink.create(linkData);
          this._links.set(link.id, link);
        }
      }
      reroutes = data.reroutes;
    }
    if (Array.isArray(reroutes)) {
      for (const rerouteData of reroutes) {
        this.setReroute(rerouteData);
      }
    }
    const nodesData = data.nodes;
    for (const i in data) {
      if (["nodes", "groups", "links", "state", "reroutes", "floatingLinks", "id"].includes(i)) {
        continue;
      }
      this[i] = data[i];
    }
    let error = false;
    this._nodes = [];
    if (nodesData) {
      for (const n_info of nodesData) {
        let node2 = LiteGraph.createNode(String(n_info.type), n_info.title);
        if (!node2) {
          if (LiteGraph.debug) console.log("Node not found or has errors:", n_info.type);
          node2 = new LGraphNode("");
          node2.last_serialization = n_info;
          node2.has_errors = true;
          error = true;
        }
        node2.id = n_info.id;
        this.add(node2, true);
      }
      for (const n_info of nodesData) {
        const node2 = this.getNodeById(n_info.id);
        node2 == null ? void 0 : node2.configure(n_info);
      }
    }
    if (Array.isArray(data.floatingLinks)) {
      for (const linkData of data.floatingLinks) {
        const floatingLink = LLink.create(linkData);
        this.addFloatingLink(floatingLink);
        if (floatingLink.id > __privateGet(this, _lastFloatingLinkId)) __privateSet(this, _lastFloatingLinkId, floatingLink.id);
      }
    }
    for (const reroute of this.reroutes.values()) {
      if (!reroute.validateLinks(this._links, this.floatingLinks)) {
        this.reroutes.delete(reroute.id);
      }
    }
    this._groups.length = 0;
    const groupData = data.groups;
    if (groupData) {
      for (const data2 of groupData) {
        const group = new LiteGraph.LGraphGroup();
        group.configure(data2);
        this.add(group);
      }
    }
    this.updateExecutionOrder();
    this.extra = data.extra || {};
    (_a = this.onConfigure) == null ? void 0 : _a.call(this, data);
    this._version++;
    this.setDirtyCanvas(true, true);
    return error;
  }
  load(url, callback) {
    const that = this;
    if (url instanceof Blob || url instanceof File) {
      const reader = new FileReader();
      reader.addEventListener("load", function(event) {
        var _a;
        const result = stringOrEmpty((_a = event.target) == null ? void 0 : _a.result);
        const data = JSON.parse(result);
        that.configure(data);
        callback == null ? void 0 : callback();
      });
      reader.readAsText(url);
      return;
    }
    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.send(null);
    req.addEventListener("load", function() {
      if (req.status !== 200) {
        console.error("Error loading graph:", req.status, req.response);
        return;
      }
      const data = JSON.parse(req.response);
      that.configure(data);
      callback == null ? void 0 : callback();
    });
    req.addEventListener("error", (err) => {
      console.error("Error loading graph:", err);
    });
  }
};
_lastFloatingLinkId = new WeakMap();
_floatingLinks = new WeakMap();
_reroutes = new WeakMap();
__publicField(_LGraph, "serialisedSchemaVersion", 1);
__publicField(_LGraph, "STATUS_STOPPED", 1);
__publicField(_LGraph, "STATUS_RUNNING", 2);
var LGraph = _LGraph;
var LiteGraphGlobal = class {
  constructor() {
    // Enums
    __publicField(this, "SlotShape", SlotShape);
    __publicField(this, "SlotDirection", SlotDirection);
    __publicField(this, "SlotType", SlotType);
    __publicField(this, "LabelPosition", LabelPosition);
    /** Used in serialised graphs at one point. */
    __publicField(this, "VERSION", 0.4);
    __publicField(this, "CANVAS_GRID_SIZE", 10);
    __publicField(this, "NODE_TITLE_HEIGHT", 30);
    __publicField(this, "NODE_TITLE_TEXT_Y", 20);
    __publicField(this, "NODE_SLOT_HEIGHT", 20);
    __publicField(this, "NODE_WIDGET_HEIGHT", 20);
    __publicField(this, "NODE_WIDTH", 140);
    __publicField(this, "NODE_MIN_WIDTH", 50);
    __publicField(this, "NODE_COLLAPSED_RADIUS", 10);
    __publicField(this, "NODE_COLLAPSED_WIDTH", 80);
    __publicField(this, "NODE_TITLE_COLOR", "#999");
    __publicField(this, "NODE_SELECTED_TITLE_COLOR", "#FFF");
    __publicField(this, "NODE_TEXT_SIZE", 14);
    __publicField(this, "NODE_TEXT_COLOR", "#AAA");
    __publicField(this, "NODE_TEXT_HIGHLIGHT_COLOR", "#EEE");
    __publicField(this, "NODE_SUBTEXT_SIZE", 12);
    __publicField(this, "NODE_DEFAULT_COLOR", "#333");
    __publicField(this, "NODE_DEFAULT_BGCOLOR", "#353535");
    __publicField(this, "NODE_DEFAULT_BOXCOLOR", "#666");
    __publicField(this, "NODE_DEFAULT_SHAPE", RenderShape.ROUND);
    __publicField(this, "NODE_BOX_OUTLINE_COLOR", "#FFF");
    __publicField(this, "NODE_ERROR_COLOUR", "#E00");
    __publicField(this, "DEFAULT_SHADOW_COLOR", "rgba(0,0,0,0.5)");
    __publicField(this, "DEFAULT_GROUP_FONT", 24);
    __publicField(this, "DEFAULT_GROUP_FONT_SIZE");
    __publicField(this, "WIDGET_BGCOLOR", "#222");
    __publicField(this, "WIDGET_OUTLINE_COLOR", "#666");
    __publicField(this, "WIDGET_ADVANCED_OUTLINE_COLOR", "rgba(56, 139, 253, 0.8)");
    __publicField(this, "WIDGET_TEXT_COLOR", "#DDD");
    __publicField(this, "WIDGET_SECONDARY_TEXT_COLOR", "#999");
    __publicField(this, "LINK_COLOR", "#9A9");
    __publicField(this, "EVENT_LINK_COLOR", "#A86");
    __publicField(this, "CONNECTING_LINK_COLOR", "#AFA");
    /** avoid infinite loops */
    __publicField(this, "MAX_NUMBER_OF_NODES", 1e4);
    /** default node position */
    __publicField(this, "DEFAULT_POSITION", [100, 100]);
    /** ,"circle" */
    __publicField(this, "VALID_SHAPES", ["default", "box", "round", "card"]);
    __publicField(this, "ROUND_RADIUS", 8);
    // shapes are used for nodes but also for slots
    __publicField(this, "BOX_SHAPE", RenderShape.BOX);
    __publicField(this, "ROUND_SHAPE", RenderShape.ROUND);
    __publicField(this, "CIRCLE_SHAPE", RenderShape.CIRCLE);
    __publicField(this, "CARD_SHAPE", RenderShape.CARD);
    __publicField(this, "ARROW_SHAPE", RenderShape.ARROW);
    /** intended for slot arrays */
    __publicField(this, "GRID_SHAPE", RenderShape.GRID);
    // enums
    __publicField(this, "INPUT", NodeSlotType.INPUT);
    __publicField(this, "OUTPUT", NodeSlotType.OUTPUT);
    // TODO: -1 can lead to ambiguity in JS; these should be updated to a more explicit constant or Symbol.
    /** for outputs */
    __publicField(this, "EVENT", -1);
    /** for inputs */
    __publicField(this, "ACTION", -1);
    /** helper, will add "On Request" and more in the future */
    __publicField(this, "NODE_MODES", ["Always", "On Event", "Never", "On Trigger"]);
    /** use with node_box_coloured_by_mode */
    __publicField(this, "NODE_MODES_COLORS", ["#666", "#422", "#333", "#224", "#626"]);
    __publicField(this, "ALWAYS", LGraphEventMode.ALWAYS);
    __publicField(this, "ON_EVENT", LGraphEventMode.ON_EVENT);
    __publicField(this, "NEVER", LGraphEventMode.NEVER);
    __publicField(this, "ON_TRIGGER", LGraphEventMode.ON_TRIGGER);
    __publicField(this, "UP", LinkDirection.UP);
    __publicField(this, "DOWN", LinkDirection.DOWN);
    __publicField(this, "LEFT", LinkDirection.LEFT);
    __publicField(this, "RIGHT", LinkDirection.RIGHT);
    __publicField(this, "CENTER", LinkDirection.CENTER);
    /** helper */
    __publicField(this, "LINK_RENDER_MODES", ["Straight", "Linear", "Spline"]);
    __publicField(this, "HIDDEN_LINK", LinkRenderType.HIDDEN_LINK);
    __publicField(this, "STRAIGHT_LINK", LinkRenderType.STRAIGHT_LINK);
    __publicField(this, "LINEAR_LINK", LinkRenderType.LINEAR_LINK);
    __publicField(this, "SPLINE_LINK", LinkRenderType.SPLINE_LINK);
    __publicField(this, "NORMAL_TITLE", TitleMode.NORMAL_TITLE);
    __publicField(this, "NO_TITLE", TitleMode.NO_TITLE);
    __publicField(this, "TRANSPARENT_TITLE", TitleMode.TRANSPARENT_TITLE);
    __publicField(this, "AUTOHIDE_TITLE", TitleMode.AUTOHIDE_TITLE);
    /** arrange nodes vertically */
    __publicField(this, "VERTICAL_LAYOUT", "vertical");
    /** used to redirect calls */
    __publicField(this, "proxy", null);
    __publicField(this, "node_images_path", "");
    __publicField(this, "debug", false);
    __publicField(this, "catch_exceptions", true);
    __publicField(this, "throw_errors", true);
    /** if set to true some nodes like Formula would be allowed to evaluate code that comes from unsafe sources (like node configuration), which could lead to exploits */
    __publicField(this, "allow_scripts", false);
    /** nodetypes by string */
    __publicField(this, "registered_node_types", {});
    /** @deprecated used for dropping files in the canvas.  It appears the code that enables this was removed, but the object remains and is references by built-in drag drop. */
    __publicField(this, "node_types_by_file_extension", {});
    /** node types by classname */
    __publicField(this, "Nodes", {});
    /** used to store vars between graphs */
    __publicField(this, "Globals", {});
    /** @deprecated Unused and will be deleted. */
    __publicField(this, "searchbox_extras", {});
    /** [true!] this make the nodes box (top left circle) coloured when triggered (execute/action), visual feedback */
    __publicField(this, "node_box_coloured_when_on", false);
    /** [true!] nodebox based on node mode, visual feedback */
    __publicField(this, "node_box_coloured_by_mode", false);
    /** [false on mobile] better true if not touch device, TODO add an helper/listener to close if false */
    __publicField(this, "dialog_close_on_mouse_leave", false);
    __publicField(this, "dialog_close_on_mouse_leave_delay", 500);
    /** [false!] prefer false if results too easy to break links - implement with ALT or TODO custom keys */
    __publicField(this, "shift_click_do_break_link_from", false);
    /** [false!]prefer false, way too easy to break links */
    __publicField(this, "click_do_break_link_to", false);
    /** [true!] who accidentally ctrl-alt-clicks on an in/output? nobody! that's who! */
    __publicField(this, "ctrl_alt_click_do_break_link", true);
    /** [true!] snaps links when dragging connections over valid targets */
    __publicField(this, "snaps_for_comfy", true);
    /** [true!] renders a partial border to highlight when a dragged link is snapped to a node */
    __publicField(this, "snap_highlights_node", true);
    /**
     * If `true`, items always snap to the grid - modifier keys are ignored.
     * When {@link snapToGrid} is falsy, a value of `1` is used.
     * Default: `false`
     */
    __publicField(this, "alwaysSnapToGrid");
    /**
     * When set to a positive number, when nodes are moved their positions will
     * be rounded to the nearest multiple of this value.  Half up.
     * Default: `undefined`
     * @todo Not implemented - see {@link LiteGraph.CANVAS_GRID_SIZE}
     */
    __publicField(this, "snapToGrid");
    /** [false on mobile] better true if not touch device, TODO add an helper/listener to close if false */
    __publicField(this, "search_hide_on_mouse_leave", true);
    /**
     * [true!] enable filtering slots type in the search widget
     * !requires auto_load_slot_types or manual set registered_slot_[in/out]_types and slot_types_[in/out]
     */
    __publicField(this, "search_filter_enabled", false);
    /** [true!] opens the results list when opening the search widget */
    __publicField(this, "search_show_all_on_open", true);
    /**
     * [if want false, use true, run, get vars values to be statically set, than disable]
     * nodes types and nodeclass association with node types need to be calculated,
     * if dont want this, calculate once and set registered_slot_[in/out]_types and slot_types_[in/out]
     */
    __publicField(this, "auto_load_slot_types", false);
    // set these values if not using auto_load_slot_types
    /** slot types for nodeclass */
    __publicField(this, "registered_slot_in_types", {});
    /** slot types for nodeclass */
    __publicField(this, "registered_slot_out_types", {});
    /** slot types IN */
    __publicField(this, "slot_types_in", []);
    /** slot types OUT */
    __publicField(this, "slot_types_out", []);
    /**
     * specify for each IN slot type a(/many) default node(s), use single string, array, or object
     * (with node, title, parameters, ..) like for search
     */
    __publicField(this, "slot_types_default_in", {});
    /**
     * specify for each OUT slot type a(/many) default node(s), use single string, array, or object
     * (with node, title, parameters, ..) like for search
     */
    __publicField(this, "slot_types_default_out", {});
    /** [true!] very handy, ALT click to clone and drag the new node */
    __publicField(this, "alt_drag_do_clone_nodes", false);
    /**
     * [true!] will create and connect event slots when using action/events connections,
     * !WILL CHANGE node mode when using onTrigger (enable mode colors), onExecuted does not need this
     */
    __publicField(this, "do_add_triggers_slots", false);
    /** [false!] being events, it is strongly reccomended to use them sequentially, one by one */
    __publicField(this, "allow_multi_output_for_events", true);
    /** [true!] allows to create and connect a ndoe clicking with the third button (wheel) */
    __publicField(this, "middle_click_slot_add_default_node", false);
    /** [true!] dragging a link to empty space will open a menu, add from list, search or defaults */
    __publicField(this, "release_link_on_empty_shows_menu", false);
    /** "mouse"|"pointer" use mouse for retrocompatibility issues? (none found @ now) */
    __publicField(this, "pointerevents_method", "pointer");
    /**
     * [true!] allows ctrl + shift + v to paste nodes with the outputs of the unselected nodes connected
     * with the inputs of the newly pasted nodes
     */
    __publicField(this, "ctrl_shift_v_paste_connect_unselected_outputs", true);
    // if true, all newly created nodes/links will use string UUIDs for their id fields instead of integers.
    // use this if you must have node IDs that are unique across all graphs and subgraphs.
    __publicField(this, "use_uuids", false);
    // Whether to highlight the bounding box of selected groups
    __publicField(this, "highlight_selected_group", true);
    /** Whether to scale context with the graph when zooming in.  Zooming out never makes context menus smaller. */
    __publicField(this, "context_menu_scaling", false);
    // TODO: Remove legacy accessors
    __publicField(this, "LGraph", LGraph);
    __publicField(this, "LLink", LLink);
    __publicField(this, "LGraphNode", LGraphNode);
    __publicField(this, "LGraphGroup", LGraphGroup);
    __publicField(this, "DragAndScale", DragAndScale);
    __publicField(this, "LGraphCanvas", LGraphCanvas);
    __publicField(this, "ContextMenu", ContextMenu);
    __publicField(this, "CurveEditor", CurveEditor);
    __publicField(this, "Reroute", Reroute);
    __publicField(this, "InputIndicators", InputIndicators);
    /** @see {@link createUuidv4} @inheritdoc */
    __publicField(this, "uuidv4", createUuidv4);
    __publicField(this, "distance", distance);
    __publicField(this, "isInsideRectangle", isInsideRectangle);
    __publicField(this, "overlapBounding", overlapBounding);
  }
  /**
   * Register a node class so it can be listed when the user wants to create a new one
   * @param type name of the node and path
   * @param base_class class containing the structure of a node
   */
  registerNodeType(type, base_class) {
    var _a, _b, _c;
    if (!base_class.prototype)
      throw "Cannot register a simple object, it must be a class with a prototype";
    base_class.type = type;
    if (this.debug) console.log("Node registered:", type);
    const classname = base_class.name;
    const pos = type.lastIndexOf("/");
    base_class.category = type.substring(0, pos);
    base_class.title || (base_class.title = classname);
    for (const i in LGraphNode.prototype) {
      (_a = base_class.prototype)[i] || (_a[i] = LGraphNode.prototype[i]);
    }
    const prev = this.registered_node_types[type];
    if (prev) {
      console.log("replacing node type:", type);
    }
    this.registered_node_types[type] = base_class;
    if (base_class.constructor.name) this.Nodes[classname] = base_class;
    (_b = this.onNodeTypeRegistered) == null ? void 0 : _b.call(this, type, base_class);
    if (prev) (_c = this.onNodeTypeReplaced) == null ? void 0 : _c.call(this, type, base_class, prev);
    if (base_class.prototype.onPropertyChange)
      console.warn(`LiteGraph node class ${type} has onPropertyChange method, it must be called onPropertyChanged with d at the end`);
    if (this.auto_load_slot_types) new base_class(base_class.title || "tmpnode");
  }
  /**
   * removes a node type from the system
   * @param type name of the node or the node constructor itself
   */
  unregisterNodeType(type) {
    const base_class = typeof type === "string" ? this.registered_node_types[type] : type;
    if (!base_class) throw `node type not found: ${String(type)}`;
    delete this.registered_node_types[String(base_class.type)];
    const name = base_class.constructor.name;
    if (name) delete this.Nodes[name];
  }
  /**
   * Save a slot type and his node
   * @param type name of the node or the node constructor itself
   * @param slot_type name of the slot type (variable type), eg. string, number, array, boolean, ..
   */
  registerNodeAndSlotType(type, slot_type, out) {
    out || (out = false);
    const base_class = typeof type === "string" && this.registered_node_types[type] !== "anonymous" ? this.registered_node_types[type] : type;
    const class_type = base_class.constructor.type;
    let allTypes = [];
    if (typeof slot_type === "string") {
      allTypes = slot_type.split(",");
    } else if (slot_type == this.EVENT || slot_type == this.ACTION) {
      allTypes = ["_event_"];
    } else {
      allTypes = ["*"];
    }
    for (let slotType of allTypes) {
      if (slotType === "") slotType = "*";
      const registerTo = out ? "registered_slot_out_types" : "registered_slot_in_types";
      if (this[registerTo][slotType] === void 0)
        this[registerTo][slotType] = { nodes: [] };
      if (!this[registerTo][slotType].nodes.includes(class_type))
        this[registerTo][slotType].nodes.push(class_type);
      const types = out ? this.slot_types_out : this.slot_types_in;
      if (!types.includes(slotType.toLowerCase())) {
        types.push(slotType.toLowerCase());
        types.sort();
      }
    }
  }
  /**
   * Removes all previously registered node's types
   */
  clearRegisteredTypes() {
    this.registered_node_types = {};
    this.node_types_by_file_extension = {};
    this.Nodes = {};
    this.searchbox_extras = {};
  }
  /**
   * Create a node of a given type with a name. The node is not attached to any graph yet.
   * @param type full name of the node class. p.e. "math/sin"
   * @param title a name to distinguish from other nodes
   * @param options to set options
   */
  createNode(type, title, options2) {
    var _a;
    const base_class = this.registered_node_types[type];
    if (!base_class) {
      if (this.debug) console.log(`GraphNode type "${type}" not registered.`);
      return null;
    }
    title = title || base_class.title || type;
    let node2 = null;
    if (this.catch_exceptions) {
      try {
        node2 = new base_class(title);
      } catch (error) {
        console.error(error);
        return null;
      }
    } else {
      node2 = new base_class(title);
    }
    node2.type = type;
    if (!node2.title && title) node2.title = title;
    node2.properties || (node2.properties = {});
    node2.properties_info || (node2.properties_info = []);
    node2.flags || (node2.flags = {});
    node2.size || (node2.size = node2.computeSize());
    node2.pos || (node2.pos = [this.DEFAULT_POSITION[0], this.DEFAULT_POSITION[1]]);
    node2.mode || (node2.mode = LGraphEventMode.ALWAYS);
    if (options2) {
      for (const i in options2) {
        node2[i] = options2[i];
      }
    }
    (_a = node2.onNodeCreated) == null ? void 0 : _a.call(node2);
    return node2;
  }
  /**
   * Returns a registered node type with a given name
   * @param type full name of the node class. p.e. "math/sin"
   * @returns the node class
   */
  getNodeType(type) {
    return this.registered_node_types[type];
  }
  /**
   * Returns a list of node types matching one category
   * @param category category name
   * @returns array with all the node classes
   */
  getNodeTypesInCategory(category, filter) {
    const r = [];
    for (const i in this.registered_node_types) {
      const type = this.registered_node_types[i];
      if (type.filter != filter) continue;
      if (category == "") {
        if (type.category == null) r.push(type);
      } else if (type.category == category) {
        r.push(type);
      }
    }
    return r;
  }
  /**
   * Returns a list with all the node type categories
   * @param filter only nodes with ctor.filter equal can be shown
   * @returns array with all the names of the categories
   */
  getNodeTypesCategories(filter) {
    const categories = { "": 1 };
    for (const i in this.registered_node_types) {
      const type = this.registered_node_types[i];
      if (type.category && !type.skip_list) {
        if (type.filter != filter) continue;
        categories[type.category] = 1;
      }
    }
    const result = [];
    for (const i in categories) {
      result.push(i);
    }
    return result;
  }
  // debug purposes: reloads all the js scripts that matches a wildcard
  reloadNodes(folder_wildcard) {
    const tmp = document.getElementsByTagName("script");
    const script_files = [];
    for (const element of tmp) {
      script_files.push(element);
    }
    const docHeadObj = document.getElementsByTagName("head")[0];
    folder_wildcard = document.location.href + folder_wildcard;
    for (const script_file of script_files) {
      const src = script_file.src;
      if (!src || src.substr(0, folder_wildcard.length) != folder_wildcard)
        continue;
      try {
        if (this.debug) console.log("Reloading:", src);
        const dynamicScript = document.createElement("script");
        dynamicScript.type = "text/javascript";
        dynamicScript.src = src;
        docHeadObj.append(dynamicScript);
        script_file.remove();
      } catch (error) {
        if (this.throw_errors) throw error;
        if (this.debug) console.log("Error while reloading", src);
      }
    }
    if (this.debug) console.log("Nodes reloaded");
  }
  // separated just to improve if it doesn't work
  /** @deprecated Prefer {@link structuredClone} */
  cloneObject(obj, target) {
    if (obj == null) return null;
    const r = JSON.parse(JSON.stringify(obj));
    if (!target) return r;
    for (const i in r) {
      target[i] = r[i];
    }
    return target;
  }
  /**
   * Returns if the types of two slots are compatible (taking into account wildcards, etc)
   * @param type_a output
   * @param type_b input
   * @returns true if they can be connected
   */
  isValidConnection(type_a, type_b) {
    if (type_a == "" || type_a === "*") type_a = 0;
    if (type_b == "" || type_b === "*") type_b = 0;
    if (!type_a || !type_b || type_a == type_b || type_a == this.EVENT && type_b == this.ACTION) {
      return true;
    }
    type_a = String(type_a);
    type_b = String(type_b);
    type_a = type_a.toLowerCase();
    type_b = type_b.toLowerCase();
    if (!type_a.includes(",") && !type_b.includes(","))
      return type_a == type_b;
    const supported_types_a = type_a.split(",");
    const supported_types_b = type_b.split(",");
    for (const a of supported_types_a) {
      for (const b of supported_types_b) {
        if (this.isValidConnection(a, b))
          return true;
      }
    }
    return false;
  }
  // used to create nodes from wrapping functions
  getParameterNames(func) {
    return String(func).replaceAll(/\/\/.*$/gm, "").replaceAll(/\s+/g, "").replaceAll(/\/\*[^*/]*\*\//g, "").split("){", 1)[0].replace(/^[^(]*\(/, "").replaceAll(/=[^,]+/g, "").split(",").filter(Boolean);
  }
  /* helper for interaction: pointer, touch, mouse Listeners
    used by LGraphCanvas DragAndScale ContextMenu */
  pointerListenerAdd(oDOM, sEvIn, fCall, capture = false) {
    if (!oDOM || !oDOM.addEventListener || !sEvIn || typeof fCall !== "function") return;
    let sMethod = this.pointerevents_method;
    let sEvent = sEvIn;
    if (sMethod == "pointer" && !window.PointerEvent) {
      console.warn("sMethod=='pointer' && !window.PointerEvent");
      console.log(`Converting pointer[${sEvent}] : down move up cancel enter TO touchstart touchmove touchend, etc ..`);
      switch (sEvent) {
        case "down": {
          sMethod = "touch";
          sEvent = "start";
          break;
        }
        case "move": {
          sMethod = "touch";
          break;
        }
        case "up": {
          sMethod = "touch";
          sEvent = "end";
          break;
        }
        case "cancel": {
          sMethod = "touch";
          break;
        }
        case "enter": {
          console.log("debug: Should I send a move event?");
          break;
        }
        // case "over": case "out": not used at now
        default: {
          console.warn(`PointerEvent not available in this browser ? The event ${sEvent} would not be called`);
        }
      }
    }
    switch (sEvent) {
      // @ts-expect-error
      // both pointer and move events
      case "down":
      case "up":
      case "move":
      case "over":
      case "out":
      case "enter": {
        oDOM.addEventListener(sMethod + sEvent, fCall, capture);
      }
      // @ts-expect-error
      // only pointerevents
      case "leave":
      case "cancel":
      case "gotpointercapture":
      case "lostpointercapture": {
        if (sMethod != "mouse") {
          return oDOM.addEventListener(sMethod + sEvent, fCall, capture);
        }
      }
      // not "pointer" || "mouse"
      default:
        return oDOM.addEventListener(sEvent, fCall, capture);
    }
  }
  pointerListenerRemove(oDOM, sEvent, fCall, capture = false) {
    if (!oDOM || !oDOM.removeEventListener || !sEvent || typeof fCall !== "function") return;
    switch (sEvent) {
      // @ts-expect-error
      // both pointer and move events
      case "down":
      case "up":
      case "move":
      case "over":
      case "out":
      case "enter": {
        if (this.pointerevents_method == "pointer" || this.pointerevents_method == "mouse") {
          oDOM.removeEventListener(this.pointerevents_method + sEvent, fCall, capture);
        }
      }
      // @ts-expect-error
      // only pointerevents
      case "leave":
      case "cancel":
      case "gotpointercapture":
      case "lostpointercapture": {
        if (this.pointerevents_method == "pointer") {
          return oDOM.removeEventListener(this.pointerevents_method + sEvent, fCall, capture);
        }
      }
      // not "pointer" || "mouse"
      default:
        return oDOM.removeEventListener(sEvent, fCall, capture);
    }
  }
  getTime() {
    return performance.now();
  }
  colorToString(c) {
    return `rgba(${Math.round(c[0] * 255).toFixed()},${Math.round(c[1] * 255).toFixed()},${Math.round(c[2] * 255).toFixed()},${c.length == 4 ? c[3].toFixed(2) : "1.0"})`;
  }
  // [minx,miny,maxx,maxy]
  growBounding(bounding, x2, y) {
    if (x2 < bounding[0]) {
      bounding[0] = x2;
    } else if (x2 > bounding[2]) {
      bounding[2] = x2;
    }
    if (y < bounding[1]) {
      bounding[1] = y;
    } else if (y > bounding[3]) {
      bounding[3] = y;
    }
  }
  // point inside bounding box
  isInsideBounding(p, bb) {
    if (p[0] < bb[0][0] || p[1] < bb[0][1] || p[0] > bb[1][0] || p[1] > bb[1][1]) {
      return false;
    }
    return true;
  }
  // Convert a hex value to its decimal value - the inputted hex must be in the
  // format of a hex triplet - the kind we use for HTML colours. The function
  // will return an array with three values.
  hex2num(hex) {
    if (hex.charAt(0) == "#") {
      hex = hex.slice(1);
    }
    hex = hex.toUpperCase();
    const hex_alphabets = "0123456789ABCDEF";
    const value = new Array(3);
    let k = 0;
    let int1, int2;
    for (let i = 0; i < 6; i += 2) {
      int1 = hex_alphabets.indexOf(hex.charAt(i));
      int2 = hex_alphabets.indexOf(hex.charAt(i + 1));
      value[k] = int1 * 16 + int2;
      k++;
    }
    return value;
  }
  // Give a array with three values as the argument and the function will return
  // the corresponding hex triplet.
  num2hex(triplet) {
    const hex_alphabets = "0123456789ABCDEF";
    let hex = "#";
    let int1, int2;
    for (let i = 0; i < 3; i++) {
      int1 = triplet[i] / 16;
      int2 = triplet[i] % 16;
      hex += hex_alphabets.charAt(int1) + hex_alphabets.charAt(int2);
    }
    return hex;
  }
  closeAllContextMenus(ref_window) {
    ref_window = ref_window || window;
    const elements = ref_window.document.querySelectorAll(".litecontextmenu");
    if (!elements.length) return;
    const results = [];
    for (const element of elements) {
      results.push(element);
    }
    for (const result of results) {
      if ("close" in result && typeof result.close === "function") {
        result.close();
      } else if (result.parentNode) {
        result.remove();
      }
    }
  }
  extendClass(target, origin) {
    for (const i in origin) {
      if (target.hasOwnProperty(i)) continue;
      target[i] = origin[i];
    }
    if (origin.prototype) {
      for (const i in origin.prototype) {
        if (!origin.prototype.hasOwnProperty(i)) continue;
        if (target.prototype.hasOwnProperty(i)) continue;
        if (origin.prototype.__lookupGetter__(i)) {
          target.prototype.__defineGetter__(
            i,
            origin.prototype.__lookupGetter__(i)
          );
        } else {
          target.prototype[i] = origin.prototype[i];
        }
        if (origin.prototype.__lookupSetter__(i)) {
          target.prototype.__defineSetter__(
            i,
            origin.prototype.__lookupSetter__(i)
          );
        }
      }
    }
  }
};
function loadPolyfills() {
  if (typeof window != "undefined" && window.CanvasRenderingContext2D && !window.CanvasRenderingContext2D.prototype.roundRect) {
    window.CanvasRenderingContext2D.prototype.roundRect = function(x2, y, w, h, radius, radius_low) {
      let top_left_radius = 0;
      let top_right_radius = 0;
      let bottom_left_radius = 0;
      let bottom_right_radius = 0;
      if (radius === 0) {
        this.rect(x2, y, w, h);
        return;
      }
      if (radius_low === void 0) radius_low = radius;
      if (Array.isArray(radius)) {
        if (radius.length == 1) {
          top_left_radius = top_right_radius = bottom_left_radius = bottom_right_radius = radius[0];
        } else if (radius.length == 2) {
          top_left_radius = bottom_right_radius = radius[0];
          top_right_radius = bottom_left_radius = radius[1];
        } else if (radius.length == 4) {
          top_left_radius = radius[0];
          top_right_radius = radius[1];
          bottom_left_radius = radius[2];
          bottom_right_radius = radius[3];
        } else {
          return;
        }
      } else {
        top_left_radius = radius || 0;
        top_right_radius = radius || 0;
        const low = !Array.isArray(radius_low) && radius_low ? radius_low : 0;
        bottom_left_radius = low;
        bottom_right_radius = low;
      }
      this.moveTo(x2 + top_left_radius, y);
      this.lineTo(x2 + w - top_right_radius, y);
      this.quadraticCurveTo(x2 + w, y, x2 + w, y + top_right_radius);
      this.lineTo(x2 + w, y + h - bottom_right_radius);
      this.quadraticCurveTo(
        x2 + w,
        y + h,
        x2 + w - bottom_right_radius,
        y + h
      );
      this.lineTo(x2 + bottom_right_radius, y + h);
      this.quadraticCurveTo(x2, y + h, x2, y + h - bottom_left_radius);
      this.lineTo(x2, y + bottom_left_radius);
      this.quadraticCurveTo(x2, y, x2 + top_left_radius, y);
    };
  }
  if (typeof window != "undefined" && !window["requestAnimationFrame"]) {
    window.requestAnimationFrame = // @ts-expect-error Legacy code
    window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
      window.setTimeout(callback, 1e3 / 60);
    };
  }
}
var LiteGraph = new LiteGraphGlobal();
function clamp(v2, a, b) {
  return a > v2 ? a : b < v2 ? b : v2;
}
loadPolyfills();

// src_web/comfyui/nodes/base_node.ts
var _StoryboardBaseNode = class _StoryboardBaseNode extends LGraphNode {
  constructor(title = _StoryboardBaseNode.title, type) {
    super(title, type);
    this.widgets = [];
    this.comfyClass = "__NEED_COMFY_CLASS__";
    this.nickname = "storyboard";
    this.isVirtualNode = false;
    this.isDropEnabled = false;
    this.removed = false;
    this.__constructed__ = false;
    this.widgets = this.widgets || [];
    this.properties = this.properties || {};
    this.checkAndRunOnConstructed();
  }
  // Deep clone properties for safe duplication
  clone() {
    const cloned = super.clone();
    if ((cloned == null ? void 0 : cloned.properties) && !!window.structuredClone) {
      cloned.properties = structuredClone(cloned.properties);
    }
    return cloned;
  }
  // Widget management utilities
  removeWidget(widgetOrSlot) {
    var _a;
    if (!this.widgets) return;
    const widget = typeof widgetOrSlot === "number" ? this.widgets[widgetOrSlot] : widgetOrSlot;
    if (widget) {
      const index = this.widgets.indexOf(widget);
      if (index > -1) this.widgets.splice(index, 1);
      (_a = widget.onRemove) == null ? void 0 : _a.call(widget);
    }
  }
  replaceWidget(widgetOrSlot, newWidget) {
    let index = null;
    if (widgetOrSlot) {
      index = typeof widgetOrSlot === "number" ? widgetOrSlot : this.widgets.indexOf(widgetOrSlot);
      this.removeWidget(index);
    }
    index = index != null ? index : this.widgets.length - 1;
    if (this.widgets.includes(newWidget)) {
      this.widgets.splice(this.widgets.indexOf(newWidget), 1);
    }
    this.widgets.splice(index, 0, newWidget);
  }
  onRemoved() {
    var _a;
    (_a = super.onRemoved) == null ? void 0 : _a.call(this);
    this.removed = true;
  }
  onConstructed() {
    var _a;
    if (this.__constructed__) return false;
    this.type = (_a = this.type) != null ? _a : void 0;
    this.serialize_widgets = true;
    this.__constructed__ = true;
    return true;
  }
  checkAndRunOnConstructed() {
    if (!this.__constructed__) {
      this.onConstructed();
    }
    return this.__constructed__;
  }
  static setUp() {
    if (this._category) {
      this.category = this._category;
    }
  }
};
_StoryboardBaseNode.title = "__NEED_CLASS_TITLE__";
_StoryboardBaseNode.type = "__NEED_CLASS_TYPE__";
_StoryboardBaseNode.category = "storyboard";
_StoryboardBaseNode._category = "storyboard";
var StoryboardBaseNode = _StoryboardBaseNode;

// src_web/common/constants.ts
var LOG_VERBOSE = false;

// src_web/common/shared_utils.ts
var log = (prefix, ...args) => {
  if (LOG_VERBOSE) {
    console.log(`[${prefix}]`, ...args);
  }
};

// src_web/comfyui/nodes/node-inspector/node_inspector.ts
var _NodeInspectorNode = class _NodeInspectorNode extends StoryboardBaseNode {
  constructor(title = _NodeInspectorNode.title) {
    super(title);
    this._connectedNode = null;
    this._availableFields = [];
    this._fieldEntries = [];
    this._selectedFieldNames = [];
    this._updateInterval = null;
    this._overlayShown = false;
    this._graphChangeListener = null;
    log(this.type, "Constructor called");
  }
  // Get the input socket type color from the inspector node itself
  getInputSocketTypeColor() {
    var _a, _b;
    if ((_a = this.inputs) == null ? void 0 : _a[0]) {
      const inputType = String(this.inputs[0].type);
      const canvas2 = app.canvas;
      if (canvas2 == null ? void 0 : canvas2.default_connection_color_byType) {
        const color = canvas2.default_connection_color_byType[inputType.toUpperCase()];
        if (color) {
          return color;
        }
      }
      if ((_b = window.LiteGraph) == null ? void 0 : _b.getConnectionColor) {
        const color = window.LiteGraph.getConnectionColor(inputType);
        if (color) {
          return color;
        }
      }
    }
    return "#888888";
  }
  // Get socket type color for any given type
  getSocketTypeColor(type) {
    var _a;
    const safeType = type || "*";
    const canvas2 = app.canvas;
    if (canvas2 == null ? void 0 : canvas2.default_connection_color_byType) {
      const color = canvas2.default_connection_color_byType[safeType.toUpperCase()];
      if (color) {
        return color;
      }
    }
    if ((_a = window.LiteGraph) == null ? void 0 : _a.getConnectionColor) {
      const color = window.LiteGraph.getConnectionColor(safeType);
      if (color) {
        return color;
      }
    }
    const typeColorMap = {
      "STRING": "#a1c181",
      "TEXT": "#a1c181",
      "INT": "#6495ed",
      "INTEGER": "#6495ed",
      "FLOAT": "#87ceeb",
      "NUMBER": "#87ceeb",
      "BOOLEAN": "#daa520",
      "BOOL": "#daa520",
      "IMAGE": "#64b5f6",
      "LATENT": "#ff6b6b",
      "CONDITIONING": "#ffd700",
      "CLIP": "#ad7be9",
      "MODEL": "#ff8c00",
      "VAE": "#20b2aa",
      "CONTROL_NET": "#ff69b4",
      "COMBO": "#4169e1",
      "*": "#999999"
    };
    return typeColorMap[safeType.toUpperCase()] || typeColorMap["*"] || "#999999";
  }
  // Add refresh button to node title area
  onDrawForeground(ctx, canvas2, canvas_widget) {
    var _a;
    if (super.onDrawForeground) {
      super.onDrawForeground(ctx, canvas2, canvas_widget);
    }
    if ((_a = this.flags) == null ? void 0 : _a.collapsed) {
      return;
    }
    const buttonSize = 12;
    const buttonMargin = 8;
    const titleHeight = LiteGraph.NODE_TITLE_HEIGHT || 30;
    const buttonX = this.size[0] - buttonSize - buttonMargin;
    const buttonY = -titleHeight + (titleHeight - buttonSize) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, -titleHeight, this.size[0], titleHeight);
    ctx.clip();
    ctx.fillStyle = "#444";
    ctx.fillRect(buttonX, buttonY, buttonSize, buttonSize);
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 1;
    ctx.strokeRect(buttonX, buttonY, buttonSize, buttonSize);
    const iconColor = this._connectedNode ? "#87ceeb" : "#6495ed";
    ctx.strokeStyle = iconColor;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    const centerX = buttonX + buttonSize / 2;
    const centerY = buttonY + buttonSize / 2;
    const radius = 3.5;
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, Math.PI, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX - radius + 1, centerY + 1);
    ctx.lineTo(centerX - radius - 0.5, centerY + 2.5);
    ctx.lineTo(centerX - radius + 2, centerY + 2.5);
    ctx.closePath();
    ctx.fillStyle = iconColor;
    ctx.fill();
    ctx.restore();
    this._refreshButtonBounds = {
      x: buttonX,
      y: buttonY,
      width: buttonSize,
      height: buttonSize
    };
  }
  onConstructed() {
    var _a, _b;
    if (this.__constructed__) return false;
    log(this.type, "Node constructed");
    this._connectedNode = null;
    this._availableFields = [];
    this._fieldEntries = [];
    this._selectedFieldNames = [];
    this._updateInterval = null;
    if (!this.properties) this.properties = {};
    this.properties["selected_fieldnames"] = "";
    this.properties["field_names_input"] = "";
    this.properties["selected_values"] = "";
    this.type = (_a = this.type) != null ? _a : void 0;
    this.__constructed__ = true;
    (_b = app.graph) == null ? void 0 : _b.trigger("nodeCreated", this);
    log(this.type, "Node state initialized");
    return this.__constructed__;
  }
  clone() {
    var _a, _b, _c;
    log(this.type, "Cloning node");
    const cloned = super.clone();
    if (cloned) {
      log(this.type, "Cloned node properties:", cloned.properties);
      if (cloned.properties && !!window.structuredClone) {
        cloned.properties = structuredClone(cloned.properties);
        log(this.type, "Properties deep cloned");
      }
      cloned._connectedNode = null;
      cloned._availableFields = [...this._availableFields];
      cloned._fieldEntries = [...this._fieldEntries];
      cloned._selectedFieldNames = [...this._selectedFieldNames];
      cloned._updateInterval = null;
      log(this.type, "State properties copied");
      if (!cloned.properties) cloned.properties = {};
      cloned.properties["selected_fieldnames"] = ((_a = this.properties) == null ? void 0 : _a["selected_fieldnames"]) || "";
      cloned.properties["field_names_input"] = ((_b = this.properties) == null ? void 0 : _b["field_names_input"]) || "";
      cloned.properties["selected_values"] = ((_c = this.properties) == null ? void 0 : _c["selected_values"]) || "";
      log(this.type, "Properties copied to cloned node");
      cloned.onConstructed();
      log(this.type, "Cloned node constructed");
    }
    return cloned;
  }
  findWidgetByName(node2, name) {
    if (!node2.widgets) return null;
    const widget = node2.widgets.find((w) => w.name === name);
    return widget ? {
      name: widget.name,
      value: widget.value,
      type: widget.type
    } : null;
  }
  formatWidgetValue(widget) {
    if (widget.value === null || widget.value === void 0) {
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
  getAllFieldEntries(node2) {
    if (!node2) return [];
    const fieldEntries = [];
    if (node2.widgets) {
      const widgetEntries = node2.widgets.filter((widget) => widget.name && widget.name !== "preview").map((widget) => {
        let value = widget.value;
        let rawValue = value;
        let isConnected = false;
        let connectedNodeTitle = "";
        let connectedNodeId = void 0;
        if (node2.inputs) {
          const matchingInput = node2.inputs.find((input) => input.name === widget.name);
          if (matchingInput && matchingInput.link) {
            isConnected = true;
            const link = app.graph.links[matchingInput.link];
            if (link) {
              const connectedNode = app.graph.getNodeById(link.origin_id);
              if (connectedNode) {
                connectedNodeTitle = connectedNode.title || "Unknown Node";
                connectedNodeId = connectedNode.id;
                const connectedValue = this.getConnectedNodeOutputValue(connectedNode, link.origin_slot);
                if (connectedValue !== null) {
                  value = connectedValue;
                  rawValue = connectedValue;
                }
              }
            }
          }
        }
        return {
          name: widget.name,
          value: this.formatWidgetValue({ name: widget.name, value, type: widget.type }),
          rawValue,
          type: widget.type,
          sourceType: "widget",
          isConnected,
          connectedNodeTitle,
          connectedNodeId
        };
      });
      fieldEntries.push(...widgetEntries);
    }
    if (node2.inputs) {
      const inputEntries = node2.inputs.map((input, index) => {
        const isConnected = Boolean(input.link);
        let value = "";
        let rawValue = null;
        let connectedNodeTitle = "";
        let connectedNodeId = void 0;
        if (isConnected && input.link) {
          const link = app.graph.links[input.link];
          if (link) {
            const connectedNode = app.graph.getNodeById(link.origin_id);
            if (connectedNode) {
              connectedNodeTitle = connectedNode.title || "Unknown Node";
              connectedNodeId = connectedNode.id;
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
          value,
          rawValue,
          type: Array.isArray(input.type) ? input.type.join("|") : String(input.type || "*"),
          sourceType: "input",
          isConnected,
          connectedNodeTitle,
          connectedNodeId
        };
      });
      fieldEntries.push(...inputEntries);
    }
    return fieldEntries;
  }
  getConnectedNodeOutputValue(node2, outputIndex) {
    var _a;
    if (!node2) return null;
    if (node2.widgets) {
      const output = (_a = node2.outputs) == null ? void 0 : _a[outputIndex];
      if (output) {
        const widget = node2.widgets.find((w) => w.name === output.name);
        if (widget) {
          return widget.value;
        }
      }
      const primaryWidget = node2.widgets.find((w) => w.name !== "preview");
      if (primaryWidget) {
        return primaryWidget.value;
      }
    }
    if (node2.inputs) {
      for (const input of node2.inputs) {
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
  formatValue(value) {
    if (value === null || value === void 0) {
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
  createFieldsDisplayWidget() {
    if (this.widgets) {
      const widgetsToRemove = this.widgets.filter(
        (w) => w.name === "fields_display" || w.name === "truncated_info" || w.name === "fields_scrollable" || w.name === "inputs_display" || w.name === "widgets_display" || w.name.startsWith("field_")
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
        draw: function(ctx, node2, widgetWidth, y, widgetHeight) {
          ctx.fillStyle = "#555";
          ctx.fillRect(0, y, widgetWidth, widgetHeight);
          ctx.fillStyle = "#888";
          ctx.font = "12px Arial";
          ctx.fillText(this.value, 10, y + 15);
          return widgetHeight;
        },
        computeSize: function(width2) {
          return [width2, 26];
        },
        mouse: function() {
          return false;
        }
      };
      this.widgets.push(textWidget);
      return;
    }
    const inputEntries = this._fieldEntries.filter((entry) => entry.sourceType === "input");
    const widgetEntries = this._fieldEntries.filter((entry) => entry.sourceType === "widget");
    if (!this.widgets) this.widgets = [];
    const self = this;
    const lineHeight = 20;
    const itemPadding = 10;
    const headerHeight = 25;
    let totalHeight = 0;
    const classInstance = this;
    const navigateToConnectedNode = (nodeId) => {
      console.log("[NodeInspector] Calling navigateToConnectedNode with nodeId:", nodeId);
      console.log("[NodeInspector] classInstance type:", typeof classInstance);
      console.log("[NodeInspector] classInstance.navigateToConnectedNode type:", typeof classInstance.navigateToConnectedNode);
      if (typeof classInstance.navigateToConnectedNode === "function") {
        classInstance.navigateToConnectedNode(nodeId);
      } else {
        console.error("[NodeInspector] navigateToConnectedNode method not found on class instance");
        console.log("[NodeInspector] Available methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(classInstance)));
      }
    };
    console.log("[NodeInspector] navigateToConnectedNode method available:", typeof this.navigateToConnectedNode === "function");
    console.log("[NodeInspector] this context type:", this.constructor.name);
    console.log("[NodeInspector] this is NodeInspectorNode:", this instanceof _NodeInspectorNode);
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
        _inheritanceClickAreas: [],
        _hoveredBadge: null,
        _hoveredRowIndex: -1,
        _hoveredInputBadge: null,
        _hoveredInputRowIndex: -1,
        hideOnZoom: false,
        draw: function(ctx, node2, widgetWidth, y, widgetHeight) {
          this.last_y = y;
          this._inheritanceClickAreas = [];
          ctx.fillStyle = "#444";
          ctx.fillRect(itemPadding, y, widgetWidth - itemPadding * 2, headerHeight);
          ctx.fillStyle = "#aaa";
          ctx.font = "bold 12px Arial";
          ctx.fillText("Widgets", itemPadding + 10, y + 16);
          const scrollAreaY = y + headerHeight;
          const totalContentHeight = widgetEntries.length * lineHeight;
          const maxScrollOffset = Math.max(0, totalContentHeight - scrollableHeight);
          this.scrollOffset = Math.max(0, Math.min(this.scrollOffset, maxScrollOffset));
          ctx.save();
          ctx.beginPath();
          ctx.rect(itemPadding, scrollAreaY, widgetWidth - itemPadding * 2, scrollableHeight);
          ctx.clip();
          ctx.fillStyle = "#333";
          ctx.fillRect(itemPadding, scrollAreaY, widgetWidth - itemPadding * 2, scrollableHeight);
          const startIndex = Math.floor(this.scrollOffset / lineHeight);
          const endIndex = Math.min(widgetEntries.length, startIndex + Math.ceil(scrollableHeight / lineHeight) + 1);
          for (let i = startIndex; i < endIndex; i++) {
            const entry = widgetEntries[i];
            if (!entry) continue;
            const fieldY = scrollAreaY + i * lineHeight - this.scrollOffset;
            if (fieldY + lineHeight < scrollAreaY || fieldY > scrollAreaY + scrollableHeight) continue;
            const isSelected = self._selectedFieldNames.includes(entry.name);
            const isHovered = this._hoveredRowIndex === i;
            let bgColor;
            if (isSelected) {
              bgColor = isHovered ? "#3d5a7b" : "#2d4a6b";
            } else {
              bgColor = isHovered ? "#4a4a4a" : "#3a3a3a";
            }
            ctx.fillStyle = bgColor;
            ctx.fillRect(itemPadding, fieldY, widgetWidth - itemPadding * 2, lineHeight);
            if (isSelected) {
              ctx.strokeStyle = "#5a7fa0";
              ctx.lineWidth = 1;
              ctx.strokeRect(itemPadding, fieldY, widgetWidth - itemPadding * 2, lineHeight);
            }
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
            ctx.fillStyle = "#4a9eff";
            ctx.font = "bold 10px Arial";
            ctx.fillText("W", itemPadding + 24, fieldY + 13);
            const typeColor = entry.type ? self.getSocketTypeColor(entry.type) : "#888";
            ctx.fillStyle = typeColor;
            ctx.beginPath();
            ctx.arc(itemPadding + 40, fieldY + 10, 4, 0, 2 * Math.PI);
            ctx.fill();
            const displayValue = entry.value.length > 25 ? entry.value.substring(0, 25) + "..." : entry.value;
            const typeDisplay = entry.type ? ` (${entry.type})` : "";
            ctx.font = "12px Arial";
            ctx.fillStyle = "#fff";
            ctx.fillText(`${entry.name}${typeDisplay}:`, itemPadding + 50, fieldY + 15);
            const nameWidth = ctx.measureText(`${entry.name}${typeDisplay}:`).width;
            ctx.fillStyle = "#ccc";
            ctx.fillText(` ${displayValue}`, itemPadding + 50 + nameWidth, fieldY + 15);
            if (entry.isConnected && entry.connectedNodeTitle) {
              const valueWidth = ctx.measureText(` ${displayValue}`).width;
              const connectionStartX = itemPadding + 50 + nameWidth + valueWidth + 15;
              if (connectionStartX < widgetWidth - 100) {
                const availableWidth = widgetWidth - connectionStartX - itemPadding - 15;
                let connectionText = entry.connectedNodeTitle;
                ctx.font = "10px Arial";
                const arrowWidth = ctx.measureText("\u2192 ").width;
                const maxTextWidth = availableWidth - arrowWidth - 20;
                let connectionWidth = ctx.measureText(connectionText).width;
                if (connectionWidth > maxTextWidth) {
                  const maxTitleLength = Math.floor(maxTextWidth / 6);
                  connectionText = connectionText.length > maxTitleLength ? connectionText.substring(0, maxTitleLength) + "..." : connectionText;
                }
                const nodeIdText = entry.connectedNodeId ? `#${entry.connectedNodeId} ` : "";
                const badgeText = `\u2192 ${nodeIdText}${connectionText}`;
                const badgeWidth = ctx.measureText(badgeText).width + 16;
                const badgeHeight = 14;
                const badgeX = connectionStartX;
                const badgeY = fieldY + (lineHeight - badgeHeight) / 2;
                if (!this._inheritanceClickAreas) this._inheritanceClickAreas = [];
                const badgeInfo = {
                  x: badgeX,
                  y: badgeY,
                  width: badgeWidth,
                  height: badgeHeight,
                  fieldName: entry.name,
                  connectedNodeId: entry.connectedNodeId,
                  connectedNodeTitle: entry.connectedNodeTitle,
                  // Keep for hover comparison
                  scrollOffset: this.scrollOffset || 0,
                  widgetY: scrollAreaY
                };
                this._inheritanceClickAreas.push(badgeInfo);
                const isHovered2 = this._hoveredBadge && this._hoveredBadge.fieldName === entry.name && this._hoveredBadge.connectedNodeTitle === entry.connectedNodeTitle;
                const gradient = ctx.createLinearGradient(badgeX, badgeY, badgeX, badgeY + badgeHeight);
                if (isHovered2) {
                  gradient.addColorStop(0, "#6a9de4");
                  gradient.addColorStop(1, "#4a7dc4");
                } else if (isSelected) {
                  gradient.addColorStop(0, "#4a7dc4");
                  gradient.addColorStop(1, "#3a6db4");
                } else {
                  gradient.addColorStop(0, "#555");
                  gradient.addColorStop(1, "#444");
                }
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 4);
                ctx.fill();
                if (isHovered2) {
                  ctx.strokeStyle = "#8bb3f0";
                  ctx.lineWidth = 2;
                } else {
                  ctx.strokeStyle = isSelected ? "#6a9de4" : "#777";
                  ctx.lineWidth = 1;
                }
                ctx.beginPath();
                ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 4);
                ctx.stroke();
                if (isHovered2) {
                  ctx.fillStyle = "#ffffff";
                } else {
                  ctx.fillStyle = isSelected ? "#e6f3ff" : "#ddd";
                }
                ctx.font = "bold 9px Arial";
                ctx.fillText(badgeText, badgeX + 8, badgeY + 10);
                ctx.shadowColor = "rgba(0,0,0,0.3)";
                ctx.shadowBlur = 2;
                ctx.shadowOffsetY = 1;
                ctx.fillStyle = "rgba(255,255,255,0.1)";
                ctx.beginPath();
                ctx.roundRect(badgeX, badgeY, badgeWidth, 1, 4);
                ctx.fill();
                ctx.shadowColor = "transparent";
                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;
              }
            }
          }
          if (totalContentHeight > scrollableHeight) {
            const scrollbarWidth = 8;
            const scrollbarHeight = scrollableHeight / totalContentHeight * scrollableHeight;
            const scrollbarY = scrollAreaY + this.scrollOffset / totalContentHeight * scrollableHeight;
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
        computeSize: function(width2) {
          return [width2, widgetSectionHeight];
        },
        mouse: function(event, pos, node2) {
          const [localX, localY] = pos;
          const widgetRelativeY = localY - (this.last_y || 0) - headerHeight;
          if (event.type === "mousemove" || event.type === "pointermove" || event.type === "pointerover" || event.type === "mouseover") {
            let foundHover = false;
            let newHoveredBadge = null;
            const hoveredIndex = Math.floor((widgetRelativeY + this.scrollOffset) / lineHeight);
            const newHoveredRowIndex = hoveredIndex >= 0 && hoveredIndex < widgetEntries.length && widgetRelativeY >= 0 && widgetRelativeY < scrollableHeight ? hoveredIndex : -1;
            if (this._hoveredRowIndex !== newHoveredRowIndex) {
              this._hoveredRowIndex = newHoveredRowIndex;
              console.log("[NodeInspector] Widget hover changed to row:", newHoveredRowIndex);
              if (app.graph) {
                app.graph.setDirtyCanvas(true, false);
              }
            }
            if (this._inheritanceClickAreas && this._inheritanceClickAreas.length > 0) {
              for (const clickArea of this._inheritanceClickAreas) {
                const adjustedY = clickArea.y + (clickArea.scrollOffset - this.scrollOffset);
                if (localX >= clickArea.x && localX <= clickArea.x + clickArea.width && localY >= adjustedY && localY <= adjustedY + clickArea.height) {
                  newHoveredBadge = {
                    fieldName: clickArea.fieldName,
                    connectedNodeTitle: clickArea.connectedNodeTitle
                  };
                  foundHover = true;
                  break;
                }
              }
            }
            const hoverChanged = !this._hoveredBadge && newHoveredBadge || this._hoveredBadge && !newHoveredBadge || this._hoveredBadge && newHoveredBadge && (this._hoveredBadge.fieldName !== newHoveredBadge.fieldName || this._hoveredBadge.connectedNodeTitle !== newHoveredBadge.connectedNodeTitle);
            this._hoveredBadge = newHoveredBadge;
            if (node2.graph && node2.graph.canvas && node2.graph.canvas.canvas) {
              node2.graph.canvas.canvas.style.cursor = foundHover ? "pointer" : "default";
            }
            if (app.graph) {
              app.graph.setDirtyCanvas(true, false);
            }
            return foundHover;
          }
          if (event.type === "mouseleave" || event.type === "pointerleave") {
            if (this._hoveredRowIndex !== -1) {
              this._hoveredRowIndex = -1;
              console.log("[NodeInspector] Widget hover reset on mouse leave");
              if (app.graph) {
                app.graph.setDirtyCanvas(true, false);
              }
            }
            if (this._hoveredInputRowIndex !== -1) {
              this._hoveredInputRowIndex = -1;
              console.log("[NodeInspector] Input hover reset on mouse leave");
              if (app.graph) {
                app.graph.setDirtyCanvas(true, false);
              }
            }
            if (this._hoveredBadge) {
              this._hoveredBadge = null;
              if (app.graph) {
                app.graph.setDirtyCanvas(true, false);
              }
            }
            if (this._hoveredInputBadge) {
              this._hoveredInputBadge = null;
              if (app.graph) {
                app.graph.setDirtyCanvas(true, false);
              }
            }
          }
          if (event.type === "wheel" || event.type === "mousewheel") {
            const delta2 = event.deltaY || event.wheelDelta || 0;
            this.scrollOffset += delta2 > 0 ? 20 : -20;
            const totalContentHeight = widgetEntries.length * lineHeight;
            const maxScrollOffset = Math.max(0, totalContentHeight - scrollableHeight);
            this.scrollOffset = Math.max(0, Math.min(this.scrollOffset, maxScrollOffset));
            if (app.graph) {
              app.graph.setDirtyCanvas(true, false);
            }
            return true;
          }
          if (event.type === "pointerup" || event.type === "click") {
            if (this._inheritanceClickAreas) {
              for (const clickArea of this._inheritanceClickAreas) {
                const adjustedY = clickArea.y + (clickArea.scrollOffset - this.scrollOffset);
                if (localX >= clickArea.x && localX <= clickArea.x + clickArea.width && localY >= adjustedY && localY <= adjustedY + clickArea.height) {
                  console.log("[NodeInspector] Badge clicked, navigating to node ID:", clickArea.connectedNodeId);
                  console.log("[NodeInspector] About to call navigateToConnectedNode function");
                  try {
                    navigateToConnectedNode(clickArea.connectedNodeId);
                    console.log("[NodeInspector] navigateToConnectedNode call completed");
                  } catch (error) {
                    console.error("[NodeInspector] Error calling navigateToConnectedNode:", error);
                  }
                  return true;
                }
              }
            }
            if (widgetRelativeY >= 0 && widgetRelativeY < scrollableHeight) {
              const clickedIndex = Math.floor((widgetRelativeY + this.scrollOffset) / lineHeight);
              if (clickedIndex >= 0 && clickedIndex < widgetEntries.length) {
                const entry = widgetEntries[clickedIndex];
                if (!entry) return false;
                const fieldName = entry.name;
                const now = Date.now();
                if (this._lastClickTime && this._lastClickedField === fieldName && now - this._lastClickTime < 300) {
                  return true;
                }
                this._lastClickTime = now;
                this._lastClickedField = fieldName;
                try {
                  self.selectField(fieldName);
                } catch (e2) {
                  console.error("Error calling selectField:", e2);
                }
                if (app.graph) {
                  app.graph.setDirtyCanvas(true, false);
                }
                return true;
              }
            }
          }
          return false;
        }
      };
      this.widgets.push(widgetWidget);
    }
    if (inputEntries.length > 0) {
      const inputSectionHeight = headerHeight + inputEntries.length * lineHeight;
      totalHeight += inputSectionHeight;
      const inputWidget = {
        name: "inputs_display",
        type: "button",
        value: `Inputs (${inputEntries.length})`,
        options: { readonly: true },
        y: 0,
        serialize: false,
        _desiredHeight: inputSectionHeight,
        _inputInheritanceClickAreas: [],
        _hoveredInputBadge: null,
        _hoveredInputRowIndex: -1,
        hideOnZoom: false,
        draw: function(ctx, node2, widgetWidth, y, widgetHeight) {
          this._inputInheritanceClickAreas = [];
          ctx.fillStyle = "#444";
          ctx.fillRect(itemPadding, y, widgetWidth - itemPadding * 2, headerHeight);
          ctx.fillStyle = "#aaa";
          ctx.font = "bold 12px Arial";
          ctx.fillText("Inputs", itemPadding + 10, y + 16);
          for (let i = 0; i < inputEntries.length; i++) {
            const entry = inputEntries[i];
            if (!entry) continue;
            const fieldY = y + headerHeight + i * lineHeight;
            const isInputHovered = this._hoveredInputRowIndex === i;
            ctx.fillStyle = isInputHovered ? "#424242" : "#3a3a3a";
            ctx.fillRect(itemPadding, fieldY, widgetWidth - itemPadding * 2, lineHeight);
            const sourceIcon = entry.isConnected ? "\u25CF" : "\u25CB";
            const sourceColor = entry.isConnected ? "#46d946" : "#999";
            ctx.fillStyle = sourceColor;
            ctx.font = "12px Arial";
            ctx.fillText(sourceIcon, itemPadding + 10, fieldY + 15);
            const typeColor = entry.type ? self.getSocketTypeColor(entry.type) : "#888";
            ctx.fillStyle = typeColor;
            ctx.beginPath();
            ctx.arc(itemPadding + 30, fieldY + 10, 4, 0, 2 * Math.PI);
            ctx.fill();
            const displayValue = entry.value.length > 30 ? entry.value.substring(0, 30) + "..." : entry.value;
            const typeDisplay = entry.type ? ` (${entry.type})` : "";
            ctx.fillStyle = "#fff";
            ctx.font = "12px Arial";
            ctx.fillText(`${entry.name}${typeDisplay}:`, itemPadding + 40, fieldY + 15);
            const nameWidth = ctx.measureText(`${entry.name}${typeDisplay}:`).width;
            ctx.fillStyle = entry.isConnected ? "#b8e6b8" : "#ccc";
            ctx.fillText(` ${displayValue}`, itemPadding + 40 + nameWidth, fieldY + 15);
            if (entry.isConnected && entry.connectedNodeTitle) {
              const valueWidth = ctx.measureText(` ${displayValue}`).width;
              const connectionStartX = itemPadding + 40 + nameWidth + valueWidth + 15;
              if (connectionStartX < widgetWidth - 100) {
                const availableWidth = widgetWidth - connectionStartX - itemPadding - 15;
                let connectionText = entry.connectedNodeTitle;
                ctx.font = "10px Arial";
                const arrowWidth = ctx.measureText("\u2192 ").width;
                const maxTextWidth = availableWidth - arrowWidth - 20;
                let connectionWidth = ctx.measureText(connectionText).width;
                if (connectionWidth > maxTextWidth) {
                  const maxTitleLength = Math.floor(maxTextWidth / 6);
                  connectionText = connectionText.length > maxTitleLength ? connectionText.substring(0, maxTitleLength) + "..." : connectionText;
                }
                const nodeIdText = entry.connectedNodeId ? `#${entry.connectedNodeId} ` : "";
                const badgeText = `\u2192 ${nodeIdText}${connectionText}`;
                const badgeWidth = ctx.measureText(badgeText).width + 16;
                const badgeHeight = 14;
                const badgeX = connectionStartX;
                const badgeY = fieldY + (lineHeight - badgeHeight) / 2;
                if (!this._inputInheritanceClickAreas) this._inputInheritanceClickAreas = [];
                const inputBadgeInfo = {
                  x: badgeX,
                  y: badgeY,
                  width: badgeWidth,
                  height: badgeHeight,
                  fieldName: entry.name,
                  connectedNodeId: entry.connectedNodeId,
                  connectedNodeTitle: entry.connectedNodeTitle,
                  // Keep for hover comparison
                  absoluteY: fieldY
                };
                this._inputInheritanceClickAreas.push(inputBadgeInfo);
                const isInputHovered2 = this._hoveredInputBadge && this._hoveredInputBadge.fieldName === entry.name && this._hoveredInputBadge.connectedNodeTitle === entry.connectedNodeTitle;
                const gradient = ctx.createLinearGradient(badgeX, badgeY, badgeX, badgeY + badgeHeight);
                if (isInputHovered2) {
                  gradient.addColorStop(0, "#6a9de4");
                  gradient.addColorStop(1, "#4a7dc4");
                } else {
                  gradient.addColorStop(0, "#555");
                  gradient.addColorStop(1, "#444");
                }
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 4);
                ctx.fill();
                if (isInputHovered2) {
                  ctx.strokeStyle = "#8bb3f0";
                  ctx.lineWidth = 2;
                } else {
                  ctx.strokeStyle = "#777";
                  ctx.lineWidth = 1;
                }
                ctx.beginPath();
                ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 4);
                ctx.stroke();
                if (isInputHovered2) {
                  ctx.fillStyle = "#ffffff";
                } else {
                  ctx.fillStyle = "#ddd";
                }
                ctx.font = "bold 9px Arial";
                ctx.fillText(badgeText, badgeX + 8, badgeY + 10);
                ctx.shadowColor = "rgba(0,0,0,0.3)";
                ctx.shadowBlur = 2;
                ctx.shadowOffsetY = 1;
                ctx.fillStyle = "rgba(255,255,255,0.1)";
                ctx.beginPath();
                ctx.roundRect(badgeX, badgeY, badgeWidth, 1, 4);
                ctx.fill();
                ctx.shadowColor = "transparent";
                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;
              }
            }
          }
          return inputSectionHeight;
        },
        computeSize: function(width2) {
          return [width2, inputSectionHeight];
        },
        mouse: function(event, pos, node2) {
          const [localX, localY] = pos;
          if (event.type === "mousemove" || event.type === "pointermove" || event.type === "pointerover" || event.type === "mouseover") {
            let foundInputHover = false;
            let newHoveredInputBadge = null;
            const inputRowY = localY - headerHeight;
            const hoveredInputIndex = Math.floor(inputRowY / lineHeight);
            const inputSectionHeight2 = inputEntries.length * lineHeight;
            const newHoveredInputRowIndex = hoveredInputIndex >= 0 && hoveredInputIndex < inputEntries.length && inputRowY >= 0 && inputRowY < inputSectionHeight2 ? hoveredInputIndex : -1;
            if (this._hoveredInputRowIndex !== newHoveredInputRowIndex) {
              this._hoveredInputRowIndex = newHoveredInputRowIndex;
              console.log("[NodeInspector] Input hover changed to row:", newHoveredInputRowIndex);
              if (app.graph) {
                app.graph.setDirtyCanvas(true, false);
              }
            }
            if (this._inputInheritanceClickAreas && this._inputInheritanceClickAreas.length > 0) {
              for (const clickArea of this._inputInheritanceClickAreas) {
                if (localX >= clickArea.x && localX <= clickArea.x + clickArea.width && localY >= clickArea.y && localY <= clickArea.y + clickArea.height) {
                  newHoveredInputBadge = {
                    fieldName: clickArea.fieldName,
                    connectedNodeTitle: clickArea.connectedNodeTitle
                  };
                  foundInputHover = true;
                  break;
                }
              }
            }
            const inputHoverChanged = !this._hoveredInputBadge && newHoveredInputBadge || this._hoveredInputBadge && !newHoveredInputBadge || this._hoveredInputBadge && newHoveredInputBadge && (this._hoveredInputBadge.fieldName !== newHoveredInputBadge.fieldName || this._hoveredInputBadge.connectedNodeTitle !== newHoveredInputBadge.connectedNodeTitle);
            this._hoveredInputBadge = newHoveredInputBadge;
            if (node2.graph && node2.graph.canvas && node2.graph.canvas.canvas) {
              node2.graph.canvas.canvas.style.cursor = foundInputHover ? "pointer" : "default";
            }
            if (app.graph) {
              app.graph.setDirtyCanvas(true, false);
            }
            return foundInputHover;
          }
          if (event.type === "mouseleave" || event.type === "pointerleave") {
            if (this._hoveredInputRowIndex !== -1) {
              this._hoveredInputRowIndex = -1;
              console.log("[NodeInspector] Input hover reset on mouse leave");
              if (app.graph) {
                app.graph.setDirtyCanvas(true, false);
              }
            }
            if (this._hoveredInputBadge) {
              this._hoveredInputBadge = null;
              if (app.graph) {
                app.graph.setDirtyCanvas(true, false);
              }
            }
          }
          if (event.type === "pointerup" || event.type === "click") {
            if (this._inputInheritanceClickAreas) {
              for (const clickArea of this._inputInheritanceClickAreas) {
                if (localX >= clickArea.x && localX <= clickArea.x + clickArea.width && localY >= clickArea.y && localY <= clickArea.y + clickArea.height) {
                  console.log("[NodeInspector] Input badge clicked, navigating to node ID:", clickArea.connectedNodeId);
                  console.log("[NodeInspector] About to call navigateToConnectedNode function for input");
                  try {
                    navigateToConnectedNode(clickArea.connectedNodeId);
                    console.log("[NodeInspector] navigateToConnectedNode call completed for input");
                  } catch (error) {
                    console.error("[NodeInspector] Error calling navigateToConnectedNode for input:", error);
                  }
                  return true;
                }
              }
            }
          }
          return false;
        }
      };
      this.widgets.push(inputWidget);
    }
    setTimeout(() => {
      for (const widget of this.widgets) {
        if (widget.name === "inputs_display" || widget.name === "widgets_display") {
          widget.size = [0, widget._desiredHeight];
        }
      }
      if (this.computeSize) {
        this.computeSize();
      }
    }, 0);
  }
  createInformationalSection(title, entries, itemPadding, lineHeight, headerHeight) {
  }
  createSelectableSection(title, entries, itemPadding, lineHeight, headerHeight) {
  }
  addCustomWidget(custom_widget) {
    if (!this.widgets) this.widgets = [];
    this.widgets.push(custom_widget);
    return custom_widget;
  }
  selectField(fieldName) {
    if (this._selectedFieldNames.includes(fieldName)) {
      this._selectedFieldNames = this._selectedFieldNames.filter((name) => name !== fieldName);
    } else {
      this._selectedFieldNames = [...this._selectedFieldNames, fieldName];
    }
    this.updateBackendProperties();
    if (app.graph) {
      app.graph.setDirtyCanvas(true, false);
    }
  }
  updateBackendProperties() {
    var _a, _b;
    const selectedFieldnamesWidget = (_a = this.widgets) == null ? void 0 : _a.find((w) => w.name === "selected_fieldnames");
    const selectedValuesWidget = (_b = this.widgets) == null ? void 0 : _b.find((w) => w.name === "selected_values");
    const fieldNamesString = this._selectedFieldNames.join(", ");
    const fieldValuesObj = {};
    for (const fieldName of this._selectedFieldNames) {
      const fieldEntry = this._fieldEntries.find((f) => f.name === fieldName);
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
    if (!this.properties) this.properties = {};
    this.properties["selected_fieldnames"] = fieldNamesString;
    this.properties["field_names_input"] = fieldNamesString;
    this.properties["selected_values"] = fieldValuesString;
    log(this.type, "Updated backend properties:", {
      fieldNames: fieldNamesString,
      selectedCount: this._selectedFieldNames.length
    });
  }
  navigateToConnectedNode(nodeId) {
    console.log(`[NodeInspector] Starting navigation to node ID: ${nodeId}`);
    if (!app.graph) {
      console.warn(`[NodeInspector] No app.graph available`);
      return;
    }
    const sourceNode = app.graph.getNodeById(nodeId);
    if (!sourceNode) {
      console.warn(`[NodeInspector] Could not find source node with ID: ${nodeId}`);
      console.log(`[NodeInspector] Available node IDs:`, app.graph._nodes.map((n) => n.id));
      return;
    }
    console.log(`[NodeInspector] Found source node:`, sourceNode.title, "at position:", sourceNode.pos);
    if (app.canvas) {
      const canvas2 = app.canvas;
      console.log(`[NodeInspector] Canvas available, starting smooth navigation`);
      const canvasRect = canvas2.canvas.getBoundingClientRect();
      const viewportCenterX = canvasRect.width / 2;
      const viewportCenterY = canvasRect.height / 2;
      const nodeCenterX = sourceNode.pos[0] + sourceNode.size[0] / 2;
      const nodeCenterY = sourceNode.pos[1] + sourceNode.size[1] / 2;
      const targetOffsetX = viewportCenterX / canvas2.ds.scale - nodeCenterX;
      const targetOffsetY = viewportCenterY / canvas2.ds.scale - nodeCenterY;
      const startOffsetX = canvas2.ds.offset[0];
      const startOffsetY = canvas2.ds.offset[1];
      console.log(`[NodeInspector] Start offset: [${startOffsetX}, ${startOffsetY}]`);
      console.log(`[NodeInspector] Target offset: [${targetOffsetX}, ${targetOffsetY}]`);
      const duration = 600;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentOffsetX = startOffsetX + (targetOffsetX - startOffsetX) * easeOut;
        const currentOffsetY = startOffsetY + (targetOffsetY - startOffsetY) * easeOut;
        canvas2.ds.offset[0] = currentOffsetX;
        canvas2.ds.offset[1] = currentOffsetY;
        canvas2.setDirty(true, true);
        if (progress >= 0.7 && !this._overlayShown) {
          this._overlayShown = true;
          this.addNodeHighlightOverlay(sourceNode, canvas2);
          console.log(`[NodeInspector] Overlay shown at 70% animation progress`);
        }
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          console.log(`[NodeInspector] Smooth navigation completed successfully`);
          log(this.type, `Navigated to source node: ${sourceNode.title} (ID: ${nodeId}) at position [${sourceNode.pos[0]}, ${sourceNode.pos[1]}]`);
          this._overlayShown = false;
        }
      };
      requestAnimationFrame(animate);
    } else {
      console.warn(`[NodeInspector] No app.canvas available`);
    }
  }
  addNodeHighlightOverlay(targetNode, canvas2) {
    console.log(`[NodeInspector] Adding subtle highlight overlay to node`);
    const originalOnDrawForeground = targetNode.onDrawForeground;
    const highlightOverlay = function(ctx) {
      if (originalOnDrawForeground) {
        originalOnDrawForeground.call(this, ctx);
      }
      const padding = 8;
      const titleHeight = LiteGraph.NODE_TITLE_HEIGHT || 30;
      const x2 = -padding;
      const y = -titleHeight - padding;
      const width2 = this.size[0] + padding * 2;
      const height = this.size[1] + titleHeight + padding * 2;
      ctx.save();
      ctx.shadowColor = "rgba(74, 157, 255, 0.4)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = "rgba(74, 157, 255, 0.1)";
      ctx.strokeStyle = "rgba(74, 157, 255, 0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x2, y, width2, height, 6);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };
    targetNode.onDrawForeground = highlightOverlay;
    setTimeout(() => {
      targetNode.onDrawForeground = originalOnDrawForeground;
      canvas2.setDirty(true, true);
      console.log(`[NodeInspector] Removed highlight overlay`);
    }, 1500);
    console.log(`[NodeInspector] Highlight overlay applied`);
  }
  updateFieldsDisplay() {
    if (!this._connectedNode) {
      this._fieldEntries = [];
      this.createFieldsDisplayWidget();
      return;
    }
    const newFieldEntries = this.getAllFieldEntries(this._connectedNode);
    this._availableFields = newFieldEntries.map((f) => f.name);
    const currentEntriesStr = newFieldEntries.map((e2) => `${e2.name}:${e2.value}`).join("|");
    const previousEntriesStr = this._fieldEntries.map((e2) => `${e2.name}:${e2.value}`).join("|");
    if (currentEntriesStr !== previousEntriesStr) {
      this._fieldEntries = newFieldEntries;
      log(this.type, `Fields updated for '${this._connectedNode.title}' (${this._fieldEntries.length} fields)`);
      this.createFieldsDisplayWidget();
      if (this._selectedFieldNames.length > 0) {
        this.updateBackendProperties();
      }
    }
  }
  startPeriodicUpdates() {
    this.stopPeriodicUpdates();
    this._updateInterval = setInterval(() => {
      if (this._connectedNode) {
        const previousEntries = this._fieldEntries.map((e2) => `${e2.name}:${e2.value}`).join("|");
        const newEntries = this.getAllFieldEntries(this._connectedNode);
        const currentEntries = newEntries.map((e2) => `${e2.name}:${e2.value}`).join("|");
        if (currentEntries !== previousEntries) {
          this._fieldEntries = newEntries;
          this.createFieldsDisplayWidget();
          if (this._selectedFieldNames.length > 0) {
            this.updateBackendProperties();
          }
          if (app.graph) {
            app.graph.setDirtyCanvas(true, false);
          }
        }
      }
    }, 500);
  }
  stopPeriodicUpdates() {
    if (this._updateInterval !== null) {
      clearInterval(this._updateInterval);
      this._updateInterval = null;
    }
  }
  // Force refresh of all field values
  forceRefresh() {
    console.log("[NodeInspector] Force refresh triggered");
    if (this._connectedNode) {
      this._fieldEntries = this.getAllFieldEntries(this._connectedNode);
      this.createFieldsDisplayWidget();
      if (this._selectedFieldNames.length > 0) {
        this.updateBackendProperties();
      }
      if (app.graph) {
        app.graph.setDirtyCanvas(true, false);
      }
      console.log("[NodeInspector] Force refresh completed");
    }
  }
  // Setup enhanced monitoring for upstream changes
  setupGraphChangeListener() {
    console.log("[NodeInspector] Using periodic updates and manual refresh for change detection");
  }
  removeGraphChangeListener() {
    this._graphChangeListener = null;
    console.log("[NodeInspector] Graph change listener removed");
  }
  inspectConnectedNode(connectedNode) {
    this._connectedNode = connectedNode;
    if (!connectedNode) {
      this._availableFields = [];
      this._fieldEntries = [];
      this._selectedFieldNames = [];
      this.stopPeriodicUpdates();
      this.removeGraphChangeListener();
      this.updateFieldsDisplay();
      return;
    }
    this.updateFieldsDisplay();
    this.startPeriodicUpdates();
    this.setupGraphChangeListener();
  }
  onConnectionsChange(type, index, connected, linkInfo, inputOrOutput) {
    var _a, _b;
    if (type === 1 && index === 0) {
      if (connected && linkInfo) {
        const link = app.graph.links[linkInfo.id];
        if (link) {
          const connectedNode = app.graph.getNodeById(link.origin_id);
          if (connectedNode) {
            this.inspectConnectedNode(connectedNode);
          }
        }
      } else {
        this.inspectConnectedNode(null);
        const selectedFieldnamesWidget = (_a = this.widgets) == null ? void 0 : _a.find((w) => w.name === "selected_fieldnames");
        const selectedValuesWidget = (_b = this.widgets) == null ? void 0 : _b.find((w) => w.name === "selected_values");
        if (selectedFieldnamesWidget) selectedFieldnamesWidget.value = "";
        if (selectedValuesWidget) selectedValuesWidget.value = "";
      }
    }
  }
  onNodeCreated() {
    log(this.type, "Node created");
    this._connectedNode = null;
    this._availableFields = [];
    this._fieldEntries = [];
    this._selectedFieldNames = [];
    if (!this.properties) this.properties = {};
    this.properties["selected_fieldnames"] = "";
    this.properties["field_names_input"] = "";
    this.properties["selected_values"] = "";
    setTimeout(() => {
      var _a, _b, _c;
      log(this.type, "Available widgets:", ((_a = this.widgets) == null ? void 0 : _a.map((w) => w.name)) || []);
      const selectedFieldnamesWidget = (_b = this.widgets) == null ? void 0 : _b.find((w) => w.name === "selected_fieldnames");
      const selectedValuesWidget = (_c = this.widgets) == null ? void 0 : _c.find((w) => w.name === "selected_values");
      if (selectedFieldnamesWidget) selectedFieldnamesWidget.value = "";
      if (selectedValuesWidget) selectedValuesWidget.value = "";
      log(this.type, "Backend widgets initialized:", {
        selectedFieldnamesWidget: !!selectedFieldnamesWidget,
        selectedValuesWidget: !!selectedValuesWidget
      });
    }, 10);
    this.updateFieldsDisplay();
  }
  onConfigure(info) {
    var _a, _b, _c, _d;
    log(this.type, "Configuring node with info:", info);
    const hasConnection = Boolean((_b = (_a = this.inputs) == null ? void 0 : _a[0]) == null ? void 0 : _b.link);
    log(this.type, "Has input connection:", hasConnection);
    if ((_c = this.properties) == null ? void 0 : _c["selected_fieldnames"]) {
      const fieldNamesString = this.properties["selected_fieldnames"];
      this._selectedFieldNames = fieldNamesString ? fieldNamesString.split(",").map((s) => s.trim()).filter((s) => s) : [];
      log(this.type, "Restored selected field names:", this._selectedFieldNames);
    } else if ((_d = this.properties) == null ? void 0 : _d["field_names_input"]) {
      const fieldNamesString = this.properties["field_names_input"];
      this._selectedFieldNames = fieldNamesString ? fieldNamesString.split(",").map((s) => s.trim()).filter((s) => s) : [];
      log(this.type, "Restored field names from input:", this._selectedFieldNames);
    } else {
      this._selectedFieldNames = [];
    }
    if (!hasConnection) {
      this._connectedNode = null;
      this._availableFields = [];
      this._fieldEntries = [];
      this.stopPeriodicUpdates();
    }
    this.updateFieldsDisplay();
    setTimeout(() => {
      this.updateBackendProperties();
    }, 100);
  }
  onExecute() {
    if (!this.properties) this.properties = {};
    if (!this.properties["field_names_input"]) {
      this.properties["field_names_input"] = this._selectedFieldNames.join(", ");
    }
  }
  onRemoved() {
    var _a;
    this.stopPeriodicUpdates();
    this.removeGraphChangeListener();
    (_a = super.onRemoved) == null ? void 0 : _a.call(this);
  }
  onMouseDown(event, pos, canvas2) {
    var _a, _b;
    console.log(`[NodeInspector] Node onMouseDown: pos=${pos}, event=${event.type}`);
    const refreshBounds = this._refreshButtonBounds;
    if (refreshBounds && pos[0] >= refreshBounds.x && pos[0] <= refreshBounds.x + refreshBounds.width && pos[1] >= refreshBounds.y && pos[1] <= refreshBounds.y + refreshBounds.height) {
      console.log("[NodeInspector] Refresh button clicked");
      this.forceRefresh();
      return true;
    }
    const scrollableWidget = (_a = this.widgets) == null ? void 0 : _a.find((w) => w.name === "fields_scrollable");
    if (scrollableWidget && this._fieldEntries.length > 0) {
      const widgetY = 80;
      const widgetHeight = scrollableWidget._desiredHeight || 40;
      console.log(`[NodeInspector] Node click debug: pos[1]=${pos[1]}, widgetY=${widgetY}, widgetHeight=${widgetHeight}, range=${widgetY}-${widgetY + widgetHeight}`);
      if (pos[1] >= widgetY && pos[1] <= widgetY + widgetHeight) {
        const relativeY = pos[1] - widgetY;
        const lineHeight = 20;
        const scrollOffset = scrollableWidget.scrollOffset || 0;
        const clickedIndex = Math.floor((relativeY + scrollOffset) / lineHeight);
        console.log(`[NodeInspector] Click in widget area: relativeY=${relativeY}, clickedIndex=${clickedIndex}, fieldsLength=${this._fieldEntries.length}`);
        if (clickedIndex >= 0 && clickedIndex < this._fieldEntries.length) {
          const entry = this._fieldEntries[clickedIndex];
          if (entry) {
            const fieldName = entry.name;
            console.log(`[NodeInspector] Field clicked via node handler: ${fieldName}`);
            this.selectField(fieldName);
            return true;
          }
        }
      }
    }
    return ((_b = super.onMouseDown) == null ? void 0 : _b.call(this, event, pos, canvas2)) || false;
  }
  computeSize(out) {
    var _a;
    const baseWidth = 380;
    const baseHeight = 90;
    const topPadding = 5;
    const bottomPadding = 5;
    const fieldCount = ((_a = this._fieldEntries) == null ? void 0 : _a.length) || 0;
    if (fieldCount === 0) {
      return [baseWidth, baseHeight + 25];
    }
    const lineHeight = 20;
    const headerHeight = 25;
    const inputEntries = this._fieldEntries.filter((entry) => entry.sourceType === "input");
    const widgetEntries = this._fieldEntries.filter((entry) => entry.sourceType === "widget");
    let totalContentHeight = 0;
    if (inputEntries.length > 0) {
      totalContentHeight += headerHeight + inputEntries.length * lineHeight;
    }
    if (widgetEntries.length > 0) {
      const maxFieldsBeforeScroll = 8;
      const shouldScroll = widgetEntries.length > maxFieldsBeforeScroll;
      const visibleFields = shouldScroll ? maxFieldsBeforeScroll : widgetEntries.length;
      totalContentHeight += headerHeight + visibleFields * lineHeight;
    }
    const totalHeight = baseHeight + totalContentHeight + topPadding + bottomPadding;
    return [baseWidth, totalHeight];
  }
};
_NodeInspectorNode.title = "\u{1F50D} Node Inspector";
_NodeInspectorNode.type = "NodeInspector";
_NodeInspectorNode.category = "storyboard/Debug";
_NodeInspectorNode._category = "storyboard/Debug";
var NodeInspectorNode = _NodeInspectorNode;
if (!window.__nodeInspectorRegistered) {
  window.__nodeInspectorRegistered = true;
  app.registerExtension({
    name: "comfyui-storyboard.node-inspector",
    async beforeRegisterNodeDef(nodeType, nodeData) {
      if (nodeData.name === "NodeInspector") {
        log("NodeInspector", "Registering node type");
        log("NodeInspector", "Node data:", nodeData);
        const methods = [
          "onConnectionsChange",
          "onExecute",
          "onConfigure",
          "onNodeCreated",
          "onRemoved",
          "onMouseDown",
          "onMouseOver",
          "onMouseOut",
          "onDrawForeground",
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
          "createInformationalSection",
          "createSelectableSection",
          "startPeriodicUpdates",
          "stopPeriodicUpdates",
          "forceRefresh",
          "setupGraphChangeListener",
          "removeGraphChangeListener",
          "computeSize",
          "getInputSocketTypeColor",
          "getSocketTypeColor",
          "updateBackendProperties",
          "navigateToConnectedNode",
          "addNodeHighlightOverlay",
          "addCustomWidget"
        ];
        for (const method of methods) {
          const prototype = NodeInspectorNode.prototype;
          if (prototype[method]) {
            nodeType.prototype[method] = prototype[method];
            log("NodeInspector", `Copied method: ${method}`);
          }
        }
        nodeType.title = NodeInspectorNode.title;
        nodeType.type = NodeInspectorNode.type;
        nodeType.category = NodeInspectorNode.category;
        nodeType._category = NodeInspectorNode._category;
        log("NodeInspector", "Static properties copied");
        if (NodeInspectorNode.type) {
          log("NodeInspector", "Registering node type with LiteGraph");
          LiteGraph.registerNodeType(NodeInspectorNode.type, nodeType);
        }
        NodeInspectorNode.setUp();
      }
    },
    nodeCreated(node2) {
      var _a;
      if (node2.comfyClass === "NodeInspector") {
        log("NodeInspector", "Node instance created");
        log("NodeInspector", "Node properties:", node2.properties);
        node2._connectedNode = null;
        node2._availableFields = [];
        node2._fieldEntries = [];
        node2._selectedFieldNames = [];
        node2._updateInterval = null;
        if (!node2.properties) node2.properties = {};
        node2.properties["selected_fieldnames"] = "";
        node2.properties["field_names_input"] = "";
        node2.properties["selected_values"] = "";
        log("NodeInspector", "Node state initialized");
        setTimeout(() => {
          var _a2, _b, _c;
          log("NodeInspector", "Available widgets:", ((_a2 = node2.widgets) == null ? void 0 : _a2.map((w) => w.name)) || []);
          const selectedFieldnamesWidget = (_b = node2.widgets) == null ? void 0 : _b.find((w) => w.name === "selected_fieldnames");
          const selectedValuesWidget = (_c = node2.widgets) == null ? void 0 : _c.find((w) => w.name === "selected_values");
          if (selectedFieldnamesWidget) selectedFieldnamesWidget.value = "";
          if (selectedValuesWidget) selectedValuesWidget.value = "";
          log("NodeInspector", "Backend widgets initialized in nodeCreated");
        }, 10);
        (_a = node2.onConstructed) == null ? void 0 : _a.call(node2);
        log("NodeInspector", "Node constructed");
      }
    }
  });
}
export {
  NodeInspectorNode
};
