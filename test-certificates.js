// Certificate System Test Script
// This script tests the core certificate functionality

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCertificateSystem() {
  console.log('🧪 Testing Certificate Generation System...\n');

  try {
    // Test 1: Check database connectivity
    console.log('1. Testing database connectivity...');
    const { data: testData, error: testError } = await supabase
      .from('events')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Database connection failed:', testError.message);
      return;
    }
    console.log('✅ Database connection successful\n');

    // Test 2: Check events table
    console.log('2. Checking events table...');
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, name, slug, status')
      .limit(10);

    if (eventsError) {
      console.error('❌ Error fetching events:', eventsError.message);
      return;
    }
    console.log(`✅ Found ${events.length} events in database`);
    if (events.length > 0) {
      console.log('Sample events:');
      events.slice(0, 3).forEach(event => {
        console.log(`   - ${event.name} (${event.slug}) - ${event.status}`);
      });
    }
    console.log('');

    // Test 3: Check user_events table for attended records
    console.log('3. Checking for attended event records...');
    const { data: attendedRecords, error: attendedError } = await supabase
      .from('user_events')
      .select('id, user_id, event_slug, attendance_status, registered_at')
      .eq('attendance_status', 'attended')
      .order('registered_at', { ascending: false })
      .limit(10);

    if (attendedError) {
      console.error('❌ Error fetching attended records:', attendedError.message);
      return;
    }
    console.log(`✅ Found ${attendedRecords.length} attended event records`);
    if (attendedRecords.length > 0) {
      console.log('Sample attended records:');
      attendedRecords.slice(0, 3).forEach(record => {
        console.log(`   - User: ${record.user_id.substring(0, 8)}... | Event: ${record.event_slug} | Date: ${new Date(record.registered_at).toLocaleDateString()}`);
      });
    }
    console.log('');

    // Test 4: Test certificate service logic (simulate getRegisteredEvent)
    if (attendedRecords.length > 0) {
      console.log('4. Testing certificate service logic...');
      const sampleUserId = attendedRecords[0].user_id;
      const sampleEventSlug = attendedRecords[0].event_slug;

      // Simulate getRegisteredEvent function
      const { data: userEvent, error: userEventError } = await supabase
        .from('user_events')
        .select('event_slug')
        .eq('user_id', sampleUserId)
        .eq('attendance_status', 'attended')
        .order('registered_at', { ascending: false })
        .limit(1)
        .single();

      if (userEventError || !userEvent) {
        console.log(`❌ No attended event found for user ${sampleUserId.substring(0, 8)}...`);
      } else {
        // Get event details
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('name, slug')
          .eq('slug', userEvent.event_slug)
          .single();

        if (eventError || !eventData) {
          console.log(`❌ Event details not found for slug: ${userEvent.event_slug}`);
        } else {
          console.log(`✅ Certificate data would be generated for:`);
          console.log(`   - Event: ${eventData.name}`);
          console.log(`   - Event Slug: ${eventData.slug}`);
        }
      }
      console.log('');

      // Test 5: Check user profile
      console.log('5. Checking user profile data...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email, scholar_id')
        .eq('user_id', sampleUserId)
        .single();

      if (profileError) {
        console.log(`❌ Profile not found for user ${sampleUserId.substring(0, 8)}...`);
        console.log('   This would cause certificate generation to fail');
      } else {
        console.log(`✅ User profile found:`);
        console.log(`   - Name: ${profile.full_name || 'Not set'}`);
        console.log(`   - Email: ${profile.email}`);
        console.log(`   - Scholar ID: ${profile.scholar_id || 'Not set'}`);
      }
    } else {
      console.log('4. Skipping certificate service test - no attended records found\n');
      console.log('5. Skipping profile test - no attended records found\n');
    }

    // Test 6: Check certificate template
    console.log('6. Checking certificate template...');
    const fs = require('fs');
    const path = require('path');
    const templatePath = path.join(__dirname, 'public', 'images', 'certificate-template.png');

    if (fs.existsSync(templatePath)) {
      const stats = fs.statSync(templatePath);
      console.log(`✅ Certificate template found: ${stats.size} bytes`);
    } else {
      console.log('❌ Certificate template not found at expected location');
    }
    console.log('');

    // Summary
    console.log('📊 Test Summary:');
    console.log(`   - Events in database: ${events.length}`);
    console.log(`   - Attended records: ${attendedRecords.length}`);
    console.log(`   - Certificate template: ${fs.existsSync(templatePath) ? 'Found' : 'Missing'}`);

    if (events.length > 0 && attendedRecords.length > 0 && fs.existsSync(templatePath)) {
      console.log('\n🎉 Certificate system appears to be properly configured!');
      console.log('   The system should work for users who have attended events.');
    } else {
      console.log('\n⚠️  Certificate system may have issues:');
      if (events.length === 0) console.log('   - No events in database');
      if (attendedRecords.length === 0) console.log('   - No users marked as attended');
      if (!fs.existsSync(templatePath)) console.log('   - Certificate template missing');
    }

  } catch (error) {
    console.error('💥 Test failed with error:', error);
  }
}

// Run the tests
testCertificateSystem();
