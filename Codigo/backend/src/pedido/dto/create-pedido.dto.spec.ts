import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreatePedidoDto } from './create-pedido.dto';

const base = {
  items: [{ productoId: '7f9c6e5a-1b2c-4d3e-8f4a-5b6c7d8e9f01', cantidad: 1 }],
  usuarioId: '7f9c6e5a-1b2c-4d3e-8f4a-5b6c7d8e9f01',
  metodoPago: 'EFECTIVO',
};
const errors = async (o: object) =>
  (await validate(plainToInstance(CreatePedidoDto, o))).map((e) => e.property);

describe('CreatePedidoDto', () => {
  it('domicilio sin tipoEntrega exige direccion (compatibilidad)', async () => {
    expect(await errors({ ...base, direccion: 'Calle 45 #12-30' })).toEqual([]);
    expect(await errors({ ...base })).toContain('direccion');
  });
  it('domicilio explicito exige direccion', async () => {
    expect(await errors({ ...base, tipoEntrega: 'DOMICILIO' })).toContain('direccion');
  });
  it('recoger no exige direccion', async () => {
    expect(await errors({ ...base, tipoEntrega: 'RECOGER' })).toEqual([]);
  });
  it('tipoEntrega invalido se rechaza', async () => {
    expect(await errors({ ...base, tipoEntrega: 'VOLANDO', direccion: 'Calle 45 #12-30' })).toContain('tipoEntrega');
  });
});
