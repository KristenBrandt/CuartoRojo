import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Camera, Film, ArrowRight } from 'lucide-react';
import services from '@/data/services.json';

const Services = () => {
  const serviceIcons = {
    Calendar,
    Camera, 
    Film
  };

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
              Nuestros Servicios
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Servicios integrales de producción de eventos que transforman tu visión en una realidad cinematográfica
               mediante logística experta, cobertura profesional y postproducción de alto nivel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif mb-4">Lo que hacemos</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Desde la planificación inicial hasta la entrega final, nos encargamos de cada aspecto de la producción de tu evento.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = serviceIcons[service.icon as keyof typeof serviceIcons];
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  id={service.id}
                >
                  <Card className="h-full group hover:shadow-cinematic transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-gradient-hero rounded-xl flex items-center justify-center mb-6">
                        {IconComponent && <IconComponent className="text-white" size={32} />}
                      </div>
                      
                      <h3 className="text-2xl font-serif mb-4 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-6">
                        {service.description}
                      </p>

                      <h4 className="font-semibold mb-4">What's Included:</h4>
                      <ul className="space-y-2 mb-8">
                        {service.deliverables.map((deliverable, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{deliverable}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Mini Gallery */}
                      {service.gallery && service.gallery.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-6">
                          {service.gallery.slice(0, 2).map((media, idx) => (
                            <div key={idx} className="aspect-video bg-muted rounded-lg overflow-hidden">
                              <div className="w-full h-full bg-gradient-hero opacity-20" />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-serif mb-6">Nuestro Enfoque Integral</h2>
              <p className="text-lg text-muted-foreground mb-8">
                No solo ofrecemos servicios individuales: creamos soluciones completas que integran de forma fluida la logística,
                 la producción y la postproducción para lograr el máximo impacto y eficiencia.
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    title: "Planificación Previa al Evento",
                    description: "Coordinación detallada con todos los involucrados, gestión del lugar y preparación técnica."
                  },
                  {
                    title: "Producción en Vivo", 
                    description: "Captura en tiempo real con múltiples ángulos de cámara, audio profesional y opciones de transmisión en vivo."
                  },
                  {
                    title: "Postproducción",
                    description: "Edición experta, corrección de color y entrega en múltiples formatos optimizados para tus necesidades."
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 bg-gradient-hero text-white">
                <h3 className="text-2xl font-serif mb-6">¿Listo para Empezar?</h3>
                <p className="mb-8 opacity-90">
                  Hablemos de tu evento y creemos un paquete de producción personalizado que haga realidad tu visión.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-white rounded-full mr-3" />
                    <span>Consulta inicial gratuita</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-white rounded-full mr-3" />
                    <span>Paquete a medida</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-white rounded-full mr-3" />
                    <span>Cronograma detallado del proyecto</span>
                  </div>
                </div>

                <Button variant="secondary" size="lg" asChild className="w-full">
                  <Link to="/contact">
                    Obtén tu Cotización
                    <ArrowRight className="ml-2" size={18} />
                  </Link>
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specialized Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif mb-4">Experiencia Especializada</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Más allá de nuestros servicios principales, ofrecemos conocimientos especializados para necesidades únicas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Food Styling",
                description: "Professional food presentation and styling for culinary events and product photography"
              },
              {
                title: "Live Streaming",
                description: "Multi-platform streaming with redundant systems for corporate events and conferences"
              },
              {
                title: "Drone Coverage",
                description: "Aerial cinematography for outdoor events and unique perspective shots"
              },
              {
                title: "Social Media",
                description: "Real-time content creation and optimization for social media platforms"
              }
            ].map((specialty, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center h-full hover:shadow-elegant transition-shadow duration-300">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">{specialty.title}</h3>
                    <p className="text-sm text-muted-foreground">{specialty.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;