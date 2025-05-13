
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from './ThemeToggle';

export const Header = () => {
  return (
    <header className="border-b border-border/60 bg-card/70 backdrop-blur-sm p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-9 bg-background/70 backdrop-blur-sm border-border/80"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button variant="outline" size="icon" className="bg-background/70 backdrop-blur-sm border-border/80 hover:bg-accent hover-glow">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background/70 backdrop-blur-sm border-border/80 hover:bg-accent hover-glow">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card/90 backdrop-blur-md border-border/60">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/60" />
            <DropdownMenuItem className="hover:bg-accent/70 cursor-pointer">Profil</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-accent/70 cursor-pointer">Préférences</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/60" />
            <DropdownMenuItem className="hover:bg-destructive/20 text-destructive cursor-pointer">Déconnexion</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
