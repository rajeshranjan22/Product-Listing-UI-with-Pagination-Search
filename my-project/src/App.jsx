import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://fakestoreapi.com/products');
      const res = await response.json();
      setData(res);
      setFiltered(res);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const searchTerm = search.toLowerCase();
      const filteredProducts = data.filter((product) =>
        product.title.toLowerCase().includes(searchTerm)
      );
      setFiltered(filteredProducts);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, data]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-4">
      <h1 className='text-3xl font-bold mb-6 text-center'>Product List</h1>

      <div className="max-w-md mx-auto mb-6 flex flex-row gap-4">
        <input
          className="w-full px-4 py-2 border rounded shadow"
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 border rounded shadow"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value={5}>5 items per page</option>
          <option value={10}>10 items per page</option>
          <option value={20}>20 items per page</option>
        </select>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4">
        {paginatedItems.map((ele) => (
          <li className="border p-4 shadow rounded" key={ele.id}>
            <img
              className="w-full h-48 object-contain mb-4"
              src={ele.image}
              alt={ele.title}
            />
            <h2 className="font-semibold text-lg mb-2">{ele.title}</h2>
            <p className="text-gray-500 mb-1">Category: {ele.category}</p>
            <p className="font-bold text-xl">${ele.price}</p>
          </li>
        ))}
      </ul>

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="font-semibold">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
