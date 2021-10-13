import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
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
import { UserInterface } from './models/user.model';
import { lastValueFrom } from 'rxjs';

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
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOkResponse({ description: 'Users found' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOkResponse({
    description: 'Users found',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'User found and updated success',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'User remove success',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async remove(@Param('id') id: string) {
    const { success } = await lastValueFrom(this.usersService.remove(id));
    if (success) return 'User remove success';
  }

  // @Post('upload')
  // @ApiFile()
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, callback) => {
  //         const filename: string = uuidv4();
  //         const extension: string = extname(file.originalname);

  //         callback(null, `${filename}${extension}`);
  //       },
  //     }),
  //   }),
  // )
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   return file.filename;
  // }

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
