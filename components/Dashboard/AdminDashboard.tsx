import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Subscription, UserProfile } from '../../types';
import { 
  LogOut, 
  Check, 
  X, 
  Users, 
  DollarSign, 
  AlertCircle, 
  RefreshCw, 
  Search, 
  Trash2, 
  Edit, 
  ChevronLeft, 
  ChevronRight,
  Save,
  Eye,
  Filter,
  Calendar,
  Smartphone,
  Globe,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
  CreditCard
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface JoinedSubscription extends Subscription {
  profiles: UserProfile;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [subscriptions, setSubscriptions] = useState<JoinedSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, pending: 0, revenue: 0, mrr: 0 });

  // Features State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<JoinedSubscription | null>(null);
  const [editFormData, setEditFormData] = useState({
    full_name: '',
    institution: '',
    subdomain: '',
    plan_name: '',
    status: '',
    valid_until: ''
  });

  // View Details Modal State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<JoinedSubscription | null>(null);
  const [userHistory, setUserHistory] = useState<JoinedSubscription[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, roleFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch data joined with profiles
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // @ts-ignore
        setSubscriptions(data);
        
        // Calculate Stats
        const totalUsers = new Set(data.map((s: any) => s.user_id)).size;
        const pending = data.filter((s: any) => s.status === 'pending').length;
        
        // Revenue Calculation (Assuming stored price is Annual)
        const activeSubscriptions = data.filter((s: any) => s.status === 'active');
        const revenue = activeSubscriptions.reduce((acc: number, curr: any) => acc + curr.price, 0);
        const mrr = revenue / 12; // Monthly Recurring Revenue

        setStats({ totalUsers, pending, revenue, mrr });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: 'active' | 'rejected') => {
    const actionName = newStatus === 'active' ? 'Setujui & Aktifkan' : 'Tolak';
    if (!confirm(`Apakah Anda yakin ingin melakukan tindakan: ${actionName}?`)) return;
    
    try {
      const updates: any = { status: newStatus };
      
      // Jika di-approve menjadi active, set masa aktif 1 tahun dari HARI INI
      if (newStatus === 'active') {
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        updates.valid_until = nextYear.toISOString();
      }

      const { error } = await supabase.from('subscriptions').update(updates).eq('id', id);
      if (error) throw error;
      
      alert(`Status berhasil diperbarui menjadi ${newStatus}`);
      fetchData();
      if (isViewModalOpen) setIsViewModalOpen(false); // Close modal if open to refresh context
    } catch (err) {
      alert("Error updating status");
      console.error(err);
    }
  };

  const deleteSubscription = async (id: string, userId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini secara permanen?")) return;
    
    try {
      // Delete subscription
      const { error: subError } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);
      
      if (subError) throw subError;

      alert("Data berhasil dihapus");
      fetchData();
    } catch (err: any) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  const openEditModal = (item: JoinedSubscription) => {
    setEditingItem(item);
    setEditFormData({
      full_name: item.profiles?.full_name || '',
      institution: item.profiles?.institution || '',
      subdomain: item.profiles?.subdomain || '',
      plan_name: item.plan_name,
      status: item.status,
      valid_until: item.valid_until ? new Date(item.valid_until).toISOString().split('T')[0] : ''
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (item: JoinedSubscription) => {
    setViewingItem(item);
    // Filter history for this user from the already fetched subscriptions
    const history = subscriptions.filter(sub => sub.user_id === item.user_id);
    setUserHistory(history);
    setIsViewModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      // 1. Update Profile Data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: editFormData.full_name,
          institution: editFormData.institution,
          subdomain: editFormData.subdomain
        })
        .eq('id', editingItem.user_id);

      if (profileError) throw profileError;

      // 2. Update Subscription Data
      let newPrice = editingItem.price;
      // Update price if plan changed (simple logic)
      if (editFormData.plan_name !== editingItem.plan_name) {
        if (editFormData.plan_name === 'Starter') newPrice = 150000;
        if (editFormData.plan_name === 'Pro') newPrice = 350000;
      }
      
      // Jika status diubah manual jadi active lewat edit, update tanggal validasi jika belum ada
      const updates: any = {
        plan_name: editFormData.plan_name,
        status: editFormData.status,
        price: newPrice,
        valid_until: editFormData.valid_until ? new Date(editFormData.valid_until).toISOString() : null
      };

      // Auto-set 1 year if activating and no date set
      if (editFormData.status === 'active' && !updates.valid_until) {
         const nextYear = new Date();
         nextYear.setFullYear(nextYear.getFullYear() + 1);
         updates.valid_until = nextYear.toISOString();
      }

      const { error: subError } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', editingItem.id);

      if (subError) throw subError;

      setIsEditModalOpen(false);
      setEditingItem(null);
      alert("Data berhasil diperbarui!");
      fetchData();
    } catch (err: any) {
      alert("Gagal update: " + err.message);
    }
  };

  // --- Filtering & Pagination Logic ---

  const filteredSubscriptions = subscriptions.filter(item => {
    // 1. Search Term
    const term = searchTerm.toLowerCase();
    const inst = item.profiles?.institution?.toLowerCase() || '';
    const name = item.profiles?.full_name?.toLowerCase() || '';
    const domain = item.profiles?.subdomain?.toLowerCase() || '';
    const plan = item.plan_name.toLowerCase();
    
    const matchesSearch = inst.includes(term) || name.includes(term) || domain.includes(term) || plan.includes(term);

    // 2. Status Filter
    const matchesStatus = statusFilter === 'all' ? true : item.status === statusFilter;

    // 3. Role Filter
    const matchesRole = roleFilter === 'all' ? true : item.profiles?.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const paginatedData = filteredSubscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

      <main className="flex-1 p-8 overflow-y-auto relative">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
            <p className="text-slate-500 text-sm">Kelola pengguna dan validasi pembayaran.</p>
          </div>
          <button onClick={fetchData} className="p-2 bg-white rounded-full shadow hover:bg-slate-50 text-slate-600 transition-colors">
            <RefreshCw size={20} />
          </button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users size={24} /></div>
            <div>
              <p className="text-slate-500 text-sm">Total User Unik</p>
              <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg"><AlertCircle size={24} /></div>
            <div>
              <p className="text-slate-500 text-sm">Pending Validasi</p>
              <h3 className="text-2xl font-bold">{stats.pending}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><DollarSign size={24} /></div>
            <div>
              <p className="text-slate-500 text-sm">Total Revenue (ARR)</p>
              <h3 className="text-2xl font-bold">Rp {stats.revenue.toLocaleString()}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><TrendingUp size={24} /></div>
            <div>
              <p className="text-slate-500 text-sm">Est. MRR (Bulanan)</p>
              <h3 className="text-2xl font-bold">Rp {stats.mrr.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
            <h3 className="font-bold text-slate-800 whitespace-nowrap">Manajemen Tenant</h3>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
              {/* Filter Dropdowns */}
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-slate-400" />
                <select 
                  className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="rejected">Rejected</option>
                  <option value="expired">Expired</option>
                </select>

                <select 
                  className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">Semua Role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <input 
                  type="text" 
                  placeholder="Cari user..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Instansi / Nama</th>
                  <th className="px-6 py-3 font-medium">Paket</th>
                  <th className="px-6 py-3 font-medium">Bukti Bayar</th>
                  <th className="px-6 py-3 font-medium">Status & Masa Aktif</th>
                  <th className="px-6 py-3 font-medium text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-slate-900">{sub.profiles?.institution || 'N/A'}</div>
                        {sub.profiles?.role === 'admin' && (
                          <span className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">Admin</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">{sub.profiles?.full_name}</div>
                      <div className="text-xs text-blue-500 font-medium">{sub.profiles?.subdomain}.eslims.my.id</div>
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
                        <span className="text-slate-400 italic text-xs">Belum upload</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                          sub.status === 'active' ? 'bg-green-100 text-green-700' :
                          sub.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {sub.status}
                        </span>
                        {sub.status === 'active' && sub.valid_until && (
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Clock size={10} />
                            Exp: {new Date(sub.valid_until).toLocaleDateString('id-ID')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                         {/* View Details */}
                         <button 
                          onClick={() => openViewModal(sub)}
                          className="p-1.5 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors" 
                          title="Lihat Detail & Validasi"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Validation Actions */}
                        {sub.status === 'pending' && (
                          <>
                            <button onClick={() => updateStatus(sub.id, 'active')} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors" title="Approve & Activate 1 Year">
                              <Check size={16} />
                            </button>
                            <button onClick={() => updateStatus(sub.id, 'rejected')} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors" title="Reject">
                              <X size={16} />
                            </button>
                          </>
                        )}
                        
                        <div className="w-px h-4 bg-slate-300 mx-1"></div>

                        {/* Edit & Delete Actions */}
                        <button 
                          onClick={() => openEditModal(sub)}
                          className="p-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors" 
                          title="Edit Data"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => deleteSubscription(sub.id, sub.user_id)}
                          className="p-1.5 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 hover:text-red-600 transition-colors" 
                          title="Hapus User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search size={32} className="text-slate-300" />
                        <p>Tidak ada data ditemukan.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Halaman {currentPage} dari {totalPages || 1}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-300 rounded bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 border border-slate-300 rounded bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal Refined */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-800 px-6 py-4 flex items-center justify-between text-white shrink-0">
              <h3 className="font-bold flex items-center gap-2">
                <Edit size={18} /> Edit Data Tenant
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="hover:text-slate-300 transition-colors"><X size={20}/></button>
            </div>
            
            {/* Modal Body */}
            <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                
                {/* Section 1: Tenant Profile */}
                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-slate-800 border-b pb-2">
                      <Building2 size={18} className="text-blue-600" />
                      <h4 className="font-bold text-sm uppercase tracking-wide">Informasi Tenant</h4>
                   </div>
                   
                   <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nama Instansi</label>
                        <input 
                          type="text" 
                          required
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
                          value={editFormData.institution}
                          onChange={(e) => setEditFormData({...editFormData, institution: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nama Kontak</label>
                        <input 
                          type="text" 
                          required
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
                          value={editFormData.full_name}
                          onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Alamat Subdomain</label>
                        <div className="flex rounded-lg shadow-sm">
                           <input 
                            type="text" 
                            required
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 outline-none text-right font-medium text-slate-800"
                            value={editFormData.subdomain}
                            onChange={(e) => setEditFormData({...editFormData, subdomain: e.target.value})}
                          />
                          <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-slate-300 bg-slate-100 text-slate-500 text-sm">
                            .eslims.my.id
                          </span>
                        </div>
                      </div>
                   </div>
                </div>

                {/* Section 2: Subscription Status */}
                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-slate-800 border-b pb-2">
                      <CreditCard size={18} className="text-green-600" />
                      <h4 className="font-bold text-sm uppercase tracking-wide">Status & Paket</h4>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Pilih Paket</label>
                        <select 
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                          value={editFormData.plan_name}
                          onChange={(e) => setEditFormData({...editFormData, plan_name: e.target.value})}
                        >
                          <option value="Starter">Starter</option>
                          <option value="Pro">Pro</option>
                          <option value="Enterprise">Enterprise</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Status Akun</label>
                        <select 
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium ${
                            editFormData.status === 'active' ? 'bg-green-50 border-green-200 text-green-700' :
                            editFormData.status === 'pending' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                            'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                          value={editFormData.status}
                          onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                        >
                          <option value="pending">Pending</option>
                          <option value="active">Active</option>
                          <option value="rejected">Rejected</option>
                          <option value="expired">Expired</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Berlaku Sampai (Valid Until)</label>
                        <input 
                          type="date" 
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          value={editFormData.valid_until}
                          onChange={(e) => setEditFormData({...editFormData, valid_until: e.target.value})}
                        />
                         {editFormData.status === 'active' && !editFormData.valid_until && (
                           <div className="mt-2 flex items-start gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                              <AlertCircle size={14} className="mt-0.5 shrink-0" />
                              <p>Jika dikosongkan saat status <b>Active</b>, sistem akan otomatis set 1 tahun dari sekarang.</p>
                           </div>
                         )}
                      </div>
                   </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors text-sm font-medium"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors text-sm font-medium shadow-sm"
                >
                  <Save size={16} /> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && viewingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsViewModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up">
            <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white shrink-0">
              <h3 className="font-bold flex items-center gap-2">
                <Users size={18} /> Profil & Histori User
              </h3>
              <button onClick={() => setIsViewModalOpen(false)} className="hover:text-indigo-200"><X size={20}/></button>
            </div>
            
            <div className="overflow-y-auto p-6">
              {/* Profile Section */}
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                 <div className="flex-1 space-y-4">
                    <h4 className="text-lg font-bold text-slate-800 border-b pb-2">Informasi Profil</h4>
                    <div className="grid grid-cols-1 gap-y-3 text-sm">
                      <div className="flex items-center gap-3">
                        <Users size={16} className="text-slate-400" />
                        <span className="text-slate-500 w-24">Nama:</span>
                        <span className="font-medium text-slate-900">{viewingItem.profiles?.full_name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users size={16} className="text-slate-400" />
                        <span className="text-slate-500 w-24">Instansi:</span>
                        <span className="font-medium text-slate-900">{viewingItem.profiles?.institution}</span>
                      </div>
                       <div className="flex items-center gap-3">
                        <Smartphone size={16} className="text-slate-400" />
                        <span className="text-slate-500 w-24">Telepon:</span>
                        <span className="font-medium text-slate-900">{viewingItem.profiles?.phone || '-'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe size={16} className="text-slate-400" />
                        <span className="text-slate-500 w-24">Domain:</span>
                        <span className="font-medium text-blue-600">{viewingItem.profiles?.subdomain}.eslims.my.id</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="text-slate-400 w-4">ID</span>
                         <span className="text-xs font-mono text-slate-400">{viewingItem.user_id}</span>
                      </div>
                    </div>
                 </div>
                 
                 {/* Current Proof */}
                 <div className="w-full md:w-1/3">
                    <h4 className="text-lg font-bold text-slate-800 border-b pb-2 mb-3">Bukti Bayar Terkini</h4>
                    {viewingItem.payment_proof_url ? (
                      <a href={viewingItem.payment_proof_url} target="_blank" rel="noreferrer" className="block border rounded-lg overflow-hidden hover:opacity-90">
                        <img src={viewingItem.payment_proof_url} alt="Proof" className="w-full h-32 object-cover" />
                      </a>
                    ) : (
                      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg h-32 flex items-center justify-center text-slate-400 text-sm">
                        Tidak ada bukti
                      </div>
                    )}
                    
                    {/* Add Active Until Info Here */}
                    {viewingItem.valid_until && (
                      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                        <div className="text-xs text-green-600 font-bold uppercase mb-1">Berlaku Sampai</div>
                        <div className="font-medium text-green-800">
                          {new Date(viewingItem.valid_until).toLocaleDateString('id-ID', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    )}
                 </div>
              </div>

              {/* History Section */}
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <Calendar size={18} /> Riwayat Langganan
                </h4>
                <div className="border rounded-lg overflow-hidden">
                   <table className="w-full text-sm text-left">
                     <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                       <tr>
                         <th className="px-4 py-2">Tanggal</th>
                         <th className="px-4 py-2">Paket</th>
                         <th className="px-4 py-2">Harga</th>
                         <th className="px-4 py-2">Masa Aktif</th>
                         <th className="px-4 py-2">Status</th>
                         <th className="px-4 py-2">Bukti</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y">
                        {userHistory.map((hist) => (
                           <tr key={hist.id} className={hist.id === viewingItem.id ? "bg-blue-50/50" : ""}>
                              <td className="px-4 py-2 text-slate-600">
                                {new Date(hist.created_at).toLocaleDateString('id-ID')}
                              </td>
                              <td className="px-4 py-2 font-medium">{hist.plan_name}</td>
                              <td className="px-4 py-2">Rp {hist.price.toLocaleString()}</td>
                              <td className="px-4 py-2 text-slate-500">
                                {hist.valid_until 
                                  ? new Date(hist.valid_until).toLocaleDateString('id-ID') 
                                  : '-'}
                              </td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    hist.status === 'active' ? 'bg-green-100 text-green-700' :
                                    hist.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {hist.status}
                                </span>
                              </td>
                              <td className="px-4 py-2">
                                 {hist.payment_proof_url ? (
                                    <a href={hist.payment_proof_url} target="_blank" rel="noreferrer" className="text-blue-600 underline text-xs">Lihat</a>
                                 ) : '-'}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                   </table>
                </div>
              </div>

            </div>
            
            <div className="p-4 border-t bg-slate-50 flex justify-between items-center">
              {/* Validation Buttons Inside View Modal */}
              <div className="flex gap-2">
                 {viewingItem.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => updateStatus(viewingItem.id, 'active')}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors font-medium text-sm"
                      >
                        <CheckCircle size={16} /> Approve & Aktifkan
                      </button>
                      <button 
                        onClick={() => updateStatus(viewingItem.id, 'rejected')}
                        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm"
                      >
                        <XCircle size={16} /> Tolak
                      </button>
                    </>
                 )}
              </div>

              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg transition-colors font-medium text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;