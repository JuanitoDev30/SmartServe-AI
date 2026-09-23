import { productRepository } from '../repositories/productRepository';
import {
  IProductRepository,
  UploadImagenResponse,
} from '../repositories/productRepositoryInterface';

class UploadProductImageUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(formData: FormData): Promise<UploadImagenResponse> {
    return this.productRepository.uploadImagen(formData);
  }
}

export const uploadProductImageUseCase = new UploadProductImageUseCase(
  productRepository,
);
