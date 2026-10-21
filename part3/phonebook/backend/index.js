require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = "mongoose";
const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  }),
);

// MONGO DB
// const name = process.argv[3];
// const number = process.argv[4];

// Persons
let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: "1",
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: "2",
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: "3",
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: "4",
  },
];

app.get("/", (req, res) => {
  return res.send("<h1>Phonebook</h1>");
});

app.get("/info", (req, res) => {
  return res.send(
    `<p>Phonebook has ${persons.length} people.</p><p>${new Date()}</p>`,
  );
});

app.get("/api/persons", (req, res) => {
  console.log("phonebook:");
  Person.find({}).then((result) => {
    result.forEach((pers) => {
      console.log(`${pers.name} ${pers.number}`);
    });
    res.json(result);
  });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  // if (persons.find((pers) => pers.name === body.name)) {
  //   return res.status(400).json({ error: "Name must be unique" });
  // }
  // if (!body.name || !body.number) {
  //   return res.status(400).json({ error: "Name or number is missing" });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    console.log(`added ${body.name} number ${body.number} to phonebook`);
    res.status(201).json(savedPerson);
  });
  // body.id = String(generateID());
  // persons = persons.concat(body);
  // return res.status(201).json(body);
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });
  // const person = persons.find((pers) => pers.id === id);
  // if (!person) {
  //   return res.status(404).json({
  //     error: "Uh Oh! It seems the person you are looking for doesn't exist",
  //   });
  // }
  // return res.status(200).json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((pers) => pers.id !== id);

  return res.status(204);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
