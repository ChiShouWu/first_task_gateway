import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInterface, UserMicroService } from './models/user.model';

@Injectable()
export class UserService implements OnModuleInit {
  private userMicroService: UserMicroService;

  constructor(@Inject('USER_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.userMicroService =
      this.client.getService<UserMicroService>('UserService');
  }
  create(createUserDto: CreateUserDto) {
    return this.userMicroService.create(createUserDto);
  }

  findAll() {
    return this.userMicroService.findAll({});
  }

  findOne(id: string) {
    return this.userMicroService.findById({ id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    updateUserDto.id = id;
    return this.userMicroService.update(updateUserDto);
  }

  remove(id: string) {
    return this.userMicroService.delete({ id });
  }
}
