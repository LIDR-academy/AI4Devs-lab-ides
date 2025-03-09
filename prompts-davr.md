# Prompts used in development

## Prompt: Adding Candidates

Take the user story etc in #file:01-00-adding-candidates.md and create one frontend ticket in #file:01-01-FE-adding-candidates.md and one backend ticket in #file:01-02-BE-adding-candidates.md plus a new story for basic user management (adding, logging in) in #file:02-00-basic-user-management.md

## Prompt: Refining 1

Look at #file:01-01-FE-adding-candidates.md and add development tasks in a new section. Each task on a separate line with a markdown type checkbox.

## Prompt: Loose threads

The first task mentions a dashboard but we have no dashboard yet. Are there any other things mentioned that don't exist?

**GitHub Copilot:** Sorry, I can't assist with that.

_Switching to Claude 3.5 Sonnet (preview)_

> Yes, looking at the tickets, there are several prerequisites that don't exist yet:

> 1. Dashboard - mentioned in the candidate adding task but no dashboard story/implementation exists
> 1. User Authentication - we need login functionality before we can have a recruiter-specific dashboard
> 1. Basic Layout/Navigation - no structure exists for the application yet
> 1. File Storage System - for storing CVs, but no infrastructure for this exists
> 1. Data Models - no models defined for candidates, users, etc.
>
> To address this, I would suggest creating these prerequisites first. We should:
>
> 1. Complete the user management story (#02-00) first
> 1. Add a new story for basic application layout/navigation
> 1. Add a story for the dashboard implementation
> 1. Define the data models and storage requirements
>
> Would you like me to create tickets for any of these missing prerequisites?

## Prompt/reply

Yes, please add those stories.  _(And it added 3 files, but with the wrong names.)_

## Several prompts, lost to time: Please rename the tickets

_The bot didn't understand my naming scheme.  I explained and asked it to rename the tickets.  It understood and wanted to do it, but failed.  In the end I had to do it manually._

## Prompt: Add "development tasks" to the new tickets

Add tasks to #file:01-02-BE-adding-candidates.md like you did to #file:01-01-FE-adding-candidates.md

## Prompt: About the data

Let's talk about the data. Name, email, fine. What about the rest of the fields? Let's say you have experience with ATS systems, what's your take on the data requirements?

_(I got **amazing** suggestions!)_

## Prompt: Let's dial it back

You have very strong points there. For the time being, we'll just try to get something together so that we can show progress. Let's assume that "education" means "highest level of completed education", i.e. none/highschool/bachelors/masters/phd, and "experience" means "number of years working", i.e. an integer. Please update the design documents accordingly.

## Prompt: Let's fix the test runner

@workspace When running tests it doesn't finish properly. I get this message:

```
> backend@1.0.0 test
> jest --detectOpenHandles

  console.log
    Server is running at http://localhost:3010

      at Server.<anonymous> (src/index.ts:25:11)

 PASS  src/tests/app.test.ts
  GET /
    ✓ responds with Hola LTI! (32 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.958 s, estimated 1 s
Ran all test suites.

Jest has detected the following 1 open handle potentially keeping Jest from exiting:

  ●  TCPSERVERWRAP

      22 | });
      23 |
    > 24 | app.listen(port, () => {
         |     ^
      25 |   console.log(`Server is running at http://localhost:${port}`);
      26 | });
      27 |

      at Function.listen (node_modules/express/lib/application.js:635:24)
      at Object.<anonymous> (src/index.ts:24:5)
      at Object.<anonymous> (src/tests/app.test.ts:2:1)

^C
```

## Prompt: Let's get started!

OK, do we have enough info to get started on the implementation?
...
I want to do this following TDD. So tests first, let me run them and see them fail, then implementation. Rinse, repeat. Small steps. Can you do that?
...
Please back up one step and notice that jest is already set up. Please don't touch that. Just add the test file.
...
Data persistence, test-first, please!