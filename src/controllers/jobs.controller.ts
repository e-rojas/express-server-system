import { log } from 'console';
import express from 'express';
import Job from '../interfaces/job.interface';
import jobModel from '../models/job.model';

class JobsController {
  public path = '/jobs';
  public router = express.Router();
  private job = jobModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllJobs);
    this.router.get(`${this.path}/:id`, this.getJobById);
  }

  private getAllJobs = (req: express.Request, res: express.Response) => {
    // find the web address where the request came from
    const origin = req.get('origin');
    console.log('origin: ', origin);

    this.job
      .find()
      .then((jobs) => {
        res.send(jobs);
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Error during getting all jobs',
          error: err,
        });
      });
  };

  private getJobById = (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    this.job
      .findById(id)
      .then((job) => {
        if (job) {
          res.send(job);
        } else {
          res.status(404).json({
            message: 'Job not found',
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Error during getting job',
          error: err,
        });
      });
  };
}

export default JobsController;
