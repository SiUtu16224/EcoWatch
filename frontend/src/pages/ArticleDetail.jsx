import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetch(`http://localhost/ekowatch/backend/api/articles_detail.php?id=${id}`)
      .then((res) => res.json())
      .then(setArticle);
  }, [id]);

  if (!article) return null;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <img src={article.image} className="rounded-2xl mb-6" />
      <h1 className="text-4xl font-bold text-green-900 mb-4">
        {article.title}
      </h1>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  );
}
