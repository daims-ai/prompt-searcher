---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'prompt-searcher'
  text: 'Official JavaScript SDK for DAIMS API'
  image:
    loading: eager
    fetchpriority: high
    decoding: async
    src: /logo.png
    alt:
  tagline: 'Simple AI prompt search and management'
  actions:
    - theme: brand
      text: Get Started
      link: /guide/quick-start
    - theme: alt
      text: View on Github
      link: https://github.com/daims-ai/prompt-searcher

features:
  - title: Simple API
    details: Easily interact with the DAIMS API using just two core methods — search and getPrompt.
  - title: Full TypeScript Support
    details: Provides robust type definitions for all requests and responses to enhance your development experience.
  - title: Flexible Search
    details: Supports various search types including keyword and semantic, making it easy to find the prompts you need.
  - title: Reliable Error Handling
    details: Handle and debug API errors consistently using DaimsApiError.
  - title: Lightweight Bundle
    details: Uses only the native fetch API with no external dependencies, keeping bundle size to a minimum.
  - title: Multi-Environment Support
    details: Works with Node.js 18+, Bun, Deno, and modern browsers.
---