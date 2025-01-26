# QA Dashboard

A modern dashboard for visualizing QA test results with a clean UI and REST API.

## Features

- Modern React frontend with Material-UI
- REST API for submitting test results
- Two-week view of test results
- Color-coded status indicators (green for passed, red for failed)
- Auto-refresh every minute

## Setup

### Development Mode

1. Install all dependencies:
```bash
npm run install-all
```

2. Start the development servers:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:3000 (API endpoints)
- Frontend development server on http://localhost:5173 (UI)

You can also start them separately:
```bash
# Terminal 1 (backend)
npm run server

# Terminal 2 (frontend)
npm run client
```

### Production Mode (Docker)

1. Build the Docker image:
```bash
docker build -t qa-dashboard .
```

2. Run the container:
```bash
docker run -p 3000:3000 qa-dashboard
```

3. Access the application:
   - UI Dashboard: http://localhost:3000
   - API Endpoints: http://localhost:3000/api/*
   
Example API endpoints:
- GET http://localhost:3000/api/results (get all test results)
- POST http://localhost:3000/api/results (submit new test results)

In production mode, both the UI and API are served from the same port (3000). The backend serves:
- Frontend static files at the root URL (/)
- API endpoints under the /api prefix

### Populate Test Data

To populate the dashboard with sample test data for the last 14 days:

1. Make sure the server is running
2. Run the populate script:
```bash
npm run populate
```

This will generate random test data for five features (account, charges, payments, refunds, disputes) with an 80% pass rate.

## API Usage

### Submit Test Results

```bash
curl -X POST http://localhost:3000/api/results \
  -H "Content-Type: application/json" \
  -d '{
    "datetime": "26/01/2025",
    "features": [
      {
        "type": "account",
        "test_cases_count": "10",
        "status": "failed"
      },
      {
        "type": "charges",
        "test_cases_count": "40",
        "status": "passed"
      }
    ]
  }'
```

### Get Test Results

```bash
curl http://localhost:3000/api/results
```

## Future Development Plans

- Add links to test reports for failed tests
- Implement view options (one week, two weeks, month)
- Add ability to update today's results by overriding only failed cells 