import React from "react";
import { Link } from "react-router-dom"; // Fixed import
import { Trophy, Calendar, Users } from "lucide-react";
import useStore from "../stores/userStore";

function ChallengePage() {
  const { user } = useStore();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-12">
        Select Your Challenge
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* My Challenge Card */}
        <Link to="/my-challenges" className="block">
          <div className="card bg-primary text-primary-content shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
            <div className="card-body">
              <h2 className="card-title">
                <Trophy size={20} />
                My Challenge
              </h2>
              <p>View challenges that you've joined and track your progress</p>
            </div>
          </div>
        </Link>

        {/* Daily Challenge Card */}
        <Link to="/daily-challenge" className="block">
          <div className="card bg-primary text-primary-content shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
            <div className="card-body">
              <h2 className="card-title">
                <Calendar size={20} />
                Daily Challenge
              </h2>
              <p>
                Discover today's featured challenge and earn special rewards
              </p>
            </div>
          </div>
        </Link>

        {/* Public Challenge Card */}
        <Link to="/public-challenges" className="block">
          <div className="card bg-accent text-accent-content shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
            <div className="card-body">
              <h2 className="card-title">
                <Users size={20} />
                Public Challenge
              </h2>
              <p>
                Browse all available public challenges and join the community
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default ChallengePage;