require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
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

app.get("/info", (req, res, next) => {
  Person.find({})
    .then((result) => {
      res
        .send(
          `<p>Phonebook has ${result.length} people.</p><p>${new Date()}</p>`,
        )
        .end();
    })
    .catch((err) => next(err));
});

app.get("/api/persons", (req, res) => {
  console.log("phonebook:");
  Person.find({}).then((result) => {
    result.forEach((pers) => {
      console.log(`${pers.name} ${pers.number}`);
    });
    res.json(result).end();
  });
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "Name or number is missing" });
  }

  const person = new Person({
    name,
    number,
  });
  person
    .save()
    .then((savedPerson) => {
      console.log(`added ${name} number ${number} to phonebook`);
      res.status(201).json(savedPerson);
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res
          .status(404)
          .json({
            error:
              "Uh Oh! It seems the person you are looking for doesn't exist",
          })
          .end();
      }
    })
    .catch((err) => {
      next(err);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => res.status(204).end())
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  const person = {
    name,
    number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { returnDocument: "after" })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((err) => next(err));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }
  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
