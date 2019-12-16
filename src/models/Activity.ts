import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ActivitySchema = new Schema(
  {
    achievementCount: { type: Number, required: true },
    athleteId: { type: Number, required: true },
    averageSpeed: { type: Number, required: true },
    averageTemp: { type: Number },
    averageWatts: { type: Number, required: true },
    deviceWatts: { type: Boolean },
    distance: { type: Number, required: true },
    elapsedTime: { type: Number, required: true },
    elevHigh: { type: Number },
    elevLow: { type: Number },
    endLatlng: { type: [Number] },
    id: { type: Number, required: true },
    kilojoules: { type: Number, required: true },
    city: { type: String },
    country: { type: String, required: true },
    state: { type: String },
    map: {
      id: { type: String, required: true },
      polyline: { type: String },
      summary_polyline: { type: String },
    },
    maxSpeed: { type: Number, required: true },
    movingTime: { type: Number, required: true },
    name: { type: String, required: true },
    prCount: { type: Number, required: true },
    resourceState: { type: Number, required: true },
    startDate: { type: Date, required: true },
    startDateLocal: { type: Date, required: true },
    startLatitude: { type: Number },
    startLatlng: { type: [Number] },
    startLongitude: { type: Number },
    timezone: { type: String, required: true },
    totalElevationGain: { type: Number, required: true },
    weightedAverageWatts: { type: Number },

    // attributes for detailed activity
    description: { type: String },
    calories: { type: Number },
    averageCadence: { type: Number },
    averageHeartrate: { type: Number },
    deviceName: { type: String },
    hasHeartrate: { type: Boolean },
    maxHeartrate: { type: Number },
    maxWatts: { type: Number },
    type: { type: String },
    utcOffset: { type: Number },
  },
);

export default mongoose.model('Activity', ActivitySchema);
