import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint, { parser, plugin } from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig(
    {
        files: ["**/*.ts"],
        languageOptions: {
            ecmaVersion: 15,
            parser: parser,
            parserOptions: {
                ecmaVersion: 15,
                sourceType: "module",
                project: "./tsconfig.json",
                tsconfigRootDir: __dirname
            }
        },
        plugins: {
            "@typescript-eslint": plugin,
            "@stylistic": stylistic
        },
        extends: [
            eslint.configs.recommended,
            tseslint.configs.recommended,
            tseslint.configs.recommendedTypeChecked
        ],
        rules: {
            "camelcase": ["warn", {
                "properties": "never",
                "ignoreImports": true
            }],
            "default-case": 1,
            "eqeqeq": ["warn", "smart"],
            "no-unreachable": 2,
            "no-useless-escape": 0,
            "sort-imports": ["warn", {
                "ignoreCase": false,
                "ignoreDeclarationSort": true
            }],
            "@stylistic/arrow-parens": ["warn", "always"],
            "@stylistic/brace-style": ["warn", "1tbs"],
            "@stylistic/comma-dangle": ["error", "never"],
            "@stylistic/comma-spacing": ["warn", {
                "after": true,
                "before": false
            }],
            "@stylistic/comma-style": ["warn", "last"],
            "@stylistic/eol-last": ["warn", "always"],
            "@stylistic/key-spacing": ["warn", {
                "mode": "strict"
            }],
            "@stylistic/keyword-spacing": ["warn", {
                "after": true,
                "before": true
            }],
            "@stylistic/no-extra-semi": 2,
            "@stylistic/no-multi-spaces": 1,
            "@stylistic/no-multiple-empty-lines": ["warn", {
                "max": 1
            }],
            "@stylistic/no-tabs": 1,
            "@stylistic/no-trailing-spaces": 1,
            "@stylistic/quotes": ["warn", "single", {
                "avoidEscape": false
            }],
            "@stylistic/semi": 2,
            "@stylistic/semi-style": ["warn", "last"],
            "@stylistic/member-delimiter-style": ["warn", {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "multilineDetection": "brackets"
            }],
            "@typescript-eslint/explicit-function-return-type": ["warn", {
                "allowExpressions": true
            }],
            "@typescript-eslint/no-floating-promises": ["error", {
                "ignoreVoid": false
            }],
            "@typescript-eslint/no-unused-vars": 2,
            "@typescript-eslint/no-unsafe-assignment": 0,
            "@typescript-eslint/no-unsafe-return": 0,
            "@typescript-eslint/no-misused-promises": 0,
            "@typescript-eslint/no-unsafe-argument": 0,
            "@typescript-eslint/no-unsafe-call": 0,
            "@typescript-eslint/no-unsafe-member-access": 0,
            "@typescript-eslint/no-base-to-string": 0,
            "@typescript-eslint/no-unnecessary-type-assertion": 0,
            "@typescript-eslint/no-unused-expressions": 0,
            "@typescript-eslint/no-unsafe-enum-comparison": 0
        }
    },
    {
        ignores: [
            "node_modules",
            "dist",
            "build",
            "*.js",
            ".test",
            "eslint.config.ts"
        ]
    }
);
