# 🔄 SlotSwapper

> Swap your schedule, not your sanity. A peer-to-peer application for trading time slots.
>
> Deployed Frontend Link: https://slotswapper-self.vercel.app
>
Backend is deployed on Render, Frontend deployed on Vercel and Database is hosted on MongoDB ATLAS
>
> This Readme file covers:
> - API documentation
> - Model structure
> - Project Flow
> - Frontend Pages
> - Error handling and Validations
> - Technology Stack
> - Getting Started and Contact

## Technology Stack
- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MongoDB (NoSQL)
- ORM tool: mongoose
- Authentication: jwt-token auth 

## SlotSwapper API Documentation

This document outlines the available API endpoints for the SlotSwapper application.

All API routes are prefixed with `/api`.

---

## Authentication Routes

**Base Path:** `/api/auth`

These routes handle user registration and login.

### 1. Register User

* **Endpoint:** `POST /api/auth/register`
* **Description:** Creates a new user account.
* **Request Body:**
    ```json
    {
      "username": "newuser",
      "email": "user@example.com",
      "password": "yourstrongpassword"
    }
    ```
* **Success Response (Example):**
    ```json
    {
      "message": "User registered successfully!"
    }
    ```

### 2. Login User

* **Endpoint:** `POST /api/auth/login`
* **Description:** Authenticates a user and returns a JSON Web Token (JWT).
* **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "yourstrongpassword"
    }
    ```
* **Success Response (Example):**
    ```json
    {
      "token": "eyJh...[jwt_token]...U_A",
      "userId": "60c72b...[user_id]...1f3"
    }
    ```

---

## Event Routes

**Base Path:** `/api/events`

These routes manage user events and slots. All routes in this section require a valid JWT token sent in the `Authorization` header (e.g., `Bearer <token>`).

### 1. Get My Events

* **Endpoint:** `GET /api/events/my-events`
* **Protected:** Yes (`verifyToken`)
* **Description:** Retrieves all events created by the authenticated user.
* **Success Response (Example):**
    ```json
    [
      {
        "id": "event1",
        "title": "My Work Shift",
        "startTime": "2024-10-28T09:00:00Z",
        "endTime": "2024-10-28T17:00:00Z",
        "isSwappable": true
      }
    ]
    ```

### 2. Create Event

* **Endpoint:** `POST /api/events/create`
* **Protected:** Yes (`verifyToken`)
* **Description:** Creates a new event for the authenticated user.
* **Request Body (Example):**
    ```json
    {
      "title": "Morning Shift",
      "startTime": "2024-11-01T08:00:00Z",
      "endTime": "2024-11-01T12:00:00Z",
      "isSwappable": true
    }
    ```
* **Success Response (Example):**
    ```json
    {
      "id": "event2",
      "title": "Morning Shift",
      "startTime": "2024-11-01T08:00:00Z",
      "endTime": "2024-11-01T12:00:00Z",
      "isSwappable": true,
      "userId": "60c72b...[user_id]...1f3"
    }
    ```

### 3. Update Event

* **Endpoint:** `PUT /api/events/update`
* **Protected:** Yes (`verifyToken`)
* **Description:** Updates an existing event owned by the authenticated user.
* **Request Body (Example):**
    ```json
    {
      "id": "event2",
      "title": "Updated Morning Shift",
      "isSwappable": false
    }
    ```
* **Success Response (Example):**
    ```json
    {
      "id": "event2",
      "title": "Updated Morning Shift",
      "startTime": "2024-11-01T08:00:00Z",
      "endTime": "2024-11-01T12:00:00Z",
      "isSwappable": false,
      "userId": "60c72b...[user_id]...1f3"
    }
    ```

### 4. Remove Event

* **Endpoint:** `DELETE /api/events/remove/:id`
* **Protected:** Yes (`verifyToken`)
* **Description:** Deletes a specific event by its ID.
* **URL Parameters:**
    * `id` (string): The ID of the event to delete.
* **Success Response (Example):**
    ```json
    {
      "message": "Event removed successfully."
    }
    ```

### 5. Get All Swappable Slots

* **Endpoint:** `GET /api/events/swappable-slots`
* **Protected:** Yes (`verifyToken`)
* **Description:** Retrieves all events marked as `isSwappable` from *other* users (i.e., potential slots to swap with).
* **Success Response (Example):**
    ```json
    [
      {
        "id": "event3",
        "title": "Night Shift (Other User)",
        "startTime": "2024-11-02T22:00:00Z",
        "endTime": "2024-11-03T06:00:00Z",
        "isSwappable": true,
        "userId": "60c72b...[other_user_id]...2g4"
      }
    ]
    ```

### 6. Get Events by Date

* **Endpoint:** `GET /api/events/by-date`
* **Protected:** Yes (`verifyToken`)
* **Description:** Retrieves events for the authenticated user within a specific date range (query parameters).
* **Query Parameters:**
    * `startDate` (string, ISO format): e.g., `2024-11-01T00:00:00Z`
    * `endDate` (string, ISO format): e.g., `2024-11-01T23:59:59Z`
* **Success Response (Example):**
    ```json
    [
      {
        "id": "event2",
        "title": "Updated Morning Shift",
        "startTime": "2024-11-01T08:00:00Z",
        "endTime": "2024-11-01T12:00:00Z",
        "isSwappable": false
      }
    ]
    ```

### 7. Get My Swappable Slots

* **Endpoint:** `GET /api/events/my-swappable-slots`
* **Protected:** Yes (`verifyToken`)
* **Description:** Retrieves all events belonging to the authenticated user that are marked as `isSwappable`.
* **Success Response (Example):**
    ```json
    [
      {
        "id": "event1",
        "title": "My Work Shift",
        "startTime": "2024-10-28T09:00:00Z",
        "endTime": "2024-10-28T17:00:00Z",
        "isSwappable": true
      }
    ]
    ```

---

## Swap Routes

**Base Path:** `/api/swap`

These routes handle the creation and management of swap requests between users. All routes in this section require a valid JWT token.

### 1. Create Swap Request

* **Endpoint:** `POST /api/swap/request`
* **Protected:** Yes (`verifyToken`)
* **Description:** Initiates a request to swap one of the user's slots for another user's slot.
* **Request Body:**
    ```json
    {
      "mySlotId": "event1",
      "requestedSlotId": "event3"
    }
    ```
* **Success Response (Example):**
    ```json
    {
      "id": "swapRequest1",
      "requesterId": "60c72b...[user_id]...1f3",
      "responderId": "60c72b...[other_user_id]...2g4",
      "requesterSlotId": "event1",
      "responderSlotId": "event3",
      "status": "pending"
    }
    ```

### 2. Respond to Swap Request

* **Endpoint:** `POST /api/swap/respond`
* **Protected:** Yes (`verifyToken`)
* **Description:** Allows the receiving user (responder) to accept or decline a pending swap request.
* **Request Body:**
    ```json
    {
      "swapRequestId": "swapRequest1",
      "response": "accepted"
    }
    ```
* **Success Response (Example):**
    ```json
    {
      "message": "Swap request accepted."
    }
    ```
    *(Note: If accepted, the backend should handle the logic of swapping the `userId` on the respective event slots.)*

### 3. Get Pending Swap Slots

* **Endpoint:** `GET /api/swap/pending-slots`
* **Protected:** Yes (`verifyToken`)
* **Description:** Retrieves all swap requests (both incoming and outgoing) for the authenticated user that have a "pending" status.
* **Success Response (Example):**
    ```json
    {
      "incoming": [
        {
          "id": "swapRequest2",
          "requesterId": "60c72b...[another_user]...5k9",
          "requesterSlotId": "event5",
          "responderSlotId": "event1"
        }
      ],
      "outgoing": [
        {
          "id": "swapRequest1",
          "responderId": "60c72b...[other_user_id]...2g4",
          "requesterSlotId": "event1",
          "responderSlotId": "event3"
        }
      ]
    }
    ```

## 🏛️ How It's Built: Data & Logic

This project is built around three core models and a clear, status-driven logic.

### 1. Data Models
```javascript
// 1. User Model
{
  _id: "userId",
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password"
}

