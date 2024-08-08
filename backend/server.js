const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const moment = require('moment-timezone');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const port = 3001; // Node.js 서버 포트

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
    database: dbConfig.url.split('/')[3].split('?')[0] // serverTimezone=UTC 제거
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// 메시지 생성 엔드포인트
app.post('/send-message', (req, res) => {
    const { chatRoomId, content, userId, name, profileImage } = req.body;

    if (!chatRoomId || !content || !userId || !name || !profileImage) {
        res.status(400).send('chatRoomId, content, userId, name, and profileImage are required');
        return;
    }

    const createdAt = moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'); // 서울 시간대로 설정

    // 데이터베이스에 메시지 저장
    const query = 'INSERT INTO messages (chat_room_id, content, created_at, user_id, name, profile_image) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [chatRoomId, content, createdAt, userId, name, profileImage], (err, results) => {
        if (err) {
            console.error('Failed to save message:', err);
            res.status(500).send('Failed to save message');
            return;
        }

        const message = { id: results.insertId, chatRoomId, content, createdAt, userId, name, profileImage };

        // Socket.io를 통해 메시지 전송
        io.to(chatRoomId).emit('newMessage', message);
        res.status(200).send(message);
    });
});

// 클라이언트가 소켓 연결을 할 때의 처리
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', (chatRoomId) => {
        socket.join(chatRoomId);
        console.log(`Client joined room ${chatRoomId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
