import { createContext, useContext, useState, useEffect } from 'react'
import api from '../hooks/useApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)   // { _id, name, email, avatar, ... }
  const [role,    setRole]    = useState(null)   // 'student' | 'admin'
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    const token    = localStorage.getItem('placeiq_token')
    const savedRole = localStorage.getItem('placeiq_role')
    const savedUser = localStorage.getItem('placeiq_user')
    if (token && savedRole && savedUser) {
      setRole(savedRole)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password, loginRole) => {
    const { data } = await api.post('/auth/login', { email, password, role: loginRole })
    localStorage.setItem('placeiq_token',  data.token)
    localStorage.setItem('placeiq_role',   data.role)
    localStorage.setItem('placeiq_user',   JSON.stringify(data.user))
    setUser(data.user)
    setRole(data.role)
    return data
  }

  const register = async (formData, regRole) => {
    const endpoint = regRole === 'admin' ? '/auth/register/admin' : '/auth/register/student'
    const { data } = await api.post(endpoint, formData)
    localStorage.setItem('placeiq_token',  data.token)
    localStorage.setItem('placeiq_role',   data.role)
    localStorage.setItem('placeiq_user',   JSON.stringify(data.user))
    setUser(data.user)
    setRole(data.role)
    return data
  }

  const logout = () => {
    localStorage.removeItem('placeiq_token')
    localStorage.removeItem('placeiq_role')
    localStorage.removeItem('placeiq_user')
    setUser(null)
    setRole(null)
  }

  const updateUser = (updated) => {
    const merged = { ...user, ...updated }
    setUser(merged)
    localStorage.setItem('placeiq_user', JSON.stringify(merged))
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
