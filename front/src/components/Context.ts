import React from "react";
import { User } from "../utils/types";
export const CurrentUserContext = React.createContext<User | null>(null);