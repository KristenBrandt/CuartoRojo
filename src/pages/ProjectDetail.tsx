import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { projectsService } from '@/services/api';

// Public detail DTO for the page
type PublicProjectDetail = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  location?: string;
  date?: string | null; // ISO
  category_name: string;
  featured: boolean;
  cover_url?: string | null;
  services: string[];
  client?: string;
  gallery: { url: string; type: 'image' | 'video'; alt_text?: string }[];
  results: string[];
  deliverables: string[];
  embed_reel?: string | null;
};

// map AdminProject -> PublicProjectDetail
const toPublicDetail = (p: any): PublicProjectDetail => {
  const cover =
    p.cover_image_url ||
    (Array.isArray(p.gallery) && p.gallery.length > 0 ? p.gallery[0]?.url : null);

  const gallery = (p.gallery ?? []).map((g: any) => ({
    url: g.url,
    type: g.type,
    alt_text: g.alt_text || '',
  }));

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.short_description || '',
    content: p.full_description || '',
    location: p.location || '',
    date: p.event_date || p.date || null,
    category_name: p.category || 'Sin categoría',
    featured: !!p.is_featured,
    cover_url: cover,
    services: Array.isArray(p.tags) ? p.tags : Array.isArray(p.services) ? p.services : [],
    client: p.client_name || '',
    gallery,
    results: Array.isArray(p.results) ? p.results : [],
    deliverables: Array.isArray(p.deliverables) ? p.deliverables : [],
    embed_reel: p.embed_reel || null,
  };
};

const fmtDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('es-GT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const [project, setProject] = useState<PublicProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        if (!slug) throw new Error('Slug inválido');

        const data = await projectsService.getBySlugPublished(slug);
        if (!alive) return;

        if (!data) {
          setProject(null);
        } else {
          setProject(toPublicDetail(data));
        }
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? 'Error al cargar el proyecto');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-2xl font-semibold">Cargando proyecto…</h1>
        </div>
      </Layout>
    );
  }

  if (err || !project) {
    return (
      <Layout>
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Proyecto no encontrado</h1>
          <p className="text-muted-foreground mb-8">
            {err ?? 'El proyecto que buscas no existe o no está publicado.'}
          </p>
          <Button asChild>
            <Link to="/portfolio">Volver al portafolio</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Back Navigation */}
      <div className="pt-24 pb-4">
        <div className="container mx-auto px-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/portfolio">
              <ArrowLeft className="mr-2" size={16} />
              Volver al portafolio
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative rounded-2xl overflow-hidden mb-8">
              <img
                src={project.cover_url || '/placeholder.webp'}
                alt={project.title}
                className="w-full h-[60vh] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-overlay" />
              <div className="absolute bottom-8 left-8 text-white max-w-3xl pr-8">
                <Badge className="bg-primary text-white mb-4">{project.category_name}</Badge>
                <h1 className="text-4xl md:text-5xl font-serif mb-4">{project.title}</h1>
                {project.description && (
                  <p className="text-lg md:text-xl opacity-90">{project.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Details */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Content / Case Study */}
              {(project.content || project.description) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-serif mb-6">Caso de estudio</h2>
                  <div className="prose prose-neutral max-w-none">
                    <p className="text-lg text-muted-foreground whitespace-pre-wrap">
                      {project.content || project.description}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Gallery */}
              {project.gallery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-serif mb-6">Galería</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.gallery.map((media, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden group">
                        {media.type === 'video' ? (
                          <video
                            className="w-full h-full object-cover aspect-video"
                            src={media.url}
                            playsInline
                            controls
                          />
                        ) : (
                          <img
                            className="w-full h-full object-cover aspect-video"
                            src={media.url}
                            alt={media.alt_text || `Imagen ${index + 1}`}
                            loading="lazy"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Results */}
              {project.results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-serif mb-6">Resultados</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.results.map((result, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-3 h-3 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span>{result}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Embedded Reel */}
              {project.embed_reel && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-serif mb-6">Reel del proyecto</h2>
                  <div className="aspect-video rounded-lg overflow-hidden bg-black/5">
                    {/* If it's an embeddable URL (YouTube/Vimeo), you can iframe it; otherwise link out */}
                    {project.embed_reel.includes('youtube') || project.embed_reel.includes('vimeo') ? (
                      <iframe
                        src={project.embed_reel}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Reel"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-center p-8">
                        <div>
                          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <ExternalLink className="text-white" size={24} />
                          </div>
                          <p className="text-muted-foreground">Ver el video externo</p>
                          <Button asChild variant="outline" size="sm" className="mt-4">
                            <a href={project.embed_reel} target="_blank" rel="noreferrer">
                              Abrir video
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Facts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-6">Detalles del proyecto</h3>

                    <div className="space-y-4">
                      {project.client && (
                        <div className="flex items-center">
                          <Users className="text-primary mr-3" size={20} />
                          <div>
                            <div className="font-medium">Cliente</div>
                            <div className="text-muted-foreground text-sm">{project.client}</div>
                          </div>
                        </div>
                      )}

                      {project.location && (
                        <div className="flex items-center">
                          <MapPin className="text-primary mr-3" size={20} />
                          <div>
                            <div className="font-medium">Ubicación</div>
                            <div className="text-muted-foreground text-sm">{project.location}</div>
                          </div>
                        </div>
                      )}

                      {project.date && (
                        <div className="flex items-center">
                          <Calendar className="text-primary mr-3" size={20} />
                          <div>
                            <div className="font-medium">Fecha</div>
                            <div className="text-muted-foreground text-sm">{fmtDate(project.date)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Services Provided */}
              {project.services.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-6">Servicios</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.services.map((service, index) => (
                          <Badge key={index} variant="secondary">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Deliverables */}
              {project.deliverables.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-6">Entregables</h3>
                      <ul className="space-y-2">
                        {project.deliverables.map((deliv, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-sm">{deliv}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="bg-gradient-hero text-white">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold mb-4">¿Te gustó este proyecto?</h3>
                    <p className="mb-6 opacity-90">Creamos algo increíble para tu próximo evento.</p>
                    <Button variant="secondary" size="lg" asChild className="w-full">
                      <Link to="/contact">Empezar mi proyecto</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectDetail;