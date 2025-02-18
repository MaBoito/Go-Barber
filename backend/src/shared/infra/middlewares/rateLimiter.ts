import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import AppError from '@shared/errors/appError';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 5,
  duration: 5,
});

export default async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const ip =
      req.headers['x-forwarded-for']?.toString() ||
      req.socket.remoteAddress ||
      '';

    await limiter.consume(ip);

    return next();
  } catch (err) {
    throw new AppError('Too many requests', 429);
  }
}
