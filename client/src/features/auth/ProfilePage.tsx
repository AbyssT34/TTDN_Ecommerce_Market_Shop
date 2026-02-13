import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import { Button, Input, GlassCard, toast, ProfileSkeleton } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { updateProfile, changePassword } from '@/lib/api/user';

// ═══════════════════════════════════════════════════════════════
// PROFILE PAGE
// ═══════════════════════════════════════════════════════════════

export const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, setAuth, token } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

    // Profile form state
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [isUpdating, setIsUpdating] = useState(false);

    // Password form state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    if (!user) {
        return <ProfileSkeleton />;
    }

    const handleUpdateProfile = async () => {
        if (!name.trim() || name.trim().length < 2) {
            toast.error('Tên phải có ít nhất 2 ký tự');
            return;
        }

        setIsUpdating(true);
        try {
            const result = await updateProfile({ name: name.trim(), phone: phone.trim() });
            // Update local auth store
            if (token) {
                setAuth(result.user as any, token);
            }
            toast.success(result.message);
        } catch (error: any) {
            const message = error.response?.data?.error || 'Cập nhật thất bại';
            toast.error(message);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (newPassword.length < 8) {
            toast.error('Mật khẩu mới phải có ít nhất 8 ký tự');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Xác nhận mật khẩu không khớp');
            return;
        }

        setIsChangingPassword(true);
        try {
            const result = await changePassword({ currentPassword, newPassword });
            toast.success(result.message);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            const message = error.response?.data?.error || 'Đổi mật khẩu thất bại';
            toast.error(message);
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            {/* Back Button */}
            <Button
                variant="ghost"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => navigate('/')}
                className="mb-6"
            >
                Quay lại
            </Button>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                {/* Avatar */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-emerald-500 mb-4 text-3xl font-bold text-white shadow-glow">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <p className="text-gray-400">{user.email}</p>
                <span className="badge-success mt-2">{user.role}</span>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <Button
                    variant={activeTab === 'profile' ? 'primary' : 'outline'}
                    leftIcon={<User className="w-4 h-4" />}
                    onClick={() => setActiveTab('profile')}
                >
                    Thông tin
                </Button>
                <Button
                    variant={activeTab === 'password' ? 'primary' : 'outline'}
                    leftIcon={<Lock className="w-4 h-4" />}
                    onClick={() => setActiveTab('password')}
                >
                    Đổi mật khẩu
                </Button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <GlassCard variant="dark" padding="lg">
                        <h2 className="text-xl font-bold text-white mb-6">Thông tin cá nhân</h2>

                        <div className="space-y-4">
                            {/* Email (readonly) */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                                <Input
                                    value={user.email}
                                    disabled
                                    className="opacity-60"
                                />
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1.5">Họ và tên</label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nhập họ và tên"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1.5">Số điện thoại</label>
                                <Input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>

                            {/* Save Button */}
                            <Button
                                variant="primary"
                                fullWidth
                                leftIcon={<Save className="w-4 h-4" />}
                                onClick={handleUpdateProfile}
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </Button>
                        </div>
                    </GlassCard>
                </motion.div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <GlassCard variant="dark" padding="lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Đổi mật khẩu</h2>
                            <button
                                onClick={() => setShowPasswords(!showPasswords)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Current Password */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1.5">Mật khẩu hiện tại</label>
                                <Input
                                    type={showPasswords ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu hiện tại"
                                />
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1.5">Mật khẩu mới</label>
                                <Input
                                    type={showPasswords ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Ít nhất 8 ký tự"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1.5">Xác nhận mật khẩu mới</label>
                                <Input
                                    type={showPasswords ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                            </div>

                            {/* Change Button */}
                            <Button
                                variant="primary"
                                fullWidth
                                leftIcon={<Lock className="w-4 h-4" />}
                                onClick={handleChangePassword}
                                disabled={isChangingPassword}
                            >
                                {isChangingPassword ? 'Đang đổi...' : 'Đổi mật khẩu'}
                            </Button>
                        </div>
                    </GlassCard>
                </motion.div>
            )}
        </div>
    );
};
