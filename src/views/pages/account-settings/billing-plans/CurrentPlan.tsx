// "use client"

// // MUI Imports
// import Card from "@mui/material/Card"
// import CardHeader from "@mui/material/CardHeader"
// import CardContent from "@mui/material/CardContent"
// import Grid from "@mui/material/Grid"
// import Typography from "@mui/material/Typography"
// import Button from "@mui/material/Button"
// import Chip from "@mui/material/Chip"
// import Alert from "@mui/material/Alert"
// import AlertTitle from "@mui/material/AlertTitle"
// import LinearProgress from "@mui/material/LinearProgress"
// import type { ButtonProps } from "@mui/material/Button"

// // Type Imports
// import type { PricingPlanType } from "@/types/pages/pricingTypes"
// import type { ThemeColor } from "@core/types"
// import { differenceInDays, format, parseISO } from "date-fns"

// // Component Imports
// import ConfirmationDialog from "@components/dialogs/confirmation-dialog"
// import OpenDialogOnElementClick from "@components/dialogs/OpenDialogOnElementClick"
// import { useAuthStore } from "@/store/authStore"
// import { loadStripe } from "@stripe/stripe-js"
// import { ENDPOINTS, getBaseUrl } from "@/api/vars/vars"
// import { useEffect, useState } from "react"
// import ConfirmationModal from "@/components/dialogs/confirm-modal"
// import PayPalSubscribeButton from "./PaypalButton"

// // Type definitions for subscription data
// interface SubscriptionData {
//   plan_type: string
//   end_date: string
//   start_date: string
//   status: "active"  | "canceled" | "expired"
//   provider_type: "stripe" | "paypal"
// }

// interface User {
//   subscription: boolean
//   email: string
// }

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY as string)

// const CurrentPlan = ({ data }: { data: PricingPlanType[] }) => {
//   const buttonProps = (
//     children: string,
//     color: ThemeColor,
//     variant: ButtonProps["variant"],
//     disabled?: boolean,
//   ): ButtonProps => ({
//     children,
//     variant,
//     color,
//     disabled,
//   })

//   const { user }: { user: User | null } = useAuthStore()
  

//   const [subData, setSubData] = useState<SubscriptionData | undefined>(undefined)
//   const hasSubscription = user?.subscription === true
//   //confirmation modal for delete
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [hideBtn,setHideBtn] = useState(false)

//   // Fetch data from API
//   const fetchSubscription = async () => {
//     try {
//       const authToken = localStorage.getItem("auth_token")

      

//       if (!authToken) {
//         throw new Error("No authentication token found")
//       }

//       const response = await fetch(`${getBaseUrl()}account/${ENDPOINTS.subscription}/`, {
//         method: "GET",
//         headers: {
//           Authorization: `Token ${authToken}`,
//           "Content-Type": "application/json",
//         },
//       })

//       if(response.status === 401){
//       window.location.href = '/en/login'
//     }

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const result: SubscriptionData = await response.json()
//       console.log(result)
//       setSubData(result)
//     } catch (err) {
//       console.error("Error fetching invoices:", err)
//     }
//   }
//   useEffect(() => {

//     fetchSubscription()
//   }, [])

//   const handleStripePayment = async () => {
//     console.log("Stripe payment initiated")
//     try {
//       const stripe = await stripePromise;

//       const response = await fetch(`${getBaseUrl()}account/${ENDPOINTS.stripeCheckout}/`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Token ${localStorage.getItem("auth_token")}`,
//           "Content-Type": "application/json",
//         }
//       });

//       if(response.status === 401){
//       window.location.href = '/en/login'
//     }

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const session = await response.json();

//       console.log("Session response:", session);

//       if (stripe) {
//         const { error } = await stripe.redirectToCheckout({
//           sessionId: session.sessionId,
//         });

//         if (error) {
//           console.error("Error redirecting to checkout:", error);
//         }
//       } else {
//         console.error("Stripe.js failed to load.");
//       }
//     } catch (err) {
//       console.error("Checkout error:", err);
//     }
//   }



//   const cancelUserSubscription = async () => {
//   setHideBtn(true)
//   try {
//     const authToken = localStorage.getItem("auth_token");

