import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export const SearchBar = ({
  value,
  onChange,
  isLoading = false,
}: SearchBarProps) => {
  return (
    <div className="relative w-64">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search candidates..."
        className="w-full px-4 py-2 rounded-lg border border-gray-300 
          focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent
          transition-all duration-200 ease-in-out
          disabled:bg-gray-50 disabled:cursor-not-allowed
          placeholder-gray-400"
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <LoadingSpinner className="border-secondary" />
        </div>
      )}
    </div>
  );
};
