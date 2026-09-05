const validateRegisterUser = (email, username, fullname, password) => {

    if ([email, username, fullname, password].some((field) => !field?.trim())) {
        return "All fields are required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return "Invalid email address";
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    if (!usernameRegex.test(username)) {
        return "Username must be 3-20 characters";
    }

    const fullnameRegex = /^[a-zA-Z ]{2,50}$/;

    if (!fullnameRegex.test(fullname.trim())) {
        return "Invalid full name";
    }

    if (password.length < 8) {
        return "Password must be at least 8 characters long";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

    if (!passwordRegex.test(password)) {
        return "Password must contain uppercase, lowercase and number";
    }

    return null;
};

export { validateRegisterUser };

