/* Use sendGrid API to send email to user */
const Mailer = async ({ name, email, cost, sender, title }) => {
  await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SENDGRID}`,
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [
            {
              email,
            },
          ],
          subject: "Payment Notifications",
        },
      ],
      from: {
        email: "lin1257462400@gmail.com",
        name: "House Expenses Splitter App",
      },
      content: [
        {
          type: "text/html",
          value: `Hi ${name}, you are asked to pay $${cost} by ${sender} for ${title}`,
        },
      ],
    }),
  });
};

export { Mailer };
