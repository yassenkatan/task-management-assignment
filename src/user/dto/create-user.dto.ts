import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Match } from "../../common/decorators/match.decorator";
import { CreateUserModel } from "../models/create-user.model";

export class CreateUserDto extends CreateUserModel {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    readonly firstName: string;
  
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    readonly lastName: string;
  
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
  
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)/, {
      message:
        'password must contain letters (upper and lower case) and numbers and special character',
    })
    readonly password: string;
  
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Match('password')
    readonly confirmPassword: string;
  }
  