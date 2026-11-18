# DriveEase – Vehicle Rental Website

**DriveEase** is a full-stack vehicle rental web application that provides a convenient platform for users to explore vehicles, book cars and bikes, and manage their rental activities.

The application is developed using React, Vite, TypeScript, and Tailwind CSS for the frontend, with Java 21 and Spring Boot powering the backend. MySQL is used for database management and persistent storage.

DriveEase aims to simplify the vehicle rental process through an easy-to-use interface, efficient booking management, and centralized vehicle administration.

## Features

### User Features
- Browse available cars and bikes.
- Search vehicles by name.
- Filter vehicles by category.
- View detailed vehicle specifications and rental prices.
- Check vehicle availability.
- Select pickup and return dates.
- Calculate estimated rental costs.
- Book vehicles through the booking interface.
- View booking confirmation and booking details.
- Register and log in through the user authentication interface.
- View personal booking history.

### Admin Features
- Admin dashboard with vehicle and booking summaries.
- View and manage vehicle information.
- Add new vehicles.
- Update existing vehicle details.
- Remove vehicle records.
- View customer booking records.
- Manage and monitor rental bookings.

### General Features
- Responsive user interface.
- Navigation across application pages.
- Reusable React components.
- Form validation.
- REST API integration between frontend and backend.
- MySQL database for persistent data storage.
- Centralized service layer for API communication.
- Structured backend architecture using Spring Boot.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend library |
| Vite | Frontend development and build tool |
| TypeScript | Type safety |
| Tailwind CSS | Frontend styling |
| React Router | Client-side navigation |
| Lucide React | Icons |
| Java 21 | Backend programming language |
| Spring Boot | Backend framework |
| Spring Data JPA | Database access and persistence |
| Hibernate | Object-relational mapping |
| MySQL | Relational database |
| Maven | Backend dependency management |

## Application Routes

| Route | Description |
|---|---|
| `/` | Homepage with featured vehicles and search |
| `/vehicles` | Vehicle listing and filtering |
| `/vehicles/:id` | Vehicle details |
| `/login` | User login |
| `/register` | User registration |
| `/booking/:vehicleId` | Booking summary and price calculation |
| `/booking-confirmation/:id` | Booking confirmation |
| `/my-bookings` | Customer booking history |
| `/admin` | Admin dashboard |
| `/admin/vehicles` | Vehicle management |
| `/admin/bookings` | Booking management |
| `*` | Not-found page |

## System Architecture

DriveEase follows a frontend-backend architecture in which the React frontend communicates with the Spring Boot backend through REST APIs.

```text
       React + TypeScript
          Frontend
              |
              |
        REST API Calls
          HTTP / JSON
              |
              |
       Spring Boot Backend
          (Java 21)
              |
              |
       Spring Data JPA
          Hibernate
              |
              |
          MySQL
          Database
```

### Architecture Components

- **Frontend:** Provides the user interface for vehicle browsing, searching, booking, authentication, and administration.
- **Backend:** Handles business logic, REST API endpoints, authentication, vehicle operations, and booking management.
- **Database:** MySQL stores application data such as vehicles, users, and bookings.
- **API Communication:** REST APIs enable communication between the frontend and backend.

## Project Structure

The project is organized into frontend and backend components.

### Frontend Structure

```text
DriveEase/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── VehicleCard.tsx
│   │   └── BookingSummary.tsx
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Vehicles.tsx
│   │   ├── VehicleDetails.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Booking.tsx
│   │   ├── BookingConfirmation.tsx
│   │   ├── MyBookings.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminVehicles.tsx
│   │   ├── AdminBookings.tsx
│   │   └── NotFound.tsx
│   │
│   ├── data/
│   │   ├── vehicles.ts
│   │   └── bookings.ts
│   │
│   ├── services/
│   │   └── api.ts
│   │
│   ├── types/
│   │   ├── Vehicle.ts
│   │   └── Booking.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

*Note: The above represents the frontend organization. The backend may be maintained in a separate project or repository.*

## Getting Started

### Prerequisites

Install the following tools before running the application:

- Node.js (LTS version recommended)
- npm
- Java Development Kit (JDK 21)
- Maven
- MySQL Server
- MySQL Workbench (optional)
- Visual Studio Code or IntelliJ IDEA

## Frontend Setup

### 1. Clone the Repository

```bash
git clone https://github.com/impana1011/keys-and-cruises.git
```

### 2. Navigate to the Project Directory

```bash
cd keys-and-cruises
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Frontend Development Server

```bash
npm run dev
```

The Vite development server will generally be available at:

```text
http://localhost:5173
```

Open the URL in your browser to access the DriveEase frontend.

### 5. Create a Production Build

```bash
npm run build
```

### 6. Preview the Production Build

```bash
npm run preview
```

## Backend Setup

### 1. Open the Spring Boot Project

Open the backend project directory in VS Code or IntelliJ IDEA.

### 2. Configure MySQL

Ensure the MySQL server is running and configure the database connection in the backend's `application.properties` or `application.yml` file.

Example configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/driveease
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Replace the example credentials and database name with your actual configuration.

### 3. Install Backend Dependencies

For Maven-based projects:

```bash
mvn clean install
```

### 4. Run the Spring Boot Application

```bash
mvn spring-boot:run
```

The backend will generally run at:

```text
http://localhost:8080
```

The actual port depends on the backend configuration.

## Running the Full-Stack Application

To run DriveEase locally:

1. Start the MySQL database server.
2. Start the Spring Boot backend.
3. Start the React frontend using `npm run dev`.
4. Open the frontend URL in your browser.
5. Ensure the frontend API configuration points to the correct backend URL.

Both frontend and backend should be running for API-dependent functionality to work.

## Booking Workflow

1. Open the DriveEase homepage.
2. Browse available cars and bikes.
3. Search or filter vehicles based on category.
4. Select a vehicle to view its details.
5. Check vehicle availability.
6. Select pickup and return dates.
7. Review the estimated rental price.
8. Proceed to the booking page.
9. Confirm the booking.
10. View the booking confirmation.
11. Access booking information through My Bookings.

## Database Management

DriveEase uses MySQL as its relational database.

The database is used to manage application information, including:

- Vehicle details and availability.
- Customer information.
- User account information.
- Rental booking records.
- Booking dates and pricing information.

Spring Data JPA and Hibernate are used for database interaction through the Spring Boot backend.

## API Integration

The frontend communicates with the backend using REST APIs.

The frontend service layer centralizes API requests, making it easier to maintain communication between the React application and Spring Boot services.

Typical API operations include:

- Retrieving available vehicles.
- Searching and filtering vehicles.
- Retrieving individual vehicle details.
- Registering and authenticating users.
- Creating rental bookings.
- Retrieving customer booking history.
- Managing vehicles through admin operations.
- Managing customer bookings.

*The actual API endpoints and request formats depend on the backend implementation.*

## Future Enhancements

- Online payment gateway integration.
- Advanced vehicle availability management.
- Improved booking cancellation and modification.
- Enhanced admin analytics and reporting.
- Customer reviews and vehicle ratings.
- Email notifications for booking confirmations.
- Improved security and role-based access control.

## Project Status

**Version:** 1.0 – Full-Stack Vehicle Rental Application

DriveEase is developed as a full-stack vehicle rental platform using React, TypeScript, Java 21, Spring Boot, and MySQL.

The application brings together vehicle browsing, rental booking, customer management, and administrative functionality through a frontend and backend architecture.



---

**DriveEase – Making Every Journey Easier.**
