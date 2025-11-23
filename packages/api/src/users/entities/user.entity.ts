import { User as PrismaUser } from '@repo/database/client';

export class User implements PrismaUser {
    id: number;
    email: string;
    name: string;
    emailVerified: Date | null;

    constructor(data: PrismaUser) {
        this.id = data.id;
        this.email = data.email;
        this.name = data.name;
        this.emailVerified = data.emailVerified;
    }
}
