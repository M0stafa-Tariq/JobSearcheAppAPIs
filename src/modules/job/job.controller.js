import Application from "../../../DB/models/application.model.js";
import Company from "../../../DB/models/company.model.js";
import Job from "../../../DB/models/job.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";

//========================addJob========================//
export const addJob = async (req, res, next) => {
  //check addedBy id
  if (req.user._id.toString() != req.body.addedBy.toString())
    return next(
      new Error(
        "AddedBy field doesn't match with your id,please put you current id!",
        { cause: 400 }
      )
    );
  //check company
  const company = await Company.findById(req.body.companyId);
  if (!company)
    return next(
      new Error("There is no company with that companyId", { cause: 404 })
    );

  //check if current user is owner
  if (req.user._id.toString() != company.companyHR.toString()) {
    return next(
      new Error("You are not owner for this company!", { cause: 404 })
    );
  }
  //create the job
  const createJob = await Job.create(req.body);
  //failed case
  if (!createJob) return next(new Error("Add job is failed!", { cause: 400 }));
  //success case and return response
  return res.status(201).json({
    succes: true,
    message: "job added successfully!",
    createJob,
  });
};

//========================updateJob========================//
export const updateJob = async (req, res, next) => {
  //destructing data from body
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    companyId,
  } = req.body;

  const job = await Job.findById(req.query.jobId)
  //check if jobTitle has changed
  if (jobTitle) job.jobTitle = jobTitle;
  //check if jobLocation has changed
  if (jobLocation) job.jobLocation = jobLocation;
  //check if workingTime has changed
  if (workingTime) job.workingTime = workingTime;
  //check if seniorityLevel has changed
  if (seniorityLevel) job.seniorityLevel = seniorityLevel;
  //check if jobDescription has changed
  if (jobDescription) job.jobDescription = jobDescription;
  //check if technicalSkills has changed
  if (technicalSkills) job.technicalSkills = technicalSkills;
  //check if softSkills has changed
  if (softSkills) job.softSkills = softSkills;
  //check if companyId has changed
  if (companyId) {
    //check company
    const company = await Company.findById(req.body.companyId);
    if (!company)
      return next(
        new Error("There is no company with that companyId", { cause: 404 })
      );

    //check if current user is owner
    if (req.user._id.toString() != company.companyHR.toString()) {
      return next(
        new Error("You are not owner for this company!", { cause: 404 })
      );
    }
    job.companyId = companyId;
  }

  //update company
  const updatedJob = await job.save();
  if (!updatedJob) return next(new Error("Updated fail", { cause: 400 }));

  //send response
  return res.status(200).json({ message: "Job updated successfully!" });
};

//========================deleteJob========================//
export const deleteJob = async (req, res, next) => {
  //delete job
  const deleteJob = await job.findByIdAndDelete(req.query.jobId);
  if (!deleteJob) return next(new Error("delete fail", { cause: 400 }));
  //send response
  return res.status(200).json({
    success: true,
    message: "Job deleted success!",
  });
};

//========================getAllJobsWithTheirCompany’sInformation========================//
export const getAllJobsWithTheirCompany = async (req, res, next) => {
  //get all jobs with company informations
  const jobs = await Job.find().populate([{ path: "companyId" }]);
  if (!jobs.length) return next(new Error("There are no jobs yet!"));
  //send response
  return res.status(200).json({
    message: true,
    jobsWtihCompanyInformations: jobs,
  });
};

//========================getAllJobsForASpecificCompany========================//
export const getAllJobsForASpecificCompany = async (req, res, next) => {
  //get company
  const company = await Company.findOne({ companyName: req.query.companyName });
  if (!company)
    return next(
      new Error("There is no company with this name!", { cause: 404 })
    );
  //get all jobs with company informations
  const jobs = await Job.find({ companyId: company._id });
  if (!jobs.length)
    return next(new Error("There are no jobs for that company yet!"));
  //send response
  return res.status(200).json({
    message: true,
    jobs,
  });
};

//========================getAllJobsThatMatch========================//
export const getAllJobsThatMatch = async (req, res, next) => {
  //destructing data from body
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.body;
  //get all jobs
  const jobs = await Job.find();
  //filter jobs depending on user requirements
  const filteredJobs = jobs.filter((job) => {
    return (
      (!workingTime || job.workingTime === workingTime) &&
      (!jobLocation || job.jobLocation === jobLocation) &&
      (!seniorityLevel || job.seniorityLevel === seniorityLevel) &&
      (!jobTitle ||
        job.jobTitle.toLowerCase().includes(jobTitle.toLowerCase())) &&
      (!technicalSkills ||
        technicalSkills.every((skill) => job.technicalSkills.includes(skill)))
    );
  });

  //if no result with user search
  if (!filteredJobs.length)
    return next(
      new Error("There are no jobs with your search requiremens!", {
        cause: 404,
      })
    );
  //send response
  res.status(200).json({ succes: true, filteredJobs });
};

//========================applyToJob========================//
export const applyToJob = async (req, res, next) => {
  //destructing data from body
  const { jobId, userId } = req.body;
  //check job
  const job = await Job.findById(jobId);
  if (!job) return next(new Error("Job not found!", { cause: 404 }));
  //upload CV on the cloudinary
  const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(
    req.file.path,
    {
      folder: `users/${userId}/resume`,
    }
  );
  //create the application in the database
  const application = await Application.create({
    ...req.body,
    userResume: { secure_url, public_id },
  });
  if (!application)
    return next(new Error("Error in applying for this job!", { cause: 400 }));
  //send response
  return res.status(201).json({
    succes: true,
    message: "You have successfully applied for the job",
  });
};
