# 🚗 Fleetly - Advanced Fleet Management System

A comprehensive, production-ready fleet management solution built with Next.js, TypeScript, and MySQL. Features real-time tracking, maintenance scheduling, driver management, and intelligent reporting.

## ✨ Features

### 🚛 **Vehicle Management**
- Complete vehicle inventory with detailed specifications
- Real-time status tracking (Active, Maintenance, Out of Service)
- Fuel efficiency monitoring and analytics
- Insurance and registration tracking
- Vehicle assignment and history

### 👥 **Driver Management**
- Driver profiles with license verification
- Performance tracking and scoring
- License expiry alerts and notifications
- Assignment history and availability status
- Contact information and emergency contacts

### 🔧 **Maintenance System**
- Preventive maintenance scheduling
- Work order management with status tracking
- Cost tracking and budget analysis
- Automated email reminders
- Maintenance history and reports

### ⛽ **Fuel Management**
- Fuel consumption tracking
- Cost analysis and budgeting
- Efficiency reports per vehicle/driver
- Fuel card integration ready
- Consumption trend analysis

### 📊 **Advanced Analytics**
- Real-time dashboard with key metrics
- Cost analysis and budget tracking
- Performance reports and insights
- Maintenance cost optimization
- Driver performance analytics

### 🔔 **Smart Notifications**
- Email alerts for maintenance due dates
- License expiry notifications
- System-wide announcement system
- Real-time status updates
- Customizable notification preferences

### 🌍 **Multi-Language Support**
- English, Spanish, French, German
- Easy language switching
- Localized date and number formats
- RTL language support ready

### 💰 **Multi-Currency Support**
- Real-time currency conversion
- Support for major world currencies
- Localized pricing displays
- Historical exchange rate tracking

## 🛠️ **Technology Stack**

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Database**: MySQL with connection pooling
- **Authentication**: JWT with bcrypt encryption
- **Email**: Gmail SMTP integration
- **Deployment**: Docker, Vercel ready
- **Testing**: Jest, React Testing Library

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ and npm 8+
- MySQL 8.0+
- Gmail account with App Password

### 1. Clone and Install
\`\`\`bash
git clone https://github.com/yourusername/fleetly.git
cd fleetly
npm install
\`\`\`

### 2. Environment Setup
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your configuration:
\`\`\`env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=fleetly_user
DB_PASSWORD=your_secure_password
DB_NAME=fleetly_db

# Gmail Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
FROM_NAME=Fleetly System

# Security
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 3. Database Setup
\`\`\`bash
# Create database and user in MySQL
mysql -u root -p
CREATE DATABASE fleetly_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'fleetly_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON fleetly_db.* TO 'fleetly_user'@'localhost';
FLUSH PRIVILEGES;
exit

# Run migrations
npm run db:migrate
\`\`\`

### 4. Gmail Setup
1. Enable 2-Factor Authentication on your Gmail
2. Generate App Password: [Google Account Settings](https://myaccount.google.com/) → Security → App passwords
3. Test email configuration:
\`\`\`bash
npm run email:test
\`\`\`

### 5. Start Development
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` and login with:
- **Email**: admin@fleetly.com
- **Password**: admin123

## 🐳 **Docker Deployment**

### Quick Deploy with Docker Compose
\`\`\`bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f fleetly-app

# Stop services
docker-compose down
\`\`\`

### Manual Docker Build
\`\`\`bash
# Build image
docker build -t fleetly .

# Run container
docker run -p 3000:3000 --env-file .env.local fleetly
\`\`\`

## ☁️ **Cloud Deployment**

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Server Deployment
\`\`\`bash
# Build for production
npm run build

# Start production server
npm start
\`\`\`

## 📁 **Project Structure**

\`\`\`
fleetly/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard pages
│   ├── vehicles/          # Vehicle management
│   ├── drivers/           # Driver management
│   ├── maintenance/       # Maintenance system
│   ├── fuel/             # Fuel management
│   └── reports/          # Analytics and reports
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── layout/           # Layout components
├── lib/                  # Utilities and services
│   ├── services/         # Business logic services
│   ├── database/         # Database connection
│   └── i18n/            # Internationalization
├── database/             # Database schema and migrations
└── scripts/              # Utility scripts
\`\`\`

## 🔧 **Available Scripts**

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
npm run type-check  # TypeScript type checking
npm run db:migrate  # Run database migrations
npm run email:test  # Test email configuration
npm test           # Run tests
\`\`\`

## 🔐 **Security Features**

- JWT-based authentication with secure token handling
- Password hashing with bcrypt
- SQL injection prevention with parameterized queries
- XSS protection with input sanitization
- CSRF protection built-in
- Environment variable security
- Role-based access control

## 📧 **Email Templates**

The system includes beautiful HTML email templates for:
- 🔧 Maintenance reminders
- ⚠️ License expiry alerts
- 👋 Welcome emails for new users
- 📊 System notifications

## 🌐 **API Endpoints**

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Vehicles
- `GET /api/vehicles` - List all vehicles
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Drivers
- `GET /api/drivers` - List all drivers
- `POST /api/drivers` - Create new driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

### Maintenance
- `GET /api/maintenance` - List maintenance records
- `POST /api/maintenance` - Create maintenance record
- `PUT /api/maintenance/:id` - Update maintenance record

## 🧪 **Testing**

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- 📧 Email: support@fleetly.com
- 📖 Documentation: [docs.fleetly.com](https://docs.fleetly.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/fleetly/issues)

## 🎯 **Roadmap**

- [ ] Mobile app (React Native)
- [ ] GPS tracking integration
- [ ] Advanced reporting dashboard
- [ ] API rate limiting
- [ ] Webhook integrations
- [ ] Multi-tenant support
- [ ] Advanced role permissions
- [ ] Audit logging system

---

**Built with ❤️ by the Fleetly Team**

*Fleetly - Making fleet management simple, efficient, and intelligent.*
