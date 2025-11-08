"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  preferred_contact: "email" | "phone";
  subject: string;
  message: string;
}

interface FormStatus {
  type: "idle" | "loading" | "success" | "error";
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    preferred_contact: "email",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<FormStatus>({ type: "idle" });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: "loading" });

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({
        type: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wpyvr/v1/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setStatus({
          type: "success",
          message: "Thank you for contacting us! We'll get back to you soon.",
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          preferred_contact: "email",
          subject: "",
          message: "",
        });
      } else {
        setStatus({
          type: "error",
          message: data.message || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Get in Touch
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          폼을 제출하면 스태프에게 바로 연락이 전달됩니다. 문의해주셔서 감사합니다.
        </p>
      </div>

      {/* Error Message */}
      {status.type === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-lg bg-red-50 p-4 dark:bg-red-900/20"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-800 dark:text-red-300">
            {status.message}
          </p>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            이메일 <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
            placeholder="your.email@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            전화번호
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
            placeholder="010-1234-5678"
          />
        </div>

        {/* Preferred Contact Method */}
        <div>
          <label
            htmlFor="preferred_contact"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            선호하는 연락 방식
          </label>
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center">
              <input
                type="radio"
                name="preferred_contact"
                value="email"
                checked={formData.preferred_contact === "email"}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                이메일
              </span>
            </label>
            <label className="flex cursor-pointer items-center">
              <input
                type="radio"
                name="preferred_contact"
                value="phone"
                checked={formData.preferred_contact === "phone"}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                전화번호
              </span>
            </label>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            제목
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
            placeholder="What is this about?"
          />
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
            placeholder="Your message..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status.type === "loading" || status.type === "success"}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status.type === "loading" ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Message
            </>
          )}
        </button>

        {/* Success Message - Below Button */}
        {status.type === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-lg bg-green-50 p-4 dark:bg-green-900/20"
          >
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              Thank you for contacting us! We'll get back to you soon.
            </p>
          </motion.div>
        )}
      </form>
    </div>
  );
}
