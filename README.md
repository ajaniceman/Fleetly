# Fleetly - Fleet Management System

A comprehensive fleet management system built with Next.js, TypeScript, and MySQL.

## Features

- **Vehicle Management**: Track vehicles, maintenance, and status
- **Driver Management**: Manage driver information and assignments
- **Maintenance Tracking**: Schedule and track vehicle maintenance
- **Fuel Management**: Monitor fuel consumption and costs
- **Incident Reporting**: Track and manage fleet incidents
- **Multi-language Support**: English, Spanish, French, German
- **Multi-currency Support**: USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY
- **Email Notifications**: Automated alerts for maintenance and license expiry
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MySQL 8.0
- **Authentication**: JWT
- **Email**: Nodemailer with Gmail
- **UI Components**: Radix UI, shadcn/ui
- **Deployment**: Docker, Docker Compose

## Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- Gmail account with App Password (for email notifications)

## Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd fleetly-dashboard
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Environment Setup

Copy the example environment file and configure it:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your configuration:

\`\`\`env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=fleetly
DB_USER=fleetly_user
DB_PASSWORD=fleetly_pass_2024
DB_ROOT_PASSWORD=fleetly_root_2024

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Email Configuration (Gmail)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
FROM_NAME=Fleetly System

# Application Configuration
APP_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

### 4. Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account settings → Security → App passwords
3. Generate a new app password for "Mail"
4. Use this 16-character password in `GMAIL_APP_PASSWORD`

### 5. Database Setup

#### Option A: Using Docker (Recommended)

\`\`\`bash
# Start the database
docker-compose up mysql -d

# Wait for MySQL to be ready, then run migrations
npm run migrate
\`\`\`

#### Option B: Local MySQL

1. Create a MySQL database named `fleetly`
2. Create a user with appropriate permissions
3. Run the migration script:

\`\`\`bash
npm run migrate
\`\`\`

### 6. Test Email Configuration

\`\`\`bash
npm run test-email
\`\`\`

### 7. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to access the application.

## Docker Deployment

### Full Stack with Docker Compose

\`\`\`bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
\`\`\`

This will start:
- MySQL database on port 3306
- Next.js application on port 3000
- Redis cache on port 6379

### Environment Variables for Docker

Create a `.env` file in the project root:

\`\`\`env
DB_NAME=fleetly
DB_USER=fleetly_user
DB_PASSWORD=fleetly_pass_2024
DB_ROOT_PASSWORD=fleetly_root_2024
JWT_SECRET=your-super-secret-jwt-key-change-in-production
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
\`\`\`

## Project Structure

\`\`\`
fleetly-dashboard/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── vehicles/          # Vehicle management
│   ├── drivers/           # Driver management
│   ├── maintenance/       # Maintenance tracking
│   ├── fuel/             # Fuel management
│   └── ...
├── components/            # React components
│   ├── layout/           # Layout components
│   └── ui/               # UI components (shadcn/ui)
├── lib/                  # Utilities and services
│   ├── services/         # Business logic services
│   ├── database/         # Database connection
│   └── i18n/            # Internationalization
├── database/             # Database schema and migrations
├── scripts/              # Utility scripts
└── docker-compose.yml    # Docker configuration
\`\`\`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run test-email` - Test email configuration
- `npm run lint` - Run ESLint

## Features Overview

### Vehicle Management
- Add, edit, and delete vehicles
- Track vehicle status (active, maintenance, inactive)
- Monitor mileage and maintenance schedules
- Vehicle assignment to drivers

### Driver Management
- Manage driver profiles and contact information
- Track license expiration dates
- Driver-vehicle assignments
- License expiry notifications

### Maintenance Tracking
- Schedule preventive maintenance
- Track repair history and costs
- Maintenance reminders and alerts
- Service provider management

### Fuel Management
- Record fuel purchases and consumption
- Track fuel efficiency metrics
- Cost analysis and reporting
- Location-based fuel tracking

### Reporting
- Vehicle utilization reports
- Maintenance cost analysis
- Fuel consumption reports
- Driver performance metrics

### Multi-language Support
- English, Spanish, French, German
- Easy to add new languages
- Dynamic language switching

### Multi-currency Support
- Support for major currencies
- Real-time exchange rates
- Automatic currency conversion

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Vehicles
- `GET /api/vehicles` - List all vehicles
- `POST /api/vehicles` - Create new vehicle
- `GET /api/vehicles/[id]` - Get vehicle details
- `PUT /api/vehicles/[id]` - Update vehicle
- `DELETE /api/vehicles/[id]` - Delete vehicle

### Email Notifications
- `POST /api/email/maintenance-reminder` - Send maintenance reminder
- `POST /api/email/license-expiry` - Send license expiry alert
- `POST /api/email/welcome` - Send welcome email
- `POST /api/email/test` - Send test email

## Database Schema

The application uses MySQL with the following main tables:

- `users` - User accounts and authentication
- `vehicles` - Vehicle information and status
- `drivers` - Driver profiles and licenses
- `vehicle_assignments` - Driver-vehicle assignments
- `maintenance_records` - Maintenance history
- `fuel_records` - Fuel consumption data
- `incidents` - Incident reports
- `notifications` - System notifications

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the example environment configuration

## Roadmap

- [ ] Mobile app integration
- [ ] GPS tracking integration
- [ ] Advanced analytics dashboard
- [ ] Integration with third-party APIs
- [ ] Automated backup system
- [ ] Role-based permissions
- [ ] Audit logging
- [ ] API rate limiting
- [ ] Advanced reporting features
- [ ] Integration with accounting systems
