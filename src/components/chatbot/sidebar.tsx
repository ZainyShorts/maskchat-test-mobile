// "use client"
// import { useState } from "react"
// import {
//   Drawer,
//   Box,
//   Typography,
//   IconButton,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Button,
//   useTheme,
//   alpha,
//   Avatar,
// } from "@mui/material"
// import {
//   Add as AddIcon,
//   Place as PlaceIcon,
//   Menu as MenuIcon,
//   ChevronLeft as ChevronLeftIcon,
// } from "@mui/icons-material"

// interface Chatbot {
//   id: string
//   name: string
//   avatar: string
//   description: string
// }

// interface ChatItem {
//   id: string
//   title: string
//   timestamp: string
// }

// interface AppSidebarProps {
//   open: boolean
//   onToggle: () => void
//   onChatbotSelect?: (chatbotId: string) => void
//   onNewChat?: () => void
//   chatbots: Chatbot[]
//   currentChatbot: Chatbot
// }

// export const AppSidebar = ({
//   open,
//   onToggle,
//   onChatbotSelect,
//   onNewChat,
//   chatbots,
//   currentChatbot,
// }: AppSidebarProps) => {
//   const theme = useTheme()

//   const [itineraries, setItineraries] = useState<ChatItem[]>([])
//   const [conversations, setConversations] = useState<ChatItem[]>([
//     { id: "1", title: "How can I get a visa to Saudi?", timestamp: "2 hours ago" },
//     { id: "2", title: "Plan a 3 day trip to Riyadh", timestamp: "1 day ago" },
//   ])

//   const addNewItinerary = () => {
//     const newItinerary: ChatItem = {
//       id: Date.now().toString(),
//       title: "New Itinerary",
//       timestamp: "Just now",
//     }
//     setItineraries([newItinerary, ...itineraries])
//   }

