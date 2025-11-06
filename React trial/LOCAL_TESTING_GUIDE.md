# Qshakti Chatbot - Local Testing Guide

## 📋 Overview
This chatbot has been transformed from **static data** to **dynamic PostgreSQL database integration**. All data is now fetched in real-time from your Qshakti database.

---

## 🗂️ Project Structure

```
/app
├── src/
│   ├── lib/
│   │   ├── db.ts                    # PostgreSQL connection pool
│   │   ├── server-actions.ts        # Server actions for database queries
│   │   ├── actions-dynamic.ts       # Raw query functions (used by server actions)
│   │   ├── actions-client.ts        # API client wrappers (backup approach)
│   │   └── types.ts                 # TypeScript types
│   ├── components/
│   │   └── chat/
│   │       └── chat-interface.tsx   # Main chatbot component (UPDATED)
│   └── app/
│       └── api/                     # API routes (backup approach)
├── scripts/
│   ├── ssh-tunnel.sh                # SSH tunnel setup script
│   └── start-app.sh                 # Application startup script
├── .env.local                       # Database configuration
└── package.json
```

---

## 🔧 Setup for Local Testing

### 1. Prerequisites
- Node.js 18+ and Yarn installed
- PostgreSQL database accessible
- SSH access to database server (if using SSH tunnel)

### 2. Database Connection

**Option A: SSH Tunnel (Current Setup)**
```bash
# The database is behind SSH tunnel
# Tunnel configuration:
ssh -L 5555:172.17.0.1:5432 indi4dev@155.248.253.217 -i /root/.ssh/id_ed25519

# Check if tunnel is active:
ss -tlnp | grep 5555
# Or netstat -tlnp | grep 5555
```

**Option B: Direct Connection**
If you have direct database access, update `.env.local`:
```env
DATABASE_URL=postgresql://username:password@host:port/database
DB_SSL_MODE=disable
```

### 3. Environment Variables

**File: `.env.local`**
```env
DATABASE_URL=postgresql://i4admin:26CQvLBn48xvpTBP6eQ=@127.0.0.1:5555/qshakti-db
DB_SSL_MODE=disable
```

---

## 🚀 Running the Application

### Quick Start

```bash
# 1. Install dependencies
cd /app
yarn install

# 2. Start SSH tunnel (if needed)
./scripts/ssh-tunnel.sh

# 3. Start the application
yarn dev

# OR use the automated script:
./scripts/start-app.sh
```

### Manual Steps

```bash
# 1. Install dependencies
yarn install

# 2. Test database connection
node -e "
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://i4admin:26CQvLBn48xvpTBP6eQ=@127.0.0.1:5555/qshakti-db',
  ssl: false
});
pool.query('SELECT COUNT(*) FROM master_plantmaster')
  .then(r => console.log('✓ Connected:', r.rows[0].count, 'plants'))
  .catch(e => console.error('✗ Error:', e.message));
"

# 3. Start Next.js development server
yarn dev

# 4. Access the application
# Open: http://localhost:3000
```

---

## 🗄️ Database Schema

### Key Tables Used

| Table Name | Purpose |
|------------|---------|
| `master_plantmaster` | Factories/Plants |
| `master_buildingsectionlab` | Sections/Buildings/Labs |
| `master_itemmaster` | Items/Products |
| `master_operationmaster` | Operations |
| `master_parameterlist` | Inspection parameters |
| `master_productionplanner` | Production orders |
| `master_inprocessinspectionreading` | In-process inspection data |
| `master_inprocessactualreading` | Actual reading values |
| `master_rminspectionreading` | Inward/RM inspection data |
| `master_faiinspectionreading` | Final/FAI inspection data |

---

## 💡 How It Works

### Architecture

```
Browser (Client Component)
    ↓
Server Actions (server-actions.ts)
    ↓
Database Query Functions (actions-dynamic.ts)
    ↓
PostgreSQL Connection Pool (db.ts)
    ↓
Database (via SSH Tunnel)
```

### Data Flow Example: "PO Status"

1. User clicks "Production Order (PO) Status"
2. `getFactoriesAction()` is called (Server Action)
3. Server Action queries `master_plantmaster` table
4. Returns list of factories as `Option[]`
5. User selects factory
6. `getPurchaseOrdersAction()` fetches POs for that factory
7. User selects PO
8. `getPurchaseOrderStatusAction()` fetches detailed PO information
9. Data is displayed in a table

---

## 🧪 Testing

### Test Database Connection
```bash
curl http://localhost:3000/api/test-db
```

Expected output:
```json
{
  "success": true,
  "message": "Database connection successful!",
  "data": {
    "factories": ["AMMUNITION FACTORY KHADKI", ...],
    "totalSections": 53,
    "totalPOs": 12
  }
}
```

### Test Individual Flows

