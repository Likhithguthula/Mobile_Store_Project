import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="app-layout">
      <Toast />
      <Navbar />
      <main className="app-main-content">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
