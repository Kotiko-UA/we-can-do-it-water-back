
import mongoose from 'mongoose';
import app from './app.js';
const { DB_HOST } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(8000, () => {
      console.log('Database connection successful');
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

// const todoItems = days.map((day, index) => (
//   // Делайте так, только если у элементов массива нет заданного ID
//   <li key={"day-" + index}>{day.date}</li>
// ));
