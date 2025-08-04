import { HoverCard, HoverCardTrigger } from "../ui/hover-card";

interface Word {
  id: number | string;
  text: string;
}

interface WordCardProps {
  word: Word;
  searchQuery: string;
}

export default function WordCard({ word, searchQuery }: WordCardProps) {
  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-primary/20 text-primary rounded px-0.5 font-medium"
        >
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="group/word bg-card hover:border-primary/50 relative overflow-hidden rounded-lg border p-4 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
          <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-200 group-hover/word:opacity-100"></div>
          <div className="relative">
            <p className="text-foreground font-medium break-words">
              {highlightText(word.text, searchQuery)}
            </p>
            <div className="from-primary/20 mt-2 h-px bg-gradient-to-r to-transparent opacity-0 transition-opacity duration-200 group-hover/word:opacity-100"></div>
          </div>
        </div>
      </HoverCardTrigger>
      {/* <HoverCardContent className="w-80 flex-wrap invert">
        <Markdown>{data?.definition}</Markdown>
      </HoverCardContent> */}
    </HoverCard>
  );
}
