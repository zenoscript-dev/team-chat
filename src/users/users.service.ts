import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,QueryFailedError } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private logger: Logger,
  ) {}
  async create(createUserDto: CreateUserDto) {
    this.logger.log(`create user ${JSON.stringify(createUserDto)}`);
    try {
      const userExists = await this.checkDuplicates(createUserDto.email);
      if(userExists){
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }
      const newUser = this.userRepo.create(createUserDto);
      return this.userRepo.save(newUser);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    this.logger.log('fetch all users');
    try {
      const result = await this.userRepo.find();
      if (result && result.length > 0) {
        return result;
      } else {
        throw new HttpException('No users found', HttpStatus.NOT_FOUND);
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
      const result = await this.userRepo.findOneBy({ id });
      if (result) {
        return result;
      } else {
        throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log(
      `update group by id ${id} with ${JSON.stringify(updateUserDto)}`,
    );
    try {
      const result = await this.userRepo.findOne({ where: { id } });
      if (result) {
        result.username = updateUserDto.username;
        result.email = updateUserDto.email;
        // result.updatedBy = updateGroupDto.updatedBy; -- do after auth
        return this.userRepo.save(result);
      } else {
        throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
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
    this.logger.log(`delete user by id ${id}`);
    try {
      const result = await this.userRepo.findOne({ where: { id } });
      if (result) {
        await this.userRepo.delete({ id });
      } else {
        throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async checkDuplicates(email:string){
    try {
      const user = await this.userRepo.findOneBy({email})
      if(user){
        return true
      }else{
        return false;
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
