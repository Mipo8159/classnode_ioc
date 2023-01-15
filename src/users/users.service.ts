import { UserRepository } from './users.repository';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TYPES } from '../DI.types';
import { ConfigService } from '../config/config.service';
import { UserModel } from '@prisma/client';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private readonly configService: ConfigService,
		@inject(TYPES.UserRepository) private readonly userRepository: UserRepository,
	) {}
	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const exists = await this.userRepository.find(email);
		if (exists) {
			return null;
		}

		const user = new User(email, name);
		const salt = this.configService.getNum('SALT');
		await user.setPassword(password, salt);
		return this.userRepository.create(user);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const exists = await this.userRepository.find(email);
		if (!exists) {
			return false;
		}

		const user = new User(exists.email, exists.name, exists.password);
		return user.comparePassword(password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.userRepository.find(email);
	}
}
