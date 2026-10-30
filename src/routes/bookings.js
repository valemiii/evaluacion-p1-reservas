const { Router } = require("express");
const authenticateToken = require("../middlewares/auth");
const authorizeBooking = require("../middlewares/authorizeBooking");
const bookingsController = require("../controllers/bookingsController");

const router = Router();

router.use(authenticateToken);
router.post("/", bookingsController.createBooking);
router.get("/:id", authorizeBooking, bookingsController.getBooking);
router.put("/:id", authorizeBooking, bookingsController.updateBooking);
router.delete("/:id", authorizeBooking, bookingsController.deleteBooking);

module.exports = router;
