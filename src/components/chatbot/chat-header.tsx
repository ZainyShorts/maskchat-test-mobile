// "use client"
// import { Avatar, Box, Typography } from "@mui/material"
// import type { Chatbot } from "./types"

// export function ChatHeader({
//   currentChatbot,
//   show,
//   sidebarOpen,
// }: {
//   currentChatbot: Chatbot
//   show: boolean
//   sidebarOpen: boolean
// }) {
//   if (!show) return null
//   return (
//     <Box
//       sx={{
//         position: "fixed",
//         top: 0,
//         left: { xs: 5, md: sidebarOpen ? 280 : 70 },
//         right: 0,
//         backgroundColor: "white",
//         borderBottom: "1px solid #e0e0e0",
//         zIndex: 1100,
//         boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           gap: 2,
//           p: 2,
//           maxWidth: "100%",
//           mx: "auto",
//         }}
//       >
//         <Avatar
//           sx={{
//             width: 48,
//             height: 48,
//             border: "3px solid #c2185b",
//             position: "relative",
//             "& img": { objectFit: "contain" },
//           }}
//           src={currentChatbot.avatar}
//         >
//           {currentChatbot.name.charAt(0)}
//         </Avatar>
//         <Box
//           sx={{
//             position: "absolute",
//             width: 14,
//             height: 14,
//             backgroundColor: "#c2185b",
//             borderRadius: "50%",
//             border: "2px solid white",
//             bottom: 18,
//             left: { xs: 50, md: sidebarOpen ? 50 : 50 },
//           }}
//         />
//         <Box sx={{ flex: 1 }}>
//           <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.1rem", color: "#1a1a1a", lineHeight: 1.2 }}>
//             Chatting with {currentChatbot.name}
//           </Typography>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
//             <Typography variant="caption" sx={{ fontWeight: 500, fontSize: "0.85rem", color: "#666" }}>
//               Online
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   )
// }

"use client"
import { Avatar, Box, Typography } from "@mui/material"
import type { Chatbot } from "./types"

export function ChatHeader({
  currentChatbot,
  show,
  sidebarOpen,
}: {
  currentChatbot: Chatbot
  show: boolean
  sidebarOpen: boolean
}) {
  if (!show) return null
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: { xs: 5, md: sidebarOpen ? 280 : 70 },
        right: 0,
        backgroundColor: "white",
        borderBottom: "1px solid #e0e0e0",
        zIndex: 1100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          maxWidth: "100%",
          mx: "auto",
        }}
      >
        <Avatar
          sx={{
            width: 48,
            height: 48,
            border: "3px solid #c2185b",
            position: "relative",
            "& img": { objectFit: "contain" },
          }}
          src={currentChatbot.avatar}
        >
          {currentChatbot.name.charAt(0)}
        </Avatar>
        <Box
          sx={{
            position: "absolute",
            width: 14,
            height: 14,
            backgroundColor: "#c2185b",
            borderRadius: "50%",
            border: "2px solid white",
            bottom: 18,
            left: { xs: 50, md: sidebarOpen ? 50 : 50 },
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.1rem", color: "#1a1a1a", lineHeight: 1.2 }}>
            Chatting with {currentChatbot.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 500, fontSize: "0.85rem", color: "#666" }}>
              Online
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
