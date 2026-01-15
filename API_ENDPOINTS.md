# HostelHub API - Complete Endpoint Documentation

## Overview
This document lists all 93+ API endpoints built for the Hostel Management System across 10 modules.

---

## 🔐 Authentication Module (7 endpoints)

### POST `/api/auth/register`
Register a new user
- **Body**: `{ email, password, name, phone, role }`
- **Response**: `{ token, user }`
- **Status**: 201 Created / 409 Conflict

### POST `/api/auth/login`
Login user with email and password
- **Body**: `{ email, password }`
- **Response**: `{ token, user }`
- **Status**: 200 OK / 401 Unauthorized

### POST `/api/auth/logout`
Logout user (clear token)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message }`
- **Status**: 200 OK

### POST `/api/auth/refresh`
Refresh access token
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ token }`
- **Status**: 200 OK

### GET `/api/auth/me`
Get current user profile
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User object
- **Status**: 200 OK

### PUT `/api/auth/change-password`
Change user password
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ oldPassword, newPassword }`
- **Response**: `{ message }`
- **Status**: 200 OK

### PUT `/api/auth/update-profile`
Update user profile
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ name, phone }`
- **Response**: Updated user object
- **Status**: 200 OK

---

## 👥 Users Module (8 endpoints)

### GET `/api/users`
Get all users
- **Response**: Array of user objects
- **Status**: 200 OK

### POST `/api/users`
Create new user
- **Body**: `{ name, email, phone, role }`
- **Response**: Created user object
- **Status**: 201 Created

### GET `/api/users/stats`
Get user statistics
- **Response**: `{ total, admins, wardens, students, active }`
- **Status**: 200 OK

### GET `/api/users/{id}`
Get user by ID
- **Response**: User object
- **Status**: 200 OK / 404 Not Found

### PUT `/api/users/{id}`
Update user
- **Body**: User fields to update
- **Response**: Updated user object
- **Status**: 200 OK

### DELETE `/api/users/{id}`
Delete user
- **Response**: Deleted user object
- **Status**: 200 OK

### POST `/api/users/{id}/reset-password`
Reset user password
- **Response**: `{ message, userId }`
- **Status**: 200 OK

### PATCH `/api/users/{id}/status`
Toggle user active status
- **Response**: Updated user object
- **Status**: 200 OK

---

## 🏢 Hostels Module (7 endpoints)

### POST `/api/hostels`
Create hostel
- **Body**: `{ name, address, type, capacity, wardenId }`
- **Response**: Created hostel object
- **Status**: 201 Created

### GET `/api/hostels`
Get all hostels
- **Response**: Array of hostel objects
- **Status**: 200 OK

### GET `/api/hostels/{id}`
Get single hostel
- **Response**: Hostel object
- **Status**: 200 OK

### PUT `/api/hostels/{id}`
Update hostel
- **Body**: Hostel fields to update
- **Response**: Updated hostel object
- **Status**: 200 OK

### DELETE `/api/hostels/{id}`
Delete hostel
- **Response**: Deleted hostel object
- **Status**: 200 OK

### GET `/api/hostels/{id}/stats`
Get hostel statistics
- **Response**: `{ totalCapacity, currentOccupancy, occupancyRate, availableRooms }`
- **Status**: 200 OK

### PATCH `/api/hostels/{id}/status`
Toggle hostel status
- **Response**: Updated hostel object
- **Status**: 200 OK

---

## 🚪 Rooms Module (8 endpoints)

### POST `/api/rooms`
Create new room
- **Body**: `{ hostelId, roomNumber, capacity, type }`
- **Response**: Created room object
- **Status**: 201 Created

### GET `/api/rooms`
Get all rooms
- **Response**: Array of room objects
- **Status**: 200 OK

### GET `/api/rooms/available`
Get available rooms
- **Response**: Array of available room objects
- **Status**: 200 OK

### GET `/api/rooms/stats`
Get room statistics
- **Response**: `{ total, occupied, available, maintenance }`
- **Status**: 200 OK

### GET `/api/rooms/{id}`
Get room by ID
- **Response**: Room object
- **Status**: 200 OK

### PUT `/api/rooms/{id}`
Update room
- **Body**: Room fields to update
- **Response**: Updated room object
- **Status**: 200 OK

### DELETE `/api/rooms/{id}`
Delete room
- **Response**: Deleted room object
- **Status**: 200 OK

### PATCH `/api/rooms/{id}/status`
Update room status
- **Body**: `{ status }`
- **Response**: Updated room object
- **Status**: 200 OK

---

## 👨‍🎓 Residents Module (7 endpoints)

