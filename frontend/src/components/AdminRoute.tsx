import React, {JSX} from "react";
import { Navigate } from "react-router-dom";
import { getUserRole } from "../utils/jwt";

interface Props {
    children: JSX.Element;
}

const AdminRoute = ({ children }: Props) => {
    const role = getUserRole();

    if (role !== "ROLE_ADMIN") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;