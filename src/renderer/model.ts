import { type Token, type Tokens } from "marked";

export interface Section {
  heading: string | null;
  subsections: Subsection[] | null;
}

export interface Subsection {
  subheading: string | null;
  items: Item[] | null;
}

export interface Item {
  // Raw markdown
  text: string;
  // Tokens with formatting preserved,
  // required to rebuild after filtering
  tokens: Token[];
}

export function buildContentModelFromTokens(tokens: Token[]): Section[] {
  const combinedSections: Section[] = [];
  let currentSection: Section | null = null;

  for (const token of tokens) {
    // For marked token types:
    // @see https://github.com/markedjs/marked/blob/master/src/Tokens.ts
    if (token.type === "heading") {
      // h1 heading signals new section
      if (token.depth === 1) {
        // push the current section onto the stack
        if (currentSection) combinedSections.push(currentSection);
        // create new section with current heading
        currentSection = {
          heading: token.text,
          subsections: [{ subheading: null, items: [] }],
        };
        // h2 subheading
      } else if (token.depth >= 2) {
        currentSection?.subsections?.push({
          subheading: token.text,
          items: [],
        });
      }
      // list of line items
      // include the tokens so we can rebuild with formatting
    } else if (token.type === "list") {
      token.items.forEach((li: Tokens.ListItem) => {
        currentSection?.subsections?.at(-1)?.items?.push({
          text: li.text,
          tokens: li.tokens,
        });
      });
    }
  }
  if (currentSection) combinedSections.push(currentSection);
  return combinedSections;
}

// Possible Section shape:
// {
//   heading: "Data Types",
//   subsections: [
//     {
//       subheading: "Primitives",
//
//       items: ["match", "match"],
//     },
//     {
//       subheading: "Collections & Objects",
//       items: ["match", "match"],
//     },
//   ],
// };
export function filterContentModel(
  contentModel: Section[],
  query: string[],
): Section[] {
  const filteredResults: Section[] = [];

  for (const section of contentModel) {
    const heading = section.heading;

    if (matchFound(heading, query)) {
      filteredResults.push(section);
      continue;
    }

    const filteredSection: Section = { heading: heading, subsections: [] };

    for (const subsection of section.subsections) {
      const subheading = subsection.subheading;

      if (matchFound(subheading, query)) {
        filteredSection.subsections.push(subsection);
        continue;
      }

      const filteredItems = subsection.items.filter((li) =>
        matchFound(li.text, query),
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

function matchFound(element: string | null, query: string[]): boolean {
  if (!element) return false;

  const hasMatch = query.every((q) => element.toLowerCase().includes(q));

  return hasMatch;
}
