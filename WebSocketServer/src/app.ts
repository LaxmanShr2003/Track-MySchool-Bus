

import {createServer} from 'http';
import { initializeDataSource } from './config/orm.config';
import { initializeWebSocketServer } from './config/websocketServer.config';
import { env } from './config/env.config';


(function main(){
    initializeDataSource();
    const httpServer = createServer();
    initializeWebSocketServer(httpServer);
    const PORT = env.SERVER_PORT;
   httpServer.listen(PORT,()=>{
    console.log(`Websocket server is running at port ${PORT}`)
   })
    
})();