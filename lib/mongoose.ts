import mongoose, { type Mongoose } from 'mongoose';

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const globalCache = globalThis as typeof globalThis & {
  _mongooseCache?: MongooseCache;
};

const cache: MongooseCache =
  globalCache._mongooseCache ?? { conn: null, promise: null };

globalCache._mongooseCache ??= cache;

export async function connectDB(): Promise<Mongoose> {
  if (cache.conn) return cache.conn;

  
  const uri = 'mongodb+srv://huytu4907_db_user:HA9Tf6CCSQPWSQBY@cluster0.axjrrqz.mongodb.net/';
  console.log('MONGODB_URI', uri)
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable');
  }

  cache.promise ??= mongoose.connect(uri, { bufferCommands: false });
  cache.conn = await cache.promise;
  return cache.conn;
}
