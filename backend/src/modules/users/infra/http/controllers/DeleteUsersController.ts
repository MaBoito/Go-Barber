import { Request, Response } from 'express';
import AppError from '@shared/errors/appError';
import User from '@modules/users/infra/typeorm/entities/User';
import { getRepository } from 'typeorm';

class DeleteUsersController {
  public async delete(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await userRepository.remove(user);

    return response.status(204).send();
  }
}

export default DeleteUsersController;
