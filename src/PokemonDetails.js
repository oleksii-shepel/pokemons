import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchPokemonAsync, selectPokemonDetailsSlice } from './features/pokemonDetails/pokemonDetails-slice';

function PokemonDetails() {
    let location = useLocation();
    let pokemonName = location.pathname.substring(1);

    const dispatch = useDispatch();
    const details = useSelector(selectPokemonDetailsSlice);   
    
    useEffect(() => {
        dispatch(fetchPokemonAsync(pokemonName));

    }, [dispatch, pokemonName]);

    if(details.status === "loading" || details.status === "idle") return;
    
    let moves = details.pokemon.moves.map(move => move.move?.name).join(", ");
    let stats = details.pokemon.stats.map(stat => `${stat.stat?.name}(${stat.base_stat})`).join(", ");
    
    return (
        <div className="container">
             <h1>{details.pokemon.name}<img src={details.pokemon.sprites.front_default} alt={details.pokemon.name}></img></h1>
             <b>Moves:</b><br/>
             <p>{moves}</p>
             <b>Stats:</b><br/>
             <p>{stats}</p>
        </div>
    );
}

export default PokemonDetails;