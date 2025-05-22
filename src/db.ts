// db.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import {
    User,
    Question,
    Option,
    Exam,
    UserExam,
    Practice,
    UserPractice,
    UserStats,
    Department,
    Category
} from "./entities";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "admin123",
    database: process.env.DB_NAME || "passmate_db",
    entities: [
        User,
        Question,
        Option,
        Exam,
        UserExam,
        Practice,
        UserPractice,
        UserStats,
        Department,
        Category
    ],
    synchronize: true,
    logging: ['query', 'error'],
});
