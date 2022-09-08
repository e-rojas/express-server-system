import express, { response } from 'express';
import Post from '../interfaces/post.interface';
import postModel from '../models/posts.model';
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
    this.router.patch(`${this.path}/:id`, this.modifyPost);
    this.router.post(this.path, this.createPost);
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

  private getPostById = (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    this.post.findById(id).then((post) => {
      res.send(post);
    });
  };

  private modifyPost = (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    const post: Post = req.body;
    this.post.findByIdAndUpdate(id, post, { new: true }).then((updatedPost) => {
      res.send(updatedPost);
    });
  };

  private createPost = async (req: express.Request, res: express.Response) => {
    const newPost: Post = req.body;
    const createdPost = new this.post(newPost);
    createdPost.save().then((newpost) => {
      res.send(newpost);
    });
  };

  private deletePost = (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    this.post.findByIdAndDelete(id).then((success) => {
      if (success) {
        res.send({
          message: 'Post deleted successfully',
        });
      } else {
        response.send(404).json({
          message: 'Post not found',
        });
      }
    });
  };
}

export default PostsController;
