import React, { useState, useCallback, useEffect } from 'react';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Underline } from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { FontFamily } from '@tiptap/extension-font-family';
import { EditorToolbar } from './EditorToolbar';
import { StatusBar } from './StatusBar';
import { ThemeToggle } from './ThemeToggle';
import { FileManager } from './FileManager';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { FileText, Plus, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DocumentManager, DocumentMetadata } from '@/lib/documentManager';

interface DocumentEditorProps {
  initialContent?: string;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  initialContent = '<p>ابدأ في كتابة مستندك هنا... Start typing your document here...</p>'
}) => {
  const [documentTitle, setDocumentTitle] = useState('مستند جديد - New Document');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const { toast } = useToast();

  // Auto-detect RTL function
  const detectTextDirection = (text: string): 'rtl' | 'ltr' => {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return arabicRegex.test(text) ? 'rtl' : 'ltr';
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color.configure({ types: [TextStyle.name] }),
      TextStyle,
      Highlight.configure({ multicolor: true }),
      Underline,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'editor-content prose prose-lg max-w-none min-h-[600px] p-6 focus:outline-none font-cairo',
        dir: 'auto',
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      const text = editor.getText();
      
      // Update word and character counts
      setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
      setCharCount(text.length);
      
      // Auto-detect and apply text direction for new content
      const lines = text.split('\n');
      lines.forEach((line) => {
        if (line.trim()) {
          const direction = detectTextDirection(line);
          // Note: We're not forcing alignment here anymore to avoid interfering with user's manual alignment
        }
      });
      
      // Auto-save to localStorage with enhanced metadata
      const metadata: Partial<DocumentMetadata> = {
        title: documentTitle,
        modifiedAt: new Date(),
        wordCount,
        charCount,
      };
      
      DocumentManager.saveDraft(content, documentTitle, metadata);
      setLastSaveTime(new Date());
    },
  });

  // Load draft on mount
  useEffect(() => {
    const draft = DocumentManager.loadDraft();
    
    if (draft && editor) {
      editor.commands.setContent(draft.content);
      setDocumentTitle(draft.title);
      setLastSaveTime(DocumentManager.getLastSaveTime());
    }
  }, [editor]);

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
          toast({
            title: "🚀 تطبيق جاهز للعمل بدون إنترنت - App Ready for Offline",
            description: "يمكنك الآن استخدام المحرر بدون اتصال بالإنترنت - You can now use the editor offline",
            duration: 3000,
          });
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, [toast]);

  const handleNewDocument = useCallback(() => {
    if (editor) {
      editor.commands.clearContent();
      setDocumentTitle('مستند جديد - New Document');
      DocumentManager.clearDraft();
      setLastSaveTime(null);
      toast({
        title: "🆕 مستند جديد - New Document",
        description: "تم إنشاء مستند جديد - A new document has been created",
      });
    }
  }, [editor, toast]);

  const handleSave = useCallback(async () => {
    if (!editor) return;
    
    setIsSaving(true);
    try {
      const content = editor.getHTML();
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${documentTitle}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "💾 تم الحفظ - Saved Successfully",
        description: "تم حفظ المستند بنجاح - Document saved successfully",
      });
    } catch (error) {
      toast({
        title: "❌ خطأ في الحفظ - Save Error", 
        description: "فشل في حفظ المستند - Failed to save document",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [editor, documentTitle, toast]);

  const handleExportPDF = useCallback(async () => {
    if (!editor) return;
    
    setIsExporting(true);
    try {
      const content = editor.getHTML();
      await DocumentManager.exportToPDF(content, documentTitle);
      
      toast({
        title: "📄 تم تصدير PDF - PDF Exported",
        description: "تم تصدير المستند كملف PDF بنجاح - Document exported as PDF successfully",
      });
    } catch (error) {
      toast({
        title: "❌ فشل تصدير PDF - PDF Export Failed",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء تصدير PDF - An error occurred while exporting PDF",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }, [editor, documentTitle, toast]);

  const handleExportDOCX = useCallback(async () => {
    if (!editor) return;
    
    setIsExporting(true);
    try {
      const content = editor.getHTML();
      await DocumentManager.exportToDOCX(content, documentTitle);
      
      toast({
        title: "📄 تم تصدير DOCX - DOCX Exported",
        description: "تم تصدير المستند كملف DOCX بنجاح - Document exported as DOCX successfully",
      });
    } catch (error) {
      toast({
        title: "❌ فشل تصدير DOCX - DOCX Export Failed",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء تصدير DOCX - An error occurred while exporting DOCX",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }, [editor, documentTitle, toast]);

  const handleImport = useCallback((content: string, title: string, metadata: Partial<DocumentMetadata>) => {
    if (editor) {
      editor.commands.setContent(content);
      setDocumentTitle(title);
      
      // Update counts from imported content
      const text = editor.getText();
      setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
      setCharCount(text.length);
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <Toaster />
      {/* Header */}
      <header className="border-b bg-card shadow-soft backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary animate-pulse" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-primary">محرر إنكويل</h1>
                <p className="text-xs text-muted-foreground">Inkwell Editor</p>
              </div>
            </div>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="text-base font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-3 py-2 font-cairo min-w-0 flex-1 sm:min-w-[200px]"
              dir="auto"
              placeholder="اسم المستند - Document Name"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleNewDocument}
              className="gap-2 hover-lift"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">جديد - New</span>
            </Button>
            
            <FileManager
              onImport={handleImport}
              onExportPDF={handleExportPDF}
              onExportDOCX={handleExportDOCX}
              currentTitle={documentTitle}
            />
            
            <div className="h-6 w-px bg-border" />
            
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2 bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isSaving ? 'جاري الحفظ...' : 'حفظ - Save'}
              </span>
            </Button>
            
            <ThemeToggle />
          </div>
        </div>
        
        {lastSaveTime && (
          <div className="px-6 pb-2">
            <p className="text-xs text-muted-foreground">
              آخر حفظ - Last saved: {lastSaveTime.toLocaleTimeString('ar-EG')} | {lastSaveTime.toLocaleTimeString('en-US')}
            </p>
          </div>
        )}
      </header>

      {/* Toolbar */}
      <EditorToolbar editor={editor} />

      {/* Editor Area */}
      <main className="flex-1 p-6 bg-gradient-subtle">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card shadow-medium rounded-xl min-h-[700px] overflow-hidden border animate-fade-in">
            <EditorContent 
              editor={editor} 
              className="min-h-[700px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:p-8 [&_.ProseMirror]:text-foreground"
            />
            
            {isExporting && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-lg shadow-strong">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                  <span className="font-medium">جاري التصدير... Exporting...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Status Bar */}
      <StatusBar wordCount={wordCount} charCount={charCount} />
    </div>
  );
};

export default DocumentEditor;