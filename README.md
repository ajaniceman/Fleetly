# Fleetly - Fleet Management System

A comprehensive fleet management solution built with Next.js, TypeScript, and MySQL.

## Features

- **Vehicle Management**: Track vehicle information, status, and assignments
- **Driver Management**: Manage driver profiles, licenses, and certifications
- **Maintenance Tracking**: Schedule and track vehicle maintenance
- **Fuel Management**: Monitor fuel consumption and costs
- **Incident Reporting**: Report and track fleet incidents
- **Multi-language Support**: English, Spanish, French, and German
- **Multi-currency Support**: USD, EUR, GBP, CAD, AUD, JPY, CHF, CNY
- **Email Notifications**: Automated email alerts and reminders
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: MySQL 8.0
- **Email**: Nodemailer with Gmail
- **Authentication**: Custom JWT-based auth
- **Deployment**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Gmail account with App Password

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd fleetly
\`\`\`

2. Copy environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Update the `.env` file with your configuration:
\`\`\`env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=fleetly_user
DB_PASSWORD=fleetly_password
DB_NAME=fleetly

# Email Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

4. Start the application with Docker:
\`\`\`bash
docker-compose up -d
\`\`\`

5. Run database migrations:
\`\`\`bash
npm run migrate
\`\`\`

6. Test email configuration:
\`\`\`bash
npm run test-email
\`\`\`

The application will be available at `http://localhost:3000`.

### Development Setup

For local development without Docker:

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start MySQL database:
\`\`\`bash
docker-compose up mysql -d
\`\`\`

3. Run migrations:
\`\`\`bash
node scripts/migrate.js
\`\`\`

4. Start development server:
\`\`\`bash
npm run dev
\`\`\`

## Project Structure

\`\`\`
fleetly/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── vehicles/          # Vehicle management
│   ├── drivers/           # Driver management
│   ├── maintenance/       # Maintenance tracking
│   ├── fuel/             # Fuel management
│   ├── incidents/        # Incident reporting
│   ├── reports/          # Reports and analytics
│   └── settings/         # Application settings
├── components/            # Reusable React components
│   ├── layout/           # Layout components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility libraries
│   ├── database/         # Database connection
│   ├── services/         # Business logic services
│   └── i18n/            # Internationalization
├── database/             # Database schema and migrations
├── scripts/              # Utility scripts
└── docker-compose.yml    # Docker configuration
\`\`\`

## API Endpoints

### Email API
- `POST /api/email/maintenance-reminder` - Send maintenance reminders
- `POST /api/email/license-expiry` - Send license expiry notifications
- `POST /api/email/welcome` - Send welcome emails
- `POST /api/email/test` - Send test emails
- `POST /api/email/verify` - Send verification emails

## Database Schema

The application uses MySQL with the following main tables:
- `users` - User accounts and authentication
- `vehicles` - Vehicle information and status
- `drivers` - Driver profiles and licenses
- `maintenance_records` - Maintenance history and scheduling
- `fuel_records` - Fuel consumption tracking
- `incidents` - Incident reports and tracking
- `notifications` - System notifications

## Email Configuration

The system uses Gmail SMTP for sending emails. To set up:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password for the application
3. Update the `.env` file with your Gmail credentials

## Multi-language Support

The application supports:
- English (en)
- Spanish (es) 
- French (fr)
- German (de)

Language files are located in `lib/i18n/locales/`.

## Multi-currency Support

Supported currencies:
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)
- JPY (Japanese Yen)
- CHF (Swiss Franc)
- CNY (Chinese Yuan)

## Docker Deployment

The application includes Docker configuration for easy deployment:

\`\`\`bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `node scripts/migrate.js` - Run database migrations
- `node scripts/test-email.js` - Test email configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
