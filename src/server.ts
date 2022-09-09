import App from './app';
import PostsController from './controllers/posts.controller';
import AuthenticationController from './controllers/authentication.controller';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = new App(
  [new PostsController(), new AuthenticationController()],
  PORT as unknown as number
);

app.listen();
