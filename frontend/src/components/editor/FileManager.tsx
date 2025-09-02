import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  Download, 
  FileText, 
  File,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { DocumentManager, DocumentMetadata } from '@/lib/documentManager';

interface FileManagerProps {
  onImport: (content: string, title: string, metadata: Partial<DocumentMetadata>) => void;
  onExportPDF: () => void;
  onExportDOCX: () => void;
  currentTitle: string;
}

export const FileManager: React.FC<FileManagerProps> = ({
  onImport,
  onExportPDF,
  onExportDOCX,
  currentTitle
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
          file.name.endsWith('.docx')) {
        const { content, metadata } = await DocumentManager.importFromDOCX(file);
        onImport(content, metadata.title || file.name, metadata);
        
        toast({
          title: "✅ تم الاستيراد بنجاح - Import Successful",
          description: `تم استيراد الملف "${file.name}" بنجاح - File "${file.name}" imported successfully`,
        });
      } else {
        toast({
          title: "❌ نوع ملف غير مدعوم - Unsupported File Type",
          description: "يرجى اختيار ملف DOCX - Please select a DOCX file",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ فشل في الاستيراد - Import Failed",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء استيراد الملف - An error occurred while importing the file",
        variant: "destructive",
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileImport}
        className="hidden"
        aria-label="Import DOCX file"
      />
      
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 hover-lift transition-smooth"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">استيراد - Import</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              استيراد ملف - Import File
            </DialogTitle>
            <DialogDescription>
              اختر ملف DOCX لاستيراده وتحريره
              <br />
              Choose a DOCX file to import and edit
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border border-dashed border-border rounded-lg hover:border-primary transition-colors">
              <File className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="font-medium">انقر لاختيار ملف - Click to choose file</span>
                  <br />
                  <span className="text-sm text-muted-foreground">DOCX files only</span>
                </Label>
              </div>
              <Button 
                onClick={triggerFileInput}
                variant="secondary"
                size="sm"
              >
                تصفح - Browse
              </Button>
            </div>
            
            <div className="flex items-start gap-2 p-3 bg-accent/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <div className="text-sm text-accent-foreground">
                <p className="font-medium mb-1">معلومات مهمة - Important Info:</p>
                <p>• يدعم النص العربي والإنجليزي - Supports Arabic and English text</p>
                <p>• يحافظ على التنسيق الأساسي - Preserves basic formatting</p>
                <p>• حجم الملف الأقصى: 10MB - Max file size: 10MB</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={onExportPDF}
        className="gap-2 hover-lift transition-smooth"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">PDF تصدير</span>
      </Button>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={onExportDOCX}
        className="gap-2 hover-lift transition-smooth"
      >
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">DOCX تصدير</span>
      </Button>
    </div>
  );
};