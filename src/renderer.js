/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";
import { marked } from "marked";

// Get DOM elements
const search = document.getElementById("search");
const noContent = document.getElementById("nocontent");
const content = document.getElementById("content");

// Parse markdown document and display in DOM
const text = await window.api.getMarkdown();
const md = marked.parse(text);

if (!md) {
  console.error("Non content!");
}

content.innerHTML = md;

// Hide no content msg
noContent.style.display = "none";

search.addEventListener("input", () => {
  filterResults();
});

function filterResults() {
  // Hide no content msg
  noContent.style.display = "none";
  // Reset content
  content.innerHTML = md;
  // Get user input
  const query = search.value.trim().toLowerCase();

  // Only start filtering from 2 chars of input (pseudo-debounce)
  if (!query || query.length < 2) {
    return;
  }
  const result = document.createDocumentFragment();
  const block = document.createDocumentFragment();
  let lis_matching = null;
  let h1 = null;
  let h2 = null;

  const html = Array.from(content.children);

  for (let line of html) {
    if (line.matches("h1")) {
      // h1 designates start of new block
      // If the previous block has children, append it to result
      // (appending should remove the elements from block, freeing it
      // for the next new block)
      if (block.hasChildNodes()) {
        result.append(block);
      }

      h1 = line;
      h2 = null;
    }
    if (line.matches("h2")) {
      h2 = line;
    }
    if (line.matches("ul")) {
      const lis = Array.from(line.querySelectorAll("li"));

      lis_matching = lis.filter((li) =>
        li.textContent.toLowerCase().includes(query),
      );

      // If there are li's that include the query, append these
      // and the trailing headers
      if (lis_matching.length > 0) {
        if (h1) {
          block.appendChild(h1);
          h1 = null;
        }
        if (h2) {
          block.appendChild(h2);
          h2 = null;
        }
        lis_matching.forEach((li) => block.appendChild(li));
      } else {
        // Otherwise check if the headers include the query and append
        // these if so
        if (h1 && h1.textContent.toLowerCase().includes(query)) {
          block.appendChild(h1);
          h1 = null;
        }
        if (h2 && h2.textContent.toLowerCase().includes(query)) {
          block.appendChild(h2);
          h2 = null;
        }
      }
    }
  }
  content.replaceChildren(result);
  if (content.innerHTML.length === 0) {
    noContent.style.display = "";
  }
}
