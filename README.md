# 🚗 Fleetly - Fleet Management System

A comprehensive fleet management system built with Next.js, MySQL, and Gmail integration for automated notifications.

## ✨ Features

- **🚗 Vehicle Management** - Complete vehicle tracking and information management
- **👥 Driver Management** - Driver profiles, license tracking, and performance monitoring
- **🔧 Maintenance Scheduling** - Automated maintenance reminders and tracking
- **⛽ Fuel Management** - Fuel consumption monitoring and cost analysis
- **📊 Comprehensive Reporting** - Detailed analytics and reporting dashboard
- **🚨 Incident Management** - Incident reporting and tracking system
- **📧 Email Notifications** - Automated Gmail notifications for important events
- **🌍 Multi-language Support** - Support for English, Spanish, French, German, and Bosnian
- **💱 Multi-currency Support** - Real-time currency conversion
- **🔐 Secure Authentication** - JWT-based authentication system
- **📱 Responsive Design** - Mobile-friendly interface

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- Gmail account with App Password

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/fleetly.git
   cd fleetly
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install --legacy-peer-deps
   \`\`\`

3. **Setup environment variables**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   \`\`\`

4. **Setup Gmail App Password**
   - Enable 2-Factor Authentication on Gmail
   - Generate App Password: Google Account → Security → App passwords
   - Copy the 16-character password (remove spaces!)

5. **Setup MySQL database**
   \`\`\`sql
   CREATE DATABASE fleetly_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'fleetly_user'@'localhost' IDENTIFIED BY 'secure_password';
   GRANT ALL PRIVILEGES ON fleetly_db.* TO 'fleetly_user'@'localhost';
   FLUSH PRIVILEGES;
   \`\`\`

6. **Run database migration**
   \`\`\`bash
   npm run db:migrate
   \`\`\`

7. **Test email configuration**
   \`\`\`bash
   npm run email:test
   \`\`\`

8. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

Visit `http://localhost:3000` to access Fleetly!

## 📧 Email Configuration

Fleetly uses Gmail SMTP for sending notifications. Configure these environment variables:

\`\`\`env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop  # No spaces!
FROM_NAME=Fleetly System
\`\`\`

### Email Features

- **Maintenance Reminders** - Automated alerts for upcoming maintenance
- **License Expiry Alerts** - Notifications for expiring driver licenses
- **Welcome Emails** - New user onboarding emails
- **Incident Alerts** - Immediate notifications for reported incidents

## 🗄️ Database Schema

The system includes comprehensive database tables for:

- Users and authentication
- Vehicles and specifications
- Drivers and licenses
- Maintenance schedules and records
- Fuel consumption tracking
- Incident reporting
- Email templates and notifications

## 🚀 Deployment

### Option 1: Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Option 2: Docker

\`\`\`bash
# Build and run with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f fleetly-app
\`\`\`

### Option 3: Manual Server

\`\`\`bash
# Build for production
npm run build

# Start production server
npm start
\`\`\`

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_HOST` | MySQL host | ✅ |
| `DB_PORT` | MySQL port | ✅ |
| `DB_USER` | MySQL username | ✅ |
| `DB_PASSWORD` | MySQL password | ✅ |
| `DB_NAME` | Database name | ✅ |
| `GMAIL_USER` | Gmail address | ✅ |
| `GMAIL_APP_PASSWORD` | Gmail App Password | ✅ |
| `FROM_NAME` | Email sender name | ✅ |
| `JWT_SECRET` | JWT signing secret | ✅ |
| `NEXT_PUBLIC_APP_URL` | Application URL | ✅ |
| `EXCHANGE_RATE_API_KEY` | Currency API key | ❌ |

## 📱 API Endpoints

### Email API
- `POST /api/email/maintenance-reminder` - Send maintenance reminder
- `POST /api/email/license-expiry` - Send license expiry alert
- `POST /api/email/welcome` - Send welcome email
- `POST /api/email/test` - Send test email
- `POST /api/email/verify` - Verify email configuration

### Authentication API
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

## 🧪 Testing

\`\`\`bash
# Test email configuration
npm run email:test

# Test database connection
npm run db:migrate
\`\`\`

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting for email sending

## 🌍 Multi-language Support

Supported languages:
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Bosnian (bs)

## 💱 Currency Support

- Real-time currency conversion
- Support for major world currencies
- Configurable default currency per user

## 📊 Reporting Features

- Vehicle utilization reports
- Maintenance cost analysis
- Fuel consumption trends
- Driver performance metrics
- Incident statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@fleetly.com
- Documentation: [docs.fleetly.com](https://docs.fleetly.com)

## 🙏 Acknowledgments

- Built with Next.js and React
- UI components from Radix UI
- Styling with Tailwind CSS
- Email service with Nodemailer
- Database with MySQL

---

**Fleetly** - Streamline your fleet management operations with powerful automation and insights.
