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

async function run() {
  try {
    console.log('Fetching a single story to inspect ALL columns...');
    const fetchRes = await fetch(`${supabaseUrl}/rest/v1/stories?select=*&limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    if (!fetchRes.ok) {
      throw new Error(`Failed to fetch story: ${await fetchRes.text()}`);
    }
    
    const stories = await fetchRes.json();
    console.log('Full Story Schema on Production Supabase:', stories[0]);
    
  } catch (err) {
    console.error('Error running script:', err);
  }
}

run();
