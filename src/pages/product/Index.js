import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../style/Product.css'; // Import product styles
import { API_BASE_URL } from '../../config'; // Import baseUrl from config


const ProductIndex = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();
  const APP_URL = API_BASE_URL;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${APP_URL}products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to fetch products',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch products',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, productName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${productName}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
  const APP_URL = API_BASE_URL;
        const response = await fetch(`${APP_URL}products/${id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          setProducts(products.filter(product => product.id !== id));
          Swal.fire({
            title: 'Deleted!',
            text: 'Product has been deleted successfully.',
            icon: 'success'
          });
        } else {
          const errorData = await response.json();
          Swal.fire({
            title: 'Error',
            text: errorData.message || 'Failed to delete product',
            icon: 'error'
          });
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to delete product',
          icon: 'error'
        });
      }
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortedAndFilteredProducts = () => {
    let filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredProducts.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>Loading products...</h2>
        </div>
      </div>
    );
  }

  const sortedAndFilteredProducts = getSortedAndFilteredProducts();

  return (
    <div className="product-container" >
      <div className="product-form" style={{ padding: '30px' }}>
        <div className="product-header">
          <h2>Product Management</h2>
          <Link to="/products/add" className="btn btn-primary">
            Add New Product
          </Link>
        </div>

        <div className="product-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ marginBottom: '0' }}
            />
          </div>
          <div className="product-count">
            Total Products: {sortedAndFilteredProducts.length}
          </div>
        </div>

        {sortedAndFilteredProducts.length === 0 ? (
          <div className="no-products">
            <p>No products found.</p>
            <Link to="/products/add" className="btn btn-primary">
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="product-table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} className="sortable">
                    Name {getSortIcon('name')}
                  </th>
                  <th onClick={() => handleSort('title')} className="sortable">
                    Title {getSortIcon('title')}
                  </th>
                  <th onClick={() => handleSort('description')} className="sortable">
                    Description {getSortIcon('description')}
                  </th>
                  <th onClick={() => handleSort('price')} className="sortable">
                    Price {getSortIcon('price')}
                  </th>
                  <th onClick={() => handleSort('available_quantity')} className="sortable">
                    Stock {getSortIcon('available_quantity')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedAndFilteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="product-name">{product.name}</td>
                    <td className="product-title">{product.title}</td>
                    <td className="product-description">
                      {product.description.length > 50 
                        ? `${product.description.substring(0, 50)}...` 
                        : product.description
                      }
                    </td>
                    <td className="product-price">
                      ${parseFloat(product.price).toFixed(2)}
                    </td>
                    <td className="product-stock">
                      <span className={`stock-badge ${product.available_quantity > 10 ? 'in-stock' : product.available_quantity > 0 ? 'low-stock' : 'out-of-stock'}`}>
                        {product.available_quantity}
                      </span>
                    </td>
                    <td className="product-actions">
                      <Link 
                        to={`/products/edit/${product.id}`} 
                        className="btn btn-sm btn-secondary"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id, product.name)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductIndex;