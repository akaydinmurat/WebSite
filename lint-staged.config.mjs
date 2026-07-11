const lintStagedConfig = {
  "*.{js,mjs,cjs,ts,tsx,json,css,md,yml,yaml}": "prettier --write",
  "*.{js,mjs,cjs,ts,tsx}": "eslint --max-warnings=0",
};

export default lintStagedConfig;
