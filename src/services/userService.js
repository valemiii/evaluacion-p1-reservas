const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const getBookings = (userId) =>
  prisma.booking.findMany({
    where: { userId },
    include: { schedule: true },
  });

module.exports = { getBookings };
