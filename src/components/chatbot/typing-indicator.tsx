// "use client"
// import { Avatar, Box, Paper, Typography, useTheme } from "@mui/material"

// export function TypingIndicator({ avatar, initial }: { avatar: string; initial: string }) {
//   const theme = useTheme()
//   return (
//     <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start", gap: 1, width: "100%" }}>
//       <Avatar
//         sx={{ width: 40, height: 40, fontSize: "1.2rem", fontWeight: "bold", "& img": { objectFit: "contain" } }}
//         src={avatar}
//       >
//         {initial}
//       </Avatar>
//       <Paper
//         sx={{
//           backgroundColor: theme.palette.background.paper,
//           border: `1px solid ${theme.palette.divider}`,
//           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//           borderRadius: "12px 12px 12px 0",
//           p: 2,
//           display: "flex",
//           alignItems: "center",
//           gap: 1,
//         }}
//       >
//         <Box sx={{ display: "flex", gap: 0.75, alignItems: "center" }}>
//           {[0, 1, 2].map((i) => (
//             <Box
//               key={i}
//               sx={{
//                 width: 10,
//                 height: 10,
//                 borderRadius: "50%",
//                 backgroundColor: "#4caf50",
//                 animation: "typingDot 1.4s infinite ease-in-out",
//                 animationDelay: `${i * 0.2}s`,
//                 "@keyframes typingDot": {
//                   "0%, 60%, 100%": { transform: "translateY(0)", opacity: 0.7 },
//                   "30%": { transform: "translateY(-10px)", opacity: 1 },
//                 },
//               }}
//             />
//           ))}
//         </Box>
//         <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontStyle: "italic", ml: 1 }}>
//           typing...
//         </Typography>
//       </Paper>
//     </Box>
//   )
// }

"use client"
import { Avatar, Box } from "@mui/material"

export function TypingIndicator({ avatar, initial }: { avatar: string; initial: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
      <Avatar
        sx={{
          width: 36,
          height: 36,
          fontSize: "1rem",
          backgroundColor: "#c2185b",
          color: "white",
          "& img": { objectFit: "contain" },
        }}
        src={avatar}
      >
        {initial}
      </Avatar>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "12px",
          p: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Box sx={{ display: "flex", gap: 0.75 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#c2185b",
              animation: "bounce 1.4s infinite ease-in-out both",
              animationDelay: "-0.32s",
              "@keyframes bounce": {
                "0%, 80%, 100%": { transform: "scale(0)" },
                "40%": { transform: "scale(1)" },
              },
            }}
          />
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#c2185b",
              animation: "bounce 1.4s infinite ease-in-out both",
              animationDelay: "-0.16s",
              "@keyframes bounce": {
                "0%, 80%, 100%": { transform: "scale(0)" },
                "40%": { transform: "scale(1)" },
              },
            }}
          />
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#c2185b",
              animation: "bounce 1.4s infinite ease-in-out both",
              "@keyframes bounce": {
                "0%, 80%, 100%": { transform: "scale(0)" },
                "40%": { transform: "scale(1)" },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}
