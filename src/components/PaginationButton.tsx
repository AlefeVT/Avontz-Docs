import { Button } from '@/components/ui/button';

interface PaginationButtonProps {
  label: string;
  onClick: () => void;
  disabled: boolean;
}

export const PaginationButton = ({
  label,
  onClick,
  disabled,
}: PaginationButtonProps) => (
  <Button variant="outline" size="sm" onClick={onClick} disabled={disabled}>
    {label}
  </Button>
);
