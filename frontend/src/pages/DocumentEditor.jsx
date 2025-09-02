import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';

import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, AlignmentType } from 'docx';

// 👇 لو هتستخدم html2pdf.js (أنصح بيه للـ RTL)
// npm i html2pdf.js
import html2pdf from 'html2pdf.js';

import { useLanguage } from '@/context/LanguageContext';

export default function DocumentEditor() {
  const { dir, t } = useLanguage();
  const quillRef = useRef(null);
  const [value, setValue] = useState('');
  const [contentDir, setContentDir] = useState(dir);

  useEffect(() => {
    setContentDir(dir);
  }, [dir]);

  // ثبّت إعدادات الـ toolbar لتفادي إعادة الإنشاء
  const modules = useMemo(() => ({
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
  }), []);

  const formats = useMemo(() => ([
    'header', 'bold', 'italic', 'underline', 'strike', 'color', 'background',
    'script', 'list', 'bullet', 'align', 'direction', 'link', 'image'
  ]), []);

  // حدّث الاتجاه داخل الـ Quill نفسه (direction + align)
  const applyDirection = useCallback((editor, dir) => {
    editor.format('direction', dir);
    editor.format('align', dir === 'rtl' ? 'right' : '');
  }, []);

  useEffect(() => {
    const editor = quillRef.current?.getEditor?.();
    if (editor) applyDirection(editor, contentDir);
  }, [contentDir, applyDirection]);

  const handleChange = (content, delta, source, editor) => {
    setValue(content);
    const text = editor.getText();
    const isArabic = /[\u0600-\u06FF]/.test(text);
    const newDir = isArabic ? 'rtl' : 'ltr';
    if (newDir !== contentDir) {
      setContentDir(newDir);
      applyDirection(editor, newDir);
    }
  };

  const handleNew = () => setValue('');

  // DOCX: اجعل الفقرات RTL إذا لزم
  const saveDocx = async () => {
    const editor = quillRef.current.getEditor();
    const plain = editor.getText();
    const isArabic = /[\u0600-\u06FF]/.test(plain);
    const paragraphs = plain.split('\n').map(line =>
      new Paragraph({
        text: line,
        bidirectional: isArabic,           // تفعيل BiDi
        rightToLeft: isArabic,             // اتجاه يمين-لِيسار
        alignment: isArabic ? AlignmentType.RIGHT : AlignmentType.LEFT
      })
    );

    const doc = new Document({
      sections: [{ children: paragraphs }]
    });

    const blob = await Packer.toBlob(doc);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'document.docx';
    link.click();
  };

  // PDF (موصى به): تحويل HTML مباشرةً يحافظ على RTL وتنسيق Quill
  const exportPDF = async () => {
    const editorRoot = quillRef.current.getEditor().root;
    // خيارات معقولة؛ ممكن تعدّل الهوامش/المقاس
    const opt = {
      margin:       10,
      filename:     'document.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 }, // دقة أعلى
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    await html2pdf().from(editorRoot).set(opt).save();
  };

  return (
    <div className="p-4 space-y-4" dir={contentDir}>
      <div className="flex gap-2">
        <button onClick={handleNew}  className="px-4 py-2 bg-blue-600 text-white rounded">{t('add')}</button>
        <button onClick={saveDocx}   className="px-4 py-2 bg-green-600 text-white rounded">{t('save')}</button>
        <button onClick={exportPDF}  className="px-4 py-2 bg-red-600 text-white rounded">{t('export')}</button>
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
