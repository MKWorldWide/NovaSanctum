import { useState } from 'react';
import { submitContact } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const initialState = {
  name: '',
  email: '',
  org: '',
  message: '',
};

const ContactForm = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in all required fields.');
      return false;
    }
    // Simple email regex
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    const { success, error } = await submitContact(form);
    setLoading(false);
    if (success) {
      setSuccess('Your message has entered the living matrix. We will respond soon.');
      setForm(initialState);
    } else {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-8 bg-bio-dark/80 rounded-xl border-2 border-neon-cyan/30 shadow-lg backdrop-blur-md"
      aria-label="Contact form"
    >
      <div className="mb-6">
        <label htmlFor="name" className="block text-bio-light font-semibold mb-2">
          Full Name <span className="text-plasma-gold">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          aria-label="Full Name"
          placeholder="Enter your full name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-bio-dark border-2 border-neon-cyan/40 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/60 text-bio-light placeholder-bio-light/50 transition outline-none shadow focus:shadow-neon-cyan/30 animate-glow"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="email" className="block text-bio-light font-semibold mb-2">
          Email <span className="text-plasma-gold">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          aria-label="Email"
          placeholder="you@domain.com"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-bio-dark border-2 border-neon-cyan/40 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/60 text-bio-light placeholder-bio-light/50 transition outline-none shadow focus:shadow-neon-cyan/30 animate-glow"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="org" className="block text-bio-light font-semibold mb-2">
          Organization
        </label>
        <input
          type="text"
          id="org"
          name="org"
          aria-label="Organization"
          placeholder="(Optional)"
          value={form.org}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-bio-dark border-2 border-neon-cyan/40 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/60 text-bio-light placeholder-bio-light/50 transition outline-none shadow focus:shadow-neon-cyan/30 animate-glow"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="message" className="block text-bio-light font-semibold mb-2">
          Message <span className="text-plasma-gold">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          aria-label="Message"
          placeholder="How can we help you transcend?"
          value={form.message}
          onChange={handleChange}
          rows={5}
          className="w-full px-4 py-2 rounded-lg bg-bio-dark border-2 border-neon-cyan/40 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/60 text-bio-light placeholder-bio-light/50 transition outline-none shadow focus:shadow-neon-cyan/30 resize-none animate-glow"
          required
        />
      </div>
      <div className="mb-4 text-xs text-bio-light/60 italic text-center">
        We respect your privacy. Your message is encrypted in spirit and in code.
      </div>
      <div aria-live="polite">
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-4 text-amber-400 bg-bio-dark/60 border-l-4 border-amber-400 px-4 py-2 rounded"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-4 text-green-400 bg-bio-dark/60 border-l-4 border-green-400 px-4 py-2 rounded"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-cyan to-plasma-gold text-bio-dark font-bold shadow-lg hover:from-neon-cyan/80 hover:to-plasma-gold/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neon-cyan/40 focus:ring-offset-2 disabled:opacity-60 focus:shadow-[0_0_0_2px_#00ffff55,0_0_8px_2px_#FFD70055] animate-glow"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </motion.button>
    </form>
  );
};

export default ContactForm; 