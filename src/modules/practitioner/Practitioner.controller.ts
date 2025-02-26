import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PractitionerService } from './Practitioner.service';
import { Practitioner, Appointment } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';

import { CreatePractitionerDto, UpdatePractitionerDto } from '../../domain/dtos/practitioner/Practitioner.dto';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginationResponse } from '../../common/swagger/api-pagination-response';
import { toDtoList } from '../../common/util/transform-dto.util';
import { PaginationMetadata } from '../../common/util/pagination-data.util';
import { plainToClass } from 'class-transformer';
import { SerializerPractitionerDto } from '../../domain/dtos/practitioner/Practitioner-serializer.dto';
import { PractitionerFilteredPaginationDto } from '../../domain/dtos/practitioner/Practitioner-filtered-pagination.dto';
import { SerializerShortPractitionerRoleDto } from '../../domain/dtos';
import { PractitionerFilteredDto } from '../../domain/dtos/practitioner/Practitioner-filterd.dto';

@ApiTags('Practitioner')
@Controller('practitioner')
export class PractitionerController extends ControllerFactory<
  Practitioner,
  CreatePractitionerDto,
  UpdatePractitionerDto,
  SerializerPractitionerDto
>(
  Practitioner,
  CreatePractitionerDto,
  UpdatePractitionerDto,
  SerializerPractitionerDto
) {
  constructor(protected service: PractitionerService) {
    super();
  }

  @Post()
  @ApiOperation({ description: 'Crear un nuevo especialista' })
  async create(@Body() createSpecialistDto: CreatePractitionerDto) {
    return await this.service.createSpecialist(createSpecialistDto);
  }

  @Get()
  @ApiOperation({ description: 'Get all specialists' })
  async getAll(): Promise<SerializerPractitionerDto[]> {
    const specialists = await this.service.getAll();
    return plainToClass(SerializerPractitionerDto, specialists);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get a practitioner by ID' })
  async getOne(@Param('id') id: string): Promise<SerializerPractitionerDto> {
    const practitioner = await this.service.getOne(id);
    return plainToClass(SerializerPractitionerDto, practitioner);
  }

  @Patch(':id')
  @ApiOperation({ description: 'Update a practitioner' })
  async update(
    @Param('id') id: string,
    @Body() updateSpecialistDto: UpdatePractitionerDto,
  ): Promise<SerializerPractitionerDto> {
    const practitioner = await this.service.update(id, updateSpecialistDto);
    return plainToClass(SerializerPractitionerDto, practitioner);
  }

  @Patch('soft-delete/:id')
  @ApiOperation({ description: 'Eliminar un especialista (soft delete)' })
  async softDelete(@Param('id') id: string): Promise<{ message: string }> {
    return this.service.softDelete(id);
  }

  @Patch('recover/:id')
  @ApiOperation({ description: 'Recuperar un especialista eliminado' })
  async recover(@Param('id') id: string): Promise<{ message: string }> {
    return this.service.recover(id);
  }

  // @Get()
  // @ApiOperation({
  //   description: 'Obtener practitioner paginados con filtros opcionales'
  // })
  // @ApiPaginationResponse(SerializerPractitionerDto)
  // override async findAll(
  //   @Query()
  //   paginationDto: PractitionerFilteredPaginationDto
  // ): Promise<{ data: SerializerPractitionerDto[]; meta: PaginationMetadata }> {
  //   const { data, meta } = await this.service.findAll(paginationDto);
  //   const serializedData = toDtoList(SerializerPractitionerDto, data);
  //   return { data: serializedData, meta };
  // }

  @Get('/with-turns')
  @ApiOperation({
    description: 'Get all specialists with their turns'
  })
  async findAllWithTurns(): Promise<SerializerPractitionerDto[]> {
    const specialists = await this.service.findAllWithTurns();
    return toDtoList(SerializerPractitionerDto, specialists);
  }

}
