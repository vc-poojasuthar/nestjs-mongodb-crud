import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { UserService } from 'src/service/user.service';
import { RolesGuard } from '../auth/role.guard';
import { Role, Roles } from '../auth/roles';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Res() response, @Body() CreateUserDto: CreateUserDto) {
    try {
      const newUser = await this.userService.createUser(CreateUserDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'User has been created successfully',
        data: newUser,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: User not created!',
        error: 'Bad Request',
      });
    }
  }

  @Put('/:id')
  async updateUser(
    @Res() response,
    @Param('id') userId: string,
    @Body() UpdateUserDto: UpdateUserDto,
  ) {
    try {
      const existingUser = await this.userService.updateUser(
        userId,
        UpdateUserDto,
      );
      return response.status(HttpStatus.OK).json({
        message: 'User has been successfully updated',
        data: existingUser,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async getUsers(@Res() response) {
    try {
      const userData = await this.userService.getAllUsers();
      return response.status(HttpStatus.OK).json({
        message: 'All users data found successfully',
        data: userData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/:id')
  async getUser(@Res() response, @Param('id') userId: string) {
    try {
      const existingUser = await this.userService.getUser(userId);
      return response.status(HttpStatus.OK).json({
        message: 'User found successfully',
        data: existingUser,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete('/:id')
  async deleteUser(@Res() response, @Param('id') userId: string) {
    try {
      const deletedUser = await this.userService.deleteUser(userId);
      return response.status(HttpStatus.OK).json({
        message: 'User deleted successfully',
        data: deletedUser,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