//     if (!authToken) {
//       throw new Error("No authentication token found");
//     }

//     const response = await fetch(`${getBaseUrl()}account/${ENDPOINTS.cancelSubscription}/`, {
//       method: "POST",
//       headers: {
//         Authorization: `Token ${authToken}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if(response.status === 401){
//       window.location.href = '/en/login'
//     }

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
//     }

//     const result = await response.json();
//     fetchSubscription()

//     // Optional: Refresh subscription data    
//   } catch (err) {
//     setHideBtn(false)
//     console.error("Error cancelling subscription:", err);
//   }
// };

// const renewStripeSubscription = async () => {
//   try {
//     const authToken = localStorage.getItem("auth_token");

//     if (!authToken) {
//       throw new Error("No authentication token found");
//     }

//     const response = await fetch(`${getBaseUrl()}account/${ENDPOINTS.renewSubscription}/`, {
//       method: "POST",
//       headers: {
//         Authorization: `Token ${authToken}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if(response.status === 401){
//       window.location.href = '/en/login'
//     }
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
    
//     const result = await response.json();
//     console.log(result)
    
//     // If there's a client secret, we need to complete payment
//     if (result.client_secret) {
//       const stripe = await stripePromise;
//       if (stripe) {
//         const { error } = await stripe.confirmPayment({
//           clientSecret: result.client_secret,
//           // Add any additional payment method details if needed
//           confirmParams: {
//             return_url: `${window.location.origin}/payment/success`,
//           },
//         });

//         if (error) {
//           console.error("Payment confirmation error:", error);
//         }
//       }
//     } 
//     fetchSubscription(); // Refresh subscription data
//   } catch (err) {
//     console.error("Error renewing subscription:", err);
//   }
// };


//   return (
//     <>
//     <ConfirmationModal
//                         isOpen={isModalOpen}
//                         onClose={() => setIsModalOpen(false)}
//                         onConfirm={cancelUserSubscription}
//                         title="Confirm Action"
//                         message="Are you sure you want to proceed with this action? This cannot be undone."
//                       />
//     <Card>
//       <CardHeader title={hasSubscription ? "Current Plan" : "Available Plan"} />
//       <CardContent>
//         <Grid container spacing={6}>
//           <Grid item xs={12} md={6} className="flex flex-col gap-6">
//             <div className="flex flex-col gap-1">
//               <Typography color="text.primary" className="font-medium">
//                 {hasSubscription ? "Your Current Plan" : "Baasic Plan"}
//               </Typography>
//               <Typography>
//                 {hasSubscription
//                   ? `You are subscribed to our ${subData?.plan_type} plan`
//                   : "Get access to all basic features"}
//               </Typography>
//             </div>

//             {hasSubscription && (
//               <div className="flex flex-col gap-1">
//                 {subData && (
//                   <Typography color="text.primary" className="font-medium">
//                     Active until {format(parseISO(subData?.end_date), "MMM dd, yyyy")}
//                   </Typography>
//                 )}
//                 <Typography>We will send you a notification upon subscription</Typography>
//               </div>
//             )}

//             {user?.subscription ? (
//               <Typography color="success.main" className="font-medium">
//                 You are subscribed to a basic plan.
//               </Typography>
//             ) : (
//               <div className="flex flex-col gap-1">
//                 <div className="flex items-center gap-1.5">
//                   <Typography color="text.primary" className="font-medium">
//                     $100 Per Month
//                   </Typography>
//                   <Chip color="primary" variant="tonal" label="Basic" size="small" />
//                 </div>
//                 <Typography>Full access to all features and {subData?.plan_type} support</Typography>
//               </div>
//             )}
//           </Grid>

//           <Grid item xs={12} md={6} className="flex flex-col gap-6">
//   {hasSubscription && (subData?.status === "active" || subData?.status === "canceled") ? (
//     (() => {
//       const startDate = parseISO(subData.start_date);
//       const endDate = parseISO(subData.end_date);
//       const totalDays = differenceInDays(endDate, startDate);
//       const daysUsed = differenceInDays(new Date(), startDate);
//       const daysRemaining = Math.max(totalDays - daysUsed, 0);
//       const progress = Math.min((daysUsed / totalDays) * 100, 100).toFixed(0);

