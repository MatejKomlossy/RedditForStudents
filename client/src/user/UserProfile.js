const UserProfile = (() => {
    const getUsername = () => {
        return localStorage.getItem('username')
    };

    const setUsername = (name) => {
        localStorage.setItem('username', name)
    };

    const isUserLoggedIn = () => {
        return !!(getUsername());
    }

    return {
        getUsername: getUsername,
        setUsername: setUsername,
        isUserLoggedIn: isUserLoggedIn
    }
})();

export default UserProfile;