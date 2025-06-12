class MarkdownRenderer:
    NAME = "MarkdownRenderer"
    DISPLAY_NAME = "Markdown Renderer"

    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {},
            "optional": {
                "text": (
                    "STRING",
                    {
                        "forceInput": True,
                        "hidden": True,
                        "tooltip": "The Markdown text to be rendered. This can be connected to other nodes that output text.",
                    },
                ),
            },
            "hidden": {
                "unique_id": "UNIQUE_ID",
                "extra_pnginfo": "EXTRA_PNGINFO",
            },
        }

    INPUT_IS_LIST = True
    RETURN_TYPES = ("STRING",)
    FUNCTION = "render_markdown"
    CATEGORY = "storyboard/Markdown"
    OUTPUT_NODE = True
    OUTPUT_IS_LIST = (False,)

    @classmethod
    def IS_CHANGED(s, **kwargs):
        return float("NaN")

    def render_markdown(self, unique_id=None, extra_pnginfo=None, text=None):
        print(f"[MarkdownRenderer] Processing text. Input: {text}")

        # Process input from connected nodes
        if text is not None:
            # Handle both single strings and lists of strings
            if isinstance(text, list):
                # Concatenate all items with newlines
                text_content = "\n".join(str(item) for item in text)
            else:
                # Single string input
                text_content = str(text)
        else:
            # No input connected - will be handled by frontend editing
            text_content = ""

        print(f"[MarkdownRenderer] Processed text content")

        # Store in workflow metadata if available
        if unique_id is not None and extra_pnginfo is not None:
            try:
                if isinstance(extra_pnginfo, list) and len(extra_pnginfo) > 0:
                    if (
                        isinstance(extra_pnginfo[0], dict)
                        and "workflow" in extra_pnginfo[0]
                    ):
                        workflow = extra_pnginfo[0]["workflow"]
                        node = next(
                            (
                                x
                                for x in workflow["nodes"]
                                if str(x["id"]) == str(unique_id[0])
                            ),
                            None,
                        )
                        if node:
                            # Store as a single string in widgets_values
                            node["widgets_values"] = text_content
            except Exception as e:
                print(f"[MarkdownRenderer] Error updating workflow metadata: {e}")

        # Return both UI data for frontend and result for output
        return {
            "ui": {"text": text_content, "html": text_content},
            "result": (text_content,),
        }
