import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { IUser } from 'src/interface/user.interface';
import { Model } from 'mongoose';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<IUser>) {}

  async loginUser(email: string, password: string): Promise<IUser> {
    const user = await this.userModel.findOne({ email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) return user;
    }
    return null;
  }

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hashPassword;

    const newUser = await new this.userModel(createUserDto);
    return newUser.save();
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    const existingUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateUserDto,
      { new: true },
    );
    if (!existingUser) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return existingUser;
  }

  //   const filters: FilterQuery<PostDocument> = startId
  //    {
  //       _id: {
  //         $gt: startId,
  //       },
  //     }
  //   : {};

  // if (searchQuery) {
  //   filters.$text = {
  //     $search: searchQuery,
  //   };
  // }

  // const findQuery = this.postModel
  //   .find(filters)
  //   .sort({ _id: 1 })
  //   .skip(documentsToSkip)
  //   .populate('author')
  //   .populate('categories');

  // if (limitOfDocuments) {
  //   findQuery.limit(limitOfDocuments);
  // }

  // const results = await findQuery;
  // const count = await this.postModel.count();

  // return { results, count };

  async getAllUsers(): Promise<IUser[]> {
    const page = 1;
    const size = 10;
    const limit = +size;
    const skip = (page - 1) * size;

    const userData = await this.userModel
      .find()
      .sort({ _id: -1 })
      .limit(limit)
      .skip(skip);
    return userData;
  }

  async getUser(userId: string): Promise<IUser> {
    const existingUser = await this.userModel.findById(userId).exec();
    if (!existingUser) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return existingUser;
  }

  async deleteUser(userId: string): Promise<IUser> {
    const deletedUser = await this.userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return deletedUser;
  }

  async getValidateUser({ email, password }): Promise<IUser | undefined> {
    return this.userModel.findOne({
      email,
      password,
    });
  }
}
