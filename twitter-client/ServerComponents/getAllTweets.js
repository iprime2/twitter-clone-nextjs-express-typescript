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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTweets = void 0;
const api_1 = require("@/clients/api");
const tweet_1 = require("@/graphql/query/tweet");
const getAllTweets = () => __awaiter(void 0, void 0, void 0, function* () {
    const allTweets = yield api_1.graphClient.request(tweet_1.getAllTweetsQuery);
    console.log("allTweets", allTweets);
    return allTweets;
});
exports.getAllTweets = getAllTweets;
