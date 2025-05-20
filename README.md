# Bridge Sales MVP

## Overview

Bridge Sales MVP is a comprehensive front-end application for Tumaris food company, designed to facilitate communication between sales agents and administrators. The application focuses on order management functionalities with a clean, modern UI built using React, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**: Role-based access control (Admin/Agent)
- **Dashboard Analytics**: Visual representation of sales data
- **Order Management**: Create, view, filter, and update orders
- **Responsive Design**: Mobile-first approach for all device sizes
- **Notifications System**: Real-time notifications for important events
- **Dark/Light Mode**: Theme toggle for user preference

## Tech Stack

- **React 18+ with Vite**: For modern, fast development
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For utility-first styling
- **React Router v6**: For routing
- **Zustand**: For lightweight state management
- **React Query**: For data fetching, caching, and state management
- **React Hook Form**: For form validations
- **Lucide React**: For consistent iconography
- **date-fns**: For date manipulation
- **Mock Service Worker (MSW)**: For API mocking

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── common/         # Generic components (Button, Card, etc.)
│   ├── layout/         # Layout components (Sidebar, Header, etc.)
│   ├── orders/         # Order-specific components
│   └── ui/             # UI-specific components
├── pages/              # Application pages
│   ├── admin/          # Admin-specific pages
│   ├── agent/          # Agent-specific pages
│   ├── auth/           # Authentication pages
│   └── common/         # Shared pages
├── store/              # Zustand stores
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── routes/             # Route definitions
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/bridge-sales-mvp.git
   cd bridge-sales-mvp
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
```

## User Journeys

### Sales Agent
- Login to the system
- View personalized dashboard with their sales metrics
- Create new orders for stores
- View and filter their order history
- Receive notifications about order status changes

### Administrator
- Login to the system
- View comprehensive dashboard with all sales metrics
- View and manage all orders across agents
- Update order statuses
- Access analytics and reporting features

## Demo Credentials

- **Admin**: admin@bridge.com / password
- **Agent**: agent@bridge.com / password

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
