import { Request, Response } from 'express';
import { RedisClient } from 'redis';

export const authByToken = async (req: Request, res: Response, redisClient: RedisClient): Promise<void> => {

  const { authorization } = req.headers;

  redisClient.hget('token', authorization as string, (err: Error | null, reply: string | null) => {
    if (err || !reply) {
      return res.status(400).json('토큰 만료');
    }
    return res.json({name: reply});
  });
};
