"use client";

import AddFlashCardSetForm from "@/components/add-flash-card-set-form";
import DataErrorAlert from "@/components/data-error-alert";
import FlashCardSetList from "@/components/flash-card-set-list";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import H3 from "@/components/ui/h3";
import { useMobile } from "@/hooks/use-mobile";
import useMyFlashCardSet from "@/hooks/useMyFlashCardSet";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function Page() {
  const isMobile = useMobile();
  const PAGE_SIZE = isMobile ? 6 : 16;
  const { ref, inView } = useInView();

  const {
    sets,
    getSetError,
    refresh,
    isSetLoading,
    addToFavorite,
    removeFromFavorite,
    addSet,
    editSet,
    deleteSet,
    scrollNext,
  } = useMyFlashCardSet({
    page: 1,
    pageSize: PAGE_SIZE,
  });

  useEffect(() => {
    if (inView) {
      scrollNext();
    }
  }, [inView]);

  if (getSetError) {
    return (
      <MainLayout>
        <div className="px-4">
          <DataErrorAlert title="Failed to load your sets" onReload={refresh} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 px-4 lg:px-6">
        <div className="flex items-baseline justify-between px-4">
          <H3>My sets</H3>
          <div className="flex">
            <AddFlashCardSetForm
              trigger={
                <Button className="ml-4" variant={"outline"} type="button">
                  Add new set
                </Button>
              }
              onSubmit={addSet}
            />
          </div>
        </div>
        {!isSetLoading && !sets.length && (
          <div className="px-4">
            <p className="text-muted-foreground">
              You have no sets yet. Create a new set to get started.
            </p>
          </div>
        )}
        {!!sets.length && (
          <FlashCardSetList
            sets={sets}
            onAddToFavorite={addToFavorite}
            onRemoveFromFavorite={removeFromFavorite}
            onDelete={deleteSet}
            onEdit={editSet}
          />
        )}
        <div ref={ref} />
      </div>
    </MainLayout>
  );
}
