import { MongoClient, Db } from 'mongodb';
import 'dotenv/config';

const uri = process.env.MONGODB_URI || "";

export const mongoClient = new MongoClient(uri);
export const dbName = "MojimeDB";
export const collNames = Object.freeze({
  animeDetails: "AnimeDetails",
});

let db: Db;

export async function connectToDatabase() {
  if (!db) {
    try {
      await mongoClient.connect();
      db = mongoClient.db(dbName);
      console.log('Connected to database');
    } catch (error) {
      console.error('Failed to connect to database', error);
      throw error;
    }
  }
  return db;
}