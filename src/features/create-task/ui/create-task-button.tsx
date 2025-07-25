import { Button } from '@/shared/ui';
import type { ButtonVariantProps } from '@/shared/ui/button.variants';
import { Plus } from 'lucide-react';

interface CreateTaskButtonProps extends ButtonVariantProps {
  onClick: () => void;
  showText?: boolean;
}

export function CreateTaskButton({ onClick, variant = 'default', size = 'sm', showText = true }: CreateTaskButtonProps) {
  return (
    <Button onClick={onClick} variant={variant} size={size}>
      <Plus className="w-4 h-4" />
      {showText && <span className="ml-2">Criar Tarefa</span>}
    </Button>
  );
}
