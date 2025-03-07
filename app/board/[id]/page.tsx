"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ArrowLeft, CalendarIcon, MoreHorizontal, Plus, Search, Settings, X } from "lucide-react"

// Types
type Priority = "low" | "medium" | "high"

interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  dueDate: Date | null
  assignee: string | null
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

interface Board {
  id: string
  title: string
  description: string
  columns: Column[]
}

interface BoardsData {
  [key: string]: Board
}

// Mock data for different boards
const boardsData: BoardsData = {
  "1": {
    id: "1",
    title: "Product Development",
    description: "Track product features and bugs",
    columns: [
      {
        id: "col-1",
        title: "To Do",
        tasks: [
          {
            id: "task-1",
            title: "Research competitors",
            description: "Analyze top 5 competitors in the market",
            priority: "medium",
            dueDate: new Date(2024, 1, 25),
            assignee: "John Doe",
          },
          {
            id: "task-2",
            title: "Create wireframes",
            description: "Design initial wireframes for the dashboard",
            priority: "high",
            dueDate: new Date(2024, 1, 20),
            assignee: "Jane Smith",
          },
        ],
      },
      {
        id: "col-2",
        title: "In Progress",
        tasks: [
          {
            id: "task-3",
            title: "Design homepage",
            description: "Create responsive design for the homepage",
            priority: "high",
            dueDate: new Date(2024, 1, 18),
            assignee: "Jane Smith",
          },
        ],
      },
      {
        id: "col-3",
        title: "Testing",
        tasks: [],
      },
      {
        id: "col-4",
        title: "Done",
        tasks: [
          {
            id: "task-4",
            title: "Project setup",
            description: "Initialize repository and set up development environment",
            priority: "low",
            dueDate: new Date(2024, 1, 15),
            assignee: "John Doe",
          },
        ],
      },
    ],
  },
  "2": {
    id: "2",
    title: "Marketing Campaign",
    description: "Q1 marketing initiatives",
    columns: [
      {
        id: "col-1",
        title: "Planning",
        tasks: [
          {
            id: "task-1",
            title: "Define target audience",
            description: "Research and identify key customer segments",
            priority: "high",
            dueDate: new Date(2024, 1, 22),
            assignee: "Sarah Johnson",
          },
        ],
      },
      {
        id: "col-2",
        title: "Content Creation",
        tasks: [
          {
            id: "task-2",
            title: "Write blog posts",
            description: "Create engaging content for the campaign",
            priority: "medium",
            dueDate: new Date(2024, 1, 25),
            assignee: "Mike Wilson",
          },
        ],
      },
      {
        id: "col-3",
        title: "Review",
        tasks: [],
      },
      {
        id: "col-4",
        title: "Published",
        tasks: [],
      },
    ],
  },
  "3": {
    id: "3",
    title: "Website Redesign",
    description: "Redesign company website",
    columns: [
      {
        id: "col-1",
        title: "Backlog",
        tasks: [
          {
            id: "task-1",
            title: "Gather requirements",
            description: "Document all website requirements and features",
            priority: "high",
            dueDate: new Date(2024, 1, 21),
            assignee: "Emily Chen",
          },
        ],
      },
      {
        id: "col-2",
        title: "Design",
        tasks: [
          {
            id: "task-2",
            title: "Create mockups",
            description: "Design high-fidelity mockups for key pages",
            priority: "high",
            dueDate: new Date(2024, 1, 23),
            assignee: "Alex Turner",
          },
        ],
      },
      {
        id: "col-3",
        title: "Development",
        tasks: [],
      },
      {
        id: "col-4",
        title: "Completed",
        tasks: [],
      },
    ],
  },
}

// Helper functions for localStorage
const STORAGE_KEY_PREFIX = 'kanban_board_'

const getBoardFromStorage = (boardId: string) => {
  try {
    const storedData = localStorage.getItem(`${STORAGE_KEY_PREFIX}${boardId}`)
    return storedData ? JSON.parse(storedData) : null
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return null
  }
}

