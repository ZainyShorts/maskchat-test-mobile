// "use client"
// import { Box, IconButton, Typography } from "@mui/material"
// import CloseIcon from "@mui/icons-material/Close"
// import type { SelectedCard } from "./types"

// interface SelectedCardPreviewProps {
//   selectedCard: SelectedCard | null
//   isMobile: boolean
//   onRemove: () => void
// }

// export function SelectedCardPreview({ selectedCard, isMobile, onRemove }: SelectedCardPreviewProps) {
//   if (!selectedCard) return null

//   return (
//     <Box
//       sx={{
//         mb: 2,
//         p: 2,
//         backgroundColor: "#f5f5f5",
//         borderRadius: "12px",
//         border: "2px solid #c2185b",
//         position: "relative",
//       }}
//     >
//       <IconButton
//         onClick={onRemove}
//         sx={{
//           position: "absolute",
//           top: 8,
//           right: 8,
//           width: 24,
//           height: 24,
//           backgroundColor: "white",
//           "&:hover": {
//             backgroundColor: "#f5f5f5",
//           },
//         }}
//         size="small"
//       >
//         <CloseIcon sx={{ fontSize: 16 }} />
//       </IconButton>
//       <Box sx={{ display: "flex", gap: 2, alignItems: "center", pr: 4 }}>
//         <img
//           src={selectedCard.image || "/placeholder.svg"}
//           alt={selectedCard.title}
//           style={{
//             width: isMobile ? "60px" : "80px",
//             height: isMobile ? "60px" : "80px",
//             objectFit: "cover",
//             borderRadius: "8px",
//           }}
//         />
//         <Box sx={{ flex: 1 }}>
//           <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "#666", display: "block", mb: 0.5 }}>
//             {selectedCard.category}
//           </Typography>
//           <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.9rem", color: "#1a1a1a", lineHeight: 1.3 }}>
//             {selectedCard.title}
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   )
// }

"use client"
import { Box, IconButton, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import type { SelectedCard } from "./types"

interface SelectedCardPreviewProps {
  selectedCard: SelectedCard | null
  isMobile: boolean
  onRemove: () => void
}

export function SelectedCardPreview({ selectedCard, isMobile, onRemove }: SelectedCardPreviewProps) {
  if (!selectedCard) return null

  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        backgroundColor: "#f5f5f5",
        borderRadius: "12px",
        border: "2px solid #c2185b",
        position: "relative",
      }}
    >
      <IconButton
        onClick={onRemove}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          width: 24,
          height: 24,
          backgroundColor: "white",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
        size="small"
      >
        <CloseIcon sx={{ fontSize: 16 }} />
      </IconButton>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", pr: 4 }}>
        <img
          src={selectedCard.image || "/placeholder.svg"}
          alt={selectedCard.title}
          style={{
            width: isMobile ? "60px" : "80px",
            height: isMobile ? "60px" : "80px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "#666", display: "block", mb: 0.5 }}>
            {selectedCard.category}
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.9rem", color: "#1a1a1a", lineHeight: 1.3 }}>
            {selectedCard.title}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
