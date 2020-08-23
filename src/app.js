const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');
const { isUuid } =  require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

function validateRepositoryId(request, response, next){
  const {id} = request.params;

  if(!isUuid(id)){
      return response.status(400).json({error: 'Invalid Project ID;'})
  }

  return next();
}

app.use('/repositories/:id',validateRepositoryId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, techs,url} = request.body;
  const repository = {id: uuid(),title,techs,url, likes:0 };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, techs,url} = request.body;
 
  const repoIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repoIndex === -1){
      return response.status(400).json({error : 'Repository not found'})
  }

  const repository = {
    id,
    title,
    techs,
    url,
    likes:repositories[repoIndex].likes,
  };

  
  repositories[repoIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repoIndex = repositories.findIndex(repositories =>repositories.id == id);

  if(repoIndex < 0){
    return response.status(400).json({error: 'Repository not found'});
  }  
  repositories.splice(repoIndex,1);


  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repoIndex = repositories.findIndex(repository => repository.id == id);
  // return response.json({msg : repoIndex});

  if(repoIndex === -1){
      return response.status(400).json({error : 'Repository not found'})
  }
  
  repositories[repoIndex].likes += 1;

  return response.json({likes: repositories[repoIndex].likes, id: repositories[repoIndex].id});
});

module.exports = app;
