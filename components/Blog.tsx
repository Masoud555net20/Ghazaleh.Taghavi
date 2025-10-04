
import React from 'react';
import type { BlogPost } from '../types';

const blogData: BlogPost[] = [
  {
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
    category: 'حقوق خانواده',
    title: 'مهریه و نحوه مطالبه آن در حقوق ایران',
    excerpt: 'مهریه به عنوان یکی از حقوق مالی زن در عقد ازدواج، اهمیت ویژه‌ای دارد. در این مقاله به بررسی انواع مهریه و روش‌های قانونی مطالبه آن می‌پردازیم.',
    link: 'https://www.heyvalaw.com/web/articles/view/2345/%D9%85%D9%87%D8%B1%DB%8C%D9%87-%D9%88-%D9%86%D8%AD%D9%88%D9%87-%D9%85%D8%B7%D8%A7%D9%84%D8%A8%D9%87-%D8%A2%D9%86-%D8%AF%D8%B1-%D8%AD%D9%82%D9%88%D9%82-%D8%A7%DB%8C%D8%B1%D8%A7%D9%86'
  },
  {
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop',
    category: 'امور کیفری',
    title: 'مراحل دادرسی کیفری در نظام قضایی ایران',
    excerpt: 'دادرسی کیفری فرآیندی پیچیده است که از کشف جرم تا اجرای حکم ادامه دارد. با مراحل مختلف آن آشنا شوید.',
    link: 'https://www.heyvalaw.com/web/articles/view/3456/%D9%85%D8%B1%D8%A7%D8%AD%D9%84-%D8%AF%D8%A7%D8%AF%D8%B1%D8%B3%DB%8C-%DA%A9%DB%8C%D9%81%D8%B1%DB%8C-%D8%AF%D8%B1-%D9%86%D8%B8%D8%A7%D9%85-%D9%82%D8%B6%D8%A7%DB%8C%DB%8C-%D8%A7%DB%8C%D8%B1%D8%A7%D9%86'
  },
  {
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    category: 'حقوق کار',
    title: 'قراردادهای کاری و حقوق کارگران',
    excerpt: 'قرارداد کار پایه و اساس رابطه کارگر و کارفرما است. حقوق و تعهدات طرفین را در این مقاله بررسی کنید.',
    link: 'https://www.heyvalaw.com/web/articles/view/4567/%D9%82%D8%B1%D8%A7%D8%B1%D8%AF%D8%A7%D8%AF%D9%87%D8%A7%DB%8C-%DA%A9%D8%A7%D8%B1%DB%8C-%D9%88-%D8%AD%D9%82%D9%88%D9%82-%DA%A9%D8%A7%D8%B1%DA%AF%D8%B1%D8%A7%D9%86'
  },
];

const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300">
        <img className="w-full h-48 object-cover" src={post.image} alt={post.title} />
        <div className="p-6">
            <span className="text-sm font-semibold text-blue-600 bg-blue-100 py-1 px-3 rounded-full">{post.category}</span>
            <h3 className="mt-4 text-xl font-bold text-gray-800 hover:text-blue-700 transition-colors">
                <a href={post.link} target="_blank" rel="noopener noreferrer">{post.title}</a>
            </h3>
            <p className="mt-2 text-gray-600">{post.excerpt}</p>
            <a href={post.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-blue-700 font-semibold hover:underline">بیشتر بخوانید &rarr;</a>
        </div>
    </div>
);


const Blog: React.FC = () => {
    return (
        <section id="blog" className="py-20 bg-gray-100">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">آخرین مقالات حقوقی</h2>
                    <p className="mt-4 text-lg text-gray-600">دانش خود را با مطالعه تحلیل‌ها و مقالات کاربردی ما افزایش دهید</p>
                    <div className="mt-4 w-24 h-1 bg-blue-700 mx-auto rounded"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogData.map((post, index) => (
                        <BlogCard key={index} post={post} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Blog;
