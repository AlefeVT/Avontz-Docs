import { deleteContainerAction } from '@/app/dashboard/actions';
import { toast } from '@/components/ui/use-toast';
import { Container } from '@/db/schema';
import { useState } from 'react';

export function useContainerActions(refreshData: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteContainer = async (
    selectedContainersForDelete: Container[],
    closeModal: () => void
  ) => {
    setIsDeleting(true);
    const ids = selectedContainersForDelete.map((container) => container.id);
    try {
      await deleteContainerAction({ containerId: ids });
      closeModal();
      refreshData();
      toast({
        title: 'Caixa(s) excluída(s) com sucesso!',
        description: `${selectedContainersForDelete.length} caixa(s) foram removidas.`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao excluir caixa(s)',
        description: 'Houve um problema ao excluir as caixa(s).',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, handleDeleteContainer };
}
