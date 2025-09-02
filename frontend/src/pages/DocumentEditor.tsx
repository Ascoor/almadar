import React, { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import { PDFDocument } from 'pdf-lib';
import { Document, Packer, Paragraph } from 'docx';
import html2canvas from 'html2canvas';

export default function DocumentEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
    ],
    content: '<p>ابدأ الكتابة هنا...</p>',
  });

  useEffect(() => {
    if (!editor) return;
    const text = editor.getText();
    if (text.length > 200) {
      toast('يبدو أن المستند طويل، هل ترغب في تصديره إلى PDF؟');
    }
  }, [editor]);

  const exportPDF = async () => {
    const element = document.querySelector('.ProseMirror');
    if (!element) return;
    const canvas = await html2canvas(element as HTMLElement, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([canvas.width, canvas.height]);
    const pngImage = await pdfDoc.embedPng(imgData);
    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
    });
    const pdfBytes = await pdfDoc.save();
    saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), 'document.pdf');
    toast('تم تصدير المستند كـ PDF');
  };

  const exportDOCX = async () => {
    if (!editor) return;
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [new Paragraph(editor.getText())],
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'document.docx');
    toast('تم تصدير المستند كـ DOCX');
  };

  if (!editor) return null;

  return (
    <div className="p-4 space-y-4">
      <div className="space-x-2">
        <Button onClick={() => editor.chain().focus().toggleBold().run()}>
          غامق
        </Button>
        <Button onClick={() => editor.chain().focus().toggleItalic().run()}>
          مائل
        </Button>
        <Button onClick={() => editor.chain().focus().toggleUnderline().run()}>
          تسطير
        </Button>
        <Button onClick={exportPDF}>تصدير PDF</Button>
        <Button onClick={exportDOCX}>تصدير DOCX</Button>
      </div>
      <EditorContent editor={editor} className="min-h-[400px] border p-2" />
    </div>
  );
}
