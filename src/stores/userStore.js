import { create } from "zustand";
import { persist } from "zustand/middleware";

const userStore = create(
    persist(
        (set) => ({
            
        })
    )
)