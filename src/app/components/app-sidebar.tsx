"use client"

import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search, MessageSquare, User, Trash2, Edit, Loader2, Calendar, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"

// Type definitions
interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  isActive?: boolean;
}

// Mock data for conversation history
const MOCK_CONVERSATIONS: Conversation[] = [
  { id: "1", title: "Meeting schedule for next week", createdAt: new Date(2023, 6, 15), isActive: true },
  { id: "2", title: "Birthday party planning", createdAt: new Date(2023, 6, 10) },
  { id: "3", title: "Vacation planning", createdAt: new Date(2023, 6, 5) },
  { id: "4", title: "Doctor's appointment", createdAt: new Date(2023, 6, 1) },
  { id: "5", title: "Team building event", createdAt: new Date(2023, 5, 28) },
  { id: "6", title: "Conference schedule", createdAt: new Date(2023, 5, 25) },
  { id: "7", title: "Weekend plans", createdAt: new Date(2023, 5, 20) },
  { id: "8", title: "Weekly calendar review", createdAt: new Date(2023, 5, 15) },
];

// Custom hook for conversations
function useConversations() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS)

  const createConversation = async () => {
    const newConversation = {
      id: Date.now().toString(),
      title: "New conversation",
      createdAt: new Date(),
    }
    
    setConversations(prev => [newConversation, ...prev])
    return newConversation
  }

  const deleteConversation = async (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id))
    return true
  }

  return {
    conversations,
    isLoading,
    error,
    createConversation,
    deleteConversation
  }
}

