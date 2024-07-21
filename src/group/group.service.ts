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
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    this.logger.log(`create group ${JSON.stringify(createGroupDto)}`);
    try {
      const newGroup = this.groupRepo.create(createGroupDto);
      return this.groupRepo.save(newGroup);
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    this.logger.log('fetch all groups');
    try {
      const result = await this.groupRepo.find();
      if (result && result.length > 0) {
        return result;
      } else {
        throw new HttpException('No groups found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    this.logger.log(`find group by id ${id}`);
    try {
      const result = await this.groupRepo.findOneBy({id});
      if (result) {
        return result;
      } else {
        throw new HttpException('Group does not exists', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    this.logger.log(
      `update group by id ${id} with ${JSON.stringify(updateGroupDto)}`,
    );
    try {
      const result = await this.groupRepo.findOneBy({ id });
      if (result) {
        result.name = updateGroupDto.name;
        result.createdBy = updateGroupDto.createdBy;
        // result.updatedBy = updateGroupDto.updatedBy; -- do after auth
        return this.groupRepo.save(result);
      } else {
        throw new HttpException('Group does not exists', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    this.logger.log(`delete group by id ${id}`);
    try {
      const result = await this.groupRepo.findOne({ where: { id } });
      if (result) {
        await this.groupRepo.delete({id});
      } else {
        throw new HttpException('Group does not exists', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
