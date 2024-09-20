import { SIGNUP_ACTION } from "@/store/storeConstants";
import { LOGIN_ACTION } from "@/store/storeConstants";

export default {
    [SIGNUP_ACTION](context, payload) {
        return new Promise((resolve, reject) => {
            const user = {
                name: payload.name,
                password: payload.password
            }
            fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            })
                .then((response) => {
                    return response.json()
                })
                .then((response) => {
                    resolve(response)
                })
        })
    },

    [LOGIN_ACTION](context, payload) {
        return new Promise((resolve, reject) => {
            const user = {
                name: payload.name,
                password: payload.password
            }
            fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            })
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    localStorage.setItem('token', data.accessToken);
                    resolve(data);
                })
        })
    }

};