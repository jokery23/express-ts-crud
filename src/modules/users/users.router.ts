import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { createValidator, ExpressJoiContainerConfig } from 'express-joi-validation';

import { CreateUserDto } from './domain/dto/create-user.dto';
import { UsersService } from './users.service';
import { AppResponseInterface } from '../../shared/domain/interfaces/app-response.interface';
import { RemoveUserResponseDto } from './domain/dto/remove-user-response.dto';
import { User } from './domain/user.model';
import { UpdateUserDto } from './domain/dto/update-user.dto';
import { notFoundHttpException } from '../../shared/http-exceptions';
import { HttpStatusCode } from '../../shared/domain/enums/http-status-code.enum';

const router: Router = Router();
const userService = new UsersService();

const validator = createValidator();
const validateConfig: ExpressJoiContainerConfig = {
    passError: true,
    statusCode: HttpStatusCode.BadRequest
};

const userSchema = Joi.object<User>({
    id: Joi.string().required(),
    login: Joi.string().email().required(),
    password: Joi.string().alphanum().required(),
    age: Joi.number().integer().min(4).max(120).required(),
    isDeleted: Joi.boolean().required()
});

router.get('/', (req: Request, res: Response) => {
    const { limit = 10, search = '' } = req.query;
    const users = userService.getAutoSuggestUsers(`${search}`, Number(limit));

    const response: AppResponseInterface<User[]> = {
        data: users
    };

    res.json(response);
});

router.post('/', validator.body(userSchema, validateConfig), (req: Request, res: Response) => {
    const payload: CreateUserDto = req.body;
    const user = userService.create(payload);

    const response: AppResponseInterface<User | null> = {
        data: user
    };

    res.json(response);
});

router.put('/:id', validator.body(userSchema, validateConfig), (req: Request, res: Response) => {
    const { id } = req.params;
    const payload: UpdateUserDto = req.body;
    const user = userService.update(id, payload);

    if (!user) {
        notFoundHttpException(res);
    }

    const response: AppResponseInterface<User | null> = {
        data: user
    };

    res.json(response);
});

router.get('/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const user = userService.findOne(id);

    if (!user) {
        notFoundHttpException(res);
    }

    const response: AppResponseInterface<User | null> = {
        data: user
    };

    res.json(response);
});

router.delete('/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const result = userService.remove(id);

    if (!result) {
        notFoundHttpException(res);
    }

    const response: AppResponseInterface<RemoveUserResponseDto> = {
        data: result
    };

    res.json(response);
});

export default router;
