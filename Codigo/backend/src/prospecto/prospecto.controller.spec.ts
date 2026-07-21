import { Test, TestingModule } from '@nestjs/testing';
import { ProspectoController } from './prospecto.controller';
import { ProspectoService } from './prospecto.service';

describe('ProspectoController', () => {
  let controller: ProspectoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProspectoController],
      providers: [ProspectoService],
    }).compile();

    controller = module.get<ProspectoController>(ProspectoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
