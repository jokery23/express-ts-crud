import { Router, Request, Response } from 'express';

import {getUsers} from './actions/get-users.action';
import {getUser} from './actions/get-user.action';
import { createUser } from './actions/create-user.action';
import { CreateUserPayloadDto } from './types/create-user-payload.dto';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  const users = getUsers();

  res.json(users);
});

router.post('/', async (req: Request, res: Response) => {
  const payload: CreateUserPayloadDto = req.body;
  const user = await createUser(payload);

  res.json(user);
});

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const user = getUser(+id)

  res.json(user);
});

export default router;
