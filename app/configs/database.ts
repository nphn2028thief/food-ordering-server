import mongoose from 'mongoose';
import envConfig from './env';

const connectToDB = async () => {
  try {
    await mongoose.connect(envConfig.databaseUrl, {
      dbName: 'food-ordering',
    });

    console.log('Connect Successfully!');
  } catch (error) {
    console.log(`Connect failure: ${error}`);
    process.exit(0);
  }
};

export default connectToDB;
