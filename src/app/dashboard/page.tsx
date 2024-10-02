import { PageHeader } from '@/components/page-header';
import { cn } from '@/lib/utils';
import { pageTitleStyles } from '@/styles/common';
import { getPlantUseCase } from '@/use-cases/plants';
import { PlantTable } from './_components/plantTable';
import { CreatePlantButton } from './_components/create-plant-button';

export default async function PlantsView() {
  const plantData = await getPlantUseCase();

  return (
    <div>
      <PageHeader>
        <h1
          className={cn(
            pageTitleStyles,
            'flex justify-between items-center flex-wrap gap-4'
          )}
        >
          Plantas
          <CreatePlantButton />
        </h1>

        <p className="text-sm sm:text-md font-semibold text-muted-foreground">
          Organize as plantas cadastrando as categorias onde elas serão
          agrupadas.
        </p>

      </PageHeader>

      <div className={cn('space-y-8 container mx-auto py-12 min-h-screen')}>
        <div className="gap-8">
          <PlantTable
            isLoading={false}
            selectedType="all"
            plants={{
              allPlants: plantData,
            }}
          />
        </div>
      </div>
    </div>
  );
}