//   const drawerWidth = open ? 280 : 72

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         "& .MuiDrawer-paper": {
//           width: drawerWidth,
//           boxSizing: "border-box",
//           transition: theme.transitions.create("width", {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.enteringScreen,
//           }),
//           overflowX: "hidden",
//           border: "none",
//           boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
//           borderTopLeftRadius: "1rem",
//         },
//       }}
//     >
//       <Box
//         sx={{
//           height: 80,
//           background: `
//             repeating-linear-gradient(
//               45deg,
//               #c2185b 0px,
//               #c2185b 40px,
//               #7b1fa2 40px,
//               #7b1fa2 80px,
//               #f57c00 80px,
//               #f57c00 120px,
//               #00897b 120px,
//               #00897b 160px
//             )
//           `,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           px: 2,
//           position: "relative",
//           overflow: "hidden",
//           "&::before": {
//             content: '""',
//             position: "absolute",
//             top: "50%",
//             left: "20%",
//             transform: "translate(-50%, -50%)",
//             width: 60,
//             height: 60,
//             borderRadius: "50%",
//             border: "4px solid rgba(255,255,255,0.3)",
//             opacity: 0.6,
//           },
//           "&::after": {
//             content: '""',
//             position: "absolute",
//             top: "50%",
//             right: "20%",
//             transform: "translate(50%, -50%)",
//             width: 40,
//             height: 40,
//             background: "rgba(255,255,255,0.2)",
//             clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
//           },
//         }}
//       >
//         {open && (
//           <Box
//             sx={{
//               width: 24,
//               height: 24,
//               backgroundColor: alpha("#ffffff", 0.3),
//               borderRadius: "50%",
//             }}
//           />
//         )}
//         <IconButton
//           onClick={onToggle}
//           sx={{
//             color: "white",
//             ml: "auto",
//             "&:hover": {
//               backgroundColor: alpha("#ffffff", 0.2),
//             },
//           }}
//         >
//           {open ? <ChevronLeftIcon /> : <MenuIcon />}
//         </IconButton>
//       </Box>

//       <Box
//         sx={{
//           p: open ? 2 : 1,
//           display: "flex",
//           flexDirection: "column",
//           gap: 2.5,
//           height: "calc(100vh - 80px)",
//           overflow: "hidden",
//         }}
//       >
//         {open && (
//           <Box sx={{ flex: "0 0 auto" }}>
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 mb: 1.5,
//                 borderBottom: "3px solid #c2185b",
//                 pb: 0.5,
//               }}
//             >
//               <Typography
//                 variant="caption"
//                 sx={{
//                   fontWeight: 700,
//                   color: "#000",
//                   textTransform: "uppercase",
//                   letterSpacing: 0.8,
//                   fontSize: "0.8rem",
//                 }}
//               >
//                 CONVERSATIONS
//               </Typography>
//               <IconButton
//                 size="small"
//                 sx={{
//                   width: 24,
//                   height: 24,
//                   color: "#c2185b",
//                   "&:hover": {
//                     backgroundColor: "#c2185b",
//                     color: "white",
//                   },
//                 }}
//               >
//                 <AddIcon fontSize="small" />
//               </IconButton>
//             </Box>

//             <Button
//               fullWidth
//               variant="text"
//               sx={{
//                 justifyContent: "flex-start",
//                 color: "#7b1fa2",
//                 fontWeight: 600,
//                 fontSize: "0.9rem",
//                 mb: 1.5,
//                 textTransform: "none",
//                 px: 1.5,
//                 py: 1,
//                 borderRadius: "8px",
//                 "&:hover": {
//                   backgroundColor: alpha("#7b1fa2", 0.08),
//                 },
//               }}
//             >
//               New Chat
//             </Button>

//             <Box
//               sx={{
//                 maxHeight: "140px",
//                 overflowY: "auto",
//                 mb: 2,
//                 "&::-webkit-scrollbar": {
//                   width: "3px",
//                 },
//                 "&::-webkit-scrollbar-track": {
//                   background: "transparent",
//                 },
//                 "&::-webkit-scrollbar-thumb": {
//                   background: alpha("#c2185b", 0.3),
//                   borderRadius: "2px",
//                 },
//               }}
//             >
//               <List sx={{ p: 0 }}>
//                 {conversations.map((conv) => (
//                   <ListItem
//                     key={conv.id}
//                     sx={{
//                       borderRadius: 1,
//                       mb: 0.5,
//                       cursor: "pointer",
//                       transition: "all 0.2s",
//                       "&:hover": {
//                         backgroundColor: alpha("#c2185b", 0.08),
//                       },
//                       px: 1.5,
//                       py: 0.75,
//                     }}
//                   >
//                     <ListItemText
//                       primary={
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             fontWeight: 500,
//                             fontSize: "0.85rem",
//                             color: "#333",
//                           }}
//                         >
//                           {conv.title}
//                         </Typography>
//                       }
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             </Box>

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 py: 1,
//               }}
//             >
//               <IconButton
//                 size="small"
//                 sx={{
//                   width: 32,
//                   height: 32,
//                   border: "2px solid #7b1fa2",
//                   color: "#7b1fa2",
//                   "&:hover": {
//                     backgroundColor: "#7b1fa2",
//                     color: "white",
//                   },
//                 }}
//               >
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                   <path
//                     d="M19 9L12 16L5 9"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </IconButton>
//             </Box>
//           </Box>
//         )}

//         {open && (
//           <Box sx={{ flex: "0 0 auto" }}>
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 mb: 1.5,
//                 borderBottom: "3px solid #c2185b",
//                 pb: 0.5,
//               }}
//             >
//               <Typography
//                 variant="caption"
//                 sx={{
//                   fontWeight: 700,
//                   color: "#000",
//                   textTransform: "uppercase",
//                   letterSpacing: 0.8,
//                   fontSize: "0.8rem",
//                 }}
//               >
//                 MY ITINERARIES
//               </Typography>
//               <IconButton
//                 size="small"
//                 onClick={addNewItinerary}
//                 sx={{
//                   width: 24,
//                   height: 24,
//                   color: "#c2185b",
//                   "&:hover": {
//                     backgroundColor: "#c2185b",
//                     color: "white",
//                   },
//                 }}
//               >
//                 <AddIcon fontSize="small" />
//               </IconButton>
//             </Box>

//             {itineraries.length > 0 ? (
//               <List sx={{ p: 0 }}>
//                 {itineraries.map((itinerary) => (
//                   <ListItem
//                     key={itinerary.id}
//                     sx={{
//                       borderRadius: 1,
//                       mb: 0.5,
//                       cursor: "pointer",
//                       transition: "all 0.2s",
//                       "&:hover": {
//                         backgroundColor: alpha("#c2185b", 0.08),
//                       },
//                       px: 1,
//                       py: 0.75,
//                     }}
//                   >
//                     <ListItemIcon sx={{ minWidth: 32 }}>
//                       <PlaceIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
//                     </ListItemIcon>
//                     <ListItemText
//                       primary={
//                         <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.85rem" }}>
//                           {itinerary.title}
//                         </Typography>
//                       }
//                       secondary={
//                         <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.75rem" }}>
//                           {itinerary.timestamp}
//                         </Typography>
//                       }
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             ) : null}
//           </Box>
//         )}

