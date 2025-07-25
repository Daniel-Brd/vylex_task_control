import { Button } from '@/shared/ui';
import type { ButtonVariantProps } from '@/shared/ui/button.variants';
import { Trash2 } from 'lucide-react';

interface DeleteTaskButtonProps extends ButtonVariantProps {
  onClick: () => void;
  showText?: boolean;
}

export function DeleteTaskButton({ onClick, variant = 'outline', size = 'lg', showText = true }: DeleteTaskButtonProps) {
  return (
    <Button onClick={onClick} variant={variant} size={size} className='className="text-destructive hover:text-destructive"'>
      <Trash2 className="w-4 h-4" />
      {showText && <span className="ml-2">Excluir</span>}
    </Button>
  );
}
