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
const AppVariablesSchema = new Schema({
    dateOfLastFetchedActivity: { type: Date, required: true },
});
exports.default = mongoose.model('AppVariables', AppVariablesSchema);
//# sourceMappingURL=AppVariables.js.map