const Search = ({ onChange }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search Recipe"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default Search;
