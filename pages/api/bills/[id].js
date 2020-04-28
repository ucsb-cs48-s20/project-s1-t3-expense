import dbConnect from "../../../utils/dbConnect";
import Bill from "../../../models/Bill";

dbConnect();

export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const bill = await Bill.findById(id);

        if (!bill) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: bill });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "PUT":
      try {
        const bill = await Bill.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!bill) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: bill });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        const deletedBill = await Bill.deleteOne({ _id: id });

        if (!deletedBill) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
