import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTherapists } from "../redux/therapistSlice";
import TherapistCard from "../components/TherapistCard";

const SPECIALIZATIONS = [
  "Depression",
  "Anxiety",
  "Relationship Counseling",
  "Trauma Therapy",
  "Child Counseling",
  "Career Counseling",
];

export default function TherapistList() {
  const dispatch = useDispatch();
  const { list, isLoading, error } = useSelector((state) => state.therapists);
  const [filters, setFilters] = useState({ specialization: "", language: "" });

  useEffect(() => {
    dispatch(fetchTherapists(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = (e) => {
    e.preventDefault();
    dispatch(fetchTherapists(filters));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Find a Therapist</h1>
      <p className="text-gray-500 mb-6">Search by specialization, language, rating, or fee.</p>

      <form onSubmit={applyFilters} className="flex flex-wrap gap-3 mb-8">
        <select
          value={filters.specialization}
          onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">All Specializations</option>
          {SPECIALIZATIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          placeholder="Language (e.g. English)"
          value={filters.language}
          onChange={(e) => setFilters({ ...filters, language: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
        >
          Search
        </button>
      </form>

      {isLoading && <p className="text-gray-500">Loading therapists...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {!isLoading && list.length === 0 && (
        <p className="text-gray-500">No therapists found. Try adjusting your filters.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((t) => (
          <TherapistCard key={t._id} therapist={t} />
        ))}
      </div>
    </div>
  );
}
