# CloudBurn Frontend Analysis

## 1. Project Overview

**CloudBurn** is a SaaS platform for real-time cloud cost intelligence. It helps engineering teams monitor, detect, and optimize cloud infrastructure costs across AWS, GCP, and Azure.

### Core Flow
```
CONNECT (cloud accounts) → MONITOR (costs) → DETECT (anomalies) → EXPLAIN (AI insights) → OPTIMIZE (recommendations)
```

### Main Features
- **Dashboard**: KPI cards, cost trends, service breakdown, recent activity
- **Alerts**: Real-time cost anomaly detection with severity levels
- **Cloud Accounts**: Multi-cloud account management (AWS, GCP, Azure)
- **Zombie Resources**: Idle resource detection and cost waste tracking
- **Teams**: Team-based cost allocation and budget management
- **Reports**: Cost reporting and forecasting
- **Settings**: Configuration and preferences

---

## 2. Folder Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.jsx                # Root layout (DashboardLayout wrapper)
│   ├── page.jsx                  # Home page (Dashboard)
│   ├── alerts/page.jsx           # Alerts page
│   ├── cloud-accounts/page.jsx   # Cloud accounts page
│   ├── reports/page.jsx          # Reports page
│   ├── settings/page.jsx         # Settings page
│   ├── teams/page.jsx            # Teams page
│   └── zombie-resources/page.jsx # Zombie resources page
│
├── features/                     # Feature-based modules
│   ├── ai/
│   │   └── components/
│   │       └── ai-insights.jsx   # AI insights panel
│   ├── alerts/
│   │   ├── components/
│   │   │   └── alert-panel.jsx   # Alert display component
│   │   └── pages/
│   │       └── alerts-page.jsx   # Full alerts page
│   ├── cloud/
│   │   └── pages/
│   │       └── cloud-accounts-page.jsx
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── cost-charts.jsx       # Cost trend & service breakdown charts
│   │   │   ├── flow-indicator.jsx    # Progress flow indicator
│   │   │   ├── kpi-cards.jsx         # KPI summary cards
│   │   │   └── recent-activity.jsx   # Activity feed
│   │   └── pages/
│   │       └── dashboard-page.jsx    # Main dashboard page
│   ├── reports/
│   │   └── pages/
│   │       └── reports-page.jsx
│   ├── settings/
│   │   └── pages/
│   │       └── settings-page.jsx
│   ├── teams/
│   │   └── pages/
│   │       └── teams-page.jsx
│   └── zombies/
│       └── pages/
│           └── zombies-page.jsx
│
├── shared/                       # Shared components and hooks
│   ├── components/
│   │   ├── common/
│   │   │   ├── chart-config.js       # Chart configurations
│   │   │   ├── page-header.jsx       # Reusable page header
│   │   │   └── stat-card.jsx         # Statistic card component
│   │   ├── layout/
│   │   │   ├── app-sidebar.jsx       # Sidebar navigation
│   │   │   ├── dashboard-layout.jsx  # Main layout wrapper
│   │   │   └── top-bar.jsx           # Top navigation bar
│   │   ├── theme-provider.jsx        # Dark/light theme provider
│   │   └── ui/                       # Radix UI primitives (shadcn)
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── card.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── progress.tsx
│   │       └── ... (30+ components)
│   └── hooks/
│       └── use-mobile.js             # Mobile breakpoint detection
│
├── api/
│   └── mock-data.js                # Mock data for development
│       ├── serviceCosts
│       ├── alerts
│       ├── zombieResources
│       ├── teams
│       ├── cloudAccounts
│       ├── aiInsights
│       └── utility functions
│
├── store/
│   └── role-context.jsx            # Role-based permission context
│       ├── RoleProvider
│       ├── useRole hook
│       ├── permissions config
│       └── getRoleBadgeColor, getRoleLabel utilities
│
└── utils/
    └── utils.js                    # cn() utility for Tailwind classes
