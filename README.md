# ComfyUI Storyboard

This custom node for ComfyUI provides a markdown renderer to display formatted text and notes within your workflow.

## Features

- **Markdown Rendering**: Write and display markdown content directly in your ComfyUI workflow.
- **Dynamic Inputs**: Connect text from other nodes to dynamically render markdown.
- **In-graph Editor**: Edit markdown content directly within the node when no input is connected.

# TypeScript Development Guide

This project now uses TypeScript for frontend development, following the same build mechanism as rgthree-comfy.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build the project:

   ```bash
   python __build__.py
   ```

## Project Structure

- `src_web/` - TypeScript source files
  - `nodes/` - Node-specific frontend code
  - `common/` - Shared utilities
  - `typings/` - TypeScript type definitions
  - `scripts_comfy/` - Dummy files for ComfyUI imports
- `web/` - Compiled JavaScript output (auto-generated)

## Development Workflow

1. Make changes to TypeScript files in `src_web/`
2. Run `python __build__.py` to compile
3. The build script will:
   - Copy non-TS files from `src_web/` to `web/`
   - Compile TypeScript files to JavaScript
   - Fix import paths for ComfyUI compatibility
   - Process any SCSS files (if present)

## TypeScript Configuration

The project uses:

- ES2019 target for compatibility
- ESNext modules
- Strict type checking (with `noImplicitAny` disabled for easier migration)
- Path mappings for ComfyUI types

## Adding New Files

1. Create new `.ts` files in `src_web/`
2. Import ComfyUI modules using:

   ```typescript
   import { app } from "scripts/app.js";
   import { ComfyWidgets } from "scripts/widgets.js";
   ```

3. Use the build script to compile

## Tips

- The build script supports `--fix` flag to automatically add `.js` extensions to imports
- Type definitions for ComfyUI are provided by `@comfyorg/litegraph` and `@comfyorg/comfyui-frontend-types`
- Custom type definitions can be added to `src_web/typings/index.d.ts`
