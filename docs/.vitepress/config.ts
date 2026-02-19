import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Prompt Searcher",
  description: "Official JavaScript / TypeScript SDK for the DAIMS API",
  base: "/prompt-searcher/",
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/quick-start" },
      { text: "API", link: "/api/client" },
    ],
    sidebar: [
      {
        text: "Guide",
        items: [{ text: "Quick Start", link: "/guide/quick-start" }],
      },
      {
        text: "API",
        items: [
          { text: "Client", link: "/api/client" },
          { text: "Errors", link: "/api/errors" },
        ],
      },
    ],
  },
});
