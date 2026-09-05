import { PartialType } from '@nestjs/mapped-types';
import { CreateCoachDto } from './create-coach.dto.js';

export class UpdateCoachDto extends PartialType(CreateCoachDto) {}
