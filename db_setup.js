const fs = require('fs')
const chalk = require('chalk')

const dbList = () => {
    let dbbuff = fs.readFileSync('db/dbList.json');
    let dbstr = dbbuff.toString();
    // console.log(Object.keys(JSON.parse(dbstr).dbs))
    return JSON.parse(dbstr);
}

const showDBs = ()=>{
    let dbs = dbList()
    console.log(Object.keys(dbs.dbs))
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
// console.log(useDb("puttaDB2"))

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


const find =(tablename, cols = undefined, filter = {})=>{
    let db = loadDB()
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
                let validFilters = filterCols.every(fc => db[tablename].columns.includes(fc))
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
// console.log("find: "+find('students', ['firstname', 'lastname'], {firstname: 'firstname1'}));

const insertOne = (tablename, record)=>{
    let db = loadDB();
    let dblist = dbList();
    if(db instanceof String){
        console.log(db);
        return null;
    }
    if(!db[tablename]){
        console.log(chalk.red(`Collection ${tablename} does not exist for ${dblist.using}!`))
        return null;
    }
    if(db[tablename].primarykey && db[tablename].docs.some(doc => doc[primarykey] === record[primarykey])){
        throw new Error("Record already exist!");
    }else{
        try{
            db[tablename].docs.push(record);
            fs.writeFileSync(`./db/${dblist.using}.json`, JSON.stringify(db));
            console.log('Record inserted successfully.')
        }catch(e){
            console.log(chalk.red('Insertion failed. Try again later!'))
        }
    }
}
// console.log(find('students'));

const updateOne = (tablename, klause, update_values)=>{
    let db = loadDB()
    let dblist = dbList()
    if(db instanceof String){
        console.log(db)
    }else{
        try{
            if(!db[tablename]){
                throw new Error(`Collection '${tablename}' does not exist for '${dblist.using}'!`)
            }
            let colset = Object.keys(update_values)
            if(db[tablename].primarykey){
                if(colset.includes(db[tablename].primarykey)){
                    console.log(chalk.red("Primary-keys can't be modified"))
                    return null
                }
            }else{
                let matchcols = Object.keys(klause)
                let target = false
                let tardoc = null
                let docs = db[tablename].docs
                for(let doc of docs){
                    let tar = matchcols.every(col => doc[col] === klause[col])
                    if(tar){
                        for(let col of colset){
                            doc[col] = update_values[col]
                        }
                        target = true
                        tardoc = doc
                        break
                    }
                }
                if(target){
                    try {
                        db[tablename].docs = docs
                        fs.writeFileSync(`./db/${dblist.using}.json`, JSON.stringify(db))
                        console.log(chalk.green('updated '+ JSON.stringify(tardoc)))
                    } catch (e) {
                        console.log(chalk.red('Error updating the record. Retry later!'))
                    }
                }else{
                    console.log(chalk.red("No match found to update!"))
                } 
            }
        }catch(e){
            console.log(chalk.red(e.message))
        }
    }
}
// updateOne('students',{firstname: "test1"}, {firstname: "firstname1"})

const deleteOne = (tablename, klause) =>{
    let db = loadDB()
    let dblist = dbList()
    if(db instanceof String){
        console.log(db)
    }else{
        try {
            if(!db[tablename]){
                throw new Error(`Collection '${tablename}' does not exist for '${dblist.using}'!`)
            }
            let cols = Object.keys(klause)
            let taridx = undefined
            let docs = db[tablename].docs
            for(let i=0; i<docs.length; i++){
                let tar = cols.every(col => klause[col] == docs[i][col])
                
                if(tar){
                    taridx = i;
                    break;
                }
            }
            
            if(taridx != undefined){
                try {
                    docs.splice(taridx, 1)
                    db[tablename].docs = docs
                    fs.writeFileSync(`./db/${dblist.using}.json`, JSON.stringify(db))
                    console.log(chalk.green('Deleted operation successful!'))
                } catch (e) {
                    console.log(chalk.red('DBError, could not delete item!'))
                }
            }else{
                console.log(chalk.red('No match found to delete!'))
            }
        } catch (e) {
            console.log(chalk.red(e.message))
        }
    }
}
// insertOne('students', {firstname: 'firstname1', lastname: 'lastname2'})
// deleteOne('students', {firstname: 'firstname1'})

const deleteMany = (tablename, klause) =>{
    let db = loadDB()
    let dblist = dbList()
    if(db instanceof String){
        console.log(db)
    }else{
        try {
            if(!db[tablename]){
                throw new Error(`Collection '${tablename}' does not exist for '${dblist.using}'!`)
            }
            let cols = Object.keys(klause)
            let tarids = []
            let docs = db[tablename].docs
            for(let i=0; i<docs.length; i++){
                let tar = cols.every(col => klause[col] === docs[i][col])
                if(tar){
                    tarids.push(i);
                }
            }

            for(let i=0; i<tarids.length; i++){
                docs.splice(tarids[i]-i, 1);
            }
            
            if(tarids){
                try {
                    db[tablename].docs = docs
                    fs.writeFileSync(`./db/${dblist.using}.json`, JSON.stringify(db))
                    console.log('Deleted operation successful!')
                } catch (e) {
                    console.log('DBError, could not delete item!')
                }
            }else{
                console.log(chalk.red('No match found to delete!'))
            }
        } catch (e) {
            console.log(chalk.red(e.message))
        }
    }
}
// deleteMany('students', {firstname: 'firstname1'})

module.exports = {showDBs, dbList, getDB, loadDB, useDb, createCollection,  insertOne, deleteOne, deleteMany, find, updateOne}