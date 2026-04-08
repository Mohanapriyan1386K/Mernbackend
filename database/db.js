const monogoose = require("mongoose");

const Db = async () => {
  try {
    const connect = await monogoose.connect(process.env.MONO_GO_URL);
    console.log("Monogo Db is conneted", connect.connection.host);
  } catch (err) {
    console.error("Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports=Db
