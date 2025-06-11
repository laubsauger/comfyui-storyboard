#!/usr/bin/env python3

import subprocess
import os
import time
import shutil

# Simple color definitions
COLORS = {
    "RESET": "\033[0m",
    "RED": "\033[31m",
    "YELLOW": "\033[33m",
    "BRIGHT_GREEN": "\033[92m",
}

step_msg = ""
step_start = 0


def log_step(msg=None, status=None):
    """Logs a step keeping track of timing and initial msg."""
    global step_msg
    global step_start
    if msg:
        step_msg = f"▻ [Starting] {msg}..."
        step_start = time.time()
        print(step_msg, end="\r")
    elif status:
        step_time = round(time.time() - step_start, 3)
        if status == "Error":
            status_msg = f'{COLORS["RED"]}⤫ {status}{COLORS["RESET"]}'
        elif status == "Warn":
            status_msg = f'{COLORS["YELLOW"]}! {status}{COLORS["RESET"]}'
        else:
            status_msg = f'{COLORS["BRIGHT_GREEN"]}🗸 {status}{COLORS["RESET"]}'
        print(f'{step_msg.ljust(64, ".")} {status_msg} ({step_time}s)')


def build():
    """Builds the web files using esbuild."""
    THIS_DIR = os.path.dirname(os.path.abspath(__file__))
    DIR_SRC_WEB = os.path.abspath(f"{THIS_DIR}/src_web/")
    DIR_WEB = os.path.abspath(f"{THIS_DIR}/web/")

    start_time = time.time()

    log_step(msg="Copying web directory (excluding .ts and .scss)")
    if os.path.exists(DIR_WEB):
        shutil.rmtree(DIR_WEB)
    shutil.copytree(
        DIR_SRC_WEB,
        DIR_WEB,
        ignore=shutil.ignore_patterns(
            "*.ts", "*.scss", "typings*", "comfyui*", "scripts_comfy*"
        ),
    )
    log_step(status="Done")

    # Check if node_modules exists
    log_step(msg="Checking dependencies")
    if not os.path.exists(os.path.join(THIS_DIR, "node_modules")):
        print("\nInstalling dependencies...")
        subprocess.run(["npm", "install"], check=True, cwd=THIS_DIR)
        print("Dependencies installed.")
    log_step(status="Done")

    # Ensure esbuild and sass plugin are installed
    log_step(msg="Ensuring build tools are present")
    subprocess.run(
        ["npm", "install", "esbuild", "esbuild-sass-plugin"],
        check=True,
        cwd=THIS_DIR,
        capture_output=True,
    )
    log_step(status="Done")

    log_step(msg="Building with esbuild")
    esbuild_path = os.path.join(THIS_DIR, "node_modules/.bin/esbuild")
    config_path = os.path.join(THIS_DIR, "esbuild.config.mjs")

    try:
        # We need to run esbuild via node to use the mjs config
        cmd = [
            "node",
            config_path,
        ]

        result = subprocess.run(
            cmd, check=True, cwd=THIS_DIR, capture_output=True, text=True
        )
        if result.stderr:
            print(result.stderr)

        log_step(status="Done")
    except subprocess.CalledProcessError as e:
        log_step(status="Error")
        print(f"Error building with esbuild: {e}")
        print(e.stderr)
        return

    end_time = time.time()
    print(f"Build finished in {end_time - start_time:.2f}s")


if __name__ == "__main__":
    build()
