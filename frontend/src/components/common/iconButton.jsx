// components/common/IconButton.jsx
export default function IconButton({ onClick, children, active }) {
  return (
    <button
      onClick={onClick}
      className={`w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-200 shadow-md border
        ${active
          ? 'bg-gold text-white border-gold'
          : 'bg-background text-muted-foreground border-gray-300 dark:border-gray-700 hover:bg-accent hover:text-accent-foreground'}
      `}
    >
      {children}
    </button>
  );
}
