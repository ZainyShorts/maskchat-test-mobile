"use client"

import type React from "react"

// React Imports
import { useState, useRef, useEffect } from "react"

// Next Imports
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

// MUI Imports
import useMediaQuery from "@mui/material/useMediaQuery"
import { styled, useTheme } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import Checkbox from "@mui/material/Checkbox"
import Button from "@mui/material/Button"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormHelperText from "@mui/material/FormHelperText"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import TextField from "@mui/material/TextField"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"

import { getLocalizedUrl } from "@/utils/i18n"
import type { Locale } from "@configs/i18n"

// Third-party Imports
import classnames from "classnames"

// Type Imports
import toast from "react-hot-toast"
import type { SystemMode } from "@core/types"

// Component Imports
import Link from "@components/Link"
import Logo from "@components/layout/shared/Logo"
import CustomTextField from "@core/components/mui/TextField"

// Config Imports
import themeConfig from "@configs/themeConfig"

// Hook Imports
import { useImageVariant } from "@core/hooks/useImageVariant"
import { useSettings } from "@core/hooks/useSettings"

import type { LoginUser } from "@/api/interface/userInterface"
import { loginUser } from "@/api/user"
import { useAuthStore } from "@/store/authStore"
import { getBaseUrl } from "../api/vars/vars"
import { getAllBusiness } from "@/api/business"

// Vars
const darkImg = "/images/pages/auth-mask-dark.png"
const lightImg = "/images/pages/auth-mask-light.png"
const darkIllustration = "/images/illustrations/auth/v2-login-dark.png"
const lightIllustration = "/images/illustrations/auth/v2-login-light.png"
const borderedDarkIllustration = "/images/illustrations/auth/v2-login-dark-border.png"
const borderedLightIllustration = "/images/illustrations/auth/v2-login-light-border.png"

// Styled Custom Components
const LoginIllustration = styled("img")(({ theme }) => ({
  zIndex: 2,
  blockSize: "auto",
  maxBlockSize: 680,
  maxInlineSize: "100%",
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550,
  },
  [theme.breakpoints.down("lg")]: {
    maxBlockSize: 450,
  },
}))

const MaskImg = styled("img")({
  blockSize: "auto",
  maxBlockSize: 355,
  inlineSize: "100%",
  position: "absolute",
  insetBlockEnd: 0,
  zIndex: -1,
})

const OTPInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    width: "56px",
    height: "56px",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    "& input": {
      textAlign: "center",
      padding: "16px 0",
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
        borderWidth: "2px",
      },
    },
  },
}))

const OTPModal = ({
  open,
  onClose,
  email,
  onSubmit,
  loading,
}: {
  open: boolean
  onClose: () => void
  email: string
  onSubmit: (code: string) => void
  loading: boolean
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    const newOtp = [...otp]

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i]
      }
    }

    setOtp(newOtp)

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "")
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    inputRefs.current[focusIndex]?.focus()
  }

  const handleSubmit = () => {
    const code = otp.join("")
    if (code.length === 6) {
      onSubmit(code)
    }
  }

  const handleKeyDownGlobal = (e: React.KeyboardEvent) => {
  if (e.key === "Enter") {
    e.preventDefault(); // prevent form submission if inside a form
    handleSubmit();
  }
};

  const isComplete = otp.every((digit) => digit !== "")

  useEffect(() => {
    if (open) {
      setOtp(["", "", "", "", "", ""])
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    }
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          padding: 2,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 2,
            }}
          >
            <i className="tabler-mail" style={{ fontSize: "32px", color: "white" }} />
          </Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Verify Your Email
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We&apos;ve sent a 6-digit verification code to
          </Typography>
          <Typography variant="body2" color="primary" fontWeight="medium">
            {email}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", pt: 0 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter the verification code below
          </Typography>


          <Box
  sx={{
    display: "flex",
    gap: 1.5,
    justifyContent: "center",
    mb: 3,
  }}
  onKeyDown={handleKeyDownGlobal}
>
  {otp.map((digit, index) => (
  <OTPInput
    key={index}
    value={digit}
    onChange={(e) => handleChange(index, e.target.value)}
    onKeyDown={(e) => handleKeyDown(index, e)} // keep only backspace logic
    onPaste={index === 0 ? handlePaste : undefined}
    inputRef={(el) => (inputRefs.current[index] = el)}
    inputProps={{
      maxLength: 1,
      pattern: "[0-9]",
      inputMode: "numeric",
    }}
    variant="outlined"
  />
))}
</Box>
        </Box>

        

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={!isComplete || loading}
          sx={{
            mb: 2,
            height: 48,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "16px",
            fontWeight: "medium",
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Verify Code"}
        </Button>

       
      </DialogContent>
    </Dialog>
  )
}

