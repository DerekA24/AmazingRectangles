const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Get static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// Get the source JS and CSS to load modules
app.use('/js', express.static(path.join(__dirname, 'src/js')));
app.use('/css', express.static(path.join(__dirname, 'src/css')));

// Fallback to index.html for SPA routing. Should be rare though
app.get('/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
// This is the file pathway for local testing in mac: cd /Users/minrongai/IdeaProjects/PersonalProjects/Website/AmazingRectangles/amazing-rectangles-web