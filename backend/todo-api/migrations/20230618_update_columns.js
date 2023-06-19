const mongoose = require('mongoose');
const { ColumnModel } = require('../src/tables/tables.module');
import * as dotenv from 'dotenv';

async function updateColumns() {
  dotenv.config();

  try {
    // Connect to the MongoDB database
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

    // Retrieve the documents from the collection
    const columns = await ColumnModel.find({});

    // Perform the migration for each document
    for (const column of columns) {
      const { tasks } = column;
      const pendingTasks = tasks.filter((task) => !task.completed);
      const completedTasks = tasks.filter((task) => task.completed);

      // Update the document with the new structure
      column.pendingTasks = pendingTasks;
      column.completedTasks = completedTasks;
      column.tasks = undefined;

      // Save the updated document
      await column.save();
    }

    // Disconnect from the database
    mongoose.disconnect();

    console.log('Migration completed.');
  } catch (err) {
    console.log(err);
  }
}

updateColumns();
