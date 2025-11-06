#!/bin/bash
# Qshakti Chatbot Startup Script

set -e

echo "🚀 Starting Qshakti Chatbot..."
echo "================================"

# Check if SSH key exists
if [ ! -f /root/.ssh/id_ed25519 ]; then
    echo "❌ SSH key not found at /root/.ssh/id_ed25519"
    echo "Please ensure SSH keys are configured"
    exit 1
fi

# Start SSH tunnel
echo "📡 Establishing SSH tunnel..."
/app/scripts/ssh-tunnel.sh

if [ $? -eq 0 ]; then
    echo "✅ SSH tunnel established successfully"
else
    echo "❌ Failed to establish SSH tunnel"
    exit 1
fi

# Wait for tunnel to stabilize
sleep 2

# Test database connection
echo ""
echo "🗄️  Testing database connection..."
DB_TEST=$(cd /app && node -e "
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://i4admin:26CQvLBn48xvpTBP6eQ=@127.0.0.1:5555/qshakti-db',
  ssl: false
});
pool.query('SELECT COUNT(*) FROM master_plantmaster WHERE is_active = true')
  .then(result => {
    console.log('SUCCESS:' + result.rows[0].count);
    pool.end();
  })
  .catch(err => {
    console.log('ERROR:' + err.message);
    process.exit(1);
  });
" 2>&1)

if echo "$DB_TEST" | grep -q "SUCCESS"; then
    PLANT_COUNT=$(echo "$DB_TEST" | grep -o "SUCCESS:[0-9]*" | cut -d: -f2)
    echo "✅ Database connected ($PLANT_COUNT plants found)"
else
    echo "❌ Database connection failed"
    echo "$DB_TEST"
    exit 1
fi

# Check if Next.js is already running
if pgrep -f "next dev" > /dev/null; then
    echo ""
    echo "⚠️  Next.js is already running"
    echo "   To restart: pkill -f 'next dev' && $0"
else
    # Start Next.js in background
    echo ""
    echo "🌐 Starting Next.js development server..."
    cd /app
    yarn dev > /tmp/nextjs.log 2>&1 &
    
    # Wait for server to start
    echo "   Waiting for server to start..."
    for i in {1..20}; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            echo "✅ Next.js server is running"
            break
        fi
        sleep 1
        echo -n "."
    done
fi

echo ""
echo "================================"
echo "🎉 Qshakti Chatbot is ready!"
echo ""
echo "📍 Access Points:"
echo "   Main App:    http://localhost:3000"
echo "   DB Test:     http://localhost:3000/api/test-db"
echo ""
echo "📊 Status:"
echo "   SSH Tunnel:  $(ss -tlnp 2>/dev/null | grep -q 5555 && echo '✅ Active' || echo '❌ Inactive')"
echo "   Next.js:     $(pgrep -f 'next dev' > /dev/null && echo '✅ Running' || echo '❌ Stopped')"
echo "   Database:    ✅ Connected ($PLANT_COUNT plants)"
echo ""
echo "📝 Logs:"
echo "   tail -f /tmp/nextjs.log"
echo ""
