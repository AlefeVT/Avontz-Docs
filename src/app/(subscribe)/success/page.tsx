import Confetti from "@/components/confetti";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col gap-8 items-center pb-24">
      <h1 className="text-4xl mt-24">Parabéns, sua assinatura foi ativada!</h1>

      <Confetti />

      <p>Estamos prontos para começar. Aproveite todos os recursos disponíveis agora mesmo.</p>

      <Button asChild>
        <Link href={"/dashboard"}>Acessar Painel</Link>
      </Button>
    </div>
  );
}
