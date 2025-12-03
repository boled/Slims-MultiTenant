import React from 'react';
import { Check } from 'lucide-react';
import { PricingTier } from '../types';

const tiers: PricingTier[] = [
  {
    name: "Starter",
    price: "Rp 150.000",
    description: "Cocok untuk SD/SMP dengan koleksi terbatas.",
    features: [
      "Hingga 2.000 Judul Buku",
      "500 Anggota",
      "Subdomain cloudslims.id",
      "Backup Mingguan",
      "Support via Email"
    ]
  },
  {
    name: "Pro",
    price: "Rp 350.000",
    description: "Ideal untuk SMA/SMK atau Universitas kecil.",
    features: [
      "Judul Buku Unlimited",
      "Anggota Unlimited",
      "Custom Domain (sch.id)",
      "Backup Harian",
      "Priority Support (WhatsApp)",
      "Akses API Basic"
    ],
    recommended: true
  },
  {
    name: "Enterprise",
    price: "Hubungi Kami",
    description: "Untuk Dinas Perpustakaan atau Kampus Besar.",
    features: [
      "Dedicated Server Resource",
      "White Label (Logo Sendiri)",
      "Integrasi AI Librarian",
      "Backup Realtime",
      "SLA 99.9%",
      "Training Staff via Zoom"
    ]
  }
];

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Harga Simpel & Transparan</h2>
          <p className="text-slate-600">Pilih paket yang sesuai dengan kebutuhan institusi Anda. Bisa upgrade kapan saja.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`relative bg-white rounded-2xl shadow-xl border ${tier.recommended ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-slate-200'} p-8 flex flex-col`}
            >
              {tier.recommended && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  Paling Laris
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                <p className="text-sm text-slate-500 mt-2">{tier.description}</p>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
                {tier.price.startsWith('Rp') && <span className="text-slate-500">/bulan</span>}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm">
                    <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  tier.recommended 
                    ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/25' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}
              >
                Pilih Paket {tier.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;