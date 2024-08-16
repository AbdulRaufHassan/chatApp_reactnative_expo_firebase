import { createContext } from "react";

const myProfileContext = createContext<User | null>(null);

export default myProfileContext;
