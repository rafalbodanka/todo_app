import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Column, Table, Task } from '../tables.model';
import { TasksService } from './tasks.service';
import * as mongoose from 'mongoose';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel('column') private readonly columnModel: Model<Column>,
    @InjectModel('table') private readonly tableModel: Model<Table>,
    @InjectModel('task') private readonly taskModel: Model<Task>,
    private readonly tasksService: TasksService,
  ) {}
  async insertColumn(title: string, tableId: string): Promise<Column> {
    try {
      // Creating new column
      const newColumn = new this.columnModel({
        title: title,
        pendingTasks: [],
        completedTasks: [],
      });
      await newColumn.save();

      //find the table and update its column array with new column ID
      const table = await this.tableModel.findById(tableId);
      if (!table) {
        throw new Error('No table with given ID');
      }
      table.columns.push(newColumn._id);
      await table.save();

      return newColumn;
    } catch (error) {
      throw error;
    }
  }

  async renameColumn(columnId: string, newTitle: string): Promise<boolean> {
    const column = await this.columnModel.findOneAndUpdate(
      {
        _id: columnId,
      },
      {
        title: newTitle,
      },
    );

    // Return false if no column with given id or user is unauthorized
    if (!column) {
      return false;
    }
    return true;
  }

  async deleteColumn(columnId: string): Promise<boolean> {
    const column = await this.columnModel.findOne({ _id: columnId });

    // Return false if no column with given id
    if (!column) {
      return false;
    }

    // Delete the column
    await column.deleteOne();

    // Delete associated tasks
    await this.taskModel.deleteMany({ column: columnId }).exec();

    // Delete column from parent table array
    const parentTable = await this.tableModel.findOneAndUpdate(
      { columns: columnId },
      { $pull: { columns: columnId } },
      { new: true },
    );

    if (!parentTable) {
      throw new Error('Parent table not found');
    }
    return true;
  }

  //show/hide completed tasks
  async toggleCompletedTaskStatus(
    columnId: string,
    showCompletedTasks: boolean,
  ): Promise<boolean> {
    const column = await this.columnModel.findOne({ _id: columnId });

    // Return false if no column with given id
    if (!column) {
      return false;
    }

    // Toggle the task's status
    column.showCompletedTasks = !showCompletedTasks;

    // Save the updated column
    await column.save();
    return true;
  }

  //drag and drop tasks
  async moveTaskWithinColumn(
    columnId: string,
    movedtaskId: string,
    destinationColumnId: string,
    destinationIndex: string,
    completed: boolean,
    changeStatus: boolean,
  ): Promise<boolean> {
    // Find the task being moved
    const task = await this.taskModel.findById(movedtaskId);
    if (!task) {
      return false; // Return false if the task is not found
    }

    // Find the source column
    const sourceColumn = await this.columnModel.findById(task.column);
    if (!sourceColumn) {
      return false; // Return false if the source column is not found
    }

    // Find the destination column
    const destinationColumn = await this.columnModel.findById(
      destinationColumnId,
    );
    if (!destinationColumn) {
      return false; // Return false if the destination column is not found
    }

    let sourceTasks, destinationTasks;

    if (task.completed) {
      sourceTasks = sourceColumn.completedTasks;
    } else {
      sourceTasks = sourceColumn.pendingTasks;
    }

    if (sourceColumn._id.toString() === destinationColumn._id.toString()) {
      if (completed && changeStatus) {
      }
      destinationTasks = sourceColumn.pendingTasks;
      task.completed = false;
      if (completed && !changeStatus) {
        destinationTasks = sourceColumn.completedTasks;
        task.completed = true;
      }

      if (!completed && changeStatus) {
        destinationTasks = sourceColumn.completedTasks;
        task.completed = true;
      }

      if (!completed && !changeStatus) {
        task.completed = false;
        destinationTasks = sourceColumn.pendingTasks;
      }
    } else {
      if (completed && changeStatus) {
        task.completed = false;

        destinationTasks = destinationColumn.pendingTasks;
      }
      if (completed && !changeStatus) {
        destinationTasks = destinationColumn.completedTasks;
        task.completed = true;
      }

      if (!completed && changeStatus) {
        destinationTasks = destinationColumn.completedTasks;
        task.completed = true;
      }

      if (!completed && !changeStatus) {
        task.completed = false;
        destinationTasks = destinationColumn.pendingTasks;
      }
    }

    const movedTaskObjectId = new mongoose.Types.ObjectId(movedtaskId);

    const sourceIndex = sourceTasks.findIndex((task) =>
      task._id.equals(movedTaskObjectId),
    );

    if (sourceColumn._id.toString() === destinationColumn._id.toString()) {
      const taskToMove = sourceTasks.splice(Number(sourceIndex), 1)[0];
      destinationTasks.splice(Number(destinationIndex), 0, taskToMove);
    } else {
      // Move task to a different column
      task.column = new mongoose.Types.ObjectId(destinationColumnId);

      const taskToMove = sourceTasks.splice(Number(sourceIndex), 1)[0];
      destinationTasks.splice(Number(destinationIndex), 0, taskToMove);
    }

    await task.save();

    // When source column is also a destination column
    // call save method only for one of them
    if (sourceColumn._id.toString() === destinationColumn._id.toString()) {
      await sourceColumn.save();
    } else {
      // Call save method for both columns if they are different
      await Promise.all([
        sourceColumn.save().catch((error) => {
          return false;
        }),
        destinationColumn.save().catch((error) => {
          return false;
        }),
      ]);
    }

    return true;
  }
}
