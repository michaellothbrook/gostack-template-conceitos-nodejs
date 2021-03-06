const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositorytId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
      return response.status(400).json({ error: 'Invalid repository ID.' });
  }

  return next();

}

app.get('/', (request, response) => {
  return response.json("Olá, você está consumindo uma API desenvolvida com NodeJS");
})

app.get("/repositories", (request, response) => {
  
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  
  const { title, url, techs } = request.body;

  const repositorie = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repositorie);

  return response.json(repositorie);

});

app.put("/repositories/:id", validateRepositorytId, (request, response) => {
  
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieId = repositories.findIndex(repositorie => repositorie.id == id);

  if (repositorieId < 0) {
    return response.status(400).json({ error: "Repositorie not found." });
  }

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositorieId].likes
  };

  repositories[repositorieId] = repositorie;

  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieId = repositories.findIndex(repositorie => repositorie.id == id);
  
  if (repositorieId < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories.splice(repositorieId, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositorytId, (request, response) => {
  const { id } = request.params;

  const repositorieId = repositories.findIndex(repositorie => repositorie.id == id);

  repositories[repositorieId].likes += 1;

  return response.json(repositories[repositorieId]);

});

module.exports = app;
