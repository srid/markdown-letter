#!/usr/bin/env node

import { readFile, writeFile, mkdir, watch } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { compile } from '@mdx-js/mdx';
import { renderToString } from 'react-dom/server';
import * as React from 'react';
import matter from 'gray-matter';
import { JSDOM } from 'jsdom';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { createServer } from 'http';
import { readFileSync, statSync } from 'fs';

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
  body: string,
  includeAutoRefresh: boolean = false
): string {
  const autoRefreshScript = includeAutoRefresh ? `
  <script>
    // Auto-refresh for development
    let lastModified = null;
    
    async function checkForUpdates() {
      try {
        const response = await fetch(window.location.href, { method: 'HEAD' });
        const modified = response.headers.get('last-modified');
        
        if (lastModified && modified && modified !== lastModified) {
          console.log('File updated, refreshing...');
          window.location.reload();
        }
        lastModified = modified;
      } catch (e) {
        // Ignore fetch errors in auto-refresh
      }
    }
    
    // Check for updates every 1 second
    setInterval(checkForUpdates, 1000);
    checkForUpdates();
  </script>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    ${css}
  </style>${autoRefreshScript}
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

async function buildHTML(inputPath: string, outputPath: string, includeAutoRefresh: boolean = false): Promise<void> {
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
    const html = createHTMLTemplate(title, css, bodyHTML, includeAutoRefresh);
    
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

function startDevServer(outputPath: string, port: number = 3000): void {
  const server = createServer((req, res) => {
    if (req.url === '/' || req.url === `/${basename(outputPath)}`) {
      try {
        const stats = statSync(outputPath);
        const content = readFileSync(outputPath, 'utf-8');
        
        res.writeHead(200, {
          'Content-Type': 'text/html',
          'Last-Modified': stats.mtime.toUTCString(),
          'Cache-Control': 'no-cache'
        });
        res.end(content);
      } catch (error) {
        res.writeHead(404);
        res.end('HTML file not found');
      }
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });
  
  server.listen(port, () => {
    console.log(`🌐 Dev server running at http://localhost:${port}`);
    console.log(`📄 View your letter at http://localhost:${port}/${basename(outputPath)}`);
  });
}

async function watchAndBuild(inputPath: string, outputPath: string): Promise<void> {
  console.log(`👀 Watching ${inputPath} for changes...`);
  
  // Initial build with auto-refresh enabled
  await buildHTML(inputPath, outputPath, true);
  
  // Start dev server
  startDevServer(outputPath);
  
  try {
    const watcher = watch(inputPath);
    
    for await (const event of watcher) {
      if (event.eventType === 'change') {
        console.log(`🔄 File changed, rebuilding...`);
        try {
          await buildHTML(inputPath, outputPath, true);
        } catch (error) {
          console.error('❌ Build failed:', error);
        }
      }
    }
  } catch (error) {
    console.error('❌ Watch error:', error);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const isWatch = args.includes('--watch');
  
  // Check for --input flag
  const inputIndex = args.findIndex(arg => arg === '--input');
  let inputPath: string;
  
  if (inputIndex !== -1 && args[inputIndex + 1]) {
    inputPath = args[inputIndex + 1];
  } else {
    inputPath = join(process.cwd(), 'example.mdx');
  }
  
  const filename = basename(inputPath, extname(inputPath));
  const outputPath = join(process.cwd(), 'dist', `${filename}.html`);
  
  if (isWatch) {
    await watchAndBuild(inputPath, outputPath);
  } else {
    await buildHTML(inputPath, outputPath);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}