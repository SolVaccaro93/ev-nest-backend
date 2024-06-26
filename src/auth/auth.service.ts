
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto, UpdateAuthDto } from './dto';

import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login-dto';
import { JwtService } from '@nestjs/jwt';


import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';



@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name )
     private userModel:Model<User>,
     private jwtService: JwtService,
  ) {} //modelo con el que puedo hacer las interacciones con la bd relacionada
       // a todo lo que tengo definido


       //metodo para crear el usuario
  async create(createUserDto: CreateUserDto): Promise<User> {
    
    try{    
    const {password, ...userData} = createUserDto;

    const newUser = new this.userModel({
      password: bcryptjs.hashSync(password,10),
      ...userData
    });
    
   await newUser.save();
   const{password:_,...user} = newUser.toJSON();
  
   return user;
  } 
  
  catch(error){
    if(error.code === 11000){
      throw new BadRequestException(`${createUserDto.email} already exist!`)
    }

    throw new InternalServerErrorException('Algo sucedio');
  }
  }

//registro  

async register(registerDto:RegisterUserDto):Promise <LoginResponse>{

  const user = await this.create(registerDto); //creacion de usuario
  console.log({user});

  return{
    user: user,
    token: this.getJwtToken({id:user._id})
  }
}

  //login servicio 
 
  async login(loginDto: LoginDto):Promise <LoginResponse>{
     const { email,password} = loginDto;   //verificacion del usuario
     
     const user = await this.userModel.findOne({email});
     //verificar si existe el correo electronico

     if(!user) {
      throw new UnauthorizedException('Credenciales no validas')
     }

     //verificar contraseña
     if(!bcryptjs.compareSync( password, user.password)) {
       throw new UnauthorizedException('Contraseña invalida');
     }
      //metodo de comparacion

      const{password:_, ... rest}  = user.toJSON(); //almacena pw y resto de info.
     return {
      user: rest,
      token: this.getJwtToken({id:user.id}),
     }
  }


  findAll(): Promise<User[]> {
    return  this.userModel.find(); //devuelve los usuarios
  }


  async findUserByid(id:string){
    const user = await this.userModel.findById(id); //busca el usuario
    const{password,...rest} = user.toJSON(); //rest info propia del usuario
    return rest;
  }
  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  //metodo para el jwt

  getJwtToken(payload: JwtPayload){
   const token = this.jwtService.sign(payload);
   return token
  }
}
