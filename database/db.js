const monogoose = require("mongoose");

const Db = async () => {
  try {
    const mongoUrl = process.env.MONGO_URI || process.env.MONO_GO_URL;
    if (!mongoUrl) {
      throw new Error(
        "Missing MongoDB URL. Set MONGO_URI (preferred) or MONO_GO_URL in .env."
      );
    }
    const connect = await monogoose.connect(mongoUrl);
    console.log("Monogo Db is conneted", connect.connection.host);
  } catch (err) {
    console.error("Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports=Db
