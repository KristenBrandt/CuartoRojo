import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you within 24 hours.",
    });

    setIsSubmitting(false);
    
    // Reset form
    const form = e.target as HTMLFormElement;
    form.reset();
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
              Creemos Juntos
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
            ¿Listo para hacer realidad la visión de tu evento? Contáctanos para una consulta gratuita
              y una cotización personalizada adaptada a tus necesidades.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* 
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-3xl font-serif mb-6">Obtén tu Cotización</h2>
                    <p className="text-muted-foreground mb-8">
                      Completa el formulario a continuación y te responderemos con una cotización personalizada 
                      en un plazo de 24 horas.
                    </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nombre Completo *</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          required 
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Correo Electrónico *</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          required 
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Número de Teléfono</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          type="tel" 
                          placeholder="+52 55 1234 5678"
                        />
                      </div>
                      <div>
                        <Label htmlFor="eventDate">Fecha del Evento</Label>
                        <Input 
                          id="eventDate" 
                          name="eventDate" 
                          type="date"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="venue">Lugar/Ciudad</Label>
                        <Input 
                          id="venue" 
                          name="venue" 
                          placeholder="Ciudad de México"
                        />
                      </div>
                      <div>
                        <Label htmlFor="serviceType">Tipo de Servicio *</Label>
                        <Select name="serviceType" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un servicio" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-package">Paquete Completo de Evento</SelectItem>
                            <SelectItem value="logistics">Solo Logística de Evento</SelectItem>
                            <SelectItem value="coverage">Solo Cobertura Audiovisual</SelectItem>
                            <SelectItem value="post-production">Solo Postproducción</SelectItem>
                            <SelectItem value="food-styling">Estilismo Gastronómico</SelectItem>
                            <SelectItem value="other">Otro</SelectItem>
                          </SelectContent>
                        </Select>

                      </div>
                    </div>

                    <div>
                      <Label htmlFor="budgetRange">Rango de Presupuesto</Label>
                      <Select name="budgetRange">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un rango de presupuesto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-50k">Menos de Q20,000 GTQ</SelectItem>
                          <SelectItem value="50k-100k">$20,000 - $70,000 GTQ</SelectItem>
                          <SelectItem value="100k-250k">$100,000 - $250,000 GTQ</SelectItem>
                          <SelectItem value="250k-500k">$250,000 - $500,000 GTQ</SelectItem>
                          <SelectItem value="over-500k">Más de $500,000 GTQ</SelectItem>
                          <SelectItem value="discuss">Prefiero hablarlo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message">Cuéntanos sobre tu evento *</Label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        required
                        placeholder="Describe la visión de tu evento, requisitos y cualquier necesidad específica..."
                        rows={5}
                      />
                    </div>


                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              */}
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Contact Details */}
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-serif mb-6">Contáctanos</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <Phone className="text-primary mr-4 mt-1" size={20} />
                      <div>
                        <h4 className="font-semibold mb-1">Teléfono</h4>
                        <p className="text-muted-foreground">+502 5663 2686</p>
                        <p className="text-sm text-muted-foreground">Lunes-Viernes, 7am-7pm</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Mail className="text-primary mr-4 mt-1" size={20} />
                      <div>
                        <h4 className="font-semibold mb-1">Correo Electrónico</h4>
                        <p className="text-muted-foreground">ventas@4torojo.com</p>
                        <p className="text-sm text-muted-foreground">Respondemos en un plazo de 24 horas</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="text-primary mr-4 mt-1" size={20} />
                      <div>
                        <h4 className="font-semibold mb-1">Ubicación</h4>
                        <p className="text-muted-foreground">Ciudad de Guatemala</p>
                        <p className="text-sm text-muted-foreground">Atendemos en toda Centroamérica</p>
                      </div>

                    <div className="flex items-start">
                      <MessageSquare className="text-primary mr-4 mt-1" size={20} />
                      <div>
                        <h4 className="font-semibold mb-1">WhatsApp</h4>
                        <a 
                          href="https://wa.me/50256632686" 
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          +502 5663 2686
                        </a>
                        <p className="text-sm text-muted-foreground">Respuestas Rápidas</p>
                      </div>
                    </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

           {/* Redes Sociales */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-serif mb-6">Sigue Nuestro Trabajo</h3>
                <p className="text-muted-foreground mb-6">
                  Descubre nuestros últimos proyectos y contenido detrás de cámaras en redes sociales.
                </p>
                
                <div className="flex space-x-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.instagram.com/cuartorojogt?igsh=a2p5MHM3YnlicnVz" target="_blank" rel="noopener noreferrer">
                      Instagram
                    </a>
                  </Button>
                  {/*
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://facebook.com/cuartorojo" target="_blank" rel="noopener noreferrer">
                      Facebook
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://vimeo.com/cuartorojo" target="_blank" rel="noopener noreferrer">
                      Vimeo
                    </a>
                  </Button>
                  */}
                </div>
              </CardContent>
            </Card>

            {/* Preguntas Frecuentes */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-serif mb-6">Preguntas Frecuentes</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">¿Con cuánta anticipación debo reservar?</h4>
                    <p className="text-sm text-muted-foreground">
                      Para mayor disponibilidad, recomendamos reservar con 2 semanas de anticipación, 
                      especialmente en temporada alta.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">¿Viajan fuera de Guatemala?</h4>
                    <p className="text-sm text-muted-foreground">
                      ¡Sí! Ofrecemos servicios en toda Guatemala y podemos organizar 
                      cobertura internacional para eventos de destino.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">¿Qué incluyen sus paquetes?</h4>
                    <p className="text-sm text-muted-foreground">
                      Cada paquete se personaliza según tus necesidades. Ofrecemos desde cobertura básica 
                      hasta producción integral de eventos.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Contacto de Emergencia */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-serif mb-4">¿Necesitas Asistencia Inmediata?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Para consultas urgentes o reservaciones de último minuto, contáctanos directamente 
              por WhatsApp para una respuesta más rápida.
            </p>
            <Button size="lg" asChild className="bg-green-600 hover:bg-green-700">
              <a 
                href="https://wa.me/50256632686?text=¡Hola! Necesito asistencia urgente con un evento." 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <MessageSquare className="mr-2" size={20} />
                Escríbenos por WhatsApp
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

    </Layout>
  );
};

export default Contact;