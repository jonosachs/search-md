export async function getUserDir(): Promise<{
  dir: string;
  files: string[];
}> {
  const result = await window.api.selectDirectory();
  return result;
}

export async function fetchMarkdownFile(
  dir: string,
  filename: string,
): Promise<string> {
  const content = await window.api.getMarkdown(dir, filename);
  return content;
}
