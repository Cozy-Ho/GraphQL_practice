import mongoose from "mongoose";
import dynamoose from "dynamoose";
import config from "../config/config.js";

mongoose.Promise = global.Promise;
const mongo = config.db.mongo;

const MONGO_URL = `mongodb://${mongo.username}:${mongo.password}@${mongo.host}:${mongo.port}/${mongo.tablename}`;
// Connect to mongoDB
export function conn_mongo() {
  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB Connected!!");
    })
    .catch((err) => {
      console.log(err);
    });
}

export function conn_dynamo() {
  dynamoose.aws.sdk.config.update({
    accessKeyId: config.aws.accessid,
    secretAccessKey: config.aws.scretid,
    region: config.aws.region,
  });
  console.log("DynamoDB Connected!!");
}