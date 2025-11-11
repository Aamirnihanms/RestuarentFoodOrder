import Log from "../models/log.js";

export const createLog = async ({
  user = null,
  action,
  description,
  ipAddress,
  method,
  endpoint,
  status = "success",
}) => {
  try {
    await Log.create({
      user,
      action,
      description,
      ipAddress,
      method,
      endpoint,
      status,
    });
  } catch (error) {
    console.error("Failed to create log:", error.message);
  }
};
