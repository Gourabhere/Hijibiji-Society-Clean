"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { verifyStaffPin } from '../services/supabaseDB';

export type AppRole = 'admin' | 'staff';

interface AuthContextType {
    isLoggedIn: boolean;
    role: AppRole | null;
    staffId: number | null;
    staffName: string | null;
    loading: boolean;
    loginAsStaff: (staffId: number, staffName: string, pin: string) => Promise<{ error: string | null }>;
    loginAsAdmin: (username: string, password: string) => Promise<{ error: string | null }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState<AppRole | null>(null);
    const [staffId, setStaffId] = useState<number | null>(null);
    const [staffName, setStaffName] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const loginAsStaff = async (id: number, name: string, pin: string): Promise<{ error: string | null }> => {
        setLoading(true);
        try {
            const valid = await verifyStaffPin(id, pin);
            if (!valid) {
                setLoading(false);
                return { error: 'Incorrect PIN. Try again.' };
            }
            setIsLoggedIn(true);
            setRole('staff');
            setStaffId(id);
            setStaffName(name);
            setLoading(false);
            return { error: null };
        } catch (err) {
            setLoading(false);
            return { error: 'Could not verify PIN. Check your connection.' };
        }
    };

    const loginAsAdmin = async (username: string, password: string): Promise<{ error: string | null }> => {
        setLoading(true);
        // Hardcoded admin credentials
        if (username === 'admin' && password === 'admin123') {
            setIsLoggedIn(true);
            setRole('admin');
            setStaffId(null);
            setStaffName('Admin');
            setLoading(false);
            return { error: null };
        }
        setLoading(false);
        return { error: 'Invalid admin credentials.' };
    };

    const logout = () => {
        setIsLoggedIn(false);
        setRole(null);
        setStaffId(null);
        setStaffName(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, role, staffId, staffName, loading, loginAsStaff, loginAsAdmin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
