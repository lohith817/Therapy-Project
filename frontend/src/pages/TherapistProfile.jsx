import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../services/api";
import { bookAppointment } from "../redux/appointmentSlice";

export default function TherapistProfile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [therapist, setTherapist] = useState(null);
  const [step, setStep] = useState(1); // 1: choose date/time, 2: confirm, 3: done
  const [form, setForm] = useState({ appointmentDate: "", startTime: "", duration: 45 });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/therapists/${id}`).then((res) => setTherapist(res.data.therapist));
  }, [id]);

  const handleConfirm = async () => {
    setSubmitting(true);
    setError("");
    const result = await dispatch(
      bookAppointment({
        therapistId: therapist.userId._id,
        appointmentDate: form.appointmentDate,
        startTime: form.startTime,
        duration: form.duration,
      })
    );
    setSubmitting(false);
    if (bookAppointment.fulfilled.match(result)) {
      setStep(3);
    } else {
      setError(result.payload || "Booking failed");
    }
  };

  if (!therapist) {
    return <div className="max-w-3xl mx-auto px-4 py-10 text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-semibold text-gray-800">{therapist.userId?.name}</h1>
        <p className="text-gray-500 mt-1">{therapist.qualification} · {therapist.experience} yrs experience</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {(therapist.specialization || []).map((s) => (
            <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{s}</span>
          ))}
        </div>

        {therapist.bio && <p className="text-sm text-gray-600 mt-4">{therapist.bio}</p>}

        <div className="mt-4 text-sm text-gray-700">
          <span className="font-medium">${therapist.sessionFee}</span> / session
          <span className="mx-2">·</span>
          ⭐ {therapist.rating?.toFixed(1) || "New"}
        </div>

        <hr className="my-6" />

        {/* Booking Workflow: Select Therapist -> Choose Date/Time -> Confirm -> Appointment Created */}
        {step === 1 && (
          <div>
            <h2 className="font-semibold text-gray-800 mb-3">Book a Session</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-gray-600">Date</label>
                <input
                  type="date"
                  value={form.appointmentDate}
                  onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Start Time</label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Duration (min)</label>
                <select
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value={30}>30</option>
                  <option value={45}>45</option>
                  <option value={60}>60</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!form.appointmentDate || !form.startTime}
              className="mt-5 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-md text-sm font-medium transition disabled:opacity-50"
            >
              Continue to Confirm
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-semibold text-gray-800 mb-3">Confirm Session</h2>
            <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-700 space-y-1">
              <p><span className="font-medium">Therapist:</span> {therapist.userId?.name}</p>
              <p><span className="font-medium">Date:</span> {form.appointmentDate}</p>
              <p><span className="font-medium">Time:</span> {form.startTime}</p>
              <p><span className="font-medium">Duration:</span> {form.duration} minutes</p>
              <p><span className="font-medium">Fee:</span> ${therapist.sessionFee} (payment optional / handled offline for demo)</p>
            </div>
            {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-700"
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-md text-sm font-medium transition disabled:opacity-60"
              >
                {submitting ? "Booking..." : "Confirm Appointment"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-6">
            <p className="text-lg font-semibold text-gray-800 mb-2">Appointment Confirmed 🎉</p>
            <p className="text-sm text-gray-600 mb-5">
              Your session has been booked. You can view the meeting link and manage it from your dashboard.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-md text-sm font-medium transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
