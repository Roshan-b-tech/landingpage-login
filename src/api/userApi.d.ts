interface UserData {
    _id?: string;
    fullName: string;
    email: string;
    profilePicture: string;
    password?: string;
}

declare const userApi: {
    login: (email: string, password: string) => Promise<UserData>;
    register: (userData: { fullName: string; email: string; password: string }) => Promise<UserData>;
    updateProfile: (userId: string, data: Partial<UserData>) => Promise<UserData>;
};

export default userApi; 