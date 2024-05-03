import Application from "../../../DB/models/application.model.js";
import Company from "../../../DB/models/company.model.js";
import Job from "../../../DB/models/job.model.js";

//========================addCompany========================//
export const addCompany = async (req, res, next) => {
  //destructing data from body
  const { companyName, companyEmail } = req.body;
  //check if company name already exists
  const isCompanyNameExists = await Company.findOne({ companyName });
  if (isCompanyNameExists)
    return next(
      new Error("This company name is already exists!", { cause: 409 })
    );
  //check if company eamail already exists
  const isCompanyEmailExists = await Company.findOne({ companyEmail });
  if (isCompanyEmailExists)
    return next(
      new Error("This company Email is already exists!", { cause: 409 })
    );
  //create company
  const createCompany = await Company.create({...req.body,companyHR:req.user._id});
  //failed case
  if (!createCompany)
    return next(new Error("Create company is failed!", { cause: 400 }));
  //success case and return response
  return res.status(201).json({
    succes: true,
    message: "Company created successfully!",
  });
};

//========================updateCompany========================//
export const updateCompany = async (req, res, next) => {
  //get company
  const company = await Company.findById(req.query.companyId);
  //destructing data from body
  const {
    companyName,
    companyEmail,
    description,
    industry,
    address,
    numberOfEmployees,
    companyHR,
  } = req.body;

  //check if companyName has changed
  if (companyName) {
    //check if company name is already exists
    const isCompanyNameExists = await Company.findOne({ companyName });
    if (isCompanyNameExists)
      return next(
        new Error("This company name is already exists!", { cause: 409 })
      );
    company.companyName = companyName;
  }

  //check if companyEmail has changed
  if (companyEmail) {
    //check if company eamail is already exists
    const isCompanyEmailExists = await Company.findOne({ companyEmail });
    if (isCompanyEmailExists)
      return next(
        new Error("This company Email is already exists!", { cause: 409 })
      );
    company.companyEmail = companyEmail;
  }

  //check if description has changed
  if (description) company.description = description;

  //check if industry has changed
  if (industry) company.industry = industry;

  //check if address has changed
  if (address) company.address = address;

  //check if numberOfEmployees has changed
  if (numberOfEmployees) company.numberOfEmployees = numberOfEmployees;

  //check if companyHR has changed
  if (companyHR) company.companyHR = companyHR;

  //update company
  const updatedCompany = await company.save();
  if (!updatedCompany) return next(new Error("Updated fail", { cause: 400 }));

  //send response
  return res.status(200).json({ message: "Company updated successfully!" });
};

//========================deleteCompany========================//
export const deleteCompany = async (req, res, next) => {
  //delete company
  const deleteCompany = await Company.findByIdAndDelete(req.query.companyId);
  if (!deleteCompany) return next(new Error("delete fail", { cause: 400 }));
  //send response
  return res.status(200).json({
    success: true,
    message: "Company deleted success!",
  });
};

//========================getCompanyDataWithRealatedJobs========================//
export const getCompanyData = async (req, res, next) => {
  //search for campany with id in params
  const companyData = await Company.findById(req.params.companyId).lean();
  if (!companyData)
    return next(new Error("There is no company with that id!", { cause: 404 }));
  //return all jobs related to this company
  const jobs = await Job.find({ companyId: req.params.companyId });
  companyData.jobs = jobs;
  //return response
  return res.status(200).json({ succes: true, companyData });
};

//========================searchCompany========================//
export const searchCompanyWithName = async (req, res, next) => {
  //search for company with req.companyName
  const company = await Company.findOne({ companyName: req.query.companyName });
  if (!company)
    return next(
      new Error("There is no company with this name!", { cause: 404 })
    );
  //send response
  return res.status(200).json({ succes: true, companyData: company });
};

//========================getAllApplicationsForSpecificJobs========================//
export const getAllApplicationsForSpecificJobs = async (req, res, next) => {
  //get all applications
  const applications = await Application.find({
    jobId: req.query.jobId,
  }).populate([{ path: "userId" }]);
  if (!applications.length)
    return next(new Error("There are no applications yet!"));
  //send response
  return res.status(200).json({
    message: true,
    applicationsWithUserData: applications,
  });
};
