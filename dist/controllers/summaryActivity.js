"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SummaryActivity_1 = __importDefault(require("../models/SummaryActivity"));
// test function
function createSummaryActivity(request, response, next) {
    console.log(createSummaryActivity);
    console.log(request.body);
    SummaryActivity_1.default.create(request.body).then((summaryActivity) => {
        response.status(201).json({
            success: true,
            data: summaryActivity,
        });
    });
}
exports.createSummaryActivity = createSummaryActivity;
//# sourceMappingURL=summaryActivity.js.map