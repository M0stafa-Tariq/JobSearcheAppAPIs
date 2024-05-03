import moment from "moment";
import Application from "../../../DB/models/application.model.js";
import Company from "../../../DB/models/company.model.js";
import Job from "../../../DB/models/job.model.js";
import exceljs from "exceljs";

export const applicationsExcel = async (req, res, next) => {
  let { companyId, date } = req.query;
  //conver date
  date = moment(date);
  //get company
  const company = await Company.findById(req.query.companyId);
  if (!company) return next(new Error("Company not found", { cause: 404 }));

  //get all jobs for specific company
  const jobs = await Job.find({ companyId });
  if (!jobs)
    return next(
      new Error("There are no jobs for this company yet!", { cause: 404 })
    );
  //find all application for every job
  let arrOfApps = [];
  for (const job of jobs) {
    const applications = await Application.find({
      jobId: job._id,
    });
    if (applications?.length) {
      arrOfApps.push(applications);
    }
  }

  //filter job based on day
  let appsOfSpecificDay = [];
  for (const app of arrOfApps) {
    const applicationInSpecificDay = app.filter((obj) => {
      const applicationCreatedAt = moment(obj.createdAt);
      return applicationCreatedAt.isSame(date, "date");
    });
    if (applicationInSpecificDay?.length)
      appsOfSpecificDay.push(applicationInSpecificDay);
  }
  if (!appsOfSpecificDay.length)
    return next(
      new Error(`No applications applied in ${date}`, { cause: 404 })
    );
  //generate excel sheet with data
  let workbook = new exceljs.Workbook();
  let sheet = workbook.addWorksheet("applications");

  //columns
  sheet.columns = [
    { header: "Job ID", key: "jobId", width: 50 },
    { header: "User ID", key: "userId", width: 50 },
    { header: "User TechSkills", key: "userTechSkills", width: 50 },
    { header: "User Soft Skills", key: "userSoftSkills", width: 50 },
    { header: "User Resume", key: "userResume", width: 50 },
  ];

  //add row
  for (const specificJob of appsOfSpecificDay) {
    specificJob.map((value) => {
      sheet.addRow({
        jobId: value.jobId,
        userId: value.userId,
        userTechSkills: value.userTechSkills,
        userSoftSkills: value.userSoftSkills,
        userResume: value.userResume.secure_url,
      });
    });
  }

  // Set response headers for Excel download
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=applications.xlsx"
  );

  // Send the Excel file as the response
  await workbook.xlsx.write(res);
  res.end();
};

export default applicationsExcel;
