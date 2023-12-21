import mongoose from 'mongoose';
// import app from './app.js';
const { DB_HOST } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    // app.listen(3030, () => {
    //   console.log('Database connection successful');
    // });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
