import jwt from 'jsonwebtoken';
import redis from 'redis';
import { Request, Response } from 'express';
import { Knex } from 'knex';

interface UserData {
  name: string;
  hash: string;
}

interface LoginResult {
  name: string;
  token: string;
}

const redisClient = redis.createClient(process.env.REDIS_URL as string);


export const login = async (req: Request, res: Response, db: Knex, bcrypt: typeof import('bcryptjs')): Promise<void> => {

  const { name, password } = req.body;

  try {
    let nameAndToken = await loginNotToken(name, password, db, bcrypt);
    console.log('nameandtoken', nameAndToken);
    res.json(nameAndToken);
  } catch(e) {
    res.status(400).json(e);
  }
};

const loginNotToken = async (name: string, password: string, db: Knex, bcrypt: typeof import('bcryptjs')): Promise<LoginResult> => {
  // 토큰 없이 로그인, 로그인 성공하면 토큰과 이름을 비동기적으로 반환
  if (!name || !password ) {
    return Promise.reject('잘못된 제출 형식');
  }

  let userdata: UserData[] = await db.select('*').from('users').where('name', '=', name);
  if (userdata.length === 0) {
    throw Error('가입된 정보 없음');
  }

  let isValid = await bcrypt.compare(password, userdata[0].hash);
  if (isValid) {
    let jwtToken = signToken(userdata);
    console.log(jwtToken);
    await setToken(jwtToken, userdata[0].name);
    return { name: userdata[0].name, token: jwtToken };
  } else {
    throw Error('비밀번호 틀림');
  }
};

const signToken = (userdata: UserData[]): string => {
  const jwtPayload = { name : userdata[0].name };
  console.log('jwtpayload', jwtPayload);
  return jwt.sign(jwtPayload, 'JWT_SECRET', { expiresIn: '1 days' });
};

const setToken = async (key: string, value: string): Promise<void> => {
  redisClient.hset('token', key, value, (err: Error | null, reply: number) => {
    if (!reply || err) {
      console.log(err);
      throw Error('토큰 저장하는 중 오류 발생');
    }
  });
};
