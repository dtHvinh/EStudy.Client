"use client";

import AddCardForm from "@/components/add-card-form";
import FlashCard from "@/components/flash-card";
import MainLayout from "@/components/layouts/MainLayout";
import NavigateBack from "@/components/navigate-back";
import { Button } from "@/components/ui/button";
import H3 from "@/components/ui/h3";
import { useIsMobile } from "@/hooks/use-mobile";
import useSetCards from "@/hooks/use-set-cards";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const isMobile = useIsMobile();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      scrollNext();
    }
  }, [inView]);

  const {
    cards,
    isCardLoading,
    scrollNext,
    scrollPrev,
    createCard,
    deleteCard,
  } = useSetCards({
    id: id,
    pageSize: isMobile ? 10 : 20,
  });

  return (
    <MainLayout>
      <div className="px-4 lg:px-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <NavigateBack />
            <H3>Cards</H3>
          </div>

          <AddCardForm
            trigger={<Button variant={"outline"}>Add Card</Button>}
            onSubmit={createCard}
          />
        </div>

        <div className="px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {!!cards.length ? (
            cards.map((card) => (
              <FlashCard
                key={card.id}
                {...card}
                onDelete={() => deleteCard(card)}
              />
            ))
          ) : (
            <div className="mt-4">No cards</div>
          )}
        </div>
        <div ref={ref}></div>
      </div>
    </MainLayout>
  );
}
