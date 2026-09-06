import { PrismaService } from './prisma.service.js';
export declare class AppController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHealth(): Promise<{
        status: string;
        environment: string;
        timestamp: string;
        database: string;
    }>;
}
