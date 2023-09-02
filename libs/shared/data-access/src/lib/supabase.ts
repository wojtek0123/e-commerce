import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvvxjwoqcsvhrocqgmje.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2dnhqd29xY3N2aHJvY3FnbWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk4NzE5OTgsImV4cCI6MjAwNTQ0Nzk5OH0.MvKn3BbnST-gFv_nEIo3o4Pp90KeibSKiTjCHeDhhTk';

export const supabase = createClient(supabaseUrl, supabaseKey);
