import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
};

export function Modal({
  children,
  trigger,
  title,
  description,
  open,
  onOpenChange,
  size = 'md',
  showCloseButton = true,
  className,
}: ModalProps) {
  const dialogProps = open !== undefined ? { open, onOpenChange } : {};

  return (
    <Dialog {...dialogProps}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent 
        className={cn(
          sizeClasses[size],
          "sm:max-w-none",
          className
        )}
        dir="rtl"
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {(title || description) && (
              <DialogHeader>
                {title && (
                  <DialogTitle className="text-right text-xl font-semibold">
                    {title}
                  </DialogTitle>
                )}
                {description && (
                  <DialogDescription className="text-right text-muted-foreground">
                    {description}
                  </DialogDescription>
                )}
              </DialogHeader>
            )}
            
            <div className="py-4">
              {children}
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

interface ConfirmModalProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: 'default' | 'destructive';
}

export function ConfirmModal({
  title,
  description,
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  onConfirm,
  onCancel,
  open,
  onOpenChange,
  variant = 'default',
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
    >
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={handleCancel}>
          {cancelText}
        </Button>
        <Button 
          variant={variant === 'destructive' ? 'destructive' : 'default'}
          onClick={handleConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}