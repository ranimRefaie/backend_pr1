const express = require('express');
const nodemailer = require('nodemailer');



const sendEmail= async (req, res) => {
  const { name, email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'futureschoolemails@gmail.com',
      pass: 'zahf owtv scyn efqx'
      //pass: 'xris iwwj cnom egkz'
    }
  });

  const mailOptions = {
    from: email,
    to: 'futuretypicalschool123@gmail.com', 
    subject: subject,
    html: `
      <div style="font-size: 18px; font-family: Arial, sans-serif;">
        <h2>Message from ${name}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      </div>
    ` // HTML content for the email
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    res.status(500).send('Error sending email');
  }
};





const sendJobApplicationEmail = async (req, res) => {
  const { name, email, mobile, positionType } = req.body;
  const file = req.file;

  try {
    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
      user: 'futureschoolemails@gmail.com',
      pass: 'zahf owtv scyn efqx'
      },
    });

    // Define mail options
    const mailOptions = {
      from: email,
      to: 'futuretypicalschool123@gmail.com', 
      subject: `Job Application from ${name}`,
      html: `
      <div style="font-size: 18px; font-family: Arial, sans-serif;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile Number:</strong> ${mobile}</p>
        <p><strong>Position Type:</strong> ${positionType}</p>
      </div>
    ` ,
     // text: `Name: ${name}\nEmail: ${email}\nMobile Number: ${mobile}\nPosition Type: ${positionType}`,
      attachments: [
        {
          filename: file.originalname,
          path: file.path,
        },
      ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', error });
  }
};

module.exports ={sendEmail, sendJobApplicationEmail};