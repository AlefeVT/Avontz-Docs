import { Button } from '@/components/ui/button';
import { assertAuthenticated } from '@/lib/session';
import { cn } from '@/lib/utils';
import { cardStyles, pageTitleStyles } from '@/styles/common';
import { btnIconStyles, btnStyles } from '@/styles/icons';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';

export default async function DashboardPage() {
  const user = await assertAuthenticated();

  return (
    <>
      <PageHeader>
        <h1
          className={cn(
            pageTitleStyles,
            'flex justify-between items-center flex-wrap gap-4'
          )}
        >
          Painel Geral
        </h1>
      </PageHeader>
      <div className={cn('space-y-8 container mx-auto py-12 min-h-screen')}>
        <div className="flex justify-between items-center">
          <h2 className={'text-2xl'}>Grupos que você gerencia</h2>
        </div>

        <div className="flex justify-between items-center">
          <h2 className={'text-2xl'}>Seus outros grupos</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-gray-200 h-40">aaa</div>

          <div className="bg-gray-200">aaa</div>

          <div className="bg-gray-200">aaa</div>
        </div>
      </div>
    </>
  );
}
