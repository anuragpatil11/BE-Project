// Rejection email template
const rejectionEmailTemplate = (complianceName, note) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; }
          .highlight { color: #dc3545; font-weight: bold; }
          .note-box { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Compliance Document Update</h2>
          </div>
          <div class="content">
            <p>Dear Student,</p>
            
            <p>We have reviewed your submission for <b>${complianceName}</b> compliance document.</p>
            
            <p>We regret to inform you that your document has been <span class="highlight">rejected</span> for the following reason:</p>
            
            <div class="note-box">
              ${note || "No specific reason provided. Please contact the compliance office for more details."}
            </div>
            
            <p>Please make the necessary corrections and resubmit your document at your earliest convenience.</p>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>
            Compliance Department</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  // Completion email template
  const completionEmailTemplate = (complianceName) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; }
          .success { color: #28a745; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Compliance Document Update</h2>
          </div>
          <div class="content">
            <p>Dear Student,</p>
            
            <p>We are pleased to inform you that your submission for <b>${complianceName}</b> compliance document has been <span class="success">completed</span> and approved.</p>
            
            <p>No further action is required from you regarding this document.</p>
            
            <p>Thank you for your prompt submission and cooperation with our compliance requirements.</p>
            
            <p>If you have any questions or need assistance with other compliance matters, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>
            Compliance Department</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  module.exports = {
    rejectionEmailTemplate,
    completionEmailTemplate
  };