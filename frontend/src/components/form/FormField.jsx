import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Generic form field component that adapts to current language and theme.
 * Supports text, date and select inputs.
 *
 * Props:
 * - type: 'text' | 'date' | 'select'
 * - name: field name
 * - label: {ar: string, en: string}
 * - placeholder: {ar: string, en: string}
 * - value: current value
 * - onChange: change handler
 * - options: for select, array of { value: string, label: {ar: string, en: string} }
 */
export default function FormField({
  type = 'text',
  name,
  label,
  placeholder,
  value,
  onChange,
  options = [],
  className = '',
}) {
  const { lang, dir } = useLanguage();

  const translate = (text) =>
    typeof text === 'object' ? text[lang] || '' : text || '';

  const handleSelectChange = (val) => {
    // Normalise to synthetic event shape
    onChange({ target: { name, value: val } });
  };

  return (
    <div className={`space-y-2 ${className}`} dir={dir}>
      {label && (
        <label className="text-sm font-medium" htmlFor={name}>
          {translate(label)}
        </label>
      )}
      {type === 'select' ? (
        <Select value={value} onValueChange={handleSelectChange}>
          <SelectTrigger id={name}>
            <SelectValue placeholder={translate(placeholder)} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {translate(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={translate(placeholder)}
        />
      )}
    </div>
  );
}

