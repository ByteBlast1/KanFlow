// This is a mock database implementation
// In a real application, you would use a real database like PostgreSQL, MongoDB, etc.

import { v4 as uuidv4 } from "uuid"

// Types
export type Priority = "low" | "medium" | "high"

export interface User {
  id: string
  name: string
  email: string
  password: string // In a real app, this would be hashed
  createdAt: Date
}

export interface Board {
  id: string
  title: string
  description: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface Column {
  id: string
  title: string
  boardId: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  title: string
  description: string
  columnId: string
  priority: Priority
  dueDate: Date | null
  assigneeId: string | null
  createdAt: Date
  updatedAt: Date
}

// Mock database
class Database {
  private users: User[] = []
  private boards: Board[] = []
  private columns: Column[] = []
  private tasks: Task[] = []

  // User methods
  async createUser(name: string, email: string, password: string): Promise<User> {
    const user: User = {
      id: uuidv4(),
      name,
      email,
      password, // In a real app, this would be hashed
      createdAt: new Date(),
    }
    this.users.push(user)
    return user
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null
  }

  // Board methods
  async createBoard(title: string, description: string, userId: string): Promise<Board> {
    const now = new Date()
    const board: Board = {
      id: uuidv4(),
      title,
      description,
      userId,
      createdAt: now,
      updatedAt: now,
    }
    this.boards.push(board)
    return board
  }

  async getBoardsByUserId(userId: string): Promise<Board[]> {
    return this.boards.filter((board) => board.userId === userId)
  }

  async getBoardById(id: string): Promise<Board | null> {
    return this.boards.find((board) => board.id === id) || null
  }

  async updateBoard(id: string, data: Partial<Board>): Promise<Board | null> {
    const boardIndex = this.boards.findIndex((board) => board.id === id)
    if (boardIndex === -1) return null

    const updatedBoard = {
      ...this.boards[boardIndex],
      ...data,
      updatedAt: new Date(),
    }

    this.boards[boardIndex] = updatedBoard
    return updatedBoard
  }

  async deleteBoard(id: string): Promise<boolean> {
    const initialLength = this.boards.length
    this.boards = this.boards.filter((board) => board.id !== id)

    // Also delete related columns and tasks
    const columnsToDelete = this.columns.filter((column) => column.boardId === id)
    this.columns = this.columns.filter((column) => column.boardId !== id)

    columnsToDelete.forEach((column) => {
      this.tasks = this.tasks.filter((task) => task.columnId !== column.id)
    })

    return initialLength > this.boards.length
  }

  // Column methods
  async createColumn(title: string, boardId: string): Promise<Column> {
    const now = new Date()
    const maxOrder = Math.max(
      0,
      ...this.columns.filter((column) => column.boardId === boardId).map((column) => column.order),
    )

    const column: Column = {
      id: uuidv4(),
      title,
      boardId,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    }

    this.columns.push(column)
    return column
  }

  async getColumnsByBoardId(boardId: string): Promise<Column[]> {
    return this.columns.filter((column) => column.boardId === boardId).sort((a, b) => a.order - b.order)
  }

  async updateColumn(id: string, data: Partial<Column>): Promise<Column | null> {
    const columnIndex = this.columns.findIndex((column) => column.id === id)
    if (columnIndex === -1) return null

    const updatedColumn = {
      ...this.columns[columnIndex],
      ...data,
      updatedAt: new Date(),
    }

    this.columns[columnIndex] = updatedColumn
    return updatedColumn
  }

  async deleteColumn(id: string): Promise<boolean> {
    const initialLength = this.columns.length
    this.columns = this.columns.filter((column) => column.id !== id)

    // Also delete related tasks
    this.tasks = this.tasks.filter((task) => task.columnId !== id)

    return initialLength > this.columns.length
  }

  // Task methods
  async createTask(
    title: string,
    description: string,
    columnId: string,
    priority: Priority = "medium",
    dueDate: Date | null = null,
    assigneeId: string | null = null,
  ): Promise<Task> {
    const now = new Date()
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      columnId,
      priority,
      dueDate,
      assigneeId,
      createdAt: now,
      updatedAt: now,
    }

    this.tasks.push(task)
    return task
  }

  async getTasksByColumnId(columnId: string): Promise<Task[]> {
    return this.tasks.filter((task) => task.columnId === columnId)
  }

  async getTaskById(id: string): Promise<Task | null> {
    return this.tasks.find((task) => task.id === id) || null
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task | null> {
    const taskIndex = this.tasks.findIndex((task) => task.id === id)
    if (taskIndex === -1) return null

    const updatedTask = {
      ...this.tasks[taskIndex],
      ...data,
      updatedAt: new Date(),
    }

    this.tasks[taskIndex] = updatedTask
    return updatedTask
  }

  async deleteTask(id: string): Promise<boolean> {
    const initialLength = this.tasks.length
    this.tasks = this.tasks.filter((task) => task.id !== id)
    return initialLength > this.tasks.length
  }

  // Helper method to seed the database with initial data
  async seed(): Promise<void> {
    // Create a user
    const user = await this.createUser("John Doe", "john@example.com", "password123")

    // Create a board
    const board = await this.createBoard("Product Development", "Track product features and bugs", user.id)

    // Create columns
    const todoColumn = await this.createColumn("To Do", board.id)
    const inProgressColumn = await this.createColumn("In Progress", board.id)
    const testingColumn = await this.createColumn("Testing", board.id)
    const doneColumn = await this.createColumn("Done", board.id)

    // Create tasks
    await this.createTask(
      "Research competitors",
      "Analyze top 5 competitors in the market",
      todoColumn.id,
      "medium",
      new Date(2023, 10, 25),
      user.id,
    )

    await this.createTask(
      "Create wireframes",
      "Design initial wireframes for the dashboard",
      todoColumn.id,
      "high",
      new Date(2023, 10, 20),
      user.id,
    )

    await this.createTask(
      "Set up analytics",
      "Implement Google Analytics and set up custom events",
      todoColumn.id,
      "low",
      new Date(2023, 10, 30),
      null,
    )

    await this.createTask(
      "Design homepage",
      "Create responsive design for the homepage",
      inProgressColumn.id,
      "high",
      new Date(2023, 10, 18),
      user.id,
    )

    await this.createTask(
      "Implement authentication",
      "Set up user authentication with JWT",
      inProgressColumn.id,
      "medium",
      new Date(2023, 10, 22),
      user.id,
    )

    await this.createTask(
      "Test user flows",
      "Verify all user journeys work as expected",
      testingColumn.id,
      "medium",
      new Date(2023, 10, 19),
      user.id,
    )

    await this.createTask(
      "Project setup",
      "Initialize repository and set up development environment",
      doneColumn.id,
      "low",
      new Date(2023, 10, 15),
      user.id,
    )

    await this.createTask(
      "Create database schema",
      "Design initial database structure",
      doneColumn.id,
      "medium",
      new Date(2023, 10, 16),
      user.id,
    )
  }
}

// Export a singleton instance
export const db = new Database()

// Seed the database with initial data
db.seed().catch(console.error)

