"use client"
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { io, Socket } from "socket.io-client"

type Employee = {
  id: string
  name: string
  email: string
  lastPunchStatus?: 'PUNCH_IN' | 'PUNCH_OUT'
}

export default function PunchInOutSystem() {
  const [email, setEmail] = useState('')
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [punchStatus, setPunchStatus] = useState<'PUNCH_IN' | 'PUNCH_OUT'>('PUNCH_OUT')
  const [isLoading, setIsLoading] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)


  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000", {
      path: "/api/socket.io", 
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket server")
      setSocket(socketInstance)
    })

    socketInstance.on("connect_error", (err) => {
      console.error("Connection error:", err)
      toast.warning("Realtime updates temporarily unavailable")
    })

    return () => {
      if (socketInstance.connected) {
        socketInstance.disconnect()
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter a valid email')
      return
    }
    setIsLoading(true)
  }


  useEffect(() => {
    if (!isLoading || !email) return

    const abortController = new AbortController()

    const verifyEmployee = async () => {
      try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/attendance/verify`, 
          { email },
          { signal: abortController.signal }
        )

        setEmployee(data)
        setPunchStatus(data.lastPunchStatus || 'PUNCH_OUT')
        toast.success('Employee verified')
      } catch (error) {
        if (!axios.isCancel(error)) {
          toast.error('Verification failed', {
            description: axios.isAxiosError(error) 
              ? error.response?.data?.message || 'Employee not found'
              : 'Network error'
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    verifyEmployee()

    return () => abortController.abort()
  }, [isLoading, email])

  const handlePunch = () => {
    if (!employee) return
    setIsLoading(true)
    setPunchStatus(prev => prev === 'PUNCH_IN' ? 'PUNCH_OUT' : 'PUNCH_IN')
  }


  useEffect(() => {
    if (!isLoading || !employee || !punchStatus || !socket) return

    const abortController = new AbortController()

    const updatePunchStatus = async () => {
      try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/attendance/punch`, 
          { 
            email: employee.email,
            status: punchStatus 
          },
          { signal: abortController.signal }
        )

        socket.emit("attendance:punch", data)
        
        toast.success(`Successfully punched ${punchStatus === 'PUNCH_IN' ? 'IN' : 'OUT'}`)
      } catch (error) {
        if (!axios.isCancel(error)) {

          setPunchStatus(prev => prev === 'PUNCH_IN' ? 'PUNCH_OUT' : 'PUNCH_IN')
          toast.error('Punch failed', {
            description: axios.isAxiosError(error) 
              ? error.response?.data?.message || 'Failed to update punch status'
              : 'Network error'
          })
        }
      } finally {
        setIsLoading(false)
        setEmployee(null)
        setEmail('')
      }
    }

    updatePunchStatus()



    return () => abortController.abort()
  }, [punchStatus, employee, isLoading, socket])

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col gap-8 p-4">
      <h1 className="text-2xl font-bold">PUNCH IN / PUNCH OUT</h1>
      
      {!employee ? (
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="email"
            placeholder="Enter your company email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !email.trim()}
          >
            {isLoading ? "Verifying..." : "Submit"}
          </Button>
        </form>
      ) : (
        <EmployeeCard 
          employee={employee} 
          punchStatus={punchStatus}
          onPunch={handlePunch}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}

const EmployeeCard = ({ 
  employee, 
  punchStatus, 
  onPunch, 
  isLoading 
}: {
  employee: Employee
  punchStatus: 'PUNCH_IN' | 'PUNCH_OUT'
  onPunch: () => void
  isLoading: boolean
}) => {
  const initials = employee.name.split(' ').map(n => n[0]).join('').toUpperCase()
  
  return (
    <Card className="flex justify-center items-center flex-col w-auto h-auto gap-10 p-10">
      <CardHeader className="flex justify-center items-center w-full ">
        <div className="w-20 h-20 rounded-full bg-neutral-700 flex justify-center items-center text-4xl font-bold text-neutral-300">
          {initials}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 border-t-2 border-b-2 py-4 flex justify-center items-center flex-col">
        <h2 className="text-2xl font-semibold">{employee.name}</h2>
        <p className="text-neutral-400 text-sm">{employee.email}</p>
        <p className={`text-sm font-medium ${
          punchStatus === 'PUNCH_IN' ? 'text-green-500' : 'text-red-500'
        }`}>
          {punchStatus === 'PUNCH_IN' ? 'Currently PUNCHED IN 🟢' : 'Currently PUNCHED OUT 🔴'}
        </p>
      </CardContent>
      <CardFooter className="flex justify-center pt-4">
        <Button 
          onClick={onPunch}
          disabled={isLoading}
          variant={punchStatus === 'PUNCH_IN' ? 'destructive' : 'default'}
          className="w-full max-w-xs"
        >
          {isLoading ? 'Processing...' : `PUNCH ${punchStatus === 'PUNCH_IN' ? 'OUT' : 'IN'}`}
        </Button>
      </CardFooter>
    </Card>
  )
}