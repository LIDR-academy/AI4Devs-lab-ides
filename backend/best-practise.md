# Backend Development Guidelines

## General Principles

- Follow Domain-Driven Design (DDD) principles
- Respect SOLID principles
- Use Hexagonal Architecture (ports and adapters)
- Structure code according to separation of concerns

## Project Structure

- `/src/domain`: Domain entities, repository interfaces, value objects
- `/src/application`: Application services and use cases
- `/src/infrastructure`: Concrete implementations (repositories, external services)
- `/src/presentation`: Controllers, middleware and routing
- `/src/tests`: Unit, integration and acceptance tests

## TypeScript Code Conventions

### Types and Interfaces

- Use interfaces to define contracts and types for simple objects
- Prefer type literals for simple enumerations, Enum for complex enumerations
- Use generics to create reusable components

### Naming

- Use PascalCase for classes, interfaces and types
- Use camelCase for variables, functions and methods
- Use UPPER_CASE for constants
- Prefix interfaces with `I` (e.g.: `ICandidate`)
- Suffix interface implementations with `Impl` (e.g.: `CandidateRepositoryImpl`)

### Code Style

- Use single quotes for strings
- Use template literals for string concatenation
- Prefer `const` and `let` over `var`
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Prefer arrow functions
- Use destructuring for objects and arrays

### Documentation and Comments

- Use JSDoc to document public functions and classes
- Write comments only when necessary to explain the "why", not the "what"
- Keep comments up-to-date with the code

## API Design

- Follow REST principles for APIs
- Use plural resource names (e.g.: `/candidates`)
- Use appropriate HTTP verbs (GET, POST, PUT, DELETE)
- Respect HTTP status code conventions (200, 201, 400, 404, 500)
- Implement pagination for resource collections
- Create consistent and predictable endpoints

## Database and Prisma

- Use migrations for database changes
- Keep the Prisma schema up-to-date
- Define explicit relationships between entities
- Use appropriate data types for fields
- Utilize indexes to improve performance

## Error Handling

- Use try/catch to handle exceptions
- Create custom errors for different types of problems
- Implement a centralized error handler
- Log errors appropriately
- Return consistent error responses

## Testing

- Write unit tests for domain services
- Implement integration tests for repositories
- Use end-to-end tests for important APIs
- Use mocks for external dependencies
- Maintain adequate test coverage (at least 80%)
- Use `.spec.ts` extension for test files

## Security

- Validate and sanitize all user inputs
- Implement rate limiting to prevent brute force attacks
- Use HTTPS for all communications
- Avoid exposing sensitive information in logs
- Follow OWASP guidelines to prevent common vulnerabilities

## Performance

- Optimize critical SQL queries
- Implement caching where appropriate
- Limit results for large collections
- Monitor API response times
- Perform stress tests for critical APIs
