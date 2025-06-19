# Amazon Reebews Admin

A modern admin panel for managing Amazon review products, built with Next.js, TypeScript, and traditional environment-based API key authentication.

## 🔐 API Authentication

This project uses **traditional environment-based API keys** for secure server-to-server communication.

### Generated API Keys

**Production Environment:**

```
PAYMENT_FLOW_API_KEY_PROD=
```

**Development Environment:**

```
PAYMENT_FLOW_API_KEY_DEV=
```

### Environment Setup

1. **Create `.env.local` file:**

```env
# Database
MONGODB_URI=mongodb://localhost:27017/reebews-admin

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# API Keys for Payment Flow
PAYMENT_FLOW_API_KEY_PROD=
PAYMENT_FLOW_API_KEY_DEV=
NODE_ENV=development
```

2. **Client-side configuration (Landing Page):**

```env
# For calling the Reebews Admin API
REEBEWS_API_KEY=
```

### API Usage

```javascript
const response = await fetch("/api/v1/payment/create-pending-user", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.REEBEWS_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "user@example.com",
    name: "John Doe",
    planType: "premium",
  }),
});
```

## 🚀 Quick Start

1. **Clone the repository:**

```bash
git clone <your-repo-url>
cd project-amzn-reebews-admin
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

```bash
cp .env.local.example .env.local
# Edit .env.local with your actual values
```

4. **Run the development server:**

```bash
npm run dev
```

5. **Test API authentication:**

```bash
node test-api-key.js
```

## 🔧 API Endpoints

### Payment API

- `POST /api/v1/payment/create-pending-user` - Create a pending user for payment processing

**Authentication:** Bearer token with API key

**Request:**

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "planType": "premium"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Pending user created successfully",
  "data": {
    "id": "pending_1704123456789",
    "email": "user@example.com",
    "name": "John Doe",
    "planType": "premium",
    "status": "pending",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

## 🔑 Generating New API Keys

To generate a new API key using OpenSSL:

```bash
echo "ak_$(openssl rand -hex 32)"
```

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/v1/         # API routes
│   ├── dashboard/      # Dashboard pages
│   └── login/          # Authentication pages
├── components/         # React components
├── lib/                # Utility libraries
│   └── auth/           # Authentication middleware
├── middleware.ts       # Next.js middleware
└── types/              # TypeScript type definitions
```

## 🛡️ Security Features

- ✅ Traditional environment-based API keys
- ✅ Bearer token authentication
- ✅ Environment-specific key validation
- ✅ Clerk.js authentication for admin panel
- ✅ Type-safe API responses
- ✅ Input validation

## 📝 Development

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Authentication:** Clerk.js + Environment API Keys
- **Database:** MongoDB (configured for future use)
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui

---

For detailed API key setup instructions, see [API_KEYS_SETUP.md](./API_KEYS_SETUP.md)
