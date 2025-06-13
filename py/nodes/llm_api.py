import os
import json
import openai
from ..log import log

# Get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))
py_dir = os.path.dirname(current_dir)
storyboard_dir = os.path.dirname(py_dir)
# Path to the config file
config_path = os.path.join(storyboard_dir, "config.json")


log(current_dir, "current_dir")
log(py_dir, "py_dir")
log(storyboard_dir, "storyboard_dir")
log(config_path, "config_path")

def get_api_key():
    """
    Loads the OpenAI API key from config.json.
    If the file or key is not found, it raises a ValueError with instructions.
    """
    if not os.path.exists(config_path):
        raise ValueError(
            "Configuration file 'config.json' not found. "
            "Please create it in the 'comfyui-storyboard' directory with your OpenAI API key: "
            '{"openai_api_key": "YOUR_API_KEY"}'
        )

    with open(config_path, "r") as f:
        config = json.load(f)

    api_key = config.get("openai_api_key")
    if not api_key:
        raise ValueError(
            "'openai_api_key' not found in config.json. "
            "Please add it to your 'config.json' file."
        )
    return api_key


class OpenAIAPIKeyManager:
    NAME = "OpenAI API Key Manager"
    DISPLAY_NAME = "OpenAI API Key Manager"
    CATEGORY = "storyboard/LLM/OpenAI"

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "api_key": (
                    "STRING",
                    {"multiline": False, "default": "Enter your OpenAI API key here"},
                ),
            },
        }

    RETURN_TYPES = ("STRING",)
    FUNCTION = "store_key"

    def store_key(self, api_key):
        if (
            not api_key
            or "Enter your OpenAI API key here" in api_key
            or "sk-" not in api_key
        ):
            return (
                "API key not provided or invalid. Please enter your OpenAI API key.",
            )

        config = {}
        if os.path.exists(config_path):
            with open(config_path, "r") as f:
                try:
                    config = json.load(f)
                except (json.JSONDecodeError, FileNotFoundError):
                    pass

        config["openai_api_key"] = api_key

        with open(config_path, "w") as f:
            json.dump(config, f, indent=4)

        return (f"OpenAI API key successfully saved to config.json.",)


class OpenAIAdvancedConfiguration:
    NAME = "OpenAI Advanced Configuration"
    DISPLAY_NAME = "OpenAI Adv. Config"
    CATEGORY = "storyboard/LLM/OpenAI"

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "response_format": (["text", "json_object"],),
                "seed": (
                    "INT",
                    {
                        "default": 42,
                        "min": 0,
                        "max": 4294967295,
                        "step": 1,
                        "display": "number",
                    },
                ),
            },
        }

    RETURN_TYPES = ("ADV_CONFIG",)
    FUNCTION = "configure"

    def configure(self, response_format, seed):
        config = {"response_format": {"type": response_format}, "seed": seed}
        return (config,)


class OpenAIChatGPT:
    NAME = "OpenAI Chat GPT"
    DISPLAY_NAME = "OpenAI Chat GPT"
    CATEGORY = "storyboard/LLM/OpenAI"

    def __init__(self):
        self.cached_output = None
        self.previous_inputs = None

    _models = [
        "gpt-4o-mini",
        "gpt-4o",
        "gpt-4-turbo",
        "gpt-4-turbo-preview",
        "gpt-4-0125-preview",
        "gpt-4-1106-preview",
        "gpt-4-vision-preview",
        "gpt-4",
        "gpt-4-0613",
        "gpt-4-32k",
        "gpt-4-32k-0613",
        "gpt-3.5-turbo-0125",
        "gpt-3.5-turbo",
        "gpt-3.5-turbo-1106",
        "gpt-3.5-turbo-instruct",
    ]

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "prompt": ("STRING", {"multiline": True, "default": "User Message"}),
                "system_prompt": (
                    "STRING",
                    {"multiline": True, "default": "System Instructions"},
                ),
                "model": (cls._models,),
                "temperature": (
                    "FLOAT",
                    {"default": 1.0, "min": 0.0, "max": 2.0, "step": 0.01},
                ),
                "use_caching": ("BOOLEAN", {"default": True}),
            },
            "optional": {
                "adv_config": ("ADV_CONFIG",),
            },
        }

    RETURN_TYPES = ("STRING",)
    FUNCTION = "chat"

    def chat(
        self, prompt, system_prompt, model, temperature, use_caching, adv_config=None
    ):
        status = "🔄 New"

        if use_caching:
            current_inputs = {
                "prompt": prompt,
                "system_prompt": system_prompt,
                "model": model,
                "temperature": temperature,
                "adv_config": adv_config,
            }

            if (
                self.previous_inputs == current_inputs
                and self.cached_output is not None
            ):
                status = "✅ Cached"
                return {
                    "ui": {"cache_status": [status]},
                    "result": (self.cached_output,),
                }

        try:
            api_key = get_api_key()
        except ValueError as e:
            status = "❌ Error"
            # Return the error message to be displayed on the node
            return {"ui": {"cache_status": [status]}, "result": (str(e),)}

        client = openai.OpenAI(api_key=api_key)

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ]

        kwargs = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
        }

        if adv_config:
            kwargs.update(adv_config)

        try:
            response = client.chat.completions.create(**kwargs)
            output = response.choices[0].message.content
            if use_caching:
                self.cached_output = output
                self.previous_inputs = current_inputs
            return {"ui": {"cache_status": [status]}, "result": (output,)}
        except Exception as e:
            print(f"Error calling OpenAI API: {e}")
            status = "❌ Error"
            return {"ui": {"cache_status": [status]}, "result": (f"Error: {e}",)}
