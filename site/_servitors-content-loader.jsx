// Merge content halves into the global module list
window.SERVITORS_MODULES = [
  ...(window.SERVITORS_CONTENT_1 || []),
  ...(window.SERVITORS_CONTENT_2 || []),
];
