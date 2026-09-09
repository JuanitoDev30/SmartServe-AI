import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';

import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { DisponibilidadDto } from './dto/disponibilidad.dto';
import { FiltrosReservaDto } from './dto/filtros-reserva.dto';
import { Reserva } from './entities/reserva.entity';
import { ESTADOS_ACTIVOS, EstadoReserva } from './enum/reservaEstado.enum';
import { OrigenReserva } from './enum/origenReserva.enum';
import { ReservaGateway } from './reserva.gateway';
import { Mesa } from '../mesa/entities/mesa.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { ClienteService } from '../cliente/cliente.service';

const DURACION_POR_DEFECTO = 90;

// Colombia no tiene horario de verano: el desfase es fijo y permite
// acotar "un día" del restaurante sin arrastrar una librería de zonas.
const OFFSET_LOCAL = '-05:00';

const TRANSICIONES_VALIDAS: Record<EstadoReserva, EstadoReserva[]> = {
  [EstadoReserva.PENDIENTE]: [
    EstadoReserva.CONFIRMADA,
    EstadoReserva.CANCELADA,
    EstadoReserva.NO_ASISTIO,
  ],
  [EstadoReserva.CONFIRMADA]: [
    EstadoReserva.SENTADA,
    EstadoReserva.CANCELADA,
    EstadoReserva.NO_ASISTIO,
  ],
  [EstadoReserva.SENTADA]: [EstadoReserva.COMPLETADA],
  [EstadoReserva.COMPLETADA]: [],
  [EstadoReserva.CANCELADA]: [],
  [EstadoReserva.NO_ASISTIO]: [],
};

// Una vez cerrada la reserva ya no se editan sus datos
const ESTADOS_CERRADOS: EstadoReserva[] = [
  EstadoReserva.COMPLETADA,
  EstadoReserva.CANCELADA,
  EstadoReserva.NO_ASISTIO,
];

@Injectable()
export class ReservaService {
  private readonly logger = new Logger(ReservaService.name);

  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,

    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,

