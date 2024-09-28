import { useMemo } from 'react';
import { ContainerData } from '@/interfaces/ContainerData';

export function useFilteredContainers(
  containers: {
    allContainers: ContainerData[];
    containersWithoutParent: ContainerData[];
    containersWithoutChildren: ContainerData[] | null;
  },
  selectedType: string,
  searchTerm: string
) {
  return useMemo(() => {
    let filteredContainers = containers.allContainers;

    if (selectedType === 'no-parent') {
      filteredContainers = containers.containersWithoutParent;
    } else if (selectedType === 'no-children') {
      filteredContainers = containers.containersWithoutChildren || [];
    }

    if (searchTerm) {
      filteredContainers = filteredContainers.filter((container) =>
        container.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredContainers;
  }, [containers, selectedType, searchTerm]);
}
