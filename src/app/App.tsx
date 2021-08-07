import ROUTES from "./routes";
import { RouterOutlet } from "./utils/routes";

function App() {

  return (
    <RouterOutlet path={''} routes={ROUTES} />
  );
}

export default App;
