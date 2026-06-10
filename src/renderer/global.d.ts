export {};

declare global {
  interface Window {
    api: {
      getMarkdown: (dir: string, filename: string) => Promise<string>;
      selectDirectory: () => Promise<{ dir: string; files: string[] }>;
    };
  }
}
