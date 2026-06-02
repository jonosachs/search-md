export {};

declare global {
  interface Window {
    api: {
      getMarkdown: () => Promise<string>;
    };
  }
}
