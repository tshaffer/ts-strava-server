"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('uri is:');
    const mongoUri = process.env.MONGO_URI;
    // const mongoUri: string = 'mongodb+srv://ted:xasmJkrMSHnLgjIK@cluster0-ihsik.mongodb.net/stravatron?retryWrites=true&w=majority';
    console.log(mongoUri);
    const conn = yield mongoose_1.default.connect(mongoUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
    });
    // console.log(`MongoDB Connected: ${conn.connection.host}`);
    // console.log(`MongoDB Connected: ${conn.connection}`);
    console.log(`MongoDB Connected`);
});
exports.default = connectDB;
//# sourceMappingURL=db.js.map