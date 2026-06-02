import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';

const CategoryGrid = () => {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (<section className="pt-8 pb-16 md:pt-12 md:pb-20 bg-secondary/30">
      <div className="container mx-auto px-4 text-center">
        Paging Categories...
      </div>
    </section>);
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (<section className="pt-8 pb-16 md:pt-12 md:pb-20 bg-secondary/30">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          📚 Course Categories
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
          Choose Your Learning Path
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          From school boards to competitive exams, we have courses for every chemistry student
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (<motion.div key={category.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
          <Link to={`/courses/${category.slug}`}>
            <div className={`group relative overflow-hidden rounded-2xl p-4 sm:p-6 bg-gradient-to-br ${category.gradient} text-white h-full min-h-[200px] hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl`}>
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>

              <div className="relative z-10">
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="font-heading font-bold text-xl mb-2">
                  {category.name}
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {category.count || 0} Courses
                  </span>
                  <div className="flex items-center gap-1 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Explore <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>))}
      </div>
    </div>
  </section>);
};
export default CategoryGrid;
