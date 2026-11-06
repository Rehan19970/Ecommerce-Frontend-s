import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const RecommendedProducts = ({ productId, type = 'similar' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        let url = '';
        let heading = '';

        if (type === 'similar') {
          url = `/recommendations/similar/${productId}`;
          heading = 'Similar Products';
        } else if (type === 'also-bought') {
          url = `/recommendations/also-bought/${productId}`;
          heading = 'Customers Also Bought';
        } else if (type === 'bought-together') {
          url = `/recommendations/bought-together/${productId}`;
          heading = 'Frequently Bought Together';
        } else if (type === 'trending') {
          url = '/recommendations/trending';
          heading = 'Trending Now';
        } else if (type === 'new-arrivals') {
          url = '/recommendations/new-arrivals';
          heading = 'New Arrivals';
        }

        const { data } = await api.get(url);
        setProducts(data);
        setTitle(heading);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (productId || type === 'trending' || type === 'new-arrivals') {
      fetchRecommendations();
    }
  }, [productId, type]);

  if (loading || products.length === 0) return null;

  return (
    <section className="container-brand section-padding" data-aos="fade-up">
      <div className="text-center mb-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
          Recommended
        </p>
        <h2 className="font-heading text-2xl md:text-4xl mb-3">{title}</h2>
        <div className="w-16 h-px bg-brand-gold mx-auto"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 4).map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            className="group block"
          >
            <div className="aspect-[3/4] overflow-hidden bg-brand-lightgrey mb-3">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-brand-gold transition">
              {product.name}
            </h3>
            <p className="font-bold text-base">
              Rs.{' '}
              {(product.discountPrice > 0
                ? product.discountPrice
                : product.price
              ).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecommendedProducts;