import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Mental wellness support, whenever you need it.
        </h1>
        <p className="text-gray-600 mb-8">
          Connect with licensed therapists through secure video sessions, private
          chat, and evidence-based assessments — all in one platform.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/therapists"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Find a Therapist
          </Link>
          <Link
            to="/register"
            className="border border-primary-600 text-primary-700 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
        {[
          { title: "Video Sessions", desc: "HD, encrypted video consultations powered by Twilio & WebRTC." },
          { title: "Private Chat", desc: "Real-time messaging with your therapist via Socket.io." },
          { title: "Track Progress", desc: "Assessments and session history to monitor your journey." },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
            <p className="text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
