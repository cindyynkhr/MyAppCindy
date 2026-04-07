import { useRouter } from 'next/router';

export default function BlogSlug() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div>
      <h1>Blog Detail</h1>
      <p>Slug: {slug}</p>
    </div>
  );
}
