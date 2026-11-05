const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const createSchedule = ({ court, startTime, endTime }) =>
  prisma.schedule.create({
    data: { court, startTime, endTime },
  });

const getBookings = () =>
  prisma.booking.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      schedule: true,
    },
  });

module.exports = { createSchedule, getBookings };
