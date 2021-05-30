import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class DefaultGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
