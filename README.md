<img alt="GitHub followers" src="https://img.shields.io/github/followers/puttarajkoliwad?color=green&label=puttarajkoliwad&logoColor=green&style=social">

<a name="install"></a>
Set-up guidelines
------------
This applcation is simple and easy to use. All you need to do is clone this repo and run below command in the project directory:

    $ npm install

Alas! We are all good now to use our own simple No-SQL db tool.


<a name="mvp"></a>
MVPs
------------
This project aims to build a sample no-sql database using file-systems and command line parsing using Nodejs. The promised MVPs of the current version build are:
1. create a database `getDB`: This allows the user to create a database. Each database is stored as a JSON file with name of DB as name of the file.
      
        $ node app.js getDB --name="testDB"
      
2. List databases `show-dbs`: This lists the available databases.
      
        $ node app.js show-dbs

3. Connect to a database `useDB`: This allows the user to connect/switch to a database and use it for CRUD operations.
      
        $ node app.js useDB --name="testDB"
   The databases names are unique and case-sensitive and throws error if you try to create a new db with the existing name.

4. Create a new collection in a database `createCollection`: This allows the user to create a new collection/table in a database.
      
        $ node app.js createCollection --name="testcollection" --columns="col1_name col2_name col3_name"
   The collection names are unique and case-sensitive and are in the scope of just their parent db. Throws error if you try to create a new collection with the existing name in the same database.
   
   This command also takes an optional argument `--primaryKey` which is used to indicate that this column is the primary-key of the collection and is unique!
        
        $ node app.js createCollection --name="testcollection" --columns="col1_name col2_name col3_name" --primaryKey="primary_column"

5. Insert a record into a collection `insertOne`: This allows the user to create a new record in a collection.
      
        $ node app.js insertOne --tablename="testcollection" --record="{"column1_name":"col1_value", "col2_name":"col2_value"}"

6. Delete a record from the collection `deleteOne`: This allows the user to delete a record from the collection.
      
        $ node app.js deleteOne --tablename="testcollection" --klause="{"column1_name":"col1_value", "col2_name":"col2_value"}"
   
7. Delete multiple records in a single run from the collection `deleteMany`: This deletes all the records that match the `--klause`
      
        $ node app.js insertOne --tablename="testcollection" --klause="{"column1_name":"col1_value", "col2_name":"col2_value"}"

8. Read records from the collection `find`: This allows the user to read/search/find records/documents from a collection/table.
      
        $ node app.js find --tablename="testcollection"
        
   Optional arguments: `--cols` and `--filter`
   
   User can selectively choose the COLUMNS to check the values of records by using `--cols` argument. Pass the space seperated column names to this argument!
   
         $ node app.js find --tablename="testcollection" --cols="col1_name col2_name"
         
         If the passed column_name doesn't exist for a record, it doesn't throw error, rather return `undefined` as the value for that field for the record.
         
   User can selectively choose the RECORDS to check the values of records by using `--filter` argument. Use JSON format here!
   
         $ node app.js find --tablename="testcollection" --filter="{col1_name:col1_FILTER_value}"
   
   The optional args can be combinely used to narrow the search results.
   
         $ node app.js find --tablename="testcollection" --filter="{col1_name:col1_FILTER_value, col2:col2_value}" --cols="col1 col2 col3"
         
9. Update an existing record in the collection `updateOne`: User can update an existing record in the collection using this command

   Use `--klause` argument to find the target record to update. Use JSON format here!
   Use `--values` argument to send the new key-value pairs to update. Supports JSON format only!
      
        $ node app.js updateOne --tablename="testcollection" --klause="{"column1_name":"col1_value", "col2_name":"col2_value"}" --values="{col_to_update1:new_val1, col_to_update2: new_value2}"
        
   
   
   
<a name="help"></a>
HELP
------------
You can always use `--help` to get help on working with the database. You can also get the help for each command by appending `--help` with the command.

    $ node app.js --help  //Gets the help and available commands to work on the application.
    $ node app.js <command_name> --help //Gets the help for specific command 
    
<a name="improve"></a>
Improvements and Future-scope
------------
This project draws its specs from MongooseDB and can be improved to implement and use all the db options of MongooseDB.

<a name="declaration"></a>
Declaration
------------
This project does not copy any of its contents or logic from any of the resources except for using the popular libraries of Node. I, Puttaraj Koliwad propose this with complete responsibility of the code.
