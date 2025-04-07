'use client'
import { useEffect, useState } from 'react'

export default function Home () {
  const [message, setMessage] = useState('')
  const [voteCount, setVoteCount] = useState(0)
  const [isVoting, setIsVoting] = useState(false)

  // submit vote
  const submitVote = async () => {
    // Prevent duplicate requests
    if (isVoting) return

    setIsVoting(true)
    // call the vote api
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      setMessage(data.message)

      // store new vote count
      if (data.success) {
        setVoteCount(prevCount => {
          const newCount = prevCount + 1
          localStorage.setItem('voteCount', newCount)
          return newCount
        })
      }
    } catch (error) {
      setMessage('Error submitting vote.')
    } finally {
      setIsVoting(false)
    }
  }

  useEffect(() => {
    const savedCount = localStorage.getItem('voteCount')
    if (savedCount) {
      setVoteCount(parseInt(savedCount, 10))
    }

    const intervalId = setInterval(() => {
      submitVote()
    }, 30000) // try ti vote every 30s

    return () => clearInterval(intervalId)
  }, [])


  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Team GUARDIAN</h1>
      <p className='text-lg mb-2'>
        Votes submitted: <strong>{voteCount}</strong>
      </p>
      {message && <p className='text-sm text-green-600 mt-4'>{message}</p>}
    </div>
  )
}
