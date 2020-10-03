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
const SummaryActivitySchema = new Schema({
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
    // endLatlng: StravaNativeLatLng;
    id: { type: Number, required: true, unique: true },
});
exports.default = mongoose.model('SummaryActivity', SummaryActivitySchema);
//# sourceMappingURL=SummaryActivity.js.map