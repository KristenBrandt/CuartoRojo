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
      description: "Aterrizamos tu idea y objetivos para trazar una estrategia clara desde el inicio."
    },
    {
      step: "02", 
      title: "Creatividad, Logística y Coordinación",
      description: "Unimos creatividad con coordinación técnica y proveedores para que todo fluya sin fricciones."
    },
    {
      step: "03",
      title: "Producción y Cobertura",
      description: "Damos vida al proyecto: montaje, ejecución y captura profesional en el evento."
    },
    {
      step: "04",
      title: "Postproducción y Entrega",
      description: "Edición, calidad final y entrega puntual, listos para generar impacto."
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
              Acerca de Nosotros
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Transformamos ideas en experiencias memorables. Somos una agencia creativa que combina
              marketing, fotografía, producción audiovisual y montaje de eventos para ofrecer soluciones
              integrales que conectan, comunican y generan impacto.
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
                En 4TO ROJO hacemos realidad la visión de cada cliente, llevando su proyecto desde la idea
                hasta la ejecución con calidad, estrategia y creatividad. Unimos disciplinas como marketing,
                fotografía, producción audiovisual y montaje de eventos corporativos y sociales para entregar
                resultados que trascienden.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Nuestra Visión: ser la agencia referente en Guatemala y la región por convertir ideas en
                proyectos innovadores y experiencias únicas, inspirando a las marcas a trascender al unir
                creatividad, tecnología y producción.
              </p>
              
              <div className="space-y-4">
                {[
                  "Soluciones integrales de principio a fin",
                  "Creatividad con propósito y enfoque estratégico",
                  "Ejecución profesional y calidad en cada detalle",
                  "Acompañamiento cercano para transformar la visión en resultados"
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
                  <h3 className="text-3xl font-serif mb-4">Inspirar, Producir, Trascender</h3>
                  <p className="text-lg opacity-90 mb-6">
                    Creamos campañas, contenidos y eventos que dejan huella en Guatemala y la región.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">100%</div>
                      <div className="text-sm opacity-80">Enfoque en resultados</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">∞</div>
                      <div className="text-sm opacity-80">Creatividad y producción</div>
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
              De la idea a la ejecución: un proceso claro para garantizar impacto y calidad en cada entrega.
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
     {/* <section className="py-20">
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
      */}
    </Layout>
  );
};

export default About;
