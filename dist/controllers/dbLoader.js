"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ZwiftSegment_1 = __importDefault(require("../models/ZwiftSegment"));
const lodash_1 = require("lodash");
function insertZwiftSegments(request, response, next) {
    const zwiftSegmentsPath = path.join(__dirname, '../../data/zwiftSegments.json');
    const rawData = fs.readFileSync(zwiftSegmentsPath);
    const zwiftSegments = JSON.parse(rawData.toString());
    ZwiftSegment_1.default.collection.insertMany(zwiftSegments.zwiftSegment, {
        ordered: false,
    }).then(() => {
        response.sendStatus(200);
        response.end();
    }).catch((err) => {
        if (!lodash_1.isNil(err.code) && err.code === 11000) {
            console.log('insertZwiftSegments: duplicate key error');
            response.sendStatus(200);
            response.end();
        }
        else {
            throw (err);
        }
    });
}
exports.insertZwiftSegments = insertZwiftSegments;
//# sourceMappingURL=dbLoader.js.map