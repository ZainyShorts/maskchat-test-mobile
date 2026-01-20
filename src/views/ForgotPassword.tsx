"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"
import { useForm } from "react-hook-form"
import type { SystemMode } from "@core/types"
import type { forgotPasswordUserType } from "@/api/interface/userInterface"
import { getLocalizedUrl } from "@/utils/i18n"
import type { Locale } from "@configs/i18n"
import { forgotPassword } from "@/api/user"

const ForgotPassword = ({ mode }: { mode: SystemMode }) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const { lang: locale } = useParams() as { lang: Locale }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgotPasswordUserType>()

  const onSubmit = (data: forgotPasswordUserType, e: any) => {
    e.preventDefault()
    setLoading(true)

    forgotPassword(data)
      .then((res) => {
        if (res?.status === 200) {
          toast.success(res?.data?.message, {
            duration: 5000,
          })
        }
      })
      .catch((error) => {
        toast.error(error?.data?.message, {
          duration: 5000,
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Forgot Password 🔒</h1>
            <p className="text-white/80 text-sm">
              Enter your email and we&apos;ll send you instructions to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center">
              <Link
                href={getLocalizedUrl("/login", locale)}
                className="inline-flex items-center gap-1.5 text-white/90 hover:text-white transition-colors text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to login</span>
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  )
}

export default ForgotPassword
