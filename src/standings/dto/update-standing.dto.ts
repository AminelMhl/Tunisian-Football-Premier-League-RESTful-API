import { PartialType } from '@nestjs/swagger';
import { CreateStandingDto } from './create-standing.dto';

export class UpdateStandingDto extends PartialType(CreateStandingDto) {}
