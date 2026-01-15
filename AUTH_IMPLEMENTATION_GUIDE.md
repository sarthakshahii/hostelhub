# Authentication Module Implementation Guide

This guide explains how to implement the backend authentication endpoints that the frontend auth module expects.

## Frontend Auth Implementation

The frontend auth module has been fully implemented with:
- ✅ Login page with email/password form
- ✅ JWT token management (localStorage)
- ✅ Protected routes with role checking
- ✅ Role-based dashboards (Admin/Warden/Student)
- ✅ Auto-logout on 401 responses
- ✅ Auth context for global state management

## Required Backend API Endpoints

### 1. POST /api/auth/login

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin"
  }
}
```

**Response (Failure - 401):**
```json
{
  "message": "Invalid email or password"
}
```

### 2. GET /api/auth/me

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (Success - 200):**
```json
{
  "id": "user123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "admin"
}
```

**Response (Failure - 401):**
```
Unauthorized
```

### 3. POST /api/auth/logout

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (Success - 200):**
```json
{
  "message": "Logged out successfully"
}
```

## User Roles

The system supports three user roles:

1. **Admin** (`admin`)
   - Full system access
   - Can manage hostels, users, reports
   - Dashboard: AdminDashboard
   - Can access all modules

2. **Warden** (`warden`)
   - Limited to hostel-specific operations
   - Can manage residents, rooms, complaints, attendance, mess
   - Dashboard: WardenDashboard
   - Cannot access: Hostels (list), Reports

3. **Student** (`student`)
   - Limited to personal information
   - Can view room details, lodge complaints, check payments
   - Dashboard: StudentDashboard
   - Can access: Complaints, Mess, Payments, Notifications

## Role-Based Route Protection

Routes are protected based on user roles:

| Route | Allowed Roles | Component |
|-------|---|---|
| `/` | admin, warden, student | RoleBasedDashboard (dynamically routes) |
| `/hostels` | admin, warden | Hostels |
| `/rooms` | admin, warden, student | Rooms |
| `/residents` | admin, warden | Residents |
| `/attendance` | admin, warden | Attendance |
| `/complaints` | admin, warden, student | Complaints |
| `/mess` | admin, warden, student | Mess |
| `/payments` | admin, warden, student | Payments |
| `/notifications` | admin, warden, student | Notifications |
| `/reports` | admin | Reports |

## Token Management

The frontend handles token management as follows:

1. **Storage**: JWT token is stored in `localStorage` under key `authToken`
2. **Refresh**: On app load, token is validated with GET `/api/auth/me`
3. **Expiration**: If token expires (401 response), it's automatically removed
4. **Logout**: Token is cleared from localStorage on logout

## Error Handling

### 401 Unauthorized
- User is logged out
- Redirected to `/login`
- Token is removed from localStorage
- Displayed error message to user

### 403 Forbidden
- User doesn't have permission to access a resource
- Redirected to `/unauthorized`

## Backend Validation Checklist

When implementing backend auth:

- [ ] Validate email format
- [ ] Hash passwords using bcrypt or similar
- [ ] Generate JWT tokens with expiration (recommended: 24 hours)
- [ ] Return proper HTTP status codes (200, 401, 403)
- [ ] Include `Authorization` header validation
- [ ] Implement token expiration check
- [ ] Return user data with correct role field
- [ ] Handle concurrent logout requests

## Demo Credentials (for testing)

The login page displays these demo credentials:

**Admin:**
- Email: `admin@hostel.com`
- Password: `password123`

**Warden:**
- Email: `warden@hostel.com`
- Password: `password123`

**Student:**
- Email: `student@hostel.com`
- Password: `password123`

## Frontend Auth Context Usage

To use auth in components:

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, token, isAuthenticated, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <p>Role: {user?.role}</p>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
```

## API Integration Example

```typescript
// Using fetch with auth token
const authToken = localStorage.getItem('authToken');

const response = await fetch('/api/protected-endpoint', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  }
});

if (response.status === 401) {
  // Token expired, auth context will handle logout
  return;
}
```

## Next Steps

1. Implement the three required endpoints on your backend
2. Test with the demo credentials
3. Verify role-based access control works
4. Test token expiration and refresh behavior
5. Monitor 401 responses for automatic logout

## Common Issues

**Issue**: Login works but redirects to login page again
- **Solution**: Verify `/api/auth/me` endpoint returns user data with correct role

**Issue**: Role-based routes don't work
- **Solution**: Check that user role is one of: `admin`, `warden`, or `student`

**Issue**: Token persists after logout
- **Solution**: Verify logout endpoint is being called and localStorage is cleared

