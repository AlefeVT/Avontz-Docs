import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col gap-8 items-center pb-24">
      <h1 className="text-4xl mt-24">Não está pronto para assinar? Sem problemas!</h1>

      <p className="text-2xl max-w-xl text-center">
        Aproveite nosso plano gratuito enquanto você decide se o premium é o ideal para você.
      </p>

      <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400 py-4">
        <Button variant="secondary" asChild size="lg">
          <Link
            target="_blank"
            href="/dashboard"
          >
            🆓 Explore seu plano gratuito! 🆓
          </Link>
        </Button>
      </p>

      <Button variant="default" asChild size="lg">
        <Link href="/">
          <ChevronLeft className="w-4 h-4 mr-2" /> Deixe minha página inicial te convencer
        </Link>
      </Button>
    </div>

  );
}
