import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    // get the roles required
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return false;
    }
    // const request = context.switchToHttp().getRequest();
    // console.log('req', request.headers?.role);
    // console.log('roles', roles);

    // const userRoles = request.headers?.role?.split(',');

    // return this.validateRoles(roles, userRoles);
    const user = {
      name: 'test', // just use static for test
      roles: [Role.Admin],
    };
    return roles.some((role: any) => user.roles.includes(role));
  }

  validateRoles(roles: string[], userRoles: string[]) {
    return roles.some((role) => userRoles.includes(role));
  }
}
