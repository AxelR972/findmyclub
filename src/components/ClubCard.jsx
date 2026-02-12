import { Link } from "react-router-dom";

function ClubCard({ club }) {
  return (
    <Link to={`/club/${club.id}`} className="block">
      <div className="min-w-[180px] bg-dark-800 rounded-2xl shadow-lg p-3 border border-dark-700 
              md:flex-row md:items-start md:min-w-0 
              flex flex-col gap-3 hover:shadow-2xl hover:border-accent-600 transition-all cursor-pointer">
        {/* Image placeholder avec gradient indigo */}
        <div className="w-full h-24 rounded-xl bg-gradient-to-br from-accent-600 to-primary-600
                md:w-24 md:h-24 md:flex-shrink-0" />

        {/* Contenu texte */}
        <div className="flex flex-1 flex-col justify-center gap-1">
          {/* Nom du club */}
          <h3 className="text-md font-medium truncate max-w-[150px] md:max-w-none md:whitespace-normal text-gray-50">{club.name}</h3>

          {/* Distance */}
          <p className="text-xs text-gray-400">{club.distance ?? "–"} km</p>
        </div>
      </div>
    </Link>
  );
}

export default ClubCard;
