import { Mailer } from "../../utils/Mailer";

export default async (req, res) => {
  if (req.method === "POST") {
    const { name, email, cost, sender, title, amountChanged } = req.body;
    await Mailer({ name, email, cost, sender, title, amountChanged });
    return res.status(200).end();
  }
  return res.status(404).json({
    error: {
      code: "Page Not Found",
      messgae: "Request is denied",
    },
  });
};
