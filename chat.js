#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const chatLog = [];
let first_person = '';
let second_person = '';
let current_person = '';
let fileChoosen = '';

rl.question('Continue from previous chat? Y/N :', (cont) => {
	if (cont === "Y" || cont === "y) {
		chatLog.push("  \n");
	    
		const files = fs.readdirSync(path.join(__dirname)).filter((filename) => filename.includes(".md") && !filename.includes("README"));

		if (files.length === 0) {console.log("No Files Available")}
		
		let iterator = 0;	
		files.forEach((File1) => {
			console.log(File1, iterator);
			iterator++;
		})
		
		rl.question("Please choose a file, choose by the number next to the file: ", (itera) => {
			fileChoosen = files[itera];
			fs.readFile(fileChoosen, 'utf-8',(err, data) => {
				data = data.split("\n");
				
				if (err) {
					throw err;	
				}

				try {
					first_person = data[0].split(":")[0].replaceAll("*", "");
					second_person = data[1].split(":")[0].replaceAll("*", "");
					current_person = first_person;
					chatCont();
				} catch {
					console.log("Log unfinished, or log is not accessible. The log either has only 1 persons input or it has been most likely corrupted.")
					rl.close();
				}
			
			});
			
		});

	} else {
		rl.question('Enter first person name: ', (name1) => {
			first_person = name1;
			rl.question('Enter second person name: ', (name2) => {
				second_person = name2;
				current_person = first_person;
				chat();
			});
		});

	}
});

function chatCont() {
	rl.question(`${current_person}: `, (message) => {
		if (message === "byebye") {
			const data = chatLog.join("");
			fs.appendFileSync(fileChoosen, data);
			console.log(`wrote to file ${fileChoosen}`);
			rl.close()	

		} else {
			chatLog.push(`**${current_person}**: ${message}`);
			chatLog.push("  \n");
			current_person = current_person === first_person ? second_person : first_person;
			chatCont();
		}
	});
}

function chat() {
    rl.question(`${current_person}: `, (message) => {
        if (message.toLowerCase() === 'byebye') {
			const date = new Date();
            const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const filename = `${first_person}-${second_person}-chatlog-${dateString}.md`;
            const data = chatLog.join('');  // added two spaces before the line break
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
           	chatLog.push("  \n"); 
			current_person = current_person === first_person ? second_person : first_person;
            chat();
        }
    });
}

