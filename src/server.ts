import App from './app';
import PostsController from './controllers/posts.controller';

const app = new App([new PostsController()], 6000);

app.listen();
