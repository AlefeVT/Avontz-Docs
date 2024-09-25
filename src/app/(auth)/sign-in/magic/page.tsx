import { pageTitleStyles } from "@/styles/common";

export default function MagicLinkPage() {
  return (
    <div className="py-24 mx-auto max-w-[400px] space-y-6">
      <h1 className={pageTitleStyles}>Verifique seu e-mail</h1>
      <p className="text-xl">
        Enviamos a você um link mágico para fazer login. Clique no link em seu e-mail para
        entrar.
      </p>
    </div>
  );
}
