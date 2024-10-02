'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { btnIconStyles, btnStyles } from '@/styles/icons';
import { InteractiveOverlay } from '@/components/interactive-overlay';
import { CreatePlantsForm } from './create-plant-form';
import { useState } from 'react';

export function CreatePlantButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <InteractiveOverlay
        title={'Criar Caixa'}
        description={
          'Cadastre uma nova planta.'
        }
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        form={<CreatePlantsForm />}
      />

      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        className={btnStyles}
      >
        <PlusCircle className={btnIconStyles} />
        Cadastrar Planta
      </Button>
    </>
  );
}
