import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import team from '@/data/team.json';

const About = () => {
  const workProcess = [
    {
      step: "01",
      title: "Descubrimiento y Planificación",
      description: "Nos sumergimos en tu visión, entendiendo cada detalle para diseñar la estrategia perfecta para tu evento."
    },
    {
      step: "02", 
      title: "Logística y Coordinación",
      description: "Nuestro equipo gestiona la coordinación con proveedores, el manejo de tiempos y la preparación técnica."
    },
    {
      step: "03",
      title: "Ejecución y Cobertura",
      description: "Capturamos profesionalmente cada momento con una coordinación impecable el día del evento."
    },
    {
      step: "04",
      title: "Postproducción y Entrega",
      description: "Edición experta y entrega rápida de tus materiales finales dentro de los plazos acordados."
    }

  ];

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
              Acerca de Cuarto Rojo
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Somos narradores apasionados, expertos técnicos y maestros de la logística, 
              dedicados a transformar tus eventos en experiencias cinematográficas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-serif mb-6">Nuestra Misión</h2>
              <p className="text-lg text-muted-foreground mb-6">
                En Cuarto Rojo creemos que cada evento cuenta una historia que merece ser preservada.
                Nuestra misión es capturar la esencia, la emoción y la energía de tus momentos especiales 
                a través de producciones audiovisuales cuidadosamente elaboradas.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Combinamos la visión artística con la excelencia técnica, asegurando que cada proyecto 
                reciba la atención al detalle que merece. Desde reuniones íntimas hasta
                producciones a gran escala, aportamos el mismo nivel de pasión y profesionalismo a cada uno de ellos.
              </p>
              
              <div className="space-y-4">
                {[
                  "Estándares de producción con calidad cinematográfica",
                  "Logística integral de eventos",
                  "Postproducción rápida y eficiente",
                  "Experiencia personalizada para cada cliente"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center"
                  >
                    <CheckCircle className="text-primary mr-3" size={20} />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-hero rounded-2xl p-8 text-white">
                <div className="h-full flex flex-col justify-center">
                  <h3 className="text-3xl font-serif mb-4">Creciendo con Cada Evento</h3>
                  <p className="text-lg opacity-90 mb-6">
                    Construyendo una reputación de excelencia, un proyecto a la vez.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">100%</div>
                      <div className="text-sm opacity-80">Compromiso con el Cliente</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">∞</div>
                      <div className="text-sm opacity-80">Posibilidades Creativas</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif mb-4">Cómo Trabajamos</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nuestro proceso comprobado de 4 pasos garantiza una ejecución impecable, desde el concepto hasta la entrega.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workProcess.map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-white font-bold text-xl">{process.step}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{process.title}</h3>
                    <p className="text-muted-foreground">{process.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif mb-4">Conoce a Nuestro Equipo</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Las mentes creativas y los expertos técnicos detrás de cada proyecto exitoso
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center overflow-hidden group">
                  <div className="relative">
                    <div className="w-full h-64 bg-gradient-hero flex items-center justify-center">
                      <span className="text-white text-6xl font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <p className="text-primary font-medium mb-4">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
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

export default About;