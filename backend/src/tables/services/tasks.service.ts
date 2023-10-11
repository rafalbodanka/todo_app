import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, Column, Table } from '../tables.model';
import * as mongoose from 'mongoose';
import { TablesService } from './tables.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel('task') private readonly taskModel: Model<Task>,
    @InjectModel('column') private readonly columnModel: Model<Column>,
    @InjectModel('table') private readonly tableModel: Model<Table>,
    private readonly tablesService: TablesService,
  ) {}
  async insertTask(title: string, taskId: string, tableId: string): Promise<Table> {

    console.log(title, taskId, tableId)
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

      const currentTable = await this.tablesService.getCurrentTable(tableId)

      return currentTable;
    } catch (error) {
      throw error;
    }
  }

  async renameTask(taskId: string, newTitle: string, tableId: string): Promise<Table> {
    const task = await this.taskModel.findOneAndUpdate(
      {
        _id: taskId,
      },
      {
        title: newTitle,
      },
    );

    const currentTable = this.tablesService.getCurrentTable(tableId)
    return currentTable;
  }

  async deleteTask(taskId: string, tableId: string): Promise<Table> {
    const task = await this.taskModel.findOne({ _id: taskId });

    // Return false if no task with given id
    if (!task) {
      const currentTable = await this.tablesService.getCurrentTable(tableId)
      return currentTable;
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

    const currentTable = await this.tablesService.getCurrentTable(tableId)

    return currentTable;
  }

  async toggleTaskStatus(
    taskId: string,
    taskCompleted: boolean,
    taskColumn: string,
    currentTableId: string,
  ): Promise<Table | boolean> {
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

    // Return current table state
    const currentTable = this.tablesService.getCurrentTable(currentTableId)
    return currentTable;
  }

  async updateNotes(taskId: string, newNotes: string, tableId: string): Promise<Table> {
    // Check if the length exceeds the maximum allowed
    await this.taskModel.findOneAndUpdate(
      {
        _id: taskId,
      },
      {
        notes: newNotes,
      },
      { new: true },
    );
    const currentTable = this.tablesService.getCurrentTable(tableId)
    return currentTable;
  }

  async getResponsibleUsers(
    taskId: string,
    currentTableId: string,
  ): Promise<any> {
    try {
      const task = await this.taskModel.findById(taskId);

      if (!task) {
        throw new Error('Task not found');
      }

      const userMembers = await this.tableModel
        .findOne({ _id: currentTableId })
        .populate({
          path: 'users.user',
          model: 'user',
          select: '-password',
        })
        .select('users')
        .exec();

      const members = task.responsibleUsers.map((responsibleUserId: any) => {
        return userMembers?.users.find(
          (user: any) =>
            user.user._id.toString() === responsibleUserId.toString(),
        );
      });

      return members;
    } catch (err) {
      throw new Error('Failed to get responsible users');
    }
  }

  async assignUser(taskId: string, userId: string): Promise<boolean> {
    const task = await this.taskModel.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    if (task.responsibleUsers.includes(new mongoose.Types.ObjectId(userId))) {
      const userIndex = task.responsibleUsers.findIndex((user) =>
        user.equals(new mongoose.Types.ObjectId(userId)),
      );
      const taskToMove = task.responsibleUsers.splice(userIndex, 1)[0];
      task.responsibleUsers.unshift(taskToMove);
    } else {
      task.responsibleUsers.push(new mongoose.Types.ObjectId(userId));
    }

    await task.save();
    return true;
  }

  async removeUser(taskId: string, userId: string): Promise<boolean> {
    const task = await this.taskModel.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    const userIndex = task.responsibleUsers.findIndex((user) =>
      user.equals(new mongoose.Types.ObjectId(userId)),
    );
    if (userIndex !== -1) {
      task.responsibleUsers.splice(userIndex, 1);
    }

    await task.save();
    return true;
  }

  async toggleEstimation(
    taskId: string,
    isEstimated: boolean,
  ): Promise<boolean> {
    const task = await this.taskModel.findOneAndUpdate(
      {
        _id: taskId,
      },
      {
        isEstimated: isEstimated,
      },
      { new: true },
    );
    if (!task) {
      throw new Error('Task not found');
    }
    return true;
  }

  async updateDifficulty(taskId: string, difficulty: number): Promise<boolean> {
    const task = await this.taskModel.findOneAndUpdate(
      {
        _id: taskId,
      },
      {
        difficulty: difficulty,
      },
      { new: true },
    );
    if (!task) {
      throw new Error('Task not found');
    }
    return true;
  }

  async setDateRange(
    taskId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<boolean> {
    const task = await this.taskModel.findOneAndUpdate(
      {
        _id: taskId,
      },
      {
        startDate: startDate,
        endDate: endDate,
      },
      { new: true },
    );
    if (!task) {
      throw new Error('Task not found');
    }
    return true;
  }

  async getTaskData(
    taskId: string,
  ): Promise<Task> {
    const task = (await this.taskModel.findById(taskId))
      .populate({
        path: "responsibleUsers",
        model: 'user',
        select: '-password',
      })

    return task;
  }

  async updateTaskData(
    taskId: string,
    newTask: Task,
    currentTableId: string
  ): Promise<Table> {

    const task = await this.taskModel.findById(taskId)
    if (task.completed !== newTask.completed) {
      await this.toggleTaskStatus(taskId, task.completed, newTask.column.toString(), currentTableId)
    }

    await this.taskModel.findOneAndUpdate(
      {_id: taskId},
      {
        title: newTask.title,
        notes: newTask.notes,
        column: newTask.column,
        difficulty: newTask.difficulty,
        isEstimated: newTask.isEstimated,
        startDate: newTask.startDate,
        endDate: newTask.endDate,
        responsibleUsers: newTask.responsibleUsers,
      },
      { new: true }
      )

      const currentTable = await this.tableModel.findById(currentTableId)
      .populate({
        path: 'columns',
        populate: [
          {
            path: 'pendingTasks',
            model: 'task',
            populate: {
              path: 'responsibleUsers',
              model: 'user',
              select: '-password',
            },
          },
          {
            path: 'completedTasks',
            model: 'task',
            populate: {
              path: 'responsibleUsers',
              model: 'user',
              select: '-password',
            },
          },
        ],
        model: 'column',
      })

    return currentTable;
  }
}
