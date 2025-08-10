This project is called "Markdown Letter". It enables the user to compose their email in a Markdown file, and generate a *self-contained* and single-file HTML out of it that is rendered nicely readability. The reader would then attach this HTML file when sending email to someone, who then will open the HTML file locally to view it. This enables the user to write big articles with footnotes and heading sections easily. 

# Milestones

## Milestone 1
Core functionality without Twitter integration:
- MDX to HTML conversion with custom components
- Tailwind CSS styling (inlined)
- Custom components for quotes, callouts, etc.
- Self-contained HTML output

## Milestone 2
Add Twitter integration:
- Tweet component that accepts X post URLs
- Scraper to fetch tweet content at build time
- Inline tweet rendering in generated HTML
- Thread support for connected tweets


