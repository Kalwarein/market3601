# Admin Account Setup Instructions

To create the admin account for Market360, follow these steps:

## Option 1: Create via Auth Page (Recommended)

1. Go to the sign-up page at `/auth`
2. Register a new account with:
   - **Email**: market.360@gmail.com
   - **Password**: market360sclar2020
3. After signing up, you need to add the admin role to this user manually

## Option 2: Add Admin Role to Existing User

If the account `market.360@gmail.com` already exists, you just need to add the admin role:

1. Get the user's UUID from the `profiles` table
2. Insert a record into `user_roles`:

```sql
-- First, find the user_id for market.360@gmail.com
SELECT id FROM auth.users WHERE email = 'market.360@gmail.com';

-- Then insert admin role (replace USER_UUID with actual UUID)
INSERT INTO user_roles (user_id, role)
VALUES ('USER_UUID', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

## After Setup

Once the admin account is created and has the admin role:

1. Sign in with `market.360@gmail.com` and password `market360sclar2020`
2. Go to Profile page
3. Click on "Admin Dashboard" button (will only appear for admin users)
4. You will now have access to the admin dashboard at `/admin`

## Security Note

The admin role is checked server-side using the `has_role()` function, which queries the `user_roles` table. This ensures proper security and cannot be bypassed by client-side manipulation.
