import React from 'react';

interface StatusBarProps {
  wordCount: number;
  charCount: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ wordCount, charCount }) => {
  const lastSaveTime = new Date().toLocaleTimeString('ar-EG');
  
  return (
    <footer className="border-t bg-card px-6 py-3 text-sm text-muted-foreground shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-arabic">📊 الكلمات</span>
            <span className="font-semibold text-primary">{wordCount}</span>
            <span className="text-xs">Words</span>
          </div>
          
          <div className="h-4 w-px bg-border" />
          
          <div className="flex items-center gap-2">
            <span className="font-arabic">🔤 الأحرف</span>
            <span className="font-semibold text-primary">{charCount}</span>
            <span className="text-xs">Characters</span>
          </div>
          
          <div className="h-4 w-px bg-border" />
          
          <div className="flex items-center gap-2">
            <span className="font-arabic">✍️ محرر إنكويل</span>
            <span className="text-xs">Inkwell Editor</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs">
              <span className="font-arabic">حفظ تلقائي</span> Auto-saved
            </span>
          </div>
          
          <div className="h-4 w-px bg-border" />
          
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            <span className="text-xs">
              <span className="font-arabic">جاهز</span> Ready {lastSaveTime}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};