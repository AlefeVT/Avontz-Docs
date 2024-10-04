'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';

type SelectItemType = {
  value: string;
  label: string;
  description?: string;
};

type SearchableSelectProps = {
  items: SelectItemType[];
  selectedValue: string | null;
  onValueChange: (value: string | null) => void;
  label?: string;
  placeholder?: string;
  error?: string;
};

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  items,
  selectedValue,
  onValueChange,
  label,
  placeholder = 'Selecione...',
  error,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-2 mb-10">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div ref={dropdownRef} className="relative w-[300px]">
        <Button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          variant="outline"
          className="w-[300px] flex justify-between items-center"
        >
          {selectedValue
            ? items.find((item) => item.value === selectedValue)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-muted-foreground" />
        </Button>

        {open && (
          <div
            className="absolute z-10 bg-card border border-border rounded-md w-full mt-2 p-2"
            role="listbox"
            aria-labelledby="select-label"
          >
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full p-2 mb-2 border border-input rounded-md"
            />

            {filteredItems.length > 0 ? (
              <ul className="max-h-48 overflow-y-auto">
                {filteredItems.map((item) => (
                  <li
                    key={item.value}
                    className="p-2 cursor-pointer hover:bg-muted"
                    role="option"
                    aria-selected={selectedValue === item.value}
                    onClick={() => {
                      onValueChange(item.value);
                      setSearchQuery('');
                      setOpen(false);
                    }}
                  >
                    <div className="flex justify-between">
                      <span className="text-foreground">{item.label}</span>
                      {selectedValue === item.value && (
                        <Check className="h-4 w-4 text-success" />
                      )}
                    </div>
                    {item.description && (
                      <p
                        className="text-xs text-muted-foreground mt-1"
                        title={item.description}
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum item encontrado.
              </p>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-destructive">{error}</p>}
    </div>
  );
};

export default SearchableSelect;