//       return (
//         <>
//           <Alert severity={subData.status === "active" ? "info" : "warning"}>
//             <AlertTitle>
//               {subData.status === "active"
//                 ? "Subscription Active"
//                 : "Subscription Canceled"}
//             </AlertTitle>
//             {subData.status === "active" ? (
//               <>
//                 Your <strong>{subData.plan_type}</strong> plan is currently active via{" "}
//                 <strong>{subData.provider_type}</strong>.
//               </>
//             ) : (
//               <>
//                 You’ve canceled your subscription. Your <strong>{subData.plan_type}</strong> plan remains active via{" "}
//                 <strong>{subData.provider_type}</strong> until the end of the billing cycle.
//               </>
//             )}
//           </Alert>
//           {/* <div className="flex flex-col gap-1">
//             <div className="flex items-center justify-between">
//               <Typography color="text.primary" className="font-medium">
//                 Days
//               </Typography>
//               <Typography color="text.primary" className="font-medium">
//                 {daysUsed} of {totalDays} Days
//               </Typography>
//             </div>
//             <LinearProgress variant="determinate" value={Number.parseFloat(progress)} />
//             <Typography variant="body2">
//               {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining in your current billing cycle
//             </Typography>
//           </div> */}
//         </>
//       );
//     })()
//   ) : (
//     <Alert severity="warning">
//       <AlertTitle>No Active Subscription</AlertTitle>
//       Subscribe now to access all basic features.
//     </Alert>
//   )}
// </Grid>


//           <Grid item xs={12}>
            
//             <div className="flex flex-col gap-4">
//               {/* Action Buttons */}
//               {subData?.status == "active" &&  (
//                 <div className="flex gap-4 flex-wrap">
//                     <Button
//                       {...buttonProps("Cancel Subscription", "error", "outlined", !hasSubscription)}
//                       onClick={() => setIsModalOpen(true)} // Replace with your actual function
//                     >
//                       Cancel Subscription
//                     </Button>
//                   </div>

//               )}
//               {subData?.status == "canceled" && subData.provider_type == "stripe" &&  (
//                 <div className="flex gap-4 flex-wrap">
//                     <Button
//                       {...buttonProps("Renew Subscription", "error", "outlined", !hasSubscription)}
//                       onClick={renewStripeSubscription} // Replace with your actual function
//                     >
//                       Renew Subscription
//                     </Button>
//                   </div>

//               )}
               

//               {/* Payment Method Buttons - Only show if no subscription */}
//               {!hasSubscription && (
//                 <>
//                   <Typography variant="h6" color="text.primary" className="font-medium mt-4">
//                     Choose Payment Method
//                   </Typography>
//                   <div className="flex gap-3 flex-wrap">
                     
//                      <div className="flex items-center gap-4 flex-wrap">


//   {/* PayPal Buttons (4 funding sources) incnluding stripe  */}
//   <PayPalSubscribeButton handleStripePayment={handleStripePayment} userEmail={user!.email} />
// </div>


                    
//                   </div>
//                 </>
//               )}
//             </div>
//           </Grid>
//         </Grid>
//       </CardContent>
//     </Card>
//     </>
//   )
// }

// export default CurrentPlan


"use client"

// MUI Imports
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import LinearProgress from "@mui/material/LinearProgress"
import type { ButtonProps } from "@mui/material/Button"

// Type Imports
import type { PricingPlanType } from "@/types/pages/pricingTypes"
import type { ThemeColor } from "@core/types"
import { differenceInDays, format, parseISO } from "date-fns"

// Component Imports
import ConfirmationDialog from "@components/dialogs/confirmation-dialog"
import OpenDialogOnElementClick from "@components/dialogs/OpenDialogOnElementClick"
import { useAuthStore } from "@/store/authStore"
import { loadStripe } from "@stripe/stripe-js"
import { ENDPOINTS, getBaseUrl } from "@/api/vars/vars"
import { useEffect, useState } from "react"
import ConfirmationModal from "@/components/dialogs/confirm-modal"
import PayPalSubscribeButton from "./PaypalButton"

