"use client";

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { CreateEventForm } from "./create-event-form";
import { Calendar } from "lucide-react";
import { btnIconStyles, btnStyles } from "@/styles/icons";
import { InteractiveOverlay } from "@/components/interactive-overlay";
import { useState } from "react";

export function CreateEventButton() {
  const { groupId } = useParams<{ groupId: string }>();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <InteractiveOverlay
        title={"Criar Evento"}
        description={"Preencha o formulário abaixo para criar um evento."}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        form={<CreateEventForm groupId={parseInt(groupId)} />}
      />

      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        className={btnStyles}
      >
        <Calendar className={btnIconStyles} />
        Criar Evento
      </Button>
    </>
  );
}
