const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://db.milxovetvldjfyvtrxuc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbHhvdmV0dmxkamZ5dnRyeHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NTI5NjgsImV4cCI6MjA1MzAyODk2OH0.OMv871bJEQif1MMc2zYpfZ2njZEs_0H1bRe1oaCnTLU';
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
