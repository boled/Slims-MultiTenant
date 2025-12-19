# CloudSLiMS - Setup Guide

## Integrasi Supabase

Aplikasi ini sekarang terintegrasi dengan Supabase untuk Authentication, Database (User & Subscription), dan Storage (Bukti Pembayaran).

### 1. Setup Project Supabase

1. Buat project baru di [Supabase.io](https://supabase.io).
2. Dapatkan **Project URL** dan **Anon Key** dari menu Settings > API.
3. Masukkan credential tersebut ke dalam environment variables project Anda (misalnya `.env` untuk Vite):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Setup Database Schema

Buka menu **SQL Editor** di dashboard Supabase dan jalankan script berikut untuk membuat tabel yang diperlukan:

```sql
-- Create Profiles Table (extends Auth Users)
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  institution text,
  subdomain text,
  phone text,
  role text default 'user', -- 'admin' or 'user'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create Subscriptions Table
create table subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  plan_name text not null,
  price numeric not null,
  status text default 'pending', -- 'pending', 'active', 'rejected'
  payment_proof_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS (Row Level Security)
alter table profiles enable row level security;
alter table subscriptions enable row level security;

-- RLS Policies for Profiles
create policy "Public profiles are viewable by everyone." on profiles for select using ( true );
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );

-- RLS Policies for Subscriptions
create policy "Users can view own subs." on subscriptions for select using ( auth.uid() = user_id );
create policy "Users can insert own subs." on subscriptions for insert with check ( auth.uid() = user_id );
create policy "Users can update own subs (upload proof)." on subscriptions for update using ( auth.uid() = user_id );
```

### 3. Setup Storage

1. Buka menu **Storage** di dashboard Supabase.
2. Buat bucket baru bernama `payment-proofs`.
3. Set bucket menjadi **Public** atau atur Policy agar bisa dibaca/ditulis.
   
   **Policy Storage (Contoh sederhana untuk Publik):**
   *   INSERT: Allow Authenticated users.
   *   SELECT: Allow Public.

### 4. Setup Admin

Untuk membuat user menjadi Admin:
1. Register user melalui aplikasi biasa.
2. Buka **Table Editor** > tabel `profiles`.
3. Ubah kolom `role` dari `user` menjadi `admin`.
4. Login kembali dengan user tersebut untuk mengakses Dashboard Admin.

