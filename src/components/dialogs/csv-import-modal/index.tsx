"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Chip,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import toast from "react-hot-toast"

// Required headers for validation - updated to match your requirements
const REQUIRED_HEADERS = ["Title", "Variant SKU", "Variant Price", "Variant Compare At Price", "Image Src", "Body (HTML)"]

// Styled components
const DropZone = styled(Box)(({ theme, isDragOver }: { theme?: any; isDragOver: boolean }) => ({
  border: `2px dashed ${isDragOver ? theme.palette.primary.main : "#ccc"}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: "center",
  minHeight: "200px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: isDragOver ? theme.palette.action.hover : "transparent",
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
  },
}))

const PreviewTable = styled(TableContainer)(({ theme }) => ({
  maxHeight: 500, // Increased height for more rows
  marginTop: theme.spacing(2),
  "& .MuiTableCell-head": {
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
    color: theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.text.primary,
    fontWeight: "bold",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  "& .MuiTableCell-body": {
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "inherit",
    color: theme.palette.text.primary,
  },
}))

interface CSVData {
  headers: string[]
  rows: string[][]
  validationErrors: string[]
  validationWarnings: string[]
}

interface CSVImportModalProps {
  open: boolean
  onClose: () => void
  onImport: (file: File, data: CSVData) => void
}

const CSVImportModal: React.FC<CSVImportModalProps> = ({ open, onClose, onImport }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [csvData, setCsvData] = useState<CSVData | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const steps = ["Upload File", "Preview Data", "Import"]

  // Parse CSV file with header extraction
  const parseCSV = useCallback((text: string): CSVData => {
    try {
      const lines = text.split(/\r?\n/).filter((line) => line.trim())
      if (lines.length === 0) {
        return {
          headers: [],
          rows: [],
          validationErrors: ["File is empty"],
          validationWarnings: [],
        }
      }

      // Parse all headers from CSV
      const headerLine = lines[0]
      const allHeaders = headerLine.split(",").map((h) => h.trim().replace(/^"|"$/g, ""))

      // Find indices of required headers (case-insensitive matching)
      const headerMapping: { [key: string]: number } = {}
      const foundHeaders: string[] = []
      const missingHeaders: string[] = []

      REQUIRED_HEADERS.forEach((requiredHeader) => {
        const index = allHeaders.findIndex(
          (header) =>
            header.toLowerCase().trim() === requiredHeader.toLowerCase().trim() ||
            header.toLowerCase().includes(requiredHeader.toLowerCase()) ||
            requiredHeader.toLowerCase().includes(header.toLowerCase()),
        )

        if (index !== -1) {
          headerMapping[requiredHeader] = index
          foundHeaders.push(requiredHeader)
        } else {
          missingHeaders.push(requiredHeader)
        }
      })

      // Parse all rows first
      const allRows = lines
        .slice(1)
        .map((line) => {
          if (!line.trim()) return []

          // Simple CSV parsing - handle quoted fields
          const result = []
          let current = ""
          let inQuotes = false

          for (let i = 0; i < line.length; i++) {
            const char = line[i]
            if (char === '"') {
              inQuotes = !inQuotes
            } else if (char === "," && !inQuotes) {
              result.push(current.trim().replace(/^"|"$/g, ""))
              current = ""
            } else {
              current += char
            }
          }
          result.push(current.trim().replace(/^"|"$/g, ""))
          return result
        })
        .filter((row) => row.length > 0 && row.some((cell) => cell.trim()))

      // Extract only the required columns from each row
      const extractedRows = allRows
        .map((row) => {
          return REQUIRED_HEADERS.map((header) => {
            const index = headerMapping[header]
            return index !== undefined ? row[index] || "" : ""
          })
        })
        .filter((row) => row.some((cell) => cell.trim()))

      // Validation
      const validationErrors: string[] = []
      const validationWarnings: string[] = []

      // Check for missing required headers
      if (missingHeaders.length > 0) {
        validationErrors.push(`Missing required headers: ${missingHeaders.join(", ")}`)
      }

      // Check for empty required fields
      if (foundHeaders.length > 0) {
        const titleIndex = REQUIRED_HEADERS.indexOf("Title")
        const priceIndex = REQUIRED_HEADERS.indexOf("Variant Price")

        if (titleIndex >= 0 && headerMapping["Title"] !== undefined) {
          const emptyTitles = extractedRows.filter((row) => !row[titleIndex]?.trim()).length
          if (emptyTitles > 0) {
            validationWarnings.push(`${emptyTitles} rows have empty titles`)
          }
        }

        if (priceIndex >= 0 && headerMapping["Variant Price"] !== undefined) {
          const invalidPrices = extractedRows.filter((row) => {
            const price = row[priceIndex]?.trim()
            return price && isNaN(Number.parseFloat(price))
          }).length
          if (invalidPrices > 0) {
            validationWarnings.push(`${invalidPrices} rows have invalid price values`)
          }
        }
      }

      // Additional info about extraction
      if (allHeaders.length > REQUIRED_HEADERS.length) {
        validationWarnings.push(
          `CSV contains ${allHeaders.length} columns, extracted ${foundHeaders.length} required columns`,
        )
      }

      return {
        headers: foundHeaders, // Only return the found required headers
        rows: extractedRows,
        validationErrors,
        validationWarnings,
      }
    } catch (error) {
      console.error("CSV parsing error:", error)
      return {
        headers: [],
        rows: [],
        validationErrors: ["Failed to parse CSV file. Please check the file format."],
        validationWarnings: [],
      }
    }
  }, [])

  // Handle file processing
  const processFile = useCallback(
    async (selectedFile: File) => {
      setIsProcessing(true)
      try {
        const text = await selectedFile.text()
        const parsed = parseCSV(text)
        setCsvData(parsed)

        // Always move to preview step, even if there are validation errors
        // Users should see what's wrong with their data
        setActiveStep(1)
      } catch (error) {
        toast.error("Failed to parse CSV file")
        console.error("CSV parsing error:", error)
        // Reset on error
        setFile(null)
        setCsvData(null)
      } finally {
        setIsProcessing(false)
      }
    },
    [parseCSV],
  )

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const files = Array.from(e.dataTransfer.files)
      const csvFile = files.find((file) => file.type === "text/csv" || file.name.endsWith(".csv"))

      if (csvFile) {
        setFile(csvFile)
        processFile(csvFile)
      } else {
        toast.error("Please drop a valid CSV file")
      }
    },
    [processFile],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile && (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv"))) {
        setFile(selectedFile)
        processFile(selectedFile)
      } else {
        toast.error("Please select a valid CSV file")
      }
    },
    [processFile],
  )

  // Handle import
  const handleImport = async () => {
    if (file && csvData) {
      setIsUploading(true)
      setActiveStep(2)
      try {
        await onImport(file, csvData)
        handleClose()
      } catch (error) {
        setActiveStep(1) // Go back to preview on error
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleClose = () => {
    setFile(null)
    setCsvData(null)
    setIsUploading(false)
    setActiveStep(0)
    setIsProcessing(false)
    onClose()
  }

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const downloadCSVTemplate = () => {
    const headers = REQUIRED_HEADERS
    const sampleData = [
      "Sample Catalouge Item",
      "PH001-A",
      "9.99",
      "0.00", // option
      "https://example.com/image.jpg",
      "<p>Sample item description</p>",
      "XS,S,M,L",
      "Unstitched"
    ]

    const csvContent = headers.join(",") + "\n" + sampleData.join(",")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "menu_import_template.csv"
    link.click()
    window.URL.revokeObjectURL(url)
  }

  // Global drag and drop when modal is open
  useEffect(() => {
    if (open) {
      const handleGlobalDragOver = (e: DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
      }

      const handleGlobalDragLeave = (e: DragEvent) => {
        e.preventDefault()
        if (!e.relatedTarget) {
          setIsDragOver(false)
        }
      }

      const handleGlobalDrop = (e: DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        const files = Array.from(e.dataTransfer?.files || [])
        const csvFile = files.find((file) => file.type === "text/csv" || file.name.endsWith(".csv"))

        if (csvFile) {
          setFile(csvFile)
          processFile(csvFile)
        } else {
          toast.error("Please drop a valid CSV file")
        }
      }

      document.addEventListener("dragover", handleGlobalDragOver)
      document.addEventListener("dragleave", handleGlobalDragLeave)
      document.addEventListener("drop", handleGlobalDrop)

      return () => {
        document.removeEventListener("dragover", handleGlobalDragOver)
        document.removeEventListener("dragleave", handleGlobalDragLeave)
        document.removeEventListener("drop", handleGlobalDrop)
      }
    }
  }, [open, processFile])

  const renderUploadStep = () => (
    <Box>
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Button
          variant="outlined"
          onClick={downloadCSVTemplate}
          startIcon={<i className="tabler-download" />}
          sx={{ mb: 2 }}
        >
          Download CSV Template
        </Button>
        <Typography variant="body2" color="textSecondary">
          Download a template with the required column headers
        </Typography>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Required Headers:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {REQUIRED_HEADERS.map((header) => (
              <Chip key={header} label={header} size="small" variant="outlined" />
            ))}
          </Box>
        </CardContent>
      </Card>

      {!file ? (
        <DropZone
          isDragOver={isDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("csv-file-input")?.click()}
        >
          <i className="tabler-upload" style={{ fontSize: "48px", color: "#666", marginBottom: "16px" }} />
          <Typography variant="h6" gutterBottom>
            Drag and drop your CSV file here
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            or click to browse
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }}>
            Choose File
          </Button>
          <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: "block" }}>
            Supported format: CSV files only
          </Typography>
          <input id="csv-file-input" type="file" accept=".csv" hidden onChange={handleFileSelect} />
        </DropZone>
      ) : (
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <i className="tabler-file-text" style={{ fontSize: "24px", color: "#666" }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1">{file.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {(file.size / 1024).toFixed(2)} KB
                </Typography>
              </Box>
              <IconButton
                onClick={() => {
                  setFile(null)
                  setCsvData(null)
                  setActiveStep(0)
                }}
              >
                <i className="tabler-x" />
              </IconButton>
            </Box>

            {file && isProcessing && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="body2" gutterBottom>
                  Processing CSV file...
                </Typography>
                <LinearProgress />
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  )

  const renderPreviewStep = () => {
    if (!csvData) return null

    return (
      <Box>
        {/* Validation Messages */}
        {csvData.validationErrors.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Validation Errors:
            </Typography>
            {csvData.validationErrors.map((error, index) => (
              <Typography key={index} variant="body2">
                • {error}
              </Typography>
            ))}
          </Alert>
        )}

        {csvData.validationWarnings.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Warnings:
            </Typography>
            {csvData.validationWarnings.map((warning, index) => (
              <Typography key={index} variant="body2">
                • {warning}
              </Typography>
            ))}
          </Alert>
        )}

        {/* Data Summary */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Data Summary
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Total Rows
                </Typography>
                <Typography variant="h6">{csvData.rows.length}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Columns
                </Typography>
                <Typography variant="h6">{csvData.headers.length}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Header Extraction
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {REQUIRED_HEADERS.map((header) => {
                const isFound = csvData.headers.includes(header)
                return (
                  <Chip
                    key={header}
                    label={header}
                    size="small"
                    color={isFound ? "success" : "error"}
                    variant={isFound ? "filled" : "outlined"}
                  />
                )
              })}
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Green chips indicate headers found and extracted from your CSV
            </Typography>
          </CardContent>
        </Card>

        {/* Data Preview Table */}
        <Typography variant="h6" gutterBottom>
          Data Preview (All {csvData.rows.length} rows)
        </Typography>
        <PreviewTable>
          <Paper>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {csvData.headers.map((header, index) => (
                    <TableCell key={index}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {header}
                        {REQUIRED_HEADERS.some((req) => header.toLowerCase().includes(req.toLowerCase())) && (
                          <Chip label="Required" size="small" color="primary" />
                        )}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {csvData.rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={cell}
                        >
                          {cell || <em style={{ color: "#999" }}>Empty</em>}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </PreviewTable>

        <Typography variant="body2" color="textSecondary" sx={{ mt: 1, textAlign: "center" }}>
          Scroll to view all rows • {csvData.rows.length} total rows
        </Typography>
      </Box>
    )
  }

  const renderImportStep = () => (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <LinearProgress />
      </Box>
      <Typography variant="h6" gutterBottom>
        Importing CSV Data...
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Please wait while we process your data. This may take a few moments.
      </Typography>
    </Box>
  )

  return (
    <>
      {/* Global drag overlay */}
      {open && isDragOver && activeStep === 0 && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <Card sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" color="primary" gutterBottom>
              Drop CSV file to import
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Release to upload your file
            </Typography>
          </Card>
        </Box>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { minHeight: "600px" },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6">Import CSV Data</Typography>
            <IconButton onClick={handleClose}>
              <i className="tabler-x" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && renderUploadStep()}
          {activeStep === 1 && renderPreviewStep()}
          {activeStep === 2 && renderImportStep()}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>

          {activeStep === 1 && (
            <Button onClick={handleBack} disabled={isUploading}>
              Back
            </Button>
          )}

          {activeStep === 1 && csvData && csvData.validationErrors.length === 0 && (
            <Button onClick={handleImport} variant="contained" disabled={isUploading}>
              {isUploading ? "Importing..." : `Import ${csvData.rows.length} Rows`}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CSVImportModal
