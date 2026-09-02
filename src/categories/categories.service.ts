import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { isUUID } from 'class-validator';
import { CommonService } from '@/common/common.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly commonService: CommonService,
  ) { }

  async findAll({ page = 1, take = 10 }: PaginationDto) {
    const [categoriesCount, categories] = await Promise.all([
      this.categoryRepository.count(),
      this.categoryRepository.find({
        take,
        skip: (page - 1) * take,
      }),
    ]);

    return {
      categories,
      pagination: {
        currentPage: +page,
        totalPages: Math.ceil(categoriesCount / take),
      },
    };
  }

  async create(dto: CreateCategoryDto) {
    const categoryNameCount = await this.categoryRepository.count({
      where: { name: dto.name },
    });

    if (categoryNameCount > 0) {
      throw new BadRequestException(
        `¡ La categoría con el nombre (${dto.name}) ya existe, elija otro !`
      );
    }

    if (dto.permalink) {
      const categoryPermalinkCount = await this.categoryRepository.count({
        where: { permalink: dto.permalink },
      });

      if (categoryPermalinkCount > 0) {
        throw new BadRequestException(
          `¡ La categoría con el nombre permanente (${dto.permalink}) ya existe, elija otro !`
        );
      }
    }

    try {
      const newCategory = this.categoryRepository.create(dto);

      await this.categoryRepository.save(newCategory);

      return {
        message: '¡ Categoría creada satisfactoriamente 👍 !',
        data: newCategory,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async findById(id: string) {
    let category: Category | null = null;

    if (isUUID(id)) {
      category = await this.categoryRepository.findOneBy({ id });
    } else {
      const queryBuilder = this.categoryRepository.createQueryBuilder();
      category = await queryBuilder
        .where('permalink = :permalink', { permalink: id.toLowerCase() })
        .getOne();
    }

    if (!category) {
      throw new NotFoundException(
        '¡ La categoría '
         + (isUUID(id) ? 'id ' : 'enlace permanente ')
         + `[${id}] no existe en la base de datos !`
      );
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(
        `¡ La categoría con id: [${id}], no existe en la base de datos !`
      );
    }

    const updatedCategory = this.categoryRepository.merge(category, dto);

    try {
      await this.categoryRepository.save(updatedCategory);

      return {
        message: 'Categoría actualizada exitosamente 👍',
        data: updatedCategory,
      }
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(
        `La categoría con id: [${id}], no existe en la base de datos`
      );
    }

    try {
      await this.categoryRepository.delete({ id: category.id });

      return {
        message: 'Categoría eliminada satisfactoriamente 👍',
        user: category,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }
}
