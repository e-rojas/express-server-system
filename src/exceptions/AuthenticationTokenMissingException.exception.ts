import HttpException from './HttpException';

export default class AuthenticationTokenMissingException extends HttpException {
  constructor() {
    super(401, 'Authentication token is missing');
  }
}
