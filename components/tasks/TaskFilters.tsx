'use client';

import { FilterType, SortType } from '@/types';
import { ListTodo, CheckCircle2, Circle, ArrowUpDown } from 'lucide-react';

interface TaskFiltersProps {
  filter: FilterType;
  sort: SortType;
  onFilterChange: (filter: FilterType) => void;
  onSortChange: (sort: SortType) => void;
}

export default function TaskFilters({
  filter,
  sort,
  onFilterChange,
  onSortChange,
}: TaskFiltersProps) {
  const filters: { value: FilterType; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'All', icon: <ListTodo className="w-4 h-4" /> },
    { value: 'active', label: 'Active', icon: <Circle className="w-4 h-4" /> },
    {
      value: 'completed',
      label: 'Completed',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-4 transition-all font-pixel text-xs shadow-lg ${
              filter === f.value
                ? 'bg-purple-600 border-purple-500 text-white shadow-purple-500/50'
                : 'bg-[#2a2139] border-[#3f3454] text-purple-300 hover:bg-[#3f3454] hover:border-purple-500'
            }`}
          >
            {f.icon}
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-purple-400" />
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortType)}
          className="px-3 py-2 rounded-lg border-4 border-[#3f3454] bg-[#2a2139] text-sm text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-pixel shadow-lg"
        >
          <option value="date">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>
    </div>
  );
}
