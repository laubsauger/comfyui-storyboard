import { app } from "scripts/app.js";

app.registerExtension({
  name: "comfy.llm.OpenAIChatGPT",
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