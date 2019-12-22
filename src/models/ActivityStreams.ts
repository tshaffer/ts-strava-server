import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ActivityStreamsSchema = new Schema(
  {
    activityid: { type: [Number], required: true },
    time: { type: [Number], required: true },
    location: { type: [[Number]], required: true },
    elevation: { type: [Number], required: true },
    distance: { type: [Number], required: true },
    gradient: { type: [Number], required: true },
    cadence: { type: [Number], required: true },
    heartrate: { type: [Number], required: true },
    watts: { type: [Number], required: true },
  },
);

export default mongoose.model('ActivityStreams', ActivityStreamsSchema);
