#!/usr/bin/env python3

import subprocess
import os
import time
import shutil
import glob
import re
import json

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
        DIR_SRC_WEB, DIR_WEB, ignore=shutil.ignore_patterns("*.ts", "*.scss", "typings")
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

    log_step(msg="TypeScript Path Aliases")
    try:
        with open(os.path.join(THIS_DIR, "tsconfig.json"), "r") as f:
            tsconfig = json.load(f)

        base_url = os.path.join(
            THIS_DIR, tsconfig["compilerOptions"].get("baseUrl", ".")
        )
        paths = tsconfig["compilerOptions"].get("paths", {})

        out_dir = os.path.join(
            THIS_DIR, tsconfig["compilerOptions"].get("outDir", DIR_WEB)
        )

        js_files = glob.glob(os.path.join(out_dir, "**", "*.js"), recursive=True)

        for js_file in js_files:
            with open(js_file, "r+") as f:
                content = f.read()
                new_content = content

                # Find all import statements
                for match in re.finditer(
                    r'import\s+.*\s+from\s+[\'"]([^\'"]+)[\'"]', content
                ):
                    import_path = match.group(1)

                    # Try to resolve path alias
                    resolved = False
                    for alias, real_paths in paths.items():
                        alias_base = alias.replace("/*", "")
                        if import_path.startswith(alias_base):
                            # This is a basic replacement, assumes one path and wildcard
                            relative_path = import_path.replace(
                                alias_base, real_paths[0].replace("/*", "")
                            )

                            # Make it a relative path from the current file
                            target_path = os.path.abspath(
                                os.path.join(base_url, relative_path)
                            )
                            file_dir = os.path.dirname(js_file)

                            rel_path = os.path.relpath(target_path, file_dir)
                            if not rel_path.startswith("."):
                                rel_path = "./" + rel_path

                            new_content = new_content.replace(
                                f'"{import_path}"', f'"{rel_path}"'
                            )
                            resolved = True
                            break  # First match wins

                if new_content != content:
                    f.seek(0)
                    f.write(new_content)
                    f.truncate()
        log_step(status="Done")
    except Exception as e:
        log_step(status="Error")
        print(f"Error resolving TypeScript path aliases: {e}")
        return

    end_time = time.time()
    print(f"Build finished in {end_time - start_time:.2f}s")


if __name__ == "__main__":
    build()
