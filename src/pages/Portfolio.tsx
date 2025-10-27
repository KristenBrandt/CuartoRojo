import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import projects from '@/data/projects.json';
import weddingImage from '@/assets/wedding-hero.jpg';
import corporateImage from '@/assets/corporate-hero.jpg';
import foodImage from '@/assets/food-hero.jpg';
import { projectsService } from '@/services/api';

type PublicProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  date: string;       // ISO
  category: string;   // already mapped to name in service
};

const Portfolio = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [featuredProjects, setFeatured] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  
  const categories = [
    { id: 'all', label: 'Todos los proyectos' },
    { id: 'weddings', label: 'Weddings' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'activations', label: 'Activations' },
    { id: 'food-styling', label: 'Food Styling' },
    { id: 'festivals', label: 'Festivals' }
  ];

  const filteredProjects = selectedFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedFilter);

  const getProjectImage = (projectId: string) => {
    switch (projectId) {
      case "1": return weddingImage;
      case "2": return corporateImage;
      case "3": return foodImage;
      default: return weddingImage;
    }
  };

    useEffect(() => {
      let mounted = true;
      (async () => {
        try {
          setLoading(true);
          const data = await projectsService.getFeatured();
          if (!mounted) return;
          setFeatured(data);
        } catch (e: any) {
          if (!mounted) return;
          setErr(e?.message || 'Error al cargar proyectos');
        } finally {
          if (mounted) setLoading(false);
        }
      })();
      return () => { mounted = false; };
    }, []);
  

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-serif mb-6">
              Nuestro Portafolio
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Explora nuestra colección de eventos memorables y producciones cinematográficas que 
              reflejan nuestra experiencia en diversas industrias y ocasiones
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Navigation */}
      <section className="py-8 bg-white border-b border-border sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedFilter === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(category.id)}
                className="transition-all duration-300"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatePresence>
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <Link to={`/portfolio/${project.slug}`}>
                    <Card className="group overflow-hidden hover:shadow-cinematic transition-all duration-500 h-full">
                      <div className="relative overflow-hidden">
                        <img 
                          src={getProjectImage(project.id)}
                          alt={project.title}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-primary text-white">
                            {project.category.replace('-', ' ')}
                          </Badge>
                        </div>

                        {/* Featured Badge */}
                        {project.featured && (
                          <div className="absolute top-4 right-4">
                            <Badge variant="secondary" className="bg-white text-black">
                              Featured
                            </Badge>
                          </div>
                        )}

                        {/* Hover Overlay Content */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="text-white text-center p-4">
                            <p className="text-sm mb-2">View Case Study</p>
                            <div className="flex flex-wrap justify-center gap-1">
                              {project.services.slice(0, 2).map((service, idx) => (
                                <span key={idx} className="text-xs bg-white/20 px-2 py-1 rounded">
                                  {service}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <span>{project.location}</span>
                          </div>
                          <span>{new Date(project.date).getFullYear()}</span>
                        </div>

                        {/* Services Tags */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {project.services.slice(0, 3).map((service, idx) => (
                            <span 
                              key={idx} 
                              className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* No Results */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <h3 className="text-2xl font-semibold mb-4">No projects found</h3>
              <p className="text-muted-foreground mb-8">
                We don't have any projects in this category yet, but we're always working on new content.
              </p>
              <Button onClick={() => setSelectedFilter('all')}>
                Ver todos nuestros proyectos
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Events Produced" },
              { number: "50+", label: "Happy Clients" },
              { number: "10+", label: "Years Experience" },
              { number: "100%", label: "Client Satisfaction" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;