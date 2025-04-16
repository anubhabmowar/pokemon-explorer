import React, { useState, useEffect } from 'react';
import './App.css'; // You can create a separate CSS file for styling

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100'); // Adjust limit as needed
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const detailsResponse = await fetch(pokemon.url);
            if (!detailsResponse.ok) {
              throw new Error(`HTTP error! status: ${detailsResponse.status}`);
            }
            return await detailsResponse.json();
          })
        );

        setPokemonData(pokemonDetails);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredPokemon = pokemonData.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-pokemon">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1200px-International_Pok%C3%A9mon_logo.svg.png" alt="Pokemon logo" />
        </div>
        <div className="loading-text">
          <p style={{ fontFamily: 'Comic Sans MS', fontSize: '1.5rem', color: '#666' }}>Loading Pokemon data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="app-container">
      <h1>Pokemon Explorer</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Pokemon..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="pokemon-list">
        {filteredPokemon.map((pokemon) => (
          <div key={pokemon.id} className="pokemon-card">
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <h3>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
            <p>ID: {pokemon.id}</p>
            <p>Types: {pokemon.types.map((type) => type.type.name).join(', ')}</p>
            {/* You can add more details here */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;