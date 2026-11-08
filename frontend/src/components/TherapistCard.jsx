import { Link } from "react-router-dom";

export default function TherapistCard({ therapist }) {
  const { _id, userId, specialization, experience, sessionFee, rating, isVerified } =
    therapist;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {userId?.name || "Therapist"}
          </h2>
          <p className="text-sm text-gray-500">{experience} yrs experience</p>
        </div>
        {isVerified && (
          <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
            Verified
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {(specialization || []).map((s) => (
          <span
            key={s}
            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span className="font-medium">${sessionFee}</span> / session
          <span className="mx-2">·</span>
          ⭐ {rating?.toFixed(1) || "New"}
        </div>
        <Link
          to={`/therapists/${_id}`}
          className="bg-primary-600 hover:bg-primary-700 text-white text-sm px-4 py-1.5 rounded-md transition"
        >
          Book Session
        </Link>
      </div>
    </div>
  );
}
