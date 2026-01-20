// "use client"
// import { Box, Chip, IconButton, Typography } from "@mui/material"
// import { useRef } from "react"
// import type { EventCard, SelectedCard } from "./types"

// export function EventsCarousel({
//   items,
//   onSelect,
//   selectedCard,
// }: {
//   items: EventCard[]
//   onSelect: (c: EventCard) => void
//   selectedCard: SelectedCard | null
// }) {
//   const scrollRef = useRef<HTMLDivElement>(null)

//   const scrollBy = (dir: "left" | "right") => {
//     if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" })
//   }

//   return (
//     <Box sx={{ position: "relative", mb: 4 }}>
//       <Typography
//         variant="h6"
//         sx={{ fontWeight: 600, mb: 3, color: "#1a1a1a", fontSize: { xs: "1.1rem", md: "1.25rem" } }}
//       >
//         Upcoming Events
//       </Typography>

//       <Box sx={{ position: "relative", width: "100%" }}>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
//           <IconButton
//             onClick={() => scrollBy("left")}
//             sx={{
//               backgroundColor: "white",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//               width: 40,
//               height: 40,
//               flexShrink: 0,
//               display: { xs: "none", sm: "flex" },
//               "&:hover": { backgroundColor: "#f5f5f5" },
//             }}
//           >
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//               <path d="M15 18L9 12L15 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//             </svg>
//           </IconButton>

//           <Box
//             ref={scrollRef}
//             sx={{
//               display: "flex",
//               gap: 2,
//               overflowX: "auto",
//               scrollBehavior: "smooth",
//               pb: 2,
//               scrollbarWidth: "none",
//               "&::-webkit-scrollbar": { display: "none" },
//               WebkitOverflowScrolling: "touch",
//               flex: 1,
//               minWidth: 0,
//             }}
//           >
//             {items.map((event) => {
//               const badgeLabels = event.category
//                 .split(",")
//                 .map((s) => s.trim())
//                 .filter(Boolean)
//                 .slice(0, 2)
//               const isLongTitle = (event.title || "").length > 36
//               const cardWidth = isLongTitle ? "340px" : badgeLabels.length > 1 ? "320px" : "280px"
//               const isSelected = selectedCard?.id === event.id

//               return (
//                 <Box
//                   key={event.id}
//                   onClick={() => onSelect(event)}
//                   sx={{
//                     height: "120px",
//                     width: cardWidth,
//                     minWidth: cardWidth,
//                     display: "flex",
//                     flexDirection: "row",
//                     borderRadius: "12px",
//                     boxShadow: isSelected ? "0 8px 24px rgba(217, 28, 92, 0.3)" : "0 4px 20px rgba(0,0,0,0.08)",
//                     cursor: "pointer",
//                     transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//                     border: isSelected ? "2px solid #d91c5c" : "1px solid rgba(0,0,0,0.04)",
//                     backgroundColor: "white",
//                     overflow: "hidden",
//                     position: "relative",
//                     "&:hover": {
//                       boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
//                       "& .buy-now-button": { transform: "translateY(0)", opacity: 1 },
//                       "& .buy-now-overlay": { opacity: 1 },
//                     },
//                   }}
//                 >
//                   <Box
//                     className="buy-now-overlay"
//                     sx={{
//                       position: "absolute",
//                       top: 0,
//                       left: 0,
//                       right: 0,
//                       bottom: 0,
//                       background: "linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0,0,0,0.7) 100%)",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       opacity: 0,
//                       transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
//                       zIndex: 2,
//                     }}
//                   >
//                     <Box
//                       className="buy-now-button"
//                       sx={{
//                         background: "linear-gradient(135deg, #d91c5c 0%, #8b2e8b 100%)",
//                         color: "white",
//                         px: 5,
//                         py: 1.8,
//                         borderRadius: "50px",
//                         fontWeight: 700,
//                         fontSize: "1.05rem",
//                         fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
//                         letterSpacing: "0.3px",
//                         boxShadow: "0 8px 24px rgba(217, 28, 92, 0.5)",
//                         transform: "translateY(20px)",
//                         opacity: 0,
//                         transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
//                         border: "2px solid rgba(255,255,255,0.3)",
//                         "&:hover": { boxShadow: "0 12px 32px rgba(217, 28, 92, 0.6)" },
//                       }}
//                     >
//                       Buy Now
//                     </Box>
//                   </Box>
//                   <Box sx={{ position: "relative", flexShrink: 0 }}>
//                     <img
//                       src={event.image || "/placeholder.svg"}
//                       alt={event.title}
//                       style={{ width: "120px", height: "170px", objectFit: "cover" }}
//                     />
//                   </Box>
//                   <Box
//                     sx={{
//                       padding: "16px",
//                       flex: 1,
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <Box>
//                       <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
//                         {badgeLabels.map((lbl, i) => (
//                           <Chip
//                             key={i}
//                             label={lbl}
//                             size="small"
//                             sx={{
//                               backgroundColor: "#fff8e1",
//                               color: "#e65100",
//                               fontSize: "0.75rem",
//                               fontWeight: 600,
//                               height: 24,
//                               borderRadius: "6px",
//                             }}
//                           />
//                         ))}
//                       </Box>
//                       <Typography
//                         variant="subtitle2"
//                         sx={{
//                           fontWeight: 700,
//                           mb: 1,
//                           fontSize: "0.9rem",
//                           lineHeight: 1.3,
//                           color: "#1a1a1a",
//                           display: "-webkit-box",
//                           WebkitLineClamp: 2,
//                           WebkitBoxOrient: "vertical",
//                           overflow: "hidden",
//                         }}
//                       >
//                         {event.title}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Box>
//               )
//             })}
//           </Box>

//           <IconButton
//             onClick={() => scrollBy("right")}
//             sx={{
//               backgroundColor: "white",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//               width: 40,
//               height: 40,
//               flexShrink: 0,
//               display: { xs: "none", sm: "flex" },
//               "&:hover": { backgroundColor: "#f5f5f5" },
//             }}
//           >
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//               <path d="M9 18L15 12L9 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//             </svg>
//           </IconButton>
//         </Box>
//       </Box>
//     </Box>
//   )
// }

"use client"
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material"
import type { EventCard, SelectedCard } from "./types"

export function EventsCarousel({
  items,
  selectedCard,
  onSelect,
}: {
  items: EventCard[]
  selectedCard: SelectedCard | null
  onSelect: (card: EventCard) => void
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: isMobile ? "1.1rem" : "1.3rem",
          mb: 2.5,
          color: "#1a1a1a",
        }}
      >
        Upcoming Events
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          pb: 2,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {items.map((item) => (
          <Box
            key={item.id}
            onClick={() => onSelect(item)}
            sx={{
              minWidth: "280px",
              height: "120px",
              display: "flex",
              flexDirection: "row",
              borderRadius: "16px",
              overflow: "hidden",
              cursor: "pointer",
              transition: "all 0.2s",
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border:
                selectedCard?.id === item.id
                  ? "3px solid #c2185b"
                  : "3px solid transparent",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              },
            }}
          >
            <Box
              sx={{
                width: "120px",
                height: "120px",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Box sx={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
              <Box
                sx={{
                  backgroundColor: "#f0f0f0",
                  borderRadius: "8px",
                  px: 1.5,
                  py: 0.5,
                  alignSelf: "flex-start",
                  mb: 1,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: "#666",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {item.category}
                </Typography>
              </Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "#1a1a1a",
                  mb: 0.5,
                  lineHeight: 1.3,
                }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.8rem",
                  color: "#666",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                📍 {item.location}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
