import { Request, Response } from 'express';
import { Knex } from 'knex';

export const signup = async (req: Request, res: Response, db: Knex, bcrypt: typeof import('bcryptjs')): Promise<void> => {
  const { name, password } = req.body;
  const hash = bcrypt.hashSync(password, 8);
  console.log(name, hash);
  try {
    const dbInsert = await db.insert({ name: name, hash: hash}).into('users').returning('name');
    res.json(dbInsert);
  } catch(e) {
    res.status(400).json('중복된 이름이 있습니다.');
  }
};
