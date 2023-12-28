import WaterNote from "../models/WaterNote.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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

const getByMonth = async (req, res) => {
  const { _id: owner } = req.user;
  const date = new Date();
  const { month = date.getUTCMonth() + 1, year = date.getUTCFullYear() } =
    req.query;
  const consumptions = await WaterNote.find({
    owner,
    createdAt: {
      $gte: new Date(year, month - 1, 1),
      $lt: new Date(year, month - 1, daysInMonth(year, month), 23, 59, 59),
    },
  });

  const monthData = [];
  for (let day = 1; day <= daysInMonth(year, month); day++) {
    const mon = month > 9 ? month : `0${month}`;
    const consums = [...consumptions].filter(({ createdAt }) => {
      return createdAt
        .toISOString()
        .includes(`${year}-${mon}-${String(day).padStart(2, "0")}`);
    });
    const date = `${day}, ${months[month - 1]}`;
    const procent =
      consums.reduce(
        (acc, curr) => acc + Math.round((curr.amount / curr.norma) * 100),
        0
      ) + "%";
    const servings = consums.length;
    const norma =
      servings > 0 ? (consums[0].norma / 1000).toFixed(1) + " L" : "2.0 L";
    monthData.push({
      date,
      norma,
      procent,
      servings,
    });
  }

  res.json(monthData);
};
const getOnToday = async (req, res) => {
  const { _id: owner } = req.user;
  const date = new Date();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();
  const day = date.getDate();

  const result = await WaterNote.find({
    owner,
    createdAt: {
      $gte: new Date(year, month, day),
      $lt: new Date(year, month, day, 23, 59, 59),
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
  const { _id: owner, dailyNorma: norma } = req.user;
  const result = await WaterNote.create({ ...req.body, owner, norma });
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner, dailyNorma: norma } = req.user;

  const result = await WaterNote.findOneAndUpdate(
    { _id: id, owner, norma },
    req.body
  );
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
  getByMonth: ctrlWrapper(getByMonth),
  getOnToday: ctrlWrapper(getOnToday),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
};