```

---

## 3. File Responsibilities

### Core Layout Files

| File | Responsibility |
|------|----------------|
| `app/layout.jsx` | Root layout, wraps app in DashboardLayout, sets metadata |
| `shared/components/layout/dashboard-layout.jsx` | Main app shell with sidebar, top-bar, mobile menu |
| `shared/components/layout/app-sidebar.jsx` | Navigation sidebar with role-based filtering |
| `shared/components/layout/top-bar.jsx` | Top bar with org switcher, theme toggle, notifications, user menu |

### State Management

| File | Responsibility |
|------|----------------|
| `store/role-context.jsx` | **Current "auth" simulation** - provides user state, role switching, permission checks |

### Feature Pages

| File | Responsibility |
|------|----------------|
| `features/dashboard/pages/dashboard-page.jsx` | Main dashboard with KPIs, charts, alerts, AI insights |
| `features/alerts/pages/alerts-page.jsx` | Full alerts listing and management |
| `features/cloud/pages/cloud-accounts-page.jsx` | Cloud account connections |
| `features/zombies/pages/zombies-page.jsx` | Zombie resource detection |
| `features/teams/pages/teams-page.jsx` | Team management |
| `features/reports/pages/reports-page.jsx` | Cost reports |
| `features/settings/pages/settings-page.jsx` | App settings |

### Data Layer

| File | Responsibility |
|------|----------------|
| `api/mock-data.js` | All mock data for development, utility formatters |
| `utils/utils.js` | `cn()` class merge utility |

---

## 4. Data Flow

### Current Flow (Mock Data)
```
1. mock-data.js exports static data
2. Components import data directly
3. RoleContext provides hardcoded user "Alex Chen"
4. Components use useRole() to check permissions
5. UI renders based on role permissions
```

### Rendering Flow
```
RootLayout → DashboardLayout → ThemeProvider → RoleProvider → AppSidebar + TopBar + children
                                                      ↓
                                            Role-based nav filtering
```

### Permission System
```
user.role → permissions[role].view → canView(permission) → filtered nav items
            permissions[role].edit → canEdit(permission) → conditional UI
```

---

## 5. Authentication Status

### Current State: NO AUTHENTICATION

| Requirement | Status |
|-------------|--------|
| Login page | **Missing** |
| Register page | **Missing** |
| Email/Password auth | **Missing** |
| Google OAuth | **Missing** |
| Token handling | **Missing** |
| Session persistence | **Missing** |
| Protected routes | **Missing** |
| Auth context | **Partial** (RoleContext exists but uses hardcoded user) |

### What Exists (RoleContext)
- Hardcoded user object with role
- Role switching for demo purposes
- Permission-based view/edit checks
- **No authentication, no tokens, no persistence**

### What's Missing
1. **Authentication UI**: Login/register pages
2. **Auth State Management**: Real user state, not hardcoded
3. **Token Handling**: JWT or session token storage
4. **Session Persistence**: Rehydrate session on reload
5. **Protected Routes**: Redirect unauthenticated users
6. **OAuth Integration**: Google sign-in
7. **Logout Functionality**: Clear session and redirect

---

## 6. Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.2.4 (App Router) |
| React | 19 |
| Language | JavaScript (JSX) |
| Styling | Tailwind CSS 4 |
| UI Components | Radix UI (shadcn/ui) |
| Animations | Framer Motion |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Theme | next-themes |
| Icons | Lucide React |

---

## 7. Design System

### Theme
- Default: Dark mode
- Supports light/dark toggle
- CSS variables for theming
- Sidebar-specific theme colors

### Components
- shadcn/ui primitives
- Consistent spacing (4px grid)
- Rounded corners (md/lg)
- Subtle borders and shadows
- Backdrop blur effects

### Color Palette (from components)
- Primary: Orange/amber accent
- Sidebar: Dark background with accent
- Success: Green
- Warning: Yellow/amber
- Destructive: Red
- Info: Blue

---

## 8. Security Considerations

### Current Gaps
1. No authentication = no access control
2. Hardcoded user = anyone can access
3. No token validation
4. No API security layer
5. Role switching exposed in UI (demo only)

### Required for Production
1. HTTP-only cookies for tokens
2. CSRF protection
3. Rate limiting on auth endpoints
4. Input validation on login/register
5. Secure password hashing (backend)
6. OAuth state parameter validation

---

## 9. Recommendations

### Immediate (This Implementation)
1. Create AuthContext with real auth state
2. Build login/register pages
3. Implement Google OAuth flow
4. Add session persistence (localStorage for now)
5. Create ProtectedRoute wrapper
6. Integrate auth into existing layout

### Future
1. Move to HTTP-only cookies with backend
2. Add refresh token rotation
3. Implement MFA
4. Add password reset flow
5. Add email verification
6. Add organization/team invitation flow
