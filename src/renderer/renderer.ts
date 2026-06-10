import "./styles.css";
import { marked, type Token, type Tokens } from "marked";

const { userInput, contentWindow, getDirBtn, filesWindow } = getDomElements();

run();

async function run() {
  getDirBtn.addEventListener("click", () => {
    loadFilesFromDir();
  });
}

async function loadFilesFromDir() {
  const targetDirPayload = await getTargetDirPayload();

  if (!targetDirPayload) {
    console.error("⚠️ No files found!");
    return;
  }

  const { dir, files } = targetDirPayload;
  const filenamesHtml = renderFileNames(dir, files);
  filesWindow.appendChild(filenamesHtml);
}

async function getTargetDirPayload() {
  const result = await window.api.getDirectory();

  if (result) {
    return result;
  }

  return null;
}

function renderFileNames(dir: string, files: string[]) {
  const fragment = document.createDocumentFragment();
  const dirTag = document.createElement("p");
  const dirText = `.../${dir.split("/").slice(-2).join("/")}`;
  dirTag.innerText = dirText;
  fragment.appendChild(dirTag);

  for (const filename of files) {
    const li = document.createElement("li");
    li.textContent = filename;

    // Make each filename load content when clicked by user
    li.addEventListener("click", async () => {
      // Clear highlight from previous selection
      filesWindow.querySelector(".selected")?.classList.remove("selected");
      // Add highlight to new selection
      li.classList.add("selected");
      // Load selected file content into window
      await loadFileContent(dir, filename);
    });

    fragment.appendChild(li);
  }

  return fragment;
}

async function loadFileContent(dir: string, filename: string) {
  const rawContent = await fetchMarkdownFile(dir, filename);
  const { html, lexed } = parseContent(rawContent);
  const contentModel = buildContentModel(lexed);

  refreshPage(html);

  userInput.addEventListener("input", () => {
    filterContentBasedOnUserInput(contentModel, html);
  });
}

async function fetchMarkdownFile(dir: string, filename: string) {
  const content = await window.api.getMarkdown(dir, filename);
  return content;
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

function filterContentBasedOnUserInput(contentModel: Section[], html: string) {
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

// Get DOM elements
function getDomElements() {
  const userInput = document.querySelector<HTMLInputElement>("#search");
  const contentWindow = document.getElementById("content");
  const getDirBtn = document.getElementById("btn");
  const filesWindow = document.getElementById("files");

  if (!userInput || !contentWindow || !getDirBtn || !filesWindow) {
    throw new Error("⚠️ DOM elements missing");
  }
  return { userInput, contentWindow, getDirBtn, filesWindow };
}

interface Section {
  heading: string | null;
  subsections: Subsection[] | null;
}

interface Subsection {
  subheading: string | null;
  items: string[] | null;
}

function buildContentModel(lexedContent: Token[]): Section[] {
  const combinedSections: Section[] = [];
  let currentSection: Section | null = null;

  for (const token of lexedContent) {
    // For marked token types:
    // @see https://github.com/markedjs/marked/blob/master/src/Tokens.ts
    if (token.type === "heading") {
      // h1 heading signals new section
      if (token.depth === 1) {
        // push the current section onto the stack
        if (currentSection) combinedSections.push(currentSection);
        // create new section with current heading
        currentSection = {
          heading: token.raw,
          subsections: [{ subheading: null, items: [] }],
        };
        // h2 subheading
      } else if (token.depth === 2) {
        if (currentSection?.subsections)
          currentSection.subsections.push({
            subheading: token.text,
            items: [],
          });
      }
      // list of line items
    } else if (token.type === "list") {
      token.items.forEach((li: Tokens.ListItem) => {
        if (currentSection?.subsections?.at(-1)?.items)
          currentSection.subsections.at(-1).items.push(li.text);
      });
    }
  }
  if (currentSection) combinedSections.push(currentSection);
  return combinedSections;
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

// Possible Section shape:
// {
//   heading: "Data Types",
//   subsections: [
//     {
//       subheading: "Primitives",
//       items: ["match", "match"],
//     },
//     {
//       subheading: "Collections & Objects",
//       items: ["match", "match"],
//     },
//   ],
// };

function filterContentModel(contentModel: Section[], query: string): Section[] {
  const filteredResults: Section[] = [];

  for (const section of contentModel) {
    const heading = section.heading;

    if (heading.toLowerCase().includes(query)) {
      filteredResults.push(section);
      continue;
    }

    const filteredSection: Section = { heading: heading, subsections: [] };

    for (const subsection of section.subsections) {
      const subheading = subsection.subheading;

      if (subheading?.toLowerCase().includes(query)) {
        filteredSection.subsections.push(subsection);
        continue;
      }

      const filteredItems = subsection.items.filter((li) =>
        li.toLowerCase().includes(query),
      );

      if (filteredItems.length > 0) {
        const filteredSubsection: Subsection = {
          subheading: subheading,
          items: filteredItems,
        };
        filteredSection.subsections.push(filteredSubsection);
      }
    }
    if (filteredSection.subsections.length > 0)
      filteredResults.push(filteredSection);
  }
  return filteredResults;
}

function refreshPage(html: string) {
  contentWindow.innerHTML = html;
}
