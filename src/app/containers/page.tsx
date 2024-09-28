import { PageHeader } from '@/components/page-header';
import { cn } from '@/lib/utils';
import { pageTitleStyles } from '@/styles/common';
import { CreateContainerButton } from './_components/create-containers-button';
import { getContainersData } from '@/use-cases/containers';
import { ContainerTable } from './_components/containerTable';

export default async function ContainersView() {
  const containersData = await getContainersData();

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
          <CreateContainerButton
            containerOptions={containersData.containersWithoutChildren || []}
          />
        </h1>

        <p className="text-sm sm:text-md font-semibold text-muted-foreground">
          Organize os documentos cadastrando as caixas onde eles serão
          armazenados.
        </p>
      </PageHeader>

      <div className={cn('space-y-8 container mx-auto py-12 min-h-screen')}>
        <div className="gap-8">
          <ContainerTable
            containers={containersData}
            isLoading={false}
            selectedType={'all'}
          />
        </div>
      </div>
    </div>
  );
}
