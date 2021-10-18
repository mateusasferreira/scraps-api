import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

export const transport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: process.env.EMAIL_ADDRESS,
		pass: process.env.EMAIL_PASSWORD,
	},
})
