'use server';

import { revalidatePath } from 'next/cache';

export const refreshInventoryAction = async () => {
  try {
    revalidatePath('/dashboard/inventario');
  } catch (error) {
    console.log(error);
  }
};
