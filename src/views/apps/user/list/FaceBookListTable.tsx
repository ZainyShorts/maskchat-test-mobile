'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
import ConfirmationModal from '@/components/dialogs/confirm-modal'
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
import Alert from "@mui/material/Alert"
import Collapse from "@mui/material/Collapse"
import toast, { Toaster } from 'react-hot-toast'
import type { ThemeColor } from '@core/types'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import tableStyles from '@core/styles/table.module.css'
import { useAuthStore } from '@/store/authStore'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

import type { ButtonProps } from '@mui/material/Button'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { deletInstaGram, GetInstaGram } from '@/api/instagram'
import { InstagramDataType } from '@/api/interface/instagramInterface'
import { MessengerDataType } from '@/api/interface/facebookInterface'
import { deleteFaceBook, GetFaceBook } from '@/api/facebook'
import AddMessengerDrawer from './AddFaceBookDrawer'

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({
    itemRank
  })

  return itemRank.passed
}

const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
  children,
  color,
  variant
})

type AlertState = {
  show: boolean
  type: "success" | "error"
  message: string
}


const columnHelper = createColumnHelper<MessengerDataType>()

const MessengerListTable = ({ tableData }: { tableData?: MessengerDataType[] }) => {

  const [alert, setAlert] = useState<AlertState>({
      show: false,
      type: "success",
      message: "",
    })


  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({
      show: true,
      type,
      message,
    })
  }
  
  
  const { lang: locale } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null)
  const [rowSelection, setRowSelection] = useState({})
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [data, setData] = useState<MessengerDataType[]>(tableData || [])
  const [deleteTelegramOpen, setDeleteTelegramOpen] = useState(false)
  const { telegramAction, telegramData } = useAuthStore()
  const [globalFilter, setGlobalFilter] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [editTelegramFlag, setEditTelegramFlag] = useState(false)

  const fetchMessenger = async () => {
    try {
      const response = await GetFaceBook()
      console.log('response GetInstaGram',response)
      setData(response?.data?.results)
      telegramAction(response?.data?.results)
    } catch (error: any) {
      // Handle error
    }
  }

  useEffect(() => {
    fetchMessenger()
  }, [addUserOpen, deleteTelegramOpen, editTelegramFlag])


  const handleDeleteMessenger = (id: number) => {
    // e.preventDefault()

    deleteFaceBook(id.toString())
      .then(res => {
        showAlert("error", 'Messenger deleted successfully')
        setDeleteTelegramOpen(true)
      })
      .catch(error => {
        console.log(error, 'error in deleting Messenger')
      })
  }

  const truncateText = (text: any, maxLength: any) => {
    if (!text) return ''
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  const columns = useMemo<ColumnDef<MessengerDataType, any>[]>(
    () => [
      columnHelper.accessor('business', {
        header: 'Business ID',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {truncateText(row?.original?.business, 15)}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('page_id', {
        header: 'Page ID',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color="text.primary" className="font-medium">
                {truncateText(row?.original?.page_id, 20)}
              </Typography>

            </div>
          </div>
        )
      }),
      
      
      columnHelper.accessor('token', {
        header: 'Access Token',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color="text.primary" className="font-medium">
                {row?.original?.token
                  ? `${row.original.token.slice(0, 20)} ********`
                  : ''}
              </Typography>

            </div>
          </div>
        )
      }),



      
      
    
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }: { row: any }) => (
          <div className='flex items-center'>
            <IconButton onClick={()=>{
              setSelectedMenuId(row.original.id)
              setIsModalOpen(true)
            }}>
              <i className='tabler-trash text-[22px] text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      }
    ],
    [data]
  )

  const table = useReactTable({
    data: data as any[],
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
    <Collapse in={alert.show} sx={{ mb: 2 }}>
                <Alert severity={alert.type} onClose={() => setAlert((prev) => ({ ...prev, show: false }))} sx={{ mb: 2 }}>
                  {alert.message}
                </Alert>
              </Collapse>
    <ConfirmationModal
                              isOpen={isModalOpen}
                              onClose={() => setIsModalOpen(false)}
                              onConfirm={() => selectedMenuId !== null && handleDeleteMessenger(selectedMenuId)}
                              title="Confirm Action"
                              message="Are you sure you want to proceed with this action? This cannot be undone."
                            />
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
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => setAddUserOpen(!addUserOpen)}
              className='is-full sm:is-auto'
            >
              Add Messenger
            </Button>
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
      <Toaster />
      <AddMessengerDrawer open={addUserOpen} handleClose={() => setAddUserOpen(!addUserOpen)} />
    </>
  )
}

export default MessengerListTable
