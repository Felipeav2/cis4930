const express = require('express');
const { marked } = require('marked');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for converting markdown to HTML
app.post('/api/convert', (req, res) => {
    const { markdown } = req.body;
    if (typeof markdown !== 'string') {
        return res.status(400).json({ error: 'Markdown text is required' });
    }
    const html = marked.parse(markdown);
    res.json({ html });
});

// Only start the server if this file is run directly (not in a test)
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Markdown Previewer listening at http://localhost:${port}`);
    });
}

module.exports = app; // export for testing
