'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ContainerData } from '@/interfaces/Container';
import { ContainersActions } from './container-table-actions';

export const columns: (
  routerPush: (url: string) => void,
  setContainerData: (container: ContainerData) => void,
  setIsOpen: (isOpen: boolean) => void,
  setSelectedContainersForDelete: (containers: ContainerData[]) => void,
  setIsDeleteModalOpen: (isOpen: boolean) => void
) => ColumnDef<ContainerData>[] = () => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar tudo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
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
    id: 'actions',
    header: 'Ações',
    cell: ({ row, table }) => {
      const container = row.original;

      return (
        <ContainersActions container={container} />
      );
    },
  },
];