    private readonly clienteService: ClienteService,
    private readonly reservaGateway: ReservaGateway,
  ) {}

  // CREATE
  async create(createReservaDto: CreateReservaDto): Promise<Reserva> {
    try {
      const {
        clienteId,
        cliente: clienteNuevo,
        mesaId,
        fechaHora,
        duracionMinutos = DURACION_POR_DEFECTO,
        numeroPersonas,
        estado,
        origen,
        notas,
      } = createReservaDto;

      const cliente = await this.resolverCliente(clienteId, clienteNuevo);

      const inicio = this.parsearFecha(fechaHora);
      const fin = this.calcularFin(inicio, duracionMinutos);

      if (inicio.getTime() < Date.now() - 60_000) {
        throw new BadRequestException(
          'La reserva no puede agendarse en el pasado',
        );
      }

      const mesa = mesaId
        ? await this.validarMesaLibre(mesaId, inicio, fin, numeroPersonas)
        : await this.asignarMesaAutomatica(inicio, fin, numeroPersonas);

      const reserva = this.reservaRepository.create({
        cliente,
        mesa,
        fechaHora: inicio,
        duracionMinutos,
        numeroPersonas,
        estado: estado ?? EstadoReserva.PENDIENTE,
        origen: origen ?? OrigenReserva.DASHBOARD,
        notas,
      });

      const guardada = await this.reservaRepository.save(reserva);

      this.reservaGateway.emitirNuevaReserva(guardada);

      return guardada;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // GET ALL
  async findAll(filtros: FiltrosReservaDto = {}): Promise<Reserva[]> {
    const { estado, fecha, mesaId, clienteId } = filtros;

    return this.reservaRepository.find({
      where: {
        ...(estado ? { estado } : {}),
        ...(mesaId ? { mesa: { id: mesaId } } : {}),
        ...(clienteId ? { cliente: { id: clienteId } } : {}),
        ...(fecha ? { fechaHora: Between(...this.rangoDelDia(fecha)) } : {}),
      },
      order: { fechaHora: 'ASC' },
    });
  }

  // GET ONE
  async findOne(id: string): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOneBy({ id });
    if (!reserva) throw new NotFoundException(`Reserva ${id} no encontrada`);
    return reserva;
  }

  // Agenda del día: /reserva/agenda?fecha=YYYY-MM-DD (por defecto, hoy)
  async findByFecha(fecha?: string): Promise<Reserva[]> {
    const dia = fecha ?? this.fechaLocalISO(new Date());

    return this.reservaRepository.find({
      where: { fechaHora: Between(...this.rangoDelDia(dia)) },
      order: { fechaHora: 'ASC' },
    });
  }

  async findProximas(limite = 10): Promise<Reserva[]> {
    return this.reservaRepository.find({
      where: {
        fechaHora: Between(new Date(), this.finDelHorizonte()),
        estado: In([EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA]),
      },
      order: { fechaHora: 'ASC' },
      take: limite,
    });
  }

  async findByCliente(clienteId: string): Promise<Reserva[]> {
    return this.reservaRepository.find({
      where: { cliente: { id: clienteId } },
      order: { fechaHora: 'DESC' },
    });
  }

  /**
   * Estado de todas las mesas para una franja horaria concreta. La UI la
   * usa para pintar el selector de mesa al crear o mover una reserva.
   */
  async disponibilidad(dto: DisponibilidadDto) {
    const {
      fechaHora,
      duracionMinutos = DURACION_POR_DEFECTO,
      numeroPersonas,
      excluirReservaId,
    } = dto;

    const inicio = this.parsearFecha(fechaHora);
    const fin = this.calcularFin(inicio, duracionMinutos);

    const [mesas, ocupadas] = await Promise.all([
      this.mesaRepository.find({ order: { numero: 'ASC' } }),
      this.mesasOcupadasEn(inicio, fin, excluirReservaId),
    ]);

    const mesasEvaluadas = mesas.map((mesa) => {
      const motivo = !mesa.activa
        ? 'Mesa fuera de servicio'
        : ocupadas.has(mesa.id)
          ? 'Ocupada en ese horario'
          : numeroPersonas && mesa.capacidad < numeroPersonas
            ? `Capacidad para ${mesa.capacidad} personas`
            : null;

      return { mesa, disponible: motivo === null, motivo };
    });

    return {
      inicio: inicio.toISOString(),
      fin: fin.toISOString(),
      mesas: mesasEvaluadas,
      totalDisponibles: mesasEvaluadas.filter((m) => m.disponible).length,
    };
  }

  // UPDATE — datos de la reserva; el estado tiene su propio endpoint
  async update(id: string, updateReservaDto: UpdateReservaDto) {
    try {
      const reserva = await this.findOne(id);

      if (ESTADOS_CERRADOS.includes(reserva.estado)) {
        throw new BadRequestException(
          `No se puede editar una reserva ${reserva.estado}`,
        );
      }

      const { mesaId, fechaHora, duracionMinutos, numeroPersonas, notas } =
        updateReservaDto;

      const inicio = fechaHora
        ? this.parsearFecha(fechaHora)
        : reserva.fechaHora;
      const duracion = duracionMinutos ?? reserva.duracionMinutos;
      const personas = numeroPersonas ?? reserva.numeroPersonas;
      const fin = this.calcularFin(inicio, duracion);

      const cambiaFranja =
        fechaHora !== undefined ||
        duracionMinutos !== undefined ||
        numeroPersonas !== undefined ||
        (mesaId !== undefined && mesaId !== reserva.mesa.id);

      if (cambiaFranja) {
        reserva.mesa = await this.validarMesaLibre(
          mesaId ?? reserva.mesa.id,
          inicio,
          fin,
          personas,
          reserva.id,
        );
      }

      if (updateReservaDto.cliente) {
        await this.clienteService.update(
          reserva.cliente.id,
          updateReservaDto.cliente,
        );
      }

      reserva.fechaHora = inicio;
      reserva.duracionMinutos = duracion;
      reserva.numeroPersonas = personas;
      if (notas !== undefined) reserva.notas = notas;

      await this.reservaRepository.save(reserva);

      const actualizada = await this.findOne(id);
      this.reservaGateway.emitirReservaActualizada(actualizada);
      return actualizada;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // Cambio de estado con validación de transiciones
  async cambiarEstado(
    id: string,
    estado: EstadoReserva,
    motivoCancelacion?: string,
  ): Promise<Reserva> {
    try {
      const reserva = await this.findOne(id);

      if (estado === reserva.estado) return reserva;

      const permitidos = TRANSICIONES_VALIDAS[reserva.estado];

      if (!permitidos.includes(estado)) {
        throw new BadRequestException(
          `Transición inválida: ${reserva.estado} → ${estado}`,
        );
      }

      reserva.estado = estado;

      if (estado === EstadoReserva.CANCELADA) {
        reserva.motivoCancelacion = motivoCancelacion;
      }

      await this.reservaRepository.save(reserva);

      const actualizada = await this.findOne(id);
      this.reservaGateway.emitirReservaActualizada(actualizada);
      return actualizada;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string): Promise<{ mensaje: string }> {
    const reserva = await this.findOne(id);
    await this.reservaRepository.remove(reserva);
    this.reservaGateway.emitirReservaEliminada(id);
    return { mensaje: 'Reserva eliminada' };
  }

  // STATS
  async getStats() {
    const ahora = new Date();
    const hoy = this.fechaLocalISO(ahora);
    const [inicioHoy, finHoy] = this.rangoDelDia(hoy);

    const mesInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const mesAnteriorInicio = new Date(
      ahora.getFullYear(),
      ahora.getMonth() - 1,
      1,
    );
    const mesAnteriorFin = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      0,
      23,
      59,
      59,
      999,
    );

    const [
      reservasHoy,
      mesasActivas,
      totalMes,
      totalMesAnterior,
      canceladasMes,
      canceladasMesAnterior,
      noAsistioMes,
    ] = await Promise.all([
      this.reservaRepository.find({
        where: { fechaHora: Between(inicioHoy, finHoy) },
      }),
      this.mesaRepository.count({ where: { activa: true } }),
      this.reservaRepository.count({
        where: { fechaHora: Between(mesInicio, ahora) },
      }),
      this.reservaRepository.count({
        where: { fechaHora: Between(mesAnteriorInicio, mesAnteriorFin) },
      }),
      this.reservaRepository.count({
        where: {
          estado: EstadoReserva.CANCELADA,
          fechaHora: Between(mesInicio, ahora),
        },
      }),
      this.reservaRepository.count({
        where: {
          estado: EstadoReserva.CANCELADA,
          fechaHora: Between(mesAnteriorInicio, mesAnteriorFin),
        },
      }),
      this.reservaRepository.count({
        where: {
          estado: EstadoReserva.NO_ASISTIO,
          fechaHora: Between(mesInicio, ahora),
        },
      }),
    ]);

    const vigentesHoy = reservasHoy.filter(
      (reserva) => !ESTADOS_CERRADOS.includes(reserva.estado),
    );

    const mesasOcupadasHoy = new Set(
      vigentesHoy.map((reserva) => reserva.mesa.id),
    ).size;

    const calcVariacion = (actual: number, anterior: number) => {
      if (anterior === 0) return actual > 0 ? 100 : 0;
      return Math.round(((actual - anterior) / anterior) * 100);
    };

    return {
      hoy: {
        total: reservasHoy.length,
        pendientes: reservasHoy.filter(
          (r) => r.estado === EstadoReserva.PENDIENTE,
        ).length,
        confirmadas: reservasHoy.filter(
          (r) => r.estado === EstadoReserva.CONFIRMADA,
        ).length,
        sentadas: reservasHoy.filter((r) => r.estado === EstadoReserva.SENTADA)
          .length,
        comensales: vigentesHoy.reduce((sum, r) => sum + r.numeroPersonas, 0),
      },
      ocupacion: {
        mesasOcupadas: mesasOcupadasHoy,
        mesasActivas,
        porcentaje: mesasActivas
          ? Math.round((mesasOcupadasHoy / mesasActivas) * 100)
          : 0,
      },
      mes: {
        total: totalMes,
        variacion: calcVariacion(totalMes, totalMesAnterior),
        canceladas: canceladasMes,
        variacionCanceladas: calcVariacion(
          canceladasMes,
          canceladasMesAnterior,
        ),
        noAsistio: noAsistioMes,
      },
    };
  }

  // ─────────────────────────── helpers ───────────────────────────

  private async resolverCliente(
    clienteId?: string,
    clienteNuevo?: { nombre: string; telefono: string; email?: string },
  ): Promise<Cliente> {
    if (clienteId) return this.clienteService.findOne(clienteId);

    if (!clienteNuevo) {
      throw new BadRequestException(
        'Debe enviar clienteId o los datos del cliente',
      );
    }

    const { cliente } = await this.clienteService.findOrCreate(
      clienteNuevo.nombre,
      clienteNuevo.telefono,
      clienteNuevo.email || undefined,
    );

    return cliente;
  }

  /** Ids de las mesas con una reserva viva que se solapa con la franja */
  private async mesasOcupadasEn(
    inicio: Date,
    fin: Date,
    excluirReservaId?: string,
  ): Promise<Set<string>> {
    const query = this.reservaRepository
      .createQueryBuilder('reserva')
      .leftJoin('reserva.mesa', 'mesa')
      .select('mesa.id', 'mesaId')
      .where('reserva.estado IN (:...estados)', { estados: ESTADOS_ACTIVOS })
      .andWhere('reserva.fechaHora < :fin', { fin })
      .andWhere(
        `reserva.fechaHora + (reserva.duracionMinutos * INTERVAL '1 minute') > :inicio`,
        { inicio },
      );

    if (excluirReservaId) {
      query.andWhere('reserva.id != :excluirReservaId', { excluirReservaId });
    }

    const filas = await query.getRawMany<{ mesaId: string }>();
    return new Set(filas.map((fila) => fila.mesaId));
  }

  private async validarMesaLibre(
    mesaId: string,
    inicio: Date,
    fin: Date,
    numeroPersonas: number,
    excluirReservaId?: string,
  ): Promise<Mesa> {
    const mesa = await this.mesaRepository.findOneBy({ id: mesaId });

    if (!mesa) throw new NotFoundException(`Mesa ${mesaId} no encontrada`);

    if (!mesa.activa) {
      throw new BadRequestException(
        `La mesa ${mesa.numero} está fuera de servicio`,
      );
    }

    if (mesa.capacidad < numeroPersonas) {
      throw new BadRequestException(
        `La mesa ${mesa.numero} tiene capacidad para ${mesa.capacidad} personas`,
      );
    }

    const ocupadas = await this.mesasOcupadasEn(inicio, fin, excluirReservaId);

    if (ocupadas.has(mesa.id)) {
      throw new BadRequestException(
        `La mesa ${mesa.numero} ya está reservada en ese horario`,
      );
    }

    return mesa;
  }

  /** Elige la mesa libre más pequeña que acomode al grupo */
  private async asignarMesaAutomatica(
    inicio: Date,
    fin: Date,
    numeroPersonas: number,
  ): Promise<Mesa> {
    const [candidatas, ocupadas] = await Promise.all([
      this.mesaRepository.find({
        where: { activa: true },
        order: { capacidad: 'ASC', numero: 'ASC' },
      }),
      this.mesasOcupadasEn(inicio, fin),
    ]);

    const mesa = candidatas.find(
      (candidata) =>
        candidata.capacidad >= numeroPersonas && !ocupadas.has(candidata.id),
    );

    if (!mesa) {
      throw new BadRequestException(
        `No hay mesas disponibles para ${numeroPersonas} personas en ese horario`,
      );
    }

    return mesa;
  }

  private parsearFecha(fechaHora: string): Date {
    const fecha = new Date(fechaHora);
    if (Number.isNaN(fecha.getTime())) {
      throw new BadRequestException('fechaHora no es una fecha válida');
    }
    return fecha;
  }

  private calcularFin(inicio: Date, duracionMinutos: number): Date {
    return new Date(inicio.getTime() + duracionMinutos * 60_000);
  }

  /** [00:00, 23:59:59.999] del día indicado en hora local del restaurante */
  private rangoDelDia(fecha: string): [Date, Date] {
    return [
      new Date(`${fecha}T00:00:00.000${OFFSET_LOCAL}`),
      new Date(`${fecha}T23:59:59.999${OFFSET_LOCAL}`),
    ];
  }

  private fechaLocalISO(fecha: Date): string {
    return fecha.toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
  }

  private finDelHorizonte(): Date {
    const fin = new Date();
    fin.setDate(fin.getDate() + 30);
    return fin;
  }

  // MANEJO DE ERRORES
  private handleExceptions(error: any): never {
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Error inesperado en reservas');
  }
}
