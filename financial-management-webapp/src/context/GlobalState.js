import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';
// Initial State
const initialState = {
    transactions: []
}

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    // Actions
    const deleteTransaction = async (id) => {
        try {
            // Make a DELETE request to the backend
            await axios.delete(`http://localhost:3000/transactions/${id}`);
    
            // If successful, update the state by dispatching the DELETE_TRANSACTION action
            dispatch({
                type: 'DELETE_TRANSACTION',
                payload: id
            });
        } catch (err) {
            console.error('Error deleting transaction:', err);
        }
    };
    

    const getTransactions = async () => {
        try {
            const userId = localStorage.getItem('currentUser'); // Retrieve the current user ID

            const response = await axios.get(`http://localhost:3000/transactions?user=${userId}`);
            dispatch({
                type: 'SET_TRANSACTIONS',
                payload: response.data // Assuming your backend returns an array of transactions
            });
        } catch (err) {
            console.error('Error fetching transactions:', err);
        }
    };


    const addTransaction = async (transaction) => {
        try {
            const userId = localStorage.getItem('currentUser');
            
            const transactionWithUser = {
                ...transaction,
                user: userId  // Ensure the user field is included in the request
            };

            const response = await axios.post('http://localhost:3000/transactions', transactionWithUser);
            // Assuming you have some way to add this to your state
            dispatch({
                type: 'ADD_TRANSACTION',
                payload: response.data.data
            });
        } catch (err) {
            console.error(err);
        }
    };


    return (<GlobalContext.Provider value={{
        transactions:state.transactions,
        deleteTransaction,
        addTransaction,
        getTransactions
    }}>
        {children}
    </GlobalContext.Provider>)
}
