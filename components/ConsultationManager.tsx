import React, { useState, useEffect } from 'react';
import { consultationService, Consultation } from '../services/consultationService';

const ConsultationManager: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConsultations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await consultationService.getConsultations();

      if (response.success && response.data) {
        setConsultations(response.data);
      } else {
        setError(response.error || 'خطا در دریافت داده‌ها');
      }
    } catch (error) {
      setError('خطا در اتصال به سرور');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const formatTime = (timeString: string) => {
    // تبدیل فرمت زمان به فارسی
    const timeMap: { [key: string]: string } = {
      '10-12': '۱۰ الی ۱۲',
      '12-14': '۱۲ الی ۱۴',
      '16-18': '۱۶ الی ۱۸ (عصر)',
      '18-20': '۱۸ الی ۲۰ (عصر)',
    };
    return timeMap[timeString] || timeString;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { text: string; className: string } } = {
      pending: { text: 'در انتظار', className: 'bg-yellow-100 text-yellow-800' },
      confirmed: { text: 'تایید شده', className: 'bg-green-100 text-green-800' },
      completed: { text: 'انجام شده', className: 'bg-blue-100 text-blue-800' },
      cancelled: { text: 'لغو شده', className: 'bg-red-100 text-red-800' },
    };

    const statusInfo = statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.className}`}>
        {statusInfo.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        <span className="mr-2">در حال بارگذاری...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>{error}</p>
        <button
          onClick={fetchConsultations}
          className="mt-2 bg-red-700 text-white px-3 py-1 rounded text-sm hover:bg-red-800"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">مدیریت رزروهای مشاوره</h2>
        <button
          onClick={fetchConsultations}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          بروزرسانی
        </button>
      </div>

      {consultations.length === 0 ? (
        <p className="text-gray-500 text-center py-8">هیچ رزرو مشاوره‌ای یافت نشد.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نام و نام خانوادگی
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  شماره تماس
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نوع مشاوره
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاریخ پیشنهادی
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ساعت پیشنهادی
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  وضعیت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاریخ ایجاد
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {consultations.map((consultation) => (
                <tr key={consultation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {consultation.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {consultation.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {consultation.consultation_type === 'in-person' && 'مشاوره حضوری'}
                    {consultation.consultation_type === 'phone' && 'مشاوره تلفنی'}
                    {consultation.consultation_type === 'online' && 'مشاوره آنلاین (تصویری)'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(consultation.preferred_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTime(consultation.preferred_time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(consultation.status || 'pending')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {consultation.created_at ? formatDate(consultation.created_at) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        تعداد کل رزروها: {consultations.length}
      </div>
    </div>
  );
};

export default ConsultationManager;
