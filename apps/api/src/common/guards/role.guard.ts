import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { decode } from 'jsonwebtoken';
import { Roles } from '../../books/books.controller';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get(Roles, context.getHandler());

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) return false;

    const authToken = decode(authHeader.split(' ')[1]);

    if (typeof authToken === 'string') return false;

    return requiredRoles.includes(authToken.role);
  }
}
