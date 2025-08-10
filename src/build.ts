#!/usr/bin/env node

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { compile } from '@mdx-js/mdx';
import { renderToString } from 'react-dom/server';
import * as React from 'react';
import matter from 'gray-matter';
import { JSDOM } from 'jsdom';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Import components
import { Quote } from './components/index.js';

interface FrontMatter {
  title?: string;
  author?: string;
  date?: string;
  description?: string;
}

const mdxComponents = {
  Quote,
};

async function buildCSS(): Promise<string> {
  const css = await readFile(join(process.cwd(), 'src/styles/main.css'), 'utf-8');
  
  const result = await postcss([
    tailwindcss(),
    autoprefixer(),
  ]).process(css, {
    from: 'src/styles/main.css',
    to: undefined,
  });
  
  return result.css;
}


function createHTMLTemplate(
  title: string,
  css: string,
  body: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    ${css}
  </style>
</head>
<body>
  <div class="letter-container">
    <main class="letter-content">
      ${body}
    </main>
  </div>
</body>
</html>`;
}

async function buildHTML(inputPath: string, outputPath: string): Promise<void> {
  try {
    // Read and parse MDX file
    const mdxSource = await readFile(inputPath, 'utf-8');
    const { data: frontMatter, content } = matter(mdxSource);
    
    // Use a simpler approach with run function
    const { run } = await import('@mdx-js/mdx');
    
    // Compile MDX
    const compiledMDX = await compile(content, {
      outputFormat: 'function-body',
      development: false,
    });
    
    // Import jsx runtime for MDX
    const { jsx, jsxs } = await import('react/jsx-runtime');
    
    // Run the MDX with proper runtime
    const { default: MDXComponent } = await run(compiledMDX, {
      ...React,
      jsx,
      jsxs,
      Fragment: React.Fragment,
    });
    
    // Render to HTML string with components passed as props
    const bodyHTML = renderToString(
      React.createElement(MDXComponent, { components: mdxComponents })
    );
    
    // Build CSS
    const css = await buildCSS();
    
    // Create final HTML
    const title = basename(inputPath, extname(inputPath));
    const html = createHTMLTemplate(title, css, bodyHTML);
    
    // Ensure output directory exists
    await mkdir(dirname(outputPath), { recursive: true });
    
    // Write output file
    await writeFile(outputPath, html, 'utf-8');
    
    console.log(`✅ Built: ${inputPath} → ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error building ${inputPath}:`, error);
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const isWatch = args.includes('--watch');
  
  if (isWatch) {
    console.log('👀 Watch mode not implemented yet. Run without --watch for now.');
    return;
  }
  
  // Default: build example.mdx if it exists
  const inputPath = join(process.cwd(), 'example.mdx');
  const outputPath = join(process.cwd(), 'dist', 'example.html');
  
  await buildHTML(inputPath, outputPath);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}