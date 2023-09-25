import { createContext, useReducer } from "react";
export const Store = createContext();
const initialState = {
    userInfo: sessionStorage.getItem("userInfo")
        ? JSON.parse(sessionStorage.getItem("userInfo"))
        : null,
    seasonID: sessionStorage.getItem("seasonID")
        ? parseInt(sessionStorage.getItem("seasonID"))
        : parseInt(import.meta.env.VITE_CURRENT_SEASON_ID),
    seasons: sessionStorage.getItem("seasons")
        ? JSON.parse(sessionStorage.getItem("seasons"))
        :null,
    levels: sessionStorage.getItem("levels")
        ? JSON.parse(sessionStorage.getItem("levels"))
        :null,
};

function reducer(state, action) {
    switch (action.type) {
        case "USER_SIGNIN":
            return { ...state, userInfo: action.payload };
        case "GET_SEASONS":
            return { ...state, seasons:action.payload};
        case "SET_SEASON_ID":
            return { ...state, seasonID:action.payload};
        case "GET_LEVELS":
            return { ...state, levels:action.payload};
        case "USER_SIGNOUT":
            return {
                ...state,
                userInfo: null,
                seasons: null,
                levels: null,
                seasonID: parseInt(import.meta.env.VITE_CURRENT_SEASON_ID),
            };
        default:
            return state;
    }
}
export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };
    return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
