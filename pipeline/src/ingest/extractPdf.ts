import { PDFParse } from 'pdf-parse';

export interface PdfExtractionResult {
  text: string;
  pageCount: number;
}

export async function extractFromPdfBuffer(buffer: Buffer): Promise<PdfExtractionResult> {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return {
      text: (result.text || '').trim(),
      pageCount: result.total || 0,
    };
  } finally {
    await parser.destroy();
  }
}
