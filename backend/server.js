// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// application.yaml 파일에서 MySQL 설정 읽기
const yamlPath = path.resolve(__dirname, '../backend/src/main/resources/application.yml');
const yamlConfig = yaml.load(fs.readFileSync(yamlPath, 'utf8'));

const dbConfig = yamlConfig.spring.datasource;

const db = mysql.createConnection({
    host: dbConfig.url.split('/')[2].split(':')[0],
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.url.split('/')[3].split('?')[0]
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', ({ chatRoomId, userName }) => {
        socket.join(chatRoomId);
        console.log(`User ${userName} joined room ${chatRoomId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
