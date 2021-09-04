
const yargs = require('yargs')
const dbConfig = require('./db_setup')

//set version
yargs.version('1.0.0')

//register DB commands

//show dbs: List DBs
yargs.command({
    command: 'show-dbs',
    describe: 'List the databases',
    handler: ()=>{
        dbConfig.showDBs();
    }
})

//getDB
yargs.command({
    command: 'getDB',
    describe: 'Create new database',
    builder:{
        name: {
            describe: 'Name of the new database to be created.',
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv)=>{
        dbConfig.getDB(argv.name);
    }
})

//useDb
yargs.command({
    command: 'useDB',
    describe: 'Switches to a database',
    builder:{
        name: {
            describe: 'Name of the database to switch to.',
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv)=>{
        console.log(dbConfig.useDb(argv.name));
    }
})

//createCollection
yargs.command({
    command: 'createCollection',
    describe: 'Creates a new collection',
    builder:{
        name: {
            describe: 'Name of the database to switch to.',
            demandOption: true,
            type: 'string'
        },
        columns: {
            describe: 'Column names for the collection',
            demandOption: true,
            type: 'string'
        },
        primaryKey: {
            describe: 'Pass the column name here if it\'s a primary-key for the collection',
            type: 'string'
        }
    },
    handler: (argv)=>{
        let cols = argv.columns.split(' ')
        console.log(dbConfig.createCollection(argv.name, cols, argv.primaryKey));
    }
})

//insertOne
yargs.command({
    command: 'insertOne',
    describe: 'inserts a record into a collection',
    builder:{
        tablename: {
            describe: 'Name of the table to insert records into.',
            demandOption: true,
            type: 'string'
        },
        record: {
            describe: 'Record in JSON format. Array values are not supported!',
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv)=>{
        // console.log(argv.record)
        let record = buildRecord(argv.record)
        // let record = JSON.parse(argv.record)
        dbConfig.insertOne(argv.tablename, record);
    }
})

//deleteOne
yargs.command({
    command: 'deleteOne',
    describe: 'Delete a record from a collection',
    builder:{
        tablename: {
            describe: 'Name of the table to delete record from.',
            demandOption: true,
            type: 'string'
        },
        klause: {
            describe: 'Record in JSON format. Array values are not supported!',
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv)=>{
        let record = buildRecord(argv.klause)
        dbConfig.deleteOne(argv.tablename, record);
    }
})

//deleteMany
yargs.command({
    command: 'deleteMany',
    describe: 'Delete multiple records at a time from a collection',
    builder:{
        tablename: {
            describe: 'Name of the table to delete record from.',
            demandOption: true,
            type: 'string'
        },
        klause: {
            describe: 'Record in JSON format. Array values are not supported!',
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv)=>{
        let record = buildRecord(argv.klause)
        dbConfig.deleteMany(argv.tablename, record);
    }
})

//find
yargs.command({
    command: 'find',
    describe: 'Delete multiple records at a time from a collection',
    builder:{
        tablename: {
            describe: 'Name of the table to fetch record from.',
            demandOption: true,
            type: 'string'
        },
        cols: {
            describe: 'You can view values of selective columns by passing the column names seperated by space with this option',
            type: 'string'
        },
        filter: {
            describe: 'Filter options',
            type: 'string'
        }
    },
    handler: (argv)=>{
        let record = argv.filter ? buildRecord(argv.filter) : {}
        let cols = argv.cols ? argv.cols.split(" ") : undefined
        let res = dbConfig.find(argv.tablename, cols, record);
        console.log(res)
    }
})

//updateOne
yargs.command({
    command: 'updateOne',
    describe: 'Delete multiple records at a time from a collection',
    builder:{
        tablename: {
            describe: 'Name of the table to fetch record from.',
            demandOption: true,
            type: 'string'
        },
        values: {
            describe: 'This option takes the fields and values to update. Use JSON format here.',
            type: 'string'
        },
        klause: {
            describe: 'Select where to match and update the values. Use JSON format here.',
            type: 'string'
        }
    },
    handler: (argv)=>{
        let record = argv.filter ? buildRecord(argv.filter) : {}
        let cols = argv.cols ? argv.cols.split(" ") : undefined
        let res = dbConfig.updateOne(argv.tablename, cols, record);
        console.log(res)
    }
})


const buildRecord = (record)=>{
    let obj = {}
    let strobj = record.substring(1,record.length-1)
    let maps = strobj.split(',')
    for(let map of maps){
        let kv = map.trim().split(":");
        obj[kv[0].trim()] = kv[1].trim();
    }
    return obj;
}

yargs.argv
// console.log(yargs.argv)