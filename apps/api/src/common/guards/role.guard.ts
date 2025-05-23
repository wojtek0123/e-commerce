import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { decode } from 'jsonwebtoken';
import { PrismaService } from '../../prisma/prisma.service';

export const Roles = Reflector.createDecorator<Role[]>();

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) { }

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.get(Roles, context.getHandler());

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) return false;

    const authToken = decode(authHeader.split(' ')[1]);

    if (typeof authToken === 'string') return false;

    const userId = authToken.sub;

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId, refreshToken: { not: null } },
      select: { role: true },
    });

    if (!user.role) {
      return false;
    }

    return requiredRoles.includes(user.role);
  }
}
