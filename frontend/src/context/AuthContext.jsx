import { createContext, useContext, useState, useEffect } from "react"

let AuthContext = createContext()

function AuthProvider({ children }) {
  let [user, setUser] = useState(null)
  let [token, setToken] = useState(localStorage.getItem("token") || "")
  let [loading, setLoading] = useState(true)

  let API = import.meta.env.VITE_API_URL || "http://localhost:5001/api"

  useEffect(function () {
    if (token) {
      fetch(API + "/auth/me", {
        headers: { Authorization: "Bearer " + token }
      })
        .then(function (r) { return r.json() })
        .then(function (data) {
          if (data._id) setUser(data)
          else logout()
          setLoading(false)
        })
        .catch(function () {
          logout()
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  function login(t, u) {
    localStorage.setItem("token", t)
    setToken(t)
    setUser(u)
  }

  function logout() {
    localStorage.removeItem("token")
    setToken("")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, API }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  return useContext(AuthContext)
}

export { AuthProvider, useAuth }
