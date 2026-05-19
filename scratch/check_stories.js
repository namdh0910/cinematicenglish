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
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

console.log('Connecting via PostgREST to:', supabaseUrl);

async function checkTable(tableName) {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/${tableName}?select=*&limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    
    const data = await res.json();
    console.log(`\n--- TABLE: ${tableName} ---`);
    console.log('Keys:', Object.keys(data[0] || {}));
    console.log('Record:', data[0]);
  } catch (err) {
    console.error(`Error checking table ${tableName}:`, err);
  }
}

async function run() {
  await checkTable('lessons');
  await checkTable('lesson_sentences');
  await checkTable('story_scenes');
}

run();
