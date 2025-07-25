import type { GetTasksFilters, GetTasksOrderBy } from '@/entities/task/api';
import type { TaskStatus } from '@/entities/task/model/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui';
import { ArrowUpDown, Filter } from 'lucide-react';
import { useMemo, type Dispatch, type SetStateAction } from 'react';

type WithAll<T> = T | 'all';
type SortValue = `${GetTasksOrderBy['sortBy']}_${GetTasksOrderBy['sortOrder']}`;

interface TaskFiltersProps {
  setFilter: Dispatch<SetStateAction<GetTasksFilters | undefined>>;
  setOrderBy: Dispatch<SetStateAction<GetTasksOrderBy | undefined>>;
}

const SORT_OPTIONS: Array<{ value: SortValue; label: string }> = [
  { value: 'createdAt_asc', label: 'Criado ↑' },
  { value: 'createdAt_desc', label: 'Criado ↓' },
  { value: 'dueDate_asc', label: 'Vencimento ↑' },
  { value: 'dueDate_desc', label: 'Vencimento ↓' },
  { value: 'status_asc', label: 'Status ↑' },
  { value: 'status_desc', label: 'Status ↓' },
  { value: 'title_asc', label: 'Título ↑' },
  { value: 'title_desc', label: 'Título ↓' },
];

const STATUS_OPTIONS: Array<{ value: WithAll<TaskStatus>; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'PENDING', label: 'Pendente' },
  { value: 'IN_PROGRESS', label: 'Fazendo' },
  { value: 'COMPLETED', label: 'Completo' },
];

export const TaskFilters = ({ setFilter, setOrderBy }: TaskFiltersProps) => {
  const parseSortValue = useMemo(
    () => (sortValue: SortValue) => {
      const [sortBy, sortOrder] = sortValue.split('_') as [GetTasksOrderBy['sortBy'], GetTasksOrderBy['sortOrder']];
      return { sortBy, sortOrder };
    },
    [],
  );

  const handleStatusChange = (status: WithAll<TaskStatus>) => {
    setFilter({ status: status === 'all' ? undefined : status });
  };

  const handleSortChange = (sortValue: SortValue) => {
    setOrderBy(parseSortValue(sortValue));
  };

  return (
    <div className="pt-4 px-4">
      <div className="flex justify-end justify-self-center gap-4 max-w-300 w-full">
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={handleSortChange}>
          <SelectTrigger className="flex items-center gap-2 w-48 px-3 py-2 border rounded-lg shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <ArrowUpDown className="w-5 h-5 text-gray-500" />
            <SelectValue placeholder="Ordenar por" className="text-gray-700" />
          </SelectTrigger>
          <SelectContent className="w-48">
            {SORT_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
