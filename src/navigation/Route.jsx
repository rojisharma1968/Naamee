import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import { useUser } from "../context/userContext";

const Route = () => {
  const { user } = useUser();
  return user ? <AppStack /> : <AuthStack />;
};

export default Route;
