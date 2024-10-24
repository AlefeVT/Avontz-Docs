import { PageHeader } from '@/components/page-header';
import { cn } from '@/lib/utils';
import { pageTitleStyles } from '@/styles/common';

export default async function ContainersView() {

  return (
    <div>
      <PageHeader>
        <h1
          className={cn(
            pageTitleStyles,
            'flex justify-between items-center flex-wrap gap-4'
          )}
        >
          Painel Geral
        </h1>

        <p className="text-sm sm:text-md font-semibold text-muted-foreground">
          Organize seus documentos cadastrando as caixas onde eles serão
          armazenados e facilmente acessados.
        </p>
      </PageHeader>

      <div className={cn('space-y-8 container mx-auto py-12 min-h-screen')}>
        <div className="gap-8">
          aaa
        </div>
      </div>
    </div>
  );
}
