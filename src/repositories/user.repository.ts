// repositories/UserRepository.ts
import { User } from '../entities';
import { AppDataSource } from '../db';

export class UserRepository {
    private repo = AppDataSource.getRepository(User);

    findByEmail(email: string): Promise<User | null> {
        return this.repo.findOne({ where: { email } });
    }

    findByEmailWithPassword(email: string): Promise<User | null> {
        return this.repo.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'firstName', 'lastName', 'role'],
        });
    }
}
