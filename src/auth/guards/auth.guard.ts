import { JwtPayload } from './../interfaces/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';


@Injectable()
export class AuthGuard implements CanActivate {

constructor(
  private jwtService:JwtService,
  private authService: AuthService, 
){}


  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);    

    if (!token) {
      throw new UnauthorizedException('No hay token en la peticion'); //validacion token
    }

    try {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(
      token,{secret: process.env.JWT_SEED }  //validacion token , si no existe da un 500
    );

    const user = await this.authService.findUserByid(payload.id);
    if(!user) throw new UnauthorizedException('User does not exist');
    if(!user.isActive) throw new UnauthorizedException('User is not active');



    request['user'] = user;
  } catch (error){
     throw new UnauthorizedException('token no autorizado');
  }



    return Promise.resolve(true)             
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
