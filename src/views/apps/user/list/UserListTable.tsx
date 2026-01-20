"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Card from "@mui/material/Card"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import { styled } from "@mui/material/styles"
import TablePagination from "@mui/material/TablePagination"
import type { TextFieldProps } from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import toast from "react-hot-toast"
import type { ButtonProps } from "@mui/material/Button"
import classnames from "classnames"
import Link from "next/link"
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
import type { ThemeColor } from "@core/types"
import TablePaginationComponent from "@components/TablePaginationComponent"
import CustomTextField from "@core/components/mui/TextField"
import tableStyles from "@core/styles/table.module.css"
import type { UsersType } from "@/types/apps/userTypes"
import { deletUser, getAllUsers } from "@/api/user"
import Loader from "@/components/loader/Loader"
import OpenDialogOnElementClick from "@/components/dialogs/OpenDialogOnElementClick"
import { useAuthStore } from "@/store/authStore"
import EditUserInfo from "@/components/dialogs/edit-user-info"
import { getLocalizedUrl } from "@/utils/i18n"
import type { Locale } from "@/configs/i18n"
import AddUserForm from "@/components/dialogs/add-user-form"
import ConfirmationModal from "@/components/dialogs/confirm-modal"

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type UsersTypeWithAction = UsersType & {
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

// Updated DebouncedInput component for API search
const DebouncedSearchInput = ({
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
const columnHelper = createColumnHelper<UsersTypeWithAction>()

const UserListTable = ({ tableData }: { tableData?: UsersType[] }) => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const [deleteUserOpen, setDeleteUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<UsersType[]>(tableData || [])
  const [searchQuery, setSearchQuery] = useState("")
  const [globalFilter, setGlobalFilter] = useState("")
  const { userData, userAction } = useAuthStore()
  const [editUserFlag, setEditUserFlag] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { user } = useAuthStore()

  // Confirmation modal for delete
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null)

  // Updated fetchUsers function to accept search parameter
  const fetchUsers = useCallback(
    async (search?: string) => {
      setLoading(true)
      try {
        // Pass search query to API function
        const response = await getAllUsers({ search: search || "" })
        setData(response?.data?.results || [])
        userAction(response?.data?.results || [])
      } catch (err: any) {
        console.log(err, "err")
        toast.error("Error fetching users")
      } finally {
        setLoading(false)
      }
    },
    [userAction],
  )

  // Handle search with debouncing
  const handleSearch = useCallback(
    (searchValue: string | number) => {
      const query = String(searchValue)
      setSearchQuery(query)
      fetchUsers(query)
    },
    [fetchUsers],
  )

  // Initial fetch and refetch on certain state changes
  useEffect(() => {
    fetchUsers()
  }, [deleteUserOpen, editUserFlag, fetchUsers])

  const handleTypeAdded = () => {
    fetchUsers(searchQuery)
    setEditUserFlag(true)
  }

  const handleDeleteUser = (id: number) => {
    deletUser(id.toString())
      .then((res) => {
        toast.success("User deleted successfully")
        setDeleteUserOpen(true)
        fetchUsers(searchQuery) // Maintain current search when refetching
      })
      .catch((error) => {
        console.log(error, "error in deleting User")
        if (error?.data && error?.data?.detail) {
          toast.error(error?.data?.detail)
        } else {
          toast.error("Error in deleting User")
        }
      })
  }

  const columns = useMemo<ColumnDef<UsersTypeWithAction, any>[]>(
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
        header: "User Id",
        cell: ({ row }) => (
          <Typography
            component={Link}
            href={getLocalizedUrl(`/users/${row.original.id}`, locale as Locale)}
            color="primary"
          >{`${row.original.id}`}</Typography>
        ),
      }),
      columnHelper.accessor("first_name", {
        header: "First Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <Typography color="text.primary" className="font-medium">
                {row?.original?.first_name}
              </Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Icon />
            <Typography className="capitalize" color="text.primary">
              {row?.original?.status}
            </Typography>
          </div>
        ),
      }),
      columnHelper.accessor("country", {
        header: "Country",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Icon />
            <Typography className="capitalize" color="text.primary">
              {row?.original?.country}
            </Typography>
          </div>
        ),
      }),
      columnHelper.accessor("city", {
        header: "City",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Icon />
            <Typography className="capitalize" color="text.primary">
              {row?.original?.city}
            </Typography>
          </div>
        ),
      }),
      columnHelper.accessor("postalCode", {
        header: "Postal Code Delivery",
        cell: ({ row }) => (
          <Typography className="capitalize" color="text.primary">
            {row?.original?.postalCode}
          </Typography>
        ),
      }),
      // columnHelper.accessor("user_type", {
      //   header: "User Type",
      //   cell: ({ row }) => <Typography>{row?.original?.user_type}</Typography>,
      // }),
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
                dialog={EditUserInfo}
                onTypeAdded={handleTypeAdded}
                dialogProps={{
                  data: userData.find((item: any) => item.id === row?.original?.id),
                }}
              />
            </div>
          </div>
        ),
        enableSorting: false,
      }),
    ],
    [data, userData, locale, searchQuery],
  )

  const table = useReactTable({
    data: data as UsersType[],
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
        onConfirm={() => selectedMenuId !== null && handleDeleteUser(selectedMenuId)}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action? This cannot be undone."
      />
      <Card>
        {/* {loading && <Loader />} */}
        <div className="flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4">
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
          <div className="flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4">
            {/* <DebouncedSearchInput
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search User"
              className="is-full sm:is-auto"
              debounce={500}
            /> */}
            {
              user && Number(user.user_type) === 1 &&
            <OpenDialogOnElementClick
            element={Button}
            elementProps={buttonProps("Add User", "primary", "contained")}
            dialog={AddUserForm}
            onTypeAdded={handleTypeAdded}
            dialogProps={{}}
            />
          }
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
              {table.getFilteredRowModel().rows?.length === 0 ? (
                <tr>
                  <td colSpan={table.getVisibleFlatColumns()?.length} className="text-center">
                    {loading ? "Loading..." : "No data available"}
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

export default UserListTable
