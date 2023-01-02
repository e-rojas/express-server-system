import mongoose from 'mongoose';

type Company = {
    name: string;
    description: string;
}

const companySchema = new mongoose.Schema({
    name: String,
    description: String,
});


const CompanyModel = mongoose.model<Company & mongoose.Document>('Company', companySchema);

export default CompanyModel;