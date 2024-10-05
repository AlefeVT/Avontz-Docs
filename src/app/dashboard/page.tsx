import { PageHeader } from '@/components/page-header';
import { cn } from '@/lib/utils';
import { pageTitleStyles } from '@/styles/common';
import { CreatePlantButton } from './_components/create-container-button';
import { getContainersUseCase } from '@/use-cases/containers';


export default async function ContainersView() {
  const containerData = await getContainersUseCase();

  return (
    <div>
      <PageHeader>
        <h1
          className={cn(
            pageTitleStyles,
            'flex justify-between items-center flex-wrap gap-4'
          )}
        >
          Caixas
          <CreatePlantButton containerOptions={containerData} />
        </h1>

        <p className="text-sm sm:text-md font-semibold text-muted-foreground">
        Organize seus documentos cadastrando as caixas onde eles serão armazenados e facilmente acessados.
        </p>

      </PageHeader>

      <div className={cn('space-y-8 container mx-auto py-12 min-h-screen')}>
        <div className="gap-8">
          {/* <ContainerTable
            isLoading={false}
            selectedType="all"
            containers={{
              containers: containerData,
            }}
          /> */}
        </div>
      </div>
    </div>
  );
}
