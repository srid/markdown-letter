# Markdown Letter

Convert MDX to self-contained HTML for email attachments.

## Quick Start

```bash
# Setup (with direnv)
direnv allow
just install

# Create and build
just new "My Letter"
just build

# Open result
just open
```

## Features

- **MDX Components**: Quote with author-specific styling
- **Self-contained HTML**: No external dependencies
- **Email-ready**: Attach generated HTML files
- **Tailwind Styling**: Professional typography
- **Author Colors**: Unique color themes for different authors

## Components

### Quote

The Quote component supports author-specific color themes defined in `src/config/authors.json`:

```mdx
<Quote author="Daniel Kahneman" source="Thinking, Fast and Slow">
Quote text here.
</Quote>

<Quote author="Amos Tversky" source="Book Title" link="https://example.com">
Quote with clickable source link.
</Quote>
```

**Props:**
- `author` (optional): Author name - must match one defined in authors.json for custom styling
- `source` (optional): Book/article title
- `link` (optional): URL to make the source clickable

**Supported Authors:**
Current authors in config with unique color themes:
- Richard (amber/brown)
- Vineeto (green)

Authors not in the config will use the default gray theme.

**Adding New Authors:**
To add a new author, simply edit `src/config/authors.json` and add an entry like:
```json
{
  "AuthorName": {
    "color": "blue",
    "borderColor": "border-blue-600", 
    "bgColor": "bg-blue-50",
    "textColor": "text-blue-800"
  }
}
```
The build system automatically includes the color classes - no other files need to be modified.

## Commands

- `just build` - Build example.mdx
- `just watch` - Watch and rebuild example.mdx with auto-refresh server
- `just watch-file "file.mdx"` - Watch and rebuild a specific MDX file
- `just new "Title"` - Create new letter
- `just dev` - Full development workflow
- `just help` - List all commands

## Development

For live development with auto-refresh:

```bash
# Watch example.mdx and serve at http://localhost:3000
just watch

# Watch a specific file
just watch-file "my-letter.mdx"
```

The watch mode includes:
- Automatic rebuilding when MDX files change
- Development server at `http://localhost:3000`
- Auto-refresh in browser when files are updated
- Works with VSCode's built-in browser

## Milestones

- ✅ **Milestone 1**: Core MDX → HTML conversion
- ⏳ **Milestone 2**: Twitter integration