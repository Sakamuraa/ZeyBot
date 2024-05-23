const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

module.exports = {
  async initializeMongoose() {
    console.log(`Connecting to MongoDb...`);

    try {
      await mongoose.connect(process.env.MONGO_CONNECTION);

      console.log("Mongoose: Database connection established");

      return mongoose.connection;
    } catch (err) {
      console.log("Mongoose: Failed to connect to database", err);
      process.exit(1);
    }
  },

  schemas: {
    Guild: require("./schemas/Guild"),
    User: require("./schemas/User"),
  },
};
