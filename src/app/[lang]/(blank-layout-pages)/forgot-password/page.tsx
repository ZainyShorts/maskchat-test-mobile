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
import Logo from "@/components/layout/shared/Logo"

const ForgotPassword = () => {

  const mode  = "light";

  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const { lang: locale } = useParams() as { lang: Locale }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgotPasswordUserType>()

  // const onSubmit = (data: forgotPasswordUserType, e: any) => {
  //   e.preventDefault()
  //   setLoading(true)

  //   forgotPassword(data)
  //     .then((res) => {
  //       if (res?.status === 200) {
  //         toast.success(res?.data?.message, {
  //           duration: 5000,
  //           position: "top-right",
  //         })
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(error?.data?.message, {
  //         duration: 5000,
  //         position: "top-right",
  //       })
  //     })
  //     .finally(() => {
  //       setLoading(false)
  //     })
  // }

  const onSubmit = (data: forgotPasswordUserType, e: any) => {
    // console.log(data, 'data-----')

    e.preventDefault()

    // setEmail(data.email)
    setLoading(true)

    forgotPassword(data)
      .then(res => {
        // console.log(res, '-----------')

        if (res?.status === 200) {
          toast.success(res?.data?.message, {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })

          // const token = res.data.token
          // if (isRememberMeChecked) {
          //   localStorage.setItem('auth_token', token)
          // } else {
          //   sessionStorage.setItem('auth_token', token)
          // }
        }
      })
      .catch(error => {
        // console.log(error, 'error')
        toast.error(error?.data?.message, {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })

        // if (error.non_field_errors) {
        //   toast.error(error?.non_field_errors[0])
        // } else if (typeof error === 'string') {
        //   toast.error(error)
        // } else {
        //   toast.error(error?.message)
        // }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url(https://res.cloudinary.com/dlasb4krd/image/upload/v1765773045/bgsdtt975k3m2g6ckziz.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute top-8 left-8">
        <Logo />
      </div>

      <div className="w-full max-w-md backdrop-blur-xl bg-white/20 rounded-3xl p-8 shadow-2xl border border-white/30">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Forgot Password 🔒</h1>
          <p className="text-white/90 text-sm">
            Enter your email and we&apos;ll send you instructions to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-white/90">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            {errors.email && <p className="text-red-200 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
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
      </div>

      <Toaster position="top-right" />
    </div>
  )
}

export default ForgotPassword
