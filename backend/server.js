const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

const app = express();
const port = 3001; // Node.js 서버 포트

app.use(cors());
app.use(bodyParser.json());

// application.yaml 파일에서 MySQL 설정 읽기
const yamlPath = path.resolve(__dirname, '../backend/src/main/resources/application.yaml');
const yamlConfig = yaml.load(fs.readFileSync(yamlPath, 'utf8'));

const dbConfig = yamlConfig.spring.datasource;

const db = mysql.createConnection({
    host: dbConfig.url.split('/')[2].split(':')[0],
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.url.split('/')[3]
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

let clients = [];

// SSE 엔드포인트
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    clients.push(res);

    req.on('close', () => {
        clients = clients.filter(client => client !== res);
    });
});

// 메시지 생성 엔드포인트
app.post('/send-message', (req, res) => {
    const { chatRoomId, content } = req.body;

    if (!chatRoomId || !content) {
        res.status(400).send('chatRoomId and content are required');
        return;
    }

    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // 데이터베이스에 메시지 저장
    const query = 'INSERT INTO messages (chat_room_id, content, created_at) VALUES (?, ?, ?)';
    db.query(query, [chatRoomId, content, createdAt], (err, results) => {
        if (err) {
            console.error('Failed to save message:', err);
            res.status(500).send('Failed to save message');
            return;
        }

        const message = { id: results.insertId, chatRoomId, content, createdAt };

        // 클라이언트에게 메시지 전송
        clients.forEach(client => {
            client.write(`data: ${JSON.stringify(message)}\n\n`);
        });
        res.status(200).send(message);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
