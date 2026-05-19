const fs = require('fs');
const path = require('path');

// Read .env.local
const envLocalPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envLocalPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
    env[key] = val;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

// Form payload simulating StoryForm.tsx onSubmit
const storyData = {
  title: "AI Generated: Gladiator",
  synopsis: "A cinematic exploration of Gladiator, focusing on vocabulary and practical application.",
  script: "[NARRATOR]: Imagine a world...",
  category: "psychology",
  difficulty: "intermediate",
  duration_seconds: 654,
  xp_value: 350,
  is_premium: false,
  is_featured: false,
  status: "published",
  thumbnail_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
  audio_url: ""
};

async function run() {
  try {
    const storyId = '2ba75a92-2822-45fe-9040-1cf71ef4e522'; // From screenshot URL
    console.log(`Sending simulated patch request for story: ${storyId}...`);
    
    const updateRes = await fetch(`${supabaseUrl}/rest/v1/stories?id=eq.${storyId}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(storyData)
    });
    
    console.log('HTTP Status:', updateRes.status);
    const text = await updateRes.text();
    console.log('Response body:', text);
    
  } catch (err) {
    console.error('Error running simulation:', err);
  }
}

run();
