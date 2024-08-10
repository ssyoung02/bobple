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
    database: dbConfig.url.split('/')[3].split('?')[0]
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// 메시지 생성 엔드포인트 업데이트
app.post('/send-message', (req, res) => {
    const { chatRoomId, content, userId, name, profileImage } = req.body;
    const createdAt = moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'); // 서울 시간대로 설정

    // 메시지 데이터베이스에 저장
    const query = 'INSERT INTO messages (chat_room_id, content, created_at, user_id, name, profile_image) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [chatRoomId, content, createdAt, userId, name, profileImage], (err, results) => {
        if (err) {
            return res.status(500).send('Failed to save message');
        }

        const messageId = results.insertId;
        const getChatRoomUsersQuery = 'SELECT user_idx FROM chat_members WHERE chat_room_idx = ? AND user_idx != ?';
        db.query(getChatRoomUsersQuery, [chatRoomId, userId], (err, users) => {
            if (err) {
                return res.status(500).send('Failed to fetch users');
            }

            const insertReadsQuery = 'INSERT INTO message_reads (message_id, user_id) VALUES ?';
            const values = users.map(user => [messageId, user.user_idx]);
            db.query(insertReadsQuery, [values], (err) => {
                if (err) {
                    return res.status(500).send('Failed to insert message reads');
                }

                // Socket.io를 통해 메시지 전송
                const message = { id: messageId, chatRoomId, content, createdAt, userId, name, profileImage };
                io.to(chatRoomId).emit('newMessage', message);
                res.status(200).send(message);
            });
        });
    });
});

// 사용자가 채팅방에 입장했을 때 메시지 읽음 처리
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', ({ chatRoomId, userName, userId }) => {
        console.log(`User "${userName}" joined room ${chatRoomId}`);
        socket.join(chatRoomId);

        const updateReadsQuery = 'UPDATE message_reads SET read_at = NOW() WHERE user_id = ? AND message_id IN (SELECT id FROM messages WHERE chat_room_id = ?)';
        db.query(updateReadsQuery, [userId, chatRoomId], (err) => {
            if (err) {
                console.error('Failed to update message reads', err);
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// 1초마다 읽지 않은 메시지 수를 갱신
setInterval(() => {
    // 읽지 않은 메시지 수를 가져오는 쿼리
    const query = `
        SELECT m.id AS messageId, m.chat_room_id AS chatRoomId, COUNT(mr.user_id) AS unreadCount
        FROM messages m
        LEFT JOIN message_reads mr ON m.id = mr.message_id AND mr.read_at IS NULL
        GROUP BY m.id, m.chat_room_id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Failed to fetch unread counts', err);
            return;
        }

        results.forEach(row => {
            // 각 채팅방에 메시지의 읽지 않은 사용자 수를 브로드캐스트
            io.to(row.chatRoomId).emit('messageUnreadCount', {
                messageId: row.messageId,
                unreadCount: row.unreadCount
            });
        });
    });
}, 1000);

// 메시지의 읽지 않은 사용자 수를 조회하는 엔드포인트 추가
app.get('/api/messages/:messageId/unread-count', (req, res) => {
    const { messageId } = req.params;

    // 메시지의 읽지 않은 사용자 수를 조회하는 SQL 쿼리
    const query = `
        SELECT COUNT(*) AS unreadCount 
        FROM message_reads 
        WHERE message_id = ? AND read_at IS NULL
    `;

    db.query(query, [messageId], (err, results) => {
        if (err) {
            return res.status(500).send('Failed to fetch unread count');
        }

        if (results.length > 0) {
            res.status(200).json({ unreadCount: results[0].unreadCount });
        } else {
            res.status(404).send('Message not found');
        }
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
