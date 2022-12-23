import mongoose from 'mongoose';


interface Author {
    name: string;
    email: string;
}

const authorSchema = new mongoose.Schema({
    name: String,
    email: String,
},
);




const AuthorModel = mongoose.model<Author & mongoose.Document>('Author', authorSchema);
export default AuthorModel;