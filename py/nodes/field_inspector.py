from comfy.comfy_types.node_typing import IO


class FieldInspector:
    NAME = "FieldInspector"
    DISPLAY_NAME = "🔍 Field Inspector"

    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "source_node": (IO.ANY, {}),
                "selected_fieldname": (
                    "STRING",
                    {
                        "default": "",
                        "tooltip": "Name of the currently selected field",
                        "multiline": False,
                    },
                ),
                "selected_value": (
                    "STRING",
                    {
                        "default": "",
                        "tooltip": "Current value of the selected field",
                    },
                ),
            },
            "hidden": {
                "field_name_input": (
                    "STRING",
                    {
                        "default": "",
                        "tooltip": "Selected field name from the connected node",
                    },
                ),
                "unique_id": "UNIQUE_ID",
                "extra_pnginfo": "EXTRA_PNGINFO",
            },
        }

    RETURN_TYPES = ("STRING", "STRING", IO.ANY)
    RETURN_NAMES = ("field_name", "field_value", "passthrough")
    FUNCTION = "inspect_field"
    CATEGORY = "storyboard/Debug"
    OUTPUT_NODE = False

    @classmethod
    def IS_CHANGED(s, **kwargs):
        return float("NaN")

    def inspect_field(
        self,
        source_node,
        selected_fieldname,
        selected_value,
        unique_id=None,
        extra_pnginfo=None,
        **kwargs,
    ):
        """
        Inspect and extract field information from connected nodes.
        """
        # Extract field_name_input from kwargs (hidden input)
        field_name_input = kwargs.get("field_name_input", selected_fieldname)

        # Store inspection data in workflow metadata if available
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
                            # Store inspection results in widgets_values
                            node["widgets_values"] = {
                                "selected_fieldname": selected_fieldname,
                                "field_name_input": field_name_input,
                                "selected_value": selected_value,
                            }
            except Exception as e:
                print(f"[FieldInspector] Error updating workflow metadata: {e}")

        # Return the output tuple directly to avoid JSON serialization issues
        return (field_name_input, selected_value, source_node)
