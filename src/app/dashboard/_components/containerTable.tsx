'use client';

import * as React from 'react';
import {
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
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { InteractiveOverlay } from '@/components/interactive-overlay';
import { DeleteModal } from '@/components/delete-modal';
import { Skeleton } from '@/components/ui/skeleton';
import { columns } from './table/columns';
import { PaginationButton } from '@/components/PaginationButton';
import { useContainerActions } from '@/hooks/Container/useContainerActions';
import { SearchBar } from './containerSearchBar';
import { EditContainerForm } from './edit-containers-form';
import { Container } from '@/db/schema';

interface ContainerTableProps {
  containers: {
    containers: Container[];
  };
  isLoading: boolean;
  selectedType: string;
}

export function ContainerTable({
  containers,
  isLoading,
  selectedType: initialSelectedType,
}: ContainerTableProps) {
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedType, setSelectedType] = React.useState(initialSelectedType);
  const [isOpen, setIsOpen] = React.useState(false);
  const [containerData, setContainerData] = React.useState<Container | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedContainersForDelete, setSelectedContainersForDelete] =
    React.useState<Container[]>([]);

  const router = useRouter();

  const refreshData = () => {
    router.refresh();
    setRowSelection({});
  };

  const { isDeleting, handleDeleteContainer } =
    useContainerActions(refreshData);

  const filteredData = React.useMemo(() => {
    let data = containers.containers;

    if (searchTerm) {
      data = data.filter((container) =>
        container.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return data;
  }, [containers, searchTerm, selectedType]);

  const table = useReactTable({
    data: filteredData,
    columns: columns(
      router.push,
      setContainerData,
      setIsOpen,
      setSelectedContainersForDelete,
      setIsDeleteModalOpen
    ),
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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-card">
          <thead>
            <tr>
              {Array.from({ length: 4 }).map((_, index) => (
                <th
                  key={index}
                  className="px-6 py-3 border-b-2 border-border text-left"
                >
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
    );
  }

  return (
    <>
      <div className="flex justify-between mb-10">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns(
                        router.push,
                        setContainerData,
                        setIsOpen,
                        setSelectedContainersForDelete,
                        setIsDeleteModalOpen
                      ).length
                    }
                    className="h-24 text-center"
                  >
                    <div className="font-medium gap-4 p-4 items-center flex flex-col text-center">
                      <Image
                        height={250}
                        width={250}
                        src="/empty-state/empty_folder.svg"
                        alt="Imagem de pasta vazia"
                      />
                      Nenhuma caixa encontrada.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <PaginationButton
            label="Anterior"
            onClick={table.previousPage}
            disabled={!table.getCanPreviousPage()}
          />
          <PaginationButton
            label="Próximo"
            onClick={table.nextPage}
            disabled={!table.getCanNextPage()}
          />
        </div>
      </div>

      {containerData && (
        <InteractiveOverlay
          title="Editar Caixa"
          description=""
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          form={
            <EditContainerForm
              container={{
                ...containerData,
                description: containerData?.description || '',
              }}
            />
          }
        />
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Excluir caixa(s)"
        description={`Tem certeza de que deseja excluir ${
          selectedContainersForDelete.length === 1
            ? `a planta ${selectedContainersForDelete[0]?.name}`
            : `${selectedContainersForDelete.length} caixas`
        }? Todos os dados e arquivos pertencentes a essas caixas serão removidos.`}
        onConfirm={async () => {
          await handleDeleteContainer(selectedContainersForDelete, () => {
            setIsDeleteModalOpen(false);
            setSelectedContainersForDelete([]);
          });
        }}
        isPending={isDeleting}
      />
    </>
  );
}
