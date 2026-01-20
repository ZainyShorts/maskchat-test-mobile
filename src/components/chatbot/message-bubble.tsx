// "use client"
// import { Avatar, Box, Typography, useTheme } from "@mui/material"
// import type { Message } from "./types"

// interface MessageBubbleProps {
//   message: Message
//   chatbotName: string
//   chatbotAvatar: string
// }

// export function MessageBubble({ message, chatbotName, chatbotAvatar }: MessageBubbleProps) {
//   const theme = useTheme()
//   const isUser = message.sender === "user"

//   if (isUser) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
//         <Box
//           sx={{
//             maxWidth: "70%",
//             backgroundColor: "#c2185b",
//             color: "white",
//             borderRadius: "12px",
//             p: 2,
//             boxShadow: "0 2px 8px rgba(194, 24, 91, 0.2)",
//           }}
//         >
//           {message.selectedCard && (
//             <Box
//               sx={{
//                 mb: 1.5,
//                 pb: 1.5,
//                 borderBottom: "1px solid rgba(255,255,255,0.2)",
//               }}
//             >
//               <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
//                 <img
//                   src={message.selectedCard.image || "/placeholder.svg"}
//                   alt={message.selectedCard.title}
//                   style={{
//                     width: "60px",
//                     height: "60px",
//                     objectFit: "cover",
//                     borderRadius: "8px",
//                   }}
//                 />
//                 <Box sx={{ flex: 1 }}>
//                   <Typography variant="caption" sx={{ fontSize: "0.7rem", opacity: 0.8, display: "block", mb: 0.5 }}>
//                     {message.selectedCard.category}
//                   </Typography>
//                   <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.85rem", lineHeight: 1.3 }}>
//                     {message.selectedCard.title}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Box>
//           )}
//           {Array.isArray(message.content) ? (
//   <>
//     <Typography
//       variant="body2"
//       sx={{
//         fontSize: "0.95rem",
//         lineHeight: 1.6,
//         mb: 2,
//       }}
//     >
//       Here are some products you might like:
//     </Typography>

//     {/* PRODUCT GRID OUTSIDE THE BUBBLE */}
//     <Box
//       sx={{
//         mt: 1,
//         background: "transparent",
//       }}
//     >
//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: {
//             xs: "1fr",
//             sm: "1fr 1fr",
//             md: "1fr 1fr 1fr",
//           },
//           gap: 3,
//         }}
//       >
//         {message.content.map((item, index) => (
//           <Box
//             key={index}
//             sx={{
//               backgroundColor: "white",
//               borderRadius: "20px",
//               overflow: "hidden",
//               boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//               border: "1px solid #eaeaea",
//               transition: "transform 0.2s",
//               cursor: "pointer",
//               "&:hover": { transform: "translateY(-4px)" },
//             }}
//           >
//             <Box
//               sx={{
//                 width: "100%",
//                 height: 220,
//                 overflow: "hidden",
//                 borderBottom: "1px solid #eee",
//               }}
//             >
//               <img
//                 src={item.img}
//                 alt={item.title}
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "contain",
//                   backgroundColor: "#f5f5f5",
//                 }}
//               />
//             </Box>

//             <Box sx={{ p: 2 }}>
//               <Typography
//                 sx={{
//                   fontWeight: 700,
//                   fontSize: "1rem",
//                   mb: 0.5,
//                   color: "#111",
//                 }}
//               >
//                 {item.title && (item.title.length > 36 ? `${item.title.slice(0, 36)}...` : item.title)}
//               </Typography>

//               <Typography
//                 sx={{
//                   fontSize: "0.85rem",
//                   opacity: 0.8,
//                   lineHeight: 1.4,
//                 }}
//               >
//                 {item.body}
//               </Typography>

//               <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
//                 <Box
//                   sx={{
//                     flex: 1,
//                     backgroundColor: "white",
//                     border: "1px solid #9b1d98",
//                     borderRadius: "12px",
//                     padding: "8px 0",
//                     textAlign: "center",
//                     fontWeight: 600,
//                     fontSize: "0.85rem",
//                     color: "#9b1d98",
//                     cursor: "pointer",
//                   }}
//                 >
//                   View Details
//                 </Box>
//               </Box>
//             </Box>
//           </Box>
//         ))}
//       </Box>
//     </Box>
//   </>
// ) : (
//   <Typography variant="body2">{message.content}</Typography>
// )}




