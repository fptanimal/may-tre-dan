import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/api/firebaseClient';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { getTierByOrders } from '../lib/membership';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const AuthUserContext = createContext(null);

export function AuthUserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (targetEmail, targetName = '') => {
        if (!targetEmail) return;
        const defaultProfile = {
            id: 'usr_' + Date.now(),
            user_email: targetEmail,
            full_name: targetName || targetEmail.split('@')[0],
            total_orders: 1,
            total_spent: 250000,
            heritage_points: 50,
            membership_tier: getTierByOrders(1),
        };
        setUserProfile(defaultProfile);
        try {
            const q = query(collection(db, "users"), where("user_email", "==", targetEmail));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const docSnap = querySnapshot.docs[0];
                setUserProfile({ id: docSnap.id, ...docSnap.data() });
            }
        } catch (err) {
            console.warn("Using fallback local user profile:", err);
        }
    };

    const loginUser = async (userData) => {
        if (!userData || !userData.email) return;
        setUser(userData);
        const defaultProfile = {
            id: 'usr_' + Date.now(),
            user_email: userData.email,
            full_name: userData.full_name || userData.email.split('@')[0],
            total_orders: 1,
            total_spent: 250000,
            heritage_points: 50,
            membership_tier: getTierByOrders(1),
        };
        setUserProfile(defaultProfile);
        if (typeof window !== 'undefined') {
            try { window.localStorage.setItem('custom_user', JSON.stringify(userData)); } catch (e) {}
        }
        try { Cookies.set('custom_user', JSON.stringify(userData), { expires: 30 }); } catch (e) {}
        await fetchProfile(userData.email, userData.full_name || '');
    };

    const loadUser = async () => {
        setLoading(true);
        try {
            let customUserCookie = null;
            if (typeof window !== 'undefined') {
                try { customUserCookie = window.localStorage.getItem('custom_user'); } catch (e) {}
            }
            if (!customUserCookie) {
                try { customUserCookie = Cookies.get('custom_user'); } catch (e) {}
            }

            const googleToken = Cookies.get('google_session');

            if (googleToken) {
                let decoded = null;
                try {
                    decoded = jwtDecode(googleToken);
                } catch (e) {
                    Cookies.remove('google_session');
                }

                if (decoded) {
                    const gUser = { 
                        id: decoded.id || decoded.sub,
                        email: decoded.email, 
                        full_name: decoded.name,
                        avatar: decoded.picture, 
                        isGoogle: true 
                    };
                    setUser(gUser);
                    await fetchProfile(decoded.email, decoded.name);
                    setLoading(false);
                    return;
                }
            }

            if (customUserCookie) {
                try {
                    const parsed = typeof customUserCookie === 'string' ? JSON.parse(customUserCookie) : customUserCookie;
                    if (parsed && parsed.email) {
                        setUser(parsed);
                        await fetchProfile(parsed.email, parsed.full_name || '');
                        setLoading(false);
                        return;
                    }
                } catch (e) {
                    Cookies.remove('custom_user');
                }
            }
        } catch (err) {
            console.error("Auth check failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadUser(); }, []);

    const logout = async () => {
        if (typeof window !== 'undefined') {
            try {
                window.localStorage.removeItem('base44_access_token');
                window.localStorage.removeItem('token');
                window.localStorage.removeItem('custom_user');
            } catch (e) {}
        }
        try {
            Cookies.remove('google_session');
            Cookies.remove('custom_user');
        } catch (e) {}
        setUser(null);
        setUserProfile(null);
    };

    const refreshProfile = async (email) => {
        const targetEmail = email || user?.email;
        if (!targetEmail) return;
        await fetchProfile(targetEmail, user?.full_name || '');
    };

    return (
        <AuthUserContext.Provider value={{ user, userProfile, loading, logout, refreshProfile, loadUser, loginUser }}>
            {children}
        </AuthUserContext.Provider>
    );
}

export const useAuthUser = () => useContext(AuthUserContext);