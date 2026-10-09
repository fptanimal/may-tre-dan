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
        try {
            const q = query(collection(db, "users"), where("user_email", "==", targetEmail));
            const querySnapshot = await getDocs(q);
            let profile = null;
            
            if (!querySnapshot.empty) {
                const docSnap = querySnapshot.docs[0];
                profile = { id: docSnap.id, ...docSnap.data() };
            } else {
                // Create new profile if not found
                const newProfile = {
                    user_email: targetEmail,
                    full_name: targetName,
                    total_orders: 0,
                    total_spent: 0,
                    heritage_points: 0,
                    membership_tier: getTierByOrders(0),
                };
                const docRef = await addDoc(collection(db, "users"), newProfile);
                profile = { id: docRef.id, ...newProfile };
            }
            
            setUserProfile(profile);
        } catch (err) {
            console.error("Failed to load/create user profile:", err);
        }
    };

    const loadUser = async () => {
        setLoading(true);
        try {
            const googleToken = Cookies.get('google_session');
            const customUserCookie = Cookies.get('custom_user');

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
                    const parsed = JSON.parse(customUserCookie);
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
            setUser(null);
            setUserProfile(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadUser(); }, []);

    const logout = async () => {
        // Remove local storage tokens manually to avoid SDK redirecting to /api/apps/auth/logout
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('base44_access_token');
            window.localStorage.removeItem('token');
        }
        Cookies.remove('google_session');
        Cookies.remove('custom_user');
        setUser(null);
        setUserProfile(null);
    };

    const refreshProfile = async (email) => {
        const targetEmail = email || user?.email;
        if (!targetEmail) return;
        await fetchProfile(targetEmail, user?.full_name || '');
    };

    return (
        <AuthUserContext.Provider value={{ user, userProfile, loading, logout, refreshProfile, loadUser }}>
            {children}
        </AuthUserContext.Provider>
    );
}

export const useAuthUser = () => useContext(AuthUserContext);