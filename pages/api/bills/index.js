import dbConnect from "../../../utils/dbConnect";
import Bill from "../../../models/Bill";
import auth0 from "../../../utils/auth0";

dbConnect();

export default auth0.requireAuthentication(async function (req, res) {
  const { method } = req;
  const { user } = await auth0.getSession(req);
  switch (method) {
    case "GET":
      try {
        const bills = await getBill(user);

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
});

export async function getBill(user) {
  return Bill.find({
    $or: [{ "members.email": user.email }, { unique: user.sub }],
  });
}
