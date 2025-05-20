import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import Button from './Button';
import Input from './Input';

export interface FilterOption<T = string> {
  label: string;
  value: T;
}

export interface FilterBarProps {
  onSearch: (searchTerm: string) => void;
  onFilter?: (filter: string | undefined) => void;
  onClear?: () => void;
  filterOptions?: FilterOption[];
  searchPlaceholder?: string;
  initialSearchTerm?: string;
  initialFilter?: string;
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  onFilter,
  onClear,
  filterOptions = [],
  searchPlaceholder = 'Search...',
  initialSearchTerm = '',
  initialFilter,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [activeFilter, setActiveFilter] = useState<string | undefined>(initialFilter);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (filter: string | undefined) => {
    setActiveFilter(filter);
    if (onFilter) {
      onFilter(filter);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setActiveFilter(undefined);
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search form */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-5 w-5" />}
              fullWidth
            />
            {searchTerm && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        {/* Filter buttons */}
        {filterOptions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeFilter === undefined ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange(undefined)}
            >
              All
            </Button>
            {filterOptions.map((option) => (
              <Button
                key={String(option.value)}
                variant={activeFilter === option.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange(option.value as string)}
              >
                {option.label}
              </Button>
            ))}

            {/* Clear filters button */}
            {(activeFilter !== undefined || searchTerm) && (
              <Button variant="outline" size="sm" onClick={handleClear}>
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
