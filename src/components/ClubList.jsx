import ClubCard from "./ClubCard";

function ClubList({ clubs }) {
  return (
    <div className="flex flex-col gap-3">
      {clubs.map((club) => (
        <ClubCard key={club.id} club={club} />
      ))}
    </div>
  );
}

export default ClubList;
