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
import type { BusinessTypeForFile } from "@/types/apps/businessTypes"
import { deleteBusiness, getAllBusiness } from "@/api/business"
import EditBusinessInfo from "@/components/dialogs/edit-business-info"
import { useAuthStore } from "@/store/authStore"
import OpenDialogOnElementClick from "@/components/dialogs/OpenDialogOnElementClick"
import type { ButtonProps } from "@mui/material/Button"
import { getLocalizedUrl } from "@/utils/i18n"
import type { Locale } from "@/configs/i18n"
import AddBusinessForm from "@/components/dialogs/add-business-form"
import ConfirmationModal from "@/components/dialogs/confirm-modal"

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type BusinessTypeWithAction = BusinessTypeForFile & {
  action?: string
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
const columnHelper = createColumnHelper<BusinessTypeWithAction>()

const BusinessListTable = ({ tableData }: { tableData?: BusinessTypeForFile[] }) => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const [rowSelection, setRowSelection] = useState({})
  const { businessAction, businessData } = useAuthStore()
  const [editBusinessFlag, setEditBusinessFlag] = useState<boolean>(false)
  const [deleteBusinessOpen, setDeleteBusinessOpen] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<BusinessTypeForFile[]>(tableData || [])
  const [globalFilter, setGlobalFilter] = useState("")

  // Add search state
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  //confirmation modal for delete
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null)
  const { user } = useAuthStore()

  // Updated fetchBusiness function to accept search parameter
  const fetchBusiness = useCallback(
    async (search?: string) => {
      try {
        setLoading(true)
        if (search) {
          setIsSearching(true)
        }

        // Modify your API call to include search parameter
        const response = await getAllBusiness(search ? { search } : undefined)

        const newData = response?.data?.results || []
        setData(newData)

        // Only call businessAction if data actually changed
        if (JSON.stringify(newData) !== JSON.stringify(businessData)) {
          businessAction(newData)
        }
      } catch (err: any) {
        // toast.error(err.message || "Failed to fetch businesses")
        console.log(err.message)
      } finally {
        setLoading(false)
        setIsSearching(false)
      }
    },
    [], // Remove businessAction from dependencies to prevent infinite loops
  )

  // Initial fetch - only run once on mount
  useEffect(() => {
    fetchBusiness()
  }, []) // Empty dependency array

  // Handle delete/edit operations
  useEffect(() => {
    if (deleteBusinessOpen || editBusinessFlag) {
      fetchBusiness(searchQuery || undefined)
      // Reset flags after fetch
      if (editBusinessFlag) setEditBusinessFlag(false)
    }
  }, [deleteBusinessOpen, editBusinessFlag])

  // Handle search query changes with debouncing
  const handleSearchChange = useCallback(
    (value: string | number) => {
      const searchValue = value.toString().trim()
      setSearchQuery(searchValue)

      // Only fetch when there's a search term with at least 2 characters
      if (searchValue.length >= 2) {
        fetchBusiness(searchValue)
      } else if (searchValue.length === 0) {
        // Fetch all businesses when search is completely cleared
        fetchBusiness()
      }
    },
    [fetchBusiness],
  )

  const handleTypeAdded = useCallback(() => {
    fetchBusiness(searchQuery || undefined)
    setEditBusinessFlag(true)
  }, [fetchBusiness, searchQuery])

  const handleDeleteBusiness = (id: number) => {
    setLoading(true)
    deleteBusiness(id.toString())
      .then((res) => {
        toast.success("Business deleted successfully")
        setDeleteBusinessOpen(true)
      })
      .catch((error) => {
        if (error?.data && error?.data?.detail) {
          toast.error(error?.data?.detail)
        } else {
          toast.error("Error in deleting business")
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const truncateText = (text: any, maxLength: any) => {
    if (!text) return ""
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  const columns = useMemo<ColumnDef<BusinessTypeWithAction, any>[]>(
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
      columnHelper.accessor("id", {
        header: "ID",
        cell: ({ row }) => (
          <Typography
            component={Link}
            href={getLocalizedUrl(`/business/${row.original.id}`, locale as Locale)}
            color="primary"
          >{`${row.original.id}`}</Typography>
        ),
      }),
      columnHelper.accessor("business_id", {
        header: "Business Meta Id",
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <Typography color="text.primary" className="font-medium">
                {row?.original?.business_id}
              </Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("name", {
        header: "Business Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <Typography color="text.primary" className="font-medium">
                {row?.original?.name}
              </Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("business_initial", {
        header: "Business Initials",
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <Typography color="text.primary" className="font-medium">
                {row?.original?.business_initial}
              </Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("currency", {
        header: "Currency",
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <Typography color="text.primary" className="font-medium">
                {row?.original?.currency?.label}
              </Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("business_address", {
        header: "Business address",
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <Typography color="text.primary" className="font-medium">
                {truncateText(row?.original?.business_address, 15)}
              </Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("contact_number", {
        header: "Contact number",
        cell: ({ row }) => (
          <Typography className="capitalize" color="text.primary">
            {row?.original?.contact_number}
          </Typography>
        ),
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: ({ row }) => (
          <div className="flex items-center">
            <IconButton
              onClick={() => {
                setSelectedMenuId(row.original.id)
                setIsModalOpen(true)
              }}
            >
              <i className="tabler-trash text-[22px] text-textSecondary" />
            </IconButton>
            <div className="flex gap-4 justify-center">
              <OpenDialogOnElementClick
                element={Button}
                elementProps={buttonProps("Edit", "primary", "contained")}
                dialog={EditBusinessInfo}
                onTypeAdded={handleTypeAdded}
                 dialogProps={{
                  businessId: row?.original?.id
                }}
              />
            </div>
          </div>
        ),
        enableSorting: false,
      }),
    ],
    [locale], // Remove data and businessData from dependencies
  )

  const table = useReactTable({
    data: data as BusinessTypeForFile[],
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
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => selectedMenuId !== null && handleDeleteBusiness(selectedMenuId)}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action? This cannot be undone."
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
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="25">25</MenuItem>
              <MenuItem value="50">50</MenuItem>
            </CustomTextField>

            
          </div>

          {user && Number(user?.user_type) === 1 && (
            <div className="flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4">
              <OpenDialogOnElementClick
                element={Button}
                elementProps={{
                ...buttonProps("Add Business", "primary", "contained"),
                disabled: table && table.getFilteredRowModel().rows.length > 0,
                }}
                dialog={AddBusinessForm}
                onTypeAdded={handleTypeAdded}
                dialogProps={{}}
              />
            </div>
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
                    {loading || isSearching
                      ? "Loading..."
                      : searchQuery
                        ? "No businesses found matching your search"
                        : "No data available"}
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

export default BusinessListTable
