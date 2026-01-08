import { useNavigate } from "react-router-dom";
import { Logo } from "./Logo";

export const Home = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/login");
    };

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ffffff",
                cursor: "pointer",
            }}
            onClick={handleClick}
        >
            <Logo />
        </div>
    );
};
