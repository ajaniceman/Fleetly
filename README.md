# 🚗 Fleetly - Advanced Fleet Management System

A comprehensive, production-ready fleet management system built with Next.js 14, TypeScript, MySQL, and modern web technologies. Manage vehicles, drivers, maintenance, fuel consumption, incidents, and generate detailed reports with real-time notifications.

![Fleetly Dashboard](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Fleetly+Dashboard)

## ✨ Features

### 🚗 **Vehicle Management**
- Complete vehicle inventory with detailed specifications
- Real-time vehicle status tracking
- Vehicle assignment and scheduling
- Document management (registration, insurance, etc.)
- Maintenance history and scheduling

### 👥 **Driver Management**
- Driver profiles with license information
- Performance tracking and scoring
- License expiry alerts
- Driver assignment to vehicles
- Training records and certifications

### 🔧 **Maintenance System**
- Automated maintenance scheduling
- Service history tracking
- Cost management and budgeting
- Vendor management
- Preventive maintenance alerts

### ⛽ **Fuel Management**
- Fuel consumption tracking
- Cost analysis and optimization
- Fuel card integration
- Efficiency reporting
- Fuel theft detection

### 🚨 **Incident Management**
- Incident reporting and tracking
- Insurance claim management
- Photo and document uploads
- Severity classification
- Investigation workflow

### 📊 **Advanced Reporting**
- Real-time dashboard with KPIs
- Custom report generation
- Cost analysis and budgeting
- Performance metrics
- Export capabilities (PDF, Excel)

### 🔔 **Smart Notifications**
- Email notifications via Gmail
- Real-time in-app notifications
- Maintenance reminders
- License expiry alerts
- Incident notifications

### 🌍 **Multi-language Support**
- English, Spanish, French, German, Bosnian
- Easy language switching
- Localized email templates
- Currency conversion support

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Dark/Light theme support
- Intuitive navigation
- Advanced filtering and search
- Real-time updates

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Lucide Icons
- **Backend**: Next.js API Routes, MySQL
- **Database**: MySQL 8.0+ with optimized schemas
- **Authentication**: JWT with secure session management
- **Email**: Gmail SMTP with Nodemailer
- **Deployment**: Docker, Vercel, or traditional hosting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- MySQL 8.0+
- Gmail account with App Password
- Git

### 1. Clone Repository

\`\`\`bash
git clone https://github.com/yourusername/fleetly.git
cd fleetly
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Database Setup

\`\`\`bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE fleetly_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'fleetly_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON fleetly_db.* TO 'fleetly_user'@'localhost';
FLUSH PRIVILEGES;
exit

# Import database schema
mysql -u fleetly_user -p fleetly_db < database/schema.sql
\`\`\`

### 4. Environment Configuration

\`\`\`bash
# Copy environment template
cp .env.example .env.local

# Edit with your configuration
nano .env.local
\`\`\`

**Required Environment Variables:**

\`\`\`env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=fleetly_user
DB_PASSWORD=your_secure_password
DB_NAME=fleetly_db
DB_SSL=false

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=24h

# Temporary Admin Account (Change after first login)
TEMP_ADMIN_EMAIL=admin
TEMP_ADMIN_PASSWORD=testpassword

# Gmail Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
FROM_NAME=Fleetly System

# Application
APP_URL=http://localhost:3000

# Currency Exchange (Optional)
EXCHANGE_API_URL=https://api.exchangerate-api.com/v4/latest
EXCHANGE_API_KEY=your_exchange_api_key
\`\`\`

### 5. Gmail Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `GMAIL_APP_PASSWORD`

### 6. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` and login with:
- **Email**: admin
- **Password**: testpassword

## 📦 Production Deployment

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Option 2: Docker

\`\`\`bash
# Build and run with Docker Compose
docker-compose up -d
\`\`\`

### Option 3: Traditional Server

\`\`\`bash
# Build application
npm run build

# Start production server
npm start
\`\`\`

## 🔧 Configuration

### Database Migration

\`\`\`bash
npm run db:migrate
\`\`\`

### Seed Sample Data

\`\`\`bash
npm run db:seed
\`\`\`

### Test Email Configuration

\`\`\`bash
npm run email:test
\`\`\`

## 📱 Usage

### Dashboard Overview
- View key metrics and KPIs
- Monitor vehicle status
- Track maintenance schedules
- Review recent incidents

### Vehicle Management
- Add/edit vehicle information
- Track maintenance history
- Monitor fuel consumption
- Manage documents

### Driver Management
- Maintain driver profiles
- Track license expiry
- Monitor performance
- Assign vehicles

### Maintenance Scheduling
- Create maintenance schedules
- Track service history
- Manage costs
- Set up alerts

### Reporting
- Generate custom reports
- Export data (PDF, Excel)
- Analyze trends
- Monitor costs

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Secure session management

## 🌐 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Vehicle Endpoints
- `GET /api/vehicles` - List vehicles
- `POST /api/vehicles` - Create vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Driver Endpoints
- `GET /api/drivers` - List drivers
- `POST /api/drivers` - Create driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

[Full API documentation available in `/docs/api.md`]

## 🧪 Testing

\`\`\`bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run type-check
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@fleetly.com
- 📖 Documentation: [docs.fleetly.com](https://docs.fleetly.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/fleetly/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/fleetly/discussions)

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] GPS tracking integration
- [ ] Advanced analytics with AI
- [ ] Multi-tenant support
- [ ] API rate limiting
- [ ] Webhook integrations
- [ ] Advanced reporting dashboard
- [ ] Fleet optimization algorithms

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Lucide](https://lucide.dev/) - Icon library
- [MySQL](https://www.mysql.com/) - Database
- [Nodemailer](https://nodemailer.com/) - Email service

---

**Built with ❤️ by the Fleetly Team**

*Fleetly - Streamline Your Fleet Operations*
