import express from "express";
import waterNotesController from "../../controllers/water-notes-controller.js";
import {
  isEmptyBody,
  isValidId,
  authenticate,
} from "../../middlewares/index.js";
import { validaterBody } from "../../decorators/index.js";
import { waterNoteAddUpdateSchema } from "../../models/WaterNote.js";

const waterNotesRouter = express.Router();

waterNotesRouter.use(authenticate);

waterNotesRouter.get("/month", waterNotesController.getByMonth);
waterNotesRouter.get("/today", waterNotesController.getOnToday);

waterNotesRouter.post(
  "/",
  isEmptyBody,
  validaterBody(waterNoteAddUpdateSchema),
  waterNotesController.add
);

waterNotesRouter.put(
  "/:id",
  isValidId,
  isEmptyBody,
  validaterBody(waterNoteAddUpdateSchema),
  waterNotesController.updateById
);

waterNotesRouter.delete("/:id", isValidId, waterNotesController.deleteById);

export default waterNotesRouter;
