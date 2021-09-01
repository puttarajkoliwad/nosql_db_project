const fs = require('fs')
const chalk = require('chalk')

const useDb = () => {

}

const createCollection = (name, columns) => {

}

const getCollection = (name) => {
    
}

const getCollectionNames = () => {

}

const showTables = ()=>{
    
}

const find =(filter)=>{
    let notes = loadNotes();
    let res = {};
    
    if(filter == {}){
        return notes;
    }else{
        let keys = Object.keys(filter);
        notes.forEach()
    }
    
    let note = notes.find((note) => note.title === title)
    if(note){
        return chalk.inverse(note.title);
    }else{
        return "Note not found!";
    }
}

const insertOne = (title, body)=>{
    notes = loadNotes();
    const dupeNote = notes.some((note)=>{
        return note.title === title;
    })
    
    if(!dupeNote){
        notes.push({title: title, body: body});
        saveNotes(notes);
    }else{
        console.log(chalk.red(`Title ${chalk.blue(title)} already exists!`));
    }
}

const updateOne = (title, body)=>{
    notes = loadNotes();
    const dupeNote = notes.some((note)=>{
        return note.title === title;
    })
    
    if(!dupeNote){
        notes.push({title: title, body: body});
        saveNotes(notes);
    }else{
        console.log(chalk.red(`Title ${chalk.blue(title)} already exists!`));
    }
}

const deleteOne = (title) =>{
    const notes = loadNotes();
    const retainedNotes = notes.filter((note)=>{
        return note.title !== title;
    });
    if (retainedNotes.length === notes.length -1){
        saveNotes(retainedNotes);
        console.log(chalk.red(`${chalk.blue(title)} deleted!`));
    }
    else{
        console.log(chalk.red("Error deleting the note. Please check title and retry!"))
    }
}

const deleteMany = (title) =>{
    const notes = loadNotes();
    const retainedNotes = notes.filter((note)=>{
        return note.title !== title;
    });
    if (retainedNotes.length === notes.length -1){
        saveNotes(retainedNotes);
        console.log(chalk.red(`${chalk.blue(title)} deleted!`));
    }
    else{
        console.log(chalk.red("Error deleting the note. Please check title and retry!"))
    }
}

const findAll = () => {
    const notes = loadNotes();
    console.log(chalk.yellow("Your notes:"));
    notes.forEach((note) => {
        console.log(note.title);
    });
}

const saveNotes = (notes) =>{
    const dataJSON = JSON.stringify(notes);
    fs.writeFileSync('notes.json', dataJSON);
}

const loadNotes = ()=>{
    try{
        const dbuff = fs.readFileSync('notes.json');
        const strNotes = dbuff.toString();
        return JSON.parse(strNotes);
    } catch(e){
        return [];
    }
}

module.exports = {insertOne, deleteOne, find, updateOne}