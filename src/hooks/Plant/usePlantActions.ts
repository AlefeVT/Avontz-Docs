import { deletePlantAction } from '@/app/dashboard/actions';
import { toast } from '@/components/ui/use-toast';
import { PlantData } from '@/interfaces/PlantData';
import { useState } from 'react';

export function usePlantActions(refreshData: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePlants = async (
    selectedPlantsForDelete: PlantData[],
    closeModal: () => void
  ) => {
    setIsDeleting(true);
    const ids = selectedPlantsForDelete.map((plant) => plant.id);
    try {
      await deletePlantAction({ ids });
      closeModal();
      refreshData();
      toast({
        title: 'Planta(s) excluída(s) com sucesso!',
        description: `${selectedPlantsForDelete.length} planta(s) foram removidas.`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao excluir plantas',
        description: 'Houve um problema ao excluir as plantas.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, handleDeletePlants };
}
