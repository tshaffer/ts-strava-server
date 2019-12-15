import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SegmentSchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    distance: { type: Number, required: true },
    averageGrade: { type: Number, required: true },
    maximumGrade: { type: Number, required: true },
    elevationHigh: { type: Number, required: true },
    elevationLow: { type: Number, required: true },
    activityType: { type: String, required: true },
    climbCategory: { type: Number, required: true },
    startLatlng: { type: [Number], required: true },
    endLatlng: { type: [Number], required: true },
    // athletePrEffort?: any; // ****
    totalElevationGain: { type: Number, required: true },
    map: {
      id: { type: String, required: true },
      polyline: { type: String },
      summary_polyline: { type: String },
    },
    effortCount: { type: Number, required: true },
  },
);

export default mongoose.model('Segment', SegmentSchema);
