export {};

declare global {
  interface Window {
    api: {
      getMarkdown: (dir: string, filename: string) => Promise<string>;
      getDirectory: () => Promise<{ dir: string; files: string[] } | null>;
    };
  }
}
