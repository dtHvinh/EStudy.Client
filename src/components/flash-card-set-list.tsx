import { FlashCardSetResponseType } from "@/hooks/useMyFlashCardSet";
import FlashCardSet from "./flash-card-set";

export default function FlashCardSetList({
  sets,
  onAddToFavorite,
  onRemoveFromFavorite,
}: {
  sets: FlashCardSetResponseType[];
  onAddToFavorite: () => void;
  onRemoveFromFavorite: () => void;
}) {
  return (
    <div className="dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3 @5xl/main:grid-cols-4">
      {sets.map((set) => (
        <FlashCardSet
          {...set}
          key={set.id}
          onAddToFavorite={onAddToFavorite}
          onRemoveFromFavorite={onRemoveFromFavorite}
        />
      ))}
    </div>
  );
}
