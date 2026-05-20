import mongoose from "mongoose";

const credentials = "singharshiya28_db_user:V9epKX8jnnYMdfmR";
const options = {
  serverSelectionTimeoutMS: 5000,
  family: 4,
};

const tests = [
  {
    name: "SRV String (Original)",
    url: `mongodb+srv://${credentials}@talentiq.tkdirqs.mongodb.net/?retryWrites=true&w=majority`
  },
  {
    name: "Standard Multi-Seed",
    url: `mongodb://${credentials}@ac-jr3ymdt-shard-00-00.tkdirqs.mongodb.net:27017,ac-jr3ymdt-shard-00-01.tkdirqs.mongodb.net:27017,ac-jr3ymdt-shard-00-02.tkdirqs.mongodb.net:27017/?ssl=true&replicaSet=atlas-jr3ymdt-shard-0&authSource=admin`
  },
  {
      name: "Single Shard Direct",
      url: `mongodb://${credentials}@ac-jr3ymdt-shard-00-00.tkdirqs.mongodb.net:27017/?ssl=true&authSource=admin&directConnection=true`
  }
];

async function runTests() {
  for (const test of tests) {
    console.log(`\n--- Testing: ${test.name} ---`);
    console.log(`URL: ${test.url.replace(/:[^@]+@/, ":****@")}`);
    try {
      await mongoose.connect(test.url, options);
      console.log(`✅ SUCCESS: Connected to ${mongoose.connection.host}`);
      await mongoose.disconnect();
    } catch (err) {
      console.log(`❌ FAILED: ${err.message}`);
    }
  }
  process.exit(0);
}

runTests();
