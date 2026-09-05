import { PartialType } from '@nestjs/mapped-types';
import { CreateSponsorDto } from './create-sponsor.dto.js';

export class UpdateSponsorDto extends PartialType(CreateSponsorDto) {}