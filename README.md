

- Interactive 2D slider for tone and style adjustment
- Real-time text processing
- Visual feedback during processing
- Undo/Redo functionality
- Dark mode interface
- Responsive design
- Redis caching for improved performance

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Redis (for caching)

## Project Structure

```
FiddleTextTone/
├── Frontend/           # React frontend application
│   ├── src/           # Source files
│   │   ├── App.jsx    # Main application component
│   │   ├── main.jsx   # Application entry point
│   │   ├── App.css    # Main styles
│   │   ├── index.css  # Global styles
│   │   └── assets/    # Static assets
│   ├── public/        # Public assets
│   ├── package.json   # Frontend dependencies
│   ├── vite.config.js # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── postcss.config.js  # PostCSS configuration
│   └── eslint.config.js   # ESLint configuration
└── Backend/           # Node.js backend server
    ├── index.js       # Main server file
    ├── routes/        # API routes
    ├── controllers/   # Route controllers
    ├── models/        # Data models
    ├── utils/         # Utility functions
    ├── config/        # Configuration files
    └── package.json   # Backend dependencies
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the Backend directory:
   ```env
   PORT=8000
   REDIS_URL=your_redis_url
   ```

4. For development with hot reloading:
   ```bash
   npm run dev
   ```
   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`


## Development

### Frontend Technologies
- React 19 with Vite for fast development
- Material-UI for UI components
- Tailwind CSS for styling

### Backend Technologies
- Node.js with Express
- Redis for caching
- RESTful API architecture

### Development Tools
- Vite for fast frontend development
- Nodemon for backend hot reloading
- ESLint for code linting
- PostCSS for CSS processing

## API Endpoints

- `POST /api/tone/adjust`
  - Request body:
    ```json
    {
      "text": "string",
      "toneLevel": number,
      "styleLevel": number
    }
    ```
  - Response:
    ```json
    {
      "adjustedText": "string"
    }
    ```

