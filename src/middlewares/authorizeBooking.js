const bookingsService = require("../services/bookingsService");

const authorizeBooking = async (req, res, next) => {
  if (!/^[1-9]\d*$/.test(req.params.id)) {
    return res.status(400).json({ error: "ID de reserva inválido" });
  }

  const bookingId = Number(req.params.id);
  if (!Number.isSafeInteger(bookingId)) {
    return res.status(400).json({ error: "ID de reserva inválido" });
  }

  try {
    const booking = await bookingsService.findBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    req.booking = booking;
    if (req.user.role !== "ADMIN" && req.user.id !== booking.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = authorizeBooking;
