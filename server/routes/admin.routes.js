import express from "express";
import { adminLogin } from "../controllers/admin.controller.js";
import {
  getDashboardStats,
  getRevenueChartData,
  getFleetOverview,
  getRecentBookings,
  getAdminAlerts,
} from "../controllers/admin.controller.js";
import { checkJwt, checkRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", adminLogin);

router.use(checkJwt);
router.use(checkRole("admin"));

router.get("/stats", getDashboardStats);
router.get("/revenue-chart", getRevenueChartData);
router.get("/fleet-overview", getFleetOverview);
router.get("/recent-bookings", getRecentBookings);
router.get("/alerts", getAdminAlerts);

export default router;