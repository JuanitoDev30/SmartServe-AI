import api from '@/db/axios';
import { CreateProductDto } from '@/features/products/types/product';

async function getProducts() {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error cargando productos:', error);
    return null;
  }
}

export const createProduct = async (Data: CreateProductDto) => {
  try {
    const response = await api.post('/products', Data);
    return response.data;
  } catch (error) {
    console.error('Error creando producto:', error);
    return null;
  }
};

export const getProductById = async (id: string) => {
  const res = await api.get('/producto/${id}');
  return res.data;
};

// Actualizar
export const updateProduct = async (
  id: string,
  data: Partial<CreateProductDto>,
) => {
  const res = await api.patch('/producto/${id}', data);
  return res.data;
};

// Eliminar
export const deleteProduct = async (id: string) => {
  const res = await api.delete('/producto/${id}');
  return res.data;
};
