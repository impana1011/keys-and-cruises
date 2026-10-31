# Keys And Cruises

Create a rough, functional frontend prototype for a vehicle rental website called DriveEase.

IMPORTANT: Minimize credit usage

I want a basic first version that I can improve manually later. Do not spend time on visual polish, elaborate styling, animations, or repeated redesigns.

Build the minimum viable frontend in one focused pass. Prioritize working page layouts, navigation, and basic interactions over appearance.

Technology

React + Vite + TypeScript

Tailwind CSS

React Router

Lucide icons if already available

Frontend only

I will build the backend manually using Java 21, Spring Boot, and MySQL in VS Code.

Do not create a backend, database, SQL schema, Supabase project, Firebase integration, or any hosted backend service.

Use simple mock data stored in local TypeScript files. Keep the service layer separate so I can connect my REST API later.

Design

Use a basic, clean layout:

White background.

Simple dark text.

One blue accent color.

Basic borders and spacing.

Simple responsive layouts.

Standard buttons, forms, tables, and cards.

Do not use elaborate hero animations, complex image galleries, excessive gradients, advanced effects, or unnecessary decorative elements. Use simple placeholder blocks or a small number of vehicle images.

Create these routes

/ — Home page with navbar, heading, basic vehicle search form, featured vehicles and footer.

/vehicles — Vehicle listing with search, category filter, price and View Details buttons.

/vehicles/:id — Vehicle details with specifications, rental price, date selection and booking button.

/login — Basic login form.

/register — Basic registration form.

/booking/:vehicleId — Booking summary, dates, price calculation and confirmation button.

/booking-confirmation/:id — Demo booking confirmation.

/my-bookings — List of mock customer bookings.

/admin — Basic admin dashboard with vehicle and booking summaries.

/admin/vehicles — Simple vehicle management table and add/edit form.

/admin/bookings — Simple booking management table.

* — Basic not-found page.

Functional requirements

All routes must render and navigation must work.

Display at least six sample vehicles, including cars and bikes.

Vehicle search and category filtering should work.

Vehicle detail links must open the correct vehicle.

Validate pickup and return dates.

Calculate the estimated rental price.

Allow a simulated booking flow.

Include basic mock login and registration interfaces without claiming real authentication.

Admin pages should display mock data.

Every visible button should have a meaningful basic action.

Show a message when an action is simulated rather than processed by a real backend.

Code structure

Use a small, straightforward folder structure:

src/components

src/pages

src/data

src/services

src/types

Create reusable Navbar, Footer, VehicleCard and BookingSummary components.

Define basic TypeScript types for Vehicle and Booking. Keep mock data separate from components.

Prepare a centralized API service placeholder for future Spring Boot integration, but do not implement or call a real backend.

Execution rules

Generate the entire basic prototype in one pass.

Prefer simple, short components over elaborate abstractions.

Do not repeatedly redesign or regenerate working pages.

Do not add optional features beyond this scope.

Do not spend credits on visual refinements.

Fix obvious compilation errors and missing imports.

Run the production build if available and report any remaining errors honestly.

If you cannot finish everything, prioritize a working homepage, vehicle listing, vehicle details and booking flow.

Deliver a simple working prototype, not a finished commercial design. I will manually improve the UI, add features and connect the Java backend later.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/eb9c1063-4f78-59dc-8e79-6059efa863f4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
