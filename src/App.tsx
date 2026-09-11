import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/PublicLayout";
import Home from "./pages/public/Home";
import Events from "./pages/public/Events";
import EventDetail from "./pages/public/EventDetail";

import RegisterType from "./pages/register/RegisterType";
import RegisterLayout from "./pages/register/RegisterLayout";
import PersonalStep from "./pages/register/PersonalStep";
import CollegeStep from "./pages/register/CollegeStep";
import EventsStep from "./pages/register/EventsStep";
import TeamStep from "./pages/register/TeamStep";
import PaymentStep from "./pages/register/PaymentStep";
import SuccessStep from "./pages/register/SuccessStep";

import NotFound from "./pages/public/NotFound";
import Admin from "./pages/admin/Admin";

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:slug" element={<EventDetail />} />
      </Route>

      {/* Registration flow */}
      <Route path="/register" element={<RegisterType />} />
      <Route element={<RegisterLayout />}>
        <Route path="/register/personal" element={<PersonalStep />} />
        <Route path="/register/college" element={<CollegeStep />} />
        <Route path="/register/events" element={<EventsStep />} />
        <Route path="/register/team" element={<TeamStep />} />
        <Route path="/register/payment" element={<PaymentStep />} />
      </Route>
      <Route path="/register/success" element={<SuccessStep />} />
      <Route path="/admin" element={<Admin />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
