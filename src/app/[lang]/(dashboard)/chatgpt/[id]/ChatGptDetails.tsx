// MUI Imports
'use client'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import type { ButtonProps } from '@mui/material/Button'

// Type Imports
import type { ThemeColor } from '@core/types'
import { useEffect, useState } from 'react'

import { ChatGptType } from '@/api/interface/interfaceChatGPT'
import { getChatGptById } from '@/api/chatGpt'

type PreviewChatGptProps = {
  id: string
}

// MenuDataType
const ChatGptDetails = ({ id }: PreviewChatGptProps) => {
  const [chatGptItemData, setChatGptItemData] = useState<ChatGptType | null>(null)
  // Vars
  const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
    children,
    color,
    variant
  })

  useEffect(() => {
    const fetchChatGpt = async () => {
      try {
        const response = await getChatGptById(Number(id))
        console.log(response?.data, 'response Of ChatGpt------')
        setChatGptItemData(response?.data)
        // setOrderAddress(response?.data?.address)
        // setOrderItemsData(response?.data?.order_items)
      } catch (error: any) {
        console.log(error, 'error')

        // Handle error
      }
    }
    fetchChatGpt()
  }, [id])

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div>
            <Typography variant='h5'>Feed to gpt Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Business
                </Typography>
                <Typography>{chatGptItemData && chatGptItemData.business}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'></Typography>
                <Typography>{chatGptItemData && chatGptItemData.gpt_api_key}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Status
                </Typography>
                {/* <Typography color='text.primary'>{chatGptItemData && chatGptItemData.api_url}</Typography> */}
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Description
                </Typography>
                <Typography color='text.primary'>{chatGptItemData && chatGptItemData.desc}</Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default ChatGptDetails
