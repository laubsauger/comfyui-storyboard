from .nodes.markdown_renderer import MarkdownRenderer

NODE_CLASS_MAPPINGS = {
    "MarkdownRenderer": MarkdownRenderer,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "MarkdownRenderer": "Markdown Renderer",
}

WEB_DIRECTORY = "./web"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
