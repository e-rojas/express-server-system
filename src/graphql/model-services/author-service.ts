import mongoose from 'mongoose';
import AuthorModel from '../../models/author.model';
import Author from '../object-types/author-object-type';


class AuthorService {
    private author = AuthorModel;

    public async getAuthor(id: string): Promise<Author> {
        return await this.author.findById(id) as Author;
    }

    public async getAuthors(): Promise<Author[]> {
        return await this.author.find({});
    }

    public typeObject(_id: string) {
        const id = new mongoose.Types.ObjectId(_id);
        return id;
    }
}

export default AuthorService;