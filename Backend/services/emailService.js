const nodemailer = require("nodemailer");


    const transporter = nodemailer.createTransport({
        service: "gmail",
       port:587,
       secure:false,
       auth:{
            user:'sonukumar267f@gmail.com',
            pass:'sihlexhtqhlxkgaj'
       },
      
    });

    

module.exports = transporter;
