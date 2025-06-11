// src_web/comfyui/llm_api.ts
import { app } from "/scripts/app.js";
app.registerExtension({
  name: "comfy.llm.OpenAIChatGPT",
  registerCustomNodes() {
  }
});
app.registerExtension({
  name: "comfy.llm.OpenAIAdvancedConfiguration",
  registerCustomNodes() {
  }
});
app.registerExtension({
  name: "comfy.llm.OpenAIAPIKeyManager",
  registerCustomNodes() {
  }
});
