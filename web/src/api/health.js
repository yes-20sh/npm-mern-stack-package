import { useState } from 'react'
import API from './axios'

export const checkHealth = async () => {
  const { data } = await API.get('/health')
  return data
}

export const useHealth = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchHealth = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await checkHealth()
      setData(result)
      return result
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to connect to API'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, fetchHealth }
}
