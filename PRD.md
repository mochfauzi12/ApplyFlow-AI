# ApplyFlow AI - Product Requirements Document

**Version:** 1.1 (Updated Architecture)  
**Status:** MVP Planning  
**Last Updated:** June 2026  
**Document Owner:** Product Team

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Vision](#product-vision)
3. [Target Users](#target-users)
4. [Value Proposition](#value-proposition)
5. [User Journeys](#user-journeys)
6. [MVP Features](#mvp-features)
7. [Technical Architecture](#technical-architecture)
8. [Design System & UI/UX](#design-system--uiux)
9. [Success Metrics](#success-metrics)
10. [Roadmap](#roadmap)

---

## Executive Summary

**ApplyFlow AI** adalah platform berbasis Artificial Intelligence yang membantu job seeker menghemat waktu hingga **90%** dalam mengisi formulir rekrutmen. Pengguna hanya perlu mengunggah CV sekali, dan sistem akan secara otomatis:

- Mengekstrak data kandidat dari CV
- Menganalisis formulir dari recruiter
- Mengisi jawaban secara otomatis berdasarkan candidate profile
- Mendeteksi dan meminta informasi yang belum lengkap
- Menyimpan semua data untuk penggunaan berikutnya

**Target MVP Launch:** Q3 2026

---

## Product Vision

### Permasalahan

Active job seeker menghabiskan waktu berjam-jam setiap minggu untuk:

- Mengisi ulang informasi yang sama (nama, email, nomor telepon, pendidikan, pengalaman kerja)
- Menonton proses parsing yang manual
- Menyesuaikan CV ke setiap formulir yang berbeda-beda
- Mengingat informasi mana yang sudah diberikan ke recruiter mana

Proses ini repetitif, membosankan, dan mengurangi jumlah aplikasi yang bisa diserahkan dalam waktu yang sama.

### Solusi

ApplyFlow AI mengotomatiskan seluruh proses pengisian formulir rekrutmen dengan:

1. **Smart Resume Parsing** - Ekstrak data CV sekali menggunakan AI
2. **Candidate Profile** - Bangun profil lengkap yang dapat digunakan kembali
3. **AI Form Analysis** - Pahami struktur dan tipe input formulir recruiter
4. **Intelligent Matching** - Petakan field recruiter dengan data kandidat menggunakan semantic matching
5. **Autofill Engine** - Isi form secara otomatis dalam hitungan detik
6. **Missing Detection** - Identifikasi informasi yang belum lengkap
7. **Candidate Memory** - Simpan data baru untuk penggunaan berikutnya

### Core Value Proposition

> **Upload CV sekali. Bangun profil kandidat otomatis. Isi semua form recruiter dalam hitungan detik.**

---

## Target Users

### Primary Personas

| Persona | Pain Points | Need |
|---------|------------|------|
| **Fresh Graduate** | Banyak melamar tapi proses lambat | Tools untuk apply cepat ke banyak perusahaan |
| **Active Job Seeker** | Repetitif mengisi form sama berkali-kali | Otomasi pengisian form |
| **Software Engineer** | Sering melamar, form berbeda-beda | Smart matching untuk profile match |
| **QA Engineer** | Detail-oriented, ingin akurat | Validation dan missing field detection |
| **Professional** | Waktu terbatas, ingin efisien | Maximize number of applications |

### Target Market

- **Geographic:** Indonesia (Phase 1), Southeast Asia (Phase 2), Global (Phase 3)
- **Device:** Desktop primary, mobile secondary (Phase 2)
- **Age Range:** 18-45 years old
- **Job Level:** Entry-level to Mid-level professionals

---

## Value Proposition

### Key Benefits

1. **90% Faster Application Process** - Dari 15 menit per form menjadi 90 detik
2. **Consistency** - Jawaban yang konsisten di semua form
3. **Never Miss Required Fields** - Deteksi otomatis field yang belum diisi
4. **Smart Data Reuse** - Semua data disimpan untuk aplikasi berikutnya
5. **AI-Powered Matching** - Field matching yang akurat menggunakan semantic understanding
6. **Zero Manual Work** - Upload, analyze, autofill - Done

### Competitive Advantage

- **Smarter Form Analysis** - Bukan hanya upload, tapi benar-benar pahami struktur form
- **Semantic Field Matching** - AI yang mengerti konteks, bukan regex matching
- **Candidate Memory** - Pelajari profil user seiring waktu
- **Cost-Efficient Architecture** - Menggunakan *Frankenstein Free Stack* (Vercel, Supabase, Cloudflare R2, Inngest) untuk menekan biaya server ke titik terendah.

---

## User Journeys

### Journey 1: First Time Setup

```text
Step 1: Sign Up
└─ User creates account (via Supabase Auth)
   └─ Email verification
      └─ Account ready

Step 2: Resume Upload
└─ User uploads CV (PDF/DOCX)
   └─ System stores file in Cloudflare R2
      └─ Triggers async parsing job via Inngest

Step 3: Resume Parsing (Async Background Job)
└─ AI extracts candidate data (Claude/OpenAI)
   └─ System stores structured data in Supabase (PostgreSQL)
      └─ Creates initial candidate profile

Step 4: Review & Complete Profile
└─ User sees extracted data
   └─ User edits/adds missing information
      └─ User reviews all sections
         └─ Saves complete profile

Step 5: Profile Ready
└─ Candidate Profile created
   └─ User redirected to dashboard
      └─ Ready for first form upload
```

### Journey 2: Job Application with Form Autofill

```text
Step 1: Receive Form from Recruiter
└─ User receives PDF/DOCX form via email
   └─ User opens ApplyFlow dashboard
      └─ Click "Upload Recruiter Form"

Step 2: Upload Recruiter Form
└─ Drag & drop form file (PDF/DOCX)
   └─ System stores file in Cloudflare R2
      └─ Triggers async form analysis job via Inngest
         └─ Show progress indicator

Step 3: Form Analysis (Async)
└─ AI analyzes form structure
   └─ Detects all fields, labels, input types
      └─ System stores analysis in Supabase
         └─ Moves to field matching phase

Step 4: Field Matching & Autofill
└─ System matches recruiter fields with candidate profile
   └─ Generates suggested answers
      └─ Identifies missing information
         └─ Creates autofill preview

Step 5: Review Before Submit
└─ Show three-column layout:
   ├─ Recruiter Field | Suggested Answer | Status
   ├─ User reviews all answers
   ├─ For "Missing" fields, user provides input
   └─ Save to profile memory for future use

Step 6: Generate & Download Form
└─ System creates completed form
   └─ PDF/DOCX ready for submission
      └─ User downloads and submits to recruiter
         └─ Application history saved
```

---

## MVP Features

### Phase 1: Core Features (MVP)

#### 1. Authentication System

**Features:**
- Email registration with verification
- Email/password login
- Google OAuth login
- Secure session management

**Technical Implementation:**
- Powered by **Supabase Auth**.
- Session timeout dan reset password dihandle secara native oleh Supabase GoTrue.

#### 2. Resume Upload & Management

**Supported Formats:**
- PDF (.pdf)
- DOCX (.docx)

**Capabilities:**
- Drag & drop upload
- File size limit: 5MB
- Single resume per user (MVP)

**Storage:**
- Files disimpan di **Cloudflare R2** via pre-signed URLs (untuk menghindari limit egress).
- File naming: `{userId}/resumes/{resumeId}.{format}`

#### 3. Resume Parsing Engine

**Technical Implementation:**
- Menggunakan Claude/OpenAI API untuk ekstraksi data.
- **Inngest** digunakan sebagai queue/background worker untuk mengeksekusi AI parsing agar tidak terkena limit *timeout 10 detik* di Vercel Hobby Tier.
- Output JSON tersetruktur disimpan ke Supabase PostgreSQL.

#### 4. Candidate Profile Management

**Profile Sections:**
- Personal Information
- Professional Information
- Education
- Experience
- Skills
- Additional Information (Salary, Notice Period, dll)

**Profile Features:**
- Inline editing
- Perubahan disimpan langsung ke Supabase (PostgreSQL)
- Kalkulasi persentase kelengkapan profile

#### 5. Recruiter Form Upload & Management

- Drag & drop upload (up to 10MB)
- List forms uploaded
- Download completed forms

#### 6. AI Form Analyzer Service

**Detection Capabilities:**
- Text, dropdown, checkbox, radio, textarea, file upload.
- Labels, helper text, required flags.
- **Technical Implementation:** Claude Vision API + Inngest Background Job.

#### 7. Intelligent Field Matching
- Semantic understanding of field intent
- Candidate profile data matching
- Menyimpan *fallback* dan *confidence score*

#### 8. Autofill Engine
- Generate answers for matched fields
- Menjaga format form asli saat me-render PDF/DOCX hasil akhir.

#### 9. Missing Information Detection
- Popup modal dinamis jika ada form recruiter yang butuh data di luar profile.
- Data yang diisi akan otomatis ditambahkan ke Candidate Profile.

#### 10. Application History & Candidate Memory
- Menyimpan riwayat aplikasi.
- **Candidate Memory:** Mempelajari field baru yang pernah diisi user dan merekomendasikan jawaban yang sama di masa depan.

---

## Technical Architecture

### Technology Stack (Frankenstein Free Stack)

Pendekatan *Frankenstein Stack* ini dipilih untuk memastikan **biaya server $0** (di luar biaya OpenAI/Claude API) sambil tetap bisa menangani background job yang berat (AI Parsing).

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 (App Router) | React framework |
| | TypeScript | Type safety |
| | Tailwind CSS | Styling |
| | Framer Motion | Animations |
| **Hosting** | Vercel | Frontend & Edge deployment (Hobby Tier) |
| **Database** | Supabase (PostgreSQL) | Relational database (Free Tier) |
| **Auth** | Supabase Auth | User authentication (GoTrue) |
| **File Storage** | Cloudflare R2 | Object storage (10GB Free Tier) |
| **Background Jobs**| Inngest / Upstash | Async jobs & Queues (Bypass 10s Vercel timeout) |
| **AI/ML** | OpenAI / Claude | Text & vision models |

### Architecture Flow

```text
┌─────────────────────────────────────────────────┐
│              Next.js Frontend (Vercel)          │
│  (React, TypeScript, Tailwind, Framer Motion)   │
└─────────────────────────────────────────────────┘
         ↓ (Supabase Client)          ↓ (API Routes)
┌──────────────────┐         ┌────────────────────────┐
│  Supabase (BaaS) │         │ Next.js API (Vercel)   │
├──────────────────┤         ├────────────────────────┤
│ - PostgreSQL DB  │         │ /api/resume/upload     │
│ - Auth (GoTrue)  │         │ /api/form/upload       │
└──────────────────┘         │ /api/generate-presigned│
         ↑                   └────────────────────────┘
         │                            ↓ (Events)
┌──────────────────┐         ┌────────────────────────┐
│ Cloudflare R2    │ ←(Upload)│      Inngest          │
│ (S3 Compatible)  │         │  (Background Jobs)     │
└──────────────────┘         ├────────────────────────┤
                             │ - parse_resume         │
                             │ - analyze_form         │
                             └────────────────────────┘
                                      ↓
                             ┌────────────────────────┐
                             │ External AI APIs       │
                             │ - Claude / OpenAI      │
                             └────────────────────────┘
```

### Database Schema (Supabase PostgreSQL)

#### Profiles Table (Extends Supabase Auth `auth.users`)
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  
  -- Professional Info
  job_title TEXT,
  years_experience INTEGER,
  professional_summary TEXT,
  career_objective TEXT,
  
  -- Additional fields
  expected_salary TEXT,
  work_authorization TEXT,
  notice_period TEXT,
  willing_to_relocate BOOLEAN,
  
  -- Data
  profile_data_json JSONB,
  completeness_percentage INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
```

#### Resumes Table
```sql
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- R2 path
  file_type TEXT,
  file_size INTEGER,
  
  parsed_data_json JSONB,
  parse_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  parse_error TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Recruiter Forms Table
```sql
CREATE TABLE public.recruiter_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- R2 path
  file_type TEXT,
  file_size INTEGER,
  
  recruiter_name TEXT,
  position_title TEXT,
  
  analysis_status TEXT DEFAULT 'pending',
  analysis_json JSONB,
  analysis_error TEXT,
  
  autofill_status TEXT DEFAULT 'pending',
  autofill_json JSONB,
  autofill_percentage INTEGER,
  
  completed_form_path TEXT, -- R2 path
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Profile Memory Table
```sql
CREATE TABLE public.profile_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  form_id UUID REFERENCES public.recruiter_forms(id) ON DELETE SET NULL,
  
  field_label TEXT NOT NULL, 
  field_type TEXT, 
  user_answer TEXT, 
  confidence_score NUMERIC(5,2), 
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Background Jobs Implementation (Inngest)

Karena Vercel Hobby Tier membatasi eksekusi API hanya **10 detik**, memanggil AI untuk parsing dokumen akan sering *timeout*. **Inngest** digunakan untuk menjalankan fungsi secara async di luar limit tersebut.

#### Resume Parsing Job Example
```typescript
import { inngest } from "./client";

// Trigger job from Next.js API route
// await inngest.send({ name: 'resume/parse', data: { resumeId, userId, filePath } });

export const parseResumeJob = inngest.createFunction(
  { id: "parse-resume", retries: 3 },
  { event: "resume/parse" },
  async ({ event, step }) => {
    const { resumeId, userId, filePath } = event.data;
    
    const parsedData = await step.run("call-ai-parsing", async () => {
      // Panggil OpenAI / Claude API
      return await parseResumeWithClaude(filePath);
    });
    
    await step.run("update-db", async () => {
      // Simpan ke Supabase PostgreSQL
      await supabase.from('resumes').update({ parse_status: 'completed', parsed_data_json: parsedData }).eq('id', resumeId);
    });
    
    return { success: true };
  }
);
```

---

## Design System & UI/UX

### Design Philosophy

**Modern SaaS + Apple + Linear + Stripe**
- Minimalist aesthetic
- Premium feel
- AI-first positioning
- Smooth micro-interactions

### Color System

```css
/* Primary */
--primary-color: #7342E2;           /* Purple */

/* Text & Backgrounds */
--text-primary: #192837;            /* Dark gray */
--text-secondary: #6B7280;          /* Medium gray */
--background-primary: #F7F7F5;      /* Off-white */
--background-secondary: #FFFFFF;    /* White */
```

*(Bagian UI/UX Screens lainnya dipertahankan sesuai rancangan MVP awal)*

---

## Success Metrics

### Primary Metrics (North Star)
- **Time Saved Per Form:** < 2 minutes
- **Autofill Success Rate:** > 85%
- **Monthly Active Users:** 1,000

---

## Roadmap

### MVP (Q3 2026)
- Setup Vercel + Supabase + Inngest
- Authentication (Email + Google OAuth)
- Resume upload & parsing (via Inngest + Claude)
- Candidate profile management
- Recruiter form upload to R2
- AI form analysis
- Autofill engine & PDF generation

### V1.1 (Q4 2026)
- Chrome Extension untuk form detection
- UI/UX Polish

---

## Financial Projections & Cost Structure (MVP Tier)

Sistem ini didesain secara khusus menggunakan komponen gratis (*Free Tier*) terbaik dari setiap provider untuk menekan biaya ke $0 selama tahap validasi MVP.

### Cost Structure (Bulanan)

**Fixed Costs (Monthly) - Frankenstein Free Stack**
- **Vercel (Hosting/API):** $0 (Hobby Tier)
- **Supabase (DB/Auth):** $0 (Free Tier, 500MB DB, 50k MAU Auth)
- **Cloudflare R2 (Storage):** $0 (10GB Free Tier, Zero Egress)
- **Inngest (Background Jobs):** $0 (Free Tier, 100.000 events/bulan)
- **OpenAI/Claude API:** ~$10-$50 (Variabel *Pay-as-you-go* berdasarkan jumlah token)
- **Total Fixed MVP Cost:** **~$10 - $50/bulan** (100% dialokasikan hanya untuk biaya pemakaian AI API).

### Break-Even
- Break-even mudah dicapai karena hampir tidak ada *Server/Database maintenance cost*.

---

## Approval & Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Manager | [Name] | [Date] | [Sign] |
| Technical Lead | [Name] | [Date] | [Sign] |
| CEO/Founder | [Name] | [Date] | [Sign] |

---

**Document Version History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | June 2024 | Product Team | Initial PRD with Cloudflare Stack |
| 1.1 | June 2026 | Product Team | Refactored architecture to Vercel + Supabase + R2 + Inngest stack |
