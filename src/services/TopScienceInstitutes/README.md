# 🏛️ Top Science Institutes Service

A comprehensive service for managing scientific institutions, research facilities, and their integrations within the NovaSanctum ecosystem.

## Features

- **Scientific Institution Management**: CRUD operations for scientific institutions
- **Research Facilities**: Track and manage research laboratories and facilities
- **International Collaborations**: Manage research partnerships and collaborations
- **Nobel Prize Winners**: Track Nobel laureates and their affiliations
- **GameDin Integration**: Seamless integration with GameDin gaming platform
- **RESTful API**: Fully documented HTTP API for all operations
- **TypeScript Support**: Fully typed with comprehensive interfaces
- **Pagination & Filtering**: Advanced querying capabilities
- **Caching**: Built-in caching for improved performance
- **Logging**: Comprehensive logging with configurable levels
- **Error Handling**: Consistent error responses with proper status codes

## Installation

```bash
npm install @novasanctum/top-science-institutes
```

## Quick Start

```typescript
import { createTopScienceInstitutes } from '@novasanctum/top-science-institutes';

async function main() {
  // Initialize the service
  const service = await createTopScienceInstitutes({
    dataDir: './data',
    logLevel: 'info',
    enableApi: true,
    apiPort: 3000,
    gameDinApiKey: process.env.GAMEDIN_API_KEY
  });

  // Create a new institute
  const newInstitute = await service.createInstitute({
    name: 'Nova Sanctum Research Institute',
    type: 'research_center',
    country: 'Nova Sanctum',
    location: {
      city: 'Sanctum Prime',
      region: 'Core Systems'
    },
    specialties: ['Quantum Computing', 'AI Research'],
    established: 2025,
    staff: 150,
    students: 0,
    annualBudget: 50000000,
    ranking: 1,
    nobelPrizes: 3,
    researchAreas: ['Quantum Physics', 'Artificial Intelligence', 'Neuroscience'],
    internationalPartners: [],
    facilities: [],
    publications: 250,
    patents: 42,
    status: 'active',
    website: 'https://research.novasanctum.xyz',
    notes: 'Primary research facility for Nova Sanctum'
  });

  console.log('Created institute:', newInstitute);

  // List all institutes with pagination
  const { data: institutes } = await service.getInstitutes({
    page: 1,
    pageSize: 10,
    filters: {
      status: 'active',
      'location.region': 'Core Systems'
    },
    sort: [{ field: 'ranking', direction: 'asc' }]
  });

  console.log('Active institutes:', institutes);
}

main().catch(console.error);
```

## API Reference

### Institutes

#### `getInstitutes(options?: QueryOptions): Promise<PaginatedResponse<ScienceInstitute>>`

Retrieves a paginated list of scientific institutes.

**Parameters:**
- `options` (Optional): Query options
  - `page`: Page number (default: 1)
  - `pageSize`: Number of items per page (default: 10)
  - `filters`: Filter criteria
  - `sort`: Sorting criteria
  - `search`: Search term

**Returns:**
```typescript
{
  data: ScienceInstitute[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
```

#### `getInstitute(id: string): Promise<ScienceInstitute>`

Retrieves a single institute by ID.

**Parameters:**
- `id`: Institute ID

**Throws:**
- `NotFoundError` if institute is not found

#### `createInstitute(data: Omit<ScienceInstitute, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScienceInstitute>`

Creates a new scientific institute.

**Parameters:**
- `data`: Institute data

**Returns:** The created institute

#### `updateInstitute(id: string, data: Partial<ScienceInstitute>): Promise<ScienceInstitute>`

Updates an existing institute.

**Parameters:**
- `id`: Institute ID
- `data`: Partial institute data to update

**Returns:** The updated institute

**Throws:**
- `NotFoundError` if institute is not found

#### `deleteInstitute(id: string): Promise<void>`

Deletes an institute by ID.

**Parameters:**
- `id`: Institute ID

**Throws:**
- `NotFoundError` if institute is not found

### Similar methods exist for:
- Research Laboratories
- International Collaborations
- Nobel Prize Winners
- Research Facilities

## Configuration

### Default Configuration

```typescript
{
  dataDir: './data',
  cacheTtl: 300, // 5 minutes
  logLevel: 'info',
  enableApi: true,
  apiPort: 3000,
  gameDinApiKey: '',
  enableCaching: true,
  maxCacheItems: 1000,
  enableRequestLogging: true,
  enableErrorTracking: true,
  corsOptions: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
}
```

### Environment Variables

All configuration options can be overridden using environment variables:

- `DATA_DIR`: Data directory path
- `LOG_LEVEL`: Logging level (error, warn, info, debug, silly)
- `ENABLE_API`: Enable/disable the API server (true/false)
- `API_PORT`: Port for the API server
- `GAMEDIN_API_KEY`: API key for GameDin integration
- `CACHE_TTL`: Cache TTL in seconds
- `MAX_CACHE_ITEMS`: Maximum number of cache items
- `ENABLE_REQUEST_LOGGING`: Enable/disable request logging
- `ENABLE_ERROR_TRACKING`: Enable/disable error tracking
- `CORS_ORIGIN`: CORS origin (default: '*')
- `RATE_LIMIT_WINDOW_MS`: Rate limit window in milliseconds
- `RATE_LIMIT_MAX`: Maximum requests per window

## Error Handling

The service uses a consistent error handling pattern with the following error classes:

- `TopScienceInstitutesError`: Base error class
- `BadRequestError` (400): Invalid request
- `UnauthorizedError` (401): Authentication required
- `ForbiddenError` (403): Insufficient permissions
- `NotFoundError` (404): Resource not found
- `ConflictError` (409): Resource conflict
- `ValidationError` (422): Validation failed
- `RateLimitError` (429): Too many requests
- `InternalServerError` (500): Server error
- `ServiceUnavailableError` (503): Service unavailable

## Testing

Run the test suite:

```bash
npm test
```

## License

Proprietary - All rights reserved © 2025 NovaSanctum
