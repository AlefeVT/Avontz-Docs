import { Button } from "@/components/ui/button";
import { pageTitleStyles } from "@/styles/common";
import Link from "next/link";

export default function MagicLinkPage() {
  return (
    <div className="py-24 mx-auto max-w-[400px] space-y-6">
      <h1 className={pageTitleStyles}>Token expirado</h1>
      <p className="text-xl">
      Desculpe, este token expirou ou já foi usado. Por favor, tente fazer login
      de novo
      </p>

      <Button asChild>
        <Link href="/sign-in">Entrar</Link>
      </Button>
    </div>
  );
}
