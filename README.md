# LOGARG – Logical Argumentation Platform

Frontend–Backend Integrated System for Structured Debates

---

# 1. Overview

LOGARG is a structured debate and argumentation system that allows users to explore and build logical argument trees for various topics.

It connects a Spring Boot backend (with MySQL database) and an Angular frontend, supporting both:

- Real API mode (with live backend)
- Mock API mode (for demo without backend)

---

# 2. Features

- Turn-based debate between Proponent and Opponent
- Visualization of argument trees (claims, justifications, rebuttals)
- Move tracking (Challenge, Rebut, Accept, Skip)
- Mock API layer for offline demonstrations
- Backend connected to MySQL with structured schema

---

# 3. Backend (Spring Boot)

## 3.1 Tech Stack

- Spring Boot 3+
- Spring Data JPA
- MySQL
- Lombok
- Jakarta Persistence

---

## 3.2 How to Run the Backend

1. Open the project in IntelliJ or VS Code (Java)

2. Set MySQL credentials in application.properties

spring.datasource.url=jdbc:mysql://localhost:3306/logarg_db
spring.datasource.username=root
spring.datasource.password=your_password


3. Start MySQL server

4. Run the Spring Boot project

mvn spring-boot:run

5. Backend runs at

http://localhost:8080


---

# 4. Frontend (Angular)

## 4.1 Tech Stack

- Angular 17+
- TypeScript
- Bootstrap 5
- RxJS
- HTML / CSS

---

## 4.2 Key Components

|         Component              |       Description 
|--------------------------------|-----------------------------------------|
| home                           | Displays list of available topics 
| argument-view                  | Main debate area showing argument trees 
| argument-node                  | Recursive display of argument nodes 
| multi-select-dropdown          | Justification selection dropdown 
| move-tracker-box               | Displays allowed moves and timer 
| argument-info-box              | Shows argument details and sources 

---

## 4.3 How to Run the Frontend

Navigate to frontend folder

cd argument-ui
npm install
ng serve


Open browser

http://localhost:4200


---

# 5. Mock API Mode (Offline Demo)

The mock API allows the app to run without a backend.

---

## 5.1 Mock Data Location

src/assets/mock/

topics.json
top-arguments.json

arguments-by-topic/
Television.json
Social Media.json


---

## 5.2 Switch Between Mock and Backend

In app.config.ts

// Use Mock Service (default)
{ provide: ArgumentService, useClass: MockArgumentService }

// Use Backend
{ provide: ArgumentService, useClass: ArgumentService }
API Reference: See LOGARG Mock API Documentation.pdf


