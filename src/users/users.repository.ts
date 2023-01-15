import { PrismaService } from './../database/prisma.service';
import { TYPES } from './../DI.types';
import { inject, injectable } from 'inversify';
import { UserModel } from '@prisma/client';
import { User } from './user.entity';
import { IUserRepository } from './user.repository.interface';
import 'reflect-metadata';

@injectable()
export class UserRepository implements IUserRepository {
	constructor(@inject(TYPES.PrismaService) private readonly prismaService: PrismaService) {}
	async create({ email, password, name }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				password,
				name,
			},
		});
	}

	async find(email: string): Promise<UserModel | null> {
		if (!email) return null;
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
