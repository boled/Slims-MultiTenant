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

Buka menu **SQL Editor** di dashboard Supabase dan jalankan script berikut. Script ini akan membuat tabel dan mengatur **Security Policies (RLS)** agar Admin bisa mengelola semua data.

```sql
-- 1. Create Profiles Table (extends Auth Users)
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  institution text,
  subdomain text,
  phone text,
  role text default 'user', -- 'admin' or 'user'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create Subscriptions Table
create table subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  plan_name text not null,
  price numeric not null,
  status text default 'pending', -- 'pending', 'active', 'rejected', 'expired'
  payment_proof_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Enable RLS (Row Level Security)
alter table profiles enable row level security;
alter table subscriptions enable row level security;

-- 4. Create Helper Function to Check Admin Role (Prevents Recursion)
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from profiles
    where id = auth.uid()
    and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 5. RLS Policies for Profiles
-- Semua orang (auth) bisa membaca profil (untuk join query)
create policy "Public profiles are viewable by everyone" 
on profiles for select using ( true );

-- User bisa update profil sendiri
create policy "Users can update own profile" 
on profiles for update using ( auth.uid() = id );

-- Admin bisa update semua profil
create policy "Admins can update any profile" 
on profiles for update using ( is_admin() );

-- User bisa insert profil sendiri saat register
create policy "Users can insert own profile" 
on profiles for insert with check ( auth.uid() = id );

-- 6. RLS Policies for Subscriptions
-- User bisa lihat punya sendiri, Admin bisa lihat semua
create policy "Read Access" 
on subscriptions for select using ( 
  auth.uid() = user_id OR is_admin() 
);

-- User bisa insert langganan sendiri
create policy "Insert Access" 
on subscriptions for insert with check ( 
  auth.uid() = user_id 
);

-- User bisa update (upload bukti), Admin bisa update status/harga/paket
create policy "Update Access" 
on subscriptions for update using ( 
  auth.uid() = user_id OR is_admin() 
);

-- Hanya Admin yang bisa menghapus langganan
create policy "Delete Access (Admin Only)" 
on subscriptions for delete using ( 
  is_admin() 
);
```

### 3. Setup Storage

1. Buka menu **Storage** di dashboard Supabase.
2. Buat bucket baru bernama `payment-proofs`.
3. Set bucket menjadi **Public**.
4. Tambahkan **Storage Policy** agar user bisa upload:
   *   Buat policy baru pada bucket `payment-proofs`.
   *   Pilih "Give users access to all individual operations".
   *   Select: `true` (Public)
   *   Insert: `auth.role() = 'authenticated'`
   *   Update: `auth.role() = 'authenticated'`

### 4. Setup Admin (Penting!)

Karena default registrasi adalah `user`, Anda harus mengubah satu akun menjadi `admin` secara manual di database agar bisa mengakses Dashboard Admin.

1. Register user baru melalui aplikasi web (misal: `admin@cloudslims.com`).
2. Buka dashboard Supabase > **Table Editor** > tabel `profiles`.
3. Cari user tersebut, ubah kolom `role` dari `user` menjadi `admin`.
4. Klik **Save**.
5. Logout dan Login kembali di aplikasi. Anda akan diarahkan ke Dashboard Admin.
