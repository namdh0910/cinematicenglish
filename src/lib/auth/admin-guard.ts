// Mocking Supabase Auth for Admin Guard
export interface UserSession {
  email: string;
  role: "admin" | "user";
  isAuthenticated: boolean;
}

// Hardcoded for testing
const ADMIN_EMAIL = "admin@cinematicenglish.com";
const ADMIN_PASSWORD = "password123";

/**
 * Server-side function to check admin access
 */
export async function getAdminSession(): Promise<UserSession | null> {
  // In a real app, this would use cookies() to get the session from Supabase
  // For now, we simulate a delay and check a mock cookie/state
  
  // Simulation: Wait for 500ms
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check if we are "logged in" as admin in our mock world
  // Here we would normally call supabase.auth.getSession()
  
  // Mocking an authenticated admin
  return {
    email: ADMIN_EMAIL,
    role: "admin",
    isAuthenticated: true
  };
}
