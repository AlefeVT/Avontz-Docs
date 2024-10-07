import {
  EllipsisVertical,
  PencilIcon,
  TrashIcon,
  QrCodeIcon,
  EyeIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteModal } from '@/components/delete-modal';
import { useServerAction } from 'zsa-react';
import { btnIconStyles, btnStyles } from '@/styles/icons';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { InteractiveOverlay } from '@/components/interactive-overlay';
import Link from 'next/link';
import { Container } from '@/db/schema';
import { deleteContainerAction } from '../../actions';
import { EditContainerForm } from '../edit-containers-form';

export function ContainersActions({ container }: { container: Container }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditContainerOpen, setIsEditContainerOpen] = useState(false);
  const { execute, isPending } = useServerAction(deleteContainerAction, {
    onSuccess() {
      setIsOpen(false);
    },
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <InteractiveOverlay
        isOpen={isEditContainerOpen}
        setIsOpen={setIsEditContainerOpen}
        title={'Editar Caixa'}
        description={'Editar detalhes da caixa.'}
        form={<EditContainerForm container={container} />}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Excluir Caixa"
        description="Tem certeza de que deseja excluir esta caixa?"
        onConfirm={() => {
          execute({
            containerId: [container.id],
          });
        }}
        isPending={isPending}
      />

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={'icon'} style={{ cursor: 'pointer' }}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setIsEditContainerOpen(true);
            }}
            className={cn(btnStyles, 'cursor-pointer')}
          >
            <PencilIcon className={btnIconStyles} />
            Editar Caixa
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(btnStyles, 'cursor-pointer')}
            onClick={() => {
              setIsDeleteModalOpen(true);
            }}
          >
            <TrashIcon className={btnIconStyles} />
            Remover Caixa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
