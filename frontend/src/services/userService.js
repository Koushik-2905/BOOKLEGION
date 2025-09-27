import api from "./api";

export const getUsers = () => api.get("/users/");
export const createUser = (data) => api.post("/users/", data);
