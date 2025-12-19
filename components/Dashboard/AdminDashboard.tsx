import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Subscription, UserProfile } from '../../types';
import { LogOut, Check, X, Users, DollarSign, AlertCircle, RefreshCw } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [subscriptions, setSubscriptions] = useState<(Subscription & { profiles: UserProfile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, pending: 0, revenue: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Pending Subs
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // @ts-ignore
        setSubscriptions(data);
        
        // Calculate Stats
        const totalUsers = data.length;
        const pending = data.filter(s => s.status === 'pending').length;
        const revenue = data.filter(s => s.status === 'active').reduce((acc, curr) => acc + curr.price, 0);
        setStats({ totalUsers, pending, revenue });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: 'active' | 'rejected') => {
    if (!confirm(`Ubah status menjadi ${newStatus}?`)) return;
    try {
      const { error } = await supabase.from('subscriptions').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      alert("Error updating status");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold">CloudSLiMS</h1>
          <p className="text-xs text-red-400 font-bold uppercase tracking-wider">Admin Panel</p>
        </div>
        <div className="p-4 border-t border-slate-800 mt-auto">
          <button onClick={onLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
          <button onClick={fetchData} className="p-2 bg-white rounded-full shadow hover:bg-slate-50 text-slate-600">
            <RefreshCw size={20} />
          </button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users size={24} /></div>
            <div>
              <p className="text-slate-500 text-sm">Total User</p>
              <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg"><AlertCircle size={24} /></div>
            <div>
              <p className="text-slate-500 text-sm">Pending Validasi</p>
              <h3 className="text-2xl font-bold">{stats.pending}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><DollarSign size={24} /></div>
            <div>
              <p className="text-slate-500 text-sm">Est. Revenue</p>
              <h3 className="text-2xl font-bold">Rp {stats.revenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* Validation Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800">Daftar Langganan & Validasi</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Instansi / Nama</th>
                  <th className="px-6 py-3 font-medium">Paket</th>
                  <th className="px-6 py-3 font-medium">Bukti Bayar</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{sub.profiles?.institution || 'N/A'}</div>
                      <div className="text-xs text-slate-500">{sub.profiles?.full_name}</div>
                      <div className="text-xs text-blue-500">{sub.profiles?.subdomain}.eslims.my.id</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium">{sub.plan_name}</span>
                      <div className="mt-1 text-slate-500">Rp {sub.price.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      {sub.payment_proof_url ? (
                        <a href={sub.payment_proof_url} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800 text-xs">
                          Lihat Foto
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">Belum upload</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                        sub.status === 'active' ? 'bg-green-100 text-green-700' :
                        sub.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {sub.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(sub.id, 'active')} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200" title="Approve">
                            <Check size={16} />
                          </button>
                          <button onClick={() => updateStatus(sub.id, 'rejected')} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200" title="Reject">
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {subscriptions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Tidak ada data.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;