// Rename Dialog Component
function RenameConversationDialog({ 
  isOpen, 
  onClose, 
  conversationId, 
  currentTitle 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  conversationId: string; 
  currentTitle: string 
}) {
  const [title, setTitle] = useState(currentTitle)
  const [isRenaming, setIsRenaming] = useState(false)

  const handleRename = async () => {
    setIsRenaming(true)
    try {
      // Here you would implement the actual rename logic
      console.log(`Renaming conversation ${conversationId} to ${title}`)
      // After success
      onClose()
    } catch (error) {
      console.error("Failed to rename conversation:", error)
    } finally {
      setIsRenaming(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename conversation</DialogTitle>
          <DialogDescription>
            Enter a new name for this conversation
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Conversation name"
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleRename} 
            disabled={isRenaming || !title.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isRenaming ? 
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Renaming</> : 
              'Save Changes'
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Delete Dialog Component
function DeleteConversationDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title,
  isDeleting
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  title: string;
  isDeleting: boolean;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete conversation</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting</> : 
              'Delete'
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function AppSidebar() {
  const router = useRouter()
  const { state } = useSidebar()
  const [searchQuery, setSearchQuery] = useState("")
  const [renameDialog, setRenameDialog] = useState<{
    isOpen: boolean;
    conversationId: string;
    title: string;
  }>({
    isOpen: false,
    conversationId: "",
    title: "",
  })
  
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    conversationId: string;
    title: string;
  }>({
    isOpen: false,
    conversationId: "",
    title: "",
  })
  
  const [isDeleting, setIsDeleting] = useState(false)
  
  const { 
    conversations, 
    isLoading, 
    error, 
    createConversation,
    deleteConversation
  } = useConversations()
  
  const handleNewChat = async () => {
    try {
      const newConversation = await createConversation()
      router.push(`/chat/${newConversation.id}`)
    } catch (error) {
      console.error("Failed to create new conversation", error)
    }
  }
  
  const openRenameDialog = (id: string, title: string) => {
    setRenameDialog({
      isOpen: true,
      conversationId: id,
      title: title || "New conversation"
    })
  }
  
  const closeRenameDialog = () => {
    setRenameDialog({
      isOpen: false,
      conversationId: "",
      title: ""
    })
  }
  
  const openDeleteDialog = (id: string, title: string) => {
    setDeleteDialog({
      isOpen: true,
      conversationId: id,
      title: title || "New conversation"
    })
  }
  
  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      conversationId: "",
      title: ""
    })
  }
  
  const handleDeleteConversation = async () => {
    if (!deleteDialog.conversationId) return
    
    setIsDeleting(true)
    
    try {
      await deleteConversation(deleteDialog.conversationId)
      closeDeleteDialog()
    } catch (error) {
      console.error("Failed to delete conversation:", error)
    } finally {
      setIsDeleting(false)
    }
  }
  
  // Group conversations by date
  const todayConversations = conversations.filter(
    (conv) => new Date(conv.createdAt).toDateString() === new Date().toDateString()
  )
  
  const olderConversations = conversations.filter(
    (conv) => new Date(conv.createdAt).toDateString() !== new Date().toDateString()
  )

  // Filter conversations based on search query
  const filteredToday = searchQuery 
    ? todayConversations.filter((conv) => 
        conv.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : todayConversations
    
  const filteredOlder = searchQuery 
    ? olderConversations.filter((conv) => 
        conv.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : olderConversations

  return (
    <>
      {/* Show trigger outside sidebar only when sidebar is collapsed on mobile */}
      {state === "collapsed" && (
        <SidebarTrigger className="fixed top-4 left-4 z-50" />
      )}
      
      <Sidebar className="bg-muted/5 border-r">
        <SidebarHeader className="p-3">
          <div className="flex items-center justify-between mb-2">
            <Link href="/chat?new=true" className="flex items-center gap-2 font-medium text-purple-800">
              <MessageSquare size={18} className="text-purple-500" />
              <h2 className="text-lg font-semibold">CalAssist</h2>
            </Link>
            <SidebarTrigger className="text-purple-500">
              {state === "expanded" ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </SidebarTrigger>
          </div>
          <Button 
            variant="default" 
            className="w-full mb-2 bg-purple-100 text-purple-800 hover:bg-purple-200 border-0"
            onClick={handleNewChat}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <PlusCircle className="w-4 h-4 mr-2 text-purple-600" />} 
            New Chat
          </Button>
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your threads..."
              className="w-full pl-9 h-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </SidebarHeader>
        
        <SidebarContent className="px-1">
          {isLoading ? (
            <div className="space-y-2 p-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : (
            <>
              {filteredToday.length > 0 && (
                <SidebarGroup>
                  <SidebarGroupLabel className="px-3 py-2 text-xs font-medium text-muted-foreground">
                    Today
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {filteredToday.map((conv) => (
                        <SidebarMenuItem key={conv.id}>
                          <SidebarMenuButton 
                            asChild
                            className="w-full justify-start group relative"
                            onClick={() => router.push(`/chat/${conv.id}`)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0" />
                            <span className="flex-grow truncate">{conv.title || "New conversation"}</span>
                            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-0.5 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-transparent group-hover:bg-muted/80">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 opacity-70 hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openRenameDialog(conv.id, conv.title)
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-destructive opacity-70 hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openDeleteDialog(conv.id, conv.title)
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )}
              
              {filteredOlder.length > 0 && (
                <SidebarGroup>
                  <SidebarGroupLabel className="px-3 py-2 text-xs font-medium text-muted-foreground">
                    Older
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {filteredOlder.map((conv) => (
                        <SidebarMenuItem key={conv.id}>
                          <SidebarMenuButton 
                          asChild
                            className="w-full justify-start group relative"
                            onClick={() => router.push(`/chat/${conv.id}`)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0" />
                            <span className="flex-grow truncate">{conv.title || "New conversation"}</span>
                            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-0.5 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-transparent group-hover:bg-muted/80">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 opacity-70 hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openRenameDialog(conv.id, conv.title)
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-destructive opacity-70 hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openDeleteDialog(conv.id, conv.title)
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )}
              
          {filteredToday.length === 0 && filteredOlder.length === 0 && (
                <div className="px-3 py-10 text-center text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No conversations found</p>
                  {searchQuery && (
                    <p className="text-xs mt-1">Try a different search term</p>
                  )}
                </div>
              )}
            </>
          )}
        </SidebarContent>
        
        <SidebarFooter className="p-3 mt-auto">
          <SidebarSeparator />
          <div className="mt-2">
            <div className="grid grid-cols-3 gap-1">
              <Button variant="ghost" size="icon" className="text-purple-500" asChild>
                <Link href="/dashboard">
                  <MessageSquare size={18} />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="text-purple-500" asChild>
                <Link href="/connect/google-calendar">
                  <Calendar size={18} />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="text-purple-500" asChild>
                <Link href="/settings">
                  <Settings size={18} />
                </Link>
              </Button>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      
      {/* Rename dialog */}
      <RenameConversationDialog
        isOpen={renameDialog.isOpen}
        onClose={closeRenameDialog}
        conversationId={renameDialog.conversationId}
        currentTitle={renameDialog.title}
      />
      
      {/* Delete dialog */}
      <DeleteConversationDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConversation}
        title={deleteDialog.title}
        isDeleting={isDeleting}
      />
    </>
  )
}
  