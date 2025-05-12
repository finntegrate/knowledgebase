# Contributing to Finntegrate Knowledge Base

Thank you for your interest in contributing to our knowledge base! This document provides guidelines and instructions for contributing to this project.

## Project Overview

This is a knowledge base for the Finntegrate project built with [Astro](https://astro.build/) and [Starlight](https://starlight.astro.build/).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (recommended latest LTS version)
- [pnpm](https://pnpm.io/) package manager

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/Finntegrate/knowledgebase.git
   cd knowledgebase
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Run the development server
   ```bash
   pnpm run dev
   ```

4. Open your browser and navigate to `http://localhost:4321` to see the site

## Development Workflow

1. Create a new branch for your changes
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes to the documentation or code

3. Preview your changes locally with:
   ```bash
   pnpm run dev
   ```

4. Commit your changes
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

5. Push your branch and create a pull request

## Content Guidelines

- All documentation should be written in Markdown or MDX format
- Place new documentation in the appropriate subfolder within `src/content/docs/`
- Include descriptive frontmatter with appropriate title, description, and other metadata
- Follow the existing structure and formatting to maintain consistency

## Code Contributions

- Code contributions should follow the project's code style and architecture
- All code is licensed under the MIT License
- Make sure your code changes don't break existing functionality

## Documentation Contributions

- Documentation and other content are licensed under CC-BY-4.0
- Always provide proper attribution when including content from other sources
- Be clear, concise, and comprehensive in your explanations

## License Information

This repository uses a dual licensing approach:

- **Code**: Licensed under the [MIT License](LICENSE)
- **Content**: Licensed under the [Creative Commons Attribution 4.0 International License (CC-BY-4.0)](LICENSE-content)

## Need Help?

If you have questions or need assistance, please open an issue in the repository or contact the project maintainers.

Thank you for contributing to the Finntegrate knowledge base!
