import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import {
    adminGetProductById,
    adminCreateProduct,
    adminUpdateProduct,
    uploadImage,
    getCategories,
} from './services/adminApi';

const UNITS = ['kg', 'gram', 'pack', 'bundle', 'carton', 'piece'] as const;
const STORAGE_TYPES = ['Nhiệt độ thường', 'Ngăn mát', 'Ngăn đông'] as const;
const ORIGINS = ['Đà Lạt', 'Miền Tây', 'Miền Bắc', 'Miền Trung', 'Nhập khẩu', 'Khác'];

const INITIAL_FORM = {
    name: '',
    description: '',
    price: '',
    stock: '',
    unit: 'kg',
    sku: '',
    category: '',
    tags: '',
    origin: '',
    storageType: 'Nhiệt độ thường',
    expiryDate: '',
    manufacturingDate: '',
};

export function AdminProductFormPage() {
    const { id } = useParams<{ id: string }>();
    const isEdit = id !== 'new' && !!id;
    const navigate = useNavigate();

    const [form, setForm] = useState({ ...INITIAL_FORM });
    const [images, setImages] = useState<string[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImg, setUploadingImg] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getCategories()
            .then((d) => setCategories(d.categories || d || []))
            .catch(() => {});

        if (isEdit) {
            adminGetProductById(id!)
                .then((d) => {
                    const p = d.product;
                    setForm({
                        name: p.name || '',
                        description: p.description || '',
                        price: String(p.price || ''),
                        stock: String(p.stockQuantity || ''),
                        unit: p.unit || 'kg',
                        sku: p.sku || '',
                        category: p.category?._id || p.category || '',
                        tags: (p.tags || []).join(', '),
                        origin: p.origin || '',
                        storageType: p.storageType || 'Nhiệt độ thường',
                        expiryDate: p.expiryDate ? p.expiryDate.slice(0, 10) : '',
                        manufacturingDate: p.manufacturingDate ? p.manufacturingDate.slice(0, 10) : '',
                    });
                    setImages(p.images || []);
                })
                .catch(() => setError('Không thể tải thông tin sản phẩm'))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        setUploadingImg(true);
        try {
            const newUrls: string[] = [];
            for (const file of files) {
                const reader = new FileReader();
                const base64 = await new Promise<string>((resolve) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
                const result = await uploadImage(base64);
                newUrls.push(result.url);
            }
            setImages((prev) => [...prev, ...newUrls]);
        } catch {
            setError('Tải ảnh lên thất bại. Vui lòng thử lại.');
        } finally {
            setUploadingImg(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = (idx: number) => {
        setImages((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (images.length === 0) {
            setError('Vui lòng tải lên ít nhất 1 ảnh sản phẩm');
            return;
        }

        setSubmitting(true);
        try {
            const payload: Record<string, any> = {
                ...form,
                price: parseInt(form.price),
                stock: parseInt(form.stock),
                stockQuantity: parseInt(form.stock),
                images,
                tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
                expiryDate: form.expiryDate || undefined,
                manufacturingDate: form.manufacturingDate || undefined,
            };

            if (isEdit) {
                await adminUpdateProduct(id!, payload);
                setSuccess('Cập nhật sản phẩm thành công!');
            } else {
                await adminCreateProduct(payload);
                setSuccess('Tạo sản phẩm thành công!');
                setTimeout(() => navigate('/admin/products'), 1200);
            }
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Thao tác thất bại. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => navigate('/admin/products')}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">{isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h1>
                    <p className="text-gray-400 text-sm mt-0.5">Điền thông tin sản phẩm bên dưới</p>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}
            {success && (
                <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
                        <h2 className="font-semibold text-white text-sm">Thông tin cơ bản</h2>

                        <InputField label="Tên sản phẩm *" placeholder="VD: Thịt bò Úc nhập khẩu" value={form.name} onChange={(v) => setForm(f => ({ ...f, name: v }))} required />

                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Mô tả *</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                                required
                                rows={4}
                                placeholder="Mô tả chi tiết về sản phẩm..."
                                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 text-sm resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Giá (VNĐ) *" type="number" placeholder="VD: 150000" value={form.price} onChange={(v) => setForm(f => ({ ...f, price: v }))} required min={0} />
                            <InputField label="Tồn kho *" type="number" placeholder="VD: 100" value={form.stock} onChange={(v) => setForm(f => ({ ...f, stock: v }))} required min={0} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <SelectField label="Đơn vị tính *" value={form.unit} options={UNITS.map(u => ({ value: u, label: u }))} onChange={(v) => setForm(f => ({ ...f, unit: v }))} />
                            <SelectField
                                label="Danh mục"
                                value={form.category}
                                options={categories.map(c => ({ value: c._id, label: c.name }))}
                                onChange={(v) => setForm(f => ({ ...f, category: v }))}
                                placeholder="Chọn danh mục"
                            />
                        </div>

                        <InputField label="SKU" placeholder="VD: BEEF-AU-001" value={form.sku} onChange={(v) => setForm(f => ({ ...f, sku: v }))} />
                        <InputField label="Tags (cách nhau dấu phảy)" placeholder="VD: tươi sống, nhập khẩu, bò" value={form.tags} onChange={(v) => setForm(f => ({ ...f, tags: v }))} />
                    </div>

                    {/* Food-Specific Info */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
                        <h2 className="font-semibold text-white text-sm">Thông tin thực phẩm</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <SelectField label="Nguồn gốc" value={form.origin} options={ORIGINS.map(o => ({ value: o, label: o }))} onChange={(v) => setForm(f => ({ ...f, origin: v }))} placeholder="Chọn nguồn gốc" />
                            <SelectField label="Bảo quản" value={form.storageType} options={STORAGE_TYPES.map(s => ({ value: s, label: s }))} onChange={(v) => setForm(f => ({ ...f, storageType: v }))} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Ngày sản xuất" type="date" value={form.manufacturingDate} onChange={(v) => setForm(f => ({ ...f, manufacturingDate: v }))} />
                            <InputField label="Hạn sử dụng" type="date" value={form.expiryDate} onChange={(v) => setForm(f => ({ ...f, expiryDate: v }))} />
                        </div>
                    </div>
                </div>

                {/* Right: Images */}
                <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                        <h2 className="font-semibold text-white text-sm">Hình ảnh sản phẩm *</h2>

                        {/* Upload button */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImg}
                            className="w-full border-2 border-dashed border-white/15 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-green-500/40 hover:bg-green-500/5 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {uploadingImg ? (
                                <Loader2 className="w-6 h-6 text-green-400 animate-spin" />
                            ) : (
                                <Upload className="w-6 h-6 text-gray-400" />
                            )}
                            <span className="text-sm text-gray-400">
                                {uploadingImg ? 'Đang tải ảnh...' : 'Nhấn để tải ảnh lên'}
                            </span>
                            <span className="text-xs text-gray-500">Hỗ trợ JPG, PNG (tối đa 5MB)</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                        />

                        {/* Image preview grid */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                                {images.map((url, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 group">
                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(i)}
                                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        {i === 0 && (
                                            <span className="absolute bottom-1.5 left-1.5 text-xs bg-green-500/80 text-white px-1.5 py-0.5 rounded-md">Chính</span>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center hover:border-white/25 transition-colors"
                                >
                                    <Plus className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={submitting || uploadingImg}
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isEdit ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="w-full py-3 border border-white/15 text-gray-400 font-medium rounded-xl hover:bg-white/5 transition-colors text-sm"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </form>
    );
}

// ─── Helper Components ─────────────────────────────────────────────────────────

interface InputFieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    required?: boolean;
    min?: number;
}
function InputField({ label, value, onChange, placeholder, type = 'text', required, min }: InputFieldProps) {
    return (
        <div>
            <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                min={min}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 text-sm"
            />
        </div>
    );
}

interface SelectFieldProps {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (v: string) => void;
    placeholder?: string;
}
function SelectField({ label, value, options, onChange, placeholder }: SelectFieldProps) {
    return (
        <div>
            <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-gray-900 border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-green-500/50 text-sm"
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
        </div>
    );
}
