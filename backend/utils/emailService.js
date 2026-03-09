import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SENDER_EMAIL, // Your real Gmail
        pass: process.env.SENDER_PASSWORD, // Your App Password
    },
});

/**
 * Sends a professional status update email to the user
 * @param {Object} details - Email details object
 * @param {string} details.userName - Name of the user
 * @param {string} details.userEmail - Email of the user
 * @param {string} details.complaintId - ID of the complaint
 * @param {string} details.complaintTitle - Title/Summary of the complaint
 * @param {string} details.complaintStatus - New status (resolved, pending, rejected)
 * @param {string} [details.adminMessage] - Optional message from admin
 */
export const sendComplaintStatusEmail = async ({
    userName,
    userEmail,
    complaintId,
    complaintTitle,
    complaintStatus,
    adminMessage
}) => {
    const statusColor = {
        resolved: "#16a34a",
        rejected: "#dc2626",
        pending: "#ca8a04"
    }[complaintStatus] || "#00bdb3";

    const mailOptions = {
        from: `NextDoor Connect Admin <${process.env.ADMIN_EMAIL}>`,
        to: userEmail,
        subject: `[Update] Complaint #${complaintId.slice(-6).toUpperCase()} Status: ${complaintStatus.toUpperCase()}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    .email-wrapper { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 40px 20px; }
                    .content-card { background: #ffffff; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e2e8f0; }
                    .header { background: linear-gradient(135deg, #00bdb3 0%, #008f88 100%); padding: 30px; text-align: center; }
                    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
                    .body { padding: 40px 30px; }
                    .greeting { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 10px; }
                    .status-item { margin-bottom: 25px; padding: 20px; background: #f1f5f9; border-radius: 12px; }
                    .label { font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
                    .value { font-size: 15px; color: #1e293b; font-weight: 600; }
                    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; text-transform: uppercase; background: ${statusColor}15; color: ${statusColor}; border: 1px solid ${statusColor}30; }
                    .admin-note { border-left: 4px solid #00bdb3; padding: 15px 20px; background: #f0fdfa; margin: 25px 0; border-radius: 0 12px 12px 0; }
                    .footer { text-align: center; padding: 30px; font-size: 13px; color: #94a3b8; }
                </style>
            </head>
            <body>
                <div class="email-wrapper">
                    <div class="content-card">
                        <div class="header">
                            <h1>NextDoor Connect</h1>
                        </div>
                        <div class="body">
                            <p class="greeting">Hello ${userName},</p>
                            <p>There has been an update to your complaint. Our community administrator has reviewed your case.</p>
                            
                            <div class="status-item">
                                <div style="margin-bottom: 15px;">
                                    <div class="label">Complaint Reference</div>
                                    <div class="value">#${complaintId.toUpperCase()}</div>
                                </div>
                                <div style="margin-bottom: 15px;">
                                    <div class="label">Complaint Description</div>
                                    <div class="value">${complaintTitle}</div>
                                </div>
                                <div>
                                    <div class="label">Current Status</div>
                                    <div class="status-badge">${complaintStatus}</div>
                                </div>
                            </div>

                            ${adminMessage ? `
                            <div class="admin-note">
                                <div class="label">Message from Admin</div>
                                <div class="value" style="font-weight: 500; font-style: italic;">"${adminMessage}"</div>
                            </div>
                            ` : ''}

                            <p style="margin-top: 30px;">Thank you for your patience while we addressed this issue. If you have further questions, please reach out via the Help center.</p>
                            
                            <p style="margin-bottom: 0;">Best Regards,</p>
                            <p style="margin-top: 0; font-weight: 800; color: #00bdb3;">Community Admin</p>
                        </div>
                    </div>
                    <div class="footer">
                        &copy; 2026 NextDoor Connect. All rights reserved.<br>
                        This is an automated notification. Please do not reply to this email.
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Status update email sent to ${userEmail} [Status: ${complaintStatus}]`);
    } catch (error) {
        console.error("❌ Error sending status update email:", error);
        throw error; // Rethrow to handle in controller
    }
};
