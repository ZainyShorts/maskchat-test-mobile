"use client"
// React Imports
import { useEffect, useState, useMemo, useCallback } from "react"
// Next Imports
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
// MUI Imports
import Card from "@mui/material/Card"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import { styled } from "@mui/material/styles"
import TablePagination from "@mui/material/TablePagination"
import type { TextFieldProps } from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import Tooltip from "@mui/material/Tooltip"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import CircularProgress from "@mui/material/CircularProgress"
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
// Component Imports
import TablePaginationComponent from "@components/TablePaginationComponent"
import CustomTextField from "@core/components/mui/TextField"
import tableStyles from "@core/styles/table.module.css"
import OpenDialogOnElementClick from "@/components/dialogs/OpenDialogOnElementClick"
import type { ButtonProps } from "@mui/material/Button"
import { getLocalizedUrl } from "@/utils/i18n"
import type { Locale } from "@/configs/i18n"
import ConfirmationModal from "@/components/dialogs/confirm-modal"
import EditShopifyInfo from "@/components/dialogs/edit-shopify-info"
import AddShopifyForm from "@/components/dialogs/add-shopify-form"
// API Imports - Updated to match your API functions
import { deleteStore, getAllShopify } from "@/api/shopify" // Updated import
import { getAllBusiness } from "@/api/business"
import { GetWhatsApp } from "@/api/whatsapp"
import { WhatsApp } from "@mui/icons-material"
import { syncShopifyData } from "@/api/menu"

// Types
export interface ShopifyAccount {
  id: number
  user: number
  admin_access_token: string
  shopify_domain_url: string
  shopify_version: string
  created_at: string
  updated_at: string
}

type ShopifyAccountWithAction = ShopifyAccount & {
  action?: string
}

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// Styled Components
const Icon = styled("i")({})

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({
    itemRank,
  })
  return itemRank.passed
}

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

const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps["variant"]): ButtonProps => ({
  children,
  color,
  variant,
})

// Column Definitions
const columnHelper = createColumnHelper<ShopifyAccountWithAction>()

// Types for confirmation modal
type ModalType = "delete" | "sync" | null

