# Markdown Letter - Common Workflows

# List available commands
default:
    @just --list

# Install dependencies
install:
    npm install

# Type check the project
typecheck:
    npm run typecheck

# Lint the code
lint:
    npm run lint

# Format the code
format:
    npm run format

# Build example.mdx to HTML
build:
    npm run build

# Watch and rebuild example.mdx on changes
watch:
    npm run dev

# Build a specific MDX file
build-file file:
    npx tsx src/build.ts --input {{file}}

# Watch and rebuild a specific MDX file
watch-file file:
    npx tsx src/build.ts --input {{file}} --watch

# Clean build artifacts
clean:
    rm -rf dist/

# Development workflow: format, lint, typecheck, build
dev: format lint typecheck build

# Create a new MDX letter from template
new name:
    @echo "Creating new letter: {{name}}.mdx"
    @cat > {{name}}.mdx << 'EOF'
    ---
    title: "{{name}}"
    author: "Your Name"
    date: "$(date +%Y-%m-%d)"
    description: "Brief description"
    ---
    
    # Introduction
    
    Your content here...
    
    <Quote author="Author Name" source="Source" year="2024">
    Your quote here.
    </Quote>
    
    <Callout type="info" title="Note">
    Your callout content here.
    </Callout>
    EOF

# Open the generated HTML file in browser
open file="example":
    @if [ -f "dist/{{file}}.html" ]; then \
        echo "Opening dist/{{file}}.html"; \
        xdg-open "dist/{{file}}.html" 2>/dev/null || open "dist/{{file}}.html" 2>/dev/null || echo "Could not open browser"; \
    else \
        echo "File dist/{{file}}.html not found. Run 'just build' first."; \
    fi

# Show file size of generated HTML
size file="example":
    @if [ -f "dist/{{file}}.html" ]; then \
        ls -lh "dist/{{file}}.html" | awk '{print "Generated HTML size: " $5}'; \
        echo "Self-contained: $(grep -c 'http' dist/{{file}}.html || echo 0) external links"; \
    else \
        echo "File dist/{{file}}.html not found"; \
    fi

# Preview available commands
help:
    @just --list
