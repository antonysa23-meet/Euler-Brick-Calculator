# Euler-Brick-Calculator

A beautiful, real-time web application to check if two Pythagorean triples form faces of an Euler Brick.

## What is an Euler Brick?

An Euler Brick is a rectangular cuboid with integer dimensions where all face diagonals are also integers. Each Pythagorean triple represents a face diagonal and the two edges of that face.

The first Euler Brick was discovered in 1719 by Paul Halcke with dimensions 44 × 117 × 240.

## Features

- ⚡ Real-time validation and checking (no button press needed!)
- 🎨 Beautiful, modern web interface with full-page design
- 📊 Live visualization of Euler Brick faces
- ✅ Instant visual feedback with color-coded inputs
- 📱 Fully responsive design
- ✨ Smooth animations and transitions

## Installation

1. Clone the repository:
```bash
git clone https://github.com/antonysa23-meet/Euler-Brick-Calculator.git
cd Euler-Brick-Calculator
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

4. Open your browser and navigate to `http://127.0.0.1:5000/`

## Usage

1. Enter two Pythagorean triples in the input fields
2. Supported formats: `3,4,5`, `(3,4,5)`, `[3,4,5]`, or `3 4 5`
3. Results update instantly as you type!

## Example

Try entering:
- First triple: `44,117,125`
- Second triple: `117,240,267`

These form two faces of the Euler Brick with dimensions 44 × 117 × 240.

## How it Works

For two triples to form Euler Brick faces, they must:
- Both be valid Pythagorean triples (a² + b² = c²)
- Share exactly one dimension (edge)
- The shared dimension must be a leg in both triples (not the hypotenuse)
- The third face diagonal must also be an integer

## Technologies Used

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Modern CSS with gradients, flexbox, and animations
- **Fonts**: Google Fonts (Inter)

## Project Structure

```
Euler-Brick-Calculator/
├── app.py                 # Flask application with Euler Brick logic
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── .gitignore            # Git ignore rules
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── style.css         # CSS styling
    └── script.js         # JavaScript for real-time validation
```

## License

MIT License - feel free to use this project for learning and development!
