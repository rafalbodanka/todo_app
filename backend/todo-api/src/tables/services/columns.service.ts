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
  async toggleCompletedTaskStatus(columnId: string): Promise<boolean> {
    const column = await this.columnModel.findOne({ _id: columnId });

    // Return false if no column with given id
    if (!column) {
      return false;
    }

    // Toggle the task's status
    column.showCompletedTasks = !column.showCompletedTasks;

    // Save the updated column
    await column.save();
    return true;
  }

  //drag and drop tasks
  async moveTaskWithinColumn(
    columnId: string,
    movedtaskId: string,
    sourceColumn: string,
    destinationColumnId: string,
    destinationIndex: string,
    completed: boolean,
    changeStatus: boolean,
  ): Promise<boolean> {
    //source column
    const column = await this.columnModel.findOne({ _id: columnId });

    // Return false if no source column with the given id
    if (!column) {
      return false;
    }

    const task = await this.taskModel.findOne({ _id: movedtaskId });

    // Return false if no task with the given id
    if (!task) {
      return false;
    }

    const destinationColumnObj = await this.columnModel.findById(
      destinationColumnId,
    );

    // Return false if no destination column with the given id
    if (!destinationColumnObj) {
      return false;
    }

    if (changeStatus) {
      // Update the completed status of the task
      task.completed = !task.completed;
      await task.save();
    }

    let taskToMove;

    // Check column ID and switch if different
    if (columnId !== destinationColumnId) {
      task.column = new mongoose.Types.ObjectId(destinationColumnId);
      await task.save();

      if (completed) {
        const sourceIndex = column.completedTasks.findIndex(
          (completedTask) => completedTask._id.toString() === movedtaskId,
        );
        taskToMove = column.completedTasks.splice(Number(sourceIndex), 1)[0];
        if (changeStatus) {
          destinationColumnObj.pendingTasks.splice(
            Number(destinationIndex),
            0,
            taskToMove,
          );
        } else {
          destinationColumnObj.completedTasks.splice(
            Number(destinationIndex),
            0,
            taskToMove,
          );
        }
      } else {
        const sourceIndex = column.pendingTasks.findIndex(
          (pendingTask) => pendingTask._id.toString() === movedtaskId,
        );
        taskToMove = column.pendingTasks.splice(Number(sourceIndex), 1)[0];
        if (changeStatus) {
          destinationColumnObj.completedTasks.splice(
            Number(destinationIndex),
            0,
            taskToMove,
          );
        } else {
          destinationColumnObj.pendingTasks.splice(
            Number(destinationIndex),
            0,
            taskToMove,
          );
        }
      }
    } else {
      //Moving tasks within the column
      if (completed) {
        const sourceIndex = column.completedTasks.findIndex(
          (completedTask) => completedTask._id.toString() === movedtaskId,
        );
        taskToMove = column.completedTasks.splice(Number(sourceIndex), 1)[0];
        if (changeStatus) {
          column.pendingTasks.splice(Number(destinationIndex), 0, taskToMove);
        } else {
          column.completedTasks.splice(Number(destinationIndex), 0, taskToMove);
        }
      } else {
        const sourceIndex = column.pendingTasks.findIndex(
          (pendingTask) => pendingTask._id.toString() === movedtaskId,
        );
        taskToMove = column.pendingTasks.splice(Number(sourceIndex), 1)[0];
        if (changeStatus) {
          column.completedTasks.splice(Number(destinationIndex), 0, taskToMove);
        } else {
          column.pendingTasks.splice(Number(destinationIndex), 0, taskToMove);
        }
      }
    }

    // When source column is also a destination column
    // call save method only for one of them
    if (column === destinationColumnObj) {
      await column.save();
    } else {
      // Call save method for both columns if they are different
      await Promise.all([
        column.save().catch((error) => {
          console.log('Error saving column:', error);
          return false;
        }),
        destinationColumnObj.save().catch((error) => {
          console.log('Error saving destination column:', error);
          return false;
        }),
      ]);
    }

    return true;
  }
}
