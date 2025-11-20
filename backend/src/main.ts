import express from 'express';
import dotenv from 'dotenv';
import publicRouter from './routes/public-api';
import apiRouter from './routes/api';
import cors from 'cors';
import { errorMiddleware } from './middlewares/error-middleware';
import cookieParser from 'cookie-parser';
import prisma from './utils/prisma';
import { UserCreateArgs } from './generated/prisma/models';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(publicRouter);
app.use(apiRouter);
app.use(errorMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
