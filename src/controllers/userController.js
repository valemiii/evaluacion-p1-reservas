const userService = require("../services/userService");

const getBookings = async (req, res, next) => {
  try {
    const bookings = await userService.getBookings(req.userId);
    return res.status(200).json(bookings);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getBookings };
