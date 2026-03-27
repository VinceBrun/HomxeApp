# Homxe

**A direct, transparent real estate platform for Nigeria. No middlemen, no inflated fees, no gatekeepers.**

Homxe connects property seekers, landlords, and service providers in one place. Find a home, talk to the landlord directly, pay your rent securely, and get maintenance sorted without an agent taking a cut in the middle.

---

## The Problem

If you've tried to rent a property in Nigeria, you already know the frustration. You deal with agents who charge 10–15% just to open a door. Listings are fake or outdated. You have no way to verify if a landlord is legitimate. And once you move in, getting anything fixed means calling five different people and hoping one shows up.

Homxe exists to fix this. Not by disrupting the market with gimmicks, but by building the infrastructure that makes direct, honest property transactions possible.

---

## What We Built

For this hackathon, we built a working MVP with three user roles.

**Property Seeker (Tenant/Buyer)** can browse and filter properties, explore listings on an interactive map, view full property details, contact landlords directly via WhatsApp or phone call, and pay rent securely through Interswitch.

**Property Owner (Landlord)** can create and manage listings through a structured 5-step flow, track views and engagement from their dashboard, and respond to tenant inquiries.

**Vendor/Artisan** is coming next. The architecture is already in place and artisans will be able to receive jobs, communicate with clients, and get paid through the same payment infrastructure we built for rent.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native (Expo) |
| Language | TypeScript |
| Styling | NativeWind (TailwindCSS) |
| Backend & Database | Supabase (PostgreSQL + Realtime) |
| Payments | Interswitch Web Checkout + Transaction Status API |
| Maps | Expo Maps (switching to Google Maps API in production) |
| Auth | Supabase Auth with OTP email verification |
| State Management | Zustand + React Query |

---

## Core Features

**Authentication & Roles**

Users sign up once and choose a persona: Seeker, Owner, or Artisan. The app routes them to the right dashboard based on their active role, and switching personas is supported without logging out.

**Property Discovery**

Seekers get a home feed with featured and nearby listings, distance-based sorting, and category filters. There's also a full map explore view with property markers and location-aware discovery, currently powered by Expo Maps. We will switch to Google Maps API in production for a more feature-rich experience. Each listing shows an image carousel, amenities, specs, pricing in NGN, and the landlord's contact details.

**Property Management (Owner)**

Owners create listings through a 5-step guided flow covering basic info, specs, amenities, photo uploads, and pricing. The owner dashboard pulls real data from the database including revenue trends, property stats, and recent activity.

**Landlord Contact**

For the MVP, seekers contact landlords directly through WhatsApp or a phone call. The contact button opens WhatsApp with a pre-filled message referencing the property, or dials the landlord's number directly. A full in-app real-time chat system is in development and will replace this in the next release.

**Rent Payment via Interswitch**

The full payment flow works end-to-end in sandbox. Details below.

---

## Interswitch Payment Integration

This is the core of our hackathon submission. We integrated Interswitch's **Web Checkout API** and **Transaction Status API** to enable tenants to pay rent directly inside the app.

### How it works

When a seeker taps **Pay Rent** on a property, we build a hidden HTML form with the payment parameters and load it into a React Native WebView. The form auto-submits a POST to Interswitch's hosted checkout page at:

```
https://newwebpay.qa.interswitchng.com/collections/w/pay
```

The tenant completes payment on Interswitch's UI using card (Verve or Visa), bank transfer, USSD, or wallet. We never touch card details at any point.

After payment, Interswitch redirects to our callback URL. We intercept this in the WebView using `onShouldStartLoadWithRequest` and immediately verify the transaction server-side via:

```
GET https://qa.interswitchng.com/collections/api/v1/gettransaction.json
    ?merchantcode=MX6072
    &transactionreference={txn_ref}
    &amount={amount_in_kobo}
```

We check two things before marking the payment as successful. The `ResponseCode` must be `"00"` (Approved by Financial Institution) and the returned amount must match exactly what we originally charged. Both must pass before anything is recorded in the database.

Here's a real verified transaction from our sandbox test:

```json
{
  "ResponseCode": "00",
  "ResponseDescription": "Approved by Financial Institution",
  "MerchantReference": "HMX_RENT_1774492241605_BJ454",
  "PaymentReference": "FBN|WEB|MX6072|26-03-2026|475014900|772887",
  "Amount": 3500000,
  "TransactionDate": "2026-03-26T03:27:55"
}
```

Payment was processed through First Bank Nigeria on the Interswitch network.

### Payment Flow — Live Demo Screenshots

The following screenshots show the complete end-to-end payment flow as tested live on device.


**Step 1 — Property Details with Pay Rent button**

