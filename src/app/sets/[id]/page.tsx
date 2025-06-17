"use client";

import AddCardForm from "@/components/add-card-form";
import FlashCard from "@/components/flash-card";
import MainLayout from "@/components/layouts/MainLayout";
import NavigateBack from "@/components/navigate-back";
import { Button } from "@/components/ui/button";
import H3 from "@/components/ui/h3";
import { Input } from "@/components/ui/input";
import useSetCards from "@/hooks/use-set-cards";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      scrollNext();
    }
  }, [inView]);

  const { cards, scrollNext, createCard, deleteCard, editCard } = useSetCards({
    id: id,
    pageSize: 20,
  });

  return (
    <MainLayout>
      <div className="px-4 lg:px-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <NavigateBack />
            <H3>Cards</H3>
          </div>

          <div className="flex items-center gap-2">
            <AddCardForm
              trigger={<Button variant={"outline"}>Add Card</Button>}
              onSubmit={createCard}
            />

            <Input type="search" placeholder="Search cards..." />
          </div>
        </div>

        <div className="px-2 grid grid-cols-2 sm:grid-col-4 md:grid-cols-5 gap-8">
          {!!cards.length ? (
            cards.map((card) => (
              <FlashCard
                key={card.id}
                {...card}
                onEdit={editCard}
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
