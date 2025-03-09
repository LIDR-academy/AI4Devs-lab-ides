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

# Frontend Development Guidelines

## General Principles

- Follow **Component-Driven Development** (CDD) principles.
- Emphasize **reusability** and **modularity**.
- Maintain **separation of concerns** between logic, presentation, and styling.
- Prioritize **user experience (UX)** and **accessibility (a11y)**.
- Focus on **responsive design** and **cross-browser compatibility**.

## Project Structure

- `/src/components`: Reusable UI components (e.g., Buttons, Input Fields, Modals).
- `/src/containers`: Page-level components that manage layout and state.
- `/src/hooks`: Custom hooks for shared logic.
- `/src/services`: API calls and business logic (e.g., fetch data, authentication).
- `/src/utils`: Helper functions and utilities.
- `/src/styles`: Global styles, CSS variables, or SCSS.
- `/src/tests`: Unit, integration, and end-to-end tests.

## TypeScript Code Conventions

### Types and Interfaces

- Use **interfaces** to define component props, state, and service contracts.
- **Enums** should be used for fixed sets of values.
- Use **type literals** for simple data structures, **interfaces** for complex types.
- Use **generics** for reusable and type-safe components and functions.

### Naming

- Use **PascalCase** for components, types, and interfaces (e.g., `UserProfile`, `ButtonProps`).
- Use **camelCase** for variables, methods, and function names (e.g., `handleClick`, `getUserData`).
- **UPPER_CASE** for constants (e.g., `MAX_LIMIT`).
- Prefix interfaces with `I` (e.g., `IUserProfile`).

### Code Style

- Use **single quotes** for strings.
- Prefer **template literals** for string interpolation and concatenation.
- Prefer **const** and **let** over **var**.
- Use **optional chaining** (`?.`) and **nullish coalescing** (`??`).
- Prefer **arrow functions** for concise syntax.
- Use **destructuring** for objects and arrays.
- Maintain proper **indention** (2 spaces recommended).
- Use **fat arrow** (`=>`) for functions to maintain lexical scoping.

## React Best Practices

### Component Structure

- Follow **functional components** with **hooks** for state management and side effects.
- Split **UI components** from **container components** to maintain clean separation of concerns.
- Use **React Context API** for global state management (if necessary).
- Use **PropTypes** or **TypeScript interfaces** for strongly typed props.
- Use **useEffect** and **useMemo** hooks efficiently to avoid unnecessary re-renders.

### State Management

- Use **React's built-in hooks** like `useState` and `useReducer` for local state management.
- For larger applications, consider using **state management libraries** like Redux, Zustand, or Recoil.
- Ensure **minimal state** in components and **prop drilling** is avoided as much as possible.

### Styling

- Prefer **CSS-in-JS** solutions like **styled-components** or **emotion** for scoped and dynamic styling.
- For larger applications, consider **CSS Modules** or **Sass/SCSS** for better styling organization.
- Use **CSS Variables** for managing colors, fonts, and breakpoints globally.
- Follow **BEM (Block, Element, Modifier)** methodology if using plain CSS.

## JavaScript and React-Specific Best Practices

- **ESLint** and **Prettier** should be configured for consistent formatting and quality.
- Always use **async/await** for asynchronous operations rather than callbacks or `.then()`.
- Avoid **direct DOM manipulation** in React; rely on **React's rendering system**.
- Keep **side-effects** to a minimum within components. Use the **useEffect hook** to handle side effects.
- Use **memoization** (`useMemo`, `React.memo`) to optimize expensive computations or components that don't need re-rendering.
- Use **event delegation** to improve performance for large lists or dynamic components.
- Optimize **images and media files** for faster loading and better performance.

## Testing

- Write **unit tests** for individual components and utilities.
- Use **Jest** for unit and integration tests, and **React Testing Library** for testing React components.
- For end-to-end testing, consider **Cypress** or **Playwright**.
- Aim for **80%+ test coverage** across components and utilities.

## Performance Optimization

- Use **lazy loading** and **code splitting** with **React.lazy** and **Suspense**.
- Optimize **images** by using **next-gen formats** (e.g., WebP) and responsive images.
- Use **debouncing** and **throttling** for input fields and search functions.
- Minimize the use of **inline styles** and **reflows** in the DOM.
- **Memoize** expensive functions and components to avoid unnecessary re-renders.
- Use **Web Workers** for offloading heavy computations, if necessary.
- Optimize **bundle size** using **Webpack** and **tree-shaking**.

## Security

- **Sanitize** and **validate** user inputs to prevent XSS and injection attacks.
- Avoid **inline JavaScript** and use **external scripts** when possible.
- Use **HTTPS** for secure communication.
- Follow **OWASP guidelines** to avoid common vulnerabilities like CSRF and CORS issues.
- Set **Content Security Policy (CSP)** headers appropriately.

## Accessibility (a11y)

- Use **semantic HTML** elements (e.g., `<button>`, `<header>`, `<section>`).
- Ensure all interactive elements are **keyboard accessible**.
- Provide **alt text** for images and **descriptive labels** for form elements.
- Use **aria-labels** and **aria-live** regions for dynamic content.
- Ensure good **color contrast** for readability.
- Test with **screen readers** and other accessibility tools.

## Documentation and Comments

- Document **components**, **hooks**, and **utilities** using **JSDoc** or **TypeScript doc comments**.
- Write **clear commit messages** for all changes.
- Keep **README** and **changelog** up-to-date.
- Avoid redundant comments. Write them only when the logic is not self-explanatory.
