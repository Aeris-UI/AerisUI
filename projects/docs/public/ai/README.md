# Aeris AI documentation

This directory contains the canonical machine-readable Aeris documentation. It is generated from
the documentation application's existing source data; it is not a second hand-maintained copy.

- `/llms.txt` is the concise discovery index following the llms.txt Markdown convention.
- `/llms-full.txt` combines all guides and component references into one context file.
- `22/components/*.md` contains focused, copy-ready component documentation.
- `22/aeris-docs.json` contains the structured Angular 22 Aeris corpus.
- `schema/aeris-docs.schema.v1.json` defines schema version 1.

The generated formats include package metadata, installation and design guides, every component's
secondary entry point, documented API groups, interfaces, design tokens, accessibility guidance,
keyboard support, and complete copy-ready example source files.

Run `npm run generate:ai-docs` to regenerate it and `npm run check:ai-docs` to validate both the
schema contract and source synchronization. Generated JSON must not be edited manually.
