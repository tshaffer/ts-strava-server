"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const Schema = mongoose.Schema;
const ActivitySchema = new Schema({
    id: { type: Number, required: true, unique: true },
    detailsLoaded: { type: Boolean, default: false },
    achievementCount: { type: Number, required: true },
    athleteId: { type: Number, required: true },
    averageSpeed: { type: Number, required: true },
    averageTemp: { type: Number },
    averageWatts: { type: Number },
    deviceWatts: { type: Boolean },
    distance: { type: Number, required: true },
    elapsedTime: { type: Number, required: true },
    elevHigh: { type: Number },
    elevLow: { type: Number },
    endLatlng: { type: [Number] },
    kilojoules: { type: Number },
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
    normalizedPower: { type: Number },
    intensityFactor: { type: Number },
    trainingStressScore: { type: Number },
});
exports.default = mongoose.model('Activity', ActivitySchema);
//# sourceMappingURL=Activity.js.map