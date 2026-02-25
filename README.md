# Weather Dashboard - Full-Stack Assessment

A multi-user weather dashboard application where users can track real-time weather across multiple cities with secure authentication, favorites management, and complete data isolation.

## 🌐 Live Application

- **Frontend:** https://weather-dashboard-5ig2.vercel.app
- **Backend API:** https://weather-dashboard-production-f71f.up.railway.app
- **Database:** MongoDB Atlas (free tier)

### Test Account
```
Email: test@example.com
Password: password123
```

---

## 📹 Video Walkthrough

Watch a 3-4 minute demo of the application:
[Insert your video link here]

---

## ✨ Features

### Core Features
- ✅ **User Authentication** - Secure JWT-based registration and login
- ✅ **Multi-City Dashboard** - Add unlimited cities and track weather
- ✅ **Real-Time Weather Data** - Fetch current weather from Open-Meteo API
- ✅ **Favorites Management** - Mark cities as favorites for quick access
- ✅ **Complete Data Isolation** - Each user's data is strictly private
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Password Security** - Passwords hashed with bcryptjs

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Deployment:** Vercel (free tier)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** JavaScript
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Deployment:** Railway (free tier, $5/month credit)

### Database
- **Database:** MongoDB
- **Hosting:** MongoDB Atlas (free tier, 512 MB)
- **Mongoose:** ODM for MongoDB

### External APIs
- **Weather API:** Open-Meteo (free, no key required)
- **Forecast API:** Open-Meteo

---

## 📁 Project Structure

```
weather-dashboard/
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT authentication
│   │   │   └── errorHandler.js      # Global error handling
│   │   ├── routes/
│   │   │   ├── auth.routes.js       # Authentication endpoints
│   │   │   ├── cities.routes.js     # Cities management endpoints
│   │   │   └── weather.routes.js    # Weather data endpoints
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth logic
│   │   │   ├── citiesController.js  # Cities logic
│   │   │   └── weatherController.js # Weather logic
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   └── City.js              # City schema
│   │   ├── services/
│   │   │   └── weatherService.js    # Weather API integration
│   │   ├── config/
│   │   │   ├── database.js          # MongoDB connection
│   │   │   └── env.js               # Environment config
│   │   └── app.js                   # Express app setup
│   ├── server.js                    # Server entry point
│   ├── .env.example                 # Environment variables template
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Top navigation
│   │   │   ├── CityCard.jsx         # City weather card
│   │   │   ├── AddCityModal.jsx     # Add city form
│   │   │   └── LoadingState.jsx     # Loading indicator
│   │   ├── pages/
│   │   │   ├── page.js              # Home page
│   │   │   ├── login/page.js        # Login page
│   │   │   ├── register/page.js     # Registration page
│   │   │   └── dashboard/page.js    # Main dashboard
│   │   ├── lib/
│   │   │   ├── api.js               # API client with axios
│   │   │   ├── authStore.js         # Auth state management (Zustand)
│   │   │   └── citiesStore.js       # Cities state management (Zustand)
│   │   ├── styles/
│   │   │   └── globals.css          # Global styles
│   │   └── layout.js                # Root layout
│   ├── .env.local                   # Local environment variables
│   ├── next.config.js               # Next.js configuration
│   ├── tailwind.config.js           # Tailwind configuration
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🏗️ Architecture Overview

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────┐
│  FRONTEND (Next.js + Tailwind CSS)                  │
│  - User interface                                   │
│  - State management (Zustand)                       │
│  - API requests (Axios)                             │
│  Deployed on: Vercel                                │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP/HTTPS
                   │
┌──────────────────▼──────────────────────────────────┐
│  BACKEND (Node.js + Express)                        │
│  - API endpoints                                    │
│  - Authentication (JWT)                             │
│  - Authorization checks                             │
│  - Business logic                                   │
│  - External API calls (Weather)                     │
│  Deployed on: Railway                               │
└──────────────────┬──────────────────────────────────┘
                   │ MongoDB Protocol
                   │
┌──────────────────▼──────────────────────────────────┐
│  DATABASE (MongoDB Atlas)                           │
│  - User documents                                   │
│  - City documents                                   │
│  - Data persistence                                 │
│  Hosted on: MongoDB Atlas Cloud                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Registration**
   - User submits username, email, password
   - Password is hashed using bcryptjs (10 salt rounds)
   - User document created in MongoDB
   - JWT token generated and returned to client

2. **Login**
   - User submits email and password
   - Password compared with stored hash
   - JWT token generated with user ID
   - Token stored in localStorage on client

3. **Protected Requests**
   - Every API request includes JWT in `Authorization: Bearer <token>` header
   - Backend middleware verifies token
   - User ID extracted from token and attached to request

### Authorization Strategy

**Data Isolation at Multiple Levels:**

1. **Database Level**
   ```javascript
   // City schema includes userId
   city = {
     name: "London",
     country: "UK",
     userId: ObjectId("user123"),  // Links city to owner
     isFavorite: true
   }
   
   // Unique constraint prevents duplicate cities per user
   citySchema.index({ userId: 1, name: 1 }, { unique: true });
   ```

2. **Query Level**
   ```javascript
   // Only fetch cities for authenticated user
   City.find({ userId: req.userId })
   ```

3. **Endpoint Level**
   ```javascript
   // All endpoints require authentication
   router.get('/', auth, citiesController.getCities);
   router.delete('/:id', auth, citiesController.deleteCity);
   ```

4. **Controller Level**
   ```javascript
   // Verify user owns the resource
   if (city.userId.toString() !== req.userId) {
     return res.status(403).json({ message: 'Not authorized' });
   }
   ```

**Result:** Users can only access their own data. Attempting to access another user's cities returns 403 Forbidden.

---

## 🌤️ Weather Data Integration

### Open-Meteo API
- **Free API** - No authentication required
- **Rate Limit** - 400,000 calls/day (free tier)
- **Data Points**
  - Current temperature
  - Weather condition (clear, rainy, etc.)
  - Humidity percentage
  - Wind speed
  - Timezone information

### Data Flow
1. User adds city with latitude/longitude
2. Dashboard loads weather data for all user's cities
3. Backend calls Open-Meteo API
4. Weather data cached in Zustand store
5. UI updates with real-time data

---

## 🎯 Custom Feature: [Add Your Feature Name]

### Description
[Describe your custom feature here - what problem does it solve?]

### How It Works
[Explain the functionality step-by-step]

### Technical Implementation
[Brief explanation of how it's implemented]

### User Value
[Why did you build this? What problem does it solve?]

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (Atlas free account)
- Git
- Code editor (VSCode recommended)

### Local Development

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/weather-dashboard.git
cd weather-dashboard
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB URI
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/weather-dashboard
# JWT_SECRET=your_secret_key_here

# Start backend (development mode)
npm run dev

# Backend runs on http://localhost:5000
```

