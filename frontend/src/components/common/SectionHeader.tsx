import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  showBackButton?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  showBackButton = false,
  onBack,
  rightContent
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-secondary border border-border">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="hover-scale"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            )}

            {Icon && (
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl">
                <Icon className="w-6 h-6 text-primary" />
              </div>
            )}

            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">
                {title}
              </h1>
              {subtitle && (
                <p className="text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {rightContent && (
            <div className="flex items-center space-x-2 space-x-reverse">
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SectionHeader;