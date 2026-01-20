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
import { styled } from "@mui/material/styles"
import TablePagination from "@mui/material/TablePagination"
import type { TextFieldProps } from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import type { ButtonProps } from "@mui/material/Button"
import InputAdornment from "@mui/material/InputAdornment"

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
import type { OrdersType } from "@/types/apps/orderTypes"
import type { BusinessTypeForFile } from "@/types/apps/businessTypes"
import { getAllOrdersByBusinessId } from "@/api/order"
import { getAllBusiness } from "@/api/business"
import EditOrderInfo from "@/components/dialogs/edit-order-info"
import OpenDialogOnElementClick from "@/components/dialogs/OpenDialogOnElementClick"
import { useAuthStore } from "@/store/authStore"
import { getLocalizedUrl } from "@/utils/i18n"
import type { Locale } from "@/configs/i18n"
import { IconButton } from "@mui/material"
import { convertToPakistanTimeWithoutSecondsAndAMPMFormat } from "@/utils/dateUtils"

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type OrdersTypeWithAction = OrdersType & {
  action?: string
}

const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps["variant"]): ButtonProps => ({
  children,
  color,
  variant,
})

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

// Column Definitions
const columnHelper = createColumnHelper<OrdersTypeWithAction>()

const OrderListTable = ({ tableData }: { tableData?: OrdersType[] }) => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const [rowSelection, setRowSelection] = useState({})
  const [editOrderFlag, setEditOrderFlag] = useState(false)
  const { orderData, orderAction } = useAuthStore()
  const [data, setData] = useState<OrdersType[]>(tableData || [])
  const [globalFilter, setGlobalFilter] = useState("")

  // Add search state
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Add business filter state
  const [businesses, setBusinesses] = useState<BusinessTypeForFile[]>([])
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("")
  const [loadingBusinesses, setLoadingBusinesses] = useState<boolean>(false)
  const [businessesLoaded, setBusinessesLoaded] = useState<boolean>(false)

  const { user } = useAuthStore()

  // Fetch businesses function
  const fetchBusinesses = useCallback(async () => {
    try {
      setLoadingBusinesses(true)
      const response = await getAllBusiness()
      const businessData = response?.data?.results || []
      setBusinesses(businessData)

      // Auto-select first business if available
      if (businessData.length > 0) {
        setSelectedBusinessId(businessData[0].id.toString())
      }

      setBusinessesLoaded(true)
    } catch (err: any) {
      // toast.error(err.message || "Failed to fetch businesses")
      console.log(err.message)
      setBusinessesLoaded(true)
    } finally {
      setLoadingBusinesses(false)
    }
  }, [])

  // Updated fetchOrders function to accept search and business parameters
  const fetchOrders = useCallback(
    async (search?: string, businessId?: string) => {
      // Don't fetch orders if no businesses are loaded or no business is selected
      if (!businessesLoaded || !businessId) {
        setData([])
        return
      }

      try {
        setLoading(true)
        if (search) {
          setIsSearching(true)
        }

        // Build parameters object
        const params: any = {}
        if (search) {
          params.search = search
        }
        if (businessId) {
          params.business_id = businessId
        }

        console.log("params", params)

        if (businessId) {
          const response = await getAllOrdersByBusinessId(businessId)
          const newData = response || []
          setData(newData)

          if (JSON.stringify(newData) !== JSON.stringify(orderData)) {
            orderAction(newData)
          }
        } else {
          setData([])
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch orders")
      } finally {
        setLoading(false)
        setIsSearching(false)
      }
    },
    [businessesLoaded, orderData, orderAction],
  )

  // Initial fetch - fetch businesses first
  useEffect(() => {
    fetchBusinesses()
  }, [fetchBusinesses])

  // Fetch orders when businesses are loaded and first business is selected
  useEffect(() => {
    if (businessesLoaded && selectedBusinessId) {
      fetchOrders(undefined, selectedBusinessId)
    }
  }, [businessesLoaded, selectedBusinessId, fetchOrders])

  // Handle edit operations
  useEffect(() => {
    if (editOrderFlag) {
      fetchOrders(searchQuery || undefined, selectedBusinessId)
      setEditOrderFlag(false)
    }
  }, [editOrderFlag, fetchOrders, searchQuery, selectedBusinessId])

  // Handle search query changes with debouncing
  const handleSearchChange = useCallback(
    (value: string | number) => {
      const searchValue = value.toString().trim()
      setSearchQuery(searchValue)

      // Only fetch when there's a search term with at least 2 characters
      if (searchValue.length >= 2) {
        fetchOrders(searchValue, selectedBusinessId)
      } else if (searchValue.length === 0) {
        // Fetch orders when search is completely cleared
        fetchOrders(undefined, selectedBusinessId)
      }
    },
    [fetchOrders, selectedBusinessId],
  )

  // Handle business selection change
  const handleBusinessChange = useCallback(
    (businessId: string) => {
      setSelectedBusinessId(businessId)
      // Fetch orders for the selected business
      fetchOrders(searchQuery || undefined, businessId)
    },
    [fetchOrders, searchQuery],
  )

  const handleTypeAdded = useCallback(() => {
    fetchOrders(searchQuery || undefined, selectedBusinessId)
    setEditOrderFlag(true)
  }, [fetchOrders, searchQuery, selectedBusinessId])

  const handlePrintOrder = (id: number, e: any) => {
    e.preventDefault()
    router.push(getLocalizedUrl(`/orders/${id}`, locale as Locale))
  }

  const handleAddOrderRedirect = (e: any) => {
    e.preventDefault()
    router.push(getLocalizedUrl(`/orders/add`, locale as Locale))
  }

  const truncateText = (text: any, maxLength: any) => {
    if (!text) return ""
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  const columns = useMemo<ColumnDef<OrdersTypeWithAction, any>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        ),
      },
      columnHelper.accessor("order_number", {
        header: "Order #",
        cell: ({ row }) => (
          <Typography
            component={Link}
            href={getLocalizedUrl(`/orders/view/${row.original.id}`, locale as Locale)}
            color="primary"
          >{`${row.original.order_number}`}</Typography>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: "Creation Date",
        cell: ({ row }) => (
          <Typography color="text.primary">
            {row?.original?.created_at && convertToPakistanTimeWithoutSecondsAndAMPMFormat(row?.original?.created_at)}
          </Typography>
        ),
      }),
      columnHelper.accessor("delivery_type", {
        header: "Delivery Type",
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <Typography color="text.primary" className="font-medium">
                {row?.original?.delivery_type}
              </Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <Typography color="text.primary" className="font-medium">
                {row?.original?.status}
              </Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("total_price", {
        header: "Total Price",
        cell: ({ row }) => <Typography>{row?.original?.total_price}</Typography>,
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: ({ row }) => (
          <div className="flex items-center">
            <IconButton onClick={(e) => handlePrintOrder(row.original.id, e)}>
              <i className="tabler-file-description" />
            </IconButton>
            <div className="flex gap-4 justify-center">
              <OpenDialogOnElementClick
                element={Button}
                elementProps={buttonProps("Edit", "primary", "contained")}
                dialog={EditOrderInfo}
                onTypeAdded={handleTypeAdded}
                dialogProps={{
                  data: orderData.find((item: any) => item.id === row?.original?.id),
                }}
              />
            </div>
          </div>
        ),
        enableSorting: false,
      }),
    ],
    [locale],
  )

  const table = useReactTable({
    data: data as OrdersType[],
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
      <Card>
        <div className="flex justify-between items-center p-6 border-bs gap-6">
          {/* Left side filters - evenly spaced */}
          <div className="flex items-center gap-6 flex-1">
            {/* Page Size Selector */}
            <CustomTextField
              select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="w-[80px]"
              size="small"
            >
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="25">25</MenuItem>
              <MenuItem value="50">50</MenuItem>
            </CustomTextField>

            {/* Business Filter Dropdown */}
            <CustomTextField
              select
              value={selectedBusinessId}
              onChange={(e) => handleBusinessChange(e.target.value)}
              className="min-w-[280px] max-w-[320px]"
              // label="Select Business"
              size="small"
              disabled={loadingBusinesses || businesses.length === 0}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="tabler-building text-textSecondary" />
                  </InputAdornment>
                ),
                endAdornment: loadingBusinesses && (
                  <InputAdornment position="end">
                    <i className="tabler-loader animate-spin text-textSecondary" />
                  </InputAdornment>
                ),
              }}
            >
              {businesses.length === 0 ? (
                <MenuItem value="" disabled>
                  No businesses available
                </MenuItem>
              ) : (
                businesses.map((business) => (
                  <MenuItem key={business.id} value={business.id.toString()}>
                    {business.name} ({business.business_initial})
                  </MenuItem>
                ))
              )}
            </CustomTextField>

            {/* Search Input */}
            {/* <DebouncedInput
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search orders..."
              className="min-w-[300px] max-w-[400px] flex-1"
              size="small"
              disabled={!selectedBusinessId}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="tabler-search text-textSecondary" />
                  </InputAdornment>
                ),
                endAdornment: (loading || isSearching) && (
                  <InputAdornment position="end">
                    <i className="tabler-loader animate-spin text-textSecondary" />
                  </InputAdornment>
                ),
              }}
              debounce={300}
            /> */}
          </div>

          {/* Right side button */}
          {user && (Number(user!.user_type) === 1 || Number(user!.user_type) === 3) && (
            <Button
              variant="contained"
              startIcon={<i className="tabler-plus" />}
              onClick={(e) => handleAddOrderRedirect(e)}
              className="whitespace-nowrap"
              size="small"
            >
              Add Order
            </Button>
          )}
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
              {table.getFilteredRowModel().rows?.length === 0 ? (
                <tr>
                  <td colSpan={table.getVisibleFlatColumns()?.length} className="text-center">
                    {loadingBusinesses
                      ? "Loading businesses..."
                      : businesses.length === 0
                        ? "No businesses available"
                        : !selectedBusinessId
                          ? "Please select a business"
                          : loading || isSearching
                            ? "Loading..."
                            : searchQuery
                              ? "No orders found matching your search"
                              : "No orders found for selected business"}
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
    </>
  )
}

export default OrderListTable
