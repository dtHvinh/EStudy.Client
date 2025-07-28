import { Search, X } from "lucide-react";
import { ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function WordSearchBar({
  searchQuery,
  setSearchQuery,
}: SearchBarProps) {
  const handleClear = () => {
    setSearchQuery("");
  };

  const debouncedSetSearchQuery = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    300,
  );

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="text-muted-foreground h-4 w-4" />
      </div>
      <Input
        spellCheck={false}
        type="text"
        placeholder="Search words..."
        onChange={debouncedSetSearchQuery}
        className="bg-background border-input h-10 rounded-full px-5 focus:border-0"
      />
      {searchQuery && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="hover:bg-muted h-8 w-8 rounded-full p-0"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
