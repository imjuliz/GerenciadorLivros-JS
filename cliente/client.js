import chalk from "chalk";
import axios from "axios";
import inquirer from "inquirer";

const API_URL = 'http://localhost:3000';

async function listarLivros() {
    try {
        const response = await axios.get(`${API_URL}/livros`);
        return response.data
    } catch (error) {
        console.error(chalk.red('Erro ao listar livros: '), error.message);
    }
}

async function exibirDetalhes(id) {
    try {
        const response = await axios.get(`${API_URL}/livros/${id}`);
        return response.data;
    } catch (error) {
        console.error(chalk.red(`Erro ao exibir detalhes do livro com ID ${id}: `), error.message)
        return null;
    }
}

// (aula09)
async function adicionarLivro(addInfo) {
    try {
        const response = await axios.post(`${API_URL}/livros`, addInfo);
        return response.data;
    }
    catch (error) {
        console.error(chalk.red('Erro ao adicionar livro: '), error.message);
    }
}

async function editarLivro(id, alteracoes) {
    try {
        const response = await axios.patch(`${API_URL}/livros/${id}`, alteracoes);
        return response.data;
    }
    catch (error) {
        console.error(chalk.red(`Erro ao editar livro com ID ${id}: `), error.message);
    }
}

async function removerLivro(id) {
    try {
        const response = await axios.delete(`${API_URL}/livros/${id}`);
        return response.data;
    } catch (error) {
        console.error(chalk.red(`Erro ao excluir livro com ID ${id}: `), error.message);
    }
}

async function exibirMenu() {
    console.log('\n')
    const perguntas = [
        {
            type: 'list',
            name: 'opcao',
            message: chalk.yellow('Escolha uma opção'),
            choices: [
                { name: chalk.green('Listar livros'), value: 'listar' },
                { name: chalk.green('Exibir detalhes do livro'), value: 'exibir' },
                { name: chalk.green('Adicionar novo livro'), value: 'adicionar' },
                { name: chalk.green('Editar detalhes de um livro'), value: 'editar' },
                { name: chalk.green('Remover um livro'), value: 'remover' },
                { name: chalk.red('Sair'), value: 'sair' }
            ]
        }
    ];
    try {
        const resposta = await inquirer.prompt(perguntas);
        switch (resposta.opcao) {

            case 'listar':
                const livros = await listarLivros();
                if (Array.isArray(livros) && livros.length > 0) {
                    console.log(chalk.green(`Lista de livros:`));
                    livros.forEach(livro => {
                        console.log(`- ${chalk.cyan(livro.id)} : ${chalk.green(livro.nome)} - ${chalk.blue(livro.autor)} - ${chalk.blue(livro.editora)} - ${chalk.blue(livro.qtdPag)} - ${chalk.blue(livro.sinopse)}`);
                    })
                } else {
                    console.log(chalk.yellow('Nenhum livro encontrado :0'))
                }
                exibirMenu();
                break;

            case 'exibir':
                const idResposta = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'id',
                        message: chalk.blue('Digite o ID do livro: ')
                    }
                ]);
                const livro = await exibirDetalhes(idResposta.id);
                if (livro) {
                    console.log(chalk.green('Detalhes do livro: '));
                    console.log(`- ${chalk.cyan(livro.id)} : ${chalk.green(livro.nome)} - ${chalk.blue(livro.autor)} - ${chalk.blue(livro.editora)} - ${chalk.blue(livro.qtdPag)} - ${chalk.blue(livro.sinopse)}`);

                } else {
                    console.log(chalk.yellow('Livro não encontrado :('))
                }
                exibirMenu();
                break;


            case 'adicionar':
                const addResposta = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'id',
                        message: chalk.blue('Digite o ID do livro que você deseja adicionar:')
                    },
                    {
                        type: 'input',
                        name: 'nome',
                        message: chalk.blue('Digite o nome do livro:')
                    },
                    {
                        type: 'input',
                        name: 'autor',
                        message: chalk.blue('Digite o nome do autor:')
                    },
                    {
                        type: 'input',
                        name: 'editora',
                        message: chalk.blue('Digite o nome da editora:')
                    },
                    {
                        type: 'input',
                        name: 'qtdPag',
                        message: chalk.blue('Digite a quantidade de páginas:')
                    },
                    {
                        type: 'input',
                        name: 'sinopse',
                        message: chalk.blue('Digite a sinopse do livro:')
                    }
                ]);
                const add = await adicionarLivro(addResposta);
                if (add) {
                    console.log(
                        chalk.green('\nLivro adicionado com sucesso!'),
                        chalk.cyan(`\n- ID: ${addResposta.id}`),
                        chalk.cyan(`\n- Nome: ${addResposta.nome}`),
                        chalk.cyan(`\n- Autor: ${addResposta.autor}`),
                        chalk.cyan(`\n- Editora: ${addResposta.editora}`),
                        chalk.cyan(`\n- Páginas: ${addResposta.qtdPag}`),
                        chalk.cyan(`\n- Sinopse: ${addResposta.sinopse}`)
                    );
                } else {
                    console.log(chalk.yellow('Nao foi possivel adicionar o livro :('));
                }
                exibirMenu();
                break;


            case 'editar':
                const editResposta = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'id',
                        message: 'Digite o ID do livro que você deseja editar: '
                    },
                    {
                        type: 'input',
                        name: 'nome',
                        message: 'Digite o novo nome (ou deixe vazio para não alterar): '
                    },
                    {
                        type: 'input',
                        name: 'autor',
                        message: 'Digite o novo autor (ou deixe vazio para não alterar): '
                    },
                    {
                        type: 'input',
                        name: 'editora',
                        message: 'Digite a nova editora (ou deixe vazio para não alterar): '
                    },
                    {
                        type: 'input',
                        name: 'qtdPag',
                        message: 'Digite o novo número de páginas (ou deixe vazio para não alterar): '
                    },
                    {
                        type: 'input',
                        name: 'sinopse',
                        message: 'Digite a nova sinopse (ou deixe vazio para não alterar): '
                    }
                ]);
                // aula 03
                const dadosNovos = {
                    nome: editResposta.nome,
                    autor: editResposta.autor,
                    editora: editResposta.editora,
                    qtdPag: editResposta.qtdPag,
                    sinopse: editResposta.sinopse
                } 
                const livroEditado = await editarLivro(editResposta.id, dadosNovos);
                console.log(livroEditado);
                exibirMenu();
                break;

            case 'remover':
                const rmResposta = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'id',
                        message: chalk.blue('Digite o id do livro que você deseja excluir: ')
                    }
                ]);
                const exclusao = await removerLivro(rmResposta.id);
                if (exclusao) {
                    console.log(chalk.green(`Livro com ID ${rmResposta.id} excluido`));
                } else {
                    console.log(chalk.yellow('Não foi possível excluir o livro.'));
                }
                exibirMenu();
                break;

            case 'sair':
                console.log(chalk.blue('Volte sempre :D'));
                break;
        }

    } catch (error) {
        console.error(chalk.red('Ocorreu um erro inesperado'), error);
    }
}

exibirMenu();