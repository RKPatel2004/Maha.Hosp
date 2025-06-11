const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose'); // Import mongoose
const SMSEmailDetail = require('../models/SMSEmailDetail'); // Import the SMSEmailDetail model
const router = express.Router();

// Contact form route
router.post('/contact', async (req, res) => {
    try {
        const { firstName, lastName, phone, email, message } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !phone || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Fetch email configuration from the database
        const emailConfig = await SMSEmailDetail.findOne({ _id: 3 }); // Assuming _id is 3

        if (!emailConfig) {
            return res.status(500).json({
                success: false,
                message: 'Email configuration not found.'
            });
        }

        // Create transporter using SMTP
        const transporter = nodemailer.createTransport({
            host: emailConfig.SmtpHost,
            port: emailConfig.SmtpPort,
            secure: false, // true for 465, false for other ports
            auth: {
                user: emailConfig.Email, // Hospital email from database
                pass: emailConfig.EmailPassword // App password from database
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Email content
        const mailOptions = {
            from: `"${firstName} ${lastName}" <${emailConfig.Email}>`, // Hospital email as sender
            to: emailConfig.Email, // Hospital email from database as recipient
            replyTo: email, // User's email for replies
            subject: `New Contact Form Submission from ${firstName} ${lastName}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #d32f2f; text-align: center; border-bottom: 2px solid #d32f2f; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555; width: 120px;">Name:</td>
                <td style="padding: 8px 0; color: #333;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 8px 0; color: #333;">
                  <a href="mailto:${email}" style="color: #1976d2; text-decoration: none;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
                <td style="padding: 8px 0; color: #333;">
                  <a href="tel:${phone}" style="color: #1976d2; text-decoration: none;">${phone}</a>
                </td>
              </tr>
            </table>
          </div>

          <div style="background-color: #f0f8ff; padding: 20px; border-radius: 5px; border-left: 4px solid #1976d2;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="color: #555; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #888; font-size: 14px; margin: 5px 0;">
              This email was sent from the Contact Us form on Mahavir Hospital website
            </p>
            <p style="color: #888; font-size: 14px; margin: 5px 0;">
              Received on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
            </p>
          </div>
        </div>
      `,
            text: `
        New Contact Form Submission

        Name: ${firstName} ${lastName}
        Email: ${email}
        Phone: ${phone}

        Message:
        ${message}

        Received on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      `
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent successfully:', info.messageId);

        res.status(200).json({
            success: true,
            message: 'Your message has been sent successfully! We will get back to you soon.',
            messageId: info.messageId
        });

    } catch (error) {
        console.error('Error sending email:', error);

        // Different error messages based on error type
        let errorMessage = 'Failed to send message. Please try again later.';

        if (error.code === 'EAUTH') {
            errorMessage = 'Email authentication failed. Please contact support.';
        } else if (error.code === 'ECONNECTION') {
            errorMessage = 'Connection failed. Please check your internet connection.';
        }

        res.status(500).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;
