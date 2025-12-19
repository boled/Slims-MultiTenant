import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { UserProfile, Subscription } from '../../types';
import { Upload, CheckCircle, Clock, AlertCircle, LogOut, FileImage, Calendar } from 'lucide-react';

interface UserDashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, [user.id]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (!error && data) {
        setSubscription(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !subscription) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(filePath);

      // 3. Update DB
      const { error: dbError } = await supabase
        .from('subscriptions')
        .update({ payment_proof_url: publicUrl, status: 'pending' })
        .eq('id', subscription.id);

      if (dbError) throw dbError;

      alert("Bukti pembayaran berhasil diupload!");
      fetchSubscription();
    } catch (error: any) {
      alert("Gagal upload: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Sederhana */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold">CloudSLiMS</h1>
          <p className="text-xs text-slate-400">User Dashboard</p>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          <div className="bg-primary-600/20 text-primary-300 px-4 py-2 rounded-lg">Overview</div>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
             <h2 className="text-2xl font-bold text-slate-900">Halo, {user.full_name}</h2>
             <p className="text-slate-500">{user.institution}</p>
          </div>
          <button onClick={onLogout} className="md:hidden text-slate-600"><LogOut /></button>
        </header>

        <div className="grid gap-6">
           {/* Subscription Card */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <h3 className="font-bold text-lg mb-4">Status Langganan</h3>
             
             {subscription ? (
               <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-600">Paket</span>
                      <span className="font-medium">{subscription.plan_name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-600">Domain</span>
                      <span className="font-medium text-primary-600">{user.subdomain}.eslims.my.id</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-600">Total Tagihan</span>
                      <span className="font-medium">Rp {subscription.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-slate-600">Status</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        subscription.status === 'active' ? 'bg-green-100 text-green-700' :
                        subscription.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {subscription.status}
                      </span>
                    </div>
                    
                    {/* Expiry Date Display */}
                    {subscription.status === 'active' && subscription.valid_until && (
                      <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-lg flex items-center gap-3">
                        <Calendar size={20} className="text-blue-600" />
                        <div>
                          <p className="text-xs text-blue-600 font-semibold uppercase">Masa Aktif Sampai</p>
                          <p className="font-bold">
                            {new Date(subscription.valid_until).toLocaleDateString('id-ID', { 
                              day: 'numeric', month: 'long', year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 bg-slate-50 p-6 rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                    {subscription.status === 'active' ? (
                       <div className="text-green-600">
                         <CheckCircle size={48} className="mx-auto mb-2" />
                         <p className="font-medium">Layanan Aktif</p>
                         <p className="text-sm text-slate-500 mt-2">Perpustakaan Anda sudah online.</p>
                       </div>
                    ) : (
                      <>
                        <h4 className="font-medium text-slate-900 mb-2">Konfirmasi Pembayaran</h4>
                        {subscription.payment_proof_url ? (
                           <div className="space-y-3 w-full">
                              <img src={subscription.payment_proof_url} alt="Bukti" className="h-32 w-full object-cover rounded border" />
                              <div className="flex items-center justify-center gap-2 text-yellow-600 text-sm">
                                <Clock size={16} />
                                <span>Menunggu Validasi Admin</span>
                              </div>
                           </div>
                        ) : (
                          <div className="w-full">
                            <p className="text-sm text-slate-500 mb-4">Silakan transfer ke BCA 1234567890 an. CloudSLiMS, lalu upload bukti transfer di sini.</p>
                            <label className="cursor-pointer block w-full">
                              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                              <div className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                {uploading ? <Clock className="animate-spin" /> : <Upload size={18} />}
                                <span>Upload Bukti Bayar</span>
                              </div>
                            </label>
                          </div>
                        )}
                      </>
                    )}
                  </div>
               </div>
             ) : (
               <div className="text-center py-8 text-slate-500">Belum ada data langganan.</div>
             )}
           </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;