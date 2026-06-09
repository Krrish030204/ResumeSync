import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function extractPdfText(fileBuffer: ArrayBuffer): Promise<string> {
  // Dynamically import pdfjs-dist to avoid SSR DOMMatrix error
  const pdfjsLib = await import("pdfjs-dist");
  
  // Set worker source to CDN to avoid Next.js build issues with binary workers
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
  const pdf = await loadingTask.promise;
  
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    fullText += pageText + "\n";
  }
  
  return fullText;
}

