'use client'

import { ENDPOINTS, getBaseUrl } from "@/api/vars/vars";
import { useAuthStore } from "@/store/authStore";
import { PayPalScriptProvider, PayPalButtons, FUNDING } from "@paypal/react-paypal-js";

interface PayPalSubscribeButtonProps {
  userEmail: string;
  handleStripePayment: any
}

const PayPalSubscribeButton = ({ handleStripePayment, userEmail }: PayPalSubscribeButtonProps) => {
   const { clearAuth } = useAuthStore()
  const createSubscription = async () => {
    const res = await fetch(`${getBaseUrl()}account/${ENDPOINTS.paypal_confirm_subscription}/`, {
      method: "POST",
      headers: {
        "Authorization": `Token ${localStorage.getItem("auth_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: userEmail }),
    });

    const result = await res.json();
    if (!res.ok || !result.subscriptionID) {
      console.error("❌ Failed to create PayPal subscription", result);
      throw new Error("Subscription creation failed");
    }

    return result.subscriptionID;
  };

  

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENTID || "",
        vault: true,
        intent: "subscription",
      }}
    >
      <div className="flex items-center gap-4 flex-wrap">
        {/* Stripe Button */}
        <button
          onClick={handleStripePayment}
          className="flex items-center gap-2 px-6 cursor-pointer py-3 h-[48px] rounded-md bg-[#635BFF] hover:bg-[#5851db] text-white font-semibold shadow-md min-w-[140px]"
        >
          <div className="w-6 h-6 bg-white rounded-xs flex items-center justify-center">
            <strong className="font-bold text-lg text-[#635BFF]">S</strong>
          </div>
          <span className="font-bold">Stripe</span>
        </button>

        {/* PayPal Buttons */}
        <div className="flex items-center gap-4">
          <div className="h-[48px] min-w-[140px]">
            <PayPalButtons
              fundingSource={FUNDING.PAYPAL}
              style={{ layout: "horizontal", height: 48 }}
              createSubscription={createSubscription}
              onApprove={async() => {
                window.location.href = '/en/login';
                localStorage.removeItem('auth_token')
                 clearAuth()
                return
              }}
            />
          </div>
          <div className="h-[48px] min-w-[140px]">
            <PayPalButtons
              fundingSource={FUNDING.CARD}
              style={{ layout: "horizontal", height: 48 }}
              createSubscription={createSubscription}
              onApprove={async() => {
                window.location.href = '/en/login';
                localStorage.removeItem('auth_token')
                clearAuth()
                return
              }}
            /> 
          </div>
          <div className="h-[48px] min-w-[140px]">
            <PayPalButtons
              fundingSource={FUNDING.CREDIT}
              style={{ layout: "horizontal", height: 48 }}
              createSubscription={createSubscription}
              onApprove={async() => {
                window.location.href = '/en/login';
                localStorage.removeItem('auth_token')
                clearAuth()
                return
              }}
            />
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalSubscribeButton;
