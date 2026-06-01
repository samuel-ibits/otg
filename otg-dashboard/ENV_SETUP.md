# Environment Variables Configuration

This file contains all the environment variables needed for the OTG Dashboard application.

## Setup Instructions

1. Create a `.env.local` file in the root directory of the project
2. Copy the variables below and fill in the appropriate values
3. Never commit `.env.local` to version control

## Required Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Authentication
NEXT_PUBLIC_AUTH_ENABLED=true
JWT_SECRET=your-secret-key-here

# Database (if applicable)
DATABASE_URL=your-database-connection-string

# External APIs (examples)
# Payment Gateway
PAYSTACK_SECRET_KEY=your-paystack-secret-key
PAYSTACK_PUBLIC_KEY=your-paystack-public-key

# SMS/Communication
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-email-password

# Cloud Storage (if applicable)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Analytics (optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your-ga-id

# Feature Flags
NEXT_PUBLIC_ENABLE_WIFI_MODULE=true
NEXT_PUBLIC_ENABLE_REPORTS=true
```

## Environment-Specific Files

- `.env.local` - Local development (not committed)
- `.env.development` - Development environment defaults
- `.env.production` - Production environment defaults
- `.env.test` - Test environment

## Security Notes

⚠️ **IMPORTANT:**
- Never commit sensitive keys to version control
- Use different keys for development and production
- Rotate keys regularly
- Use environment-specific values
- Prefix client-side variables with `NEXT_PUBLIC_`

## Accessing Environment Variables

### Server-side (API Routes, Server Components)
```typescript
const apiKey = process.env.API_SECRET_KEY;
```

### Client-side (Client Components)
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
```

## Validation

Consider adding environment variable validation at startup:

```typescript
// lib/env.ts
const requiredEnvVars = [
  'NEXT_PUBLIC_API_BASE_URL',
  'DATABASE_URL',
  'JWT_SECRET',
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```
