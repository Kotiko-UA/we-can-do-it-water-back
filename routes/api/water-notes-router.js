import express from "express";
import waterNotesController from "../../controllers/water-notes-controller.js";
import {
  isEmptyBody,
  isValidId,
  authenticate,
} from "../../middlewares/index.js";
import { validaterBody } from "../../decorators/index.js";
import {
  waterNoteAddSchema,
  waterNoteUpdateSchema,
  waterNoteFavoriteSchema,
} from "../../models/WaterNote.js";

const waterNotesRouter = express.Router();

waterNotesRouter.use(authenticate);

waterNotesRouter.get("/", waterNotesController.getAll);

waterNotesRouter.get("/:id", isValidId, waterNotesController.getById);

waterNotesRouter.post(
  "/",
  isEmptyBody,
  validaterBody(waterNoteAddSchema),
  waterNotesController.add
);

waterNotesRouter.put(
  "/:id",
  isValidId,
  isEmptyBody,
  validaterBody(waterNoteUpdateSchema),
  waterNotesController.updateById
);

waterNotesRouter.patch(
  "/:id/favorite",
  isValidId,
  isEmptyBody,
  validaterBody(waterNoteFavoriteSchema),
  waterNotesController.updateById
);
waterNotesRouter.delete("/:id", isValidId, waterNotesController.deleteById);

export default waterNotesRouter;
