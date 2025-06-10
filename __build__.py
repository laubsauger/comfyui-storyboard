#!/usr/bin/env python3

import subprocess
import os
import time
import shutil
import glob

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
    """Builds the web files."""
    THIS_DIR = os.path.dirname(os.path.abspath(__file__))
    DIR_SRC_WEB = os.path.abspath(f"{THIS_DIR}/src_web/")
    DIR_WEB = os.path.abspath(f"{THIS_DIR}/web/")

    start_time = time.time()

    log_step(msg="Copying web directory")
    if os.path.exists(DIR_WEB):
        shutil.rmtree(DIR_WEB)
    shutil.copytree(
        DIR_SRC_WEB, DIR_WEB, ignore=shutil.ignore_patterns("*.ts", "typings")
    )
    log_step(status="Done")

    # Check if node_modules exists
    log_step(msg="Checking dependencies")
    if not os.path.exists(os.path.join(THIS_DIR, "node_modules")):
        print("\nInstalling dependencies...")
        subprocess.run(["npm", "install"], check=True, cwd=THIS_DIR)
        print("Dependencies installed.")
    log_step(status="Done")

    log_step(msg="SASS")
    scsss = glob.glob(os.path.join(DIR_SRC_WEB, "**", "*.scss"), recursive=True)
    cmds = ["node", os.path.join(THIS_DIR, "node_modules/sass/sass.js")]
    for scss in scsss:
        out = scss.replace("src_web", "web").replace(".scss", ".css")
        cmds.append(f"{scss}:{out}")
    cmds.append("--no-source-map")
    try:
        subprocess.run(
            cmds,
            check=True,
            cwd=THIS_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        log_step(status="Done")
    except subprocess.CalledProcessError as e:
        log_step(status="Error")
        print(f"Error compiling SASS: {e}")
        if e.stdout:
            print(e.stdout.decode("utf-8"))
        if e.stderr:
            print(e.stderr.decode("utf-8"))
        return

    log_step(msg="TypeScript")
    try:
        subprocess.run(
            ["node", os.path.join(THIS_DIR, "node_modules/typescript/bin/tsc")],
            check=True,
            cwd=THIS_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        log_step(status="Done")
    except subprocess.CalledProcessError as e:
        log_step(status="Error")
        print(f"Error compiling TypeScript: {e}")
        if e.stdout:
            print(e.stdout.decode("utf-8"))
        if e.stderr:
            print(e.stderr.decode("utf-8"))
        return

    end_time = time.time()
    print(f"Build finished in {end_time - start_time:.2f}s")


if __name__ == "__main__":
    build()
