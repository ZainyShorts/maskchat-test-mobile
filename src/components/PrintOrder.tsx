'use client'

import React, { useRef } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import PrintPageClient from './PrintPageClient'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

type PrintOrderProps = {
  id: string
}

const PrintOrder = ({ id }: PrintOrderProps) => {
  const myRef = useRef<HTMLDivElement>(null)

  // Function to generate and download the PDF
  const generatePDF = async () => {
    const input = myRef.current

    if (input) {
      try {
        const canvas = await html2canvas(input, { scale: 2 })
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', 'a4')
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
        pdf.save(`invoice_${id}.pdf`)
      } catch (error) {
        console.error('Error generating PDF:', error)
        alert('Failed to generate PDF. Please try again.')
      }
    } else {
      console.error('Element reference is not available')
      alert('Unable to find the content to generate PDF.')
    }
  }

  // Function to print the invoice
  const printInvoice = () => {
    const element = myRef.current

    if (element) {
      const printContent = element.innerHTML
      const originalContent = document.body.innerHTML

      document.body.innerHTML = printContent
      window.print()
      document.body.innerHTML = originalContent
      window.location.reload() // Reload to restore React's state
    } else {
      console.error('Element reference is not available')
      alert('Unable to find the content to print.')
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={9}>
        {/* Attach the ref to the container wrapping PrintPageClient */}
        <div ref={myRef}>
          <PrintPageClient id={id} />
        </div>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent className='flex flex-col gap-4'>
            <Button fullWidth color='secondary' variant='tonal' onClick={generatePDF}>
              Download PDF
            </Button>
            <Button fullWidth color='secondary' variant='tonal' onClick={printInvoice}>
              Print Invoice
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PrintOrder
