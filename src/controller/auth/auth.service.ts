import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/interface/user.interface';
import { UserService } from 'src/service/user.service';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async validateUserCredentials(email: string, password: string): Promise<any> {
    console.log(email, password);
    const user = await this.usersService.getValidateUser({ email, password });
    if (!user) return null;
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    if (user && passwordValid) {
      return user;
    }
    return null;
  }

  async loginWithCredentials(user: IUser) {
    try {
      const payload = { email: user.email };
      const token = this.jwtService.sign(payload);
      //await this.mailService.sendUserConfirmation(user, token);
      return {
        email: user.email,
        userId: user._id,
        access_token: token,
        expiredAt: Date.now() + 60000,
      };
    } catch (err) {
      console.log(err);
    }
  }
}
