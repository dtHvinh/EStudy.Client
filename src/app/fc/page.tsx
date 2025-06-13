"use client";

import FlashCardSet from "@/components/flash-card-set";
import MainLayout from "@/components/layouts/MainLayout";
import H3 from "@/components/ui/h3";
import useMyFlashCardSet from "@/hooks/useMyFlashCardSet";

export default function Page() {
  const { favoriteSets, nonFavoriteSets } = useMyFlashCardSet({
    page: 1,
    pageSize: 10,
  });

  return (
    <MainLayout>
      <H3 className="px-4">My favorite</H3>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3 @5xl/main:grid-cols-4">
        {favoriteSets.map((set) => (
          <FlashCardSet {...set} key={set.id} />
        ))}
      </div>
      <H3 className="px-4">My sets</H3>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3 @5xl/main:grid-cols-4">
        {nonFavoriteSets.map((set) => (
          <FlashCardSet {...set} key={set.id} />
        ))}
      </div>
    </MainLayout>
  );
}
