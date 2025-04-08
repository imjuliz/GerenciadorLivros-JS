const fs = require('fs');
const express = require('express');
const router = express.Router();
const path = require('path');
router.use(express.json())

//(aula 03) - caminho p json
const caminhoCompleto = path.join(__dirname, '../servidor/livros.json');
console.log(caminhoCompleto);

let livros = [];
try {
    const data = fs.readFileSync(caminhoCompleto, 'utf8');
    livros = JSON.parse(data);
} catch (error) {
    console.log('\n\nErro ao ler o arquivo JSON:\n\n', error)
    livros = [];
}

router.get('/', (req, res) => {
    res.json(livros);
})

// (aula07) 
// criar um livro
router.post('/', (req, res) => {
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

// editar item 
router.patch('/:id', (req,res)=>{
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
            console.log(livro)
        });
    });
})


// remover item 
router.delete('/:id', (req, res) => {
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

// (aula10)
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const livro = livros.find(p => p.id === id);
    if (livro) {
        res.json(livro)
    } else {
        res.status(404).send('<h4>Livro não encontrado :/</h4>')
    }
})

module.exports = router;