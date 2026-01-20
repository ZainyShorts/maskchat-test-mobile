'use client'

import React, { useState } from 'react'
import { Button, Card, CardContent, Grid, Typography, Box, IconButton } from '@mui/material'
// import RemoveIcon from '@mui/icons-material/Remove'
// import AddIcon from '@mui/icons-material/Add'

const menuItems = [
  { name: 'SIGNATURE CHUBBY', price: 12, color: 'primary' },
  { name: "CHUBBY'S SPECIAL", price: 12, color: 'error' },
  { name: 'DOUBLE DECKER', price: 14, color: 'secondary' },
  { name: 'VEGGIE BURGER', price: 10, color: 'success' },
  { name: 'CLASSIC COMBO', price: 15, color: 'warning' }
]

const POS = () => {
  const [order, setOrder] = useState<{ name: string; price: number; quantity: number }[]>([])

  const addToOrder = (item: { name: string; price: number }) => {
    const existingItem = order.find(orderItem => orderItem.name === item.name)
    if (existingItem) {
      setOrder(
        order.map(orderItem =>
          orderItem.name === item.name ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem
        )
      )
    } else {
      setOrder([...order, { ...item, quantity: 1 }])
    }
  }

  const incrementQuantity = (name: string) => {
    setOrder(order.map(item => (item.name === name ? { ...item, quantity: item.quantity + 1 } : item)))
  }

  const decrementQuantity = (name: string) => {
    setOrder(
      order
        .map(item => (item.name === name && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item))
        .filter(item => item.quantity > 0)
    )
  }

  const deleteItem = (name: string) => {
    setOrder(order.filter(item => item.name !== name))
  }

  const calculateTotal = () => {
    return order.reduce((acc, item) => acc + item.price * item.quantity, 0)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h5' gutterBottom>
        All Menu Items
      </Typography>
      <Grid container spacing={2}>
        {/* Menu Buttons */}
        <Grid item xs={8}>
          <Grid container spacing={2}>
            {menuItems.map((item, index) => (
              <Grid item xs={6} sm={4} key={index}>
                <Button
                  variant='contained'
                  color={item.color as any}
                  sx={{ width: '95%', height: '60px' }}
                  onClick={() => addToOrder(item)}
                >
                  {item.name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='h6' gutterBottom>
                  Current Order
                </Typography>
                <Typography variant='h6' gutterBottom>
                  (${calculateTotal()})
                </Typography>
              </div>

              {order.map((item, index) => (
                <Box key={index} display='flex' justifyContent='space-between' alignItems='center' mb={1}>
                  <Typography>
                    {item.name} - ${item.price * item.quantity}
                  </Typography>
                  <Box>
                    <IconButton size='small' onClick={() => decrementQuantity(item.name)}>
                      {/* <RemoveIcon /> */}-
                    </IconButton>
                    <Typography component='span' mx={1}>
                      {item.quantity}
                    </Typography>
                    <IconButton size='small' onClick={() => incrementQuantity(item.name)}>
                      {/* <AddIcon /> */}+
                    </IconButton>
                    <IconButton size='small' color='error' onClick={() => deleteItem(item.name)}>
                      {/* <DeleteIcon /> */} X
                    </IconButton>
                  </Box>
                </Box>
              ))}
              <Typography variant='h6' sx={{ mt: 2 }}>
                Subtotal: ${calculateTotal()}
              </Typography>
              <Typography variant='h6'>Tax: ${(calculateTotal() * 0.1).toFixed(2)}</Typography>
              <Typography variant='h5' sx={{ mt: 2 }}>
                Total: ${(calculateTotal() * 1.1).toFixed(2)}
              </Typography>
              <Button variant='contained' color='primary' fullWidth sx={{ mt: 2 }}>
                Process Payment
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default POS
