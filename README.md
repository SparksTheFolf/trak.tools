# Trak.tools - GTFS Transit Data Explorer

A Vue 3 + Vite application that makes MBTA transit data accessible and easy to explore without the complexity of working directly with GTFS APIs.

## Features

- **Route Explorer**: Browse all MBTA routes with interactive cards
- **Route Details**: View stops, vehicles, and real-time data for each route
- **JSON Viewer**: Developer-friendly raw data access with syntax highlighting
- **Responsive Design**: Mobile-first Bootstrap 5 interface
- **Real-time Data**: Live vehicle positions and service updates

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Configure your MBTA API key in `.env`:
   ```
   VITE_MBTA_API_KEY=your_api_key_here
   ```

   Get your free API key at: https://api-v3.mbta.com/

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Environment Variables

- `VITE_APP_ENV`: Set to `DEV` for development, `PROD` for production
- `VITE_MBTA_API_KEY`: Your MBTA API key (optional but recommended for higher rate limits)
- `VITE_MBTA_API_BASE_URL`: MBTA API base URL (defaults to https://api-v3.mbta.com)

## API Usage

The app uses the MBTA V3 API. While an API key is optional, it's recommended to avoid rate limiting:

- Without API key: 20 requests per minute
- With API key: 1000 requests per minute

## Tech Stack

- **Frontend**: Vue 3 with Composition API
- **Build Tool**: Vite
- **UI Framework**: Bootstrap 5
- **HTTP Client**: Axios
- **Routing**: Vue Router
- **Language**: TypeScript

## Project Structure

```
src/
├── components/          # Reusable Vue components
├── pages/              # Page components
├── services/           # API services
├── style.css          # Global styles
└── main.ts            # App entry point
```

## Contributing

This is an open-source project. Contributions are welcome!

## License

MIT License