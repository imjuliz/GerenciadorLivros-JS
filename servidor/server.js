const express = require('express');
const fs = require('fs');
const server = express();
const port = 3000;
const rotasAdmin = require('../rotas/rotaAdmin');
const rotasLivros = require('../rotas/rotaLivros');
server.use(express.json()); // p/ o express.js analisar o corpo da requisição como JSON (aula 07)


// log de sistema (aula 08)
const logger = (req, res, next) => {
    const data = new Date();
    // adicionar dados ao final de um arquivo (aula 02)
    const novaLinha = `[${data.toISOString()}] ${req.method} ${req.url}`;
    fs.appendFile('arquivo.txt', novaLinha, err => {
        if (err) throw err;
        console.log('Informação Adicionada!')
    })
    console.log(`[${data.toISOString()}] ${req.method} ${req.url}`);
    next();
    fs.writeFileSync('arquivo.txt', `[${data.toISOString()}] ${req.method} ${req.url}\n`, 'utf8');
};
server.use(logger);

server.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center;">Seja bem-vindo ao Gerenciador de Livros!<br>:3</h1>');
});

// rotas (aula 06)
server.use('/admin', rotasAdmin);
server.use('/livros', rotasLivros);


server.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});