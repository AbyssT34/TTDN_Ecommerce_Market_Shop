import sendEmail from "./emailService.js";

const sendEmailFun = async (to, subject, text, html) => {
  const result = await sendEmail(to, subject, text, html);
  if (result.success) {
    return true;
    //res.status(200).json({message: 'email sent successfully'})
  } else {
    return false;
    //res.status(200).json({message:'Failed to send email'})
  }
};

export default sendEmailFun;
