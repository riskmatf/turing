import {Connection, createConnection, MysqlError, FieldInfo} from "mysql";
import {conf} from "./mysqlConf";
let dbCon : Connection  = createConnection(conf);

dbCon.connect((err : MysqlError)=>{
	if(err){
		console.log('Error in connection to DB!');
		console.log(err.message);
		throw(err);
	}
	console.log("Connection to DB established!");
});

export {dbCon}