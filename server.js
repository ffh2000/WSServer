const readline = require('readline');
const WebSocket = require('ws');

//клиенты
var msShellSockets = [];
var webSockets = [];

const wsMSShellServer = new WebSocket.Server({port: 8080}, () => {
    console.log('✅ WebSocket сервер для MS Shell 2 запущен на ws://localhost:8080');
});
var wsMSShellSocket;
var wsWebSocket;

const webTerminalServer = new WebSocket.Server({port: 8081}, () => {
    console.log('✅ WebSocket сервер для web на ws://localhost:8081');
});

console.log("**************************************")
console.log("* Для выхода из сервера нажмите \"Q\"  *")
console.log("**************************************")

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
    if (key.name === 'q') {
        console.log('\n👋 Завершаем программу...');
        process.exit(0);   // выходим из Node.js
    }
});

// Когда подключается новый клиент
wsMSShellServer.on('connection', (ws) => {
    console.log('👤 Новый клиент MS Shell 2 подключился');
    msShellSockets.push(ws)
    wsMSShellSocket = ws;
    ws.send("_info")

    // Обработка сообщений от клиента
    ws.on('message', (message) => {
        process.stdout.write(message);
        if (wsWebSocket)
            wsWebSocket.send(message.toString());
    });

    // Когда клиент отключается
    ws.on('close', () => {
        console.log('❌ MS Shell 2 клиент отключился');
    });
});

webTerminalServer.on('connection', (ws) => {
    console.log('👤 Новый web-клиент подключился');
    webSockets.push(ws)
    wsWebSocket = ws

    // Обработка сообщений от клиента
    ws.on('message', (message) => {
        process.stdout.write("WEB: " + message);
        if (wsMSShellSocket)
            wsMSShellSocket.send(message.toString());
    });

    // Когда клиент отключается
    ws.on('close', () => {
        console.log('❌  Web-клиент отключился');
    });
});
