import express from 'express';
import Post from '../interfaces/post.interface';

class PostsController {
  public path = '/posts';
  public router = express.Router();
  private posts: Post[] = [
    {
      title: 'First Post',
      content: 'This is the first post',
      author: 'Max Mustermann',
    },
  ];

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.post(this.path, this.createPost);
  }

  getAllPosts = (req: express.Request, res: express.Response) => {
    console.log('getAllPosts');

    res.send(this.posts);
  };

  createPost = (req: express.Request, res: express.Response) => {
    const newPost: Post = req.body;
    this.posts.push(newPost);
    res.send(this.posts);
  };
}

export default PostsController;
