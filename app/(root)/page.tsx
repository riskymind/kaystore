import ProductList from "@/components/shared/product/product-list";
import sampleData from "@/db/sample-data";


export default function HomePage() {  
  return (
    <div>
      <ProductList data={sampleData.products} title="New Arrival" limit={4}/>
    </div>
  );
}
