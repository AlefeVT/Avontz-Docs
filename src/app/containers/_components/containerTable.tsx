'use client';

import * as React from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchBar } from './containerSearchBar';
import ContainerTypeSelect from './containerTypeSelect';
import { ContainerData } from '@/interfaces/ContainerData';

interface ContainerTableProps {
  containers: {
    allContainers: ContainerData[];
    containersWithoutParent: ContainerData[];
    containersWithoutChildren: ContainerData[] | null;
  };
  isLoading: boolean;
  selectedType: string;
}

export const columns: (
  routerPush: (url: string) => void
) => ColumnDef<ContainerData>[] = (routerPush) => [
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
              <Link
                href={`/dashboard/container/${container.id}`}
                className="flex items-center w-full"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={`/dashboard/container/${container.id}/delete`}
                className="flex items-center w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Link>
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
                    const selectedContainer = selectedContainers[index];
                    return selectedContainer?.id;
                  })
                  .filter((id) => id !== undefined);

                if (selectedContainerIds.length > 0) {
                  const idsString = selectedContainerIds.join(',');
                  routerPush(`/dashboard/container/${idsString}/delete`);
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

export function ContainerTable({
  containers,
  isLoading,
  selectedType,
}: ContainerTableProps) {
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = React.useState<string>('');

  const router = useRouter();

  let dataToShow = containers.allContainers;
  if (selectedType === 'no-parent') {
    dataToShow = containers.containersWithoutParent;
  } else if (selectedType === 'no-children') {
    dataToShow = containers.containersWithoutChildren || [];
  }

  const table = useReactTable({
    data: dataToShow || [], // Se estiver carregando, usa um array vazio
    columns: columns(router.push),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between">
          <SearchBar searchTerm={searchTerm} setSearchTerm={() => {}} />
          <ContainerTypeSelect onSelectType={() => {}} />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-card">
            <thead>
              <tr>
                {Array.from({ length: 4 }).map((_, index) => (
                  <th key={index} className="px-6 py-3 border-b-2 border-border text-left">
                    <Skeleton className="h-4 w-3/4 bg-muted" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <td key={idx} className="px-6 py-4 border-b border-border">
                      <Skeleton className="h-4 w-3/4 bg-muted" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns(router.push).length} className="h-24 text-center">
                  <div className="font-medium gap-4 p-4 items-center flex flex-col text-center">
                    <Image height={150} width={150} src="/empty-state/no-data.svg" alt="Imagem de pasta vazia" />
                    Nenhuma caixa encontrada.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}
