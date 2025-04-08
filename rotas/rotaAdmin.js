const express = require('express');
const router = express.Router();
const fs = require('fs');
router.use(express.json());
const path = require('path');
const rotasLivros = require('../rotas/rotaLivros');
router.use('/livros', rotasLivros);

//(aula 03) - caminho p json
const caminhoCompleto = path.join(__dirname, '../servidor/livros.json');
console.log(caminhoCompleto);

// rota que precisa de autorização, utilizar: curl -H "Authorization: BACKEND" http://localhost:3000/admin
const autenticar = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token === 'BACKEND') {
        next();
    } else {
        res.status(401).send('Acesso negado >:(');
    }
};

router.get('/', autenticar, (req, res) => {
    res.status(200).send('Página de administração. Aqui você poderá: visualizar livros, editar livros e excluir livros')
})

// Criação de um item, (aula07) - utilizar:  curl -H "Authorization: BACKEND" -X POST -H "Content-Type: application/json" -d '{"id":11, "nome":"Diario de um Banana", "autor":"Julia", "editora":"Senai", "qtdPag": "123", "sinopse":"diario da julia"}' http://localhost:3000/admin/livros
router.post('/livros', autenticar, (req, res) => {
    const novoLivro = req.body; 
    fs.readFile(caminhoCompleto, 'utf8', (err, data) => {
        let livros = []; 
        if (err) {
            console.error('Erro ao ler o arquivo JSON:', err);
        } else {
            if (data) {
                livros = JSON.parse(data);
            } else {
                livros = [];
            }
        }
        livros.push(novoLivro); 
        fs.writeFile(caminhoCompleto, JSON.stringify(livros, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Erro ao adicionar livro:', err);
            }
            res.status(201).send('Livro adicionado com sucesso :D');
        });
    });
});

// edição de um item - utilizar: curl -H "Authorization: BACKEND" -X PATCH -H "Content-Type: application/json" -d '{"nome":"Diario de Anne Frank"}' http://localhost:3000/admin/livros/2
router.patch('/livros/:id', autenticar, (req,res)=>{
    const id = parseInt(req.params.id);
    const edicoes = req.body; 
    fs.readFile(caminhoCompleto, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo JSON:', err);
        }
        let livros = [];
        if (data) {
            livros = JSON.parse(data);
        }
        const livro = livros.find(livro => livro.id === id);
        if (!livro) {
            res.status(404).send(`Livro com ID ${id} não encontrado.`);
        }
        if (edicoes.nome) livro.nome = edicoes.nome;
        if (edicoes.autor) livro.autor = edicoes.autor;
        if (edicoes.editora) livro.editora = edicoes.editora;
        if (edicoes.qtdPag) livro.qtdPag = edicoes.qtdPag;
        if (edicoes.sinopse) livro.sinopse = edicoes.sinopse;
        fs.writeFile(caminhoCompleto, JSON.stringify(livros, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Erro ao editar dados:', err);
            }
            res.status(200).send(`Livro com ID ${id} atualizado com sucesso!`);
        });
    });
})

// deletar um item - utilizar: curl -H "Authorization: BACKEND" -X DELETE http://localhost:3000/admin/livros/10
router.delete('/livros/:id', autenticar, (req, res) => {
    const idExcluir = parseInt(req.params.id); 
    fs.readFile(caminhoCompleto, 'utf8', (err, data) => {
        let livros = []; 
        if (err) {
            console.error('Erro ao ler o arquivo JSON:', err);
        } else {
            if (data) {
                livros = JSON.parse(data);
            } else {
                livros = [];
            }
        }
        const livroExcluir = livros.find(livro => livro.id === idExcluir);
        if (!livroExcluir) {
            res.status(404).send(`Livro com ID ${idExcluir} não encontrado.`);
        }
        const livroExcluido = livros.filter(livro => livro.id !== idExcluir);
        fs.writeFile(caminhoCompleto, JSON.stringify(livroExcluido, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Erro deletar livro:', err);
            }
            res.status(200).send( `Livro com ID ${idExcluir} excluído com sucesso!`);
        });
    });
});

module.exports = router;