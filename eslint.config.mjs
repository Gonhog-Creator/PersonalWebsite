import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      // Ignore all JS, TS, and TSX files by default
      "**/*.js",
      "**/*.ts",
      "**/*.tsx",
      
      // But don't ignore files in the src directory
      "!src/**/*.tsx",
      "!src/**/*.ts"
    ]
  }
];

export default eslintConfig;
