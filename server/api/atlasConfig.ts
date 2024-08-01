import { MongoClient } from 'mongodb';
import 'dotenv/config'

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw Error ("MONGODB_URI is undefined.");
}

export const mongoClient = new MongoClient(uri);
export const dbName = "MojimeDB";
export const collNames = Object.freeze({
  animeDetails: "AnimeDetails",
});