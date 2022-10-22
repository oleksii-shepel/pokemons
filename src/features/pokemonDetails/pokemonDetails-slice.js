import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';

const initialState = {
    pokemon: {},
    error: null,
    status: "idle"
};

export const fetchPokemonAsync = createAsyncThunk(
    'mainList/fetchPokemonAsync',
    async (pokemonName, thunkAPI) => {
        return await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`).then(response => response.data);
    }
);

export const pokemonDetailsSlice = createSlice({
    name: 'pokemonDetails',
    initialState,
    reducer: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPokemonAsync.pending, (state) => {
                state.status = 'loading';
                state.pokemon = {};
                state.error = null;
            })
            .addCase(fetchPokemonAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.pokemon = action.payload;
                state.error = null;
            })
            .addCase(fetchPokemonAsync.rejected, (state, action) => {
                state.status = 'rejected';
                state.pokemon = {};
                state.error = action.error;
            });
    },
});

export const selectPokemonDetailsSlice = (state) => state.details;

export default pokemonDetailsSlice.reducer;