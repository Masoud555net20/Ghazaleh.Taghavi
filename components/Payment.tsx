
import React, { useState } from 'react';
import { UserIcon, PhoneIcon, CreditCardIcon, PencilIcon, CheckCircleIcon } from './Icons';

// A reusable InputField component with a label and an icon
const InputField: React.FC<{
  id: string;
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: JSX.Element;
  placeholder?: string;
  required?: boolean;
}> = ({ id, label, type, name, value, onChange, icon, placeholder, required = true }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
        {icon}
      </span>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      />
    </div>
  </div>
);


const Payment: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        amount: '',
        description: 'بابت هزینه مشاوره حقوقی',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Only allow numbers for amount
        if (name === 'amount' && !/^\d*$/.test(value)) {
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.amount) {
            setError('لطفاً تمامی فیلدهای ستاره‌دار را تکمیل نمایید.');
            return;
        }
        setError('');
        console.log('Payment submitted:', formData);
        // In a real application, you would integrate with a payment gateway here.
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <section id="payment" className="py-20 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-xl shadow-lg border border-amber-200">
                        <CheckCircleIcon />
                        <h3 className="text-2xl font-bold mb-2 text-gray-800">پرداخت با موفقیت انجام شد</h3>
                        <p className="text-gray-600">
                            متشکریم. پرداخت شما با موفقیت ثبت گردید. رسید الکترونیکی به زودی برای شما ارسال خواهد شد.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="payment" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">پرداخت آنلاین هزینه مشاوره</h2>
                    <p className="mt-4 text-lg text-gray-600">هزینه خدمات حقوقی و مشاوره را به سادگی و به صورت آنلاین پرداخت کنید.</p>
                    <div className="mt-4 w-24 h-1 bg-blue-700 mx-auto rounded"></div>
                </div>
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 sm:p-10 rounded-xl shadow-2xl border border-gray-200">
                         <InputField
                            id="payment-name"
                            label="نام و نام خانوادگی"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            icon={<UserIcon />}
                            placeholder="مثال: محمد رضایی"
                         />
                         <InputField
                            id="payment-phone"
                            label="شماره تماس"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            icon={<PhoneIcon />}
                            placeholder="مثال: 09123456789"
                         />
                        <InputField
                            id="amount"
                            label="مبلغ (تومان)"
                            type="text"
                            name="amount"
                            value={formData.amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            onChange={(e) => {
                                const { name, value } = e.target;
                                const numericValue = value.replace(/,/g, '');
                                if (/^\d*$/.test(numericValue)) {
                                     setFormData(prev => ({ ...prev, [name]: numericValue }));
                                }
                            }}
                            icon={<CreditCardIcon />}
                            placeholder="مبلغ را به تومان وارد کنید"
                        />
                         <InputField
                            id="description"
                            label="توضیحات"
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            icon={<PencilIcon />}
                            required={false}
                         />
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/50"
                        >
                            انتقال به درگاه پرداخت
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Payment;
