

import {createServer} from 'http';
import { initializeDataSource } from './config/orm.config';
import { initializeWebSocketServer } from './config/websocketServer.config';


(function main(){
    initializeDataSource();
    const httpServer = createServer();
    initializeWebSocketServer(httpServer);
})();