//           <Typography variant="caption" sx={{ fontSize: "0.75rem", opacity: 0.7, display: "block", mt: 0.5 }}>
//             {message.timestamp}
//           </Typography>
//         </Box>
//       </Box>
//     )
//   }

//   return (
//     <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
//       <Avatar
//         sx={{
//           width: 36,
//           height: 36,
//           fontSize: "1rem",
//           backgroundColor: "#c2185b",
//           color: "white",
//           "& img": { objectFit: "contain" },
//         }}
//         src={chatbotAvatar}
//       >
//         {chatbotName.charAt(0)}
//       </Avatar>
//       <Box
//         sx={{
//           maxWidth: "70%",
//           backgroundColor: "white",
//           borderRadius: "12px",
//           p: 2,
//           boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//         }}
//       >
//         {Array.isArray(message.content) ? (
//   <>
//     <Typography
//       variant="body2"
//       sx={{
//         fontSize: "0.95rem",
//         lineHeight: 1.6,
//         mb: 2,
//       }}
//     >
//       Here are some products you might like:
//     </Typography>

//     <Box
//       sx={{
//         mt: 1,
//         background: "transparent",
//       }}
//     >
//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: {
//             xs: "1fr",
//             sm: "1fr 1fr",
//             md: "1fr 1fr 1fr",
//           },
//           gap: 3,
//         }}
//       >
//         {message.content.map((item, index) => (
//           <Box
//             key={index}
//             sx={{
//               backgroundColor: "white",
//               borderRadius: "20px",
//               overflow: "hidden",
//               boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//               border: "1px solid #eaeaea",
//               transition: "transform 0.2s",
//               cursor: "pointer",
//               "&:hover": { transform: "translateY(-4px)" },
//             }}
//           >
//             <Box
//               sx={{
//                 width: "100%",
//                 height: 220,
//                 overflow: "hidden",
//                 borderBottom: "1px solid #eee",
//               }}
//             >
//               <img
//                 src={item.img}
//                 alt={item.title}
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "contain",
//                   backgroundColor: "#f5f5f5",
//                 }}
//               />
//             </Box>

//             <Box sx={{ p: 2 }}>
//               <Typography
//                 sx={{
//                   fontWeight: 700,
//                   fontSize: "1rem",
//                   mb: 0.5,
//                   color: "#111",
//                 }}
//               >
//                 {item.title && (item.title.length > 36 ? `${item.title.slice(0, 36)}...` : item.title)}
//               </Typography>

//               <Typography
//                 sx={{
//                   fontSize: "0.85rem",
//                   opacity: 0.8,
//                   lineHeight: 1.4,
//                 }}
//               >
//                 {item.body}
//               </Typography>

//               <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
//                 <Box
//                   sx={{
//                     flex: 1,
//                     backgroundColor: "white",
//                     border: "1px solid #9b1d98",
//                     borderRadius: "12px",
//                     padding: "8px 0",
//                     textAlign: "center",
//                     fontWeight: 600,
//                     fontSize: "0.85rem",
//                     color: "#9b1d98",
//                     cursor: "pointer",
//                   }}
//                 >
//                   View Details
//                 </Box>
//               </Box>
//             </Box>
//           </Box>
//         ))}
//       </Box>
//     </Box>
//   </>
// ) : (
//   <Typography variant="body2">{message.content}</Typography>
// )}




//         <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "#999", display: "block", mt: 0.5 }}>
//           {message.timestamp}
//         </Typography>
//       </Box>
//     </Box>
//   )
// }

"use client"
import { Avatar, Box, Typography, useTheme } from "@mui/material"
import type { Message } from "./types"

interface MessageBubbleProps {
  message: Message
  chatbotName: string
  chatbotAvatar: string
}

