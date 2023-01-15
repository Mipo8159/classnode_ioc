import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'invalid email' })
	email: string;

	@IsString({ message: 'invalid password' })
	password: string;
}
