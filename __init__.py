"""
@author: comfyui-storyboard
@title: ComfyUI Storyboard
@nickname: Storyboard
@description: A ComfyUI node to display markdown text, and other storyboard features.
"""

from .py.markdown_renderer import MarkdownRenderer

NODE_CLASS_MAPPINGS = {
    MarkdownRenderer.NAME: MarkdownRenderer,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    MarkdownRenderer.NAME: MarkdownRenderer.DISPLAY_NAME,
}

WEB_DIRECTORY = "web"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]

print("🎉 ComfyUI Storyboard: Loaded")
