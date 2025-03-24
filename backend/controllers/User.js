export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Không trả về password
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving user data", error });
    }
};
