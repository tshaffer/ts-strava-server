import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SegmentEffortSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    segmentId: { type: Number, required: true },
    name: { type: String, required: true },
    activityId: { type: Number, required: true },
    elapsedTime: { type: Number, required: true },
    movingTime: { type: Number, required: true },
    startDateLocal: { type: Date, required: true },
    distance: { type: Number, required: true },
    averageWatts: { type: Number },
    prRank: { type: Number },
    achievements: [{
      achievementType: String,
      rank: Number,
      typeId: Number,
    }],
    averageCadence: { type: Number, required: true },
    averageHeartrate: { type: Number, required: true },
    deviceWatts: { type: Boolean },
    maxHeartrate: { type: Number, required: true },
    startDate: { type: Date, required: true },
    startIndex: { type: Number},
    endIndex: { type: Number},
    normalizedPower: { type: Number},
    intensityFactor: { type: Number},
    trainingStressScore: { type: Number},
    komRank: { type: Number },
  },
);

export default mongoose.model('SegmentEffort', SegmentEffortSchema);
