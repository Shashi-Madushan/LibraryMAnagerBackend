import nodemailer from 'nodemailer';
import config from '@/config';
import logger from '@/lib/winston';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.EMAIL_USER ,
        pass: config.EMAIL_PASSWORD
    }
});

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions): Promise<boolean> => {
    try {
        const mailOptions = {
            from: config.EMAIL_USER,
            to,
            subject,
            html
        };

        logger.info('Attempting to send email', {
            to,
            subject,
            service: 'nodemailer'
        });

        await transporter.sendMail(mailOptions);
        
        logger.info('Email sent successfully', {
            to,
            subject,
            service: 'nodemailer'
        });
        
        return true;
    } catch (error) {
        logger.error('Failed to send email', {
            error: error instanceof Error ? error.message : 'Unknown error',
            to,
            subject,
            service: 'nodemailer'
        });
        return false;
    }
}

export const generateReminderEmailContent = (userName: string, books: { title: string; dueDate: Date }[]): string => {
    const booksHtml = books.map(book => `
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">${book.title}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${book.dueDate.toLocaleDateString()}</td>
        </tr>
    `).join('');

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Library Book Return Reminder</h2>
            <p>Dear ${userName},</p>
            <p>This is a friendly reminder about your borrowed books that are due soon:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                    <tr>
                        <th style="padding: 10px; border: 1px solid #ddd; background-color: #f5f5f5;">Book Title</th>
                        <th style="padding: 10px; border: 1px solid #ddd; background-color: #f5f5f5;">Due Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${booksHtml}
                </tbody>
            </table>
            
            <p>Please ensure to return these books on time to avoid any late fees.</p>
            <p>Thank you for using our library services!</p>
            
            <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
        </div>
    `;
};
