
function ClubCard({ club }) {
  return (
    <div className="min-w-[180px] bg-white rounded-2xl shadow p-3 border border-gray-100 
            md:flex-row md:items-start md:min-w-0 
            flex flex-col gap-3">

      {/* Image placeholder avec gradient bleu */}
      <div className="w-full h-24 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400
              md:w-24 md:h-24 md:flex-shrink-0" />

      {/* Contenu texte */}
      <div className="flex flex-1 flex-col justify-center gap-1">
      {/* Nom du club */}
      <h3 className="text-sm font-medium">{club.name}</h3>
      
      {/* Distance */}
      <p className="text-xs text-gray-500">{club.distance ?? "–"} km</p>
      </div>
    </div>
    );
}

export default ClubCard;
