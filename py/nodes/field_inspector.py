from comfy.comfy_types.node_typing import IO


class FieldInspector:
    NAME = "FieldInspector"
    DISPLAY_NAME = "🔍 Field Inspector"

    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "source_node": (IO.ANY, {}),
                "selected_fieldnames": (
                    "STRING",
                    {
                        "default": "",
                        "tooltip": "Comma-separated list of selected field names",
                        "multiline": False,
                    },
                ),
                "selected_values": (
                    "STRING",
                    {
                        "default": "",
                        "tooltip": "JSON string of selected field values",
                        "multiline": True,
                    },
                ),
            },
            "hidden": {
                "field_names_input": (
                    "STRING",
                    {
                        "default": "",
                        "tooltip": "Selected field names from the connected node",
                    },
                ),
                "unique_id": "UNIQUE_ID",
                "extra_pnginfo": "EXTRA_PNGINFO",
            },
        }

    RETURN_TYPES = ("LIST", "LIST", "DICT", IO.ANY)
    RETURN_NAMES = ("field_names", "field_values", "field_dict", "passthrough")
    FUNCTION = "inspect_field"
    CATEGORY = "storyboard/Debug"
    OUTPUT_NODE = False

    @classmethod
    def IS_CHANGED(s, **kwargs):
        return float("NaN")

    def inspect_field(
        self,
        source_node,
        selected_fieldnames,
        selected_values,
        unique_id=None,
        extra_pnginfo=None,
        **kwargs,
    ):
        """
        Inspect and extract field information from connected nodes.
        """
        import json

        # Extract field_names_input from kwargs (hidden input)
        field_names_input = kwargs.get("field_names_input", selected_fieldnames)

        # Parse the selected field names (comma-separated)
        if field_names_input:
            field_names_list = [
                name.strip() for name in field_names_input.split(",") if name.strip()
            ]
        else:
            field_names_list = []

        # Parse the selected values (JSON string)
        try:
            if selected_values:
                field_values_dict = json.loads(selected_values)
            else:
                field_values_dict = {}
        except (json.JSONDecodeError, TypeError):
            field_values_dict = {}

        # Create lists of values in the same order as field names
        field_values_list = []
        for field_name in field_names_list:
            value = field_values_dict.get(field_name, "")
            field_values_list.append(str(value))

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
                                "selected_fieldnames": selected_fieldnames,
                                "field_names_input": field_names_input,
                                "selected_values": selected_values,
                            }
            except Exception as e:
                print(f"[FieldInspector] Error updating workflow metadata: {e}")

        # Create dictionary of field names to values
        field_dict = {}
        for field_name, field_value in zip(field_names_list, field_values_list):
            field_dict[field_name] = field_value

        # Return lists of field names and values, dictionary, plus passthrough
        return (field_names_list, field_values_list, field_dict, source_node)
