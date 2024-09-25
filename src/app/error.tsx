"use client";

import { AUTHENTICATION_ERROR_MESSAGE } from "@/app/util";
import { Button } from "@/components/ui/button";
import { pageTitleStyles } from "@/styles/common";
import Link from "next/link";

export default function PaginaDeErro({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const ehErroDeAutenticacao = error.message.includes(
    AUTHENTICATION_ERROR_MESSAGE
  );

  return (
    <div className="container mx-auto py-12 min-h-screen space-y-8">
      {ehErroDeAutenticacao ? (
        <>
          <h1 className={pageTitleStyles}>Ops! Você precisa estar logado</h1>
          <p className="text-lg">
            Para acessar esta página, faça login primeiro.
          </p>

          <Button asChild>
            <Link href="/sign-in">Entrar</Link>
          </Button>
        </>
      ) : (
        <>
          <h1 className={pageTitleStyles}>Ops! Algo deu errado</h1>
          <p className="text-lg">{error.message}</p>
        </>
      )}
    </div>
  );
}
