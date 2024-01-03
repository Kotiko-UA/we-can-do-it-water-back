import { Schema, model } from "mongoose";
import { handleSaveError, preUpdate } from "./hooks.js";
import Joi from "joi";

const timeRegexp = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
const waterNoteShema = new Schema(
  {
    amount: {
      type: Number,
      min: [50, "Too few water"],
      max: [5000, "Too many water"],
      required: [true, "missing required amount field`"],
    },
    time: {
      type: String,
      required: [true, "missing required time field`"],
    },
    norma: {
      type: Number,
      min: [50, "Too few water"],
      max: [15000, "Too many water"],

      required: [true, "missing required norma field`"],
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

waterNoteShema.post("save", handleSaveError);

waterNoteShema.pre("findOneAndUpdate", preUpdate);

waterNoteShema.post("findOneAndUpdate", handleSaveError);

export const waterNoteAddUpdateSchema = Joi.object({
  amount: Joi.number().min(50).max(5000).required().messages({
    "number.base": '"Amount" should be a type of "number"',
    "any.required": `missing required amount field`,
  }),
  time: Joi.string().required().pattern(timeRegexp).messages({
    "any.required": `missing required time field`,
    "string.pattern.base": '"Time" must be like 22:15',
  }),
});

const waterNote = model("waterNote", waterNoteShema);

export default waterNote;
