const { Router } = require('express');
const Aluno = require('../models/Aluno');

const routes = new Router();

// GET - lista algo
routes.get('/bem_vindo', (req, res) => {
    res.json({name:'Bem vindo'});
});


// Criar aluno
routes.post('/alunos', async (req, res) => {
   
    const nome = req.body.nome
    const data_nascimento = req.body.data_nascimento
    const celular = req.body.celular

    const aluno = await Aluno.create({
        nome: nome,
        data_nascimento: data_nascimento,
        celular: celular    
    })
    res.json(aluno)
})

routes.get('/alunos', async (req, res) => {
    const alunos = await Aluno.findAll()
    res.json(alunos)
})


// Você pode adicionar outras rotas aqui, como POST, PUT, DELETE, PATCH

module.exports = routes;
