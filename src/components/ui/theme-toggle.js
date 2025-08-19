import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/theme-context';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ size = 'sm', iconSize = 'size-4' }) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getIcon = () => {
    return theme === 'light' ? (
      <Sun className={iconSize} />
    ) : (
      <Moon className={iconSize} />
    );
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={toggleTheme}
      className="rounded-full"
      title={`Current theme: ${theme}`}
    >
      {getIcon()}
    </Button>
  );
}
