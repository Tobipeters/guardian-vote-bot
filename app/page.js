'use client'
import { useEffect, useState } from 'react'

export default function Home () {
  const [message, setMessage] = useState('')
  const [voteCount, setVoteCount] = useState(0) // Track the number of times it has voted

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
        setVoteCount(prevCount => prevCount + 1) // Increment the vote count on success
      }
    } catch (error) {
      setMessage('Error submitting vote.')
    }
  }

  useEffect(() => {
    // Automatically submit a vote every 1 minute (60000 ms)
    const intervalId = setInterval(() => {
      submitVote()
    }, 20000)

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Automated Voting System</h1>
      <p className='text-lg mb-2'>Voting for Emmanuel every minute...</p>
      <p className='text-lg mb-2'>
        Votes submitted: <strong>{voteCount}</strong>
      </p>
      {message && <p className='text-sm text-green-600 mt-4'>{message}</p>}
    </div>
  )
}
