const { program } = require('commander')
const { exit } = require('process');
const express = require('express')

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

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.listen(options.port, options.host, (req, res) => {
    console.log(`Server is working on http://${options.host}:${options.port}`)
})