//         {open && (
//           <Box sx={{ flex: "1 1 auto", display: "flex", flexDirection: "column" }}>
//             <Box
//               sx={{
//                 borderBottom: "3px solid #c2185b",
//                 pb: 0.5,
//                 mb: 1.5,
//               }}
//             >
//               <Typography
//                 variant="caption"
//                 sx={{
//                   fontWeight: 700,
//                   color: "#000",
//                   textTransform: "uppercase",
//                   letterSpacing: 0.8,
//                   fontSize: "0.8rem",
//                 }}
//               >
//                 MY FAVORITES
//               </Typography>
//             </Box>

//             <Box
//               sx={{
//                 textAlign: "center",
//                 py: 3,
//                 flex: 1,
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//               }}
//             >
//               <Typography variant="body2" sx={{ color: "#666", mb: 2, fontSize: "0.9rem", lineHeight: 1.5 }}>
//                 You haven&apos;t saved any favorites yet.
//               </Typography>
//               <Button
//                 variant="outlined"
//                 fullWidth
//                 sx={{
//                   borderColor: "#7b1fa2",
//                   color: "#7b1fa2",
//                   fontSize: "0.85rem",
//                   py: 1,
//                   fontWeight: 600,
//                   textTransform: "none",
//                   borderWidth: "2px",
//                   "&:hover": {
//                     backgroundColor: "#7b1fa2",
//                     color: "white",
//                     borderWidth: "2px",
//                   },
//                 }}
//               >
//                 Show Experiences
//               </Button>
//             </Box>
//           </Box>
//         )}
//       </Box>
//     </Drawer>
//   )
// }


