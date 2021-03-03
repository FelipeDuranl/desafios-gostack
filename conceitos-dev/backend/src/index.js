//importar o express dentro da varialvel
const { request } = require('express');
const express = require('express');
const{ uuid , isUuid} = require('uuidv4');
//falando que o valor do app é igual do express
const app = express();

app.use(express.json());

/**
 * Métodos HTTP:
 * 
 * GET: Buscar informação do back-end
 * POST: Crair uma irformação no back-end
 * PUT/PATCH: altera uma informção no back-end
 * DELETE: Deletar uma informação no back-end
 */

/**
 * Tipos de parâmetros:
 * 
 * Query Params: Filtros e paginação
 * Route Parms: Identificar recursos (Atualizar/Deletar)
 * Requets Body: Conteudo na hora de criar ou editar um recusro (JSON)
 */

 /**
  * Middware:
  * 
  * interceptador de requisições que interrompe totalmente a requisição ou alterar dados da requisição.
  */

const projects = [];

function logRequest(request, response, next) {
    const { method, url } = request

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);

    next(); // PRÓXIMO MIDDLEWARE

    console.timeEnd(logLabel);
} 

function validateProjectId(request, response, next) {
    const { id } = request.params;

    if (!isUuid(id)){
        return response.status(400).json({ error: 'Invalid prject ID.' });
    }

    return next();
}

app.use(logRequest);
app.use('/projects/:id', validateProjectId);

//configurar rota
app.get('/projects', (request, response) => {
    const { title } = request.query;

    const results = title
        ? projects.filter(project => project.title.includes(title))
        : projects;

    // console.log(title);
    // console.log(owner);

    //sempre retorna o response
    return response.json(results);
});


app.post('/projects', (request, response) => {
    const { title, owner } = request.body;

    const project = { id: uuid(), title, owner };

    projects.push(project);


    return response.json(project);
});

app.put('/projects/:id', (request, response) => {
    const { id } = request.params;
    const { title, owner } = request.body;

    const projectIndex = projects.findIndex(project => project.id == id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'project not found.' })
    }

    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project;

    return response.json(project);
});


app.delete('/projects/:id', (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id == id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'project not found.' })
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send();
});


//criando uma porta 
app.listen(3333, () => {
    console.log('👌 Back-End started!');
});