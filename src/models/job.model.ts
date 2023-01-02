import mongoose from 'mongoose';
import Job from '../interfaces/job.interface';

const jobSchema = new mongoose.Schema({
  company: String,
  logo: String,
  logoBackground: String,
  position: String,
  postedAt: String,
  contract: String,
  location: String,
  website: String,
  apply: String,
  description: String,
  requirements: {
    content: String,
    items: [String],
  },
  role: {
    content: String,
    items: [String],
  },
});

const JobModel = mongoose.model<Job & mongoose.Document>('Job', jobSchema);
export default JobModel;
