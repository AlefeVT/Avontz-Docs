"use client";

import { cn } from "@/lib/utils";
import React from "react";

const cellClass =
  "flex items-center justify-center rounded-xl bg-green-800 p-4 text-xl text-center";

export function TheProblemSection() {
  return (
    <div className="relative overflow-x-clip">
      <div className="z-10 absolute w-[2000px] dark:bg-background rotate-6 h-[200px] top-[20px] -left-[300px]"></div>
      <div className="z-10 absolute w-[2000px] dark:bg-background -rotate-6 h-[200px] top-[20px] -left-[300px]"></div>
      <section
        id="features"
        className="z-20 relative container mx-auto py-12 pt-24 bg-gray-100 dark:bg-background"
      >
        <p className="text-6xl mb-24 max-w-4xl mx-auto text-center">
          Eu sei, você sabe, começar um projeto tem{" "}
          <span className="font-bold">muitas opções</span>...
        </p>

        <div className="grid grid-cols-3 gap-12 mb-24">
          <p className={cn(cellClass, "bg-green-800")}>
            1. Apenas execute seu comando favorito npx create... ah, espera, eu
            devo usar next? vite? nuxt? sveltekit? alguém disse usar angular 😊
          </p>

          <p className={cn(cellClass, "bg-cyan-800")}>
            2. Agora encontre uma biblioteca de componentes que não seja ruim.
            DaisyUI? Mantine? Chakra? Instale-a, configure-a, descubra que foi
            um erro. 🤔
          </p>

          <p className={cn(cellClass, "bg-blue-800")}>
            3. Mas como os usuários irão se registrar? ler a documentação do
            lucia-auth é terrível. Como descubro se alguém está autenticado E
            autorizado a ver aquele botão? 🫠
          </p>

          <p className={cn(cellClass, "bg-yellow-800")}>
            4. Oh não, onde devo armazenar meus dados? Qual ORM usar? Com
            certeza não DynamoDB. Onde armazeno meus arquivos? R2, S3? 😟
          </p>

          <p className={cn(cellClass, "bg-pink-800")}>
            5. Agora você precisa implantar seu aplicativo, mas onde isso não
            vai te falir em caso de um ataque DDoS? Railway? Vercel? AWS? Um
            VPS?! 😖
          </p>

          <p className={cn(cellClass, "bg-red-800")}>
            6. ESPERA você esqueceu aquela variável de ambiente pela 3ª vez e
            tem que reimplantar porque não usou uma biblioteca de env typesafe
            desde o início 🤬
          </p>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900 py-24">
        <p className="text-4xl text-center max-w-xl mx-auto mb-12">
          Eu já construí MUITOS projetos e perdi muito tempo configurando o
          projeto inicial.
        </p>

        <p className="text-4xl text-center max-w-xl mx-auto mb-12">
          <span className="rotate-3 text-blue-300">Confie em mim...</span>{" "}
          você vai querer um kit de inicialização. É por isso que estou usando
          isso para todos os meus produtos SaaS.
        </p>

        <p className="text-6xl text-center max-w-xl mx-auto text-green-400">
          vamos para as partes divertidas!
        </p>
      </section>
    </div>
  );
}
