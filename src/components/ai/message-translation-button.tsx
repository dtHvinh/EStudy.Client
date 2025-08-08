import { cn } from "@/lib/utils";
import { GPT_MODEL_LANGUAGES_SUPPORTED } from "@/types/constants";
import { IconLanguage } from "@tabler/icons-react";
import { Check, Loader2Icon } from "lucide-react";
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
import api from "../utils/requestUtils";

export default function MessageTranslationButton({
  text,
  context,
  onTranslated,
}: {
  text: string;
  context?: string;
  onTranslated?: (translatedText: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async (selectedLanguage?: string) => {
    console.log("Translating to:", selectedLanguage);
    setSelectedLanguage(selectedLanguage);
    setIsLoading(true);
    try {
      const { translatedText } = await api.post<{ translatedText: string }>(
        "/api/ai/translate",
        {
          text,
          context,
          language: selectedLanguage,
        },
      );

      setIsLoading(false);
      onTranslated?.(translatedText);
    } catch (error) {
      console.error("Translation error:", error);
      setIsLoading(false);
    }
  };

  const handleLanguageSelect = async (language: string) => {
    setSelectedLanguage(language);
    setOpen(false);
    await handleTranslate(language);
  };

  return (
    <Popover modal={false} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Button disabled={isLoading} variant={"ghost"}>
            <IconLanguage />
            {isLoading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <span>
                Translate{selectedLanguage && `: ${selectedLanguage}`}
              </span>
            )}
          </Button>
        </div>
      </PopoverTrigger>

      {!isLoading && (
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
                  onSelect={(lang) => handleLanguageSelect(lang)}
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
      )}
    </Popover>
  );
}
