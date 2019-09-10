const variables = require('../variables')
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: variables.email.username,
        pass: variables.email.password
    }
})

function send(type, email) {
    const mailOptions = {
        from: variables.email.username,
        to: email,
        subject: type.subject,
        content: type.content
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            // add return reson of failur
            console.log(err)
        } else {
            // add return success
            console.log(info)
        }
    })
}


// send a link for reset and return done for update
const resetPass = {
    subbject: 'reset pass',
    contentn: 'click on the link to reset the pass'
}

const updatePass = {
    subbject: 'update pass',
    contentn: 'your password has been updated, if it wasnt you ...'
}

module.exports = {
    send
}