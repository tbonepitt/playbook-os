import type { SourceAdapter, ValidationResult, RawSource } from './types'

/**
 * PDF adapter stub.
 *
 * Full PDF extraction requires a file upload (binary content), which cannot be
 * handled via a URL alone. validate() always returns valid because we cannot
 * inspect the file without downloading it. fetch() returns a placeholder that
 * signals to the caller that a server-side file-upload flow is needed.
 *
 * Replace fetch() with a real implementation (e.g. pdf-parse or a cloud
 * extraction service) once the file-upload API route is in place.
 */
export const pdfAdapter: SourceAdapter = {
  async validate(_url: string): Promise<ValidationResult> {
    // We cannot validate a PDF without downloading and parsing the binary, so
    // we optimistically accept all URLs and let the fetch step surface errors.
    return { valid: true }
  },

  async fetch(source: { url: string; name: string }): Promise<RawSource> {
    return {
      text: [
        `[PDF extraction placeholder for "${source.name}"]`,
        '',
        'Full PDF text extraction requires a file upload rather than a URL fetch.',
        'Please upload the PDF file through the source intake API, which will run',
        'server-side extraction (e.g. pdf-parse or a cloud OCR service) and store',
        'the resulting text before this pipeline stage is invoked.',
        '',
        `Source URL recorded: ${source.url}`,
      ].join('\n'),
      metadata: {
        url: source.url,
        name: source.name,
        type: 'pdf',
        status: 'placeholder',
        fetchedAt: new Date().toISOString(),
      },
    }
  },
}
