import { Button } from "@/components/ui/button";
import { pageTitleStyles } from "@/styles/common";
import Link from "next/link";

export default function VerifySuccess() {
  return (
    <div className="py-24 mx-auto max-w-[400px] space-y-6">
      <h1 className={pageTitleStyles}>E-mail verificado com sucesso</h1>
      <p className="text-xl">
      Seu e-mail foi verificado com sucesso. Agora você pode fazer login no seu
      conta.
      </p>

      <Button asChild>
        <Link href="/sign-in">Entrar</Link>
      </Button>
    </div>
  );
}
