#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const chatLog = [];
let first_person = '';
let second_person = '';
let current_person = '';

rl.question('Enter first person name: ', (name1) => {
    first_person = name1;
    rl.question('Enter second person name: ', (name2) => {
        second_person = name2;
        current_person = first_person;
        chat();
    });
});

function chat() {
    rl.question(`${current_person}: `, (message) => {
        if (message.toLowerCase() === 'byebye') {
            const date = new Date();
            const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const filename = `${first_person}-${second_person}-chatlog-${dateString}.md`;
            const data = chatLog.join('  \n');  // added two spaces before the line break
            fs.writeFile(filename, data, 'utf8', function(err) {
                if (err) {
                    console.log('An error occured while writing to file');
                    return;
                }
                console.log(`Chat log saved to file: ${filename}`);
            });
            rl.close();
        } else {
            chatLog.push(`**${current_person}**: ${message}`);
            current_person = current_person === first_person ? second_person : first_person;
            chat();
        }
    });
}
