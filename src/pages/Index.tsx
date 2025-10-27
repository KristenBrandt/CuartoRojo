import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Layout from '@/components/Layout';
import heroImage from '@/assets/hero-bg.jpg';
import weddingImage from '@/assets/wedding-hero.jpg';
import corporateImage from '@/assets/corporate-hero.jpg';
import foodImage from '@/assets/food-hero.jpg';
// import projects from '@/data/projects.json';
import testimonials from '@/data/testimonials.json';
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



const Index = () => {
  const [reelOpen, setReelOpen] = useState(false);
  const reelUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // replace with your real reel

  const [featuredProjects, setFeaturedProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const coverFor = (p: any, index: number) =>
  p.cover_image_url ||
  p.gallery?.find((m: any) => m.type === 'image' && m.url)?.url ||
  p.gallery?.[0]?.url ||
  (index % 3 === 0 ? weddingImage : index % 3 === 1 ? corporateImage : foodImage);


  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await projectsService.getFeaturedPublished(9);
        if (!mounted) return;
        setFeaturedProjects(data);
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif mb-6"
          >
            Transformamos ideas en
            <span className="text-primary"> experiencias memorables.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-gray-200"
          >
            Logística profesional de eventos, cobertura audiovisual y servicios de postproducción 
            que dan vida a tu visión con excelencia cinematográfica.
          </motion.p>
          
         {/* 
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
              <Link to="/portfolio">
                Ver Nuestro Trabajo
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="border-white text-black hover:bg-white hover:text-black"
              onClick={() => setReelOpen(true)}
            >
              <Play className="mr-2" size={18} />
              Ver Reel
            </Button>
          </motion.div> 
          */ }
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif mb-4">¿Por qué elegir Cuarto Rojo?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Combinamos visión artística con experiencia técnica para ofrecer resultados excepcionales.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Excelencia Cinematográfica",
                description: "Valores de producción con calidad de cine y atención a cada detalle, asegurando que tu evento sea capturado con precisión artística."
              },
              {
                icon: Users,
                title: "Coordinación Perfecta", 
                description: "Gestión experta de la logística que cubre cada aspecto de tu evento, permitiéndote enfocarte en lo que realmente importa."
              },
              {
                icon: Star,
                title: "Entrega Rápida",
                description: "Tiempos de entrega ágiles sin comprometer la calidad. Recibe tu reel destacado en un máximo de 48 horas después del evento."
              }

            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center h-full hover:shadow-elegant transition-shadow duration-300">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6">
                      <item.icon className="text-white" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    
      {/* Featured Projects */}
         {/* 
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif mb-4">Proyectos Destacados</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubre cómo hemos transformado eventos en experiencias inolvidables.
            </p>
          </motion.div>

          {err && (
            <p className="text-center text-sm text-red-500 mb-8">
              No se pudieron cargar los proyectos: {err}
            </p>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse h-96 bg-muted rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link to={`/portfolio/${project.slug}`}>
                    <Card className="group overflow-hidden hover:shadow-cinematic transition-all duration-300">
                      <div className="relative overflow-hidden">
                        <img 
                          src={coverFor(project,index)}
                          alt={project.title}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-4 left-4">
                          <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                            {String(project.category || '').replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">{project.description}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{project.location}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(project.date).getFullYear()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <Button variant="outline" size="lg" asChild>
              <Link to="/portfolio">
                Ver Todos los Proyectos
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
      */}



      {/* Call to Action */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-serif mb-6">¿Listo para Crear Algo Increíble?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Hablemos de tu evento y de cómo podemos dar vida a tu visión con nuestros servicios integrales
               de producción.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">
                Obtén tu Cotización
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Reel Modal */}
      <Dialog open={reelOpen} onOpenChange={setReelOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Reel</DialogTitle>
            <DialogDescription>Disfruta una muestra de nuestro trabajo.</DialogDescription>
          </DialogHeader>
          <div className="relative w-full aspect-video rounded-md overflow-hidden">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={reelUrl}
              title="Cuarto Rojo Reel"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Index;
