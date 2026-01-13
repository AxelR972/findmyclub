import { render, screen } from "@testing-library/react";
import ClubCard from "./ClubCard";
import { MemoryRouter } from "react-router-dom";

describe("ClubCard", () => { //describe pour grouper les tests liés au composant ClubCard
  it("affiche le nom du club", () => { // it pour définir un test individuel 
    const club = { name: "Padel Club", distance: 2 };

    render( //MemoryRouter car le composant utilise des liens de react-router et en test on doit simuler le routeur
        <MemoryRouter> 
            <ClubCard club={club} />
        </MemoryRouter>
    );

    expect(screen.getByText("Padel Club")).toBeInTheDocument(); // on vérifie que le nom du club est bien affiché
  });

  it("affiche la distance du club", () => {
    const club = { name: "Padel Club", distance: 2 };

    render(
        <MemoryRouter>
            <ClubCard club={club} />
        </MemoryRouter>
    );

    expect(screen.getByText("2 km")).toBeInTheDocument();
  });
});
