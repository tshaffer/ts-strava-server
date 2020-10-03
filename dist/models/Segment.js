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
const SegmentSchema = new Schema({
    id: { type: Number, required: true, unique: true },
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
    allEffortsLoaded: { type: Boolean, default: false },
});
exports.default = mongoose.model('Segment', SegmentSchema);
//# sourceMappingURL=Segment.js.map