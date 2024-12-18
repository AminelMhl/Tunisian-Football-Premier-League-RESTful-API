import { Injectable } from '@nestjs/common';
import { CreateStandingDto } from './dto/create-standing.dto';
import { UpdateStandingDto } from './dto/update-standing.dto';

@Injectable()
export class StandingsService {
  create(createStandingDto: CreateStandingDto) {
    return 'This action adds a new standing';
  }

  findAll() {
    return `This action returns all standings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} standing`;
  }

  update(id: number, updateStandingDto: UpdateStandingDto) {
    return `This action updates a #${id} standing`;
  }

  remove(id: number) {
    return `This action removes a #${id} standing`;
  }
}
