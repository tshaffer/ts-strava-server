import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SummaryActivitySchema = new Schema(
  {
    achievementCount: { type: Number, required: true },
    athleteId: { type: Number, required: true },
    averageSpeed: { type: Number, required: true },
    averageTemp: { type: Number },
    averageWatts: { type: Number },
    deviceWatts: { type:  Boolean },
    distance: { type: Number, required: true },
    elapsedTime: { type: Number, required: true },
    elevHigh: { type: Number },
    elevLow: { type: Number },
    // endLatlng: StravaNativeLatLng;
    id: { type: Number, required: true, unique: true },
  },
);

export default mongoose.model('SummaryActivity', SummaryActivitySchema);
