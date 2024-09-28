'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react';
import { ContainerData } from '@/interfaces/ContainerData';

export const columns: (
  routerPush: (url: string) => void,
  setContainerData: (container: ContainerData) => void,
  setIsOpen: (isOpen: boolean) => void,
  setSelectedContainersForDelete: (containers: ContainerData[]) => void,
  setIsDeleteModalOpen: (isOpen: boolean) => void
) => ColumnDef<ContainerData>[] = (
  routerPush,
  setContainerData,
  setIsOpen,
  setSelectedContainersForDelete,
  setIsDeleteModalOpen
) => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Nome da Caixa',
    cell: ({ row }) => {
      const container = row.original;
      return <div className="flex items-center">{container.name}</div>;
    },
  },
  {
    accessorKey: 'description',
    header: 'Descrição',
  },
  {
    accessorKey: 'filesCount',
    header: 'Quantidade de Documentos',
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row, table }) => {
      const container = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button
                className="flex justify-start h-6 w-full"
                variant={'ghost'}
                onClick={() => {
                  setContainerData(container);
                  setIsOpen(true);
                }}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                className="flex justify-start h-6 w-full"
                variant={'ghost'}
                onClick={() => {
                  setSelectedContainersForDelete([container]);
                  setIsDeleteModalOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                const selectedContainers = table
                  .getRowModel()
                  .rows.map((row) => row.original);

                const selectedContainerIds = Object.keys(
                  table.getState().rowSelection
                )
                  .filter((key) => table.getState().rowSelection[key])
                  .map((key) => {
                    const index = parseInt(key, 10);
                    return selectedContainers[index];
                  });

                if (selectedContainerIds.length > 0) {
                  setSelectedContainersForDelete(selectedContainerIds);
                  setIsDeleteModalOpen(true);
                }
              }}
              disabled={Object.keys(table.getState().rowSelection).length === 0}
              className="flex items-center cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2 text-red-600" />
              Excluir Selecionados
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
