import express from 'express';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDTO from '../DTO/post.dto';
import Post from '../interfaces/post.interface';
import postModel from '../models/post.model';
import NotFoundByIdException from '../exceptions/NotFoundById.exception';
class PostsController {
  public path = '/posts';
  public router = express.Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(CreatePostDTO, true),
      this.modifyPost
    );
    this.router.post(
      this.path,
      validationMiddleware(CreatePostDTO),
      this.createPost
    );
    this.router.delete(`${this.path}/:id`, this.deletePost);
  }

  private getAllPosts = (req: express.Request, res: express.Response) => {
    this.post
      .find()
      .then((posts) => {
        res.send(posts);
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Error during getting all posts',
          error: err,
        });
      });
  };

  private getPostById = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const id = req.params.id;
    this.post.findById(id).then((post) => {
      if (post) {
        res.send(post);
      } else {
        next(new NotFoundByIdException('Post', id));
      }
    });
  };

  private modifyPost = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const id = req.params.id;
    const post: Post = req.body;
    this.post.findByIdAndUpdate(id, post, { new: true }).then((updatedPost) => {
      if (updatedPost) {
        res.send(updatedPost);
      } else {
        next(new NotFoundByIdException('Post', id));
      }
    });
  };

  private createPost = async (req: express.Request, res: express.Response) => {
    const newPost: Post = req.body;
    const createdPost = new this.post(newPost);
    createdPost.save().then((newpost) => {
      res.send(newpost);
    });
  };

  private deletePost = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const id = req.params.id;
    this.post.findByIdAndDelete(id).then((success) => {
      if (success) {
        res.send({
          message: 'Post deleted successfully',
        });
      } else {
        next(new NotFoundByIdException('Post', id));
      }
    });
  };
}

export default PostsController;
