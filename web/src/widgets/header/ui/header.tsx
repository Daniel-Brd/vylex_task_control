import { LogoutButton } from '@/features/auth/logout';
import { CreateTaskButton } from '@/features/create-task';
import { Separator } from '@/shared/ui';

interface HeaderProps {
  onClickCreateTask: () => void;
  onClickLogout: () => void;
}

export function Header({ onClickCreateTask, onClickLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-300">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-6">
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-gray-900">Tasks</h1>
              <p className="text-sm text-gray-500">Manage your daily tasks</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-3">
              <CreateTaskButton onClick={onClickCreateTask} />
              <Separator orientation="vertical" className="h-6" />
              <LogoutButton onLogout={onClickLogout} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
