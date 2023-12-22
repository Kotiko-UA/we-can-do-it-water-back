import WaterNote from "../models/WaterNote.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const daysInMonth = (y, mon) => {
  let month = Number(mon);
  let year = Number(y);
  let nextMonth = month + 1;
  let nextYear = year;
  if (month + 1 === 13) {
    nextMonth = 1;
    nextYear = year + 1;
  }
  const date1 = new Date(year, month - 1, 1);
  const date2 = new Date(nextYear, nextMonth - 1, 1);
  return Math.round((date2 - date1) / 1000 / 3600 / 24);
};

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const date = new Date();
  const {
    month = date.getUTCMonth() + 1,
    year = date.getUTCFullYear(),
    ...filterParams
  } = req.query;
  const filter = { owner, ...filterParams };
  const result = await WaterNote.find({
    owner,
    createdAt: {
      $gte: new Date(year, month - 1, 1),
      $lt: new Date(year, month - 1, daysInMonth(year, month), 23, 59, 59),
    },
  });
  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await WaterNote.findOne({ _id: id, owner });

  if (!result) {
    throw HttpError(404, `WaterNote with id=${id} not found!`);
  }
  res.json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await WaterNote.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await WaterNote.findOneAndUpdate({ _id: id, owner }, req.body);
  if (!result) {
    throw HttpError(404, `WaterNote with id=${id} not found!`);
  }
  res.json(result);
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await WaterNote.findOneAndDelete({ _id: id, owner });
  if (!result) {
    throw HttpError(404, `WaterNote with id=${id} not found!`);
  }
  res.json({ message: "WaterNote deleted" });
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
};
