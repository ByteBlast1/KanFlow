"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Search,
  Settings,
  LogOut,
  User,
  LayoutDashboard,
  Users,
  Calendar,
  BarChart,
  Bell,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Define the Board type
type Board = {
  id: string
  title: string
  description: string
  updatedAt: string
  tasksCount: number
  status: string
  priority: "Low" | "Medium" | "High"
}

// Initial mock data with proper typing
const initialBoards: Board[] = [
  {
    id: "1",
    title: "Product Development",
    description: "Track product features and bugs",
    updatedAt: "2024-02-20T14:23:00Z",
    tasksCount: 12,
    status: "In Progress",
    priority: "High",
  },
  {
    id: "2",
    title: "Marketing Campaign",
    description: "Q1 marketing initiatives",
    updatedAt: "2024-02-19T09:45:00Z",
    tasksCount: 8,
    status: "Planning",
    priority: "Medium",
  },
  {
    id: "3",
    title: "Website Redesign",
    description: "Redesign company website",
    updatedAt: "2024-02-18T16:30:00Z",
    tasksCount: 15,
    status: "In Review",
    priority: "High",
  },
]

const stats = [
  {
    title: "Total Tasks",
    value: "35",
    description: "Active tasks across all boards",
    icon: LayoutDashboard,
  },
  {
    title: "Team Members",
    value: "12",
    description: "Active contributors",
    icon: Users,
  },
  {
    title: "Due Soon",
    value: "8",
    description: "Tasks due this week",
    icon: Calendar,
  },
  {
    title: "Completion Rate",
    value: "87%",
    description: "Tasks completed on time",
    icon: BarChart,
  },
]

// Helper functions for localStorage
const STORAGE_KEY = 'kanban_boards'

const getBoardsFromStorage = (): Board[] | null => {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return null
  }
}

