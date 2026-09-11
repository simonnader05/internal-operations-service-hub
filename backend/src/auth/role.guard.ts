import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  
  @Injectable()
  export class RoleGuard implements CanActivate {
    private readonly allowedRoles = ['HR', 'IT', 'Manager'];
  
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
  
      const role = request.headers['x-user-role'];
  
      if (!role) {
        throw new ForbiddenException('User role is required');
      }
  
      if (!this.allowedRoles.includes(role)) {
        throw new ForbiddenException(
          `Role ${role} is not allowed to update request status`,
        );
      }
  
      return true;
    }
  }