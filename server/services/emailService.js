const nodemailer = require('nodemailer');
const { rejectionEmailTemplate, completionEmailTemplate } = require('../utils/emailTemplates');

// Configure transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send rejection email
const sendRejectionEmail = async (studentEmail, complianceName, note) => {
  const mailOptions = {
    // from: process.env.EMAIL_USER,
    from: `"I2IT Warden" <${process.env.EMAIL_USER}>`,
    to: studentEmail,
    subject: `Compliance Document Rejected: ${complianceName}`,
    html: rejectionEmailTemplate(complianceName, note)
  };

  return await transporter.sendMail(mailOptions);
};

// Function to send completion email
const sendCompletionEmail = async (studentEmail, complianceName) => {
  const mailOptions = {
    // from: process.env.EMAIL_USER,
    from: `"I2IT Warden" <${process.env.EMAIL_USER}>`,
    to: studentEmail,
    subject: `Compliance Document Completed: ${complianceName}`,
    html: completionEmailTemplate(complianceName)
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  sendRejectionEmail,
  sendCompletionEmail
};