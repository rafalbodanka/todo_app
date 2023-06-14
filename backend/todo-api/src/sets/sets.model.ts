import * as mongoose from "mongoose"
import { User } from "../users/users.model"
import { Table } from "../tables/tables.model"

export const SetSchema = new mongoose.Schema(
  {
    tables: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Table' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

export interface Set extends Document {
    tables: Table['_id'][];
    user: User['_id'];
}