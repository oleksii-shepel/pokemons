import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';

export const SortMethod = {
    SortByName: "SortByName",
    SortByType: "SortByType"
}

const initialState = {
    pokemons: [],
    types: [],
    names: [],
    sorting: SortMethod.SortByName,
    searchString: "",
    status: "idle"
};

function compareTypes(types1, types2) {
    let index = 0;
    while (index < Math.min(types1.length, types2.length)) {
        let result = String(types1[index]).localeCompare(types2[index]);
        if (result === 0) {
            index++;
        }
        else {
            return result;
        }
    }
    if (types1.length < types2.length) return -1;
    else if (types1.length > types2.length) return 1;
    else return 0;
}

export const fetchDataAsync = createAsyncThunk(
    'mainList/fetchDataAsync',
    async (sorting, thunkAPI) => {
        let pokemonCountPromise = axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=1`).then(response => response.data);
        let typesCountPromise = axios.get(`https://pokeapi.co/api/v2/type?offset=0&limit=1`).then(response => response.data);

        let values = await Promise.all([pokemonCountPromise, typesCountPromise])
        let pokemonsCount = values[0].count;
        let typesCount = values[1].count;

        let pokemonNames = axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${pokemonsCount}&offset=0`).then(response => response.data);
        let pokemonTypes = axios.get(`https://pokeapi.co/api/v2/type?limit=${typesCount}&offset=0`).then(response => response.data);

        values = await Promise.all([pokemonNames, pokemonTypes]);
        let names = values[0].results || [];
        let types = values[1].results || [];

        let pokemonsMap = new Map();
        names.forEach((item) => {
            pokemonsMap.set(item.name, { ...item, types: [] });
        });

        let promises = types.map(type => axios.get(`https://pokeapi.co/api/v2/type/${type.name}`).then(response => response.data));
        
        values = await Promise.all(promises);
        values.forEach((value) => {
            value.pokemon.forEach((item) => {
                let pokemonWithType = { ...pokemonsMap.get(item.pokemon.name) };
                pokemonWithType.types.push(value.name);
            });
        });

        let pokemons = [];
        [...pokemonsMap.keys()].map(item => {
            let itemTypes = pokemonsMap.get(item).types.sort((a, b) => String(a.name).localeCompare(b.name));

            pokemons.push({
                name: item,
                types: itemTypes,
                url: pokemonsMap.get(item).url
            });

            return item;
        });
        
        names.sort((a, b) => String(a.name).localeCompare(b.name));
        types.sort((a, b) => String(a.name).localeCompare(b.name));

        pokemons.sort((a, b) => {
            return sorting === SortMethod.SortByType ? compareTypes(a.types, b.types) : String(a.name).localeCompare(b.name);
        });

        return {
            pokemons,
            types,
            names
        };
    }
);

export const mainListSlice = createSlice({
    name: 'mainList',
    initialState,
    reducers: {
        sort: (state, action) => {
            let sorting = action.payload === true ? SortMethod.SortByType : SortMethod.SortByName;
            state.pokemons.sort((a, b) => {
                return sorting === SortMethod.SortByType ? compareTypes(a.types, b.types) : String(a.name).localeCompare(b.name);
            });
        },

        setSearchString: (state, action) => {
            state.searchString = !!action.payload ? action.payload : "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDataAsync.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchDataAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                let { pokemons, types, names } = action.payload;
                state.pokemons = pokemons;
                state.types = types;
                state.names = names;
                state.error = null;
            })
            .addCase(fetchDataAsync.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.error;
            });
    },
});

export const { sort, setSearchString } = mainListSlice.actions;

export const selectMainListSlice = (state) => state.mainList;

export default mainListSlice.reducer;