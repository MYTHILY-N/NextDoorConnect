import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD
    }
  });
};

export const sendVerificationEmail = async (user, status) => {
  let subject = "";
  let htmlContent = "";

  if (status === "verified") {
    subject = "🎉 Your Account Has Been Verified - NextDoor Connect";
    htmlContent = `
      <div style="font-family: Arial; padding: 20px; line-height: 1.6; color: #333;">
        <h2 style="color: #00bdb3;">Congratulations, ${user.fullName}!</h2>
        <p>Your account has been successfully <b>verified</b> by the admin team.</p>
        
        <p>You can now:</p>
        <ul>
          <li>Access all platform features</li>
          <li>Connect with your community</li>
          <li>Offer and explore services</li>
        </ul>

        <p>We’re excited to have you on <b>NextDoor Connect</b> 🚀</p>

        <br/>
        <p style="margin: 0;">Regards,</p>
        <p style="margin: 0; font-weight: bold; color: #00bdb3;">NextDoor Connect Team</p>
      </div>
    `;
  } else if (status === "rejected") {
    subject = "❌ Account Verification Update - NextDoor Connect";
    htmlContent = `
      <div style="font-family: Arial; padding: 20px; line-height: 1.6; color: #333;">
        <h2 style="color: #e74c3c;">Hello, ${user.fullName}</h2>
        <p>We regret to inform you that your account verification request has been <b>rejected</b>.</p>
        
        <p>This may be due to:</p>
        <ul>
          <li>Incomplete information</li>
          <li>Invalid documents</li>
          <li>Policy compliance issues</li>
        </ul>

        <p>You can contact support for more details regarding this decision.</p>

        <br/>
        <p style="margin: 0;">Regards,</p>
        <p style="margin: 0; font-weight: bold; color: #00bdb3;">NextDoor Connect Team</p>
      </div>
    `;
  }

  if (!subject) return;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"NextDoor Connect" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: subject,
      html: htmlContent
    });
    console.log(`✅ Verification email sent to ${user.email} (${status})`);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};

export const sendComplaintStatusEmail = async (complaint, status) => {
  let subject = `[Update] Complaint Resolution - NextDoor Connect`;
  let htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 12px;">
      <h2 style="color: #00bdb3; border-bottom: 2px solid #00bdb3; padding-bottom: 10px;">Complaint Update</h2>
      <p>Hello <strong>${complaint.fullName}</strong>,</p>
      <p>We are writing to inform you that your complaint has been reviewed by our administration team.</p>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Complaint ID:</strong> #${complaint._id.toString().slice(-6).toUpperCase()}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${status === 'resolved' ? '#27ae60' : '#e74c3c'}; font-weight: bold; text-transform: uppercase;">${status}</span></p>
        <p style="margin: 5px 0;"><strong>Description:</strong> ${complaint.description}</p>
      </div>

      <p>${status === 'resolved' ? 
        "Our team has successfully <strong>resolved</strong> the issue mentioned in your complaint. We appreciate your patience and for helping us keep NextDoor Connect a safe and helpful community." : 
        "Unfortunately, after a thorough review, your complaint was <strong>rejected</strong>. If you feel this is a mistake, please reach out to us with more details."}</p>

      <br/>
      <p style="margin: 0;">Regards,</p>
      <p style="margin: 0; font-weight: bold; color: #00bdb3;">NextDoor Connect Support Team</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888; text-align: center;">This is an automated message, please do not reply directly to this email.</p>
    </div>
  `;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"NextDoor Connect Admin" <${process.env.SENDER_EMAIL}>`,
      to: complaint.email,
      subject: subject,
      html: htmlContent
    });
    console.log(`✅ Complaint email sent to ${complaint.email} (${status})`);
  } catch (error) {
    console.error("❌ Error sending complaint email:", error.message);
  }
};
