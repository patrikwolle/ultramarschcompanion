# Ultramarsch Companion Repository

## Overview
**Ultramarsch Companion** is a web application built with Angular that allows users to track their own progress and compare with others in ultramarathon events.

## Project Details
- **Name**: ultramaschcompanion
- **Version**: 0.0.0
- **License**: MIT (see LICENSE file)
- **Framework**: Angular 19.2.0
- **TypeScript**: 5.7.2

## Technology Stack

### Frontend Framework
- **Angular**: 19.2.0 (core framework)
- **Angular Material**: 19.2.0 (UI components)
- **PrimeNG**: 19.0.10 (rich UI component library)
- **PrimeFlex**: 4.0.0 (CSS utility framework)
- **PrimeIcons**: 7.0.0 (icon library)

### Key Libraries
- **RxJS**: 7.8.0 (reactive programming)
- **Dexie**: 4.0.11 (IndexedDB wrapper for local storage)
- **Angular Service Worker**: 19.2.0 (PWA capabilities)

### Development Tools
- **Angular CLI**: 19.2.6
- **Karma**: 6.4.0 (test runner)
- **Jasmine**: 5.6.0 (testing framework)
- **TypeScript**: 5.7.2

## Project Structure

```
src/
├── app/
│   ├── services/           # Business logic services
│   │   ├── db.service.ts
│   │   ├── friends-store.service.ts
│   │   ├── local-storage.service.ts
│   │   ├── um-service.service.ts
│   │   ├── utils.service.ts
│   │   ├── dom-parser.service.ts
│   │   └── uploaded-files.service.ts
│   ├── components/         # Reusable UI components
│   │   ├── main/
│   │   └── friend/
│   ├── dialogs/           # Dialog components
│   │   ├── upload-dialog/
│   │   └── uploaded-files/
│   ├── interfaces/        # TypeScript interfaces
│   │   ├── participant.ts
│   │   └── processed-messages.ts
│   ├── models/            # Data models
│   │   └── friends.ts
│   ├── database/          # Database configuration
│   │   └── db.ts
│   ├── app.module.ts
│   ├── app.component.ts
│   └── app-routing.module.ts
├── main.ts                # Application entry point
├── index.html
├── styles.scss
└── colors.scss
```

## npm Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server (ng serve) |
| `npm run build` | Build for production with `/ultramarschcompanion/` base href |
| `npm run watch` | Build in watch mode for development |
| `npm test` | Run unit tests (Karma/Jasmine) |
| `npm run deploy` | Deploy to GitHub Pages using angular-cli-ghpages |

## Key Features

### Core Functionality
- **Progress Tracking**: Users can track their ultramarathon progress
- **Comparative Analysis**: Compare progress with other participants
- **File Upload**: Upload participant data for processing
- **Local Data Storage**: Uses Dexie (IndexedDB) and LocalStorage for data persistence
- **Progressive Web App**: Service worker enabled for offline support

### Services Overview
- **db.service**: Database operations and Dexie management
- **um-service**: Main business logic for ultramarathon tracking
- **local-storage.service**: LocalStorage operations
- **dom-parser.service**: DOM parsing and HTML processing
- **friends-store.service**: Friend/participant management
- **uploaded-files.service**: File upload handling
- **utils.service**: Utility functions

## Configuration Files

- **angular.json**: Angular CLI configuration
- **tsconfig.json**: TypeScript compiler options
- **tsconfig.app.json**: App-specific TypeScript config
- **tsconfig.spec.json**: Test-specific TypeScript config
- **ngsw-config.json**: Service Worker configuration
- **.editorconfig**: Editor configuration for code consistency
- **.gitignore**: Git ignore patterns

## Testing
- Unit tests written with **Jasmine**
- Test runner: **Karma**
- Coverage reporting available
- Test files: `*.spec.ts`

## Deployment
- Builds to `/dist/browser` directory
- Deploys to GitHub Pages using `angular-cli-ghpages`
- Base href configured as `/ultramarschcompanion/`

## Development Notes
- Project is configured as private
- TypeScript strict mode enabled
- Angular 19 with new control flow syntax support
- Material Design + PrimeNG for consistent UI
