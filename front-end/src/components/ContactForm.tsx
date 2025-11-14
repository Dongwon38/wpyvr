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
    <div className="mx-auto w-full max-w-2xl rounded-3xl border border-[#00749C]/10 bg-white p-6 shadow-md sm:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h3 className="mb-2 text-2xl font-black text-[#444140]">
            How can we help?
          </h3>
          <p className="text-sm text-[#444140]/70">
            Add a few details and one of our organizers will reach out within 24 hours.
          </p>
        </div>

      {/* Error Message */}
      {status.type === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 p-4"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-800">
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
              className="mb-1 block text-sm font-semibold text-[#444140]"
            >
              Name <span className="text-red-500">*</span>
            </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-[#00749C]/20 bg-white px-4 py-2.5 text-sm text-[#444140] transition-colors focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00749C]/20"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-semibold text-[#444140]"
            >
              Email <span className="text-red-500">*</span>
            </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-[#00749C]/20 bg-white px-4 py-2.5 text-sm text-[#444140] transition-colors focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00749C]/20"
            placeholder="your.email@example.com"
          />
        </div>

        {/* Phone */}
        <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-semibold text-[#444140]"
            >
              Phone Number
            </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#00749C]/20 bg-white px-4 py-2.5 text-sm text-[#444140] transition-colors focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00749C]/20"
              placeholder="(555) 123-4567"
          />
        </div>

        {/* Preferred Contact Method */}
        <div>
            <label
              htmlFor="preferred_contact"
              className="mb-1 block text-sm font-semibold text-[#444140]"
            >
              Preferred Contact Method
            </label>
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center">
              <input
                type="radio"
                name="preferred_contact"
                value="email"
                checked={formData.preferred_contact === "email"}
                onChange={handleChange}
                className="h-4 w-4 border-[#00749C]/20 text-[#00749C] focus:ring-2 focus:ring-[#00749C]/20"
              />
                <span className="ml-2 text-sm text-[#444140]">
                  Email
                </span>
            </label>
            <label className="flex cursor-pointer items-center">
              <input
                type="radio"
                name="preferred_contact"
                value="phone"
                checked={formData.preferred_contact === "phone"}
                onChange={handleChange}
                className="h-4 w-4 border-[#00749C]/20 text-[#00749C] focus:ring-2 focus:ring-[#00749C]/20"
              />
                <span className="ml-2 text-sm text-[#444140]">
                  Phone
                </span>
            </label>
          </div>
        </div>

        {/* Subject */}
        <div>
            <label
              htmlFor="subject"
              className="mb-1 block text-sm font-semibold text-[#444140]"
            >
              Subject
            </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#00749C]/20 bg-white px-4 py-2.5 text-sm text-[#444140] transition-colors focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00749C]/20"
            placeholder="What is this about?"
          />
        </div>

        {/* Message */}
        <div>
            <label
              htmlFor="message"
              className="mb-1 block text-sm font-semibold text-[#444140]"
            >
              Message <span className="text-red-500">*</span>
            </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full resize-none rounded-lg border border-[#00749C]/20 bg-white px-4 py-2.5 text-sm text-[#444140] transition-colors focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00749C]/20"
            placeholder="Your message..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status.type === "loading" || status.type === "success"}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#00749C] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#005A7A] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status.type === "loading" ? (
            <>
              <div className="relative h-4 w-4">
                <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                <div 
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin"
                  style={{ animationDuration: "0.6s" }}
                />
              </div>
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
            className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4"
          >
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
              <p className="text-sm font-medium text-green-800">
                Thanks for reaching out! A volunteer organizer will reply within about 24 hours.
              </p>
          </motion.div>
        )}
      </form>
    </div>
  );
}
