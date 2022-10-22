import { configureStore } from '@reduxjs/toolkit';
import paginationReducer from '../features/pagination/pagination-slice';
import mainListReducer from '../features/mainList/mainList-slice';
import pokemonDetailsReducer from '../features/pokemonDetails/pokemonDetails-slice'
;
export const store = configureStore({
  reducer: {
    details: pokemonDetailsReducer,
    pagination: paginationReducer,
    mainList: mainListReducer
  },
});
