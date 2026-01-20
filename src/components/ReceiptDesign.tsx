// components/Receipt.tsx
import React from 'react'

const ReceiptDesign: React.FC = () => {
  return (
    <div style={styles.container}>
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
        <p>Total: 102,00€</p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '300px',
    padding: '20px',
    border: '1px solid #000',
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '20px'
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold' as const
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
    fontWeight: 'bold' as const
  },
  footer: {
    borderTop: '1px solid #000',
    paddingTop: '10px'
  }
}

export default ReceiptDesign
