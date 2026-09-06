import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';

export type User = {
    id: number;
    username: string;
    password: string;
};

@Injectable()
export class UsersService {

    constructor(private readonly prisma: PrismaService) {}

    async findOne(username: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { username },
        });
    }

    async create(username: string, password: string): Promise<Omit<User, 'password'>> {
        try {
            const user = await this.prisma.user.create({
                data: {
                    username,
                    password: await bcrypt.hash(password, 10),
                },
            });

            const { password: _password, ...publicUser } = user;
            return publicUser;
        } catch (error) {
            if (this.isUniqueConstraintError(error)) {
                throw new ConflictException('El nombre de usuario ya está registrado');
            }
            throw error;
        }
    }

    private isUniqueConstraintError(error: unknown): boolean {
        return (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === 'P2002'
        );
    }

}