// 2. Event Model
{
  _id: "eventId",
  title: "Team Meeting",
  description: "Weekly sync",
  startTime: "2025-11-10T10:00:00Z",
  endTime: "2025-11-10T11:00:00Z",
  status: "SWAPPABLE", // "BUSY" | "SWAPPABLE" | "SWAP_PENDING"
  userId: "user_A_id"
}

// 3. SwapRequest Model
{
  _id: "swapRequestId",
  requesterId: "user_A_id",
  receiverId: "user_B_id",
  requesterEventId: "event_A_id",
  receiverEventId: "event_B_id",
  status: "PENDING" // "PENDING" | "ACCEPTED" | "REJECTED"
}
```

### 2. Status-Driven Flow

The status fields on the `Event` and `SwapRequest` models control the entire application flow, ensuring events are locked during negotiation and properly processed.

- **BUSY**: The default state. A private event. Not visible to others.
- **SWAPPABLE**: The user has "published" this slot. It's now visible in the Marketplace.
- **SWAP_PENDING**: A swap has been requested. The event is locked and cannot be offered in other trades.
- **BUSY** (again): Once a swap is complete, the new event is set to BUSY for its new owner.

---

## 🚀 The Project Flow (User Journey)

1. **Authentication**: A user registers or logs in. A JWT is generated and stored (e.g., in cookies) for session management.

2. **Create Event**: The user goes to their Dashboard. They use the calendar to select a day and create a new event. They set the event's status to `SWAPPABLE`.

3. **Marketplace Discovery**: Another user logs in and visits the Marketplace. They see the `SWAPPABLE` event from User A.

4. **Initiate Request**: This user requests a swap, offering one of their own `SWAPPABLE` slots. This action creates a new `SwapRequest` document with a `PENDING` status.

5. **Lock Events**: The backend immediately updates both User A's event and User B's event to the `SWAP_PENDING` status. This removes them from the marketplace and prevents conflicting requests.

6. **Review Request**: User A visits their Request Page. The backend queries the `SwapRequest` model, finds all requests where `receiverId` matches User A's ID, and populates the details for both the requester's event and their own.

7. **Resolve**: User A clicks "Accept" or "Reject".

### ✨ The Swap: How Acceptance Works

This is the core transaction of the application.

**If Rejected:**
- The `SwapRequest` status is set to `REJECTED`.
- Both the `requesterEvent` and `receiverEvent` have their status set back to `SWAPPABLE`.

**If Accepted:**
- The `SwapRequest` status is set to `ACCEPTED`.
- **The "Swap"**: The `startTime` and `endTime` of the two events are exchanged. The `requesterEvent` gets the timestamps from the `receiverEvent`, and vice-versa.
- **Finalize**: The status for both events is set to `BUSY`.

> **Note**: The `userId` on the events remains the same, but the event details (time/date) are swapped, effectively trading the slots.

---

## 🖥️ Frontend Pages

The UI is designed to be simple and task-focused.

### 1. The Dashboard

The main landing page for logged-in users.

- Features a calendar component to select dates.
- Displays a list of the user's events for the selected day.
- Each event in the list has **Update** and **Delete** options.
- Contains the "Create Event" form.

### 2. The Marketplace

- Fetches and displays all events from other users that have a `SWAPPABLE` status.
- Rendered in a clear table format, showing event title, time, and owner (anonymized if needed).
- Each entry has a "Request Swap" button.

### 3. The Request Page

- Shows all incoming swap requests where the user is the `receiverId`.
- Each request is displayed in a two-row format:
  - **Row 1**: "From: [Requester Name]" - Shows the details of the event they are offering.
  - **Row 2**: "For: [Your Event]" - Shows the details of your event they want.
- Includes the **Accept** and **Reject** buttons that trigger the swap logic.

---

## 🛡️ Error Handling & Validation

- Server-side validations are in place before any database operation.
- **Example**: When creating or updating an event, the system checks that `startTime` comes before `endTime`.
- **Example**: Before creating a swap request, the backend verifies that both events still exist and are currently `SWAPPABLE`.

---

## 🔌 API Endpoints

The frontend is powered by a RESTful API. Key routes include:

- `/api/auth` (Register, Login)
- `/api/events` (CRUD for events, get swappable slots)
- `/api/swap` (Request, Respond)

---

## Key Features

- ✅ Peer-to-peer time slot trading
- ✅ Status-driven event lifecycle
- ✅ Automatic conflict prevention
- ✅ JWT-based authentication
- ✅ Real-time marketplace updates
- ✅ Clean, intuitive UI

---

## 🚦 Getting Started

1. Clone the repository - `git clone repo-link`
2. Install dependencies 
3. Configure your database connection
4. Set up environment variables (JWT secret, etc.)
5. Run the development server
6. Start swapping! 🔄

---

## Contact

pawar.smit2108@gmail.com

Smit Pawar
