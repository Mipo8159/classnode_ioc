import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsString({ message: 'invalid name' })
	name: string;

	@IsEmail({}, { message: 'invalid email' })
	email: string;

	@IsString({ message: 'invalid password' })
	password: string;
}
