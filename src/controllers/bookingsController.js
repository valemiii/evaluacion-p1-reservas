const bookingsService = require("../services/bookingsService");

const parseBookingData = (body) => {
  const { date, scheduleId } = body || {};
  const parsedDate =
    typeof date === "string" && date.trim() ? new Date(date) : new Date(Number.NaN);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    !Number.isSafeInteger(scheduleId) ||
    scheduleId <= 0
  ) {
    return null;
  }

  return { date: parsedDate, scheduleId };
};

const createBooking = async (req, res, next) => {
  if (!Number.isSafeInteger(req.user.id) || req.user.id <= 0) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const bookingData = parseBookingData(req.body);
  if (!bookingData) {
    return res.status(400).json({ error: "Datos de reserva inválidos" });
  }

  try {
    const conflict = await bookingsService.findConflict(bookingData);
    if (conflict) {
      return res.status(400).json({ error: "El horario ya está ocupado" });
    }

    const scheduleExists = await bookingsService.scheduleExists(
      bookingData.scheduleId,
    );
    if (!scheduleExists) {
      return res.status(400).json({ error: "El horario no existe" });
    }

    const booking = await bookingsService.createBooking({
      ...bookingData,
      userId: req.user.id,
    });
    return res.status(201).json(booking);
  } catch (error) {
    return next(error);
  }
};

const getBooking = (req, res) => res.status(200).json(req.booking);

const updateBooking = async (req, res, next) => {
  const bookingData = parseBookingData(req.body);
  if (!bookingData) {
    return res.status(400).json({ error: "Datos de reserva inválidos" });
  }

  try {
    const conflict = await bookingsService.findConflict({
      ...bookingData,
      excludeId: req.booking.id,
    });
    if (conflict) {
      return res.status(400).json({ error: "El horario ya está ocupado" });
    }

    const scheduleExists = await bookingsService.scheduleExists(
      bookingData.scheduleId,
    );
    if (!scheduleExists) {
      return res.status(400).json({ error: "El horario no existe" });
    }

    const booking = await bookingsService.updateBooking(
      req.booking.id,
      bookingData,
    );
    return res.status(200).json(booking);
  } catch (error) {
    return next(error);
  }
};

const deleteBooking = async (req, res, next) => {
  try {
    await bookingsService.deleteBooking(req.booking.id);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
};
