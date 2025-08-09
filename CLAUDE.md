# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```
Development server runs at `http://localhost:3000`

### Build for production
```bash
npm run build
```
Note: Build process copies `_md` folder to `.next` directory

### Start production server
```bash
npm start
```

### Run linting
```bash
npm run lint
```

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 13.4 with App Router
- **Styling**: SCSS/Sass with CSS Modules
- **Content**: Markdown files processed through unified/remark/rehype pipeline
- **Code Highlighting**: Shiki with rehype-pretty-code
- **Interactive Code**: CodeMirror integration for HTML/CSS/JS examples

### Project Structure

#### Content Management
- **Markdown Content**: Located in `_md/` directory, organized by book series (basecamp-, essentials-, pro-, etc.)
- **Book Metadata**: Each book folder contains a `bookInfo.js` defining book metadata and configuration
- **Images**: Public images in `public/images/` organized by book name

#### Routing Architecture
- **Dynamic Routes**: `[book-name]/[chapter]/[page]` structure for all book content
- **Book Types**: basecamp (기초), essentials (전공), pro/견고한 (심화), rightnow (실습형)
- **Each book route** has:
  - `layout.jsx`: Book-specific layout with metadata
  - `bookInfo.js`: Book configuration (title, author, chapters, etc.)
  - `[chapter]/page.jsx`: Chapter listing page
  - `[chapter]/[page]/page.jsx`: Individual content pages

#### Key Components
- **Main Page**: Home page with book filtering (all/solid/basecamp/essentials/etc) and search
- **Book Reader**: Dynamic markdown rendering with navigation, TOC, and bookmarks
- **Search**: Full-text search across all book content via API routes

#### Content Processing Pipeline
1. Markdown files are parsed using `gray-matter` for frontmatter
2. Processed through unified pipeline:
   - `remark-parse`: Parse markdown
   - `remark-gfm`: GitHub Flavored Markdown support
   - `remark-directive`: Custom directives
   - `remark-rehype`: Convert to HTML
   - `rehype-raw`: Allow raw HTML
   - `rehype-pretty-code`: Syntax highlighting with Shiki
3. Interactive code blocks replaced with CodeMirror editors for HTML/CSS/JS

#### State Management
- **SettingContext**: Global settings (theme, font size, etc.)
- **Local Storage**: User preferences and bookmarks

## Important Notes

- **DO NOT** run `npm audit fix --force` - it can break dependencies
- **Build Process**: The build command includes copying the `_md` folder to `.next`
- **Git Status**: Multiple image files are currently deleted/modified in git
- **Code Editor**: HTML/CSS/JS code blocks with specific formats are automatically converted to interactive CodeMirror editors