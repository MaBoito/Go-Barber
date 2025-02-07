import { Router } from 'express';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import DeleteUsersController from '../controllers/DeleteUsersController';

const deleteRouter = Router();
const deleteUsersController = new DeleteUsersController();

deleteRouter.delete('/', ensureAuthenticated, deleteUsersController.delete);

export default deleteRouter;
