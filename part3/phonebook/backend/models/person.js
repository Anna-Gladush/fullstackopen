const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to ", url);
mongoose
  .connect(url, { family: 4 })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log("error connecting to MongoDB: ", err.message);
  });

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, "Name required"],
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (num) {
        return /\d{2,3}-\d{6}/.test(num);
      },
      message: (props) => `${props.value} is not a valid number`,
    },
    required: [true, "Phone number required"],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
