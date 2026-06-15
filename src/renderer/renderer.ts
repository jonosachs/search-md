import "./styles.css";
import { marked, type Token } from "marked";
import { getUserDir, fetchMarkdownFile } from "./io";
import { buildContentModel, filterContentModel, Section } from "./model";

const { contentWindow, filesWindow, getDirBtn, userInput } = getDomElements();

const DEFAULT_DIR = "/Documents/Study/Tech_Projects/Notes";
await selectDir(DEFAULT_DIR);

getDirBtn.addEventListener("click", async () => {
  await selectDir();
});

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

async function selectDir(default_dir?: string) {
  const response = await getUserDir(default_dir);
  if (!response) {
    return;
  }
  const { dir, files } = response;
  const filenames = renderFileNamesWithListeners(dir, files);
  refreshPage("");
  filesWindow.replaceChildren(filenames);
}

async function handleFileClick(dir: string, filename: string) {
  const fileContent = await fetchMarkdownFile(dir, filename);
  const { html, lexed } = parseContent(fileContent);
  const contentModel = buildContentModel(lexed);

  refreshPage(html);

  userInput?.addEventListener("input", () => {
    filterContentOnUserInput(contentModel, html);
  });
}

function renderFileNamesWithListeners(dir: string, files: string[]) {
  const fragment = document.createDocumentFragment();
  const dirTag = document.createElement("p");
  // Shorten long filenames
  const dirText = `.../${dir.split("/").slice(-2).join("/")}`;
  dirTag.innerText = dirText;
  fragment.appendChild(dirTag);

  if (files.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No md files found";
    fragment.appendChild(p);
    return fragment;
  }

  for (const filename of files) {
    const li = document.createElement("li");
    li.textContent = filename;
    // Make each filename load content when clicked by user
    li.addEventListener("click", async () => {
      // Clear highlight from previous selection
      filesWindow.querySelector(".selected")?.classList.remove("selected");
      // Add highlight to new selection
      li.classList.add("selected");
      await handleFileClick(dir, filename);
    });

    fragment.appendChild(li);
  }

  return fragment;
}

function parseContent(md: string): {
  html: string;
  lexed: Token[];
} {
  // The lexer takes a markdown string and calls the tokenizer functions.
  // @see https://marked.js.org/using_pro#lexer
  const lexed = marked.lexer(md);
  // async: false narrows to string return value
  const html = marked.parse(md, { async: false });

  if (!lexed || !html) {
    throw Error("⚠️ No content!");
  }
  return { html, lexed };
}

function filterContentOnUserInput(contentModel: Section[], html: string) {
  // toggleNoContentMsg(noContentMsg);
  refreshPage(html);

  const normalisedUserInput = userInput.value.trim().toLowerCase();
  // Only start filtering from 2 chars of input (pseudo-debounce)
  if (normalisedUserInput.length < 2) {
    return null;
  }

  const filteredContent = filterContentModel(contentModel, normalisedUserInput);
  if (filteredContent) {
    const filteredContentAsHtml = renderFilteredContent(filteredContent);
    contentWindow.replaceChildren(filteredContentAsHtml);
  }
}

function renderFilteredContent(filteredContent: Section[]) {
  const fragment = document.createDocumentFragment();

  for (const section of filteredContent) {
    const h1 = document.createElement("h1");
    h1.textContent = section.heading;
    fragment.appendChild(h1);

    for (const subsection of section.subsections) {
      if (subsection.subheading) {
        const h2 = document.createElement("h2");
        h2.innerHTML = subsection.subheading;
        fragment.appendChild(h2);
      }
      if (subsection.items) {
        const ul = document.createElement("ul");
        subsection.items.forEach((li) => {
          const item = document.createElement("li");
          item.innerHTML = li;
          ul.appendChild(item);
        });

        fragment.appendChild(ul);
      }
    }
  }
  return fragment;
}

function refreshPage(html: string) {
  contentWindow.innerHTML = html;
}
