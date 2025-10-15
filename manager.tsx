
// تعریف interfaceها
interface Consultation {
  id?: number;
  name: string;
  phone: string;
  consultation_type: string;
  preferred_date: string;
  preferred_time: string;
  message: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// تعریف نوع وضعیت‌ها
type StatusType = 'pending' | 'confirmed' | 'cancelled';
type ConsultationType = 'phone' | 'video' | 'in_person';

// کامپوننت اصلی مدیریت
const DatabaseManager = () => {
  // Stateهای اصلی
  const [consultations, setConsultations] = React.useState<Consultation[]>([]);
  const [filteredConsultations, setFilteredConsultations] = React.useState<Consultation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<StatusType | 'all'>('all');
  const [typeFilter, setTypeFilter] = React.useState<ConsultationType | 'all'>('all');
  const [showForm, setShowForm] = React.useState(false);
  const [editingConsultation, setEditingConsultation] = React.useState<Consultation | null>(null);
  const [stats, setStats] = React.useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0 });

  // API URL - استفاده از ورکر جدید public-api
  const API_URL = 'https://public-api.masoud555net.workers.dev/api/public/consultations';

  // بارگذاری داده‌ها
  const loadConsultations = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse<Consultation[]>>(API_URL);

      if (response.data.success && response.data.data) {
        setConsultations(response.data.data);
        setFilteredConsultations(response.data.data);
        calculateStats(response.data.data);
      } else {
        showNotification('خطا در بارگذاری داده‌ها', 'error');
      }
    } catch (error) {
      console.error('Error loading consultations:', error);
      showNotification('خطا در اتصال به سرور', 'error');
    } finally {
      setLoading(false);
    }
  };

  // محاسبه آمار
  const calculateStats = (data: Consultation[]) => {
    const total = data.length;
    const pending = data.filter(c => c.status === 'pending').length;
    const confirmed = data.filter(c => c.status === 'confirmed').length;
    const cancelled = data.filter(c => c.status === 'cancelled').length;

    setStats({ total, pending, confirmed, cancelled });
  };

  // فیلتر کردن داده‌ها
  const filterConsultations = () => {
    let filtered = consultations;

    // فیلتر جستجو
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name.includes(searchTerm) ||
        c.phone.includes(searchTerm) ||
        c.consultation_type.includes(searchTerm)
      );
    }

    // فیلتر وضعیت
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // فیلتر نوع مشاوره
    if (typeFilter !== 'all') {
      filtered = filtered.filter(c => c.consultation_type === typeFilter);
    }

    setFilteredConsultations(filtered);
  };

  // نمایش نوتیفیکیشن
  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    // ساده‌ترین راه برای نمایش نوتیفیکیشن
    alert(message);
  };

  // حذف رکورد
  const handleDelete = async (id: number) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این رکورد را حذف کنید؟')) return;

    try {
      const response = await axios.delete<ApiResponse<any>>(`${API_URL}/${id}`);

      if (response.data.success) {
        showNotification('رکورد با موفقیت حذف شد', 'success');
        loadConsultations();
      } else {
        showNotification('خطا در حذف رکورد', 'error');
      }
    } catch (error) {
      showNotification('خطا در اتصال به سرور', 'error');
    }
  };

  // ویرایش رکورد
  const handleEdit = (consultation: Consultation) => {
    setEditingConsultation(consultation);
    setShowForm(true);
  };

  // تغییر وضعیت
  const handleStatusChange = async (id: number, newStatus: StatusType) => {
    try {
      const response = await axios.put<ApiResponse<Consultation>>(`${API_URL}/${id}`, {
        status: newStatus
      });

      if (response.data.success) {
        showNotification('وضعیت با موفقیت تغییر کرد', 'success');
        loadConsultations();
      } else {
        showNotification('خطا در تغییر وضعیت', 'error');
      }
    } catch (error) {
      showNotification('خطا در اتصال به سرور', 'error');
    }
  };

  // فرمت کردن تاریخ
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  // فرمت کردن زمان
  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // نمایش فقط ساعت و دقیقه
  };

  // ترجمه وضعیت
  const translateStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'در انتظار',
      'confirmed': 'تایید شده',
      'cancelled': 'لغو شده'
    };
    return statusMap[status] || status;
  };

  // ترجمه نوع مشاوره
  const translateType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'phone': 'تلفنی',
      'video': 'ویدئویی',
      'in_person': 'حضوری'
    };
    return typeMap[type] || type;
  };

  // useEffectها
  React.useEffect(() => {
    loadConsultations();
  }, []);

  React.useEffect(() => {
    filterConsultations();
  }, [consultations, searchTerm, statusFilter, typeFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* هدر */}
      <header className="gradient-bg text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <i className="ri-database-2-line text-2xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold">مدیریت دیتابیس مشاوره حقوقی</h1>
                <p className="text-blue-100 mt-1">مدیریت رزروهای مشاوره به صورت گرافیکی</p>
              </div>
            </div>

            <button
              onClick={() => { setEditingConsultation(null); setShowForm(true); }}
              className="btn-primary px-6 py-3 rounded-lg font-medium flex items-center space-x-2 rtl:space-x-reverse"
            >
              <i className="ri-add-line"></i>
              <span>افزودن رزرو جدید</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* آمار */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">{stats.total}</div>
            <div className="text-gray-600">کل رزروها</div>
          </div>
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pending}</div>
            <div className="text-gray-600">در انتظار</div>
          </div>
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.confirmed}</div>
            <div className="text-gray-600">تایید شده</div>
          </div>
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{stats.cancelled}</div>
            <div className="text-gray-600">لغو شده</div>
          </div>
        </div>

        {/* فیلترها و جستجو */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* جستجو */}
            <div className="relative">
              <i className="ri-search-line absolute right-3 top-3 text-gray-400"></i>
              <input
                type="text"
                placeholder="جستجو در نام، تلفن یا نوع مشاوره..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* فیلتر وضعیت */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusType | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="pending">در انتظار</option>
              <option value="confirmed">تایید شده</option>
              <option value="cancelled">لغو شده</option>
            </select>

            {/* فیلتر نوع مشاوره */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ConsultationType | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">همه انواع</option>
              <option value="phone">تلفنی</option>
              <option value="video">ویدئویی</option>
              <option value="in_person">حضوری</option>
            </select>
          </div>
        </div>

        {/* جدول رکوردها */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="loading-shimmer h-16 rounded"></div>
                ))}
              </div>
            </div>
          ) : filteredConsultations.length === 0 ? (
            <div className="p-8 text-center">
              <i className="ri-inbox-line text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg">هیچ رکوردی یافت نشد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      نام و تلفن
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      نوع مشاوره
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاریخ و زمان
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      وضعیت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      پیام
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredConsultations.map((consultation) => (
                    <tr key={consultation.id} className="hover:bg-gray-50 fade-in">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{consultation.name}</div>
                        <div className="text-sm text-gray-500">{consultation.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {translateType(consultation.consultation_type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{formatDate(consultation.preferred_date)}</div>
                        <div className="text-gray-500">{formatTime(consultation.preferred_time)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={consultation.status || 'pending'}
                          onChange={(e) => handleStatusChange(consultation.id!, e.target.value as StatusType)}
                          className={`px-2 py-1 text-xs rounded-full border-0 cursor-pointer ${
                            consultation.status === 'pending' ? 'status-pending' :
                            consultation.status === 'confirmed' ? 'status-confirmed' : 'status-cancelled'
                          }`}
                        >
                          <option value="pending">در انتظار</option>
                          <option value="confirmed">تایید شده</option>
                          <option value="cancelled">لغو شده</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {consultation.message || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <button
                            onClick={() => handleEdit(consultation)}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="ویرایش"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(consultation.id!)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="حذف"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* فرم افزودن/ویرایش */}
      {showForm && (
        <ConsultationForm
          consultation={editingConsultation}
          onClose={() => { setShowForm(false); setEditingConsultation(null); }}
          onSave={() => { loadConsultations(); setShowForm(false); setEditingConsultation(null); }}
          apiUrl={API_URL}
        />
      )}
    </div>
  );
};

// رندر کردن اپ
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<DatabaseManager />);
