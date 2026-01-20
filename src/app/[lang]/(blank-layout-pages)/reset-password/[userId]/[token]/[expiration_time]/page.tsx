"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"
import { useForm } from "react-hook-form"
import { Eye, EyeOff, ChevronLeft } from "lucide-react"

import type { resetPasswordUserType } from "@/api/interface/userInterface"
import { resetPassword } from "@/api/user"
import { getLocalizedUrl } from "@/utils/i18n"
import type { Locale } from "@/configs/i18n"
import Logo from "@/components/layout/shared/Logo"

export default function ResetPassword() {
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params

  const userId: string = (params?.userId as string) || ""
  const token: string = (params?.token as string) || ""
  const expiration_time: string = (params?.expiration_time as string) || ""

  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<resetPasswordUserType>()

  const onSubmit = async (data: resetPasswordUserType, e: any) => {
    e.preventDefault()

    if (data?.new_password !== data?.confirm_password) {
      toast.error("New Password and confirm password must be matched")
      return
    }

    setLoading(true)

    try {
      const res = await resetPassword({ new_password: data.new_password }, { userId, token, expiration_time })
      console.log(res, "resetPasswordresetPassword")
      if (res?.status === 200) {
        toast.success(res?.data?.message, {
          duration: 5000,
        })
        router.push(getLocalizedUrl("/en/login", locale as Locale))
      }
    } catch (error) {
      console.log(error, "error")
      toast.error("An error occurred while resetting the password.", {
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/dlasb4krd/image/upload/v1765773045/bgsdtt975k3m2g6ckziz.png)",
        }}
      />

      {/* Logo */}
      <div className="absolute top-8 left-8 z-10">
        <Logo />
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password 🔒</h1>
            <p className="text-white/70 text-sm">Your new password must be different from previously used passwords</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label htmlFor="new_password" className="block text-sm font-medium text-white mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new_password"
                  type={isPasswordShown ? "text" : "password"}
                  autoFocus
                  {...register("new_password", { required: "New Password is required" })}
                  className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordShown(!isPasswordShown)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                >
                  {isPasswordShown ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.new_password && <p className="mt-1 text-sm text-red-300">{errors.new_password.message}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm_password"
                  type={isConfirmPasswordShown ? "text" : "password"}
                  {...register("confirm_password", { required: "Confirm password is required" })}
                  className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                >
                  {isConfirmPasswordShown ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="mt-1 text-sm text-red-300">{errors.confirm_password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Setting Password..." : "Set New Password"}
            </button>

            {/* Back to Login Link */}
            <div className="text-center">
              <Link
                href="/en/login"
                className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors"
              >
                <ChevronLeft size={20} />
                <span>Back to login</span>
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Toaster />
    </div>
  )
}
