import { cn } from "@/lib/utils";
import { GPT_MODEL_LANGUAGES_SUPPORTED } from "@/types/constants";
import { IconLanguage } from "@tabler/icons-react";
import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function MessageTranslationButton({
  text,
  context,
}: {
  text: string;
  context?: string;
}) {
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  return (
    <Popover modal={false} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Button variant={"ghost"}>
            <IconLanguage />
            <span>Translate{selectedLanguage && `: ${selectedLanguage}`}</span>
          </Button>
        </div>
      </PopoverTrigger>

      <PopoverContent className="max-w-[200px] p-2">
        <Command>
          <CommandInput placeholder="Search language..." className="h-9" />
          <CommandEmpty>No language found.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-y-auto p-0">
            {GPT_MODEL_LANGUAGES_SUPPORTED.filter(
              (lang) => lang !== "English",
            ).map((lang) => (
              <CommandItem
                key={lang}
                value={lang}
                onSelect={(currentValue) => {
                  setSelectedLanguage(currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedLanguage === lang ? "opacity-100" : "opacity-0",
                  )}
                />
                {lang}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
