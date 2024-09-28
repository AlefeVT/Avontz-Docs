import { toast } from '@/components/ui/use-toast';
import { ContainerData } from '@/interfaces/ContainerData';
import { useState } from 'react';
import { deleteContainerAction } from '@/app/containers/actions';

export function useContainerActions(refreshData: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteContainers = async (
    selectedContainersForDelete: ContainerData[],
    closeModal: () => void
  ) => {
    setIsDeleting(true);
    const ids = selectedContainersForDelete.map((container) => container.id);
    try {
      await deleteContainerAction({ ids });
      closeModal();
      refreshData();
      toast({
        title: 'Caixa(s) excluída(s) com sucesso!',
        description: `${selectedContainersForDelete.length} caixa(s) foram removidas.`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao excluir caixas',
        description: 'Houve um problema ao excluir as caixas.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, handleDeleteContainers };
}
