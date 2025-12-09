// NotionFlow Backend
// To run: npm install express cors body-parser
// node server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- MOCK DATABASE ---
const users = {
    'user1': {
        id: 'user1',
        name: 'John Doe',
        xp: 450,
        streak: 12,
        mode: 'individual' // or 'sme'
    }
};

const transactions = [
    { id: 1, userId: 'user1', amount: -4.50, merchant: 'Starbucks', category: 'Food', date: '2023-10-27' },
    { id: 2, userId: 'user1', amount: 2400.00, merchant: 'Employer', category: 'Income', date: '2023-10-26' }
];

const quests = {
    'individual': [
        { id: 'q1', text: 'Log 3 expenses', reward: 50, completed: false },
        { id: 'q2', text: 'Check budget status', reward: 20, completed: true }
    ],
    'sme': [
        { id: 'sq1', text: 'Approve 5 invoices', reward: 100, completed: false },
        { id: 'sq2', text: 'Update Q4 forecast', reward: 150, completed: false }
    ]
};

// --- ROUTES ---

// Get User Data
app.get('/api/user/:id', (req, res) => {
    const user = users[req.params.id];
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Switch Mode (Individual <-> SME)
app.post('/api/user/:id/mode', (req, res) => {
    const { mode } = req.body;
    const user = users[req.params.id];
    if (user && (mode === 'individual' || mode === 'sme')) {
        user.mode = mode;
        res.json({ success: true, mode: user.mode });
    } else {
        res.status(400).json({ error: 'Invalid request' });
    }
});

// Get Dashboard Data (Notion Blocks)
app.get('/api/dashboard/:id', (req, res) => {
    const user = users[req.params.id];
    if (!user) return res.status(404).json({ error: 'User not found' });

    // In a real app, this would fetch from a MongoDB 'blocks' collection
    if (user.mode === 'individual') {
        res.json({
            context: 'Personal Finance',
            blocks: [
                { type: 'stats', title: 'Net Worth', value: 12450 },
                { type: 'chart', title: 'Spending Categories' },
                { type: 'list', title: 'Recent Transactions', data: transactions.slice(0, 5) }
            ]
        });
    } else {
        res.json({
            context: 'SME Business',
            blocks: [
                { type: 'stats', title: 'Project Budget', value: 45000 },
                { type: 'chart', title: 'Cash Flow' },
                { type: 'list', title: 'Pending Approvals', data: [] }
            ]
        });
    }
});

// Gamification: Complete Quest
app.post('/api/quest/:id/complete', (req, res) => {
    const { userId } = req.body;
    const questId = req.params.id;
    const user = users[userId];

    // Simple mock logic
    if (user) {
        user.xp += 50; // Add XP
        res.json({ success: true, newXp: user.xp, message: "Quest Completed! +50 XP" });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`NotionFlow Server running on port ${PORT}`);
});