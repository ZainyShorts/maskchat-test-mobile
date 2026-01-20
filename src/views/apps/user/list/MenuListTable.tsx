"use client"

import type React from "react"
import { useEffect, useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

// MUI Imports
import Card from "@mui/material/Card"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import TablePagination from "@mui/material/TablePagination"
import type { TextFieldProps } from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import Checkbox from "@mui/material/Checkbox"
import LinearProgress from "@mui/material/LinearProgress"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import { useTheme } from "@mui/material/styles"

// Third-party Imports
import classnames from "classnames"
import { rankItem } from "@tanstack/match-sorter-utils"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table"
import type { ColumnDef, FilterFn } from "@tanstack/react-table"
import type { RankingInfo } from "@tanstack/match-sorter-utils"

// Type Imports
import toast from "react-hot-toast"
import type { ThemeColor } from "@core/types"
import TablePaginationComponent from "@components/TablePaginationComponent"
import CustomTextField from "@core/components/mui/TextField"
import tableStyles from "@core/styles/table.module.css"
import type { MenuesType } from "@/types/apps/menuTypes"
import EditMenuInfo from "@/components/dialogs/edit-menu-info"
import OpenDialogOnElementClick from "@/components/dialogs/OpenDialogOnElementClick"
import type { ButtonProps } from "@mui/material/Button"
import { useAuthStore } from "@/store/authStore"
import type { BusinessType } from "@/types/apps/businessTypes"
import { getAllBusiness } from "@/api/business"
import {
  createTemplate,
  createFlow,
  deleteMenu,
  getAllMenuesByBusinessId,
  syncMenuData,
  deleteMenuFlowAndTemplateBymetaId,
} from "@/api/menu"
import { getLocalizedUrl } from "@/utils/i18n"
import type { Locale } from "@/configs/i18n"
import AddtMenuForm from "@/components/dialogs/add-menu-form"
import ConfirmationDialog from "@/components/ConfirmationDialog"
import ConfirmationModal from "@/components/dialogs/confirm-modal"
import { ENDPOINTS, getBaseUrl } from "@/api/vars/vars"
import CSVImportModal from "@/components/dialogs/csv-import-modal"

// Extend react-table with custom filter functions
declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type MenuesTypeWithAction = MenuesType & {
  action?: string
}

// Bulk operation progress type
type BulkProgress = {
  total: number
  completed: number
  failed: number
  current: string
  isRunning: boolean
  errors: Array<{ id: number; title: string; error: string }>
}

// Custom fuzzy filter function
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({
    itemRank,
  })
  return itemRank.passed
}

// Debounced input component for search
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, "onChange">) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return <CustomTextField {...props} value={value} onChange={(e) => setValue(e.target.value)} />
}

// Helper function for button props
const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps["variant"]): ButtonProps => ({
  children,
  color,
  variant,
})

// Column Definitions using react-table's column helper
const columnHelper = createColumnHelper<MenuesTypeWithAction>()

