import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class UsuarioService {
  private readonly logger = new Logger('UsuarioService');

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // CREATE
  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      // 🔍 Validar email duplicado
      const existeEmail = await this.usuarioRepository.findOneBy({
        email: createUsuarioDto.email,
      });

      if (existeEmail) {
        throw new BadRequestException('El email ya está registrado');
      }

      // 🔍 Validar cédula duplicada
      const existeCedula = await this.usuarioRepository.findOneBy({
        cedula: createUsuarioDto.cedula,
      });

      if (existeCedula) {
        throw new BadRequestException('La cédula ya está registrada');
      }

      const usuario = this.usuarioRepository.create(createUsuarioDto);
      await this.usuarioRepository.save(usuario);

      return usuario;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // GET
  findAll() {
    return this.usuarioRepository.find();
  }

  // GET ONE
  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOneBy({ id });

    if (!usuario)
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);

    return usuario;
  }

  // UPDATE
  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepository.preload({
      id: id,
      ...updateUsuarioDto,
    });

    if (!usuario)
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);

    try {
      await this.usuarioRepository.save(usuario);
      return usuario;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // DELETE
  async remove(id: number) {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
  }

  private handleExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException('Datos duplicados');
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Error en usuario');
  }
}
