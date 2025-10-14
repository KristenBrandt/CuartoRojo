import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Camera, Film, ArrowRight } from 'lucide-react';
import services from '@/data/services.json';

const Services = () => {
  const serviceIcons = { Calendar, Camera, Film };

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
              Marketing, Fotografía, Producción Audiovisual, Creatividad & Diseño y
              Montaje de Eventos Corporativos y Sociales. Integramos estrategia y
              producción para que tus proyectos trasciendan.
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
              Desde la estrategia y la creatividad hasta la cobertura y el montaje,
              nos encargamos de cada fase con estándares de calidad profesional.
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

                      <h4 className="font-semibold mb-4">Incluye:</h4>
                      <ul className="space-y-2 mb-8">
                        {service.deliverables.map((deliverable, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{deliverable}</span>
                          </li>
                        ))}
                      </ul>

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
              <h2 className="text-4xl font-serif mb-6">Enfoque 360°</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Planificación, producción y entrega con un solo equipo. Coordinamos
                logística, cobertura y piezas finales para que el resultado sea
                consistente y puntual.
              </p>

              <div className="space-y-6">
                {[
                  { title: "Preproducción", description: "Brief, objetivos, estrategia, guion/shotlist y plan logístico." },
                  { title: "Producción", description: "Foto, video, audio e iluminación con operación profesional." },
                  { title: "Postproducción", description: "Edición, color, audio y formatos listos para tus canales." }
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
                <h3 className="text-2xl font-serif mb-6">¿Listos para crear algo grande?</h3>
                <p className="mb-8 opacity-90">
                  Conversemos y armemos un paquete a medida según tus metas y presupuesto.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center"><div className="w-3 h-3 bg-white rounded-full mr-3" /><span>Diagnóstico y propuesta sin costo</span></div>
                  <div className="flex items-center"><div className="w-3 h-3 bg-white rounded-full mr-3" /><span>Plan y cronograma claros</span></div>
                  <div className="flex items-center"><div className="w-3 h-3 bg-white rounded-full mr-3" /><span>Entrega puntual</span></div>
                </div>

                <Button variant="secondary" size="lg" asChild className="w-full">
                  <Link to="/contact">
                    Obtén tu cotización
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
              Sumamos valor con servicios específicos según las necesidades del proyecto.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Food Styling", description: "Dirección y estilismo de alimentos para campañas y producto." },
              { title: "Live Streaming", description: "Transmisión multi-plataforma con respaldo y monitoreo." },
              { title: "Cobertura Aérea (Dron)", description: "Tomas aéreas según permisos y condiciones." },
              { title: "Contenido Social", description: "Piezas en tiempo real optimizadas para redes." }
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1 }}>
                <Card className="text-center h-full hover:shadow-elegant transition-shadow duration-300">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
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