const MenuListTable = ({ tableData }: { tableData?: MenuesType[] }) => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState<boolean>(false)
  const { menuData, menuAction, user } = useAuthStore()
  const [userBuinsessData, setUserBusinessesData] = useState<BusinessType[]>([])
  const theme = useTheme()

  // State variables for business selection and data filtering
  const [selectedBusiness, setSelectedBusiness] = useState<string | number>("")
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | number>("")
  const [data, setData] = useState<MenuesType[]>(tableData || [])
  const [globalFilter, setGlobalFilter] = useState("")

  // Modal states
  const [editMenuFlag, setEditMenuFlag] = useState<boolean>(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null)
  const [selectedMetaId, setSelectedMetaId] = useState<string | null>(null)
  const [deleteType, setDeleteType] = useState<"menu" | "flowTemplate">("menu")
  const [csvImportOpen, setCsvImportOpen] = useState(false)

  // Loading states for different operations
  const [flowLoading, setFlowLoading] = useState<{ [key: number]: boolean }>({})
  const [templateLoading, setTemplateLoading] = useState<{ [key: number]: boolean }>({})
  const [syncLoading, setSyncLoading] = useState<boolean>(false)

  // Bulk operation states
  const [bulkFlowProgress, setBulkFlowProgress] = useState<BulkProgress>({
    total: 0,
    completed: 0,
    failed: 0,
    current: "",
    isRunning: false,
    errors: [],
  })
  const [bulkTemplateProgress, setBulkTemplateProgress] = useState<BulkProgress>({
    total: 0,
    completed: 0,
    failed: 0,
    current: "",
    isRunning: false,
    errors: [],
  })

  // Memoized fetch functions to prevent unnecessary re-renders
  const fetchMenuesForBusiness = useCallback(
    async (businessId: string | number) => {
      if (!businessId) return
      try {
        console.log("businessId", businessId)
        const response = await getAllMenuesByBusinessId(businessId.toString())
        const menus = response || []
        console.log(menus)
        setData(menus)
        menuAction(menus)
      } catch (err: any) {
        console.error("Error fetching menus:", err)
        toast.error(err.message || "Failed to fetch menus")
      }
    },
    [menuAction],
  )

  const deleteMenuFlowAndTemplate = async (metaId: string) => {
    try {
      const response = await deleteMenuFlowAndTemplateBymetaId(metaId)
      console.log(response)
      if (selectedBusiness) {
        fetchMenuesForBusiness(selectedBusiness)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const fetchBusiness = useCallback(async () => {
    try {
      const response = await getAllBusiness()
      const businesses = response?.data?.results || []
      setUserBusinessesData(businesses)
      if (businesses.length > 0 && !selectedBusiness) {
        const firstBusiness = businesses[0]
        setSelectedBusiness(firstBusiness.id)
        setSelectedBusinessId(firstBusiness.business_id || "")
      }
    } catch (err: any) {
      console.log(err.message)
    }
  }, [selectedBusiness])

  // Initial data fetch - only on component mount
  useEffect(() => {
    fetchBusiness()
  }, [fetchBusiness])

  // Auto-select first business when data is loaded
  useEffect(() => {
    if (userBuinsessData.length > 0 && !selectedBusiness) {
      const firstBusiness = userBuinsessData[0]
      setSelectedBusiness(firstBusiness.id)
      setSelectedBusinessId(firstBusiness.business_id || "")
    }
  }, [userBuinsessData, selectedBusiness])

  // Update the business selection effect to only fetch when business is selected
  useEffect(() => {
    if (selectedBusiness) {
      fetchMenuesForBusiness(selectedBusiness)
    } else {
      setData([])
    }
  }, [selectedBusiness, fetchMenuesForBusiness])

  // Get selected menu items
  const selectedMenuItems = useMemo(() => {
    const selectedRows = Object.keys(rowSelection).filter((key) => rowSelection[key])
    return selectedRows.map((index) => data[Number.parseInt(index)]).filter(Boolean)
  }, [rowSelection, data])

  // Bulk Flow Creation
  const handleBulkCreateFlow = useCallback(
    async (items: MenuesType[]) => {
      if (!selectedBusiness) {
        toast.error("Please select a business first")
        return
      }

      if (items.length === 0) {
        toast.error("No items selected")
        return
      }

      // Filter items that don't already have flows
      const eligibleItems = items.filter((item) => !item.flow)

      if (eligibleItems.length === 0) {
        toast.error("All selected items already have flows")
        return
      }

      setBulkFlowProgress({
        total: eligibleItems.length,
        completed: 0,
        failed: 0,
        current: "",
        isRunning: true,
        errors: [],
      })

      const errors: Array<{ id: number; title: string; error: string }> = []

      for (let i = 0; i < eligibleItems.length; i++) {
        const menuItem: any = eligibleItems[i]

        setBulkFlowProgress((prev) => ({
          ...prev,
          current: menuItem.title || `Item ${menuItem.id}`,
        }))

        try {
          const payload = {
            name: menuItem.metaId,
            categories: ["OTHER"],
            flow_type: "toppings",
            type_id: menuItem.type.id,
            menu_id: menuItem.id,
            business_id: selectedBusinessId,
          }

          await createFlow(payload)

          setBulkFlowProgress((prev) => ({
            ...prev,
            completed: prev.completed + 1,
          }))

          toast.success(`Flow created for ${menuItem.title}`, { duration: 2000 })
        } catch (error: any) {
          const errorMessage = error?.data?.error || "Failed to create flow"
          errors.push({
            id: menuItem.id,
            title: menuItem.title || `Item ${menuItem.id}`,
            error: errorMessage,
          })

          setBulkFlowProgress((prev) => ({
            ...prev,
            failed: prev.failed + 1,
            errors: [
              ...prev.errors,
              { id: menuItem.id, title: menuItem.title || `Item ${menuItem.id}`, error: errorMessage },
            ],
          }))

          toast.error(`Failed to create flow for ${menuItem.title}: ${errorMessage}`, { duration: 3000 })
        }

        // Small delay to prevent overwhelming the API
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      setBulkFlowProgress((prev) => ({
        ...prev,
        isRunning: false,
        current: "",
      }))

      // Refresh data
      fetchMenuesForBusiness(selectedBusiness)

      // Show summary
      const successCount = eligibleItems.length - errors.length
      toast.success(`Bulk flow creation completed: ${successCount} successful, ${errors.length} failed`, {
        duration: 5000,
      })
    },
    [selectedBusiness, fetchMenuesForBusiness],
  )

  // Bulk Template Creation
  const handleBulkCreateTemplate = useCallback(
    async (items: MenuesType[]) => {
      if (!selectedBusiness) {
        toast.error("Please select a business first")
        return
      }

      if (items.length === 0) {
        toast.error("No items selected")
        return
      }

      // Filter items that have flows but don't have templates
      const eligibleItems = items.filter((item) => item.flow && !item.template)

      if (eligibleItems.length === 0) {
        toast.error("No eligible items found (items must have flows but no templates)")
        return
      }

      setBulkTemplateProgress({
        total: eligibleItems.length,
        completed: 0,
        failed: 0,
        current: "",
        isRunning: true,
        errors: [],
      })

      const errors: Array<{ id: number; title: string; error: string }> = []

      for (let i = 0; i < eligibleItems.length; i++) {
        const menuItem: any = eligibleItems[i]

        setBulkTemplateProgress((prev) => ({
          ...prev,
          current: menuItem.title || `Item ${menuItem.id}`,
        }))

        try {
          const payload = {
            name: menuItem.metaId,
            category: "UTILITY",
            allow_category_change: true,
            language: "en",
            components: [
              {
                type: "BODY",
                text: `Please choose your preferred combination and the size for ${menuItem.type.name}`,
              },
              {
                type: "BUTTONS",
                buttons: [
                  {
                    type: "FLOW",
                    text: `Create your ${menuItem.type.name}`,
                    flow_id:
                      Array.isArray(menuItem.facebook_flows) && menuItem.facebook_flows.length > 0
                        ? Array.isArray(menuItem.facebook_flows) && menuItem.facebook_flows.length > 0
                          ? Array.isArray(menuItem.facebook_flows) && menuItem.facebook_flows.length > 0
                            ? menuItem.facebook_flows[0].flow_id
                            : "89898"
                          : "89898"
                        : "89898",
                  },
                ],
              },
            ],
            business_id: selectedBusinessId,
            flow_id:
              menuItem.facebook_flows && menuItem.facebook_flows.length > 0
                ? menuItem.facebook_flows[0].flow_id
                : "89898",
            menu_id: menuItem.id,
          }

          await createTemplate(payload)

          setBulkTemplateProgress((prev) => ({
            ...prev,
            completed: prev.completed + 1,
          }))

          toast.success(`Template created for ${menuItem.title}`, { duration: 2000 })
        } catch (error: any) {
          const errorMessage = error?.data?.detail || "Failed to create template"
          errors.push({
            id: menuItem.id,
            title: menuItem.title || `Item ${menuItem.id}`,
            error: errorMessage,
          })

          setBulkTemplateProgress((prev) => ({
            ...prev,
            failed: prev.failed + 1,
            errors: [
              ...prev.errors,
              { id: menuItem.id, title: menuItem.title || `Item ${menuItem.id}`, error: errorMessage },
            ],
          }))

          toast.error(`Failed to create template for ${menuItem.title}: ${errorMessage}`, { duration: 3000 })
        }

        // Small delay to prevent overwhelming the API
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      setBulkTemplateProgress((prev) => ({
        ...prev,
        isRunning: false,
        current: "",
      }))

      // Refresh data
      fetchMenuesForBusiness(selectedBusiness)

      // Show summary
      const successCount = eligibleItems.length - errors.length
      toast.success(`Bulk template creation completed: ${successCount} successful, ${errors.length} failed`, {
        duration: 5000,
      })
    },
    [selectedBusiness, fetchMenuesForBusiness],
  )

  // Optimized handler that doesn't trigger unnecessary re-fetches
  const handleTypeAdded = useCallback(() => {
    if (selectedBusiness) {
      fetchMenuesForBusiness(selectedBusiness)
    }
  }, [fetchMenuesForBusiness, selectedBusiness])

  const handleBusinessChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedBusinessValue = event.target.value
      const selectedBusinessDetails = userBuinsessData.find(
        (business) => Number(business.id) === Number(selectedBusinessValue),
      )
      setSelectedBusiness(selectedBusinessValue)
      setSelectedBusinessId(selectedBusinessDetails?.business_id || "")
    },
    [userBuinsessData],
  )

  // Handler for deleting a menu - optimized to only refetch on success
  const handleDeleteMenu = useCallback(
    async (id: number) => {
      if (!selectedBusiness) {
        toast.error("Please select a business first")
        return
      }
      try {
        await deleteMenu(id)
        fetchMenuesForBusiness(selectedBusiness)
      } catch (error: any) {
        if (error?.data && error?.data?.detail) {
          toast.error(error?.data?.detail)
        } else {
          toast.error("Error in deleting menu")
        }
      }
    },
    [selectedBusiness, fetchMenuesForBusiness],
  )

  // Unified confirmation handler for both delete types
  const handleConfirmDelete = useCallback(async () => {
    try {
      if (deleteType === "menu" && selectedMenuId !== null) {
        await handleDeleteMenu(selectedMenuId)
        toast.success("Menu deleted successfully")
      } else if (deleteType === "flowTemplate" && selectedMetaId !== null) {
        await deleteMenuFlowAndTemplate(selectedMetaId)
        toast.success("Flow and template deleted successfully")
      }
    } catch (error: any) {
      toast.error("Error occurred during deletion")
    } finally {
      setIsModalOpen(false)
      setSelectedMenuId(null)
      setSelectedMetaId(null)
    }
  }, [deleteType, selectedMenuId, selectedMetaId, handleDeleteMenu])

  const handleAddToppings = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      router.replace(getLocalizedUrl(`/menu/combination/${selectedBusinessId}`, locale as Locale))
    },
    [router, selectedBusinessId, locale],
  )

  const handleAddSize = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      router.replace(getLocalizedUrl(`/menu/size/${selectedBusinessId}`, locale as Locale))
    },
    [router, selectedBusinessId, locale],
  )

  // Enhanced CSV Import handler with preview data
  const handleCSVImport = useCallback(
    async (file: File, csvData: any) => {
      if (!selectedBusiness) {
        toast.error("Please select a business first")
        return
      }
      try {
        const authToken = localStorage.getItem("auth_token")
        if (!authToken) {
          toast.error("Authentication token not found. Please login again.")
          return
        }
        const formData: any = new FormData()
        formData.append("file", file)
        formData.append("businessId", selectedBusiness)
        toast.loading("Importing CSV data...", { id: "csv-import" })
        const response = await fetch(`${getBaseUrl()}whatseat/${ENDPOINTS.import_csv}/`, {
          method: "POST",
          headers: {
            Authorization: `Token ${authToken}`,
          },
          body: formData,
        })
        const result = await response.json()
        if (result.success) {
          toast.success(result.msg, {
            id: "csv-import",
          })
          fetchMenuesForBusiness(selectedBusiness)
        } else {
          toast.error(result.msg || "Failed to import CSV data", {
            id: "csv-import",
          })
        }
      } catch (error: any) {
        console.error("CSV Import Error:", error)
        toast.error("Network error occurred while importing CSV", {
          id: "csv-import",
        })
      }
    },
    [selectedBusiness, fetchMenuesForBusiness],
  )

  const handleCreateFlow = useCallback(
    (menuItems: any) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      if (!selectedBusiness) {
        toast.error("Please select a business first")
        return
      }
      setFlowLoading((prev) => ({ ...prev, [menuItems.id]: true }))
      const payload = {
        name: menuItems.metaId,
        categories: ["OTHER"],
        flow_type: "toppings",
        type_id: menuItems.type.id,
        menu_id: menuItems.id,
        business_id: selectedBusinessId,
      }
      toast.loading("Creating flow...", { id: `flow-${menuItems.id}` })
      createFlow(payload)
        .then((res) => {
          console.log(res, "Create Address Flow")
          toast.success("Flow Created Successfully", { id: `flow-${menuItems.id}` })
          fetchMenuesForBusiness(selectedBusiness)
        })
        .catch((error) => {
          console.log(error, "error in creating Address Flow")
          toast.error(error?.data?.error || "Failed to create flow", { id: `flow-${menuItems.id}` })
        })
        .finally(() => {
          setFlowLoading((prev) => ({ ...prev, [menuItems.id]: false }))
        })
    },
    [selectedBusiness, fetchMenuesForBusiness],
  )

  const handleCreateTemplate = useCallback(
    (menuItems: any) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      if (!selectedBusiness) {
        toast.error("Please select a business first")
        return
      }
      setTemplateLoading((prev) => ({ ...prev, [menuItems.id]: true }))
      const payload = {
        name: menuItems.metaId,
        category: "UTILITY",
        allow_category_change: true,
        language: "en",
        components: [
          {
            type: "BODY",
            text: `Please choose your preferred combination and the size for ${menuItems.type.name}`,
          },
          {
            type: "BUTTONS",
            buttons: [
              {
                type: "FLOW",
                text: `Create your ${menuItems.type.name}`,
                flow_id:
                  menuItems.facebook_flows && menuItems.facebook_flows.length > 0
                    ? menuItems.facebook_flows[0].flow_id
                    : "89898",
              },
            ],
          },
        ],
        business_id: selectedBusinessId,
        flow_id:
          menuItems.facebook_flows && menuItems.facebook_flows.length > 0
            ? menuItems.facebook_flows[0].flow_id
            : "89898",
        menu_id: menuItems.id,
      }
      toast.loading("Creating template...", { id: `template-${menuItems.id}` })
      createTemplate(payload)
        .then((res) => {
          toast.success("Template Created Successfully", {
            id: `template-${menuItems.id}`,
            duration: 5000,
          })
          fetchMenuesForBusiness(selectedBusiness)
        })
        .catch((error) => {
          toast.error(error?.data?.detail || "Failed to create template", {
            id: `template-${menuItems.id}`,
            duration: 5000,
          })
        })
        .finally(() => {
          setTemplateLoading((prev) => ({ ...prev, [menuItems.id]: false }))
        })
    },
    [selectedBusiness, fetchMenuesForBusiness],
  )

  const handleConfirm = useCallback(async () => {
    if (!selectedBusiness) {
      toast.error("Please select a business to sync.", {
        duration: 5000,
      })
      return
    }
    setSyncLoading(true)
    const payload = {
      business_id: selectedBusiness,
    }
    toast.loading("Syncing menu with meta...", { id: "sync-meta" })
    try {
      // await syncMenuData(payload)
      toast.success("Menu synced successfully", {
        id: "sync-meta",
        duration: 5000,
      })
      setOpenConfirmation(false)
      fetchMenuesForBusiness(selectedBusiness)
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to sync menu", {
        id: "sync-meta",
        duration: 5000,
      })
    } finally {
      setSyncLoading(false)
    }
  }, [selectedBusiness, fetchMenuesForBusiness])

  const truncateText = useCallback((text: any, maxLength: any) => {
    if (!text) return ""
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }, [])

  // Define table columns - memoized to prevent unnecessary re-renders
  const columns = useMemo<ColumnDef<MenuesTypeWithAction, any>[]>(
    () => [
      // Selection column
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      columnHelper.accessor("id", {
        header: "Catalouge Number",
        cell: ({ row }) => (
          <Typography
            component={Link}
            href={getLocalizedUrl(`/menu/${row.original.id}`, locale as Locale)}
            color="primary"
          >
            {`${row.original.menu_number}`}
          </Typography>
        ),
      }),
      columnHelper.accessor("title", {
        header: "Title",
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <Typography color="text.primary" className="font-medium">
                {truncateText(row?.original?.title, 15)}
              </Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => <Typography>{row.original.status}</Typography>,
      }),
      columnHelper.accessor("sku", {
        header: "SKU",
        cell: ({ row }) => <Typography color="text.primary">{row.original.sku}</Typography>,
      }),
      columnHelper.accessor("price", {
        header: "Price",
        cell: ({ row }) => (
          <Typography className="capitalize" color="text.primary">
            <strong>
              {row.original.price} {userBuinsessData[0]?.currency?.code}
            </strong>
          </Typography>
        ),
      }),
      
    ],
    [
      menuData,
      handleTypeAdded,
      handleCreateFlow,
      handleCreateTemplate,
      truncateText,
      locale,
      userBuinsessData,
      flowLoading,
      templateLoading,
    ],
  )

  // Initialize react-table
  const table = useReactTable({
    data: data as MenuesType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  })

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedMenuId(null)
          setSelectedMetaId(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={
          deleteType === "menu"
            ? "Are you sure you want to delete this menu item? This action cannot be undone."
            : "Are you sure you want to delete the flow and template? This action cannot be undone."
        }
      />
      <CSVImportModal open={csvImportOpen} onClose={() => setCsvImportOpen(false)} onImport={handleCSVImport} />

      <Card
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          "& .MuiTableCell-root": {
            borderColor: theme.palette.divider,
          },
        }}
      >
        {/* Bulk Action Progress Indicators */}
        {(bulkFlowProgress.isRunning || bulkTemplateProgress.isRunning) && (
          <Box
            className="p-4 border-b"
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
              borderColor: theme.palette.divider,
            }}
          >
            {bulkFlowProgress.isRunning && (
              <Box className="mb-4">
                <Typography variant="h6" className="mb-2" color="text.primary">
                  Creating Flows - {bulkFlowProgress.completed + bulkFlowProgress.failed}/{bulkFlowProgress.total}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={((bulkFlowProgress.completed + bulkFlowProgress.failed) / bulkFlowProgress.total) * 100}
                  className="mb-2"
                  sx={{
                    backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: theme.palette.primary.main,
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Current: {bulkFlowProgress.current}
                </Typography>
                <Box className="flex gap-2 mt-2">
                  <Chip
                    label={`Completed: ${bulkFlowProgress.completed}`}
                    color="success"
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.mode === "dark" ? "#2e7d32" : undefined,
                      color: theme.palette.mode === "dark" ? "#fff" : undefined,
                    }}
                  />
                  <Chip
                    label={`Failed: ${bulkFlowProgress.failed}`}
                    color="error"
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.mode === "dark" ? "#d32f2f" : undefined,
                      color: theme.palette.mode === "dark" ? "#fff" : undefined,
                    }}
                  />
                </Box>
              </Box>
            )}

            {bulkTemplateProgress.isRunning && (
              <Box>
                <Typography variant="h6" className="mb-2" color="text.primary">
                  Creating Templates - {bulkTemplateProgress.completed + bulkTemplateProgress.failed}/
                  {bulkTemplateProgress.total}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    ((bulkTemplateProgress.completed + bulkTemplateProgress.failed) / bulkTemplateProgress.total) * 100
                  }
                  className="mb-2"
                  sx={{
                    backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: theme.palette.secondary.main,
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Current: {bulkTemplateProgress.current}
                </Typography>
                <Box className="flex gap-2 mt-2">
                  <Chip
                    label={`Completed: ${bulkTemplateProgress.completed}`}
                    color="success"
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.mode === "dark" ? "#2e7d32" : undefined,
                      color: theme.palette.mode === "dark" ? "#fff" : undefined,
                    }}
                  />
                  <Chip
                    label={`Failed: ${bulkTemplateProgress.failed}`}
                    color="error"
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.mode === "dark" ? "#d32f2f" : undefined,
                      color: theme.palette.mode === "dark" ? "#fff" : undefined,
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        )}

        <div className="flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4">
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="is-[70px]"
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </CustomTextField>

          <div className="flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4">
            Select Business
            <CustomTextField
              className="is-full sm:is-auto"
              select
              fullWidth
              id="business"
              value={selectedBusiness}
              onChange={handleBusinessChange}
            >
              <MenuItem value="">
                <em>Select a business</em>
              </MenuItem>
              {userBuinsessData.length > 0 ? (
                userBuinsessData.map((user) => (
                  <MenuItem key={user.business_id} value={user.id}>
                    {user.business_id}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  No businesses available
                </MenuItem>
              )}
            </CustomTextField>
            
          </div>
        </div>

        {/* Bulk Action Buttons */}
        {selectedMenuItems.length > 0 && (
          <Box
            className="p-4 border-b"
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
              borderColor: theme.palette.divider,
            }}
          >
            <Typography variant="h6" className="mb-3" color="text.primary">
              Bulk Actions ({selectedMenuItems.length} items selected)
            </Typography>
            <Box className="flex gap-3 flex-wrap">
              <Button
                variant="contained"
                color="primary"
                disabled={bulkFlowProgress.isRunning || bulkTemplateProgress.isRunning}
                onClick={() => handleBulkCreateFlow(selectedMenuItems)}
                startIcon={
                  bulkFlowProgress.isRunning ? (
                    <i className="tabler-loader animate-spin" />
                  ) : (
                    <i className="tabler-flow" />
                  )
                }
                sx={{
                  minWidth: "200px",
                  backgroundColor: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                  "&:disabled": {
                    backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : undefined,
                    color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.3)" : undefined,
                  },
                }}
              >
                Create Flows for Selected
              </Button>
              <Button
                variant="contained"
                color="secondary"
                disabled={bulkFlowProgress.isRunning || bulkTemplateProgress.isRunning}
                onClick={() => handleBulkCreateTemplate(selectedMenuItems)}
                startIcon={
                  bulkTemplateProgress.isRunning ? (
                    <i className="tabler-loader animate-spin" />
                  ) : (
                    <i className="tabler-template" />
                  )
                }
                sx={{
                  minWidth: "200px",
                  backgroundColor: theme.palette.secondary.main,
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                  "&:disabled": {
                    backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : undefined,
                    color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.3)" : undefined,
                  },
                }}
              >
                Create Templates for Selected
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" className="mt-2" sx={{ fontStyle: "italic" }}>
              Tip: Use the checkbox in the table header to select all items at once
            </Typography>
          </Box>
        )}

        <ConfirmationDialog
          openConfirmation={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onConfirm={handleConfirm}
          title="Sync Meta"
          description="Syncing your menu with meta can take upto half an hour. Are you sure you want to Sync Meta?"
        />

        {/* Table */}
        <div className="overflow-x-auto">
          <Box
            sx={{
              "& table": {
                backgroundColor: theme.palette.background.paper,
              },
              "& th": {
                backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,
              },
              "& td": {
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,
              },
              "& tr:hover": {
                backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
              },
              "& tr.selected": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "rgba(25, 118, 210, 0.12)" : "rgba(25, 118, 210, 0.08)",
              },
            }}
          >
            <table className={tableStyles.table}>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={classnames({
                              "flex items-center": header.column.getIsSorted(),
                              "cursor-pointer select-none": header.column.getCanSort(),
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className="tabler-chevron-up text-xl" />,
                              desc: <i className="tabler-chevron-down text-xl" />,
                            }[header.column.getIsSorted() as "asc" | "desc"] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {!selectedBusiness ? (
                  <tr>
                    <td colSpan={table.getVisibleFlatColumns().length} className="text-center py-8">
                      <Typography variant="h6" color="text.secondary">
                        Please select a business to view menu data
                      </Typography>
                    </td>
                  </tr>
                ) : table.getFilteredRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={table.getVisibleFlatColumns().length} className="text-center py-8">
                      <Typography variant="body1" color="text.secondary">
                        No menu data available for the selected business
                      </Typography>
                    </td>
                  </tr>
                ) : (
                  table
                    .getRowModel()
                    .rows.slice(0, table.getState().pagination.pageSize)
                    .map((row) => (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </Box>
        </div>

        {/* Table Pagination */}
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>
    </>
  )
}

export default MenuListTable
