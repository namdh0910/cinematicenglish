const supabaseUrl = "https://vmntcpocxahfvsreuwjx.supabase.co";
const supabaseAnonKey = "sb_publishable_bQLHhmRbDxGPWOn_tl-LcQ_Tekm2uVz";

async function run() {
  console.log("Sending REST sign up request for master admin...");
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@cinematicenglish.com',
        password: 'password123'
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Registration failed:", data.msg || data.error_description || JSON.stringify(data));
    } else {
      console.log("Registration successful!");
      console.log("User details:", {
        id: data.id,
        email: data.email,
        confirmation_sent_at: data.confirmation_sent_at,
        confirmed_at: data.confirmed_at
      });
    }
  } catch (err) {
    console.error("Network error:", err);
  }
}

run();
