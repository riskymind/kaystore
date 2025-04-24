import ProductList from "@/components/shared/product/product-list";
import { getLatestProudcts } from "@/lib/actions/product.actions";


export default async function HomePage() {  
  const latestProducts = await getLatestProudcts()
  return (
    <div>
      <ProductList data={latestProducts} title="New Arrival"/>
    </div>
  );
}
