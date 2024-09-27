"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Edit2 } from "lucide-react"

export default function Component() {
  const [time, setTime] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [task, setTask] = useState("")
  const [sessions, setSessions] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editedMinutes, setEditedMinutes] = useState("25")
  const [editedSeconds, setEditedSeconds] = useState("00")
  const [randomQuote, setRandomQuote] = useState("")
  const [isClient, setIsClient] = useState(false)

  const quotes = [
    "The secret of getting ahead is getting started. - Mark Twain",
    "It always seems impossible until it's done. - Nelson Mandela",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  ]

  useEffect(() => {
    setIsClient(true)
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
      setIsActive(false)
      setSessions((prevSessions) => prevSessions + 1)
      setTime(25 * 60)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, time])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTime(25 * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleEditTime = () => {
    setIsEditing(true)
    setEditedMinutes(Math.floor(time / 60).toString().padStart(2, "0"))
    setEditedSeconds((time % 60).toString().padStart(2, "0"))
  }

  const handleSaveTime = () => {
    const newTime = parseInt(editedMinutes) * 60 + parseInt(editedSeconds)
    setTime(newTime)
    setIsEditing(false)
  }

  if (!isClient) {
    return null // or a loading spinner
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-400 to-cyan-500">
      <div className="w-full max-w-md p-6 bg-white rounded-3xl shadow-2xl flex flex-col h-screen justify-between">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-4">Pomodoro Timer</h1>
        <div className="relative w-48 h-48 mx-auto mb-4">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200 stroke-current"
              strokeWidth="10"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
            ></circle>
            <motion.circle
              className="text-emerald-500 stroke-current"
              strokeWidth="10"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 - time / (25 * 60) }}
              transition={{ duration: 1, ease: "linear" }}
            ></motion.circle>
          </svg>
          <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full">
            {isEditing ? (
              <div className="flex items-center">
                <input
                  type="number"
                  className="w-12 px-1 py-0.5 text-xl font-bold text-center text-gray-800 bg-gray-100 border-2 border-emerald-500 rounded-lg"
                  value={editedMinutes}
                  onChange={(e) => setEditedMinutes(e.target.value)}
                  min="0"
                  max="59"
                />
                <span className="mx-0.5 text-xl font-bold text-gray-800">:</span>
                <input
                  type="number"
                  className="w-12 px-1 py-0.5 text-xl font-bold text-center text-gray-800 bg-gray-100 border-2 border-emerald-500 rounded-lg"
                  value={editedSeconds}
                  onChange={(e) => setEditedSeconds(e.target.value)}
                  min="0"
                  max="59"
                />
              </div>
            ) : (
              <span className="text-4xl font-bold text-gray-800">{formatTime(time)}</span>
            )}
          </div>
        </div>
        <div className="flex justify-center space-x-4 mb-4">
          <button
            className="p-2 text-white bg-emerald-500 rounded-full hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            onClick={toggleTimer}
          >
            {isActive ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            className="p-2 text-emerald-500 bg-white border-2 border-emerald-500 rounded-full hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            onClick={resetTimer}
          >
            <RotateCcw size={20} />
          </button>
          {isEditing ? (
            <button
              className="p-2 text-emerald-500 bg-white border-2 border-emerald-500 rounded-full hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              onClick={handleSaveTime}
            >
              Save
            </button>
          ) : (
            <button
              className="p-2 text-emerald-500 bg-white border-2 border-emerald-500 rounded-full hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              onClick={handleEditTime}
            >
              <Edit2 size={20} />
            </button>
          )}
        </div>
        <input
          type="text"
          placeholder="What are you working on?"
          className="w-full px-3 py-2 mb-4 text-sm text-gray-700 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-emerald-500"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <div className="text-center text-gray-600 mb-2">
          <p className="text-sm font-semibold">Sessions completed: {sessions}</p>
        </div>
        <div className="text-center text-gray-600 italic">
          <p className="text-xs">{randomQuote}</p>
        </div>
      </div>
    </div>
  )
}