"use client"

import type React from "react"

import Card from "@mui/material/Card"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import CustomTextField from "@core/components/mui/TextField"
import { useForm } from "react-hook-form"
import MenuItem from "@mui/material/MenuItem"
import Loader from "@/components/loader/Loader"
import { createToppings, getTopping } from "@/api/toppings"
import { getAllBusiness } from "@/api/business"
import type { BusinessType } from "@/types/apps/businessTypes"
import OpenDialogOnElementClick from "@/components/dialogs/OpenDialogOnElementClick"
import type { ButtonProps } from "@mui/material/Button"
import type { ThemeColor } from "@core/types"
import AddType from "@/components/dialogs/add-type"
import { getAllFoodTypesOfSpecificBusiness } from "@/api/foodTypes"
import type { ToppingDataType } from "@/api/interface/toppingInterface"


type PreviewToppingsProps = {
  id: string
  isCreated: boolean
  onCreateTopping: (isCreated: boolean) => void
}

const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps["variant"]): ButtonProps => ({
  children,
  color,
  variant,
})

const AddToppings = ({ id, isCreated, onCreateTopping }: PreviewToppingsProps) => {
  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])
  const [BusinessToppingsData, setBusinessToppingsData] = useState<ToppingDataType[]>([])
  const [FoodTypeData, setFoodTypeData] = useState<ToppingDataType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [addType, setAddType] = useState<boolean>(false)
  const [businessId, setBusinessId] = useState<string>("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ToppingDataType>()

  const handleBusinessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedBusinessId = Number(event.target.value)
    const selectedBusiness = userBusinessData.find((b) => b.id === selectedBusinessId)
    if (selectedBusiness) {
      setBusinessId(selectedBusiness.business_id)
    } else {
      setBusinessId("")
    }
  }

  // Function to copy type ID to clipboard
  const handleCopyTypeId = async () => {
    const selectedTypeId = watch("type")
    if (selectedTypeId && selectedTypeId !== 0) {
      try {
        await navigator.clipboard.writeText(selectedTypeId.toString())
        toast.success("Type ID copied to clipboard!")
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea")
        textArea.value = selectedTypeId.toString()
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        toast.success("Type ID copied to clipboard!")
      }
    } else {
      toast.error("Please select a type first")
    }
  }

  const onSubmit = (data: ToppingDataType, e: any) => {
    e.preventDefault()
    onCreateTopping(false)
    setLoading(true)
    createToppings(data)
      .then((res) => {
        toast.success("Combination saved successfully")
        onCreateTopping(true)
        setAddType(true)
        reset()
        reset({
          business: 0,
          type: 0,
        })
      })
      .catch((error) => {
        console.log(error, "Combination create error")
        if (error?.data && error?.data?.name[0]) {
          toast.error(error?.data?.name[0])
        } else {
          toast.error("Error in creating order")
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    const fetchFoodTypes = async () => {
      try {
        const response = await getAllFoodTypesOfSpecificBusiness(businessId)
        setFoodTypeData(response?.data)
      } catch (error: any) {
        // Handle error
      }
    }
    fetchFoodTypes()
  }, [id, addType, businessId])

  const fetchTopping = async () => {
    try {
      const response = await getTopping(Number(id))
      setBusinessToppingsData(response?.data)
    } catch (error: any) {
      // Handle error
    }
  }

  useEffect(() => {
    fetchTopping()
  }, [id, addType])

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getAllBusiness()
        setUserBusinessData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch business')
      } finally {
        // setLoading(false)
      }
    }
    fetchBusiness()
  }, [])

  const handleTypeAdded = async () => {
    try {
      const response = await getAllFoodTypesOfSpecificBusiness(businessId)
      setFoodTypeData(response?.data)
      reset({
        business: 0,
        type: 0,
      })
    } catch (error) {
      console.log(error, "Error fetching updated food types")
    }
  }

  return (
    <>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-6">
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Combination Name *"
                fullWidth
                placeholder="Enter Combination Name"
                {...register("name", { required: "Combination Name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                id="business"
                label="Select Business*"
                value={watch("business") || 0}
                {...register("business", {
                  required: "Business ID is required",
                  validate: (value) => (value !== 0 ? true : "Business ID is required"),
                  onChange: (e) => {
                    handleBusinessChange(e)
                    return e.target.value
                  },
                })}
                error={!!errors.business}
                helperText={errors.business?.message}
              >
                <MenuItem key="Select Business" value={0}>
                  Select Business
                </MenuItem>
                {userBusinessData &&
                  userBusinessData?.map((business) => (
                    <MenuItem key={business.id} value={business.id}>
                      {business.business_id}
                    </MenuItem>
                  ))}
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Combination Description *"
                fullWidth
                placeholder="Enter Combination Description"
                {...register("description", { required: "Combination Description is required" })}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Additional Price *"
                fullWidth
                type="number"
                placeholder="Enter Additional Price"
                inputProps={{ step: "any", min: "0" }}
                {...register("additional_price", {
                  required: "Additional Price is required",
                  pattern: {
                    value: /^(0\.\d*[1-9]\d*|[1-9]\d*(\.\d+)?|\d)$/,
                    message: "Only positive integers or decimal values are allowed",
                  },
                  min: {
                    value: 0,
                    message: "Value must be at least 0",
                  },
                })}
                error={!!errors.additional_price}
                helperText={errors.additional_price?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              {businessId && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <CustomTextField
                    select
                    fullWidth
                    id="business"
                    label="Select Type *"
                    value={watch("type") || 0}
                    {...register("type", {
                      required: "Type is required",
                      validate: (value) => (value !== 0 ? true : "Food Type is required"),
                    })}
                    error={!!errors.type}
                    helperText={errors.type?.message}
                    style={{ flex: 1 }}
                  >
                    <MenuItem key="Select Food Type" value={0}>
                      Select Type
                    </MenuItem>
                    {FoodTypeData &&
                      FoodTypeData?.map((food) => (
                        <MenuItem key={food.id} value={food.id}>
                          {food.name}
                        </MenuItem>
                      ))}
                  </CustomTextField>

                  <div
                    style={{
                      marginLeft: "10px",
                      marginTop: errors.type ? "0px" : "15px",
                      display: "flex",
                      gap: "5px",
                    }}
                  >
                    {/* Copy ID Button */}
                    <Tooltip title="Copy Type ID">
                      <IconButton
                        onClick={handleCopyTypeId}
                        disabled={!watch("type") || watch("type") === 0}
                        color="primary"
                        size="small"
                      >
                        <i className="tabler-copy text-[22px] text-textSecondary" />
                      </IconButton>
                    </Tooltip>

                    {/* Add Type Button */}
                    <OpenDialogOnElementClick
                      element={Button}
                      elementProps={buttonProps("Add", "primary", "contained")}
                      dialog={AddType}
                      dialogProps={{}}
                      onTypeAdded={handleTypeAdded}
                    />
                  </div>
                </div>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <div className="flex items-center gap-4" style={{ marginTop: errors.description ? "0px" : "15px" }}>
                <Button variant="contained" type="submit" disabled={loading}>
                  Save Combination
                </Button>
              </div>
              {loading && <Loader />}
            </Grid>
          </Grid>
        </form>
      </Card>
      {/* <Toaster /> */}
    </>
  )
}

export default AddToppings