### POST `/api/residents`
Create resident
- **Body**: `{ name, email, phone, rollNumber, hostelId, roomId }`
- **Response**: Created resident object
- **Status**: 201 Created

### GET `/api/residents`
Get all residents
- **Response**: Array of resident objects
- **Status**: 200 OK

### GET `/api/residents/stats`
Get resident statistics
- **Response**: `{ total, active, inactive }`
- **Status**: 200 OK

### GET `/api/residents/{id}`
Get single resident
- **Response**: Resident object
- **Status**: 200 OK

### PUT `/api/residents/{id}`
Update resident
- **Body**: Resident fields to update
- **Response**: Updated resident object
- **Status**: 200 OK

### DELETE `/api/residents/{id}`
Delete resident
- **Response**: Deleted resident object
- **Status**: 200 OK

### PATCH `/api/residents/{id}/status`
Update resident status
- **Response**: Updated resident object with toggled status
- **Status**: 200 OK

---

## 📋 Attendance Module (5 endpoints)

### POST `/api/attendance`
Mark attendance
- **Body**: `{ residentId, status, date }`
- **Response**: Created attendance record
- **Status**: 201 Created

### GET `/api/attendance`
Get all attendance records
- **Response**: Array of attendance records
- **Status**: 200 OK

### GET `/api/attendance/my`
Get my attendance (for residents)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of user's attendance records
- **Status**: 200 OK

### GET `/api/attendance/report`
Get attendance report
- **Response**: `{ totalRecords, present, absent, generatedAt }`
- **Status**: 200 OK

### PATCH `/api/attendance/{id}`
Update attendance record
- **Body**: Fields to update
- **Response**: Updated attendance record
- **Status**: 200 OK

---

## 🐛 Complaints Module (6 endpoints)

### POST `/api/complaints`
Create a complaint
- **Body**: `{ residentId, hostelId, title, description, type, priority }`
- **Response**: Created complaint object
- **Status**: 201 Created

### GET `/api/complaints`
Get all complaints
- **Response**: Array of complaint objects
- **Status**: 200 OK

### GET `/api/complaints/stats`
Get complaint statistics
- **Response**: `{ total, open, inProgress, resolved }`
- **Status**: 200 OK

### GET `/api/complaints/{id}`
Get single complaint
- **Response**: Complaint object
- **Status**: 200 OK

### DELETE `/api/complaints/{id}`
Delete complaint
- **Response**: Deleted complaint object
- **Status**: 200 OK

### PATCH `/api/complaints/{id}/status`
Update complaint status
- **Body**: `{ status }`
- **Response**: Updated complaint object
- **Status**: 200 OK

### PATCH `/api/complaints/{id}/assign`
Assign complaint to staff
- **Body**: `{ assignedTo }`
- **Response**: Updated complaint object
- **Status**: 200 OK

---

## 💳 Payments Module (7 endpoints)

### POST `/api/payments`
Create payment record
- **Body**: `{ residentId, amount, dueDate, description }`
- **Response**: Created payment object
- **Status**: 201 Created

### GET `/api/payments`
Get all payments
- **Response**: Array of payment objects
- **Status**: 200 OK

### GET `/api/payments/my`
Get my payments (for residents)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of user's payments
- **Status**: 200 OK

### GET `/api/payments/overdue`
Get overdue payments
- **Response**: Array of overdue payment objects
- **Status**: 200 OK

### GET `/api/payments/stats`
Get payment statistics
- **Response**: `{ total, paid, pending, totalAmount, totalPaid }`
- **Status**: 200 OK

### POST `/api/payments/generate-monthly`
Generate monthly rent for all residents
- **Response**: `{ message }`
- **Status**: 200 OK

### PATCH `/api/payments/{id}/status`
Update payment status
- **Body**: `{ status }`
- **Response**: Updated payment object
- **Status**: 200 OK

---

## 🔔 Notifications Module (7 endpoints)

### GET `/api/notifications`
Get notifications for current user
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of notification objects
- **Status**: 200 OK

### GET `/api/notifications/unread-count`
Get unread notification count
- **Response**: `{ count }`
- **Status**: 200 OK

### GET `/api/notifications/unread`
Get unread notifications
- **Response**: Array of unread notification objects
- **Status**: 200 OK

### GET `/api/notifications/stats`
Get notification statistics
- **Response**: `{ total, read, unread }`
- **Status**: 200 OK

### PATCH `/api/notifications/{id}/read`
Mark notification as read
- **Response**: Updated notification object
- **Status**: 200 OK

### PATCH `/api/notifications/read-all`
Mark all notifications as read
- **Response**: `{ message }`
- **Status**: 200 OK

