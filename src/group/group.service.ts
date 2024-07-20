import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateGroupDto } from './dto/createGroup.dto';
import { UpdateGroupDto } from './dto/updateGroup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';


@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    private logger: Logger,
  ){}
  
  async create(createGroupDto: CreateGroupDto) {
    this.logger.log(`create group ${JSON.stringify(createGroupDto)}`);
    try {
      const newGroup = this.groupRepo.create(createGroupDto);
      return this.groupRepo.save(newGroup);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  findAll() {
    return `This action returns all group`;
  }

  findOne(id: number) {
    return `This action returns a #${id} group`;
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
