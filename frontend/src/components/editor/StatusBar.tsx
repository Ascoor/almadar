import React from 'react';

interface StatusBarProps {
  wordCount: number;
  charCount: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ wordCount, charCount }) => {
  const lastSaveTime = new Date().toLocaleTimeString('ar-EG');
  
  return (
    <footer className="border-t bg-card px-4 py-3 text-sm text-muted-foreground shadow-soft">
      <div className="container mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-foreground">
            <span className="font-arabic">📊 الكلمات</span>
            <span className="font-semibold text-primary">{wordCount}</span>
            <span className="text-xs">Words</span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-border" />

          <div className="flex items-center gap-2 text-foreground">
            <span className="font-arabic">🔤 الأحرف</span>
            <span className="font-semibold text-primary">{charCount}</span>
            <span className="text-xs">Characters</span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-border" />

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-foreground">
            <span className="font-arabic text-base sm:text-lg font-semibold text-primary tracking-tight">
              ✍️ محرر المدار الاحترافي
            </span>

            <span className="text-xs text-muted-foreground tracking-wide">
              Almadar Professional Editor
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-foreground">
              <span className="font-arabic">حفظ تلقائي</span> Auto-saved
            </span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-border" />

          <div className="flex items-center gap-2 text-foreground">
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