import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyAppointments } from "../redux/appointmentSlice";
import { useAuth } from "../hooks/useAuth";

const statusColor = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { list, isLoading } = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(fetchMyAppointments());
  }, [dispatch]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-1">
        Welcome, {user?.name?.split(" ")[0]}
      </h1>
      <p className="text-gray-500 mb-8 capitalize">{user?.role} dashboard</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link to="/assessment" className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <p className="font-semibold text-gray-800">Take Assessment</p>
          <p className="text-sm text-gray-500 mt-1">Track your stress, anxiety & mood</p>
        </Link>
        <Link to="/therapists" className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <p className="font-semibold text-gray-800">Book a Session</p>
          <p className="text-sm text-gray-500 mt-1">Browse verified therapists</p>
        </Link>
        <Link to="/resources" className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <p className="font-semibold text-gray-800">Resource Library</p>
          <p className="text-sm text-gray-500 mt-1">Articles, videos & wellness tips</p>
        </Link>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Appointments</h2>
      {isLoading && <p className="text-gray-500">Loading...</p>}
      {!isLoading && list.length === 0 && (
        <p className="text-gray-500">No appointments yet.</p>
      )}

      <div className="space-y-3">
        {list.map((appt) => (
          <div
            key={appt._id}
            className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center justify-between flex-wrap gap-3"
          >
            <div>
              <p className="font-medium text-gray-800">
                {user?.role === "therapist" ? appt.clientId?.name : appt.therapistId?.name}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(appt.appointmentDate).toLocaleDateString()} at {appt.startTime} · {appt.duration} min
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[appt.sessionStatus]}`}>
                {appt.sessionStatus}
              </span>
              {appt.videoLink && (
                <a
                  href={appt.videoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary-600 font-medium hover:underline"
                >
                  Join Video
                </a>
              )}
              <Link
                to={`/chat/${user?.role === "therapist" ? appt.clientId?._id : appt.therapistId?._id}`}
                className="text-sm text-primary-600 font-medium hover:underline"
              >
                Chat
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
