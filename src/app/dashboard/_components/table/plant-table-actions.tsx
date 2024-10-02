import { EllipsisVertical, PencilIcon, TrashIcon, QrCodeIcon, EyeIcon } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteModal } from "@/components/delete-modal";
import { useServerAction } from "zsa-react";
import { Plants } from "@/db/schema";
import { btnIconStyles, btnStyles } from "@/styles/icons";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { InteractiveOverlay } from "@/components/interactive-overlay";
import { deletePlantAction } from "../../actions";
import { EditPlantForm } from "../edit-plants-form";
import { QRCodeModal } from "./QRCodeModal";
import Link from "next/link"; 

export function PlantsActions({ plant }: { plant: Plants }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditPlantOpen, setIsEditPlantOpen] = useState(false);
  const { execute, isPending } = useServerAction(deletePlantAction, {
    onSuccess() {
      setIsOpen(false);
    },
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);

  return (
    <>
      <InteractiveOverlay
        isOpen={isEditPlantOpen}
        setIsOpen={setIsEditPlantOpen}
        title={"Editar Planta"}
        description={"Editar detalhes da planta."}
        form={<EditPlantForm plant={plant} />}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Excluir Planta"
        description="Tem certeza de que deseja excluir esta planta?"
        onConfirm={() => {
          execute({
            plantId: [plant.id],
          });
        }}
        isPending={isPending}
      />

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={"icon"} style={{ cursor: 'pointer' }}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setIsEditPlantOpen(true);
            }}
            className={cn(btnStyles, "cursor-pointer")}
          >
            <PencilIcon className={btnIconStyles} />
            Editar Planta
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(btnStyles, "text-red-500 cursor-pointer")}
            onClick={() => {
              setIsDeleteModalOpen(true);
            }}
          >
            <TrashIcon className={btnIconStyles} />
            Remover Planta
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(btnStyles, "cursor-pointer")}
            onClick={() => {
              setIsQRCodeModalOpen(true);
            }}
          >
            <QrCodeIcon className={btnIconStyles} />
            Gerar QR Code
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/plants/${plant.id}`} className={cn(btnStyles, "cursor-pointer")}>
              <EyeIcon className={btnIconStyles} />
              Visualizar Página
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <QRCodeModal
        isOpen={isQRCodeModalOpen}
        onClose={() => setIsQRCodeModalOpen(false)}
        qrValue={`http://localhost:3000/plants/${plant.id}`}
      />
    </>
  );
}