const ShopifyListTable = ({ tableData }: { tableData?: ShopifyAccount[] }) => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const [rowSelection, setRowSelection] = useState({})
  const [editShopifyFlag, setEditShopifyFlag] = useState<boolean>(false)
  const [deleteShopifyOpen, setDeleteShopifyOpen] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<ShopifyAccount[]>(tableData || [])
  const [globalFilter, setGlobalFilter] = useState("")
  const [webhookCopied, setWebhookCopied] = useState(false)
  const [whstapp, setWhatsapp] = useState(false)
  
  // Dynamic confirmation modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<ModalType>(null)
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null)
  const [syncLoading, setSyncLoading] = useState<boolean>(false)
  const [modalLoading, setModalLoading] = useState<boolean>(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
      open: false,
      message: "",
      severity: "success",
    })

  const showSnackbar = (message: string, severity: "success" | "error" = "success") => {
    setSnackbar({ open: true, message, severity })
  }

  const fetchShopify = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getAllShopify()
      console.log("API Response:", response)
      const newData = response?.data?.results || response?.results || response?.data || []
      setData(newData)
    } catch (err: any) {
      console.error("Error fetching Shopify accounts:", err)
      
      // toast.error(err.message || "Failed to fetch Shopify accounts")
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch - only run once on mount
  useEffect(() => {
    fetchShopify()
  }, [fetchShopify])

  // Handle delete/edit operations
  useEffect(() => {
    if (deleteShopifyOpen || editShopifyFlag) {
      fetchShopify()
      // Reset flags after fetch
      if (editShopifyFlag) setEditShopifyFlag(false)
    }
  }, [deleteShopifyOpen, editShopifyFlag, fetchShopify])

  const handleTypeAdded = useCallback(() => {
    fetchShopify()
    setEditShopifyFlag(true)
  }, [fetchShopify])

  // Updated delete function to use deleteStore
  const handleDeleteShopify = async (id: number) => {
    try {
      setModalLoading(true)
      console.log("Deleting store with ID:", id)
      const response = await deleteStore(id.toString())
      console.log("Delete response:", response)
      // toast.success("Shopify account deleted successfully")
      setDeleteShopifyOpen(true)
      setIsModalOpen(false)
      setSelectedMenuId(null)
      // Refresh the data
      fetchShopify()
    } catch (error: any) {
      console.error("Error deleting store:", error)
      let errorMessage = "Error in deleting Shopify account"
      if (error?.data?.detail) {
        errorMessage = error.data.detail
      } else if (error?.data?.message) {
        errorMessage = error.data.message
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    } finally {
      setModalLoading(false)
    }
  }

  // Sync function
  const handleSyncShopify = async () => {
    if (!userBusinessesData) {
      showSnackbar("Unable to find your business.", "success")
      return
    }

    try {
      setModalLoading(true)
      await syncShopifyData(userBusinessesData.business_id).then((res)=>{
        showSnackbar("Menu sync started in the background...", "success")
      })
      
      setIsModalOpen(false)
    } catch (error: any) {
      
      showSnackbar(error?.data?.message || "Failed to sync menu", "error")
    } finally {
      setModalLoading(false)
    }
  }

  

  // Dynamic modal handler
  const handleModalOpen = (type: ModalType, id?: number) => {
    setModalType(type)
    if (id) setSelectedMenuId(id)
    setIsModalOpen(true)
  }

  const handleModalConfirm = () => {
    if (modalType === "delete" && selectedMenuId !== null) {
      handleDeleteShopify(selectedMenuId)
    } else if (modalType === "sync") {
      handleSyncShopify()
    }
  }

  const getModalConfig = () => {
    switch (modalType) {
      case "delete":
        return {
          title: "Delete Shopify Account",
          message: "Are you sure you want to delete this Shopify account? This action cannot be undone.",
          confirmText: "Delete",
          confirmColor: "error" as const,
        }
      case "sync":
        return {
          title: "Sync Shopify Data",
          message: "This will sync your menu data with Shopify. This may take a few moments. Continue?",
          confirmText: "Sync",
          confirmColor: "primary" as const,
        }
      default:
        return {
          title: "Confirm Action",
          message: "Are you sure you want to proceed?",
          confirmText: "Confirm",
          confirmColor: "primary" as const,
        }
    }
  }

  const handleCopyWebhookUrl = async () => {
    const webhookUrl = `https://kosmos.themaskchat.com/api/whatseat/shopify_webhook/<meta_business_id>/`
    try {
      await navigator.clipboard.writeText(webhookUrl)
      setWebhookCopied(true)
      // toast.success("Webhook URL copied to clipboard!")
    } catch (err) {
      console.error("Failed to copy webhook URL:", err)
      // toast.error("Failed to copy webhook URL")
    }
  }

  const truncateText = (text: any, maxLength: any) => {
    if (!text) return ""
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const columns = useMemo<ColumnDef<ShopifyAccountWithAction, any>[]>(
    () => [
      
      // columnHelper.accessor("id", {
      //   header: "ID",
      //   cell: ({ row }) => (
      //     <Typography
      //       component={Link}
      //       href={getLocalizedUrl(`/shopify/${row.original.id}`, locale as Locale)}
      //       color="primary"
      //     >
      //       {`${row.original.id}`}
      //     </Typography>
      //   ),
      // }),
      columnHelper.accessor("shopify_domain_url", {
        header: "Domain URL",
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <Typography color="text.primary" className="font-medium">
                <Link href={row?.original?.shopify_domain_url} target="_blank" rel="noopener noreferrer">
                  <span>{truncateText(row?.original?.shopify_domain_url, 30)}</span>
                </Link>
              </Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("admin_access_token", {
        header: "Access Token",
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <Typography color="text.primary" className="font-medium font-mono text-sm">
                {truncateText(row?.original?.admin_access_token, 20)}
              </Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("shopify_version", {
        header: "Version",
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <Typography color="text.primary" className="font-medium">
                {row?.original?.shopify_version}
              </Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: "Created At",
        cell: ({ row }) => (
          <Typography className="text-sm" color="text.secondary">
            {formatDate(row?.original?.created_at)}
          </Typography>
        ),
      }),
      columnHelper.accessor("updated_at", {
        header: "Updated At",
        cell: ({ row }) => (
          <Typography className="text-sm" color="text.secondary">
            {formatDate(row?.original?.updated_at)}
          </Typography>
        ),
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Tooltip title="Copy Webhook URL">
              <IconButton onClick={handleCopyWebhookUrl} disabled={loading} size="small">
                <i className="tabler-webhook text-[22px] text-textSecondary" />
              </IconButton>
            </Tooltip>
            <IconButton
              onClick={() => handleModalOpen("delete", row.original.id)}
              disabled={loading}
            >
              <i className="tabler-trash text-[22px] text-textSecondary" />
            </IconButton>
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps("Edit", "primary", "contained")}
              dialog={EditShopifyInfo}
              onTypeAdded={handleTypeAdded}
              dialogProps={{
                data: data.find((item: any) => item.id === row?.original?.id),
              }}
            />
          </div>
        ),
        enableSorting: false,
      }),
    ],
    [locale, data, handleTypeAdded, loading],
  )

  const table = useReactTable({
    data: data as ShopifyAccount[],
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

  const fetchWhatsAppFeed = async () => {
    try {
      const response = await GetWhatsApp()
      const result = response?.data?.results
      if (result.length != 0) return setWhatsapp(true)
    } catch (error: any) {
      // Handle error
      console.log(error)
    }
  }

  useEffect(() => {
    fetchWhatsAppFeed()
  }, [])

  const [userBusinessesData, setUserBusinessesData] = useState<any>()
  const fetchBusiness = useCallback(async () => {
    try {
      const response = await getAllBusiness()
      const businesses = response?.data?.results || []
      setUserBusinessesData(businesses[0])
    } catch (err: any) {
      console.log(err.message)
    }
  }, [setUserBusinessesData])

  // Initial data fetch - only on component mount
  useEffect(() => {
    fetchBusiness()
  }, [fetchBusiness])

  const modalConfig = getModalConfig()

  return (
    <>
    {/* Snackbar */}
          <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
            <Alert onClose={() => setSnackbar((s) => ({ ...s, open: false }))} severity={snackbar.severity} variant="filled" sx={{ alignItems: "center" }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedMenuId(null)
          setModalType(null)
        }}
        onConfirm={handleModalConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
      />

      <Card>
        <div className="flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
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
          </div>

          <div className="flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4">
            {/* Sync Button */}
            {/* {
              whstapp ||  */}
            <Button
              variant="contained"
              color="primary"
              disabled={!userBusinessesData || syncLoading|| !whstapp}
              onClick={() => handleModalOpen("sync")}
              startIcon={syncLoading ? <CircularProgress size={16} /> : null}
            >
              {syncLoading ? "Syncing..." : "Sync Shopify"}
            </Button>
          
            <OpenDialogOnElementClick
              element={Button}
              elementProps={{
                ...buttonProps("Add Shopify Account", "primary", "contained"),
                // disabled: !data,
              }}
              dialog={AddShopifyForm}
              onTypeAdded={handleTypeAdded}
              dialogProps={{}}
            />
          

          </div>
        </div>

        <div className="overflow-x-auto">
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
              {table
                .getRowModel()
                .rows.slice(0, table.getState().pagination.pageSize)
                .map((row) => (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel()?.rows?.length ?? 0}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>

      <Snackbar
        open={webhookCopied}
        autoHideDuration={3000}
        onClose={() => setWebhookCopied(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setWebhookCopied(false)} severity="success">
          Webhook URL copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  )
}

export default ShopifyListTable
