import mongoose from 'mongoose';

const connectDB = async () => {
  console.log('uri is:');
  const mongoUri = process.env.MONGO_URI;
  // const mongoUri: string = 'mongodb+srv://ted:xasmJkrMSHnLgjIK@cluster0-ihsik.mongodb.net/stravatron?retryWrites=true&w=majority';
  console.log(mongoUri);
  const conn = await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  // console.log(`MongoDB Connected: ${conn.connection.host}`);
  // console.log(`MongoDB Connected: ${conn.connection}`);
  console.log(`MongoDB Connected`);
};

export default connectDB;
