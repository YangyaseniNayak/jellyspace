const express = require("express");
const router = express.Router();
const Bid = require("../models/bid");
const User = require("../models/user");
const mongoose = require("mongoose");
const { emailSending } = require('../common/common');

router.post("/getbids", async (req, res) => {
  const bids = await Bid.find();
  const bidsByEmail = bids.filter((item) => item.userEmail == req.body.userEmail);
  if (bidsByEmail) {
    return res.json({
      status: true,
      message: 'Bids List',
      data: bidsByEmail
    });
  } else {
    return res.json({
      status: false,
      message: 'Data not available',
      data: ''
    });
  }
});

router.post("/getProjectBids", async (req, res) => {
  const bids = await Bid.find();
  const bidsByEmail = bids.filter((item) => item.projectEmail == req.body.projectEmail);
  if (bidsByEmail) {
    return res.json({
      status: true,
      message: 'Bids List By project',
      data: bidsByEmail
    });
  } else {
    return res.json({
      status: false,
      message: 'Data not available',
      data: ''
    });
  }
});

router.post("/acceptBid", async (req, res) => {
  try {
    const bids = await Bid.updateOne(
      { _id: req.body.id },
      {
        $set: {
          status: req.body.status
        },
      }
    );
    const bidExist = await Bid.findOne({ "_id": req.body.id });
    const user = await User.findOne({ "email": bidExist.userEmail });

    const htmlBodyAcceptedBid = '<!DOCTYPE html><html lang="en" style="font-family: Agency FB;"> '+
      '<head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Template 1</title></head>'+
      '<body style="font-family:Agency FB">'+
         '<header><img style="padding: 20px;margin-left: 30%;width:250px;position: absolute;top: 44px;height: 50px;" src="https://jellyspace-public.s3.amazonaws.com/email-head-image.jpeg" alt="logo"></header>'+
          '<section class="container-fluid" style="margin: 20px;"><div class="container"><p>Hi '+ user.firstName + ' ' + user.lastName + ' </p></div><div class="article" style="margin-top:45px ;"><p>Congratulations !!! <br>SpaceX has accepted your bid for the <strong> '+ bidExist.projectName +' </strong></p></div>'+
          '<div class="list"><p>What you can do now?</p><ul><li style="list-style-type: none;margin-left: 35px; margin-bottom: 20px;"><img style="width: 50px;" src="https://jellyspace-public.s3.amazonaws.com/image6.png" alt="bids"> <span style="margin-left: 20px;position: absolute;margin-top: 20px;"><strong> Finalize and Contract –</strong> Your can chat further with SpaceX and sign the contract.' +
          '</span> </li><li style="list-style-type: none;margin-left: 35px; margin-bottom: 20px;"><img style="width: 50px;" src="https://jellyspace-public.s3.amazonaws.com/cancle.png" alt="bids"> <span style="margin-left: 20px;position: absolute;margin-top: 20px;"><strong> Cancel your bid and interest –</strong> Look for other Projects on <span style="color: #92d051;"> JELLYSPACE </span></span> </li></ul></div>'+
              '<button style="background-color: #92d051;font-size: 15px;color: white;margin: 30px 0px 30px 35%;border: 1px solid #5d8b9b;">  &nbsp; &nbsp; &nbsp; Click & Proceed with a contract &nbsp; <span style="width: 20px; color: blue;">&#8680;</span></button>'+
              '<div><p>Regards,<br>The JELLYSPACE Team</p></div>'+
          '</section></body></html>';

    const htmlBodyRejectedBid = '<!DOCTYPE html><html lang="en" style="font-family: Agency FB;"> '+
      '<head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Template 1</title></head>'+
      '<body style="font-family:Agency FB">'+
         '<header><img style="padding: 20px;margin-left: 30%;width:250px;position: absolute;top: 44px;height: 50px;" src="https://jellyspace-public.s3.amazonaws.com/email-head-image.jpeg" alt="logo"></header>'+
          '<section class="container-fluid" style="margin: 20px;"><div class="container"><p>Hi '+ user.firstName + ' ' + user.lastName + ' </p></div><div class="article" style="margin-top:45px ;"><p>We are sorry !!!! <br>SpaceX has rejected your bid for the <strong> '+ bidExist.projectName +' </strong></p></div>'+
          '<div class="list"><p>What you can do now?</p><ul><li style="list-style-type: none;margin-left: 35px; margin-bottom: 20px;"><img style="width: 50px;" src="https://jellyspace-public.s3.amazonaws.com/image11.png" alt="bids"> <span style="margin-left: 20px;position: absolute;margin-top: 20px;"><strong> Look for other Projects on </strong> <span style="color: #92d051;"> JELLYSPACE </span></span> </li></ul></div>' +
              '<button style="background-color: #92d051;font-size: 15px;color: white;margin: 30px 0px 30px 35%;border: 1px solid #5d8b9b;">  &nbsp; &nbsp; &nbsp; Check & Bid on other Projects &nbsp; <span style="width: 20px; color: blue;">&#8680;</span></button>'+
              '<div><p>Regards,<br>The JELLYSPACE Team</p></div>'+
          '</section></body></html>';

    const htmlbody = bidExist.status == 'accepted' ? htmlBodyAcceptedBid : htmlBodyRejectedBid;
    emailSending(bidExist.userEmail, 'Bid' + bidExist.status, htmlbody);
    //emailSending(bidExist.userEmail, 'Bid' + bidExist.status, htmlbody);
    return res.json({
      status: true,
      message: 'Bids was ' + req.body.status,
      data: bidExist
    });
  } catch (error) {
    console.log('error ' + error);
    return res.json({
      status: false,
      message: 'status update failed',
      data: ''
    });
  }
});

