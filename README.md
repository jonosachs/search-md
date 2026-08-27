# SearchMD

SearchMD is a desktop Electron app for browsing and searching local Markdown
notes.

It opens a directory of `.md` files, renders the selected file as HTML, and lets
you filter the visible content with a search query.

## Features

- Select a local directory containing Markdown files.
- List all `.md` files in the selected directory.
- Render Markdown content in the main window.
- Search headings, subheadings, and list items.
- Preserve Markdown formatting in filtered results, including inline
  `code` spans, emphasis, and fenced code blocks.
- Package the app with Electron Forge.

## Tech Stack

- Electron
- TypeScript
- Marked for Markdown parsing
- Electron Forge and Webpack

## Requirements

- Node.js
- npm

## Getting Started

Install dependencies:

```bash
npm install
```

Start the app in development:

```bash
npm start
```

By default, the app tries to open:

```text
~/Documents/Study/Tech_Projects/Notes
```

Use the **Select dir..** button to choose a different folder.

## Usage

1. Start the app.
2. Select a directory containing `.md` files.
3. Click a file in the sidebar to render it.
4. Type in the search box to filter matching sections.

## Build

Create a packaged app:

```bash
npm run package
```

On macOS, the packaged `.app` can be moved into `/Applications`.

## Scripts

```bash
npm start
```

Runs the Electron app in development mode.

```bash
npm run package
```

Packages the app with Electron Forge.

```bash
npm run make
```

Creates distributable installers/packages using the configured Forge makers.

```bash
npm run lint
```

Runs ESLint against the TypeScript source files.

## Project Structure

```text
src/
  main/       Electron main process
  preload/    Safe IPC bridge exposed to the renderer
  renderer/   UI, Markdown parsing, filtering, and styles
assets/       App icons and screenshots
```

Key files:

- `src/main/main.ts` handles the Electron window, file reads, and directory
  selection.
- `src/preload/preload.ts` exposes the IPC API used by the renderer.
- `src/renderer/renderer.ts` handles UI events, Markdown parsing, and rendering.
- `src/renderer/model.ts` builds the searchable content model.
- `src/renderer/io.ts` wraps the preload IPC calls used to read directories
  and files.
- `src/renderer/styles.css` contains the app styling.

## Search Behaviour

Search is currently model-based rather than full-text. The content model keeps:

- level 1 headings as sections
- level 2+ headings as subsections
- list items as searchable content

A query is split on whitespace and an entry matches only if it contains every
word, case-insensitively. Matching a heading or subheading keeps the whole
section or subsection; otherwise only the matching list items are kept.

Standalone paragraphs and top-level code blocks are rendered in the full
document view, but they are not currently included in filtered search results.
Fenced code blocks indented under a list item are part of that item, so they
are kept and rendered with it.

### How formatting is preserved

The full document view renders with `marked.parse()`. The filtered view cannot
reuse that output, because filtering happens on the model rather than on the
HTML. Each list item therefore stores two representations:

- `text` — the raw Markdown source, which the search matches against
- `tokens` — the tokens Marked produced while lexing the file

Filtering compares against `text`, and rendering rebuilds the HTML with
`marked.parser(tokens)`. Keeping the tokens means the item is lexed once per
file rather than on every keystroke, and block-level constructs such as fenced
code blocks survive the round trip. Rendering from `text` alone would lose them,
since inline parsing does not recognise block syntax.