interface LoginFormData extends LoginUser {
  rememberMe: boolean
}

const Login = ({ mode }: { mode: SystemMode }) => {
  const { user, token, setToken, setUser } = useAuthStore()
  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingVerify, setLoadingVerify] = useState<boolean>(false)
  const { lang: locale } = useParams() as { lang: Locale }
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    defaultValues: {
    },
  })

  

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
          toast.dismiss()
          toast.success(res?.data?.message, {
            duration: 5000,
            position: "top-right",
          })
        }
      })
      .catch((error) => {
        toast.dismiss()
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


  const fetchBusiness = async () => {
      try {
        console.log('Starting fetchBusiness...')
        const response = await getAllBusiness()
        console.log('Full response:', response)
        console.log('Results array:', response?.data?.results)
        
        // Check if results exist and have data
        if (response?.data?.results && response.data.results.length > 0) {
          const businessId = response.data.results[0].business_id
          console.log('Extracted business_id:', businessId)
          if (businessId) {
            return(businessId)
          }
        } else {
          console.log('No business results found')
          return null
        }
      } catch (error: any) {
        console.log('Error in fetchBusiness:', error)
        console.log('Error details:', error.message, error.response?.data)
        return null
      }
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
      document.cookie = `auth_token=${data.token}; path=/; max-age=18000; Secure; HttpOnly`

      toast.success(data.message, {
        duration: 5000,
        position: "top-right",
      })

      if (data.user.subscription === false && Number(user?.user_type) === 1) {
        router.push(getLocalizedUrl("/account-settings", locale))
      } else {
        if(Number(data.user?.user_type) === 1){
          router.push(getLocalizedUrl("/home", locale))
        }
        else if(Number(data.user?.user_type) === 2){
          const businessId = await fetchBusiness();
          router.push(`/support/${businessId}`)
        }else{
          const businessId = await fetchBusiness();
          router.push(`/support/${businessId}`)
        }
      }
    } catch (error: any) {
      // Error handling
    } finally {
      setLoadingVerify(false)
    }
  }

  const handleClickShowPassword = () => setIsPasswordShown((show) => !show)

  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  // Hooks
  const router = useRouter()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down("md"))
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration,
  )

  return (
    <div className="flex bs-full justify-center">
      <div
        className={classnames(
          "flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden",
          {
            "border-ie": settings.skin === "bordered",
          },
        )}
      >
        <LoginIllustration src={characterIllustration} alt="character-illustration" />
        {!hidden && (
          <MaskImg
            alt="mask"
            src={authBackground}
            className={classnames({ "scale-x-[-1]": theme.direction === "rtl" })}
          />
        )}
      </div>
      <div className="flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]">
        <div className="absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]">
          <Logo />
        </div>
        <div className="flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0">
          <div className="flex flex-col gap-1">
            <Typography variant="h4">{`Welcome to ${themeConfig.templateName}! 👋🏻`}</Typography>
            <Typography>Please sign-in to your account and start the adventure</Typography>
          </div>
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <CustomTextField
              autoFocus
              fullWidth
              label="Email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <CustomTextField
              fullWidth
              label="Password"
              placeholder="············"
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
              helperText={errors.password?.message}
              id="outlined-adornment-password"
              type={isPasswordShown ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={handleClickShowPassword} onMouseDown={(e) => e.preventDefault()}>
                      <i className={isPasswordShown ? "tabler-eye-off" : "tabler-eye"} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <div className="flex justify-between items-center gap-x-3 gap-y-1 flex-wrap">
              
              <Link href={getLocalizedUrl("/forgot-password", locale)}>
                <Typography className="text-end" color="primary">
                  Forgot password?
                </Typography>
              </Link>
            </div>
            <Button fullWidth variant="contained" type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
            <div className="flex justify-center items-center flex-wrap gap-2">
              <Typography>New on our platform?</Typography>
              <Link href={getLocalizedUrl("/register", locale)}>
                <Typography color="primary">Create an account</Typography>
              </Link>
            </div>
          </form>

          <OTPModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            email={email}
            onSubmit={handleVerificationSubmit}
            loading={loadingVerify}
          />
        </div>
      </div>
    </div>
  )
}

export default Login


