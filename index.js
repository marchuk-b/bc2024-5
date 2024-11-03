const { program } = require('commander')
const { exit } = require('process');
const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser');

program
    .option('-h, --host <char>', 'server address')
    .option('-p, --port <int>', 'server port')
    .option('-c, --cache <char>', 'path to directory, where cache files will be stored');

program.parse();

const options = program.opts();

if(!options.host) {
    console.error("Please enter host");
    exit();
}
if(!options.port) {
    console.error("Please enter port");
    exit();
}
if(!options.cache) {
    console.error("Enter path to cache directory");
    exit();
}

const app = express()
app.use(bodyParser.text());

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.get('/notes/:name', (req, res) => {
    const noteName = req.params.name;
    const notePath = path.join(options.cache, `${noteName}.txt`);

    try {
        fs.readFile(notePath, 'utf-8', (err, data) => {
            if(err) 
                res.status(404).send('Нотатка не знайдена');
            res.status(200).send(data)
        })
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error })
    }
})

app.put('/notes/:name', (req, res) => {
    const noteName = req.params.name;
    const notePath = path.join(options.cache, `${noteName}.txt`);

    if(!fs.existsSync(notePath)) return res.status(404).send('Нотатка не знайдена');
    
    fs.writeFile(notePath, req.body, (err) => {
        if(err) 
            res.status(500).json({ message: 'Помилка сервера', error })
        res.writeHead(201).end('Створено');
    })
})






app.listen(options.port, options.host, (req, res) => {
    console.log(`Server is working on http://${options.host}:${options.port}`)
})