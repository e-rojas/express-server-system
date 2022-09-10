import { Request } from 'express';
import User from './user.interface';
interface RquestWithUser extends Request {
  user?: User;
}
export default RquestWithUser;
