import "./styles.css";
import { marked, type Token } from "marked";
import { getUserDir as getUserDirOrDefault, fetchMarkdownFile } from "./io";
import {
  buildContentModelFromTokens,
  filterContentModel,
  Section,
} from "./model";

const { contentWindow, filesWindow, getDirBtn, userInput } = getDomElements();

let contentModel: Section[] | undefined = undefined;

// Load the default dir on startup
const DEFAULT_DIR = "/Documents/Study/Tech_Projects/Notes";
await selectDirOrLoadDefault(DEFAULT_DIR);

getDirBtn.addEventListener("click", async () => {
  await selectDirOrLoadDefault();
});

userInput.addEventListener("input", () => {
  handleUserInput(userInput.value);
});

async function handleFileClick(dir: string, filename: string) {
  const markdown = await fetchMarkdownFile(dir, filename);
  const { htmlText, tokens } = parseMdAsHtml(markdown);
  refreshPage(htmlText);

  contentModel = buildContentModelFromTokens(tokens);
}

function handleUserInput(input: string): void {
  if (!contentModel) return;

  const normalisedInput = input.toLowerCase().trim().split(/\s+/);
  const filteredModel = filterContentModel(contentModel, normalisedInput);
  const html = renderContentModelAsHtml(filteredModel);

  refreshPage(html);
}

function getDomElements() {
  const contentWindow = document.getElementById("content");
  const filesWindow = document.getElementById("files");
  const getDirBtn = document.getElementById("btn");
  const userInput = document.querySelector<HTMLInputElement>("#search");

  if (!contentWindow || !filesWindow || !getDirBtn || !userInput) {
    throw new Error("Couldn't get DOM elements");
  }

  return { contentWindow, filesWindow, getDirBtn, userInput };
}

async function selectDirOrLoadDefault(default_dir?: string) {
  const dirAndFiles = await getUserDirOrDefault(default_dir);
  if (!dirAndFiles) {
    return;
  }
  const { dir, files } = dirAndFiles;
  const filenames = renderFileNamesWithListeners(dir, files);
  refreshPage("");
  filesWindow.replaceChildren(filenames);
}

function renderFileNamesWithListeners(dir: string, files: string[]) {
  // Build content in offscreen DOM fragment
  const fragment = document.createDocumentFragment();

  // Render trimmed dir path text
  const dirTag = document.createElement("p");
  const dirText = `.../${dir.split("/").slice(-2).join("/")}`;
  dirTag.innerText = dirText;
  fragment.appendChild(dirTag);

  // Handle case of no .md files in dir
  if (files.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No md files found";
    fragment.appendChild(p);
    return fragment;
  }

  // Render each file name with listener
  for (const filename of files) {
    const li = document.createElement("li");
    li.textContent = filename;

    li.addEventListener("click", async () => {
      // Clear highlight from previous selection
      filesWindow.querySelector(".selected")?.classList.remove("selected");
      // Add highlight to new selection
      li.classList.add("selected");

      handleFileClick(dir, filename);
    });

    fragment.appendChild(li);
  }

  return fragment;
}

function parseMdAsHtml(md: string): {
  htmlText: string;
  tokens: Token[];
} {
  // The lexer takes a markdown string and calls the tokenizer functions.
  // @see https://marked.js.org/using_pro#lexer
  const tokens = marked.lexer(md);
  // 'async: false' narrows to string return value
  const htmlText = marked.parse(md, { async: false });

  if (!tokens || !htmlText) {
    throw Error("⚠️ No content!");
  }
  return { htmlText, tokens };
}

function renderContentModelAsHtml(filteredContent: Section[]) {
  const fragment = document.createDocumentFragment();

  for (const section of filteredContent) {
    const h1 = document.createElement("h1");
    h1.textContent = section.heading;
    fragment.appendChild(h1);

    for (const subsection of section.subsections) {
      if (subsection.subheading) {
        const h2 = document.createElement("h2");
        // Render raw markdown with inline formatting
        // elements e.g. <code> to preserve style using marked
        h2.innerHTML = marked.parseInline(subsection.subheading, {
          async: false,
        });
        fragment.appendChild(h2);
      }
      if (subsection.items) {
        const ul = document.createElement("ul");
        subsection.items.forEach((li) => {
          const item = document.createElement("li");
          // Parse the token with formatting using marked
          // parser: Token[] → HTML string
          item.innerHTML = marked.parser(li.tokens);
          ul.appendChild(item);
        });

        fragment.appendChild(ul);
      }
    }
  }
  return fragment;
}

function refreshPage(html: string | DocumentFragment) {
  if (typeof html === "string") {
    contentWindow.innerHTML = html;
    userInput.value = "";
  } else if (html instanceof DocumentFragment) {
    contentWindow.replaceChildren(html);
  } else throw new Error("Unexpected content type");
}
