export function SearchBar({ value, onChange }) {
  return (
    <input
      className="search"
      type="search"
      placeholder="Search for a game"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}