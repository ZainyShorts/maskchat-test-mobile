// // "use client"
// // import { Box, IconButton, TextField, useMediaQuery, useTheme } from "@mui/material"
// // import SendIcon from "@mui/icons-material/Send"

// // export function InputBar({
// //   value,
// //   disabled,
// //   hasSelectedCard,
// //   onChange,
// //   onSend,
// // }: {
// //   value: string
// //   disabled: boolean
// //   hasSelectedCard: boolean
// //   onChange: (v: string) => void
// //   onSend: () => void
// // }) {
// //   const theme = useTheme()
// //   const isMobile = useMediaQuery(theme.breakpoints.down("md"))

// //   return (
// //     <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
// //       <Box sx={{ flex: 1, position: "relative" }}>
// //         <TextField
// //   fullWidth
// //   value={value}
// //   onChange={(e) => onChange(e.target.value)}
// //   onKeyPress={(e) => {
// //     if (e.key === "Enter" && !e.shiftKey) {
// //       e.preventDefault()
// //       onSend()
// //     }
// //   }}
// //   placeholder="Start Typing"
// //   variant="outlined"
// //   size="small"
// //   disabled={disabled}
// //   sx={{
// //     "& .MuiOutlinedInput-root": {
// //       backgroundColor: "#f6f6f6",
// //       borderRadius: "50px",
// //       paddingRight: "48px", // space for send button
// //       height: "48px",
// //       boxShadow: "none",

// //       "& fieldset": {
// //         border: "none",
// //       },

// //       "& input": {
// //         padding: "0 20px",
// //         fontSize: "15px",
// //         color: "#555",
// //       },

// //       "& input::placeholder": {
// //         color: "#A0A0A0",
// //         opacity: 1,
// //       },

// //       "&:hover fieldset": {
// //         border: "none",
// //       },
// //       "&.Mui-focused fieldset": {
// //         border: "none",
// //       },
// //     },
// //   }}
// // />

// //       </Box>

// //       <Box sx={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)" }}>
// //       <IconButton
// //     onClick={onSend}
// //     disabled={(!value.trim() && !hasSelectedCard) || disabled}
// //     sx={{
// //       backgroundColor:
// //         (!value.trim() && !hasSelectedCard) || disabled
// //           ? "#e5e5e5"
// //           : "white",
// //       color:
// //         (!value.trim() && !hasSelectedCard) || disabled
// //           ? "#999"
// //           : "#c2185b",
// //       width: 36,
// //       height: 36,
// //       boxShadow: "0 0 4px rgba(0,0,0,0.15)",

// //       "&:hover": {
// //         backgroundColor:
// //           (!value.trim() && !hasSelectedCard) || disabled
// //             ? "#e5e5e5"
// //             : "#f2f2f2",
// //       },
// //     }}
// //   >
// //     <SendIcon sx={{ fontSize: 20 }} />
// //   </IconButton>
// //       </Box>
// //     </Box>
// //   )
// // }


// "use client"
// import { Box, IconButton, TextField, useMediaQuery, useTheme } from "@mui/material"
// import SendIcon from "@mui/icons-material/Send"

// export function InputBar({
//   value,
//   disabled,
//   hasSelectedCard,
//   onChange,
//   onSend,
// }: {
//   value: string
//   disabled: boolean
//   hasSelectedCard: boolean
//   onChange: (v: string) => void
//   onSend: () => void
// }) {
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"))

//   return (
//     <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      
//       {/* Wrapper for Input + Button */}
//       <Box sx={{ flex: 1, position: "relative" }}>
        
//         {/* INPUT */}
//         <TextField
//           fullWidth
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           onKeyPress={(e) => {
//             if (e.key === "Enter" && !e.shiftKey) {
//               e.preventDefault()
//               onSend()
//             }
//           }}
//           placeholder="Start Typing"
//           variant="outlined"
//           size="small"
//           disabled={disabled}
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               backgroundColor: "#f6f6f6",
//               borderRadius: "50px",
//               paddingRight: "48px", // space for send button
//               height: "48px",
//               borderColor:'#f5f5f5',
//               boxShadow: "none",

//               "& fieldset": { border: "none" },
//               "& input": {
//                 padding: "0 20px",
//                 fontSize: "15px",
//                 color: "#555",
//               },
//               "& input::placeholder": { color: "#A0A0A0", opacity: 1 },


//               "&:hover fieldset": { border: "none" },
//               "&.Mui-focused fieldset": { border: "none" },
//             },
//           }}
//         />

//         {/* SEND BUTTON INSIDE SAME WRAPPER (position absolute works now) */}
//         <IconButton
//           onClick={onSend}
//           disabled={(!value.trim() && !hasSelectedCard) || disabled}
//           sx={{
//             position: "absolute",
//             right: 6,
//             top: "50%",
//             transform: "translateY(-50%)",
//             backgroundColor:
//               (!value.trim() && !hasSelectedCard) || disabled ? "#e5e5e5" : "white",
//             color:
//               (!value.trim() && !hasSelectedCard) || disabled ? "#999" : "#c2185b",
//             width: 36,
//             height: 36,
//             boxShadow: "0 0 4px rgba(0,0,0,0.15)",
//             "&:hover": {
//               backgroundColor:
//                 (!value.trim() && !hasSelectedCard) || disabled ? "#e5e5e5" : "#f2f2f2",
//             },
//           }}
//         >
//           <SendIcon sx={{ fontSize: 20}} />
//         </IconButton>

//       </Box>
//     </Box>
//   )
// }

"use client"
import { Box, IconButton, TextField, useMediaQuery, useTheme } from "@mui/material"
import SendIcon from "@mui/icons-material/Send"

export function InputBar({
  value,
  disabled,
  hasSelectedCard,
  onChange,
  onSend,
}: {
  value: string
  disabled: boolean
  hasSelectedCard: boolean
  onChange: (v: string) => void
  onSend: () => void
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Box sx={{ flex: 1, position: "relative" }}>
        <TextField
          fullWidth
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              onSend()
            }
          }}
          placeholder="Start Typing"
          variant="outlined"
          size="small"
          disabled={disabled}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
              "& fieldset": {
                borderColor: "#e0e0e0",
              },
              "&:hover fieldset": {
                borderColor: "#c2185b",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#c2185b",
              },
            },
          }}
        />
      </Box>

      <IconButton
        onClick={onSend}
        disabled={(!value.trim() && !hasSelectedCard) || disabled}
        sx={{
          backgroundColor:
            (!value.trim() && !hasSelectedCard) || disabled
              ? theme.palette.action.disabledBackground
              : "#c2185b",
          color: "white",
          width: 40,
          height: 40,
          "&:hover": {
            backgroundColor:
              (!value.trim() && !hasSelectedCard) || disabled
                ? theme.palette.action.disabledBackground
                : "#9c1449",
          },
          "&:disabled": {
            backgroundColor: theme.palette.action.disabledBackground,
            color: theme.palette.action.disabled,
          },
        }}
        size={isMobile ? "small" : "medium"}
      >
        <SendIcon />
      </IconButton>
    </Box>
  )
}
