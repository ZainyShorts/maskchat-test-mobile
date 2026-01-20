// "use client"
// import { Avatar, Box, Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material"
// import type { Chatbot, AttractionCard, EventCard, SelectedCard } from "./types"
// import { AttractionsCarousel } from "./attractions-carousel"
// import { EventsCarousel } from "./events-carousel"

// export function EmptyState({
//   currentChatbot,
//   loading,
//   attractions,
//   events,
//   onSelect,
//   selectedCard,
// }: {
//   currentChatbot: Chatbot
//   loading: boolean
//   attractions: AttractionCard[]
//   events: EventCard[]
//   onSelect: (card: AttractionCard | EventCard, type: "attraction" | "event") => void
//   selectedCard: SelectedCard | null
// }) {
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"))

//   if (loading) {
//     return (
//       <>
//         <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
//           <Skeleton variant="circular" width={40} height={40} />
//           <Skeleton variant="text" width="80%" height={24} />
//         </Box>

//         <Box sx={{ mb: 6 }}>
//           <Skeleton variant="text" width={200} height={32} sx={{ mb: 3 }} />
//           <Box sx={{ display: "flex", gap: 2, overflowX: "hidden" }}>
//             {[1, 2, 3, 4].map((i) => (
//               <Box
//                 key={i}
//                 sx={{
//                   height: "120px",
//                   width: "280px",
//                   minWidth: "280px",
//                   display: "flex",
//                   flexDirection: "row",
//                   borderRadius: "12px",
//                   overflow: "hidden",
//                 }}
//               >
//                 <Skeleton variant="rectangular" width={120} height={120} />
//                 <Box sx={{ padding: "16px", flex: 1 }}>
//                   <Skeleton variant="rectangular" width={60} height={24} sx={{ mb: 1.5, borderRadius: "6px" }} />
//                   <Skeleton variant="text" width="90%" height={20} />
//                   <Skeleton variant="text" width="70%" height={20} />
//                 </Box>
//               </Box>
//             ))}
//           </Box>
//         </Box>

//         <Box sx={{ mb: 4 }}>
//           <Skeleton variant="text" width={180} height={32} sx={{ mb: 3 }} />
//           <Box sx={{ display: "flex", gap: 2, overflowX: "hidden" }}>
//             {[1, 2, 3, 4].map((i) => (
//               <Box
//                 key={i}
//                 sx={{
//                   height: "120px",
//                   width: "280px",
//                   minWidth: "280px",
//                   display: "flex",
//                   flexDirection: "row",
//                   borderRadius: "12px",
//                   overflow: "hidden",
//                 }}
//               >
//                 <Skeleton variant="rectangular" width={120} height={120} />
//                 <Box sx={{ padding: "16px", flex: 1 }}>
//                   <Skeleton variant="rectangular" width={60} height={24} sx={{ mb: 1.5, borderRadius: "6px" }} />
//                   <Skeleton variant="text" width="90%" height={20} />
//                   <Skeleton variant="text" width="70%" height={20} />
//                 </Box>
//               </Box>
//             ))}
//           </Box>
//         </Box>
//       </>
//     )
//   }

//   return (
//     <>
//       <Box sx={{ mb: 4, display: "flex", alignItems: "flex-start", gap: 2 }}>
//         <Avatar
//           sx={{
//             width: 40,
//             height: 40,
//             fontSize: "1.2rem",
//             fontWeight: "bold",
//             backgroundColor: "#c2185b",
//             color: "white",
//             "& img": { objectFit: "contain" },
//           }}
//           src={currentChatbot.avatar}
//         >
//           {currentChatbot.name.charAt(0)}
//         </Avatar>
//         <Box
//           sx={{
//             flex: 1,
//             backgroundColor: "white",
//             borderRadius: "12px",
//             p: 2.5,
//             boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//           }}
//         >
//           <Typography
//             variant="body1"
//             sx={{
//               color: "#333",
//               fontSize: isMobile ? "0.9rem" : "1rem",
//               lineHeight: 1.6,
//             }}
//           >
//             Hello!
//             <br />
//             I&apos;m Noura, your smart tour guide.
//             <br />
//             I&apos;m ready to help you explore destinations, experiences, and travel offers in Saudi Arabia!
//             <br />
//             <br />
//             <strong>Note:</strong>
//             <br />
//             I&apos;m still in the process of learning and continuous improvement, so some of my answers may not always
//             be accurate. I apologize in advance and appreciate your understanding.
//             <br />
//             Your feedback and evaluation of my responses will help improve the results and information provided to you
//             in the future.
//             <br />
//             <br />
//             How can I assist you today?
//           </Typography>
//         </Box>
//       </Box>

