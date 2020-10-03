"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
function getIndex(request, response) {
    const pathToIndex = path.join(__dirname, '../../public', 'index.html');
    response.sendFile(pathToIndex);
}
exports.getIndex = getIndex;
function getCSS(request, response) {
    const pathToCSS = path.join(__dirname, '../../public', 'css', 'app.css');
    response.sendFile(pathToCSS);
}
exports.getCSS = getCSS;
function getBundle(request, response) {
    const pathToBundle = path.join(__dirname, '../../public', 'build', 'bundle.js');
    response.sendFile(pathToBundle);
}
exports.getBundle = getBundle;
//# sourceMappingURL=mainController.js.map