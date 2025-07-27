# Fleetly - Fleet Management System

A comprehensive fleet management solution built with Next.js, MySQL, and modern web technologies. Manage vehicles, drivers, maintenance, fuel consumption, and incidents with real-time notifications and multi-language support.

## 🚀 Features

- **Vehicle Management**: Complete vehicle lifecycle management with maintenance tracking
- **Driver Management**: Driver profiles, license tracking, and performance monitoring
- **Maintenance Scheduling**: Automated maintenance reminders and service tracking
- **Fuel Management**: Fuel consumption tracking and efficiency analysis
- **Incident Reporting**: Comprehensive incident management and reporting
- **Multi-Language Support**: English, Spanish, French, German, and Bosnian
- **Currency Conversion**: Real-time currency conversion with multiple currency support
- **Email Notifications**: Automated email alerts for maintenance, expiry dates, and incidents
- **Role-Based Access Control**: Granular permissions system
- **Dark/Light Theme**: User-customizable themes
- **Responsive Design**: Mobile-first responsive design

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, MySQL
- **Authentication**: JWT with bcrypt password hashing
- **Email**: External email service integration (SendGrid, Mailgun, etc.)
- **Internationalization**: react-i18next
- **UI Components**: shadcn/ui, Radix UI
- **Currency**: External exchange rate API integration

## 📋 Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn
- Email service API key (SendGrid, Mailgun, etc.)
- Currency exchange API key (optional)

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/fleetly.git
cd fleetly
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Database Setup

Create a MySQL database and run the schema:

\`\`\`bash
mysql -u root -p
CREATE DATABASE fleetly_db;
exit

# Import the database schema
mysql -u root -p fleetly_db < database/schema.sql
\`\`\`

### 4. Environment Configuration

Create a `.env.local` file in the root directory:

\`\`\`env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=fleetly_db
DB_SSL=false

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Temporary Admin Access (REMOVE IN PRODUCTION)
TEMP_ADMIN_EMAIL=admin
TEMP_ADMIN_PASSWORD=testpassword

# Email Service Configuration
EMAIL_API_URL=https://api.sendgrid.com/v3/mail/send
EMAIL_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@yourcompany.com
FROM_NAME=Fleetly System

# Application Configuration
APP_URL=http://localhost:3000

# Currency Exchange API (Optional)
EXCHANGE_API_URL=https://api.exchangerate-api.com/v4/latest
EXCHANGE_API_KEY=your_exchange_api_key
\`\`\`

### 5. Run the Application

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

The application will be available at `http://localhost:3000`

## 🔐 Default Login

For testing purposes, you can use the temporary admin login:
- **Username**: admin
- **Password**: testpassword

**⚠️ IMPORTANT**: Remove or disable this in production by removing the `TEMP_ADMIN_EMAIL` and `TEMP_ADMIN_PASSWORD` environment variables.

## 📁 Project Structure

\`\`\`
fleetly/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── vehicles/          # Vehicle management
│   ├── drivers/           # Driver management
│   ├── maintenance/       # Maintenance tracking
│   ├── fuel/             # Fuel management
│   ├── incidents/        # Incident reporting
│   └── login/            # Authentication
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
│   ├── database/         # Database connection
│   ├── services/         # Business logic services
│   ├── i18n/            # Internationalization
│   └── types.ts         # TypeScript definitions
├── database/             # Database schema and migrations
└── public/              # Static assets
\`\`\`

## 🌍 Internationalization

The application supports 5 languages:
- English (en)
- Spanish (es) 
- French (fr)
- German (de)
- Bosnian (bs)

Language files are located in `lib/i18n/locales/`. To add a new language:

1. Create a new JSON file in `lib/i18n/locales/`
2. Add the language code to the supported languages in system settings
3. Update the language selector component

## 💱 Currency Support

Supported currencies:
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- CAD (Canadian Dollar)
- BAM (Bosnia and Herzegovina Convertible Mark)

Currency conversion uses external APIs for real-time exchange rates with database caching for performance.

## 📧 Email Notifications

The system sends automated email notifications for:
- Maintenance reminders (30, 15, 7, 3 days before due)
- License expiry alerts (90, 30, 15, 7 days before expiry)
- Document expiry notifications
- Incident alerts
- Welcome emails for new users

Configure your email service provider in the environment variables.

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- SQL injection prevention with prepared statements
- XSS protection
- Role-based access control
- Input validation and sanitization
- Audit logging

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Docker Deployment

\`\`\`bash
# Build the Docker image
docker build -t fleetly .

# Run with environment variables
docker run -p 3000:3000 --env-file .env.local fleetly
\`\`\`

### Manual Server Deployment

1. Build the application:
\`\`\`bash
npm run build
\`\`\`

2. Start the production server:
\`\`\`bash
npm start
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

## 📊 Database Maintenance

### Backup Database
\`\`\`bash
mysqldump -u root -p fleetly_db > backup_$(date +%Y%m%d_%H%M%S).sql
\`\`\`

### Update Exchange Rates
The system automatically updates exchange rates, but you can manually trigger updates through the admin panel or API.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@fleetly.com or create an issue in the GitHub repository.

## 🔄 Changelog

### Version 1.0.0
- Initial release with full fleet management features
- Multi-language support (5 languages)
- Currency conversion system
- Email notification system
- Role-based access control
- MySQL database integration

## ⚠️ Important Notes

1. **Security**: Always use strong passwords and secure your database
2. **Backup**: Regularly backup your database
3. **Updates**: Keep dependencies updated for security patches
4. **Monitoring**: Monitor your application for performance and errors
5. **Testing**: Test thoroughly before deploying to production

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MySQL service is running
   - Verify database credentials
   - Ensure database exists

2. **Email Not Sending**
   - Verify email API credentials
   - Check email service quotas
   - Review email templates

3. **Currency Conversion Not Working**
   - Check exchange rate API key
   - Verify internet connectivity
   - Review API quotas

For more detailed troubleshooting, check the application logs and error messages.
