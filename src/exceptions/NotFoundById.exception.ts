import HttpException from './HttpException';

class NotFoundByIdException extends HttpException {
  constructor(title: string, id: string) {
    super(404, `${title} with id ${id} not found`);
  }
}

export default NotFoundByIdException;
