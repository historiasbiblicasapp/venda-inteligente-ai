import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const supabaseUrl = 'https://cdznlgccxmtowqnwcglh.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkem5sZ2NjeG10b3dxbndjZ2xoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzM2MTg2MywiZXhwIjoyMDk4OTM3ODYzfQ.vvE0fKsztEUwCn0qXL_MAXYAVp4L0PQDcYTGjdlljIQ';

const supabase = createClient(supabaseUrl, serviceRoleKey);

const sqlPath = resolve(__dirname, '../supabase/migrations/001_initial_schema.sql');
const sql = readFileSync(sqlPath, 'utf-8');

// Split by semicolons and execute each statement
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

async function runMigration() {
  let success = 0;
  let errors = 0;

  for (const statement of statements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { query: statement + ';' });
      if (error) {
        // Try direct query approach
        const { error: err2 } = await supabase.from('_supabase_migrations').select().limit(1);
        // If rpc doesn't work, we need to use the dashboard
        console.error(`Statement failed (use Supabase Dashboard SQL Editor):`);
        console.error(`  ${statement.substring(0, 80)}...`);
        errors++;
      } else {
        success++;
      }
    } catch (e) {
      console.error(`Error: ${e.message}`);
      errors++;
    }
  }

  console.log(`\nResults: ${success} succeeded, ${errors} failed`);
  if (errors > 0) {
    console.log('\nThe SQL needs to be run via the Supabase Dashboard SQL Editor:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Paste the contents of supabase/migrations/001_initial_schema.sql');
    console.log('5. Click "Run"');
  }
}

runMigration();
