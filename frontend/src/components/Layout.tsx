import React from "react";
import { SearchBar } from "./SearchBar";

interface LayoutProps {
  children: React.ReactNode;
  searchValue: string;
  onSearchChange: (value: string) => void;
  isSearching?: boolean;
}

export const Layout = ({
  children,
  searchValue,
  onSearchChange,
  isSearching = false,
}: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">ATS System</h1>
              <div className="h-6 w-px bg-gray-200 mx-4" />
              <SearchBar
                value={searchValue}
                onChange={onSearchChange}
                isLoading={isSearching}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            &copy; 2024 ATS System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
