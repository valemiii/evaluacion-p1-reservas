const { Router } = require("express");
const authenticateToken = require("../middlewares/auth");
const adminController = require("../controllers/adminController");

const router = Router();

router.use(authenticateToken);
router.post("/schedules", adminController.createSchedule);
router.get("/bookings", adminController.getBookings);

module.exports = router;
