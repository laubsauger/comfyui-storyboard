import json
import pprint
from comfy.comfy_types.node_typing import IO

class MarkdownRenderer:
    NAME = "MarkdownRenderer"
    DISPLAY_NAME = "Markdown Renderer"

    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {},
            "optional": {
                "text": (
                    IO.ANY,  # Use IO.ANY to accept any input type
                    {
                        "forceInput": True,
                        "hidden": True,
                        "tooltip": "Content to be rendered as Markdown. Accepts strings, lists, dictionaries, and other serializable data. Dictionaries and complex objects will be formatted as Python code blocks.",
                    },
                ),
            },
            "hidden": {
                "unique_id": "UNIQUE_ID",
                "extra_pnginfo": "EXTRA_PNGINFO",
            },
        }

    RETURN_TYPES = ("STRING",)
    FUNCTION = "render_markdown"
    CATEGORY = "storyboard/Markdown"
    OUTPUT_NODE = True
    OUTPUT_IS_LIST = (False,)
    INPUT_IS_LIST = True

    @classmethod
    def IS_CHANGED(s, **kwargs):
        return float("NaN")

    def format_item_as_markdown(self, item, item_index=None):
        """Format a single item as markdown based on its type."""
        if item is None:
            return "*(None)*"

        # Handle strings - check if they look like markdown already
        if isinstance(item, str):
            item_str = item.strip()
            if not item_str:
                return ""
            return item_str

        # Handle dictionaries - format as Python code block
        elif isinstance(item, dict):
            if not item:  # Empty dict
                return "```python\n{}\n```"

            try:
                # Use pprint for nice formatting
                formatted_dict = pprint.pformat(
                    item, indent=2, width=80, sort_dicts=True
                )
                return f"```python\n{formatted_dict}\n```"
            except Exception as e:
                # Fallback to json if pprint fails
                try:
                    formatted_dict = json.dumps(
                        item, indent=2, ensure_ascii=False, default=str
                    )
                    return f"```json\n{formatted_dict}\n```"
                except Exception:
                    return f"```python\n{repr(item)}\n```"

        # Handle lists - format as markdown list or code block depending on content
        elif isinstance(item, (list, tuple)):
            if not item:  # Empty list
                return f"```python\n{repr(item)}\n```"

            # Check if all items are simple strings that could be a markdown list
            if all(
                isinstance(x, str) and "\n" not in x and len(x.strip()) < 100
                for x in item
            ):
                # Format as markdown list
                list_items = [f"- {str(x).strip()}" for x in item if str(x).strip()]
                return "\n".join(list_items)
            else:
                # Format as Python code block for complex lists
                try:
                    formatted_list = pprint.pformat(item, indent=2, width=80)
                    return f"```python\n{formatted_list}\n```"
                except Exception:
                    return f"```python\n{repr(item)}\n```"

        # Handle numbers, booleans, and other simple types
        elif isinstance(item, (int, float, bool)):
            return f"```python\n{repr(item)}\n```"

        # Handle any other type - try to serialize it nicely
        else:
            try:
                # Try pprint first for nice formatting
                formatted_item = pprint.pformat(item, indent=2, width=80)
                return f"```python\n{formatted_item}\n```"
            except Exception:
                # Fallback to string representation
                return f"```python\n{repr(item)}\n```"

    def render_markdown(self, unique_id=None, extra_pnginfo=None, text=None):
        print(f"[MarkdownRenderer] Processing input. Input type: {type(text)}")
        print(f"[MarkdownRenderer] Raw input value: {repr(text)}")

        # When INPUT_IS_LIST = True, inputs come as lists even for single values
        # text parameter will be a list containing the actual input values
        if text is not None:
            print(f"[MarkdownRenderer] Input is list with {len(text)} items")

            # Process all input items and format them appropriately
            markdown_sections = []
            for i, item in enumerate(text):
                print(
                    f"[MarkdownRenderer] Processing item {i}: type={type(item)}, value={repr(item)[:100]}..."
                )

                formatted_section = self.format_item_as_markdown(item, i)
                if formatted_section:  # Only add non-empty sections
                    markdown_sections.append(formatted_section)

            # Join all sections with double newlines for proper markdown separation
            text_content = "\n\n".join(markdown_sections)
            print(
                f"[MarkdownRenderer] Processed {len(markdown_sections)} sections into markdown"
            )
        else:
            text_content = ""
            print(f"[MarkdownRenderer] No input provided, using empty string")

        print(f"[MarkdownRenderer] Final markdown content length: {len(text_content)}")
        print(f"[MarkdownRenderer] First 200 chars: {repr(text_content[:200])}")

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
        result = {
            "ui": {"text": [text_content], "html": [text_content]},
            "result": (text_content,),
        }

        return result
