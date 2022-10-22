import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentPage: 1,
    startPage: 1,
    numberOfPages: 0,
    numberPerPage: 20,
    numberOfEntities: 0,
    numberOfVisiblePages: 0,
    maxPaginationItems: 10,
};

export const paginationSlice = createSlice({
    name: 'pagination',
    initialState,
    reducers: {
        setNumberOfEntities: (state, action) => {
            if(state.numberOfEntities !== action.payload) {
                state.currentPage = 1;
                state.startPage = 1;
                state.numberOfEntities = action.payload; 
                state.numberOfPages = Math.ceil(state.numberOfEntities / state.numberPerPage);
                state.numberOfVisiblePages = Math.min(state.numberOfPages, state.maxPaginationItems);    
            } 
        },
        
        setNumberPerPage: (state, action) => {
            if(state.numberPerPage !== action.payload) {
                state.currentPage = 1;
                state.startPage = 1;
                state.numberPerPage = action.payload;
                state.numberOfPages = Math.ceil(state.numberOfEntities / state.numberPerPage);
                state.numberOfVisiblePages = Math.min(state.numberOfPages, state.maxPaginationItems);    
            }
        },

        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },

        nextPage: (state) => {
            state.startPage = (state.currentPage === state.startPage + state.numberOfVisiblePages - 1 ? state.startPage + 1 : state.startPage);
            state.currentPage = state.currentPage + 1;
        },

        previousPage: (state) => {
            state.startPage = (state.currentPage > state.startPage ? state.startPage : state.startPage - 1);
            state.currentPage = state.currentPage - 1;
        },

        firstPage: (state) => {
            state.currentPage = 1;
            state.startPage = 1;
        },

        lastPage: (state) => {
            state.currentPage = state.numberOfPages;
            state.startPage = state.numberOfPages - state.numberOfVisiblePages + 1;
        },
    }
});

export const { setNumberOfEntities, setNumberPerPage, setCurrentPage, nextPage, previousPage, firstPage, lastPage } = paginationSlice.actions;

export const selectPaginationSlice = (state) => state.pagination;

export default paginationSlice.reducer;