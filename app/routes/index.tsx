import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Cure8</h1>
      <Link to="/privacy">Privacy Policy</Link>
    </div>
  );
}
