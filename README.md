# Amazing Rectangles Web Project

This project is a web-based version of the Java application "Amazing Rectangles". It utilizes HTML, CSS, and JavaScript to create an interactive experience where users can view and interact with various types of rectangles.

## Project Structure

```
amazing-rectangles-web
├── public
│   └── index.html          # Main HTML document for the web application
├── src
│   ├── js
│   │   ├── app.js          # Initializes the application and manages logic
│   │   ├── cursorTracker.js # Tracks cursor position on the canvas
│   │   ├── drawingArea.js   # Manages the drawing area for rectangles
│   │   └── rectangles
│   │       ├── AbstractRectangle.js # Base class for all rectangle types
│   │       ├── AmazingRectangle.js   # Specific properties and methods for AmazingRectangle
│   │       ├── BouncingRectangle.js   # Logic for bouncing behavior
│   │       ├── ColoringRectangle.js    # Functionality for changing colors
│   │       ├── FallingRectangle.js     # Logic for falling behavior
│   │       └── SwingingRectangle.js    # Logic for swinging behavior
│   └── css
│       └── styles.css      # Styles for the web application
├── package.json             # Configuration file for npm
├── .gitignore               # Files and directories to ignore by version control
└── README.md                # Documentation for the project
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd amazing-rectangles-web
   ```

2. **Install Dependencies**
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Run the Application**
   You can use a local server to run the application. For example, you can use `live-server`:
   ```bash
   npx live-server public
   ```

4. **Open in Browser**
   Navigate to `http://localhost:8080` (or the port specified by your server) to view the application.

## Usage

- Interact with the rectangles displayed on the canvas.
- Use the mouse to track cursor movements and see how it affects the rectangles.
- Explore different rectangle behaviors such as bouncing, falling, and swinging.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project. 

## License

This project is open-source and available under the MIT License.