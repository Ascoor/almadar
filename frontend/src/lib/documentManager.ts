import html2pdf from 'html2pdf.js';
import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver'; 
import JSZip from 'jszip';
import { DOMParser as XMLDOMParser } from 'xmldom';
 

export interface DocumentMetadata {
  title: string;
  author: string;
  createdAt: Date;
  modifiedAt: Date;
  wordCount: number;
  charCount: number;
}

export class DocumentManager {
  /**
   * Export document content as PDF
   */
  static async exportToPDF(content: string, title: string): Promise<void> {
    try {
      // Create a temporary container for PDF generation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      tempDiv.style.cssText = `
        font-family: 'Cairo', 'Amiri', 'Noto Naskh Arabic', sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: #1e293b;
        max-width: 800px;
        margin: 0 auto;
        padding: 40px;
        direction: auto;
      `;

      // Apply RTL styling to Arabic paragraphs
      const paragraphs = tempDiv.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
      paragraphs.forEach(p => {
        const text = p.textContent || '';
        const isArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
        if (isArabic) {
          (p as HTMLElement).style.direction = 'rtl';
          (p as HTMLElement).style.textAlign = 'right';
          (p as HTMLElement).style.fontFamily = "'Amiri', 'Cairo', 'Noto Naskh Arabic', serif";
        } else {
          (p as HTMLElement).style.direction = 'ltr';
          (p as HTMLElement).style.textAlign = 'left';
          (p as HTMLElement).style.fontFamily = "'Inter', sans-serif";
        }
      });

      document.body.appendChild(tempDiv);

      const options = {
        margin: [20, 20, 20, 20],
        filename: `${title}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          letterRendering: true,
          allowTaint: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        }
      };

      await html2pdf().from(tempDiv).set(options).save();
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('PDF export failed:', error);
      throw new Error('Failed to export PDF. Please try again.');
    }
  }

  /**
   * Export document content as DOCX
   */
  static async exportToDOCX(content: string, title: string): Promise<void> {
    try {
      // Parse HTML content and convert to DOCX structure
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;

      const children: any[] = [];
      const elements = tempDiv.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol, blockquote');

      elements.forEach(element => {
        const text = element.textContent || '';
        if (!text.trim()) return;

        const isArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
        
        const textRun = new TextRun({
          text: text,
          font: isArabic ? 'Amiri' : 'Calibri',
          size: element.tagName.startsWith('H') ? 24 : 22,
        });

        let paragraph: Paragraph;

        switch (element.tagName.toLowerCase()) {
          case 'h1':
            paragraph = new Paragraph({
              children: [textRun],
              heading: HeadingLevel.HEADING_1,
              alignment: isArabic ? 'right' : 'left',
            });
            break;
          case 'h2':
            paragraph = new Paragraph({
              children: [textRun],
              heading: HeadingLevel.HEADING_2,
              alignment: isArabic ? 'right' : 'left',
            });
            break;
          case 'h3':
            paragraph = new Paragraph({
              children: [textRun],
              heading: HeadingLevel.HEADING_3,
              alignment: isArabic ? 'right' : 'left',
            });
            break;
          default:
            paragraph = new Paragraph({
              children: [textRun],
              alignment: isArabic ? 'right' : 'left',
            });
        }

        children.push(paragraph);
      });

      const doc = new Document({
        sections: [{
          properties: {},
          children: children.length > 0 ? children : [
            new Paragraph({
              children: [new TextRun("Empty document")],
            }),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${title}.docx`);
    } catch (error) {
      console.error('DOCX export failed:', error);
      throw new Error('Failed to export DOCX. Please try again.');
    }
  }

  /** 
   * Extract frame paragraphs from a DOCX file and return HTML with inline styles
   */
  private static async parseDocxWithFrames(arrayBuffer: ArrayBuffer): Promise<string> {
    const zip = await JSZip.loadAsync(arrayBuffer);
    const xml = await zip.file('word/document.xml')?.async('string');
    if (!xml) return '';

    const doc = new XMLDOMParser().parseFromString(xml, 'application/xml');
    const paragraphs = Array.from(doc.getElementsByTagName('w:p'));

    return paragraphs
      .map(p => {
        const frame = p.getElementsByTagName('w:framePr')[0];
        const text = Array.from(p.getElementsByTagName('w:t'))
          .map(t => t.textContent)
          .join('');
        const style = frame
          ? `border:1px solid #000;width:${frame.getAttribute('w:w') || 'auto'}pt;`
          : '';
        return `<p style="${style}">${text}</p>`;
      })
      .join('');
  }

  /** 
   * Import DOCX file and convert to HTML
   */
  static async importFromDOCX(file: File): Promise<{ content: string; metadata: Partial<DocumentMetadata> }> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
 
      let content = result.value;
      const warnings = result.messages;

 
      if (warnings.length > 0) {
        console.warn('DOCX import warnings:', warnings);
      }
 
      // Merge frame styles into converted HTML
      try {
        const frameHtml = await this.parseDocxWithFrames(arrayBuffer);
        if (frameHtml) {
          const frameContainer = document.createElement('div');
          frameContainer.innerHTML = frameHtml;
          const frameParagraphs = Array.from(frameContainer.querySelectorAll('p'));

          const contentContainer = document.createElement('div');
          contentContainer.innerHTML = content;
          const contentParagraphs = Array.from(contentContainer.querySelectorAll('p'));

          frameParagraphs.forEach((fp, idx) => {
            const style = fp.getAttribute('style');
            if (style && style.trim() && contentParagraphs[idx]) {
              const existing = contentParagraphs[idx].getAttribute('style');
              contentParagraphs[idx].setAttribute('style', `${existing ? existing + ';' : ''}${style}`);
            }
          });

          content = contentContainer.innerHTML;
        }
      } catch (frameError) {
        console.warn('Frame extraction failed:', frameError);
      }

 
      // Extract basic metadata
      const metadata: Partial<DocumentMetadata> = {
        title: file.name.replace('.docx', ''),
        modifiedAt: new Date(file.lastModified),
        // Word count will be calculated by the editor
      };

      return { content, metadata };
    } catch (error) {
      console.error('DOCX import failed:', error);
      throw new Error('Failed to import DOCX file. Please ensure it\'s a valid document.');
    }
  }

  /**
   * Save document draft to localStorage with metadata
   */
  static saveDraft(content: string, title: string, metadata: Partial<DocumentMetadata>): void {
    try {
      const draft = {
        content,
        title,
        metadata: {
          ...metadata,
          modifiedAt: new Date(),
        },
        timestamp: Date.now(),
      };

      localStorage.setItem('inkwell-draft', JSON.stringify(draft));
      localStorage.setItem('inkwell-last-save', new Date().toISOString());
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }

  /**
   * Load document draft from localStorage
   */
  static loadDraft(): { content: string; title: string; metadata: Partial<DocumentMetadata> } | null {
    try {
      const draftStr = localStorage.getItem('inkwell-draft');
      if (!draftStr) return null;

      const draft = JSON.parse(draftStr);
      return {
        content: draft.content || '',
        title: draft.title || 'مستند جديد - New Document',
        metadata: draft.metadata || {},
      };
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  }

  /**
   * Clear saved draft
   */
  static clearDraft(): void {
    localStorage.removeItem('inkwell-draft');
    localStorage.removeItem('inkwell-last-save');
  }

  /**
   * Get last save timestamp
   */
  static getLastSaveTime(): Date | null {
    try {
      const timestamp = localStorage.getItem('inkwell-last-save');
      return timestamp ? new Date(timestamp) : null;
    } catch {
      return null;
    }
  } 
} 
