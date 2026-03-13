import fs from 'fs';
const text = fs.readFileSync('dns-output.txt', 'utf16le');
console.log(text);
