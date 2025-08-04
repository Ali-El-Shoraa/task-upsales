import express from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import {
  addMovie,
  deleteMovie,
  getUserMovies,
  updateMovie,
} from "../controllers/movies.controller";

const router = express.Router();

router.use(protectRoute);
router.get("/", getUserMovies);
router.post("/", addMovie);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);

export default router;
