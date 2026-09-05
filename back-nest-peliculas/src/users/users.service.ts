import { Injectable, UnauthorizedException } from '@nestjs/common';

//This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {

    private readonly users: User[] = [
        {
            userId: 1,
            username: 'john',
            passwordHash: '$2b$10$1bwnDdAoe0pDNzCg/5q6ouFiq4HHw1JLKM0UVE2z3thw/.B1EG5Ie',
        },
        {
            userId: 2,
            username: 'maria',
            passwordHash: '$2b$10$ZK95YmQq4DfZ6JLnqp.SMeoxx6YAohFQAb.p5fKSzpPvIxL3OhRQu',
        }
    ];

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }

}
