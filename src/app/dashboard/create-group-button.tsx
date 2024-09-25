"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { btnIconStyles, btnStyles } from "@/styles/icons";
import { InteractiveOverlay } from "@/components/interactive-overlay";
import { useState } from "react";
import { CreateGroupForm } from "./create-group-form";

export function CreateGroupButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <InteractiveOverlay
        title={"Criar grupo"}
        description={"Crie um novo grupo para começar a gerenciar seus eventos."}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        form={<CreateGroupForm />}
      />

      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        className={btnStyles}
      >
        <PlusCircle className={btnIconStyles} />
        Criar grupo
      </Button>
    </>
  );
}
