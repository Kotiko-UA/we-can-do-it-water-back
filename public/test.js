const consumptions = [
  {
    createdAt: "2023-12-22T12:50:41.189Z",
    time: "7:00",
    amount: 250,
    norma: 2000,
  },
  {
    createdAt: "2023-12-22T22:50:41.189Z",
    time: "15:00",
    amount: 500,
    norma: 2000,
  },

  {
    createdAt: "2023-12-12T13:50:41.189Z",
    time: "8:00",
    amount: 250,
    norma: 2000,
  },
  {
    createdAt: "2023-12-12T13:50:41.189Z",
    time: "9:00",
    amount: 300,
    norma: 2000,
  },

  {
    createdAt: "2023-12-13T14:50:41.189Z",
    time: "8:00",
    amount: 250,
    norma: 2000,
  },
  {
    createdAt: "2023-12-14T12:50:41.189Z",
    time: "7:00",
    amount: 250,
    norma: 2000,
  },
  {
    createdAt: "2023-12-15T12:50:41.189Z",
    time: "7:00",
    amount: 250,
    norma: 2000,
  },
];

let year = 2023;
let month = 12;

const daysInMonth = (year, month) => {
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

let html = "";
for (let day = 1; day <= daysInMonth(year, month); day++) {
  const mon = month > 9 ? month : `0${month}`;
  const consums = [...consumptions].filter(({ createdAt }) =>
    createdAt.includes(`${year}-${mon}-${String(day).padStart(2, "0")}`)
  );
  const qty = consums.reduce(
    (acc, curr) => acc + Math.round((curr.amount / curr.norma) * 100),
    0
  );
  const servings = consums.length;
  const norma = servings > 0 ? consums[0].norma : 2000;

  html += `<li>
        ${day} <br> ${qty}% 
    </li>`;
  // Для всплівающего меню  инфо за день
  //   html += `<li>
  //           ${day},${mon} <br> Daily norma: ${norma} <br> Fulfillment of the daily norm: ${qty}% <br> How many servings of water: ${servings}
  //     </li>`;
}
document
  .querySelector("body")
  .insertAdjacentHTML("beforeend", `<ul>${html}</ul>`);
