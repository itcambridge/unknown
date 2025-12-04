# Beach Cache Detection Backend

FastAPI service for handling the Beach Cache Detection & Coordination System's backend operations.

## Features

- Integration with Supabase for data access
- OpenAI integration for AI summaries
- Email notifications to authorities
- Health check endpoint

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   venv\Scripts\activate  # On Windows
   source venv/bin/activate  # On Unix/macOS
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Create a `.env` file with the following variables:
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   OPENAI_API_KEY=your-openai-api-key
   SMTP_HOST=your-smtp-host
   SMTP_PORT=your-smtp-port
   SMTP_USER=your-smtp-username
   SMTP_PASS=your-smtp-password
   AUTHORITY_EMAIL_TO=authority-email@example.com
   ```

4. Run the server:
   ```
   cd app
   uvicorn main:app --reload
   ```

## API Documentation

When the server is running, access:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Docker Deployment

A Dockerfile is provided for containerized deployment.
