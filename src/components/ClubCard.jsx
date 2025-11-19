
function ClubCard({ club }) {
  return (
    <div className="min-w-[180px] bg-white rounded-2xl shadow p-3 flex flex-col gap-3 border border-gray-100">

      {/* Image placeholder avec gradient bleu */}
      <div className="w-full h-24 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400" />

      {/* Nom du club */}
      <h3 className="text-sm font-medium">{club.name}</h3>

      {/* Distance */}
      <p className="text-xs text-gray-500">{club.distance ?? "–"} km</p>
    </div>
  );
}

export default ClubCard;
