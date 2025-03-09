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

