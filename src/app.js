const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

const verifyRepoID = (req, res, next) => {
  const { id } = req.params
  
  if(!isUuid(id))
    return res.status(400).json({ error: "Repository ID doesn't exists" })

  return next()
}

const verifyTime = (req, res, next) => {
  const url = req.url
  const method = req.method
  console.log(`URL: ${url}, Method: ${method}`)
  console.time('Time')
  next()
  return console.timeEnd('Time')
}

// app.use(verifyTime)
app.use(express.json());
app.use(cors());

app.use('/repositories/:id', verifyRepoID)

const repositories = [];

app.get("/repositories", (req, res) => {
  return res.json(repositories)
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body

  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }

  repositories.push(repository)

  return res.status(200).json(repository)
});

app.put("/repositories/:id", (req, res) => {
  const { title, url, techs } = req.body
  const { id } = req.params

  const repoIndex = repositories.findIndex(repo => repo.id === id)

  if(repoIndex < 0)
    return res.status(404).json({ error: "Repository not found." })

  const repository = {
    id: repositories[repoIndex].id,
    title: title,
    url: url,
    techs: techs,
    likes: repositories[repoIndex].likes
  }

  repositories[repoIndex] = repository

  return res.json(repository)

});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params

  const repoIndex = repositories.findIndex(repo => repo.id === id)

  if(repoIndex < 0)
    return res.status(404).json({ error: "Repository not found." })

  repositories.splice(repoIndex, 1)

  return res.status(204).send()
});

app.post("/repositories/:id/like", verifyRepoID, (req, res) => {
  const { id } = req.params

  const repoIndex = repositories.findIndex(repo => repo.id === id)
  if(repoIndex < 0)
    return res.status(404).json({ error: "Repository not found." })

  repositories[repoIndex].likes++

  return res.json(repositories[repoIndex])
});

module.exports = app;
