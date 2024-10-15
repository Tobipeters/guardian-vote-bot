'use client'
import { useEffect, useState } from 'react'

export default function Home () {
  const [message, setMessage] = useState('')
  const [voteCount, setVoteCount] = useState(() => {
    // Initialize the vote count from localStorage, or set to 0 if not found
    const savedCount = localStorage.getItem('voteCount')
    return savedCount ? parseInt(savedCount, 10) : 0
  })

  const submitVote = async () => {
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      setMessage(data.message)

      if (data.success) {
        // Increment the vote count on success and update localStorage
        setVoteCount(prevCount => {
          const newCount = prevCount + 1
          localStorage.setItem('voteCount', newCount) // Save the updated count in localStorage
          return newCount
        })
      }
    } catch (error) {
      setMessage('Error submitting vote.')
    }
  }

  useEffect(() => {
    // Automatically submit a vote every 10 minutes (600,000ms)
    const intervalId = setInterval(() => {
      submitVote()
    }, 600000)

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    // Load the vote count from localStorage when the component mounts
    const savedCount = localStorage.getItem('voteCount')
    if (savedCount) {
      setVoteCount(parseInt(savedCount, 10))
    }
  }, [])

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Automated Voting System</h1>
      <p className='text-lg mb-2'>Voting for Ray...</p>
      <p className='text-lg mb-2'>
        Votes submitted: <strong>{voteCount}</strong>
      </p>
      {message && <p className='text-sm text-green-600 mt-4'>{message}</p>}
    </div>
  )
}
