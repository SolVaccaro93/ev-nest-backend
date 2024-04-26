import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterUserDto {


@IsEmail() //decorador para formato    
email: string;

@IsString()
name: string;

@MinLength(6)
password: string;




}

