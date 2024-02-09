import { IsEmail, IsString, MinLength } from "class-validator";


//mongoschema
export interface IUser {
    id: string;
    username: string;
    email: string;
    password: string;
}
export interface IUserService {
    getUser: (id: string) => Promise<IUser>;
    loginUser: (userInput: IUserInput) => Promise<any>;
    registerUser: (userInput: IUserInput) => Promise<any>;
}

export interface RequestUser extends Request {
    user?: IUserInput;
  }
export interface IUserInput {
    id?: string;
    username?: string;
    email?: string;
    password: string;
}
export class UserSigninDto {
    @IsString()
    username: string;

    @IsString()
    password: string;
}
/* Data transfer object */
export class UserSignupDto {
    @IsString()
    username: string;
  
    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(3)
    password: string;
  }
  
