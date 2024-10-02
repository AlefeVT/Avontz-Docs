'use client';

import { Button } from '@/components/ui/button';
import { pageTitleStyles } from '@/styles/common';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignedOutPage() {
  const router = useRouter();
  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <div className="py-24 mx-auto max-w-[500px] space-y-6">
      <h1 className={pageTitleStyles}>Desconectado com sucesso!</h1>
      <p className="text-xl">
        Você foi desconectado com sucesso. Agora você pode fazer login na sua
        conta.
      </p>

      <div className='flex gap-10'>

        <Button asChild>
          <Link href="/sign-in">Entrar</Link>
        </Button>

        <Link href="/">
          <Button className="px-6 py-3 text-sm sm:text-base">
            Voltar para a Página Inicial
          </Button>
        </Link>
      </div>

    </div>
  );
}