const saveBoardsToStorage = (boards: Board[]): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export default function DashboardPage() {
  const [boards, setBoards] = useState<Board[]>(initialBoards)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBoard, setSelectedBoard] = useState<(typeof initialBoards)[0] | null>(null)
  const [createBoardTitle, setCreateBoardTitle] = useState("")
  const [createBoardDescription, setCreateBoardDescription] = useState("")
  const [createBoardPriority, setCreateBoardPriority] = useState("Medium")
  const [editBoardTitle, setEditBoardTitle] = useState("")
  const [editBoardDescription, setEditBoardDescription] = useState("")
  const [editBoardPriority, setEditBoardPriority] = useState("")

  // Initialize from localStorage after mount
  useEffect(() => {
    setMounted(true)
    const storedBoards = getBoardsFromStorage()
    if (storedBoards) {
      setBoards(storedBoards)
    }
  }, [])

  // Save boards to localStorage whenever they change, but only after mounting
  useEffect(() => {
    if (mounted) {
      saveBoardsToStorage(boards)
    }
  }, [boards, mounted])

  const handleCreateBoard = () => {
    if (!createBoardTitle.trim()) return

    const newBoard: Board = {
      id: Date.now().toString(),
      title: createBoardTitle.trim(),
      description: createBoardDescription.trim(),
      updatedAt: new Date().toISOString(),
      tasksCount: 0,
      status: "Planning",
      priority: createBoardPriority as "Low" | "Medium" | "High",
    }

    const updatedBoards = [newBoard, ...boards]
    setBoards(updatedBoards)
    saveBoardsToStorage(updatedBoards)
    setCreateBoardTitle("")
    setCreateBoardDescription("")
    setCreateBoardPriority("Medium")
    setIsDialogOpen(false)
  }

  const handleEditBoard = () => {
    if (!selectedBoard || !editBoardTitle.trim()) return

    const updatedBoards = boards.map((board: Board) => 
      board.id === selectedBoard.id 
        ? {
            ...board,
            title: editBoardTitle.trim(),
            description: editBoardDescription.trim(),
            priority: editBoardPriority as "Low" | "Medium" | "High",
            updatedAt: new Date().toISOString(),
          }
        : board
    )

    setBoards(updatedBoards)
    saveBoardsToStorage(updatedBoards)
    setIsEditDialogOpen(false)
    setSelectedBoard(null)
    setEditBoardTitle("")
    setEditBoardDescription("")
    setEditBoardPriority("")
  }

  const handleDeleteBoard = () => {
    if (!selectedBoard) return

    const updatedBoards = boards.filter((board: Board) => board.id !== selectedBoard.id)
    setBoards(updatedBoards)
    saveBoardsToStorage(updatedBoards)
    setIsDeleteDialogOpen(false)
    setSelectedBoard(null)
  }

  const openEditDialog = (board: typeof initialBoards[0]) => {
    setSelectedBoard(board)
    setEditBoardTitle(board.title)
    setEditBoardDescription(board.description)
    setEditBoardPriority(board.priority)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (board: typeof initialBoards[0]) => {
    setSelectedBoard(board)
    setIsDeleteDialogOpen(true)
  }

  const filteredBoards = boards.filter(
    (board: Board) =>
      board.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      board.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 mr-2 text-primary"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 7h.01" />
                <path d="M7 12h.01" />
                <path d="M7 17h.01" />
                <path d="M11 7h6" />
                <path d="M11 12h6" />
                <path d="M11 17h6" />
              </svg>
              <span className="text-xl font-bold">KanFlow</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block w-full max-w-[200px] md:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search boards..."
                className="w-full rounded-md pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <div className="bg-yellow-100 dark:bg-yellow-900/30 border-b border-yellow-200 dark:border-yellow-800">
        <div className="container px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="h-4 w-4" />
            <p>
              This project is under active development. Some features may be incomplete or not work as expected.
              {mounted && <span suppressHydrationWarning> Last updated: 3/6/2025</span>}
            </p>
          </div>
        </div>
      </div>
      <main className="flex-1 bg-muted/40">
        <div className="container px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-6">
            {/* Stats Section */}
            <section className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <Card key={i}>
                    <CardContent className="flex flex-row items-center gap-4 p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </section>

            {/* Boards Section */}
            <section className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">My Boards</h2>
                  <div className="block sm:hidden relative w-full max-w-[200px] ml-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="w-full rounded-md pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) {
                    setCreateBoardTitle("")
                    setCreateBoardDescription("")
                    setCreateBoardPriority("Medium")
                  }
                }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Board
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Board</DialogTitle>
                  <DialogDescription>Add a new board to organize your tasks.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="board-title">Board Title</Label>
                    <Input
                      id="board-title"
                      placeholder="Enter board title"
                          value={createBoardTitle}
                          onChange={(e) => setCreateBoardTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="board-description">Description (Optional)</Label>
                    <Input
                      id="board-description"
                      placeholder="Enter board description"
                          value={createBoardDescription}
                          onChange={(e) => setCreateBoardDescription(e.target.value)}
                    />
                  </div>
                      <div className="space-y-2">
                        <Label htmlFor="board-priority">Priority</Label>
                        <Select value={createBoardPriority} onValueChange={setCreateBoardPriority}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                </div>
                <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setIsDialogOpen(false)
                        setCreateBoardTitle("")
                        setCreateBoardDescription("")
                        setCreateBoardPriority("Medium")
                      }}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateBoard}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredBoards.map((board) => (
                  <Card key={board.id} className="h-full transition-shadow hover:shadow-md">
                    <CardHeader className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="line-clamp-1">{board.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              board.priority === "High"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}
                          >
                            {board.priority}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(board)}>
                                Edit Board
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 dark:text-red-400"
                                onClick={() => openDeleteDialog(board)}
                              >
                                Delete Board
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
              </div>
            </div>
                      <CardDescription className="line-clamp-2">{board.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            Updated {new Date(board.updatedAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                              board.status === "In Progress"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                : board.status === "In Review"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                            }`}
                          >
                            {board.status === "In Progress" ? (
                              <Clock className="h-3 w-3" />
                            ) : board.status === "In Review" ? (
                              <AlertCircle className="h-3 w-3" />
                            ) : (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            {board.status}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex w-full items-center justify-between">
                        <span className="text-sm text-muted-foreground">{board.tasksCount} tasks</span>
                        <Link href={`/board/${board.id}`}>
                          <Button variant="ghost" size="sm">
                            View Board
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
              ))}
            </div>
            </section>
          </div>
        </div>
      </main>

      {/* Edit Board Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open)
        if (!open) {
          setEditBoardTitle("")
          setEditBoardDescription("")
          setEditBoardPriority("")
          setSelectedBoard(null)
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
            <DialogDescription>Update the board details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-board-title">Board Title</Label>
              <Input
                id="edit-board-title"
                placeholder="Enter board title"
                value={editBoardTitle}
                onChange={(e) => setEditBoardTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-board-description">Description (Optional)</Label>
              <Input
                id="edit-board-description"
                placeholder="Enter board description"
                value={editBoardDescription}
                onChange={(e) => setEditBoardDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-board-priority">Priority</Label>
              <Select value={editBoardPriority} onValueChange={setEditBoardPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false)
              setEditBoardTitle("")
              setEditBoardDescription("")
              setEditBoardPriority("")
              setSelectedBoard(null)
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditBoard}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Board Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        setIsDeleteDialogOpen(open)
        if (!open) {
          setSelectedBoard(null)
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Board</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedBoard?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBoard}>
              Delete Board
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

