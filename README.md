# Lecture Hall Allocation System – Frontend

React frontend for the Lecture Hall Allocation System.

## Tech Stack

- React
- Axios
- React Router

## Setup

```bash
npm install
```

## Run

Ensure the Django API is running on `http://localhost:8000`:

```bash
cd ../lecture_hall_system
python manage.py runserver
```

Then start the React app:

```bash
npm start
```

The app will open at `http://localhost:3000`.

## Environment

To use a different API URL, create `.env`:

```
REACT_APP_API_URL=http://your-api-url/api
```

## User ID

The app uses `userId` from `localStorage` (default: `1`) for bookings and waiting list. Set it in the browser console:

```javascript
localStorage.setItem('userId', '1');
```