export function MessageBubble({ message, chatbotName, chatbotAvatar }: MessageBubbleProps) {
  const theme = useTheme()
  const isUser = message.sender === "user"

  if (isUser) {
    return (
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Box
          sx={{
            maxWidth: "70%",
            backgroundColor: "#c2185b",
            color: "white",
            borderRadius: "12px",
            p: 2,
            boxShadow: "0 2px 8px rgba(194, 24, 91, 0.2)",
          }}
        >
          {message.selectedCard && (
            <Box
              sx={{
                mb: 1.5,
                pb: 1.5,
                borderBottom: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <img
                  src={message.selectedCard.image || "/placeholder.svg"}
                  alt={message.selectedCard.title}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ fontSize: "0.7rem", opacity: 0.8, display: "block", mb: 0.5 }}>
                    {message.selectedCard.category}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.85rem", lineHeight: 1.3 }}>
                    {message.selectedCard.title}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          {Array.isArray(message.content) ? (
  <>
    <Typography
      variant="body2"
      sx={{
        fontSize: "0.95rem",
        lineHeight: 1.6,
        mb: 2,
      }}
    >
      Here are some products you might like:
    </Typography>

    {/* PRODUCT GRID OUTSIDE THE BUBBLE */}
    <Box
      sx={{
        mt: 1,
        background: "transparent",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 3,
        }}
      >
        {message.content.map((item, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: "white",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid #eaeaea",
              transition: "transform 0.2s",
              cursor: "pointer",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: 220,
                overflow: "hidden",
                borderBottom: "1px solid #eee",
              }}
            >
              <img
                src={item.img}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  backgroundColor: "#f5f5f5",
                }}
              />
            </Box>

            <Box sx={{ p: 2 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  mb: 0.5,
                  color: "#111",
                }}
              >
                {item.title && (item.title.length > 36 ? `${item.title.slice(0, 36)}...` : item.title)}
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.85rem",
                  opacity: 0.8,
                  lineHeight: 1.4,
                }}
              >
                {item.body}
              </Typography>

              <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
                <Box
                  sx={{
                    flex: 1,
                    backgroundColor: "white",
                    border: "1px solid #9b1d98",
                    borderRadius: "12px",
                    padding: "8px 0",
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "#9b1d98",
                    cursor: "pointer",
                  }}
                >
                  View Details
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  </>
) : (
  <Typography variant="body2">{message.content}</Typography>
)}




          <Typography variant="caption" sx={{ fontSize: "0.75rem", opacity: 0.7, display: "block", mt: 0.5 }}>
            {message.timestamp}
          </Typography>
        </Box>
      </Box>
    )
  }

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
        src={chatbotAvatar}
      >
        {chatbotName.charAt(0)}
      </Avatar>
      <Box
        sx={{
          maxWidth: "70%",
          backgroundColor: "white",
          borderRadius: "12px",
          p: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {Array.isArray(message.content) ? (
  <>
    <Typography
      variant="body2"
      sx={{
        fontSize: "0.95rem",
        lineHeight: 1.6,
        mb: 2,
      }}
    >
      Here are some products you might like:
    </Typography>

    <Box
      sx={{
        mt: 1,
        background: "transparent",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 3,
        }}
      >
        {message.content.map((item, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: "white",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid #eaeaea",
              transition: "transform 0.2s",
              cursor: "pointer",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: 220,
                overflow: "hidden",
                borderBottom: "1px solid #eee",
              }}
            >
              <img
                src={item.img}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  backgroundColor: "#f5f5f5",
                }}
              />
            </Box>

            <Box sx={{ p: 2 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  mb: 0.5,
                  color: "#111",
                }}
              >
                {item.title && (item.title.length > 36 ? `${item.title.slice(0, 36)}...` : item.title)}
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.85rem",
                  opacity: 0.8,
                  lineHeight: 1.4,
                }}
              >
                {item.body}
              </Typography>

              <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
                <Box
                  sx={{
                    flex: 1,
                    backgroundColor: "white",
                    border: "1px solid #9b1d98",
                    borderRadius: "12px",
                    padding: "8px 0",
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "#9b1d98",
                    cursor: "pointer",
                  }}
                >
                  View Details
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  </>
) : (
  <Typography variant="body2">{message.content}</Typography>
)}




        <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "#999", display: "block", mt: 0.5 }}>
          {message.timestamp}
        </Typography>
      </Box>
    </Box>
  )
}

