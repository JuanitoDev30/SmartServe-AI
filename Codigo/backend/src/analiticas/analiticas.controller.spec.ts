import { Test, TestingModule } from '@nestjs/testing';
import { AnaliticasController } from './analiticas.controller';
import { AnaliticasService } from './analiticas.service';

describe('AnaliticasController', () => {
  let controller: AnaliticasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnaliticasController],
      providers: [AnaliticasService],
    }).compile();

    controller = module.get<AnaliticasController>(AnaliticasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
