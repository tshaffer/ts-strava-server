import mongoose from 'mongoose';

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  // console.log(`MongoDB Connected: ${conn.connection.host}`);
  console.log(`MongoDB Connected: ${conn.connection}`);
};

export default connectDB;