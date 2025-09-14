import nodemailer from 'nodemailer';
import { User } from "@prisma/client";

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

interface TicketEmailData {
    user: User;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    eventVenue: string;
    ticketQuantity: number;
    totalAmount: number;
    paymentId: string;
}

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.STMP_USER,
                pass: process.env.STMP_PASS,
            },
        });
    }

    async sendEmail(options: EmailOptions): Promise<void> {
        try {
            await this.transporter.sendMail({
                from:  `"${process.env.REACT_APP_APP_NAME || 'Event Management'}" <${process.env.SMTP_USER}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
            });

            console.log('Email sent successfully to ${options.to}');
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }

    async sendTicketConfirmation(data: TicketEmailData): Promise<void> {
        const subject = 'Ticket Confirmation - ${data.eventTitle}';

        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; text-align: center; padding: 30px; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .ticket-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎫 Ticket Confirmation</h1>
              <p>Your tickets are ready!</p>
            </div>
            
            <div class="content">
              <h2>Hi ${data.user.firstName}!</h2>
              <p>Great news! Your ticket purchase has been confirmed. Here are your event details:</p>
              
              <div class="ticket-info">
                <h3>📅 ${data.eventTitle}</h3>
                <p><strong>Date:</strong> ${data.eventDate}</p>
                <p><strong>Time:</strong> ${data.eventTime}</p>
                <p><strong>Venue:</strong> ${data.eventVenue}</p>
                <p><strong>Tickets:</strong> ${data.ticketQuantity}</p>
                <p><strong>Total Paid:</strong> $${data.totalAmount.toFixed(2)}</p>
                <p><strong>Payment ID:</strong> ${data.paymentId}</p>
              </div>
              
              <h3>🎉 What's Next?</h3>
              <ul>
                <li>Save this email as your ticket confirmation</li>
                <li>Arrive 30 minutes before the event starts</li>
                <li>Bring a valid ID for verification</li>
                <li>Show this email at the entrance</li>
              </ul>
              
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">
                View My Tickets
              </a>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing our platform!</p>
              <p>Need help? Contact us at support@eventapp.com</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      Ticket Confirmation - ${data.eventTitle}
      
      Hi ${data.user.firstName}!
      
      Your ticket purchase has been confirmed:
      
      Event: ${data.eventTitle}
      Date: ${data.eventDate}
      Time: ${data.eventTime}
      Venue: ${data.eventVenue}
      Tickets: ${data.ticketQuantity}
      Total Paid: $${data.totalAmount.toFixed(2)}
      Payment ID: ${data.paymentId}
      
      Please save this email as your ticket confirmation.
    `;

    await this.sendEmail({
      to: data.user.email,
      subject,
      html,
      text,
    });
  }

  async sendWelcomeEmail(user: User): Promise<void> {
    const subject = 'Welcome to Event Management Platform!';
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; text-align: center; padding: 30px; border-radius: 10px; }
            .content { padding: 30px 0; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome ${user.firstName}!</h1>
              <p>Your account has been created successfully</p>
            </div>
            
            <div class="content">
              <h2>Get Started</h2>
              <p>You can now browse amazing events and book your tickets!</p>
              
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">
                Explore Events
              </a>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }
}

export const emailService = new EmailService();