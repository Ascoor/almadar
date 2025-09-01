import React, { useRef, useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph } from 'docx';
import { useLanguage } from '@/context/LanguageContext';

export default function DocumentEditor() {
  const { dir, t } = useLanguage();
  const quillRef = useRef(null);
  const [value, setValue] = useState('');
  const [contentDir, setContentDir] = useState(dir);

  useEffect(() => {
    setContentDir(dir);
  }, [dir]);

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.root.setAttribute('dir', contentDir);
    }
  }, [contentDir]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }, { direction: 'rtl' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'color', 'background',
    'script', 'list', 'bullet', 'align', 'direction', 'link', 'image'
  ];

  const handleChange = (content, delta, source, editor) => {
    setValue(content);
    const text = editor.getText();
    const isArabic = /[\u0600-\u06FF]/.test(text);
    const newDir = isArabic ? 'rtl' : 'ltr';
    if (newDir !== contentDir) setContentDir(newDir);
  };

  const handleNew = () => {
    setValue('');
  };

  const saveDocx = async () => {
    const text = quillRef.current.getEditor().getText();
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: text.split('\n').map(line => new Paragraph({ text: line }))
        }
      ]
    });
    const blob = await Packer.toBlob(doc);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'document.docx';
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const text = quillRef.current.getEditor().getText();
    const lines = doc.splitTextToSize(text, 180);
    if (contentDir === 'rtl') {
      doc.setR2L(true);
      doc.text(lines, 200, 20, { align: 'right' });
    } else {
      doc.text(lines, 20, 20);
    }
    doc.save('document.pdf');
  };

  return (
    <div className="p-4 space-y-4" dir={contentDir}>
      <div className="flex gap-2">
        <button onClick={handleNew} className="px-4 py-2 bg-blue-600 text-white rounded">{t('add')}</button>
        <button onClick={saveDocx} className="px-4 py-2 bg-green-600 text-white rounded">{t('save')}</button>
        <button onClick={exportPDF} className="px-4 py-2 bg-red-600 text-white rounded">{t('export')}</button>
      </div>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
      />
    </div>
  );
}
