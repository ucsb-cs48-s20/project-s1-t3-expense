import dbConnect from "../../../utils/dbConnect";
import Bill from "../../../models/Bill";

dbConnect();

export default async (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const bills = await Bill.find({});

        res.status(200).json({ success: true, data: bills });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const bill = await Bill.create(req.body);

        res.status(201).json({ success: true, data: bill });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
