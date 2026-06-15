export {};

declare global {
  interface Window {
    api: {
      getMarkdown: (dir: string, filename: string) => Promise<string>;
      selectDirectory: (
        default_dir?: string,
      ) => Promise<{ dir: string; files: string[] }>;
    };
  }
}
