import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundInterceptor } from '../interceptor/notfound.interceptor';
import { lastValueFrom } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFile } from '../decorators/api.decorator';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
@ApiTags('users')
@UseInterceptors(NotFoundInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @ApiResponse({
    description: 'The record has been successfully created.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOkResponse({ description: 'Users found' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async findAll(): Promise<any> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOkResponse({
    description: 'Users found',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async findOne(@Param('id') id: string): Promise<any> {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'User found and updated success',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'User remove success',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async remove(@Param('id') id: string): Promise<any> {
    try {
      const { success } = await lastValueFrom(this.usersService.remove(id));
      if (success) return 'User remove success';
    } catch (e) {
      console.log(e);
      throw new RpcException(e);
    }
  }

  @Post('upload')
  @ApiFile()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<any> {
    const responseStream = this.usersService.uploadFile(file);
    let filename = '';
    responseStream.subscribe({
      next(uploadStatus) {
        console.log(uploadStatus);
        filename = uploadStatus.filename;
      },
      error(err) {
        console.log(err);
        res.send({
          status: 500,
          message: 'Internal server error',
        });
      },
      complete() {
        res.send({
          statusCode: 200,
          messsage: 'upload file success',
          filename,
        });
      },
    });
    return responseStream;
  }

  // @Get('/file/:filename')
  // @ApiParam({ name: 'filename', type: 'string' })
  // @ApiOkResponse()
  // @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  // @ApiNotFoundResponse({ description: 'File not found' })
  // getFile(@Param('filename') filename, @Res() res) {
  //   console.log(filename);
  //   return res.sendFile(filename, { root: './uploads' });
  // }
}
