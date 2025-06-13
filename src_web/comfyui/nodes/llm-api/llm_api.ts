import { app } from "scripts/app.js";
import { log } from "../../../common/shared_utils.js";

app.registerExtension({
  name: "comfy.llm.OpenAIChatGPT",
  async beforeRegisterNodeDef(nodeType: any, nodeData: any) {
    if (nodeData.name === "OpenAI Chat GPT") {
      const onExecuted = nodeType.prototype.onExecuted;
      nodeType.prototype.onExecuted = function (message: any) {
        onExecuted?.apply(this, arguments);
        log("OpenAIChatGPT", `onExecuted for node ${this.id}. Message:`, message);

        const widget = this.widgets?.find((w: any) =>
          w.name === "use_caching"
        );

        log("OpenAIChatGPT", "Found widget:", widget);

        if (widget) {
          let label = "use_caching";
          if (message?.cache_status) {
            const status = message.cache_status[0];
            label += ` [ ${status} ]`;
          }
          widget.label = label;
          log("OpenAIChatGPT", `New widget label: ${widget.label}`);
        }

        this.setDirtyCanvas(true, true);
      };
    }
  },
  registerCustomNodes() {
    // No custom UI needed for this node yet
  },
});

app.registerExtension({
  name: "comfy.llm.OpenAIAdvancedConfiguration",
  registerCustomNodes() {
    // No custom UI needed for this node yet
  },
});

app.registerExtension({
  name: "comfy.llm.OpenAIAPIKeyManager",
  registerCustomNodes() {
    // No custom UI needed for this node yet
  },
}); 