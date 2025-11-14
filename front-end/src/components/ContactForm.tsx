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
      <div className="mx-auto w-full max-w-2xl rounded-[28px] border border-[#E4EBEF] bg-white/95 p-6 shadow-sm shadow-[#031926]/5 sm:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h3 className="mb-2 text-2xl font-black text-[#1F1C1A]">
            How can we help?
          </h3>
          <p className="text-sm text-[#6B6663]">
            Add a few details and one of our organizers will reach out within 24
            hours.
          </p>
        </div>

      {/* Error Message */}
      {status.type === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 rounded-2xl border border-[#FAD0D6] bg-[#FFF1F3] p-4 text-[#B42318]"
        >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{status.message}</p>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-semibold text-[#4C4744]"
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
              className="w-full rounded-2xl border border-[#E4EBEF] px-4 py-2.5 text-sm text-[#1F1C1A] transition focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00B7D3]/30"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-semibold text-[#4C4744]"
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
              className="w-full rounded-2xl border border-[#E4EBEF] px-4 py-2.5 text-sm text-[#1F1C1A] transition focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00B7D3]/30"
            placeholder="your.email@example.com"
          />
        </div>

        {/* Phone */}
        <div>
              <label
                htmlFor="phone"
                className="mb-1 block text-sm font-semibold text-[#4C4744]"
              >
              Phone Number
            </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
              className="w-full rounded-2xl border border-[#E4EBEF] px-4 py-2.5 text-sm text-[#1F1C1A] transition focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00B7D3]/30"
              placeholder="(555) 123-4567"
          />
        </div>

        {/* Preferred Contact Method */}
        <div>
              <label
                htmlFor="preferred_contact"
                className="mb-1 block text-sm font-semibold text-[#4C4744]"
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
                  className="h-4 w-4 border-[#E4EBEF] text-[#00749C] focus:ring-2 focus:ring-[#00B7D3]/30"
              />
                <span className="ml-2 text-sm text-[#4C4744]">Email</span>
            </label>
            <label className="flex cursor-pointer items-center">
              <input
                type="radio"
                name="preferred_contact"
                value="phone"
                checked={formData.preferred_contact === "phone"}
                onChange={handleChange}
                  className="h-4 w-4 border-[#E4EBEF] text-[#00749C] focus:ring-2 focus:ring-[#00B7D3]/30"
              />
                <span className="ml-2 text-sm text-[#4C4744]">Phone</span>
            </label>
          </div>
        </div>

        {/* Subject */}
        <div>
              <label
                htmlFor="subject"
                className="mb-1 block text-sm font-semibold text-[#4C4744]"
              >
              Subject
            </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
              className="w-full rounded-2xl border border-[#E4EBEF] px-4 py-2.5 text-sm text-[#1F1C1A] transition focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00B7D3]/30"
            placeholder="What is this about?"
          />
        </div>

        {/* Message */}
        <div>
              <label
                htmlFor="message"
                className="mb-1 block text-sm font-semibold text-[#4C4744]"
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
              className="w-full resize-none rounded-2xl border border-[#E4EBEF] px-4 py-2.5 text-sm text-[#1F1C1A] transition focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00B7D3]/30"
            placeholder="Your message..."
          />
        </div>

        {/* Submit Button */}
          <button
            type="submit"
            disabled={status.type === "loading" || status.type === "success"}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#00749C] to-[#00B7D3] px-6 py-3 text-sm font-bold text-white shadow-[0_20px_45px_rgba(0,116,156,0.35)] transition hover:-translate-y-0.5 hover:from-[#00688A] hover:to-[#00A2CA] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status.type === "loading" ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send message
              </>
            )}
          </button>

        {/* Success Message - Below Button */}
          {status.type === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-2xl border border-[#B7F0C4] bg-[#F0FFF4] p-4 text-[#1F6E43]"
            >
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">
                Thanks for reaching out! A volunteer organizer will reply within
                about 24 hours.
              </p>
            </motion.div>
          )}
      </form>
    </div>
  );
}
