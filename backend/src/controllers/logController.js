import Log from "../models/log.js";

/**
 * @desc Get all logs
 * @route GET /api/logs
 * @access Private/Admin
 */
export const getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Delete all logs
 * @route DELETE /api/logs
 * @access Private/Admin
 */
export const clearLogs = async (req, res) => {
  try {
    await Log.deleteMany();
    res.status(200).json({ message: "All logs cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
