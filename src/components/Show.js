export default function Show({ when, fallback = null, children }) {
  return when ? children : fallback;
}