import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

// Configure SendGrid with API key from environment variables
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const isProduction = process.env.NODE_ENV === 'production';
const RECIPIENT_EMAIL = process.env.EMAIL_RECIPIENT || 'josemaria.barbeito@icloud.com';
const SENDER_EMAIL = process.env.EMAIL_SENDER || 'noreply@yourdomain.com';

export async function POST(request) {
  // Set CORS headers
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS method for CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Missing required fields' }),
        { status: 400, headers }
      );
    }

    if (isProduction && process.env.SENDGRID_API_KEY) {
      // Use SendGrid in production
      const msg = {
        to: RECIPIENT_EMAIL,
        from: {
          email: SENDER_EMAIL,
          name: `${name} (via Contact Form)`
        },
        replyTo: email,
        subject: `Contact Form: ${subject}`,
        text: message,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      };

      await sgMail.send(msg);
    } else {
      // Fallback to test account in development
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const info = await transporter.sendMail({
        from: `"${name}" <${testAccount.user}>`,
        to: RECIPIENT_EMAIL,
        subject: `[TEST] Contact Form: ${subject}`,
        text: message,
        html: `
          <h3>TEST EMAIL - New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <p><em>This is a test email. In production, this would be sent to ${RECIPIENT_EMAIL}</em></p>
        `,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Development email preview URL:', previewUrl);
    }

    return new NextResponse(
      JSON.stringify({ 
        success: true,
        message: isProduction 
          ? 'Email sent successfully!' 
          : 'Test email sent. Check the console for the preview link.'
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers }
    );
  }
}
