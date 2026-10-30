const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || process.env.URL_BASE_DATOS,
});
const prisma = new PrismaClient({ adapter });

const getBookings = (userId) =>
  prisma.booking.findMany({
    where: { userId },
    include: { schedule: true },
  });

module.exports = { getBookings };
