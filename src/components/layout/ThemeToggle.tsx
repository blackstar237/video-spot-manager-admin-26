import { Button } from '@/components/ui/button';
import { useTheme } from '@/providers/ThemeProvider';
import { Sun, Moon } from 'lucide-react';
export function ThemeToggle() {
  const {
    theme,
    setTheme
  } = useTheme();
  return <Button variant="outline" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title={`Basculer vers le mode ${theme === 'dark' ? 'clair' : 'sombre'}`} className="">
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">
        Basculer vers le mode {theme === 'dark' ? 'clair' : 'sombre'}
      </span>
    </Button>;
}