import "./styles.css";
import { marked } from "marked";

// Get DOM elements
const search = document.querySelector<HTMLInputElement>("#search");
const noContent = document.getElementById("nocontent");
const content = document.getElementById("content");

if (!search || !noContent || !content) {
  throw new Error("⚠️ DOM elements missing");
}

// Parse markdown document
const text = await window.api.getMarkdown();
const md = await marked.parse(text);

if (!md) {
  console.error("Non content!");
}

// Create static view for redrawing
const staticContent = document.createElement("div");
staticContent.innerHTML = md;

redraw(content);

// Hide no content msg
toggleNoContentMsg(noContent);

search.addEventListener("input", () => {
  filterResults();
});

function buildSection() {}

const filterResults = () => {
  toggleNoContentMsg(noContent);
  redraw(content);
  // Get user input
  const query = search.value.trim().toLowerCase();

  // Only start filtering from 2 chars of input (pseudo-debounce)
  if (query.length < 2) {
    return;
  }

  const output = document.createDocumentFragment();
  const currentSection = document.createDocumentFragment();
  let h1 = null;
  let h2 = null;

  const html = Array.from(content.children);

  for (const line of html) {
    if (line.matches("h1")) {
      // h1 designates start of new block
      // If the previous block has children, append it to result
      // (appending should remove the elements from block, freeing it
      // for the next new block)
      if (currentSection.hasChildNodes()) {
        output.append(currentSection);
      }

      h1 = line;
      h2 = null;
    }
    if (line.matches("h2")) {
      h2 = line;
    }
    if (line.matches("ul")) {
      const lis = Array.from(line.querySelectorAll("li"));

      const lisMatching = lis.filter((li) =>
        (li.textContent ?? "").toLowerCase().includes(query),
      );

      // If there are li's that include the query, append these
      // and the trailing headers
      if (lisMatching.length > 0) {
        if (h1) {
          currentSection.appendChild(h1);
          h1 = null;
        }
        if (h2) {
          currentSection.appendChild(h2);
          h2 = null;
        }
        lisMatching.forEach((li) => currentSection.appendChild(li));
      } else {
        // Otherwise check if the headers include the query and append
        // these if so
        if (h1 && (h1.textContent ?? "").toLowerCase().includes(query)) {
          currentSection.appendChild(h1);
          h1 = null;
        }
        if (h2 && (h2.textContent ?? "").toLowerCase().includes(query)) {
          currentSection.appendChild(h2);
          h2 = null;
        }
      }
    }
  }

  content.replaceChildren(output);
  if (content.innerHTML.length === 0) {
    toggleNoContentMsg(content);
  }
};

function toggleNoContentMsg(noContent: HTMLElement) {
  noContent.classList.toggle("hidden");
}

function redraw(content: HTMLElement) {
  content.replaceChildren(staticContent);
}
