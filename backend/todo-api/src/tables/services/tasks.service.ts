import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, Column } from '../tables.model';
import * as mongoose from 'mongoose';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel('task') private readonly taskModel: Model<Task>,
    @InjectModel('column') private readonly columnModel: Model<Column>,
  ) {}
  async insertTask(title: string, taskId: string): Promise<Task> {
    try {
      // Creating new column
      const newTask = new this.taskModel({
        title: title,
        // complete status is false by default
        column: taskId,
      });
      await newTask.save();

      // find the table and update its column array with new column ID
      const column = await this.columnModel.findById(taskId);
      // new task is always at index 0 within the column's task array
      column.pendingTasks.unshift(newTask._id);
      await column.save();

      return newTask;
    } catch (error) {
      throw error;
    }
  }

  async renameTask(taskId: string, newTitle: string): Promise<boolean> {
    const task = await this.taskModel.findOneAndUpdate(
      {
        _id: taskId,
      },
      {
        title: newTitle,
      },
    );

    // Return false if no task with given id or user is unauthorized
    if (!task) {
      return false;
    }
    return true;
  }

  async deleteTask(taskId: string): Promise<boolean> {
    const task = await this.taskModel.findOne({ _id: taskId });

    // Return false if no task with given id
    if (!task) {
      return false;
    }
    // Get task's column id
    const columnId = task.column;

    let parentColumn: mongoose.Types.ObjectId;

    if (task.completed) {
      parentColumn = await this.columnModel.findOneAndUpdate(
        { completedTasks: taskId },
        { $pull: { completedTasks: taskId } },
        { new: true },
      );
    } else {
      parentColumn = await this.columnModel.findOneAndUpdate(
        { pendingTasks: taskId },
        { $pull: { pendingTasks: taskId } },
        { new: true },
      );
    }

    if (!parentColumn) {
      throw new Error('Parent table not found');
    }

    // Delete the task
    await task.deleteOne();

    return true;
  }

  async toggleTaskStatus(
    taskId: string,
    taskCompleted: boolean,
    taskColumn: string,
  ): Promise<boolean> {
    const task = await this.taskModel.findOne({ _id: taskId });

    // Return false if no task with given id
    if (!task) {
      return false;
    }

    // Get task's column ID
    const columnId = task.column;

    // Find the column by its ID and populate its tasks
    const column = await this.columnModel.findOne({ _id: columnId.toString() });

    if (!column) {
      throw new Error('Parent table not found');
    }

    const destinationColumn = await this.columnModel.findById(taskColumn);
    if (!destinationColumn) {
      throw new Error('Destination table not found');
    }

    const isTheSameColumn = destinationColumn._id === column._id;

    // Moving completed task back to pending tasks array
    if (!taskCompleted) {
      const pendingTaskIndex = column.pendingTasks.findIndex(
        (pendingTask) => pendingTask._id.toString() === taskId,
      );

      if (pendingTaskIndex === -1) {
        const taskIndex = column.completedTasks.findIndex(
          (completedTask) => completedTask._id.toString() === taskId,
        );

        if (taskIndex !== -1) {
          const taskToMove = column.completedTasks.splice(taskIndex, 1)[0];
          isTheSameColumn
            ? column.completedTasks.unshift(taskToMove)
            : await this.columnModel.findOneAndUpdate(
                { _id: destinationColumn._id },
                {
                  $push: {
                    completedTasks: { $each: [taskToMove], $position: 0 },
                  },
                },
              );
        }
      } else {
        const taskToMove = column.pendingTasks.splice(pendingTaskIndex, 1)[0];
        isTheSameColumn
          ? column.completedTasks.unshift(taskToMove)
          : await this.columnModel.findOneAndUpdate(
              { _id: destinationColumn._id },
              {
                $push: {
                  completedTasks: { $each: [taskToMove], $position: 0 },
                },
              },
            );
        task.completed = !taskCompleted;
      }
    }

    // Moving pending task to completed tasks array
    if (taskCompleted) {
      const completedTaskIndex = column.completedTasks.findIndex(
        (completedTask) => completedTask._id.toString() === taskId,
      );

      if (completedTaskIndex === -1) {
        const taskIndex = column.pendingTasks.findIndex(
          (pendingTask) => pendingTask._id.toString() === taskId,
        );

        if (taskIndex !== -1) {
          const taskToMove = column.pendingTasks.splice(taskIndex, 1)[0];
          isTheSameColumn
            ? column.pendingTasks.unshift(taskToMove)
            : await this.columnModel.findOneAndUpdate(
                { _id: destinationColumn._id },
                {
                  $push: {
                    pendingTasks: { $each: [taskToMove], $position: 0 },
                  },
                },
              );
        }
      } else {
        const taskToMove = column.completedTasks.splice(
          completedTaskIndex,
          1,
        )[0];
        isTheSameColumn
          ? column.pendingTasks.unshift(taskToMove)
          : await this.columnModel.findOneAndUpdate(
              { _id: destinationColumn._id },
              {
                $push: { pendingTasks: { $each: [taskToMove], $position: 0 } },
              },
            );
        task.completed = !taskCompleted;
      }
    }

    // Update task's column if it has changed
    if (task.column.toString() !== taskColumn) {
      task.column = new mongoose.Types.ObjectId(taskColumn);
    }

    // Save the updated task and column
    await task.save();
    await column.save();
    !isTheSameColumn && (await destinationColumn.save());
    return true;
  }

  async updateNotes(taskId: string, newNotes: string): Promise<boolean> {
    // Check if the length exceeds the maximum allowed
    const maxLength = 500;
    if (newNotes.length > maxLength) {
      throw new Error(
        `Notes length exceeds the maximum allowed (${maxLength} characters).`,
      );
    }

    const task = await this.taskModel.findOneAndUpdate(
      {
        _id: taskId,
      },
      {
        notes: newNotes,
      },
      { new: true },
    );

    if (!task) {
      throw new Error('Task not found');
    }
    return true;
  }
}
