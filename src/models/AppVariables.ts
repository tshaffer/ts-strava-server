import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AppVariablesSchema = new Schema(
  {
    dateOfLastFetchedActivity: { type: Date, required: true },
  },
);

export default mongoose.model('AppVariables', AppVariablesSchema);
