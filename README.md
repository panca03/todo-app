# Todo App

A full-stack task management application built with **Laravel** (backend) and **Angular** (frontend), designed to help users organize, track, and manage their daily tasks efficiently.

![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat&logo=laravel)
![Angular](https://img.shields.io/badge/Angular-21.x-DD0031?style=flat&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=flat&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

## ✨ Features

### Backend (Laravel API)
- **User Authentication** - Registration, login, logout with Sanctum token-based authentication
- **Task Management** - CRUD operations for tasks with filtering capabilities
- **Task Properties**:
  - Title and description
  - Due date scheduling
  - Priority levels (low, medium, high)
  - Status tracking (pending, completed)
- **Dashboard Statistics** - Overview of task completion metrics
- **Real-time Notifications** - Using Laravel Reverb and Laravel Echo
- **RESTful API** - Clean and consistent API endpoints

### Frontend (Angular SPA)
- **Modern UI** - Built with Angular 21 and Tailwind CSS
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Task Dashboard** - Visual statistics and task overview
- **Task List Management** - Create, read, update, and delete tasks
- **Real-time Updates** - Live notification updates
- **Authentication Flow** - Secure login and registration pages

## 🚀 Tech Stack

### Backend
- **Framework**: Laravel 12.x
- **PHP**: ^8.2
- **Authentication**: Laravel Sanctum
- **Real-time**: Laravel Reverb
- **Database**: SQLite (configurable)

### Frontend
- **Framework**: Angular 21.x
- **Styling**: Tailwind CSS 4.x
- **State Management**: RxJS
- **Real-time**: Laravel Echo + Pusher JS

## 📁 Project Structure

```
todo-app/
├── backend/          # Laravel API application
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/Api/
│   │   ├── Models/
│   │   └── Services/
│   ├── database/
│   │   └── migrations/
│   ├── routes/
│   │   └── api.php   # API routes
│   └── composer.json
└── frontend/         # Angular application
    ├── src/
    │   ├── app/
    │   │   ├── features/
    │   │   ├── core/
    │   │   └── shared/
    │   └── main.ts
    ├── angular.json
    └── package.json
```

## 🔧 Installation

### Prerequisites
- PHP >= 8.2
- Composer
- Node.js >= 18.x
- npm >= 11.x

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Start development server
php artisan serve
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
ng serve
```

### Quick Setup (All-in-one)

```bash
# From root directory
cd backend
composer run setup
```

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get authenticated user |
| POST | `/api/auth/logout` | Logout user |

### Tasks (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create new task |
| GET | `/api/tasks/{task}` | Get specific task |
| PUT | `/api/tasks/{task}` | Update task |
| DELETE | `/api/tasks/{task}` | Delete task |
| PATCH | `/api/tasks/{task}/complete` | Mark task as complete |

### Dashboard (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get task statistics |

### Notifications (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | List all notifications |
| GET | `/api/notifications/unread-count` | Get unread count |
| PATCH | `/api/notifications/{notification}/read` | Mark as read |
| POST | `/api/notifications/mark-all-read` | Mark all as read |

## 💻 Development

### Backend Commands

```bash
# Run development environment (server, queue, logs)
composer run dev

# Run tests
composer run test

# Code formatting
npx laravel-pint
```

### Frontend Commands

```bash
# Development server
npm run start
# or ng serve

# Build for production
npm run build

# Run tests
npm run test

# Watch mode
npm run watch
```

## 📡 Environment Variables

### Backend (.env)
```env
APP_NAME="Todo App"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite

BROADCAST_CONNECTION=reverb
QUEUE_CONNECTION=database
```

### Frontend
Update `src/environments/environment.ts` with API URL:
```typescript
export const environment = {
  apiUrl: 'http://localhost:8000/api'
};
```

## 📊 Task Model

| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| user_id | bigint | Foreign key to users |
| title | string | Task title |
| description | text | Task description (optional) |
| due_date | date | Due date (optional) |
| priority | enum | low, medium, high |
| status | enum | pending, completed |
| completed_at | timestamp | Completion timestamp |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open-sourced software licensed under the [MIT License](LICENSE).

## 👨‍💻 Author

**Panca03** - [GitHub](https://github.com/Panca03)

---

<p align="center">Built with ❤️ using Laravel & Angular</p>