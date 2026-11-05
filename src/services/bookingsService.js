const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const bookingDetails = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
  schedule: true,
};

const findConflict = ({ date, scheduleId, excludeId }) =>
  prisma.booking.findFirst({
    where: {
      date,
      scheduleId,
      ...(excludeId !== undefined && {
        id: { not: excludeId },
      }),
    },
  });

const scheduleExists = (id) =>
  prisma.schedule.findUnique({ where: { id }, select: { id: true } }).then(Boolean);

const createBooking = (data) =>
  prisma.booking.create({
    data,
    include: bookingDetails,
  });

const findBookingById = (id) =>
  prisma.booking.findUnique({
    where: { id },
    include: bookingDetails,
  });

const updateBooking = (id, data) =>
  prisma.booking.update({
    where: { id },
    data,
    include: bookingDetails,
  });

const deleteBooking = (id) => prisma.booking.delete({ where: { id } });

module.exports = {
  findConflict,
  scheduleExists,
  createBooking,
  findBookingById,
  updateBooking,
  deleteBooking,
};
