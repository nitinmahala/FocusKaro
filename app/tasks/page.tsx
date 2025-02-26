"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trash2, Plus, Filter } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Task {
  id: string
  text: string
  completed: boolean
  category: string
  createdAt: number
}

const categories = [
  { value: "work", label: "Work", color: "bg-blue-500" },
  { value: "personal", label: "Personal", color: "bg-green-500" },
  { value: "urgent", label: "Urgent", color: "bg-red-500" },
  { value: "learning", label: "Learning", color: "bg-purple-500" },
  { value: "health", label: "Health", color: "bg-yellow-500" },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [category, setCategory] = useState("work")
  const [filter, setFilter] = useState("all")

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("focusflow-tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("focusflow-tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return

    const task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
      category,
      createdAt: Date.now(),
    }

    setTasks([...tasks, task])
    setNewTask("")
    toast.success("Task added")
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
    toast.success("Task deleted")
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    if (filter === "completed") return task.completed
    if (filter === "active") return !task.completed
    return task.category === filter
  })

  const getCategoryColor = (categoryValue: string) => {
    const category = categories.find((c) => c.value === categoryValue)
    return category ? category.color : "bg-gray-500"
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Task Tracker</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>All Tasks</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("active")}>Active Tasks</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("completed")}>Completed Tasks</DropdownMenuItem>
              <DropdownMenuItem className="opacity-50 pointer-events-none">By Category</DropdownMenuItem>
              {categories.map((cat) => (
                <DropdownMenuItem key={cat.value} onClick={() => setFilter(cat.value)} className="pl-6">
                  <div className={`w-2 h-2 rounded-full ${cat.color} mr-2`} />
                  {cat.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <form onSubmit={addTask} className="flex gap-2 mb-8">
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${cat.color} mr-2`} />
                    {cat.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </form>

        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 border border-border/40 rounded-lg bg-card/30 backdrop-blur-sm">
              <p className="text-muted-foreground">
                {filter === "all" ? "No tasks yet. Add one to get started!" : "No tasks match the current filter."}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                categoryColor={getCategoryColor(task.category)}
              />
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}

function TaskItem({
  task,
  onToggle,
  onDelete,
  categoryColor,
}: {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  categoryColor: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Checkbox
          id={task.id}
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="transition-all data-[state=checked]:bg-blue-500"
        />
        <div className="flex flex-col">
          <label
            htmlFor={task.id}
            className={`font-medium transition-all ${
              task.completed ? "line-through text-muted-foreground" : "text-foreground"
            }`}
          >
            {task.text}
          </label>
          <div className="flex items-center mt-1">
            <div className={`w-2 h-2 rounded-full ${categoryColor} mr-2`} />
            <span className="text-xs text-muted-foreground">
              {categories.find((c) => c.value === task.category)?.label || task.category}
            </span>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
        className="opacity-50 hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </motion.div>
  )
}