"use client"
import { useState } from "react"
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  useTheme,
  alpha,
  Avatar,
} from "@mui/material"
import {
  Add as AddIcon,
  Place as PlaceIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material"

interface Chatbot {
  id: string
  name: string
  avatar: string
  description: string
}

interface ChatItem {
  id: string
  title: string
  timestamp: string
}

interface AppSidebarProps {
  open: boolean
  onToggle: () => void
  onChatbotSelect?: (chatbotId: string) => void
  onNewChat?: () => void
  chatbots: Chatbot[]
  currentChatbot: Chatbot
}

export const AppSidebar = ({
  open,
  onToggle,
  onChatbotSelect,
  onNewChat,
  chatbots,
  currentChatbot,
}: AppSidebarProps) => {
  const theme = useTheme()

  const [itineraries, setItineraries] = useState<ChatItem[]>([])
  const [conversations, setConversations] = useState<ChatItem[]>([
    { id: "1", title: "How can I get a visa to Saudi?", timestamp: "2 hours ago" },
    { id: "2", title: "Plan a 3 day trip to Riyadh", timestamp: "1 day ago" },
  ])

  const addNewItinerary = () => {
    const newItinerary: ChatItem = {
      id: Date.now().toString(),
      title: "New Itinerary",
      timestamp: "Just now",
    }
    setItineraries([newItinerary, ...itineraries])
  }

  const drawerWidth = open ? 280 : 72

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
          border: "none",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
          borderTopLeftRadius: "1rem",
        },
      }}
    >
      <Box
        sx={{
          height: 80,
          background: `
            repeating-linear-gradient(
              45deg,
              #c2185b 0px,
              #c2185b 40px,
              #7b1fa2 40px,
              #7b1fa2 80px,
              #f57c00 80px,
              #f57c00 120px,
              #00897b 120px,
              #00897b 160px
            )
          `,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "50%",
            left: "20%",
            transform: "translate(-50%, -50%)",
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: "4px solid rgba(255,255,255,0.3)",
            opacity: 0.6,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: "50%",
            right: "20%",
            transform: "translate(50%, -50%)",
            width: 40,
            height: 40,
            background: "rgba(255,255,255,0.2)",
            clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
          },
        }}
      >
        {open && (
          <Box
            sx={{
              width: 24,
              height: 24,
              backgroundColor: alpha("#ffffff", 0.3),
              borderRadius: "50%",
            }}
          />
        )}
        <IconButton
          onClick={onToggle}
          sx={{
            color: "white",
            ml: "auto",
            "&:hover": {
              backgroundColor: alpha("#ffffff", 0.2),
            },
          }}
        >
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Box
        sx={{
          p: open ? 2 : 1,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          height: "calc(100vh - 80px)",
          overflow: "hidden",
        }}
      >
        {open && (
          <Box sx={{ flex: "0 0 auto" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
                borderBottom: "3px solid #c2185b",
                pb: 0.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: "#000",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  fontSize: "0.8rem",
                }}
              >
                CONVERSATIONS
              </Typography>
              <IconButton
                size="small"
                sx={{
                  width: 24,
                  height: 24,
                  color: "#c2185b",
                  "&:hover": {
                    backgroundColor: "#c2185b",
                    color: "white",
                  },
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>

            <Button
              fullWidth
              variant="text"
              sx={{
                justifyContent: "flex-start",
                color: "#7b1fa2",
                fontWeight: 600,
                fontSize: "0.9rem",
                mb: 1.5,
                textTransform: "none",
                px: 1.5,
                py: 1,
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: alpha("#7b1fa2", 0.08),
                },
              }}
            >
              New Chat
            </Button>

            <Box
              sx={{
                maxHeight: "140px",
                overflowY: "auto",
                mb: 2,
                "&::-webkit-scrollbar": {
                  width: "3px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: alpha("#c2185b", 0.3),
                  borderRadius: "2px",
                },
              }}
            >
              <List sx={{ p: 0 }}>
                {conversations.map((conv) => (
                  <ListItem
                    key={conv.id}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: alpha("#c2185b", 0.08),
                      },
                      px: 1.5,
                      py: 0.75,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.85rem",
                            color: "#333",
                          }}
                        >
                          {conv.title}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 1,
              }}
            >
              <IconButton
                size="small"
                sx={{
                  width: 32,
                  height: 32,
                  border: "2px solid #7b1fa2",
                  color: "#7b1fa2",
                  "&:hover": {
                    backgroundColor: "#7b1fa2",
                    color: "white",
                  },
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19 9L12 16L5 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </IconButton>
            </Box>
          </Box>
        )}

        {open && (
          <Box sx={{ flex: "0 0 auto" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
                borderBottom: "3px solid #c2185b",
                pb: 0.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: "#000",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  fontSize: "0.8rem",
                }}
              >
                MY ITINERARIES
              </Typography>
              <IconButton
                size="small"
                onClick={addNewItinerary}
                sx={{
                  width: 24,
                  height: 24,
                  color: "#c2185b",
                  "&:hover": {
                    backgroundColor: "#c2185b",
                    color: "white",
                  },
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>

            {itineraries.length > 0 ? (
              <List sx={{ p: 0 }}>
                {itineraries.map((itinerary) => (
                  <ListItem
                    key={itinerary.id}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: alpha("#c2185b", 0.08),
                      },
                      px: 1,
                      py: 0.75,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <PlaceIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.85rem" }}>
                          {itinerary.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.75rem" }}>
                          {itinerary.timestamp}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : null}
          </Box>
        )}

        {open && (
          <Box sx={{ flex: "1 1 auto", display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                borderBottom: "3px solid #c2185b",
                pb: 0.5,
                mb: 1.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: "#000",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  fontSize: "0.8rem",
                }}
              >
                MY FAVORITES
              </Typography>
            </Box>

            <Box
              sx={{
                textAlign: "center",
                py: 3,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" sx={{ color: "#666", mb: 2, fontSize: "0.9rem", lineHeight: 1.5 }}>
                You haven&apos;t saved any favorites yet.
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: "#7b1fa2",
                  color: "#7b1fa2",
                  fontSize: "0.85rem",
                  py: 1,
                  fontWeight: 600,
                  textTransform: "none",
                  borderWidth: "2px",
                  "&:hover": {
                    backgroundColor: "#7b1fa2",
                    color: "white",
                    borderWidth: "2px",
                  },
                }}
              >
                Show Experiences
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  )
}
