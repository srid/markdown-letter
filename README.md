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

- **MDX Components**: Quote, Callout with proper styling
- **Self-contained HTML**: No external dependencies
- **Email-ready**: Attach generated HTML files
- **Tailwind Styling**: Professional typography

## Components

```mdx
<Quote author="Name" source="Book" year="2024" link="https://...">
Quote text here.
</Quote>

<Callout type="info|warning|error|success" title="Title">
Callout content.
</Callout>
```

## Commands

- `just build` - Build example.mdx
- `just new "Title"` - Create new letter
- `just dev` - Full development workflow
- `just help` - List all commands

## Milestones

- ✅ **Milestone 1**: Core MDX → HTML conversion
- ⏳ **Milestone 2**: Twitter integration