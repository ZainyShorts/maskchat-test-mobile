'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
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
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import toast, { Toaster } from 'react-hot-toast'

import type { ThemeColor } from '@core/types'

import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

import type { ButtonProps } from '@mui/material/Button'

import tableStyles from '@core/styles/table.module.css'
import { deleteRestaurant } from '@/api/resturant'

import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import { useAuthStore } from '@/store/authStore'

import { deleteOrderReturns, getAllOrderReturns } from '@/api/orderReturns'
import EditOrderReturnInfo from '@/components/dialogs/edit-orderReturn-info'
import { OrderReturnDataType } from '@/api/interface/orderReturnInterface'
import AddOrderReturnDrawer from './AddOrderReturnDrawer'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { convertToPakistanTimeWithoutSecondsAndAMPMFormat } from '@/utils/dateUtils'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type orderReturnTypeWithAction = OrderReturnDataType & {
  action?: string
}

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({
    itemRank
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
} & Omit<TextFieldProps, 'onChange'>) => {
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

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
  children,
  color,
  variant
})

// Column Definitions
const columnHelper = createColumnHelper<orderReturnTypeWithAction>()

const ReturnOrderListTable = ({ tableData }: { tableData?: OrderReturnDataType[] }) => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [deleteOrderReturnOpen, setDeleteOrderReturnOpen] = useState(false)
  const { returnOrderData, returnOrderAction } = useAuthStore()
  const [editReturnFlag, setEditReturnFlag] = useState(false)
  const { user } = useAuthStore()

  // const [data, setData] = useState(tableData || [])
  const [data, setData] = useState<OrderReturnDataType[]>(tableData || [])
  const [globalFilter, setGlobalFilter] = useState('')

  const fetchOrderReturns = async () => {
    try {
      // debugger
      const response = await getAllOrderReturns()
      // debugger
      // console.log(response?.data?.results, 'response?.data?.results')

      setData(response?.data?.results || [])
      returnOrderAction(response?.data?.results || [])
    } catch (err: any) {
      // setError(err.message || 'Failed to fetch users')
    } finally {
      // setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderReturns()
  }, [addUserOpen, deleteOrderReturnOpen, editReturnFlag])

  const handleTypeAdded = () => {
    fetchOrderReturns()
    setEditReturnFlag(true)
  }

  const handleDeleteResturant = (id: number, e: any) => {
    e.preventDefault()

    // console.log(id, 'clicked id is for deletion')
    setDeleteOrderReturnOpen(false)
    deleteOrderReturns(id.toString())
      .then(res => {
        // console.log(res, 'Order Returns deleted')
        toast.success('Order Returns deleted successfully')
        setDeleteOrderReturnOpen(true)
      })
      .catch(error => {
        console.log(error, 'error in deleting Order Returns')

        if (error?.data && error?.data?.detail) {
          toast.error(error?.data?.detail)
        } else {
          toast.error('Error in deleting Order Returns')
        }
      })
  }

  const truncateText = (text: any, maxLength: any) => {
    if (!text) return ''
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  const handleAddReturnOrderRedirect = (e: any) => {
    e.preventDefault()

    router.push(getLocalizedUrl(`/returns/add`, locale as Locale))
  }

  const columns = useMemo<ColumnDef<orderReturnTypeWithAction, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },

      columnHelper.accessor('return_order_number', {
        header: 'Return Order Number',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography
                color='text.primary'
                className='font-medium'
                component={Link}
                href={getLocalizedUrl(`/returns/${row.original.id}`, locale as Locale)}
              >
                {row?.original?.return_order_number}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('created_at', {
        header: 'Creation Date',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row?.original?.created_at && convertToPakistanTimeWithoutSecondsAndAMPMFormat(row?.original?.created_at)}
          </Typography>
        )
      }),
      columnHelper.accessor('order_status', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row?.original?.order_status}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('address', {
        header: 'Address',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {truncateText(row?.original?.address, 15)}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('delivery_type', {
        header: 'Delivery Type',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row?.original?.delivery_type}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('total_price', {
        header: 'Total Price',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row?.original?.total_price}
              </Typography>
            </div>
          </div>
        )
      })

      // columnHelper.accessor('action', {
      //   header: 'Action',
      //   cell: ({ row }) => (
      //     <div className='flex items-center'>
      //       <IconButton onClick={e => handleDeleteResturant(row?.original?.id, e)}>
      //         <i className='tabler-trash text-[22px] text-textSecondary' />
      //       </IconButton>
      //       <div className='flex gap-4 justify-center'>
      //         <OpenDialogOnElementClick
      //           element={Button}
      //           elementProps={buttonProps('Edit', 'primary', 'contained')}
      //           dialog={EditOrderReturnInfo}
      //           onTypeAdded={handleTypeAdded}
      //           dialogProps={{
      //             data: returnOrderData.find((item: any) => item.id === row?.original?.id)
      //           }}
      //         />
      //       </div>
      //     </div>
      //   ),
      //   enableSorting: false
      // })
    ],
    [data]
  )

  const table = useReactTable({
    data: data as OrderReturnDataType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
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
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <>
      <Card>
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='is-[70px]'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4'>
            {/* <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search return'
              className='is-full sm:is-auto'
            /> */}

            {user && Number(user?.user_type) === 1 && (
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              // onClick={() => setAddUserOpen(!addUserOpen)}
              onClick={e => handleAddReturnOrderRedirect(e)}
              className='is-full sm:is-auto'
            >
              Add Return
            </Button>
         )}
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='tabler-chevron-up text-xl' />,
                            desc: <i className='tabler-chevron-down text-xl' />
                          }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
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
                  <td colSpan={table.getVisibleFlatColumns()?.length} className='text-center'>
                    No data available
                  </td>
                </tr>
              ) : (
                table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => (
                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map(cell => (
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
      {/* <Toaster /> */}
      <AddOrderReturnDrawer open={addUserOpen} handleClose={() => setAddUserOpen(!addUserOpen)} />
    </>
  )
}

export default ReturnOrderListTable
