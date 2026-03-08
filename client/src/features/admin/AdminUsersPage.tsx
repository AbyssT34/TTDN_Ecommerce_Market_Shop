import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw, ChevronLeft, ChevronRight, AlertCircle, ShieldOff, ShieldCheck } from 'lucide-react';
import { adminGetAllUsers, adminToggleUserActive } from './services/adminApi';

const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

const ROLE_COLORS: Record<string, string> = {
    customer: 'text-gray-300 bg-gray-400/10',
    admin: 'text-blue-400 bg-blue-400/10',
    superadmin: 'text-purple-400 bg-purple-400/10',
};

export function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const fetchUsers = async (pg = page, q = search) => {
        setLoading(true);
        try {
            const data = await adminGetAllUsers({ page: pg, limit: 20, search: q || undefined });
            setUsers(data.users || []);
            setTotal(data.pagination?.total || 0);
            setTotalPages(data.pagination?.totalPages || 1);
        } catch {
            setError('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchUsers(1, search);
    };

    const handleToggle = async (user: any) => {
        const action = user.isActive ? 'vô hiệu hóa' : 'kích hoạt';
        if (!window.confirm(`Bạn có chắc muốn ${action} tài khoản "${user.name}"?`)) return;
        setTogglingId(user._id);
        try {
            await adminToggleUserActive(user._id);
            setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, isActive: !u.isActive } : u));
        } catch (err: any) {
            alert(err?.response?.data?.error || 'Thao tác thất bại');
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Quản lý Người dùng</h1>
                    <p className="text-gray-400 text-sm mt-1">Tổng: {total} người dùng</p>
                </div>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 text-sm"
                    />
                </div>
                <button type="submit" className="px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-white text-sm">Tìm</button>
                <button
                    type="button"
                    onClick={() => { setSearch(''); setPage(1); fetchUsers(1, ''); }}
                    className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
                    title="Làm mới"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </form>

            {error && (
                <div className="flex items-center gap-3 text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">Người dùng</th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">Vai trò</th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">Ngày tạo</th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">Trạng thái</th>
                                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={5} className="px-5 py-4">
                                            <div className="h-5 bg-white/5 rounded animate-pulse" />
                                        </td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-gray-400 py-12">Không có người dùng nào</td>
                                </tr>
                            ) : (
                                users.map((user, i) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.02 }}
                                        className="hover:bg-white/3 transition-colors"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-600/30 border border-white/10 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                    {user.name?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{user.name}</p>
                                                    <p className="text-xs text-gray-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${ROLE_COLORS[user.role] || 'text-gray-300 bg-gray-400/10'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-gray-300">{formatDate(user.createdAt)}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${user.isActive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                                                {user.isActive ? 'Hoạt động' : 'Bị khóa'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                onClick={() => handleToggle(user)}
                                                disabled={togglingId === user._id}
                                                title={user.isActive ? 'Vô hiệu hóa tài khoản' : 'Kích hoạt tài khoản'}
                                                className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${user.isActive
                                                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                                    : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                                }`}
                                            >
                                                {user.isActive
                                                    ? <ShieldOff className="w-3.5 h-3.5" />
                                                    : <ShieldCheck className="w-3.5 h-3.5" />
                                                }
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-4 border-t border-white/10">
                        <p className="text-sm text-gray-400">Trang {page} / {totalPages}</p>
                        <div className="flex gap-2">
                            <button onClick={() => { const p = Math.max(1, page - 1); setPage(p); fetchUsers(p); }} disabled={page === 1} className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white disabled:opacity-40">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button onClick={() => { const p = Math.min(totalPages, page + 1); setPage(p); fetchUsers(p); }} disabled={page === totalPages} className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white disabled:opacity-40">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
