import React, { useRef } from 'react'

interface ReceiptModalProps {
  onClose: () => void
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ onClose }) => {
  // Ref to the modal content for printing
  const receiptRef = useRef<HTMLDivElement>(null)

  // Handler to stop click events from propagating to the overlay
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  // Handler to print the receipt
  const handlePrint = () => {
    if (receiptRef.current) {
      const printContent = receiptRef.current.innerHTML
      const printWindow = window.open('', '', 'height=600,width=800')
      if (printWindow) {
        printWindow.document.write('<html><head><title>Receipt</title>')
        // Include any styles you need for printing
        printWindow.document.write(`
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; }
            .section { margin-bottom: 10px; }
            .section-title { font-weight: bold; }
            .footer { border-top: 1px solid #ddd; padding-top: 10px; text-align: right; }
            .close-button, .print-button { 
              position: absolute; 
              top: 10px; 
              background: transparent; 
              border: none; 
              font-size: 20px; 
              cursor: pointer; 
              padding: 0; 
            }
            .close-button { right: 50px; }
            .print-button { right: 10px; }
          </style>
        `)
        printWindow.document.write('</head><body>')
        printWindow.document.write(printContent)
        printWindow.document.write('</body></html>')
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
        printWindow.close()
      }
    }
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={handleModalClick} ref={receiptRef}>
        <button style={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <button style={styles.printButton} onClick={handlePrint}>
          🖨️
        </button>

        <div style={styles.header}>
          <h1 style={styles.title}>Lieferando.de</h1>
          <p>Pizzeria Da Gennaro, Cheruskerstraße 143, 33649 Bielefeld</p>
          <p>Bestätigte Zeit: 21:08</p>
        </div>

        <div style={styles.body}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Pasta - Nudeln</h3>
            <p>2x Spaghetti Mare - 24,00€</p>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Riesenpizza</h3>
            <p>1x Pizza Verdura mit frischem Gemüse - 30,00€</p>
            <p>1x Margherita Familia - 20,00€</p>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Überbackenes</h3>
            <p>2x Verdure Gratinatee - 25,00€</p>
          </div>
        </div>

        <div style={styles.footer}>
          <p>Lieferkosten: 3,00€</p>
          <p>Servicegebühr: 0,00€</p>
          <p>
            <strong>Total: 102,00€</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0, // Ensure it covers the entire viewport
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    cursor: 'pointer' // Indicates that clicking on the overlay will close the modal
  },
  modal: {
    position: 'relative', // Needed to position the close and print buttons correctly
    display: 'flex',
    flexDirection: 'column' as const,
    width: '320px',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
    cursor: 'default' // Prevents the cursor from changing when hovering inside the modal
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '20px'
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold' as const,
    marginBottom: '10px'
  },
  body: {
    display: 'flex',
    flexDirection: 'column' as const,
    marginBottom: '20px'
  },
  section: {
    marginBottom: '10px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold' as const,
    marginBottom: '5px'
  },
  footer: {
    borderTop: '1px solid #ddd',
    paddingTop: '10px',
    textAlign: 'right' as const,
    fontSize: '16px'
  },
  closeButton: {
    position: 'absolute' as const,
    top: '10px',
    right: '50px', // Adjusted to make space for the print button
    background: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    lineHeight: '20px',
    padding: 0
  },
  printButton: {
    position: 'absolute' as const,
    top: '10px',
    right: '10px',
    background: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    lineHeight: '20px',
    padding: 0
  }
}

export default ReceiptModal
