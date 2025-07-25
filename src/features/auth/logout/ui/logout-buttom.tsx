import type { ButtonVariantProps } from '@/shared/ui/button.variants';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from '@/shared/ui';

import { LogOut } from 'lucide-react';

interface LogoutButtonProps extends ButtonVariantProps {
  onLogout: () => void;
  showText?: boolean;
}

export function LogoutButton({ onLogout, variant = 'ghost', size = 'sm', showText = true }: LogoutButtonProps) {
  const handleLogout = () => {
    onLogout();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant} size={size} className="text-gray-600 hover:text-gray-900">
          <LogOut className="w-4 h-4" />
          {showText && <span className="ml-2 hidden sm:inline">Sair</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Logout</AlertDialogTitle>
          <AlertDialogDescription>Tem certeza que deseja sair?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
            Sair
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
