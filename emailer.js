// Verify, every 24 hours, that an SMTP email account is accessible.
// The email address, password, and smtp server address should exist as environment variables in process.env.email, process.env.password, and process.env.server, respectively.

const nodemailer = require('nodemailer')
require('dotenv').config()

const verifyLoop = async (seconds = 86400) => {
    if (!process.env.server || !process.env.email || !process.env.password) {
        throw ('Environment variables missing!')
    }
    const transporter = nodemailer.createTransport(`smtps://${process.env.email}:${process.env.password}@${process.env.server}`)
    while (true) {
        await transporter.verify()
        console.log(`Access to ${process.env.email} was verified on ${new Date()}.\nWill try again in ${seconds} seconds.`)
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, seconds * 1000);
        })
    }
}

verifyLoop().catch(err => {
    console.error(err)
    process.exit(1)
})