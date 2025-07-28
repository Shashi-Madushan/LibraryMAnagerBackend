import { getDashboardData } from "@/controllers/v1/Dashboard/DashboardData";
import { Router } from "express";

const router = Router()


router.get('/',getDashboardData)

export default router;