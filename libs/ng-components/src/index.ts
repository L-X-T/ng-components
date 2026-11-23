// The root entry point exports nothing on purpose: every component lives in
// its own secondary entry point (`@agentic-software/ng-components/button`,
// `/core`, …), so an app only pulls in what it imports. The global styles ship
// as Sass under `@agentic-software/ng-components/styles`.
export {};
