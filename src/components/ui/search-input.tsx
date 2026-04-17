// components/SearchInput.tsx
import { ComponentProps, forwardRef } from "react";
import { LuSearch, LuX } from "react-icons/lu";
import { Input } from "./input";

type SearchInputProps = ComponentProps<typeof Input> & {
  onClear?: () => void;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput({ onClear, value, className = "", ...props }, ref) {
    const hasValue = value != null && value !== "";
    const showClear = onClear && hasValue;

    return (
      <Input
        {...props}
        ref={ref}
        value={value}
        type="search"
        // hide the native WebKit clear "X" so ours is the only one
        className={`[&::-webkit-search-cancel-button]:appearance-none ${className}`}
        leftIcon={<LuSearch size={16} aria-hidden />}
        rightIcon={
          showClear ? (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search"
              className="flex items-center justify-center rounded p-0.5 text-text-muted hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30"
            >
              <LuX size={14} aria-hidden />
            </button>
          ) : null
        }
      />
    );
  }
);