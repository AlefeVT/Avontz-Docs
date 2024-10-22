'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { btnIconStyles, btnStyles } from '@/styles/icons';
import { InteractiveOverlay } from '@/components/interactive-overlay';
import { CreateContainerForm } from './create-container-form';
import { useState } from 'react';

export function CreatePlantButton({
  containerOptions,
}: {
  containerOptions: any[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <InteractiveOverlay
        title={'Criar Caixa'}
        description={'Cadastre uma nova caixa.'}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        form={<CreateContainerForm containersOptions={containerOptions} />}
      />

      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        className={btnStyles}
      >
        <PlusCircle className={btnIconStyles} />
        Cadastrar Caixa
      </Button>
    </>
  );
}