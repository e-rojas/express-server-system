import mongoose from 'mongoose';

type Employment = {
    title: string;
    description: string;
    company: string;
};

const employmentSchema = new mongoose.Schema({
    company: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
});

const EmploymentModel = mongoose.model<Employment & mongoose.Document>('Employment', employmentSchema);
export default EmploymentModel;