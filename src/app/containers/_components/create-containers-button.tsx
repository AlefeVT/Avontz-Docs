'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { btnIconStyles, btnStyles } from '@/styles/icons';
import { InteractiveOverlay } from '@/components/interactive-overlay';
import { CreateContainerForm } from './create-containers-form';
import { useState } from 'react';

export function CreateContainerButton({
  containerOptions,
}: {
  containerOptions: any[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <InteractiveOverlay
        title={'Criar Caixa'}
        description={
          'Crie um nova caixa para começar a gerenciar seus documentos.'
        }
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
        Criar caixa
      </Button>
    </>
  );
}
