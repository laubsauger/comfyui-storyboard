import markdown2
import logging
import re
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MarkdownRenderer")


def pretty_print_json_in_markdown(md_text):
    def replacer(match):
        lang = match.group(1).strip().lower()
        code = match.group(2)
        if lang == "json":
            try:
                parsed_json = json.loads(code)
                pretty_json = json.dumps(parsed_json, indent=2)
                return f"```{lang}\\n{pretty_json}\\n```"
            except (json.JSONDecodeError, TypeError):
                return match.group(0)
        return match.group(0)

    pattern = re.compile(r"^```(\w*)\\n([\s\S]+?)\\n^```$", re.MULTILINE)
    return pattern.sub(replacer, md_text)


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
    OUTPUT_IS_LIST = (True,)
    MARKDOWN_EXTRAS = [
        "code-color",
        "tables",
        "code-friendly",
        "task_list",
        "break-on-newline",
        "footnotes",
        "header-ids",
        "nofollow",
        "strike",
        "target-blank-links",
        "cuddled-lists",
    ]

    @classmethod
    def IS_CHANGED(s, **kwargs):
        return float("NaN")

    def render_markdown(self, unique_id=None, extra_pnginfo=None, text=None):
        logger.info(
            f"[MarkdownRenderer] Processing markdown with unique_id: {unique_id}"
        )
        logger.info(f"[MarkdownRenderer] Input text type: {type(text)}")
        if text:
            logger.info(f"[MarkdownRenderer] Input text length: {len(text)}")
            logger.info(
                f"[MarkdownRenderer] First 100 chars of input: {str(text)[:100]}"
            )

        # Handle input - if no input connected, we'll get default content from the frontend
        html_content = []
        text_content = []

        if text is not None:
            # Process input from connected nodes
            for t in text:
                if isinstance(t, list):
                    for item in t:
                        text_str = str(item)
                        logger.info(
                            f"[MarkdownRenderer] Processing list item: {text_str[:100]}..."
                        )
                        processed_text = pretty_print_json_in_markdown(text_str)
                        text_content.append(processed_text)
                        # Convert markdown to HTML using markdown2 with extras
                        html = markdown2.markdown(
                            processed_text,
                            extras=MarkdownRenderer.MARKDOWN_EXTRAS,
                        )
                        html_content.append(html)
                        logger.info(
                            f"[MarkdownRenderer] Generated HTML length: {len(html)}"
                        )
                else:
                    text_str = str(t)
                    logger.info(
                        f"[MarkdownRenderer] Processing single item: {text_str[:100]}..."
                    )
                    processed_text = pretty_print_json_in_markdown(text_str)
                    text_content.append(processed_text)
                    html = markdown2.markdown(
                        processed_text,
                        extras=MarkdownRenderer.MARKDOWN_EXTRAS,
                    )
                    html_content.append(html)
                    logger.info(
                        f"[MarkdownRenderer] Generated HTML length: {len(html)}"
                    )
        else:
            # No input connected - will be handled by frontend editing
            logger.info(
                "[MarkdownRenderer] No input text provided - will use frontend content"
            )
            text_content = [""]
            html_content = [""]

        logger.info(f"[MarkdownRenderer] Converted {len(html_content)} items to HTML")
        logger.info(
            f"[MarkdownRenderer] Text content lengths: {[len(t) for t in text_content]}"
        )
        logger.info(
            f"[MarkdownRenderer] HTML content lengths: {[len(h) for h in html_content]}"
        )

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
                            logger.info(
                                f"[MarkdownRenderer] Found node in workflow: {node.get('id')}"
                            )
                            node["widgets_values"] = html_content
                            logger.info(
                                "[MarkdownRenderer] Updated workflow metadata with HTML content"
                            )
                        else:
                            logger.warning(
                                f"[MarkdownRenderer] Node {unique_id[0]} not found in workflow"
                            )
            except Exception as e:
                logger.error(
                    f"[MarkdownRenderer] Error updating workflow metadata: {e}"
                )

        # Return both UI data for frontend and result for output
        return {
            "ui": {"text": text_content, "html": html_content},
            "result": (text_content,),
        }
