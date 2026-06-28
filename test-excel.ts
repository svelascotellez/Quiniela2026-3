import * as xlsx from 'xlsx';

const workbook = xlsx.readFile('Usuarios-quiniela.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);
console.log(data.slice(0, 5));
