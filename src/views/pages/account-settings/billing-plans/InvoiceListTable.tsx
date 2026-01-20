"use client"

// React Imports
import { useState, useEffect, useMemo } from "react"

// MUI Imports
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import MenuItem from "@mui/material/MenuItem"
import Tooltip from "@mui/material/Tooltip"
import TablePagination from "@mui/material/TablePagination"
import type { TextFieldProps } from "@mui/material/TextField"

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
import type { ThemeColor } from "@core/types"

// Component Imports
import CustomAvatar from "@core/components/mui/Avatar"
import TablePaginationComponent from "@components/TablePaginationComponent"
import CustomTextField from "@core/components/mui/TextField"

// Util Imports
import { getInitials } from "@/utils/getInitials"

// Style Imports
import tableStyles from "@core/styles/table.module.css"
import { useAuthStore } from "@/store/authStore"
import { ENDPOINTS, getBaseUrl } from "@/api/vars/vars"

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// Updated types for the API response
type InvoiceApiResponse = {
  count: number
  next: string | null
  previous: string | null
  results: InvoiceData[]
}

type InvoiceData = {
  invoice_id: string
  amount_paid: string
  currency: string
  start_date: string
  status: string
}

type InvoiceDataWithAction = InvoiceData & {
  action?: string;
  paid: string;
}

type InvoiceStatusObj = {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
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
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={(e) => setValue(e.target.value)} />
}

// Updated status object for invoice statuses
const invoiceStatusObj: InvoiceStatusObj = {
  paid: { color: "success", icon: "tabler-check" },
  pending: { color: "warning", icon: "tabler-clock" },
  failed: { color: "error", icon: "tabler-x" },
  draft: { color: "primary", icon: "tabler-mail" },
  open: { color: "info", icon: "tabler-file-text" },
  void: { color: "secondary", icon: "tabler-ban" },
}

// Column Definitions
const columnHelper = createColumnHelper<InvoiceDataWithAction>()

const InvoiceListTable = () => {
  // States
  const [status, setStatus] = useState<string>("")
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<InvoiceData[]>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuthStore()

  // Fetch data from API
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        const authToken = localStorage.getItem("auth_token")

        if (!authToken) {
          throw new Error("No authentication token found")
        }

        const response = await fetch(`${getBaseUrl()}account/${ENDPOINTS.invoices}/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result: InvoiceApiResponse = await response.json()
        setData(result.results)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch invoices")
        console.error("Error fetching invoices:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

 

  const columns = useMemo<ColumnDef<InvoiceDataWithAction, any>[]>(
    () => [
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => (
          <Tooltip
            title={
              <div>
                <Typography variant="body2" component="span" className="text-inherit">
                  Status: {row.original.status}
                </Typography>
                <br />
                <Typography variant="body2" component="span" className="text-inherit">
                  Amount: {row.original.amount_paid} {row.original.currency}
                </Typography>
                <br />
                <Typography variant="body2" component="span" className="text-inherit">
                  Invoice ID: {row.original.invoice_id}
                </Typography>
              </div>
            }
          >
            <CustomAvatar skin="light" color={invoiceStatusObj[row.original.status]?.color || "primary"} size={28}>
              <i
                className={classnames("bs-4 is-4", invoiceStatusObj[row.original.status]?.icon || "tabler-file-text")}
              />
            </CustomAvatar>
          </Tooltip>
        ),
      }),
      columnHelper.accessor("invoice_id", {
        header: "User",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <CustomAvatar skin="light" size={34}>
              {user?.first_name ? getInitials(user.first_name) : "U"}
            </CustomAvatar>
            <div className="flex flex-col">
              <Typography className="font-medium" color="text.primary">
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography variant="body2">{row.original.invoice_id}</Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("amount_paid", {
        header: "Amount",
        cell: ({ row }) => (
          <Typography className="font-medium">{`${row.original.amount_paid} ${row.original.currency}`}</Typography>
        ),
      }),
      columnHelper.accessor("paid", {
        header: "Status",
        cell: ({ row }) => (
          <Typography className="font-medium">Paid</Typography>
        ),
      }),
      columnHelper.accessor("start_date", {
        header: "Issue Date",
        cell: ({ row }) => (
          <Typography>
            {new Date(row.original.start_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Typography>
        ),
      }),
    ],
    [user],
  )

  const table = useReactTable({
    data: data as InvoiceData[],
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

  // Filter data based on status
  useEffect(() => {
    const filteredData = data?.filter((invoice) => {
      if (status && invoice.status !== status) return false
      return true
    })

    // Note: We don't need to setData here as we're filtering in the table itself
  }, [status, data])

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Typography>Loading invoices...</Typography>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Typography color="error">Error: {error}</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="flex justify-between flex-col items-start md:items-center md:flex-row gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Typography className="hidden sm:block">Show</Typography>
            <CustomTextField
              select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="is-[70px]"
            >
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="25">25</MenuItem>
              <MenuItem value="50">50</MenuItem>
            </CustomTextField>
          </div>
          {/* <div className="flex items-center gap-4">
            <CustomTextField
              select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              displayEmpty
              className="is-[160px]"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="void">Void</MenuItem>
            </CustomTextField>
          </div> */}
        </div>
      </CardContent>
      <div className="overflow-x-auto">
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
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
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className="text-center">
                  No data available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, table.getState().pagination.pageSize)
                .map((row) => {
                  return (
                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  )
                })}
            </tbody>
          )}
        </table>
      </div>
      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
        onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
      />
    </Card>
  )
}

export default InvoiceListTable
