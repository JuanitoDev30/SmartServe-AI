import { Test, TestingModule } from '@nestjs/testing';
import { ProspectoService } from './prospecto.service';

describe('ProspectoService', () => {
  let service: ProspectoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProspectoService],
    }).compile();

    service = module.get<ProspectoService>(ProspectoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
