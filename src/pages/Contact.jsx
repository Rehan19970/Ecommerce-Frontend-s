import { useState } from 'react';
import api from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/contact', formData);
      setMessage({
        type: 'success',
        text: '✓ Message bhej diya gaya. Hum jald contact karenge.',
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Kuch masla ho gaya',
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Address',
      value: 'Lahore, Pakistan',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Phone',
      value: '+92 300 1234567',
      link: 'tel:+923001234567',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      value: 'info@roshys.com',
      link: 'mailto:info@roshys.com',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Hours',
      value: 'Mon-Sat: 10AM - 8PM',
    },
  ];

  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-brand-cream border-b border-gray-200">
        <div className="container-brand py-12 md:py-20 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
            Get in Touch
          </p>
          <h1 className="font-heading text-4xl md:text-6xl mb-4">
            Contact Us
          </h1>
          <p className="text-sm text-brand-grey max-w-xl mx-auto">
            Koi sawal, feedback, ya help chahiye? Hum se rabta karein — hum
            24 ghante mein jawab dete hain
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="container-brand py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h2 className="font-heading text-2xl mb-8">
              Contact Information
            </h2>

            <div className="space-y-6">
              {contactInfo.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-12 h-12 bg-brand-cream flex items-center justify-center text-brand-gold shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium mb-1">
                      {item.title}
                    </p>
                    {item.link ? (
                      <a
                        href={item.link}
                        className="text-sm hover:text-brand-gold transition"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <p className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium mb-4">
                Follow Us
              </p>
              <div className="flex gap-3">
                {['Facebook', 'Instagram', 'Twitter', 'WhatsApp'].map(
                  (social) => (
                    <a
                      key={social}
                      href="#"
                      aria-label={social}
                      className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold hover:text-white transition-all duration-300"
                    >
                      <span className="text-xs font-medium">
                        {social.charAt(0)}
                      </span>
                    </a>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-brand-cream border border-gray-200 p-6 md:p-10">
              <h2 className="font-heading text-2xl mb-2">Send a Message</h2>
              <p className="text-sm text-brand-grey mb-8">
                Form fill karein, hum jald contact karenge
              </p>

              {message.text && (
                <div
                  className={`p-4 mb-6 text-sm border-l-2 ${
                    message.type === 'success'
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'bg-red-50 border-red-500 text-red-700'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 text-sm bg-white focus:border-brand-gold focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 text-sm bg-white focus:border-brand-gold focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-2">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 text-sm bg-white focus:border-brand-gold focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 text-sm bg-white focus:border-brand-gold focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 text-sm bg-white focus:border-brand-gold focus:outline-none transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full md:w-auto bg-brand-black text-white px-10 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <span className="transform group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;