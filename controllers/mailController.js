const { send } = require('@sendgrid/mail')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
function sendMail(email, link, name) {
    const msg = {
        to: email, // Change to your recipient
        from: 'no.reply_onlinedarts@hotmail.com', // Change to your verified sender
        subject: 'Verify your account',
        html: '<strong>Hey '+name+'! Welcome to our online dart league!</strong><br><br>Please click the following link to verify your account:<br>'+link+'<br><br>Sincerely,<br>RobsOnlineDarts Co.',
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent to '+email)
        })
        .catch((error) => {
            // console.error(error)
        })
}
// sendMail('aidan.r.christopher@gmail.com','https://www.youtube.com/watch?v=dQw4w9WgXcQ')
module.exports = {sendMail}