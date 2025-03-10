import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { envConfig } from '../../../config/envs';
  
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: envConfig.JWT_SECRET,
      });

      request['profile'] = payload;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

export function Roles(...roles: string[]) {
  return (target: object, key?: any, descriptor?: any) => {
    Reflect.defineMetadata('roles', roles, descriptor?.value ?? target);
  };
}

@Injectable()
export class RolesGuard extends AuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const roles = Reflect.getMetadata('roles', context.getHandler()) || 
                  Reflect.getMetadata('roles', context.getClass());
    
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const isAuthenticated = await super.canActivate(context);

    if (!isAuthenticated) {
      throw new UnauthorizedException();
    }

    const userRole = request['profile']?.role;
    if (!userRole) {
      throw new ForbiddenException('User role not found');
    }

    if (!roles.includes(userRole)) {
      throw new ForbiddenException('Access denied: insufficient role');
    }

    return true;
  }
}