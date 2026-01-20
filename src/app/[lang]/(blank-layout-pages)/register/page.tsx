"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"
import { useForm } from "react-hook-form"
import type { SystemMode } from "@core/types"
import type { User } from "@/api/interface/userInterface"
import { getUserTypes, registerUser } from "@/api/user"
import { getLocalizedUrl } from "@/utils/i18n"
import type { Locale } from "@configs/i18n"
import Logo from "@/components/layout/shared/Logo"

interface UserRole {
  id: number
  type: string
}

const Register = () => {
  const mode = 'light'
  const { lang: locale } = useParams() as { lang: Locale }
  const router = useRouter()

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<User>()

  const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<User & { user_type: number }>()


  const [loading, setLoading] = useState<boolean>(false)
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [userTypes, setUserTypes] = useState<UserRole[]>([])
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  useEffect(() => {
    const fetchUserTypes = async () => {
      setLoading(true)

      try {
        const response = await getUserTypes()
        setUserTypes(response?.data || [])
      } catch (err: any) {
        // Handle error
      } finally {
        setLoading(false)
      }
    }

    fetchUserTypes()
  }, [])

  // const onSubmit = (data: User, e: any) => {
  //   e.preventDefault()

  //   if (!isChecked) {
  //     toast.error("You must agree to the terms and conditions to proceed.", {
  //       duration: 5000,
  //       position: "top-right",
  //     })
  //     return
  //   }

  //   // const user_type = userTypes.find((user) => user.type == "businessowner")

  //   // if (!user_type) {
  //   //   toast.error("Type businessowner missing", {
  //   //     duration: 5000,
  //   //     position: "top-right",
  //   //   })
  //   //   return
  //   // }

  //   setLoading(true)

  //   const submissionData = {
  //     ...data,
  //     status: "Active",
  //     user_type: user_type!.id,
  //   }

  //   registerUser(submissionData)
  //     .then((res) => {
  //       toast.success(res?.data?.message, {
  //         duration: 5000,
  //         position: "top-right",
  //       })
  //       router.replace(getLocalizedUrl("/login", locale))
  //     })
  //     .catch((error) => {
  //       if (error?.email) {
  //         toast.error(error?.email[0], {
  //           duration: 5000,
  //           position: "top-right",
  //         })
  //       } else {
  //         toast.error("An error occurred while registering", {
  //           duration: 5000,
  //           position: "top-right",
  //         })
  //       }
  //     })
  //     .finally(() => {
  //       setLoading(false)
  //     })
  // }

  const onSubmit = (data: User & { user_type: number }, e: any) => {
  e.preventDefault()

  if (!isChecked) {
    toast.error("You must agree to the terms and conditions to proceed.", {
      duration: 5000,
      position: "top-right",
    })
    return
  }

  setLoading(true)

  const submissionData = {
    ...data,
    status: "Active",
    user_type: data.user_type, // 👈 comes from dropdown (1 or 4)
  }

  registerUser(submissionData)
    .then((res) => {
      toast.success(res?.data?.message, {
        duration: 5000,
        position: "top-right",
      })
      router.replace(getLocalizedUrl("/login", locale))
    })
    .catch((error) => {
      if (error?.email) {
        toast.error(error?.email[0])
      } else {
        toast.error("An error occurred while registering")
      }
    })
    .finally(() => setLoading(false))
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
              
      <div className="w-full max-w-2xl backdrop-blur-xl bg-white/20 rounded-3xl p-8 shadow-2xl border border-white/30">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            Adventure starts here! <span className="text-4xl">🚀</span>
          </h1>
          <p className="text-white/90 text-sm">Make your app management easy and fun!</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Company Name Field */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-white/90">
              Company Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter company name"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              {...register("name", { required: "Company name is required" })}
            />
            {errors.name && <p className="text-red-200 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* First Name & Last Name - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="first_name" className="block text-sm font-medium text-white/90">
                First Name
              </label>
              <input
                id="first_name"
                type="text"
                placeholder="Enter your first name"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                {...register("first_name", { required: "First name is required" })}
              />
              {errors.first_name && <p className="text-red-200 text-xs mt-1">{errors.first_name.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="last_name" className="block text-sm font-medium text-white/90">
                Last Name
              </label>
              <input
                id="last_name"
                type="text"
                placeholder="Enter your last name"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                {...register("last_name", { required: "Last name is required" })}
              />
              {errors.last_name && <p className="text-red-200 text-xs mt-1">{errors.last_name.message}</p>}
            </div>
          </div>

          {/* Email & Mobile - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-white/90">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-200 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="mobile" className="block text-sm font-medium text-white/90">
                Mobile
              </label>
              <input
                id="mobile"
                type="text"
                placeholder="Enter your mobile"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                {...register("mobile", { required: "Mobile number is required" })}
              />
              {errors.mobile && <p className="text-red-200 text-xs mt-1">{errors.mobile.message}</p>}
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-white/90">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={isPasswordShown ? "text" : "password"}
                placeholder="••••••••••"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setIsPasswordShown(!isPasswordShown)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {isPasswordShown ? (
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

          {/* Country & City - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="country" className="block text-sm font-medium text-white/90">
                Country
              </label>
              <input
                id="country"
                type="text"
                placeholder="Enter your country"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                {...register("country", { required: "Country is required" })}
              />
              {errors.country && <p className="text-red-200 text-xs mt-1">{errors.country.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="city" className="block text-sm font-medium text-white/90">
                City
              </label>
              <input
                id="city"
                type="text"
                placeholder="Enter your city"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                {...register("city", { required: "City is required" })}
              />
              {errors.city && <p className="text-red-200 text-xs mt-1">{errors.city.message}</p>}
            </div>
          </div>

          {/* Address Field */}
          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium text-white/90">
              Address
            </label>
            <input
              id="address"
              type="text"
              placeholder="Enter your address"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && <p className="text-red-200 text-xs mt-1">{errors.address.message}</p>}
          </div>

          {/* Postal Code Field */}
          <div className="space-y-2">
            <label htmlFor="postalCode" className="block text-sm font-medium text-white/90">
              Postal Code
            </label>
            <input
              id="postalCode"
              type="text"
              placeholder="Enter postal code"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              {...register("postalCode", { required: "Postal code is required" })}
            />
            {errors.postalCode && <p className="text-red-200 text-xs mt-1">{errors.postalCode.message}</p>}
          </div>


          {/* User Type Dropdown */}
          <div className="space-y-2">
            <label htmlFor="user_type" className="block text-sm font-medium text-white/90">
              User Type
            </label>

            <select
              id="user_type"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              {...register("user_type", {
                required: "User type is required",
                valueAsNumber: true,
              })}
            >
              <option value="" className="text-black">
                Select user type
              </option>
              <option value={1} className="text-black">
                Business Owner
              </option>
              <option value={4} className="text-black">
                Newsletter
              </option>
            </select>

            {errors.user_type && (
              <p className="text-red-200 text-xs mt-1">{errors.user_type.message}</p>
            )}
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-4 h-4 rounded border-white/30 bg-white/10 text-indigo-500 focus:ring-2 focus:ring-white/50"
            />
            <label htmlFor="terms" className="text-sm text-white/90">
              I agree to{" "}
              <a href="#" className="text-white font-medium hover:underline">
                privacy policy & terms
              </a>
            </label>
          </div>


          


          {/* Sign Up Button */}
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
              "Sign Up"
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-white/90 text-sm">
            Already have an account?{" "}
            <a href={getLocalizedUrl("/login", locale)} className="text-white font-medium hover:underline">
              Sign in instead
            </a>
          </p>
        </div>
      </div>

      <Toaster />
    </div>
  )
}

export default Register
