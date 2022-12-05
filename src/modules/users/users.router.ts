import { Router, Request, Response } from 'express';

import { find, findOne, update, remove, create } from './users.repository';

import { CreateUserDto } from './dto/create-user.dto';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  const users = find();

  res.json(users);
});

router.post('/', async (req: Request, res: Response) => {
  const payload: CreateUserDto = req.body;
  const user = await create(payload);

  res.json(user);
});

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const user = findOne(id);

  res.json(user);
});

router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const result = remove(id);

  res.json({ id: result });
});

export default router;
