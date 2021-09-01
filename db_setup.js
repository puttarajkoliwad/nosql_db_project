const fs = require('fs')
const chalk = require('chalk')

const dbList = () => {
    let dbbuff = fs.readFileSync('db/dbList.json');
    let dbstr = dbbuff.toString();
    return JSON.parse(dbstr);
}

const loadDB = () => {
    let dblist = dbList();
    if(dblist.using){
        try {
            let dbbuff = fs.readFileSync(`./db/${dblist.using}.json`)
            let dbstr = dbbuff.toString()
            let db = JSON.parse(dbstr)
            return db
        } catch (e) {
            return chalk.red("Error connecting to database. Please try again later!")
        }
    }else{
        return chalk.red("No database selected!")
    }
}


const getDB = (name) => {
    let dblist = dbList()
    if(Object.keys(dblist.dbs).includes(name)){
        return chalk.red("Error. Database already exists!")
    }else{
        try{
            let obj = {}
            let initialize = JSON.stringify(obj)
            fs.writeFileSync(`./db/${name}.json`, initialize);
            dblist.dbs[name] = name
            dblist.using = name
            fs.writeFileSync('./db/dbList.json', JSON.stringify(dblist))
            return chalk.green(`Database created. Using ${name}`)
        }catch(e){
            return chalk.red("Could not create database. Try again later!")
        } 
    }
}

// console.log(getDB("puttaDB2"));

const useDb = (name) => {
    let dblist = dbList();
    if(Object.keys(dblist.dbs).includes(name)){
        dblist.using = name
        fs.writeFileSync('./db/dbList.json', JSON.stringify(dblist))
        return chalk.green(`Using ${name}`)
    }else{
        return chalk.red('DB not found. Please check the DB name!')
    }
}
console.log(useDb("puttaDB2"))

const createCollection = (name, columns, primarykey = undefined) => {
    let dblist = dbList();
    if(dblist.using){
        let dbbuff = fs.readFileSync(`./db/${dblist.using}.json`)
        let dbstr = dbbuff.toString()
        let db = JSON.parse(dbstr)
        if(db[name]){
            return chalk.red('Collection already exist!')
        }else{
            try{
                let docs = []
                db[name] = {columns, primarykey, docs}
                fs.writeFileSync(`./db/${dblist.using}.json`, JSON.stringify(db))
                return chalk.green(`Collection '${name}' created under '${dblist.using}'.`)
            }catch(e){
                return chalk.red("Could not create collection. Try again later!")
            }
        }
    }else{
        return chalk.red("No Database selected!")
    }
}

// let cols = ["firstname", "lastname"]
// console.log(createCollection("students", cols));

//Works like a view for a table
const getCollection = (name) => {
    let dblist = dbList();
    let db = loadDB();
    if(db instanceof String){
        console.log(db);
    }else{
        if(Object.keys(db).includes(name)){
            return db;
        }else{
            throw new Error(`Collection ${name} does not exist for ${dblist.using}!`)
        }
    }
}

const getCollectionNames = () => {
    let dblist = dbList()
    if(dblist.using){
        let collections = Object.keys(loadDB())
        return collections;
    }else{
        throw new Error('No database selected!');
    } 
}
// useDb('puttaDB');
// console.log(getCollectionNames());

// const showTables = ()=>{
    
// }

const find =(tablename, cols = undefined, filter = {})=>{
    let db = loadDB
    console.log(Object.keys(db)[0])
    if(db instanceof String){
        console.log(db)
    }else{
        if(db[tablename]){
            let docs = db[tablename].docs
            if(filter == {}){
                if(cols){
                    let res = []
                    for(let doc of docs){
                        let temp = {}
                        for(let col of cols){
                            temp[col] = doc[col]
                        }
                        res.push(temp);
                    }
                    return res;
                }
                return docs
            }else{
                let filterCols = Object.keys(filter)
                let validFilters = filterCols.every(fc => db[tablename].cols.includes(fc))
                if(validFilters){
                    let res1 = docs.filter((doc) => filterCols.every(fc => filter[fc] === doc[fc]))
                    if(cols){
                        let res = []
                        for(let doc of res1){
                            let temp = {}
                            for(let col of cols){
                                temp[col] = doc[col]
                            }
                            res.push(temp);
                        }
                        return res;
                    }
                    return res1;
                }
            }
        }else{
            console.log(chalk.red('Invalid table name!'))
        }
    }
}
console.log(find('students'));

const insertOne = (tablename, record)=>{
    let db = loadDB();
    let dblist = dbList();
    if(db instanceof String){
        console.log(db);
        return null;
    }
    if(db[tablename].primarykey && db[tablename].docs.some(doc => doc[primarykey] === record[primarykey])){
        throw new Error("Record already exist!");
    }else{
        try{
            db[tablename].docs.push(record);
            fs.writeFileSync(`./db/${dblist.using}.json`, JSON.stringify(db));
        }catch(e){
            console.log(chalk.red('Insertion failed. Try again later!'))
        }
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