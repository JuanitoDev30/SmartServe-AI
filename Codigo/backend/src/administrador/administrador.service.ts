import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateAdministradorDto } from './dto/create-administrador.dto';
import { UpdateAdministradorDto } from './dto/update-administrador.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrador } from './entities/administrador.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AdministradorService {
  constructor(
    @InjectRepository(Administrador)
    private administradorRepository: Repository<Administrador>,
  ) {}
  async create(
    createAdministradorDto: CreateAdministradorDto,
  ): Promise<Administrador> {
    const existe = await this.administradorRepository.findOneBy({
      email: createAdministradorDto.email,
    });

    if (existe) {
      throw new Error('El administrador ya existe con ese correo electrónico');
    }

    const hashedPassword = await bcrypt.hash(
      createAdministradorDto.password,
      10,
    );

    const admin = this.administradorRepository.create({
      ...createAdministradorDto,
      password: hashedPassword,
    });

    return this.administradorRepository.save(admin);
  }

  async findAll(): Promise<Administrador[]> {
    return this.administradorRepository.find({
      select: ['id', 'nombre', 'email', 'telefono', 'activo', 'creadoEn'],
    });
  }

  async findOne(id: string): Promise<Administrador> {
    const admin = await this.administradorRepository.findOneBy({ id });
    if (!admin) {
      throw new Error('Administrador no encontrado');
    }
    return admin;
  }

  async findByEmail(email: string): Promise<Administrador | null> {
    return this.administradorRepository.findOneBy({ email });
  }

  async update(
    id: string,
    updateAdministradorDto: UpdateAdministradorDto,
  ): Promise<Administrador> {
    const admin = await this.findOne(id);

    if (updateAdministradorDto.password) {
      updateAdministradorDto.password = await bcrypt.hash(
        updateAdministradorDto.password,
        10,
      );
    }

    Object.assign(admin, updateAdministradorDto);
    return this.administradorRepository.save(admin);
  }

  async deactivate(id: string): Promise<Administrador> {
    const admin = await this.findOne(id);
    admin.activo = false;
    return this.administradorRepository.save(admin);
  }

  async getPerfil(id: string): Promise<Omit<Administrador, 'password'>> {
    const admin = await this.findOne(id);

    const { password, ...perfil } = admin;

    return perfil;
  }

  async updatePerfil(
    id: string,
    dto: UpdateAdministradorDto,
  ): Promise<Omit<Administrador, 'password'>> {
    const admin = await this.findOne(id);

    if (dto.email && dto.email !== admin.email) {
      const existe = await this.administradorRepository.findOneBy({
        email: dto.email,
      });
      if (existe) throw new ConflictException('El email ya está en uso');
    }

    Object.assign(admin, dto);
    const actualizado = await this.administradorRepository.save(admin);
    const { password, ...perfil } = actualizado;
    return perfil;
  }

  async changePassword(id: string, dto: ChangePasswordDto): Promise<void> {
    if (dto.passwordNuevo !== dto.passwordConfirm) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const admin = await this.findOne(id);
    const passwordValido = await bcrypt.compare(
      dto.passwordActual,
      admin.password,
    );

    if (!passwordValido) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    admin.password = await bcrypt.hash(dto.passwordNuevo, 10);
    await this.administradorRepository.save(admin);
  }
}
