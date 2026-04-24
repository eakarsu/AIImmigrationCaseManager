const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cases', require('./routes/cases'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/visas', require('./routes/visas'));
app.use('/api/deadlines', require('./routes/deadlines'));
app.use('/api/billing', require('./routes/billing'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/forms', require('./routes/forms'));
app.use('/api/compliance', require('./routes/compliance'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/status-tracking', require('./routes/status-tracking'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
