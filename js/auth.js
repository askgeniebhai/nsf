"use strict";

const AuthService = (() => {
    const login = (role, username, password) => {
        const errorEl = document.getElementById('error-message');
        const btnEl = document.getElementById('btn-submit');

        const showError = (msg) => {
            if (errorEl) {
                errorEl.textContent = msg;
                errorEl.style.display = 'block';
            } else {
                alert(msg);
            }
            if (btnEl) {
                btnEl.disabled = false;
                btnEl.textContent = 'Sign In';
            }
        };

        if (errorEl) errorEl.style.display = 'none';
        if (btnEl) {
            btnEl.disabled = true;
            btnEl.textContent = 'Authenticating...';
        }

        // Simulate network delay for UX
        setTimeout(() => {
            if (!role || !username || !password) {
                showError("All fields are required.");
                return;
            }

            // Mock authentication validation
            let valid = false;
            if (role === 'admin' && username === 'admin' && password === 'admin') {
                valid = true;
            } else if (role === 'guard' && username === 'NFS-9921' && password === 'password') {
                valid = true;
            } else if (role === 'supervisor' || role === 'client') {
                if (password === 'password' || password === 'admin') {
                   valid = true;
                }
            }

            if (!valid) {
                showError("Invalid credentials.");
                return;
            }


        const user = {
            id: username,
            role: role,
            name: username === 'NFS-9921' ? 'John Smith' : 'Authorized User',
            loggedInAt: new Date().toISOString()
        };

        localStorage.setItem('nsf_user', JSON.stringify(user));

        // Redirection based on role
        switch(role) {
            case 'guard':
                window.location.href = 'guard/dashboard.html';
                break;
            case 'supervisor':
                window.location.href = 'supervisor/dashboard.html';
                break;
            case 'admin':
                window.location.href = 'admin/dashboard.html';
                break;
            case 'client':
                window.location.href = 'client/dashboard.html';
                break;
            default:
                window.location.href = 'index.html';
        }
        }, 500); // 500ms mock delay
    };

    const logout = () => {
        // Clear all authentication artifacts
        localStorage.removeItem('nsf_user');

        // Remove tracking states or duty flags based on current user
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('nsf_active_duty_') || key.startsWith('nsf_live_location_'))) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));

        window.location.href = '../login.html';
    };

    const getCurrentUser = () => {
        try {
            const data = localStorage.getItem('nsf_user');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("Invalid session data");
            localStorage.removeItem('nsf_user');
            return null;
        }
    };

    const checkAuth = (requiredRole) => {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = '../login.html';
            return null;
        }

        // Check session timeout (24 hours)
        const loggedInAt = new Date(user.loggedInAt);
        const now = new Date();
        const diffHours = (now - loggedInAt) / (1000 * 60 * 60);
        if (diffHours > 24) {
            logout();
            return null;
        }

        if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
            window.location.href = '../login.html';
            return null;
        }
        return user;
    };

    return { login, logout, getCurrentUser, checkAuth };
})();

if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const role = document.getElementById('role').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        AuthService.login(role, username, password);
    });
}
