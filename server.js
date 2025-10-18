const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// Also serve the source JS and CSS so we can load modules directly during development
app.use('/js', express.static(path.join(__dirname, 'src/js')));
app.use('/css', express.static(path.join(__dirname, 'src/css')));

// Fallback to play.html for SPA routing
app.get('/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
// This is the file pathway for mac: cd /Users/minrongai/IdeaProjects/PersonalProjects/Website/AmazingRectangles/amazing-rectangles-web