![photo_2026-03-27_12-09-05](https://github.com/user-attachments/assets/70249285-5b69-476d-bd07-082f88fa1951)

**Step 2 — Secure Payment screen opens inside the app**

![photo_2026-03-27_12-09-17](https://github.com/user-attachments/assets/b98f6eca-0ca6-45a3-b506-710a3c2d2a33)

**Step 3 — Interswitch hosted checkout loads with all payment options**

![photo_2026-03-27_12-09-24](https://github.com/user-attachments/assets/61ede54d-6b72-4a87-ae64-16965b70243a)

**Step 4 — Card details entered (Verve test card)**

![photo_2026-03-27_12-09-45](https://github.com/user-attachments/assets/34abc97c-2d86-4d48-b181-cb5f6729299a)

**Step 5 — PIN entry**

![photo_2026-03-27_12-09-54](https://github.com/user-attachments/assets/db6534e2-57ae-4ea3-8685-64cbc8a77915)

**Step 6 — OTP verification**

![photo_2026-03-27_12-10-00](https://github.com/user-attachments/assets/bc37b86a-ab31-4f8f-a048-2ca9f517ceca)

**Step 7 — Interswitch confirms payment successful**

![photo_2026-03-27_12-10-05](https://github.com/user-attachments/assets/90465419-7f3a-415f-b011-d1ace1799ade)

**Step 8 — Homxe in-app success screen**

![photo_2026-03-27_12-10-11](https://github.com/user-attachments/assets/f1b5e7b1-e800-4a27-9040-0105c9a20b3d)

### Files involved

| File | What it does |
|---|---|
| `services/interswitchPayment.ts` | Builds checkout HTML and verifies transactions |
| `hooks/useInterswitchPayment.ts` | Manages the payment state machine |
| `app/(seeker)/property/pay/index.tsx` | Payment screen with WebView and success/failure UI |
| `features/seeker/property/components/PropertyActions.tsx` | Pay Rent button on property details |
| `app/(seeker)/(screens)/payments.tsx` | Tenant payment history screen |

### Why we focused on one integration

Interswitch offers 9 API categories and we reviewed all of them. For the hackathon, we made a deliberate decision to get one integration working correctly end-to-end rather than attempt multiple integrations halfway. The following APIs are on our immediate roadmap and fit naturally into what Homxe is building. Identity Verification (BVN/NIN) plugs directly into the KYC flow we already have scaffolded in the app. Bills Payment lets tenants pay electricity and water through the platform. Send Money handles landlord payouts after the platform takes its commission. SafeToken OTP secures in-app wallet transactions. And the CAC API lets us verify business landlords against the Corporate Affairs Commission database.

---

## Installation & Setup

```bash
git clone https://github.com/VinceBrun/HomxeApp.git
cd HomxeApp
npm install
npx expo start
```

Scan the QR code with Expo Go on your mobile device.

### Environment Variables

Create a `.env` file in the project root with the following:

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Interswitch (sandbox)
EXPO_PUBLIC_ISW_MERCHANT_CODE=MX6072
EXPO_PUBLIC_ISW_PAY_ITEM_ID=9405967
```

The Interswitch sandbox credentials above are the default public test credentials from Interswitch's documentation and work immediately without needing an account.

### Test Card (Sandbox)

| Field | Value |
|---|---|
| Card Number | `5061050254756707864` |
| Expiry | `06/26` |
| CVV | `111` |
| PIN | `1111` |
| OTP | `123456` (if prompted) |

---

## Navigation Structure

```
Seeker:   Home → Explore (Map) → Contact → Profile
Owner:    Dashboard → Properties → Services → Profile


Artisan:  Home → Jobs → Earnings → Profile
```

---

## What's Working vs What's Next

Everything listed here as working can be demonstrated live on Demo Day.

Authentication with OTP email verification is fully functional. Role-based navigation across Seeker, Owner, and Artisan personas works end-to-end. Property browsing, filtering, and map exploration are connected to real database records. The 5-step property creation flow with image upload is live. The owner dashboard pulls real data. Seekers can contact landlords directly via WhatsApp and phone call. The full rent payment flow via Interswitch works in sandbox with server-side verification. Payment history is recorded and displayed to the tenant.

What's still in progress: the in-app real-time chat system, the Vendor/Artisan marketplace and service payments, BVN/NIN KYC verification, the landlord payout system, and the admin dashboard.

---

## Team

**Progress Onwuka** *(UI/UX Designer)* designed the complete user experience for Homxe. She defined the user flows for property discovery, contact, and profile management, built the wireframes and navigation structure, and designed the high-fidelity screens including property cards, listing layouts, map interface, and the overall visual language of the app. She maintained design consistency across every screen.

**Vincent Neji** *(Full-Stack Developer)* built the entire application. He architected the role-based persona system, implemented authentication with OTP email verification, built property listing, filtering, and search logic, integrated Supabase as the backend, developed the 5-step property creation flow, connected the owner dashboard to real data, and implemented the full Interswitch payment flow from checkout through WebView integration to server-side verification and payment history recording.

---

## A Note on Repository History

During development, two individuals who were not registered hackathon participants briefly had access to this repository. One helped fix a `.gitignore` issue after `.env` was accidentally committed, and the other made minor README edits. Upon discovering that the rules require all contributors to be registered participants, their access was immediately revoked and their commits were removed from the repository history. Every line of application code — the entire architecture, all features, the Interswitch payment integration, and the Supabase backend — was written exclusively by the registered team members listed above. We wanted to be fully transparent about this rather than leave it unexplained.

---

## Vision

> A platform where people connect directly, transact transparently, and access property and services without barriers. Built for Africa, starting from Nigeria.

---

*Built for the Enyata × Interswitch Developer Community Buildathon, March 2026*
