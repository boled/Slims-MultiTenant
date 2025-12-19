import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { UserProfile, Subscription } from '../../types';
import { Upload, CheckCircle, Clock, AlertCircle, LogOut, FileImage, Calendar, AlertTriangle, RefreshCw, CreditCard, Wallet, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface UserDashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [renewing, setRenewing] = useState(false);

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

  const handleRenewal = async () => {
    if (!subscription) return;
    if (!confirm("Apakah Anda yakin ingin memperpanjang layanan untuk 1 tahun ke depan dengan paket yang sama?")) return;

    setRenewing(true);
    try {
      // Create a NEW subscription record for the renewal
      // This preserves history and creates a new pending invoice
      const { error } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: user.id,
          plan_name: subscription.plan_name,
          price: subscription.price,
          status: 'pending'
        }]);

      if (error) throw error;

      alert("Tagihan perpanjangan berhasil dibuat. Silakan upload bukti pembayaran.");
      fetchSubscription(); // Will reload and show the new pending subscription
    } catch (err: any) {
      alert("Gagal memproses perpanjangan: " + err.message);
    } finally {
      setRenewing(false);
    }
  };

  const downloadInvoice = () => {
    if (!subscription) return;

    const doc = new jsPDF();
    const primaryColor = '#2563eb';
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(primaryColor);
    doc.text("INVOICE / TAGIHAN", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`CloudSLiMS Indonesia`, 105, 26, { align: "center" });
    
    doc.setDrawColor(200);
    doc.line(20, 32, 190, 32);

    // Invoice Info
    doc.setFontSize(10);
    doc.setTextColor(0);
    
    const today = new Date().toLocaleDateString('id-ID');
    const invoiceId = subscription.id.split('-')[0].toUpperCase();

    // Left Side (Bill To)
    doc.setFont("helvetica", "bold");
    doc.text("DITAGIHKAN KEPADA:", 20, 45);
    doc.setFont("helvetica", "normal");
    doc.text(user.full_name, 20, 52);
    doc.text(user.institution, 20, 58);
    doc.text(`Telp: ${user.phone}`, 20, 64);

    // Right Side (Invoice Detail)
    doc.text(`No. Invoice: INV-${invoiceId}`, 130, 45);
    doc.text(`Tanggal: ${today}`, 130, 52);
    doc.text(`Status: ${subscription.status.toUpperCase()}`, 130, 58);

    // Table Content
    let yPos = 80;
    
    // Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos, 170, 10, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("DESKRIPSI LAYANAN", 25, yPos + 7);
    doc.text("HARGA", 160, yPos + 7);
    
    yPos += 18;
    
    // Table Item
    doc.setFont("helvetica", "bold");
    doc.text(`Paket Langganan CloudSLiMS: ${subscription.plan_name}`, 25, yPos);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Domain: ${user.subdomain}.eslims.my.id`, 25, yPos + 6);
    doc.text(`Masa Aktif: 1 Tahun`, 25, yPos + 11);
    
    // Price
    doc.setFontSize(10);
    doc.text(`Rp ${subscription.price.toLocaleString('id-ID')}`, 160, yPos);
    
    // Total Line
    yPos += 20;
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL TAGIHAN:", 120, yPos);
    doc.setTextColor(primaryColor);
    doc.text(`Rp ${subscription.price.toLocaleString('id-ID')}`, 160, yPos);

    // Payment Info
    yPos += 20;
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("INSTRUKSI PEMBAYARAN:", 20, yPos);
    
    yPos += 8;
    doc.setFont("helvetica", "normal");
    doc.text("Silakan transfer sesuai nominal ke salah satu rekening berikut:", 20, yPos);
    
    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text("BANK MANDIRI", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text("139-00-1165110-0", 60, yPos);
    doc.text("a.n AGUN NURUL WIDIYANTO", 110, yPos);
    
    yPos += 7;
    doc.setFont("helvetica", "bold");
    doc.text("GOPAY / DANA", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text("0856-4781-8779", 60, yPos);
    doc.text("a.n AGUN NURUL WIDIYANTO", 110, yPos);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Terima kasih telah mempercayakan layanan perpustakaan digital Anda kepada CloudSLiMS.", 105, 280, { align: "center" });

    doc.save(`Invoice-CloudSLiMS-${user.subdomain}-${Date.now()}.pdf`);
  };

  // Helper to calculate days remaining
  const getDaysRemaining = (validUntil: string) => {
    const today = new Date();
    const expiry = new Date(validUntil);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const daysRemaining = subscription?.valid_until ? getDaysRemaining(subscription.valid_until) : 0;
  const isExpiringSoon = subscription?.status === 'active' && subscription?.valid_until && daysRemaining <= 30;
  const isExpired = subscription?.status === 'active' && subscription?.valid_until && daysRemaining < 0;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Sederhana */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold">CloudSLiMS</h1>
          <p className="text-xs text-slate-400">User Dashboard</p>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          <div className="bg-primary-600/20 text-primary-300 px-4 py-2 rounded-lg cursor-pointer">Overview</div>
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

        {/* Notifikasi Masa Aktif */}
        {isExpiringSoon && !isExpired && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start gap-3 animate-pulse">
            <AlertTriangle className="text-yellow-600 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-yellow-800">Masa Aktif Segera Habis!</h4>
              <p className="text-sm text-yellow-700">
                Layanan Anda akan berakhir dalam <span className="font-bold">{daysRemaining} hari</span>. 
                Segera lakukan perpanjangan agar layanan perpustakaan tidak terganggu.
              </p>
            </div>
          </div>
        )}

        {isExpired && (
          <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="text-red-600 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-red-800">Layanan Telah Berakhir</h4>
              <p className="text-sm text-red-700">
                Masa aktif layanan Anda telah habis. Silakan lakukan perpanjangan untuk mengaktifkan kembali akses.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-6">
           {/* Subscription Card */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="font-bold text-lg text-slate-800">Status Langganan</h3>
                
                <div className="flex gap-2">
                   {/* Download Invoice Button */}
                   {subscription && (
                     <button
                       onClick={downloadInvoice}
                       className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                       title="Download Tagihan PDF"
                     >
                       <Download size={16} />
                       <span className="hidden sm:inline">Invoice</span>
                     </button>
                   )}

                   {/* Renew Button */}
                   {subscription?.status === 'active' && (isExpiringSoon || isExpired) && (
                      <button 
                       onClick={handleRenewal}
                       disabled={renewing}
                       className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-70"
                      >
                        {renewing ? <RefreshCw className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                        Perpanjang Layanan
                      </button>
                   )}
                </div>
             </div>
             
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
                      <div className={`mt-4 p-3 rounded-lg flex items-center gap-3 ${isExpiringSoon || isExpired ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
                        <Calendar size={20} className={isExpiringSoon || isExpired ? 'text-red-600' : 'text-blue-600'} />
                        <div>
                          <p className={`text-xs font-semibold uppercase ${isExpiringSoon || isExpired ? 'text-red-600' : 'text-blue-600'}`}>
                            {isExpired ? 'Berakhir Pada' : 'Masa Aktif Sampai'}
                          </p>
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
                    {subscription.status === 'active' && !isExpired ? (
                       <div className="text-green-600">
                         <CheckCircle size={48} className="mx-auto mb-2" />
                         <p className="font-medium">Layanan Aktif</p>
                         <p className="text-sm text-slate-500 mt-2">Perpustakaan Anda sudah online.</p>
                       </div>
                    ) : (
                      <>
                        <h4 className="font-medium text-slate-900 mb-4">
                          {subscription.status === 'active' && isExpired 
                            ? "Layanan Non-Aktif" 
                            : "Konfirmasi Pembayaran"}
                        </h4>
                        
                        {/* Jika status active tapi expired, tampilkan instruksi renewal jika belum klik renew */}
                        {subscription.status === 'active' && isExpired ? (
                           <div className="text-sm text-slate-500">
                              <p className="mb-3">Silakan klik tombol <b>Perpanjang Layanan</b> di atas untuk membuat tagihan baru.</p>
                           </div>
                        ) : (
                          /* Jika status pending (Renewal created) atau rejected */
                          <>
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
                                {/* Informasi Pembayaran Baru */}
                                <div className="bg-white p-4 rounded-lg mb-6 text-left border border-slate-200 shadow-sm">
                                  <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                                     <h5 className="font-bold text-slate-700 text-sm">Rekening Pembayaran:</h5>
                                     <button onClick={downloadInvoice} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                       <Download size={12}/> Download PDF
                                     </button>
                                  </div>
                                  
                                  <div className="space-y-3 text-sm">
                                    <div>
                                      <p className="text-xs text-slate-500 mb-0.5">Atas Nama</p>
                                      <p className="font-bold text-slate-900 uppercase">AGUN NURUL WIDIYANTO</p>
                                    </div>
                                    
                                    <div className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-100">
                                       <div className="flex items-center gap-2">
                                         <CreditCard size={16} className="text-blue-600" />
                                         <span className="font-semibold text-slate-700">Bank Mandiri</span>
                                       </div>
                                       <span className="font-mono font-bold text-slate-900 select-all">1390011651100</span>
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-100">
                                       <div className="flex items-center gap-2">
                                         <Wallet size={16} className="text-blue-500" />
                                         <span className="font-semibold text-slate-700">GOPAY / DANA</span>
                                       </div>
                                       <span className="font-mono font-bold text-slate-900 select-all">085647818779</span>
                                    </div>
                                  </div>
                                </div>

                                <p className="text-sm text-slate-500 mb-4">
                                  Silakan transfer sebesar <b className="text-slate-900">Rp {subscription.price.toLocaleString()}</b> ke salah satu rekening di atas, lalu upload bukti transfer di sini.
                                </p>

                                <label className="cursor-pointer block w-full">
                                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                                  <div className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
                                    {uploading ? <Clock className="animate-spin" /> : <Upload size={18} />}
                                    <span>Upload Bukti Bayar</span>
                                  </div>
                                </label>
                              </div>
                            )}
                          </>
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