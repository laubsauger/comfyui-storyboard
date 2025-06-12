"""
@author: comfyui-storyboard
@title: ComfyUI Storyboard
@nickname: Storyboard
@description: A ComfyUI node to display markdown text, and other storyboard features.
"""

import os
import shutil
from .py.log import log
from .py.markdown_renderer import MarkdownRenderer
from .py.llm_api import OpenAIChatGPT, OpenAIAdvancedConfiguration, OpenAIAPIKeyManager
from glob import glob
import random

NODE_CLASS_MAPPINGS = {
    MarkdownRenderer.NAME: MarkdownRenderer,
    OpenAIChatGPT.NAME: OpenAIChatGPT,
    OpenAIAdvancedConfiguration.NAME: OpenAIAdvancedConfiguration,
    OpenAIAPIKeyManager.NAME: OpenAIAPIKeyManager,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    MarkdownRenderer.NAME: MarkdownRenderer.DISPLAY_NAME,
    OpenAIChatGPT.NAME: OpenAIChatGPT.DISPLAY_NAME,
    OpenAIAdvancedConfiguration.NAME: OpenAIAdvancedConfiguration.DISPLAY_NAME,
    OpenAIAPIKeyManager.NAME: OpenAIAPIKeyManager.DISPLAY_NAME,
}

WEB_DIRECTORY = "./web"

THIS_DIR = os.path.dirname(os.path.abspath(__file__))
DIR_WEB = os.path.abspath(f"{THIS_DIR}/{WEB_DIRECTORY}")
DIR_PY = os.path.abspath(f"{THIS_DIR}/py")

NOT_NODES = [
    "constants",
    "log",
    "utils",
    "storyboard",
    "config",
]

nodes = []
for file in glob(os.path.join(DIR_PY, "*.py")) + glob(os.path.join(DIR_WEB, "*.js")):
    name = os.path.splitext(os.path.basename(file))[0]
    if name in NOT_NODES or name in nodes:
        continue
    if name.startswith("_") or name.startswith("base") or "utils" in name:
        continue
    nodes.append(name)
    if name == "display_any":
        nodes.append("display_int")

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]

print()
adjs = ["clutch", "banging", "rad", "fascinating", "marvelous"]
log(
    f"Loaded {len(nodes)} {random.choice(adjs)} nodes. 🦾",
    color="BRIGHT_BLUE",
)
print()
