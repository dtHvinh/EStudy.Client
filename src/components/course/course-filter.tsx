import { CourseDifficultyLevel } from "@/types/constants";
import { PriceFilterValues } from "@/types/course-price-constants";
import { ChevronDown } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

export default function CourseFilter({
  onSeacrchQueryChange,
  onPriceChange,
  onDifficultyChange,
}: {
  onSeacrchQueryChange?: (query: string) => void;
  onPriceChange?: (value: PriceFilterValues) => void;
  onDifficultyChange?: (value: "All" | CourseDifficultyLevel) => void;
}) {
  const debounceSearch = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onSeacrchQueryChange?.(e.target.value);
    },
    500,
  );

  return (
    <div className="flex gap-2">
      <DifficultyFilter onDifficultyChange={onDifficultyChange} />
      <PriceFilter onPriceChange={onPriceChange} />
      <Input
        type="text"
        placeholder="Search courses..."
        onChange={debounceSearch}
        className="w-64 focus:border-0 focus:ring-0"
      />
    </div>
  );
}

const PriceFilter = ({
  onPriceChange,
}: {
  onPriceChange?: (value: PriceFilterValues) => void;
}) => {
  const [price, setPrice] = useState<string>("All");

  return (
    <div className="space-y-4">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"}>
            Price: {price}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              onPriceChange?.("all");
              setPrice("All");
            }}
          >
            All
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              onPriceChange?.("free");
              setPrice("Free");
            }}
          >
            Free
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              onPriceChange?.("paid");
              setPrice("Paid");
            }}
          >
            Paid
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const DifficultyFilter = ({
  onDifficultyChange,
}: {
  onDifficultyChange?: (value: "All" | CourseDifficultyLevel) => void;
}) => {
  const [difficulty, setDifficulty] = useState<"All" | CourseDifficultyLevel>(
    "All",
  );

  return (
    <div className="space-y-4">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"}>
            Difficulty: {difficulty}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              onDifficultyChange?.("All");
              setDifficulty("All");
            }}
          >
            All
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              onDifficultyChange?.("Beginner");
              setDifficulty("Beginner");
            }}
          >
            Beginner
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              onDifficultyChange?.("Intermediate");
              setDifficulty("Intermediate");
            }}
          >
            Intermediate
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              onDifficultyChange?.("Advanced");
              setDifficulty("Advanced");
            }}
          >
            Advanced
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
