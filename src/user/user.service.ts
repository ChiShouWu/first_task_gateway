import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  UploadRequest,
  UserInterface,
  UserMicroService,
} from './models/user.model';
import { ReplaySubject, toArray } from 'rxjs';
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

  uploadFile(file: Express.Multer.File) {
    const uploadRequests = new ReplaySubject<UploadRequest>();

    // read chunk and upload, the limit size of gRPC is 4mb
    const bToMb = (size) => size * 1024;
    let chunkCount = 0;
    let offset = 0;

    while (offset < file.size) {
      const chunk = file.buffer.subarray(offset, offset + bToMb(3999));
      chunkCount += 1;
      offset += bToMb(4000 * chunkCount);

      uploadRequests.next({
        filename: file.originalname,
        chunk,
      });
    }

    uploadRequests.complete();
    const stream = this.userMicroService.uploadFile(
      uploadRequests.asObservable(),
    );
    return stream;
  }
}
