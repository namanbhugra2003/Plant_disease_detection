import express from "express";
import { Farmer } from "../Models/farmerModel.js";
import authenticateToken, { authorize } from "../Middleware/authMiddleware.js";

const router = express.Router();

// ✅ Fetch all submitted forms (with filters/search)
router.get("/forms", authenticateToken, authorize("manager"), async (req, res) => {
  try {
    const { status, search, date } = req.query;
    let query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { plantName: { $regex: search, $options: "i" } },
        { diseaseName: { $regex: search, $options: "i" } },
        { issueDescription: { $regex: search, $options: "i" } },
      ];
    }
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.requestDate = { $gte: startDate, $lte: endDate };
    }

    const forms = await Farmer.find(query);
    return res.status(200).json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update status
router.put("/form/:id/status", authenticateToken, authorize("manager"), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedForm = await Farmer.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedForm) return res.status(404).json({ message: "Form not found" });

    return res.status(200).json(updatedForm);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Reply to a form
router.post("/form/:id/reply", authenticateToken, authorize("manager"), async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    if (!reply) return res.status(400).json({ message: "Reply content is required" });

    const updatedForm = await Farmer.findByIdAndUpdate(id, { reply }, { new: true });
    if (!updatedForm) return res.status(404).json({ message: "Form not found" });

    return res.status(200).json(updatedForm);
  } catch (error) {
    console.error("Error sending reply:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete reply only
router.delete("/form/:id/reply", authenticateToken, authorize("manager"), async (req, res) => {
  try {
    const { id } = req.params;

    const updatedForm = await Farmer.findByIdAndUpdate(id, { $unset: { reply: 1 } }, { new: true });
    if (!updatedForm) return res.status(404).json({ message: "Inquiry not found" });

    return res.status(200).json({ message: "Reply removed successfully", updatedForm });
  } catch (error) {
    console.error("Error deleting reply:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Farmer views all their inquiries with replies
router.get("/farmer/:email/inquiries", authenticateToken, async (req, res) => {
  try {
    const { email } = req.params;
    const inquiries = await Farmer.find({ email });

    if (!inquiries.length) {
      return res.status(404).json({ message: "No inquiries found" });
    }

    return res.status(200).json(inquiries);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Report summary
router.get("/reports", authenticateToken, authorize("manager"), async (req, res) => {
  try {
    const totalReports = await Farmer.countDocuments();
    const pendingReports = await Farmer.countDocuments({ status: "Pending" });
    const resolvedReports = await Farmer.countDocuments({ status: "Resolved" });

    const diseaseCounts = await Farmer.aggregate([
      { $group: { _id: "$diseaseName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      totalReports,
      pendingReports,
      resolvedReports,
      commonDiseases: diseaseCounts,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Monthly report trends
router.get("/reports/monthly", authenticateToken, authorize("manager"), async (req, res) => {
  try {
    const reports = await Farmer.aggregate([
      {
        $group: {
          _id: { $month: "$requestDate" },
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching monthly reports:", error);
    res.status(500).json({ message: "Server error" });
  }
});



export default router;