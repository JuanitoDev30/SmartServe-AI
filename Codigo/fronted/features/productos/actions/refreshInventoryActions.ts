'use server';
import { revalidatePath } from 'next/cache';

export async function refreshInventoryAction() {
  revalidatePath('/dashboard/inventario');
}
