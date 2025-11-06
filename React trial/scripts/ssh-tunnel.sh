#!/bin/bash
# SSH Tunnel for PostgreSQL Database Connection

SSH_KEY="/root/.ssh/id_ed25519"
SSH_USER="indi4dev"
SSH_HOST="155.248.253.217"
SSH_PORT="22"
LOCAL_PORT="5555"
REMOTE_HOST="172.17.0.1"
REMOTE_PORT="5432"

# Check if tunnel is already running
if ss -tlnp 2>/dev/null | grep -q ":$LOCAL_PORT"; then
    echo "SSH tunnel already active on port $LOCAL_PORT"
    exit 0
fi

# Establish SSH tunnel
echo "Establishing SSH tunnel..."
ssh -o StrictHostKeyChecking=no \
    -o ServerAliveInterval=60 \
    -o ServerAliveCountMax=3 \
    -f -N \
    -L $LOCAL_PORT:$REMOTE_HOST:$REMOTE_PORT \
    $SSH_USER@$SSH_HOST \
    -i $SSH_KEY

# Wait a moment for tunnel to establish
sleep 2

# Verify tunnel is active
if ss -tlnp 2>/dev/null | grep -q ":$LOCAL_PORT"; then
    echo "✓ SSH tunnel successfully established on port $LOCAL_PORT"
    exit 0
else
    echo "✗ Failed to establish SSH tunnel"
    exit 1
fi
