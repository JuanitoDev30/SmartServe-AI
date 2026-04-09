import { refreshInventoryAction } from '@/features/products/actions/refreshInventoryActions';
import { startTransition } from 'react';

interface ProductFormDataProps {
  isEdit: boolean;
}

export default function useInventoryFormHandler({
  isEdit,
}: ProductFormDataProps) {
  const refresh = async () => {
    startTransition(async () => {
      refreshInventoryAction();
    });
  };
  return {
    refresh,
  };
}
