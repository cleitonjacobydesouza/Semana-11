const { Router } = require('express');
const Aluno = require('../models/Aluno');
const Curso = require('../models/Curso');

const routes = Router();

// GET - lista algo
routes.get('/bem_vindo', (req, res) => {
    res.json({ name: 'Bem vindo' });
});

// Função para validar data de nascimento no formato YYYY-MM-DD
function validarDataNascimento(data) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(data);
}

// Criar aluno
routes.post('/alunos', async (req, res) => {
    try {
        const { nome, data_nascimento, celular } = req.body;

        if (!nome) {
            return res.status(400).json({ mensagem: 'O nome é obrigatório' });
        }

        if (!data_nascimento) {
            return res.status(400).json({ mensagem: 'A data de nascimento é obrigatória' });
        }

        // Validar formato da data de nascimento
        if (!validarDataNascimento(data_nascimento)) {
            return res.status(400).json({ mensagem: 'A data de nascimento não está no formato correto (****-**-**)' });
        }

        const aluno = await Aluno.create({
            nome,
            data_nascimento,
            celular
        });

        res.status(201).json(aluno);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Não foi possível cadastrar o aluno' });
    }
});

// Listar todos os alunos
routes.get('/alunos', async (req, res) => {
    try {
        const alunos = await Aluno.findAll();
        res.json(alunos);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Erro ao listar alunos' });
    }
});

// Criar curso
routes.post('/cursos', async (req, res) => {
    try {
        const { nome, duracao_horas } = req.body;

        if (!nome) {
            return res.status(400).json({ mensagem: 'O nome do curso é obrigatório' });
        }
        
        if (!duracao_horas) {
            return res.status(400).json({ mensagem: 'A duração do curso em horas é obrigatória' });
        }

        if (!(duracao_horas >= 40 && duracao_horas <= 200)) {
            return res.status(400).json({ mensagem: 'Carga horária não permitida. A carga horária deve ser entre 40 e 200 horas' });
        }

        const curso = await Curso.create({
            nome,
            duracao_horas
        });

        res.status(201).json(curso);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Não foi possível cadastrar o curso' });
    }
});

// Listar todos os cursos
routes.get('/cursos', async (req, res) => {
    try {
        let params = {};  // Usar 'let' para permitir modificação

        if (req.query.nome) {  // Verificar 're"q.query.nome'
            params = { ...params, nome: req.query.nome };  // Corrigir para 'req.query.nome'
        }

        const cursos = await Curso.findAll({  // Executar a busca no banco de dados
            where: params  // Usar os parâmetros corretos
        });

        res.json(cursos);  // Enviar a resposta JSON com os cursos
    } catch (error) {
        console.log(error.message);  // Logar a mensagem de erro no console
        res.status(500).json({ error: 'Erro ao listar cursos' });  // Enviar a resposta de erro ao cliente
    }
});

// Atualizar o curso
routes.put('/cursos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar se o curso existe
        let curso = await Curso.findByPk(id);

        if (!curso) {
            return res.status(404).json({ mensagem: 'Curso não encontrado' });
        }

        // Extrair dados do corpo da requisição
        const { nome, duracao_horas } = req.body;

        // Validar dados recebidos
        if (!nome) {
            return res.status(400).json({ mensagem: 'O nome do curso é obrigatório' });
        }
        
        if (!duracao_horas) {
            return res.status(400).json({ mensagem: 'A duração do curso em horas é obrigatória' });
        }

        if (!(duracao_horas >= 40 && duracao_horas <= 200)) {
            return res.status(400).json({ mensagem: 'Carga horária não permitida. A carga horária deve ser entre 40 e 200 horas' });
        }

        // Atualizar o curso no banco de dados
        curso = await curso.update({
            nome,
            duracao_horas
        });

        res.status(200).json(curso); // Retornar o curso atualizado
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Erro ao atualizar curso' });
    }
});

module.exports = routes;

// Deletar um curso

routes.delete('/cursos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const curso = await Curso.findByPk(id);

        if (!curso) {
            return res.status(404).json({ mensagem: 'Curso não encontrado' });
        }

        await curso.destroy();

        res.status(204).json();
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Erro ao deletar curso' });
    }
});


module.exports = routes;
// Body params POST/PUT
// route params POST DELETE/GET
// query params id=1 GET