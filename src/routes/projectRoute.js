const express = require("express");
const router = express.Router();
const Project = require("../models/project");
const { emailSending } = require('../common/common');
const User = require("../models/user");

router.post("/getProjects", async (req, res) => {
  //const projects = await Project.find();
  const projects = await Project.aggregate([
    {
      $lookup: {
        from: 'bids',
        localField: '_id',
        foreignField: 'projectId',
        as: 'bids'
      }
    }]);
  const projectsbyEmail = projects.filter((item) => item.userEmail == req.body.email);
  if (projectsbyEmail) {
    return res.json({
      status: true,
      message: 'Projects list by email',
      data: projectsbyEmail
    });
  } else {
    return res.json({
      status: false,
      message: 'Data not available',
      data: ''
    });
  }
});

router.get("/projects", async (req, res) => {
  //const projects = await Project.find();

  const projects = await Project.aggregate([
    {
      $lookup: {
        from: 'bids',
        localField: '_id',
        foreignField: 'projectId',
        as: 'bids'
      }
    }]);


  if (projects) {
    return res.json({
      status: true,
      message: 'Projects List',
      data: projects
    });
  } else {
    return res.json({
      status: false,
      message: 'Data not available',
      data: ''
    });
  }
});

router.post("/postAProject", async (req, res) => {
  try {
    const projectPosting = new Project({
      projectName: req.body.projectName,
      projectDescription: req.body.projectDescription,
      skills: req.body.skills,
      billingProcess: req.body.billingProcess,
      budget: req.body.budget,
      projectType: req.body.projectType,
      userEmail: req.body.userEmail
    });

    const user = await User.findOne({ "email": req.body.userEmail });

    await projectPosting.save();


    const htmlbodyForpostedProject = '<!DOCTYPE html><html lang="en" style="font-family: Agency FB;"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Template 2</title></head>' +
      '<body style="font-family:Agency FB"><header><img style="padding: 20px;margin-left: 25%;width:250px;position: absolute;top: 44px;height: 50px;" src="https://jellyspace-public.s3.amazonaws.com/email-head-image.jpeg" alt="logo"></header>' +
      '<section class="container-fluid" style="margin: 20px;"><div><p>Hi ' + user.firstName + ' ' + user.lastName + ', </p></div><div><p>You have successfully posted your project!</p></div><div class="article" style="margin-top:45px ;"><p> Your project details for  <strong> ' + projectPosting.projectName + ' </strong> have now been notified to hundreds of companies and<br> professionals across the globe.</p></div>' +
      '<div class="list"><p>What you can do now?</p><ul><li style="list-style-type: none;margin-left: 35px; margin-bottom: 20px;"><img style="width: 50px;" src="https://jellyspace-public.s3.amazonaws.com/image4.png" alt="bids"> <span style="margin-left: 20px;position: absolute;margin-top: 20px;"><strong> Receive Bids –</strong> You can view their bids by visiting the project page</span> </li>' +
      '<li style="list-style-type: none;margin-left: 35px; margin-bottom: 20px;"><img style="width: 50px;" src="https://jellyspace-public.s3.amazonaws.com/image5.png" alt="bids"> <span style="margin-left: 20px;position: absolute;margin-top: 20px;"><strong> Compare –</strong> Bid-Proposals, Profiles, Background, Pricing etc. and chat with them to discuss you project.</span> </li>' +
      '<li style="list-style-type: none;margin-left: 35px; margin-bottom: 20px;"><img style="width: 50px;" src="https://jellyspace-public.s3.amazonaws.com/image6.png" alt="bids"> <span style="margin-left: 20px;position: absolute;margin-top: 20px;"><strong> Finalize and Contract –</strong> Your preferred Company or Professional</span> </li>' +
      '</ul></div><div><p style="position: absolute;margin: 36px 0 0 25%;">Get Your Project Started!</p></div>' +
      '<button style="background-color: #92d051;font-size: 15px;color: white;margin: 30px 0px 30px 65%;border: 1px solid #5d8b9b;">  &nbsp; &nbsp; &nbsp; Check bids on your project &nbsp; <span style="width: 20px; color: blue;">&#8680;</span></button>' +
      '<div><p>Regards,<br>The JELLYSPACE Team</p></div></section></body> </html>';

    emailSending(projectPosting.userEmail, projectPosting.projectName, htmlbodyForpostedProject);
    return res.json({
      status: true,
      message: 'Successfully Project Posted',
      data: projectPosting
    });
  } catch (err) {
    console.log('error' + JSON.stringify(err));
    return res.json({
      status: false,
      message: 'Project Posting failed',
      data: ''
    });
  }
});

router.post("/deleteProject", async (req, res) => {
  try {
    await Project.deleteOne({ _id: req.body.id });
    return res.json({
      status: true,
      message: 'Successfully Project Deleted',
      data: ''
    });
  } catch (err) {
    console.log('error' + JSON.stringify(err));
    return res.json({
      status: false,
      message: 'Project deletion failed',
      data: ''
    });
  }
});

module.exports = router;