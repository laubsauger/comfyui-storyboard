"""
@author: comfyui-storyboard
@title: ComfyUI Storyboard
@nickname: Storyboard
@description: A ComfyUI node to display markdown text, and other storyboard features.
"""

import os
import shutil
from .py.markdown_renderer import MarkdownRenderer
from glob import glob
import random


def log(message, color="GREEN"):
    print(message)


NODE_CLASS_MAPPINGS = {
    MarkdownRenderer.NAME: MarkdownRenderer,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    MarkdownRenderer.NAME: MarkdownRenderer.DISPLAY_NAME,
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

print()
adjs = ["exciting", "extraordinary", "epic", "fantastic", "magnificent"]
log(
    f"🎉 ComfyUI Storyboard: Loaded {len(nodes)} {random.choice(adjs)} nodes.",
    color="BRIGHT_GREEN",
)
print()

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
