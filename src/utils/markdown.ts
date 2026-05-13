import { marked } from 'marked'

let markedConfigured = false

function ensureMarkedForProse(): void {
  if (markedConfigured) return
  markedConfigured = true
  marked.use({
    breaks: true,
  })
}

/**
 * CommonMark collapses multiple blank lines into a single paragraph break.
 * Replace 3+ consecutive newlines with an explicit spacer paragraph so you get
 * a visible gap between blocks in rendered HTML.
 */
export function preprocessMarkdownBlankLines(text: string): string {
  return text.replace(/\n{3,}/g, '\n\n&nbsp;\n\n')
}

/** Markdown → HTML for project copy (section text, descriptions, etc.). */
export async function renderMarkdown(text: string): Promise<string> {
  ensureMarkedForProse()
  const src = preprocessMarkdownBlankLines(text)
  const out = await Promise.resolve(marked(src))
  return typeof out === 'string' ? out : String(out)
}