//       <AttractionsCarousel
//         items={attractions}
//         selectedCard={selectedCard}
//         onSelect={(c) => onSelect(c, "attraction")}
//       />

//       <EventsCarousel items={events} selectedCard={selectedCard} onSelect={(c) => onSelect(c, "event")} />
//     </>
//   )
// }


"use client"
import { Avatar, Box, Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material"
import type { Chatbot, AttractionCard, EventCard, SelectedCard } from "./types"
import { AttractionsCarousel } from "./attractions-carousel"
import { EventsCarousel } from "./events-carousel"

export function EmptyState({
  currentChatbot,
  loading,
  attractions,
  events,
  onSelect,
  selectedCard,
}: {
  currentChatbot: Chatbot
  loading: boolean
  attractions: AttractionCard[]
  events: EventCard[]
  onSelect: (card: AttractionCard | EventCard, type: "attraction" | "event") => void
  selectedCard: SelectedCard | null
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  if (loading) {
    return (
      <>
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width="80%" height={24} />
        </Box>

        <Box sx={{ mb: 6 }}>
          <Skeleton variant="text" width={200} height={32} sx={{ mb: 3 }} />
          <Box sx={{ display: "flex", gap: 2, overflowX: "hidden" }}>
            {[1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                sx={{
                  height: "120px",
                  width: "280px",
                  minWidth: "280px",
                  display: "flex",
                  flexDirection: "row",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <Skeleton variant="rectangular" width={120} height={120} />
                <Box sx={{ padding: "16px", flex: 1 }}>
                  <Skeleton variant="rectangular" width={60} height={24} sx={{ mb: 1.5, borderRadius: "6px" }} />
                  <Skeleton variant="text" width="90%" height={20} />
                  <Skeleton variant="text" width="70%" height={20} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={180} height={32} sx={{ mb: 3 }} />
          <Box sx={{ display: "flex", gap: 2, overflowX: "hidden" }}>
            {[1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                sx={{
                  height: "120px",
                  width: "280px",
                  minWidth: "280px",
                  display: "flex",
                  flexDirection: "row",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <Skeleton variant="rectangular" width={120} height={120} />
                <Box sx={{ padding: "16px", flex: 1 }}>
                  <Skeleton variant="rectangular" width={60} height={24} sx={{ mb: 1.5, borderRadius: "6px" }} />
                  <Skeleton variant="text" width="90%" height={20} />
                  <Skeleton variant="text" width="70%" height={20} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </>
    )
  }

  return (
    <>
      <Box sx={{ mb: 4, display: "flex", alignItems: "flex-start", gap: 2 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            fontSize: "1.2rem",
            fontWeight: "bold",
            backgroundColor: "#c2185b",
            color: "white",
            "& img": { objectFit: "contain" },
          }}
          src={currentChatbot.avatar}
        >
          {currentChatbot.name.charAt(0)}
        </Avatar>
        <Box
          sx={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: "12px",
            p: 2.5,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#333",
              fontSize: isMobile ? "0.9rem" : "1rem",
              lineHeight: 1.6,
            }}
          >
            Hello!
            <br />
            I&apos;m Noura, your smart tour guide.
            <br />
            I&apos;m ready to help you explore destinations, experiences, and travel offers in Saudi Arabia!
            <br />
            <br />
            <strong>Note:</strong>
            <br />
            I&apos;m still in the process of learning and continuous improvement, so some of my answers may not always
            be accurate. I apologize in advance and appreciate your understanding.
            <br />
            Your feedback and evaluation of my responses will help improve the results and information provided to you
            in the future.
            <br />
            <br />
            How can I assist you today?
          </Typography>
        </Box>
      </Box>

      <AttractionsCarousel
        items={attractions}
        selectedCard={selectedCard}
        onSelect={(c) => onSelect(c, "attraction")}
      />

      <EventsCarousel items={events} selectedCard={selectedCard} onSelect={(c) => onSelect(c, "event")} />
    </>
  )
}

