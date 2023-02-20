import { createContext, useReducer } from "react";
export const Store = createContext();
const initialState = {
    userInfo: sessionStorage.getItem("userInfo")
        ? JSON.parse(sessionStorage.getItem("userInfo"))
        : null,
};

function reducer(state, action) {
    switch (action.type) {
        case "USER_SIGNIN":
            return { ...state, userInfo: action.payload };
        case "USER_SIGNOUT":
            return {
                ...state,
                userInfo: null,
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
