---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'prompt-searcher'
  text: 'DAIMS API를 위한 공식 JavaScript SDK'
  image:
    loading: eager
    fetchpriority: high
    decoding: async
    src: /logo.png
    alt:
  tagline: 'AI 프롬프트 검색과 관리를 간편하게'
  actions:
    - theme: brand
      text: 시작하기
      link: /guide/quick-start
    - theme: alt
      text: API 레퍼런스
      link: /api/client

features:
  - title: 간편한 API
    details: search와 getPrompt 두 가지 핵심 메서드로 DAIMS API를 손쉽게 사용할 수 있어요.
  - title: 완벽한 TypeScript 지원
    details: 모든 요청과 응답에 대해 견고한 타입 정의를 제공하여 개발 경험을 향상시켜요.
  - title: 유연한 검색
    details: 키워드, 시맨틱 등 다양한 검색 타입을 지원하여 원하는 프롬프트를 쉽게 찾을 수 있어요.
  - title: 안정적인 에러 처리
    details: DaimsApiError를 통해 API 오류를 일관되게 처리하고 디버깅할 수 있어요.
  - title: 가벼운 번들 사이즈
    details: 외부 의존성 없이 순수 fetch API만 사용하여 번들 크기를 최소화했어요.
  - title: 다양한 환경 지원
    details: Node.js 18+, Bun, Deno 및 모던 브라우저에서 사용할 수 있어요.
---