#### 3. Frontend Setup (in new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Start frontend (development mode)
npm run dev

# Frontend runs on http://localhost:3000
```

#### 4. Test Locally
- Open http://localhost:3000
- Register a new account
- Add cities and view weather
- Verify favorites functionality

### Production Deployment

All services are deployed on **free tiers**:

#### Database: MongoDB Atlas
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free cluster (AWS, ap-south-1 Mumbai)
3. Create database user
4. Whitelist IP: 0.0.0.0/0
5. Get connection string

#### Backend: Railway
1. Connect GitHub to https://railway.app
2. Create new project from repository
3. Select `backend` directory
4. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `NODE_ENV=production`
5. Auto-deploys on git push

#### Frontend: Vercel
1. Import repository at https://vercel.app
2. Select `frontend` directory
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL=https://your-railway-url/api`
4. Auto-deploys on git push

---

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Cities
```
GET    /api/cities              # Get all user's cities
POST   /api/cities              # Add new city
DELETE /api/cities/:id          # Delete city
PATCH  /api/cities/:id/favorite # Toggle favorite
```

### Weather
```
GET    /api/weather?latitude=51.5&longitude=-0.1
```

---

## 🔑 Key Design Decisions

### 1. **Why Next.js?**
- Built-in routing and optimization
- Full-stack capabilities
- Excellent performance
- Great for rapid development

### 2. **Why MongoDB?**
- Flexible schema for weather data
- Easy to scale horizontally
- Great document model for user data
- Free Atlas tier is generous (512 MB)

### 3. **Why Zustand for State?**
- Lightweight compared to Redux
- Simple API, minimal boilerplate
- Perfect for small to medium apps
- Great TypeScript support

### 4. **Why JWT Authentication?**
- Stateless (no session storage needed)
- Scalable for distributed systems
- Standard for REST APIs
- Easy to implement refresh tokens later

### 5. **Why Open-Meteo API?**
- Free with no authentication required
- No credit card needed
- High rate limit (400,000/day)
- Good data quality
- Supports 400+ cities globally

### 6. **Data Isolation Strategy**
- Every city document stores userId
- Unique index on (userId, cityName)
- Authorization checks at multiple levels
- Prevents accidental data leaks

### 7. **Deployment on Free Tiers**
- Vercel for Next.js (native support, always free)
- Railway for Node.js ($5/month credit covers small projects)
- MongoDB Atlas (512 MB free tier)
- Total cost: $0 for this project

---

## ⚙️ Technical Decisions & Trade-offs