// Type definitions for subscription data
interface SubscriptionData {
  plan_type: string
  end_date: string
  start_date: string
  status: "active"  | "canceled" | "expired"
  provider_type: "stripe" | "paypal"
}

interface User {
  subscription: boolean
  email: string
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY as string)

const CurrentPlan = ({ data }: { data: PricingPlanType[] }) => {
  const buttonProps = (
    children: string,
    color: ThemeColor,
    variant: ButtonProps["variant"],
    disabled?: boolean,
  ): ButtonProps => ({
    children,
    variant,
    color,
    disabled,
  })

  const { user }: { user: User | null } = useAuthStore()
  

  const [subData, setSubData] = useState<SubscriptionData | undefined>(undefined)
  const hasSubscription = user?.subscription === true
  //confirmation modal for delete
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hideBtn, setHideBtn] = useState(false)
  const [renewLoading, setRenewLoading] = useState(false)

  // Fetch data from API
  const fetchSubscription = async () => {
    try {
      const authToken = localStorage.getItem("auth_token")

      

      if (!authToken) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${getBaseUrl()}account/${ENDPOINTS.subscription}/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${authToken}`,
          "Content-Type": "application/json",
        },
      })

      if(response.status === 401){
      window.location.href = '/en/login'
    }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: SubscriptionData = await response.json()
      console.log(result)
      setSubData(result)
    } catch (err) {
      console.error("Error fetching invoices:", err)
    }
  }
  useEffect(() => {

    fetchSubscription()
  }, [])

  const handleStripePayment = async () => {
    console.log("Stripe payment initiated")
    try {
      const stripe = await stripePromise;

      const response = await fetch(`${getBaseUrl()}account/${ENDPOINTS.stripeCheckout}/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json",
        }
      });

      if(response.status === 401){
      window.location.href = '/en/login'
      
    }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const session = await response.json();

      console.log("Session response:", session);

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: session.sessionId,
        });

        if (error) {
          console.error("Error redirecting to checkout:", error);
        }
      } else {
        console.error("Stripe.js failed to load.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  }



  const cancelUserSubscription = async () => {
  setHideBtn(true)
  try {
    const authToken = localStorage.getItem("auth_token");

    if (!authToken) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${getBaseUrl()}account/${ENDPOINTS.cancelSubscription}/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    if(response.status === 401){
      window.location.href = '/en/login'
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    fetchSubscription()

    // Optional: Refresh subscription data    
  } catch (err) {
    setHideBtn(false)
    console.error("Error cancelling subscription:", err);
  } finally {
    setHideBtn(false) // Ensure button is re-enabled even on success
  }
};

const renewStripeSubscription = async () => {
  setRenewLoading(true)
  try {
    const authToken = localStorage.getItem("auth_token");

    if (!authToken) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${getBaseUrl()}account/${ENDPOINTS.renewSubscription}/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    if(response.status === 401){
      window.location.href = '/en/login'
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log(result)
    
    // If there's a client secret, we need to complete payment
    if (result.client_secret) {
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.confirmPayment({
          clientSecret: result.client_secret,
          // Add any additional payment method details if needed
          confirmParams: {
            return_url: `${window.location.origin}/payment/success`,
          },
        });

        if (error) {
          console.error("Payment confirmation error:", error);
        }
      }
    } 
    fetchSubscription(); // Refresh subscription data
  } catch (err) {
    console.error("Error renewing subscription:", err);
  } finally {
    setRenewLoading(false)
  }
};


  return (
    <>
    <ConfirmationModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={cancelUserSubscription}
                        title="Confirm Action"
                        message="Are you sure you want to proceed with this action? This cannot be undone."
                      />
    <Card>
      <CardHeader title={hasSubscription ? "Current Plan" : "Available Plan"} />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <Typography color="text.primary" className="font-medium">
                {hasSubscription ? "Your Current Plan" : "Baasic Plan"}
              </Typography>
              <Typography>
                {hasSubscription
                  ? `You are subscribed to our ${subData?.plan_type} plan`
                  : "Get access to all basic features"}
              </Typography>
            </div>

            {hasSubscription && (
              <div className="flex flex-col gap-1">
                {subData && (
                  <Typography color="text.primary" className="font-medium">
                    Active until {format(parseISO(subData?.end_date), "MMM dd, yyyy")}
                  </Typography>
                )}
                <Typography>We will send you a notification upon subscription</Typography>
              </div>
            )}

            {user?.subscription ? (
              <Typography color="success.main" className="font-medium">
                You are subscribed to a basic plan.
              </Typography>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <Typography color="text.primary" className="font-medium">
                    $100 Per Month
                  </Typography>
                  <Chip color="primary" variant="tonal" label="Basic" size="small" />
                </div>
                <Typography>Full access to all features and {subData?.plan_type} support</Typography>
              </div>
            )}
          </Grid>

          <Grid item xs={12} md={6} className="flex flex-col gap-6">
  {hasSubscription && (subData?.status === "active" || subData?.status === "canceled") ? (
    (() => {
      const startDate = parseISO(subData.start_date);
      const endDate = parseISO(subData.end_date);
      const totalDays = differenceInDays(endDate, startDate);
      const daysUsed = differenceInDays(new Date(), startDate);
      const daysRemaining = Math.max(totalDays - daysUsed, 0);
      const progress = Math.min((daysUsed / totalDays) * 100, 100).toFixed(0);

      return (
        <>
          <Alert severity={subData.status === "active" ? "info" : "warning"}>
            <AlertTitle>
              {subData.status === "active"
                ? "Subscription Active"
                : "Subscription Canceled"}
            </AlertTitle>
            {subData.status === "active" ? (
              <>
                Your <strong>{subData.plan_type}</strong> plan is currently active via{" "}
                <strong>{subData.provider_type}</strong>.
              </>
            ) : (
              <>
                You’ve canceled your subscription. Your <strong>{subData.plan_type}</strong> plan remains active via{" "}
                <strong>{subData.provider_type}</strong> until the end of the billing cycle.
              </>
            )}
          </Alert>
          {/* <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Typography color="text.primary" className="font-medium">
                Days
              </Typography>
              <Typography color="text.primary" className="font-medium">
                {daysUsed} of {totalDays} Days
              </Typography>
            </div>
            <LinearProgress variant="determinate" value={Number.parseFloat(progress)} />
            <Typography variant="body2">
              {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining in your current billing cycle
            </Typography>
          </div> */}
        </>
      );
    })()
  ) : (
    <Alert severity="warning">
      <AlertTitle>No Active Subscription</AlertTitle>
      Subscribe now to access all basic features.
    </Alert>
  )}
</Grid>


          <Grid item xs={12}>
            
            <div className="flex flex-col gap-4">
              {/* Action Buttons */}
              {subData?.status == "active" &&  (
                <div className="flex gap-4 flex-wrap">
                    <Button
                      {...buttonProps("Cancel Subscription", "error", "outlined", !hasSubscription || hideBtn)}
                      onClick={() => setIsModalOpen(true)}
                      disabled={hideBtn}
                    >
                      {hideBtn ? "Cancelling..." : "Cancel Subscription"}
                    </Button>
                  </div>

              )}
              {subData?.status == "canceled" && subData.provider_type == "stripe" &&  (
                <div className="flex gap-4 flex-wrap">
                    <Button
                      {...buttonProps("Renew Subscription", "error", "outlined", !hasSubscription || renewLoading)}
                      onClick={renewStripeSubscription}
                      disabled={renewLoading}
                    >
                      {renewLoading ? "Renewing..." : "Renew Subscription"}
                    </Button>
                  </div>

              )}
               

              {/* Payment Method Buttons - Only show if no subscription */}
              {!hasSubscription && (
                <>
                  <Typography variant="h6" color="text.primary" className="font-medium mt-4">
                    Choose Payment Method
                  </Typography>
                  <div className="flex gap-3 flex-wrap">
                     
                     <div className="flex items-center gap-4 flex-wrap">


  {/* PayPal Buttons (4 funding sources) incnluding stripe  */}
  <PayPalSubscribeButton handleStripePayment={handleStripePayment} userEmail={user!.email} />
</div>


                    
                  </div>
                </>
              )}
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
    </>
  )
}

export default CurrentPlan
