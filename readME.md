# 🚀 Revivo Backend

Backend API for **Revivo**, an AI-powered platform that restores, colorizes, and enhances old photos.

---

## 🧠 Features

* 🔐 Authentication (JWT)
* 👤 User management (register, login, profile)
* 📸 Photo upload (Cloudinary)
* 🗂️ Project system (guest + authenticated users)
* 🧠 AI image restoration (Replicate API)
* ⚡ Preview generation (low-res / free tier)
* 🛡️ Rate limiting (anti-spam)
* 🧾 Session-based guest flow

---

## 🏗️ Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Sequelize ORM
* Cloudinary (image storage)
* Replicate API (AI processing)
* JWT Authentication

---

## 📦 Installation

```bash
git clone https://github.com/your-username/revivo-backend.git
cd revivo-backend
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=3000

# Database
DB_NAME=your_db
DB_USER=your_user
DB_PASS=your_password
DB_HOST=localhost

# JWT
JWT_SECRET=your_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# Replicate
REPLICATE_API_TOKEN=xxx
```

---

## 🚀 Run the server

```bash
npm run dev
```

or

```bash
node server.js
```

---

## 🔌 API Routes

### 🔐 Auth

| Method | Route                | Description      |
| ------ | -------------------- | ---------------- |
| POST   | `/api/auth/register` | Register user    |
| POST   | `/api/auth/login`    | Login user       |
| GET    | `/api/auth/me`       | Get current user |

---

### 📸 Upload

| Method | Route         | Description                  |
| ------ | ------------- | ---------------------------- |
| POST   | `/api/upload` | Upload photo (guest or user) |

**Headers:**

```
x-session-id: <uuid>
Authorization: Bearer <token> (optional)
```

---

### 🧠 Generate

| Method | Route                   | Description         |
| ------ | ----------------------- | ------------------- |
| POST   | `/api/generate/preview` | Generate AI preview |

**Body:**

```json
{
  "photoId": "uuid"
}
```

---

### 🗂️ Projects

| Method | Route              | Description       |
| ------ | ------------------ | ----------------- |
| GET    | `/api/projects/me` | Get user projects |

---

## 👤 Guest vs Auth Flow

### Guest

* Upload with `x-session-id`
* Projects linked to `session_id`
* Limited previews

### Authenticated User

* Upload linked to `userId`
* Unlimited access (depending on plan)

### 🔄 On Login

Guest projects are automatically linked to the user:

```js
await Project.update(
  { userId: user.id },
  { where: { session_id: sessionId } }
);
```

---

## 🧠 AI Processing Flow

1. Upload image → Cloudinary
2. Save Photo in DB
3. Call Replicate API
4. Store processed image URL
5. Return preview URL

---

## 🛡️ Rate Limiting

* Guest: limited uploads per IP
* User: higher limits based on authentication

---

## 📁 Project Structure

```
/controllers
/models
/routes
/services
/middleware
/config
```

---

## 🧪 Testing (Postman)

### Upload

* Method: POST
* URL: `http://localhost:3000/api/upload`
* Body: form-data → `file`

### Generate Preview

```json
{
  "photoId": "your-photo-id"
}
```

---

## ⚠️ Notes

* Guest uploads require `x-session-id`
* Some routes require JWT
* AI processing may take a few seconds

---

## 📌 Roadmap

* 💳 Stripe integration (payments)
* 🎬 Video generation
* 📊 Usage tracking
* 📦 Queue system (Bull / Redis)
* 🧠 Multiple AI models

---

## 👨‍💻 Author

Built with ❤️ by you

---

## 📄 License

MIT
