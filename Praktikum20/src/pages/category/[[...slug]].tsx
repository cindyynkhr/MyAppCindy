import { useRouter } from 'next/router';

const CategoryPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div>
      <h1>Category Page</h1>
      <ul>
        {slug
          ? Array.isArray(slug)
            ? slug.map((item, idx) => <li key={idx}>{item}</li>)
            : <li>{slug}</li>
          : <li>No parameter</li>}
      </ul>
    </div>
  );
};

export default CategoryPage;