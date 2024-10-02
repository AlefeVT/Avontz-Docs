'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { PlantData } from '@/interfaces/PlantData'; 
import { PlantsActions } from './plant-table-actions';

export const columns: (
  routerPush: (url: string) => void,
  setPlantData: (plant: PlantData) => void,
  setIsOpen: (isOpen: boolean) => void,
  setSelectedPlantsForDelete: (plants: PlantData[]) => void,
  setIsDeleteModalOpen: (isOpen: boolean) => void
) => ColumnDef<PlantData>[] = () => [
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
    header: 'Nome da Planta',
    cell: ({ row }) => {
      const plant = row.original;
      return <div className="flex items-center">{plant.name}</div>;
    },
  },
  {
    accessorKey: 'scientificName',
    header: 'Nome Científico',
  },
  {
    accessorKey: 'description',
    header: 'Descrição',
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row, table }) => {
      const plant = row.original;

      return (
        <PlantsActions plant={plant} />
      );
    },
  },
];