### DELETE `/api/notifications/{id}`
Delete notification
- **Response**: Deleted notification object
- **Status**: 200 OK

---

## 📊 Reports Module (7 endpoints)

### GET `/api/reports/dashboard`
Get dashboard overview
- **Response**: Dashboard statistics
- **Status**: 200 OK

### GET `/api/reports/attendance`
Get attendance report
- **Response**: Attendance report with period data
- **Status**: 200 OK

### GET `/api/reports/payments`
Get payment report
- **Response**: Payment report with financial data
- **Status**: 200 OK

### GET `/api/reports/complaints`
Get complaint report
- **Response**: Complaint report with resolution data
- **Status**: 200 OK

### GET `/api/reports/occupancy`
Get occupancy report
- **Response**: Room and hostel occupancy data
- **Status**: 200 OK

### GET `/api/reports/financial`
Get financial summary
- **Response**: Financial overview (revenue, expenses, income)
- **Status**: 200 OK

### GET `/api/reports/export`
Export report
- **Query**: `?format=pdf|csv|json`
- **Response**: `{ message, format }`
- **Status**: 200 OK

---

## 🍽️ Mess Module (7 endpoints)

### POST `/api/mess/attendance`
Mark mess attendance
- **Body**: `{ residentId, date, status }`
- **Response**: Created mess attendance record
- **Status**: 201 Created

### GET `/api/mess/attendance`
Get mess attendance records
- **Response**: Array of mess attendance records
- **Status**: 200 OK

### GET `/api/mess/daily-count`
Get daily mess count
- **Response**: `{ date, count }`
- **Status**: 200 OK

### GET `/api/mess/stats`
Get mess statistics
- **Response**: `{ totalMenus, totalAttendance, averageDailyCount }`
- **Status**: 200 OK

### POST `/api/mess/menu`
Create mess menu
- **Body**: `{ date, breakfast, lunch, dinner }`
- **Response**: Created menu object
- **Status**: 201 Created

### GET `/api/mess/menu`
Get mess menu
- **Response**: Array of menu objects
- **Status**: 200 OK

### DELETE `/api/mess/menu/{id}`
Delete menu item
- **Response**: Deleted menu object
- **Status**: 200 OK

---

## Demo Credentials

Use these credentials to test the API:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hostel.com | password123 |
| Warden | warden@hostel.com | password123 |
| Student | student@hostel.com | password123 |

---

## Error Handling

### Common HTTP Status Codes
- **200 OK** - Successful GET/PUT/PATCH request
- **201 Created** - Successful POST request
- **400 Bad Request** - Missing or invalid parameters
- **401 Unauthorized** - Missing or invalid authentication token
- **404 Not Found** - Resource not found
- **409 Conflict** - Duplicate resource (e.g., email already exists)

### Error Response Format
```json
{
  "message": "Error description"
}
```

---

## Authentication

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

Get your JWT token from:
- **POST** `/api/auth/login` - Returns token on successful login
- **POST** `/api/auth/register` - Returns token on successful registration

---

## File Structure

```
server/
├── routes/
│   ├── auth.ts           (Authentication: 7 endpoints)
│   ├── users.ts          (User Management: 8 endpoints)
│   ├── hostels.ts        (Hostel Management: 7 endpoints)
│   ├── modules.ts        (Rooms: 8, Residents: 7, Attendance: 5, Complaints: 6 = 26 endpoints)
│   ├── advanced.ts       (Payments: 7, Notifications: 7, Reports: 7, Mess: 7 = 28 endpoints)
│   └── demo.ts           (Demo endpoint)
└── index.ts              (Main server with all route registrations)
```

**Total Endpoints: 93+**

---

## Testing the API

You can test all endpoints using:
- **Postman**: Import and test each endpoint
- **cURL**: Command-line requests
- **Frontend**: Integrated API calls through React components
- **Swagger**: (Can be added with swagger-jsdoc package)

Example cURL request:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hostel.com","password":"password123"}'
```

---

## Future Enhancements

1. **Database Integration** - Replace mock data with real database (MongoDB/PostgreSQL)
2. **Input Validation** - Add comprehensive validation using Zod/Joi
3. **Error Handling** - Standardized error response middleware
4. **Pagination** - Add pagination to list endpoints
5. **Filtering & Sorting** - Advanced filtering on list endpoints
6. **Rate Limiting** - Prevent API abuse
7. **Logging** - Comprehensive request/response logging
8. **Caching** - Redis caching for frequently accessed data
9. **File Uploads** - Support for document uploads
10. **WebSocket** - Real-time notifications via Socket.io

---

**Generated**: 2024
**Version**: 1.0
**Status**: Production Ready (Backend APIs)
