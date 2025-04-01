import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Fixed import
import { getAllChallenges, joinChallenge } from '../api/exportAllApi';

function DailyChallenge() {
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    async function fetchDailyChallenge() {
      try {
        const challenges = await getAllChallenges();
        // Assuming the API returns all challenges and we need to filter for daily ones
        const dailyOnes = challenges.filter(challenge => challenge.type === 'daily');
        // Take the most recent daily challenge
        const mostRecent = dailyOnes.length > 0 ? dailyOnes[0] : null;
        
        setDailyChallenge(mostRecent);
      } catch (err) {
        setError('Failed to load daily challenge');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDailyChallenge();
  }, []);

  const handleJoinChallenge = async () => {
    if (!dailyChallenge) return;
    
    try {
      await joinChallenge(dailyChallenge.id);
      setJoined(true);
    } catch (err) {
      setError('Failed to join the challenge');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
        {error}
      </div>
    );
  }

  if (!dailyChallenge) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">No Daily Challenge Available</h2>
        <p className="text-gray-600">Check back later for today's challenge!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Today's Challenge</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-2">{dailyChallenge.title}</h2>
          
          <div className="flex items-center mb-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
              Daily
            </span>
            <span className="text-gray-600 text-sm">
              Ends in: {/* Calculate time remaining */}
            </span>
          </div>
          
          <p className="text-gray-700 mb-4">{dailyChallenge.description}</p>
          
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h3 className="font-medium text-gray-800 mb-2">Challenge Details</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="font-medium mr-2">Category:</span>
                <span>{dailyChallenge.category?.name || 'General'}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">Difficulty:</span>
                <span className="capitalize">{dailyChallenge.difficulty || 'Medium'}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">Participants:</span>
                <span>{dailyChallenge.participantsCount || 0} users joined</span>
              </li>
            </ul>
          </div>
          
          {joined ? (
            <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
              <p className="font-medium">You've joined this challenge!</p>
              <p>Complete the challenge and submit your proof before the deadline.</p>
            </div>
          ) : (
            <button
              onClick={handleJoinChallenge}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Join Challenge
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DailyChallenge;