router.post("/postBid", async (req, res) => {
  try {
    const user = await User.findOne({ "email": req.body.userEmail });
    const projectUser = await User.findOne({ "email": req.body.projectEmail });
    const projectBidding = new Bid({
        projectId: req.body.projectId,
        projectName:req.body.projectName,
        projectEmail:req.body.projectEmail,
        bidAmount: req.body.bidAmount,
        status: req.body.status,
        rupeesId: req.body.rupeesId,
        bidDescription: req.body.bidDescription,
        userEmail: req.body.userEmail,
      });

      await projectBidding.save();

      const htmlBodyPostedBid  = '<!DOCTYPE html><html lang="en" style="font-family: Agency FB;">' +
      '<head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Template 2</title></head>' +
      '<body style="font-family:Agency FB"><header><img style="padding: 20px;margin-left: 25%;width:250px;position: absolute;top: 44px;height: 50px;" src="https://jellyspace-public.s3.amazonaws.com/email-head-image.jpeg" alt="logo"></header>'+
          '<section class="container-fluid" style="margin: 20px;"><div><p>Hi '+ user.firstName + ' ' + user.lastName +', </p></div><div class="article"><p> You have successfully posted your bid for  <strong> '+ projectBidding.projectName +' </strong></p></div><button style="background-color: #92d051;font-size: 15px;color: white;margin: 30px 0px 30px 28%;border: 1px solid #5d8b9b;">  &nbsp; &nbsp; &nbsp; Check Your Bid &nbsp; <span style="width: 20px; color: blue;">&#8680;</span></button><div class="list"><p>What you can do now?</p>'+
          '<ul><li style="list-style-type: none;margin-left: 35px; margin-bottom: 20px;"><img style="width: 50px;" src="https://jellyspace-public.s3.amazonaws.com/image10.png" alt="bids"><span style="margin-left: 20px;position: absolute;margin-top: 20px;"><strong>Wait for the Bid Acceptance – </strong> You can view your bids details by visiting the project page.</span> </li>'+
                      '<li style="list-style-type: none;margin-left: 35px; margin-bottom: 20px;"><img style="width: 50px;" src="https://jellyspace-public.s3.amazonaws.com/image6.png" alt="bids"> <span style="margin-left: 20px;position: absolute;margin-top: 20px;">,<strong> Finalize and Contract – </strong>Once your bid is accepted you can proceed with signing the contract.</span> </li><li style="list-style-type: none;margin-left: 35px; margin-bottom: 20px;"><img style="width: 50px;" src="https://jellyspace-public.s3.amazonaws.com/image11.png" alt="bids"> <span style="margin-left: 20px;position: absolute;margin-top: 20px;"><strong> Look for other Projects meantime on</strong> <span style="color:#92d051;"> JELLYSPACE </span></span> </li></ul></div><div><p>Regards,<br>The JELLYSPACE Team</p></div>'+
          '</section></body></html>';
 
      const htmlBodyForProjectedBid = '<!DOCTYPE html><html lang="en" style="font-family: Agency FB;"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>'+
          '<body style="font-family:Agency FB"><header><img style="padding: 20px;margin-left: 25%;width:250px;position: absolute;top: 44px;height: 50px;" src="https://jellyspace-public.s3.amazonaws.com/email-head-image.jpeg" alt="logo"></header>'+
          '<section class="container-fluid" style="margin: 20px;"><div><p>Hi '+ projectUser.firstName + ' ' + projectUser.lastName +', </p></div><div class="article" style="margin-top:45px ;"><p>1 Professional wants to work for   <strong> '+ projectBidding.projectName +' </strong> <br> for you!</p></div><div class="list"><p>What you can do now?</p>'+
                  '<ul><li style="list-style-type: none;margin-left: 35px; margin-bottom: 20px;"><img style="width: 50px;" src="https://jellyspace-public.s3.amazonaws.com/image5.png" alt="bids"> <span style="margin-left: 20px;position: absolute;margin-top: 20px;"><strong> Compare – </strong> Bid-Proposals, Profiles, Background, Pricing etc. and chat with them to<br>    discuss your project.</span> </li>'+
                      '<li style="list-style-type: none;margin-left: 35px; margin-bottom: 20px;"><img style="width: 50px;" src="https://jellyspace-public.s3.amazonaws.com/image6.png" alt="bids"> <span style="margin-left: 20px;position: absolute;margin-top: 20px;"><strong> Finalize and Contract –</strong> Your preferred Company or Professional.</span> </li>'+
                      '<li style="list-style-type: none;margin-left: 35px; margin-bottom: 20px;"><img style="width: 50px;" src="https://jellyspace-public.s3.amazonaws.com/x-man.png" alt="bids"> <span style="margin-left: 20px;position: absolute;margin-top: 20px;"><strong> Reject the bid –</strong> You can either edit your Project or wait for more bids</span> </li>'+
                  '</ul></div><button style="background-color: #92d051;font-size: 15px;color: white;margin: 30px 0px 30px 65%;border: 1px solid #5d8b9b;">  &nbsp; &nbsp; &nbsp; Check to View Bids &nbsp; <span style="width: 20px; color: blue;">&#8680;</span></button>'+
              '<div><p>Regards,<br>The JELLYSPACE Team</p></div></section></body></html>';

      emailSending(projectBidding.userEmail, 'Project Bid', htmlBodyPostedBid);
      emailSending(projectBidding.projectEmail, 'Project Bid', htmlBodyForProjectedBid);
      return res.json({
        status: true,
        message: 'Successfully Project Bidding',
        data: projectBidding
      });
  } catch (err) {
    console.log('error' + JSON.stringify(err));
    return res.json({
      status: false,
      message: 'Project Bidding failed',
      data: ''
    });
  }
});

module.exports = router;