const adminService = require("../services/adminService");

const createSchedule = async (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { court, startTime, endTime } = req.body || {};
  const parsedStartTime =
    typeof startTime === "string" && startTime.trim()
      ? new Date(startTime)
      : new Date(Number.NaN);
  const parsedEndTime =
    typeof endTime === "string" && endTime.trim()
      ? new Date(endTime)
      : new Date(Number.NaN);

  if (
    typeof court !== "string" ||
    !court.trim() ||
    Number.isNaN(parsedStartTime.getTime()) ||
    Number.isNaN(parsedEndTime.getTime())
  ) {
    return res.status(400).json({ error: "Invalid schedule data" });
  }

  try {
    const schedule = await adminService.createSchedule({
      court: court.trim(),
      startTime: parsedStartTime,
      endTime: parsedEndTime,
    });
    return res.status(201).json(schedule);
  } catch (error) {
    return next(error);
  }
};

const getBookings = async (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const bookings = await adminService.getBookings();
    return res.status(200).json(bookings);
  } catch (error) {
    return next(error);
  }
};

module.exports = { createSchedule, getBookings };