const saveBoardToStorage = (boardId: string, data: { columns: Column[], board: Board }) => {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${boardId}`, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export default function BoardPage() {
  const params = useParams()
  const boardId = params.id as string
  const [columns, setColumns] = useState<Column[]>([])
  const [board, setBoard] = useState<Board>({ id: "", title: "", description: "" })
  const [searchQuery, setSearchQuery] = useState("")
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null)
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [currentColumnId, setCurrentColumnId] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [filteredColumns, setFilteredColumns] = useState<Column[]>([])
  const newColumnInputRef = useRef<HTMLInputElement>(null)

  // Initialize board data from localStorage or default data
  useEffect(() => {
    const storedData = getBoardFromStorage(boardId)
    if (storedData) {
      setColumns(storedData.columns)
      setBoard(storedData.board)
    } else {
      // If no stored data, use the default data
      setColumns(boardsData[boardId]?.columns || [])
      setBoard(boardsData[boardId] || { id: "", title: "", description: "" })
    }
  }, [boardId])

  // Save to localStorage whenever columns change
  useEffect(() => {
    if (board.id) {
      saveBoardToStorage(boardId, { columns, board })
    }
  }, [columns, board, boardId])

  // Filter tasks based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredColumns(columns)
      return
    }

    const filtered = columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))

    setFilteredColumns(filtered)
  }, [searchQuery, columns])

  // Focus on new column input when adding a column
  useEffect(() => {
    if (isAddingColumn && newColumnInputRef.current) {
      newColumnInputRef.current.focus()
    }
  }, [isAddingColumn])

  // Handle drag start for tasks
  const handleDragStart = (task: Task, columnId: string) => {
    setDraggedTask(task)
    setDraggedColumn(columnId)
  }

  // Handle drag over for columns
  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
  }

  // Handle drop for tasks
  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault()

    if (!draggedTask || !draggedColumn) return

    // Remove task from source column
    const updatedColumns = columns.map((column) => {
      if (column.id === draggedColumn) {
        return {
          ...column,
          tasks: column.tasks.filter((task) => task.id !== draggedTask.id),
        }
      }
      return column
    })

    // Add task to target column
    const finalColumns = updatedColumns.map((column) => {
      if (column.id === targetColumnId) {
        return {
          ...column,
          tasks: [...column.tasks, draggedTask],
        }
      }
      return column
    })

    setColumns(finalColumns)
    setDraggedTask(null)
    setDraggedColumn(null)
  }

  // Handle adding a new column
  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return

    const newColumn: Column = {
      id: `col-${Date.now()}`,
      title: newColumnTitle,
      tasks: [],
    }

    setColumns([...columns, newColumn])
    setNewColumnTitle("")
    setIsAddingColumn(false)
  }

  // Handle adding a new task
  const handleAddTask = (columnId: string) => {
    setCurrentTask({
      id: "",
      title: "",
      description: "",
      priority: "medium",
      dueDate: null,
      assignee: null,
    })
    setCurrentColumnId(columnId)
    setIsEditMode(false)
    setIsTaskDialogOpen(true)
  }

  // Handle editing a task
  const handleEditTask = (task: Task, columnId: string) => {
    setCurrentTask(task)
    setCurrentColumnId(columnId)
    setIsEditMode(true)
    setIsTaskDialogOpen(true)
  }

  // Handle saving a task
  const handleSaveTask = (task: Task) => {
    if (!currentColumnId) return

    let updatedColumns: Column[]

    if (isEditMode) {
      // Update existing task
      updatedColumns = columns.map((column) => {
        if (column.id === currentColumnId) {
          return {
            ...column,
            tasks: column.tasks.map((t) => (t.id === task.id ? task : t)),
          }
        }
        return column
      })
    } else {
      // Add new task
      const newTask = {
        ...task,
        id: `task-${Date.now()}`,
      }

      updatedColumns = columns.map((column) => {
        if (column.id === currentColumnId) {
          return {
            ...column,
            tasks: [...column.tasks, newTask],
          }
        }
        return column
      })
    }

    setColumns(updatedColumns)
    setIsTaskDialogOpen(false)
    setCurrentTask(null)
    setCurrentColumnId(null)
  }

  // Handle deleting a task
  const handleDeleteTask = (taskId: string, columnId: string) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.filter((task) => task.id !== taskId),
        }
      }
      return column
    })

    setColumns(updatedColumns)
  }

  // Handle deleting a column
  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter((column) => column.id !== columnId))
  }

  // Get priority badge color
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "low":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "high":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
            <div className="ml-4 text-sm bg-primary/10 text-primary px-2 py-1 rounded-md hidden md:block">
              <span className="dark:hidden">Light Mode</span>
              <span className="hidden dark:block">Dark Mode</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-full max-w-[200px] md:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="w-full rounded-md pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto bg-muted/40 p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{board.title}</h1>
          <p className="text-muted-foreground">{board.description}</p>
        </div>

        {/* Grid layout for columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-min">
          {filteredColumns.map((column) => (
            <div
              key={column.id}
              className="h-full"
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="bg-muted/50 rounded-lg p-3 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{column.title}</h3>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleAddTask(column.id)}>
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Add task</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDeleteColumn(column.id)}>Delete Column</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  {column.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-md bg-background p-3 shadow-sm border cursor-pointer"
                      draggable
                      onDragStart={() => handleDragStart(task, column.id)}
                      onClick={() => handleEditTask(task, column.id)}
                    >
                      <div className="text-sm font-medium">{task.title}</div>
                      {task.description && (
                        <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{task.description}</div>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                        {task.dueDate && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {format(task.dueDate, "MMM d")}
                          </div>
                        )}
                        {task.assignee && (
                          <div className="ml-auto">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[10px]">
                                {task.assignee
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {column.tasks.length === 0 && (
                    <div className="rounded-md border border-dashed p-3 text-center text-sm text-muted-foreground">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add Column Button/Form */}
          <div className="h-full">
            {isAddingColumn ? (
              <div className="bg-muted/50 rounded-lg p-3 h-full">
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    ref={newColumnInputRef}
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    placeholder="Enter column title"
                    className="h-8"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddColumn()
                      if (e.key === "Escape") {
                        setIsAddingColumn(false)
                        setNewColumnTitle("")
                      }
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleAddColumn}>
                    Add Column
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsAddingColumn(false)
                      setNewColumnTitle("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="border-dashed h-full w-full min-h-[120px]"
                onClick={() => setIsAddingColumn(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Column
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Task Dialog */}
      <TaskDialog
        isOpen={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        task={currentTask}
        isEditMode={isEditMode}
        onSave={handleSaveTask}
        onDelete={
          isEditMode && currentTask && currentColumnId
            ? () => {
                handleDeleteTask(currentTask.id, currentColumnId)
                setIsTaskDialogOpen(false)
              }
            : undefined
        }
      />
    </div>
  )
}

interface TaskDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  isEditMode: boolean
  onSave: (task: Task) => void
  onDelete?: () => void
}

function TaskDialog({ isOpen, onOpenChange, task, isEditMode, onSave, onDelete }: TaskDialogProps) {
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [priority, setPriority] = useState<Priority>(task?.priority || "medium")
  const [dueDate, setDueDate] = useState<Date | null>(task?.dueDate || null)
  const [assignee, setAssignee] = useState(task?.assignee || "")
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setPriority(task.priority)
      setDueDate(task.dueDate)
      setAssignee(task.assignee || "")
    }
  }, [task])

  const handleSubmit = () => {
    if (!title.trim()) return

    onSave({
      id: task?.id || "",
      title,
      description,
      priority,
      dueDate,
      assignee: assignee || null,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Task" : "Create Task"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the details of this task." : "Add a new task to your board."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter task title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => {
                    setDueDate(date)
                    setIsCalendarOpen(false)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Input
              id="assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Enter assignee name"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          {onDelete && (
            <Button variant="destructive" onClick={onDelete}>
              Delete Task
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{isEditMode ? "Update" : "Create"}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

