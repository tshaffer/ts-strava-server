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
const ActivityStreamsSchema = new Schema({
    activityId: { type: Number, required: true, unique: true },
    time: { type: [Number], required: true },
    location: { type: [[Number]], required: true },
    elevation: { type: [Number], required: true },
    distance: { type: [Number], required: true },
    gradient: { type: [Number], required: true },
    cadence: { type: [Number], required: true },
    heartrate: { type: [Number], required: true },
    watts: { type: [Number], required: true },
    maxPowerAtDurations: { type: [Number] },
});
exports.default = mongoose.model('ActivityStreams', ActivityStreamsSchema);
//# sourceMappingURL=ActivityStreams.js.map