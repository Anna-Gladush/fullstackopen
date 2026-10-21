const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://fullstack_phonebook:${password}@phonebook.viidecs.mongodb.net/phonebookApp`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name,
  number,
});

if (name === undefined && number === undefined) {
  console.log("phonebook:");
  Person.find({}).then((result) => {
    result.forEach((pers) => {
      console.log(`${pers.name} ${pers.number}`);
    });
    mongoose.connection.close();
  });
}

if (name !== undefined && number === undefined) {
  console.log("You forgot to add name or number");
  mongoose.connection.close();
}

if (number && name) {
  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
