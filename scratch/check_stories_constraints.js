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

async function run() {
  try {
    console.log('Querying check constraints and metadata for table: stories...');
    // We can query the postgresql RPC or schema via PostgREST by calling an information schema query if exposed, 
    // or by attempting updates with specific incorrect values to see which constraints trigger errors.
    
    const testValues = [
      { status: 'published' },
      { status: 'draft' },
      { status: 'review' },
      { status: 'archived' }
    ];
    
    for (const testVal of testValues) {
      console.log(`\nTesting update of status to '${testVal.status}' for Godfather...`);
      const res = await fetch(`${supabaseUrl}/rest/v1/stories?id=eq.00000000-0000-0000-0000-000000000001`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(testVal)
      });
      
      console.log(`Status for '${testVal.status}':`, res.status);
      const text = await res.text();
      console.log('Response:', text);
    }
    
  } catch (err) {
    console.error('Error running check:', err);
  }
}

run();
