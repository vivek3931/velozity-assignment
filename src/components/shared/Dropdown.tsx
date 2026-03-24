import React, { useState, useRef, useEffect, useCallback } from 'react';

interface DropdownProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multi?: boolean;
  id?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selected,
  onChange,
  multi = true,
  id,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const toggle = (value: string) => {
    if (multi) {
      if (selected.includes(value)) {
        onChange(selected.filter((s) => s !== value));
      } else {
        onChange([...selected, value]);
      }
    } else {
      onChange([value]);
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative" id={id}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
          selected.length > 0
            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
        }`}
      >
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="bg-indigo-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
            {selected.length}
          </span>
        )}
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 z-50 py-1.5 max-h-64 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <span
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  selected.includes(opt.value)
                    ? 'bg-indigo-600 border-indigo-600'
                    : 'bg-white border-slate-300'
                }`}
              >
                {selected.includes(opt.value) && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className={`font-medium ${selected.includes(opt.value) ? 'text-indigo-700' : 'text-slate-700'}`}>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Single-select inline dropdown (for list view status change)
interface InlineDropdownProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  colorClass?: string;
}

export const InlineDropdown: React.FC<InlineDropdownProps> = ({ value, options, onChange, colorClass }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLabel = options.find((o) => o.value === value)?.label || value;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`px-2 py-1 rounded text-[11px] font-semibold border cursor-pointer transition-all ${colorClass || 'bg-slate-700 text-slate-300 border-slate-600'}`}
      >
        {currentLabel}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg shadow-slate-200/50 z-50 py-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 transition-colors cursor-pointer ${
                opt.value === value ? 'text-indigo-600 font-semibold bg-indigo-50/50' : 'text-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
