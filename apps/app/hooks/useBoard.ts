import { useEffect, useState } from 'react'

export function useBoard(projectId: string) {
  const [board, setBoard] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const res = await fetch(`/api/projects/${projectId}/full`)
        if (!res.ok) throw new Error('Failed to load board')
        const data = await res.json()
        if (mounted) setBoard(data)
      } catch (err: any) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [projectId])

  return { board, setBoard, loading, error }
}