1. **Production Order Status**
   - Click "Production Order (PO) Status"
   - Select a factory (e.g., "AMMUNITION FACTORY KHADKI")
   - Select a PO number
   - Verify PO details display correctly

2. **In-Process Inspection**
   - Click "In-process Inspection"
   - Select Factory → Section → Item → PO
   - Verify inspection readings display

3. **Parameter Analysis**
   - Click "Inspection Parameter Wise Analysis"
   - Select Factory → Section → Item → Operation → Parameter
   - Select duration and result type
   - Verify charts/tables display

---

## 📝 Server Actions Reference

### Available Server Actions

```typescript
// Factories & Sections
getFactoriesAction(): Promise<Option[]>
getFactorySectionsAction(factoryId: number): Promise<Option[]>

// Items & Operations
getItemsAction(factoryId: number, sectionId: string): Promise<Option[]>
getOperationsAction(factoryId: number, itemCode: string, sectionId: string): Promise<Option[]>

// Parameters
getParametersAction(factoryId: number, itemCode: string, operationId: string): Promise<Option[]>

// Purchase Orders
getPurchaseOrdersAction(factoryId: number, itemCode?: string): Promise<Option[]>
getPurchaseOrderStatusAction(poId: string): Promise<POStatus | null>

// Inspections
getFilteredInspectionsAction(filters): Promise<Inspection[]>

// Analysis
getParameterSeriesAndStatsAction(factoryId, itemCode, operation, parameter, days?): Promise<Analysis>
getLSLUSLDistributionAction(factoryId, itemCode, operation, parameter, days?): Promise<Distribution>
getParameterDistributionAction(context, factoryId, section, itemCode): Promise<Distribution | null>
```

### Usage in Components

```typescript
import { getFactoriesAction } from '@/lib/server-actions';

// In your component
const factories = await getFactoriesAction();
```

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch" or 502 errors

**Causes:**
- SSH tunnel not active
- Database connection timeout
- pg module bundling issues

**Solutions:**
```bash
# 1. Check SSH tunnel
ss -tlnp | grep 5555

# 2. Restart tunnel
pkill -f "ssh.*5555"
./scripts/ssh-tunnel.sh

# 3. Test database connection
node -e "const {Pool}=require('pg');new Pool({connectionString:process.env.DATABASE_URL}).query('SELECT 1').then(()=>console.log('OK'))"

# 4. Restart Next.js
pkill -f "next dev"
yarn dev
```

### Issue: No data loading in UI

**Check:**
1. Browser console for errors (F12)
2. Next.js server logs
3. Database connection
4. Server Actions are being called correctly

### Issue: Slow performance

**Optimization:**
- Add database indexes on frequently queried columns
- Implement caching for static data (factories, sections)
- Use connection pooling (already implemented)

---

## 📊 Database Query Performance

Current queries are optimized with:
- ✅ `WHERE is_active = true` filters
- ✅ Connection pooling (max 20 connections)
- ✅ Proper JOIN operations
- ✅ `ORDER BY` for consistent results

**Recommended Indexes:**
```sql
CREATE INDEX idx_plantmaster_active ON master_plantmaster(is_active);
CREATE INDEX idx_itemmaster_plant_building ON master_itemmaster(plant_id, building_id, is_active);
CREATE INDEX idx_operations_plant_building_item ON master_operationmaster(plant_id, building_id, item_code_id, is_active);
```

---

## 🔐 Security Notes

- Database credentials in `.env.local` (not committed to git)
- SSH private key at `/root/.ssh/id_ed25519` (not committed)
- Connection pool prevents connection exhaustion
- All queries use parameterized statements (SQL injection protection)

---

## 📦 Dependencies

**Core:**
- `next`: 15.3.3
- `react`: 19.x
- `pg`: 8.16.3 (PostgreSQL client)
- `@types/pg`: 8.15.6

**Utilities:**
- `date-fns`: Date formatting
- `tailwindcss`: Styling

---

## ✅ Verification Checklist

Before deploying to production:

- [ ] SSH tunnel is stable and auto-restarts
- [ ] All 6 chatbot flows tested and working
- [ ] Database queries return correct data
- [ ] Error handling works (try invalid inputs)
- [ ] Performance is acceptable (<2s per query)
- [ ] Environment variables are secure
- [ ] Logs show no errors
- [ ] Browser console has no errors

---

## 📞 Support

For issues during testing:

1. Check logs: `tail -f /tmp/nextjs.log`
2. Test database: `curl http://localhost:3000/api/test-db`
3. Verify SSH tunnel: `ss -tlnp | grep 5555`
4. Check browser console (F12)

---

## 🎯 Summary

✅ **What works:**
- Database connection via SSH tunnel
- All 10 server actions
- PostgreSQL query functions
- Complete chatbot flow logic
- Type-safe implementation

⚠️ **What to test locally:**
- End-to-end chatbot flows
- Data accuracy
- Performance under load
- Error handling

**The codebase is clean, well-organized, and ready for local testing!**