| Decision | Benefit | Trade-off |
|----------|---------|-----------|
| JWT Authentication | Stateless, scalable | Need to manage token expiry |
| MongoDB | Flexible schema | Need to handle eventual consistency |
| Zustand | Simple, lightweight | Limited for very large apps |
| Open-Meteo | Free, no key | Limited customization vs paid APIs |
| Railway | Easy deployment | $5 free tier might be exceeded |

---

## 📈 Performance Considerations

### Optimizations Implemented
- Zustand caching (prevents redundant API calls)
- Lazy loading of weather data
- Efficient database queries with indexes
- JWT validation in middleware (quick, stateless)

### Future Improvements
- Redis caching for weather data
- GraphQL for flexible queries
- WebSocket for real-time updates
- Database query optimization
- Image optimization for mobile

---

## 🐛 Known Limitations

1. **Weather API Rate Limiting**
   - Open-Meteo free tier: 400,000 calls/day
   - Not an issue for small user bases
   - Recommendation: Implement caching for production

2. **No Email Verification**
   - Users can sign up with any email
   - Recommendation: Add verification email service

3. **No Password Reset**
   - Users who forget password can't recover
   - Recommendation: Add "Forgot Password" flow

4. **No Real-Time Updates**
   - Weather data doesn't auto-refresh
   - Users must manually refresh dashboard
   - Recommendation: Implement WebSocket or polling

5. **Limited Weather Data**
   - Only current weather (no hourly/weekly forecast)
   - Recommendation: Extend API to include forecasts

6. **No Mobile App**
   - Only web version available
   - Recommendation: Build React Native app

---

## 🔮 Future Enhancements

1. **Weather Forecasts**
   - 7-day weather forecast
   - Hourly forecast
   - Historical weather data

2. **Advanced Features**
   - Weather alerts (notify when temp > X)
   - Weather comparison charts
   - Temperature/weather preferences (C vs F)

3. **Social Features**
   - Share weather with friends
   - View shared cities
   - Comments on cities

4. **Search & Discovery**
   - City auto-complete (Google Places API)
   - Popular cities suggestions
   - Geographic search

5. **Performance**
   - Redis caching
   - CDN for static assets
   - Database query optimization

---

## 🧪 Testing

### Manual Testing
```bash
# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test adding city (replace TOKEN with JWT from login)
curl -X POST http://localhost:5000/api/cities \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"London","country":"UK","latitude":51.5074,"longitude":-0.1278}'
```

### Automated Testing (Future)
- Jest for unit tests
- Supertest for API tests
- React Testing Library for frontend
- E2E tests with Cypress/Playwright

---

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weather-dashboard
JWT_SECRET=your_super_secret_key_minimum_32_chars
JWT_EXPIRE=7d
WEATHER_API_KEY=not_needed_for_open_meteo
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Note:** Never commit .env files. Use .env.example as template.

---

## 🚨 Security Considerations

### Implemented
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT tokens for stateless authentication
- ✅ CORS enabled only for trusted origins
- ✅ Authorization checks on all endpoints
- ✅ Data isolation at database level
- ✅ Environment variables for secrets (never in code)

### Recommendations for Production
- ✅ Use HTTPS (both services support this)
- ✅ Add rate limiting to prevent brute force attacks
- ✅ Implement request validation (express-validator)
- ✅ Add security headers (helmet.js)
- ✅ Regular security audits
- ✅ Input sanitization
- ✅ SQL injection prevention (using Mongoose ODM)

---

## 📚 Learning Resources

### Next.js
- https://nextjs.org/docs
- https://nextjs.org/learn

### Express.js
- https://expressjs.com/
- https://www.udemy.com/course/nodejs-express/

### MongoDB
- https://docs.mongodb.com/
- https://www.mongodb.com/docs/drivers/node/

### Tailwind CSS
- https://tailwindcss.com/docs
- https://tailwindui.com/

### JWT
- https://jwt.io/
- https://tools.ietf.org/html/rfc7519

---

## 🤝 Contributing

This is an assessment project. To modify:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is created for educational purposes. See LICENSE file for details.

---

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- Open-Meteo for free weather API
- Vercel for hosting
- Railway for backend deployment
- MongoDB Atlas for cloud database
- Next.js, Express.js, and Node.js communities

---

## 📞 Support

For issues or questions:
1. Check the [Issues](https://github.com/yourusername/weather-dashboard/issues) section
2. Review this README
3. Check deployment logs:
   - Vercel: https://vercel.com/dashboard
   - Railway: https://railway.app/dashboard
   - MongoDB: https://cloud.mongodb.com

---

**Last Updated:** [Current Date]
**Status:** ✅ Production Ready
**Version:** 1.0.0
