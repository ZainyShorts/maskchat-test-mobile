"use client"
import { useState, useEffect, useRef  } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import type { SystemMode } from "@core/types"
import type { LoginUser } from "@/api/interface/userInterface"
import { loginUser } from "@/api/user"
import { useAuthStore } from "@/store/authStore"

import { getAllBusiness } from "@/api/business"
import { getLocalizedUrl } from "@/utils/i18n"
import type { Locale } from "@configs/i18n"
import { getBaseUrl } from "@/api/vars/vars"
import Logo from "@/components/layout/shared/Logo"

interface LoginFormData extends LoginUser {
  rememberMe: boolean
}

const Login = () => {
   const mode = "light"

  const { user, setToken, setUser } = useAuthStore()
  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loadingVerify, setLoadingVerify] = useState<boolean>(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const { lang: locale } = useParams() as { lang: Locale }
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const fetchBusiness = async () => {
    try {
      const response = await getAllBusiness()
      if (response?.data?.results && response.data.results.length > 0) {
        const businessId = response.data.results[0].business_id
        if (businessId) {
          return businessId
        }
      }
      return null
    } catch (error: any) {
      return null
    }
  }

  useEffect(() => {
  if (isModalOpen) {
    setOtp(["", "", "", "", "", ""])
    setTimeout(() => otpRefs.current[0]?.focus(), 100)
  }
}, [isModalOpen])


  const onSubmit = (data: LoginFormData, e: any) => {
    e.preventDefault()
    setEmail(data.email)
    setLoading(true)

    const loginData: LoginUser = {
      email: data.email,
      password: data.password,
    }

    loginUser(loginData)
      .then((res) => {
        if (res?.status === 200 && res?.data?.isActive) {
          toast.success("Email Verification Code is sent to your email.", {
            duration: 5000,
            position: "top-right",
          })
          setIsModalOpen(true)
        } else {
          toast.success(res?.data?.message, {
            duration: 5000,
            position: "top-right",
          })
        }
      })
      .catch((error) => {
        if (error.non_field_errors) {
          toast.error(error?.non_field_errors[0], {
            duration: 5000,
            position: "top-right",
          })
        } else if (typeof error === "string") {
          toast.error(error, {
            duration: 5000,
            position: "top-right",
          })
        } else {
          toast.error(error?.message, {
            duration: 5000,
            position: "top-right",
          })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleVerificationSubmit = async (code: string) => {
    setLoadingVerify(true)
    try {
      const url = `${getBaseUrl()}account/verify/`
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: Number.parseInt(code) }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        try {
          const errorJson = JSON.parse(errorText)
          if (errorJson?.code) {
            toast.error(errorJson?.code[0], {
              duration: 5000,
              position: "top-right",
            })
          } else {
            toast.error(errorJson?.error, {
              duration: 5000,
              position: "top-right",
            })
          }
        } catch {
          // Handle non-JSON error response
        }
        return
      }

      if (res?.status === 200) {
        setIsModalOpen(false)
      }

      const data = await res.json()

      localStorage.setItem("auth_token", data?.token)
      localStorage.setItem("user_type", data?.user?.user_type)
      setToken(data?.token)
      setUser(data?.user)

      toast.success(data.message, {
        duration: 5000,
        position: "top-right",
      })

      if (data.user.subscription === false && Number(user?.user_type) === 1) {
        router.push(getLocalizedUrl("/account-settings", locale))
      } else {
        if (Number(data.user?.user_type) == 4) {
          router.push(getLocalizedUrl("/news-letter", locale))
        }
        else if (Number(data.user?.user_type) === 1) {
          router.push(getLocalizedUrl("/home", locale))
        } else if (Number(data.user?.user_type) === 2) {
          const businessId = await fetchBusiness()
          router.push(`/support/${businessId}`)
        } else {
          const businessId = await fetchBusiness()
          router.push(`/support/${businessId}`)
        }
      }
    } catch (error: any) {
      // Error handling
    } finally {
      setLoadingVerify(false)
    }
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
      <div>
        <div className="absolute top-8 left-8">

      <Logo/>
        </div>
      </div>
      <div className="w-full max-w-md backdrop-blur-xl bg-white/20 rounded-3xl p-8 shadow-2xl border border-white/30">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            
            Welcome Back! <span className="text-4xl">👋</span>
          </h1>
          <p className="text-white/90 text-sm">Please sign in to your account and start the adventure</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-white/90">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="khurram@themaskchat.com"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                {...register("email", { required: "Email is required" })}
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

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-white/90">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-200 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <a href={getLocalizedUrl("/forgot-password", locale)} className="text-sm text-white/90 hover:text-white">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
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
              "Login"
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-white/90 text-sm">
            New on our platform?{" "}
            <a href={getLocalizedUrl("/register", locale)} className="text-white font-medium hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>

      {/* OTP Modal */}
{isModalOpen && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">

      {/* Logo - Top Left */}
      <div className="absolute top-4 left-4">
        <Logo />
      </div>

      {/* Close Button - Top Right */}
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        aria-label="Close"
      >
        ✕
      </button>

      <div className="text-center mb-6 mt-6">
        <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-600 text-sm mb-1">
          We&apos;ve sent a 6-digit verification code to
        </p>
        <p className="text-indigo-600 font-medium">{email}</p>
      </div>

      <div className="mb-6">
        
        <p className="text-center text-gray-600 text-sm mb-4">
          Enter the verification code below
        </p>

        <div className="flex gap-2 justify-center">
  {otp.map((digit, index) => (
    <input
      key={index}

        ref={(el) => {
  otpRefs.current[index] = el
}}

      type="text"
      inputMode="numeric"
      maxLength={1}
      value={digit}
      onChange={(e) => {
        const value = e.target.value

        // Allow only digits
        if (!/^\d?$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < 5) {
          otpRefs.current[index + 1]?.focus()
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
          otpRefs.current[index - 1]?.focus()
        }

        if (e.key === "Enter" && otp.every((d) => d)) {
          handleVerificationSubmit(otp.join(""))
        }
      }}
      onPaste={(e) => {
        e.preventDefault()
        const pasted = e.clipboardData
          .getData("text")
          .replace(/\D/g, "")
          .slice(0, 6)

        if (pasted.length === 6) {
          const newOtp = pasted.split("")
          setOtp(newOtp)
          otpRefs.current[5]?.focus()
        }
      }}
      className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
    />
  ))}
</div>

      </div>

      <button
        onClick={() => handleVerificationSubmit(otp.join(""))}
        disabled={loadingVerify || otp.some((d) => !d)}
        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loadingVerify ? (
          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          "Verify Code"
        )}
      </button>
    </div>
  </div>
)}

    </div>
  )
}

export default Login
