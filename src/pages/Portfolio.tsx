import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { projectsService } from '@/services/api';
import { categoriesService } from '@/services/api';

// Types for public grid
type PublicCategory = {
  id: string;
  slug: string;
  name: string;
  is_active: boolean;
};

type PublicProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  location?: string;
  date?: string; // ISO
  category_slug: string;
  category_name: string;
  services: string[];
  featured: boolean;
  cover_url?: string | null;
};

// helpers
const toYear = (iso?: string) => (iso ? new Date(iso).getFullYear() : '');

const CategoryPill = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <Button
    variant={active ? 'default' : 'outline'}
    size="sm"
    onClick={onClick}
    className="transition-all duration-300"
  >
    {label}
  </Button>
);

// map AdminProject -> PublicProject (component-level adapter)
const mapToPublic = (p: any): PublicProject => {
  // projectsService.getProjects() returns:
  //   category: string name, category_id, is_featured, cover_image_url, tags, date, description, etc.
  const cover =
    p.cover_image_url ||
    (Array.isArray(p.gallery) && p.gallery.length > 0 ? p.gallery[0]?.url : null);

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.short_description || p.description || '',
    location: p.location || '',
    date: p.event_date || p.date,
    category_slug: (p.category || 'sin-categoria')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-'),
    category_name: p.category || 'Sin categoría',
    services: Array.isArray(p.tags) ? p.tags : Array.isArray(p.services) ? p.services : [],
    featured: !!p.is_featured,
    cover_url: cover,
  };
};

const getProjectImage = (project: PublicProject) => {
  return project.cover_url || '/placeholder.webp'; // fallback (ensure you have a placeholder)
};

const Portfolio = () => {
  const [params, setParams] = useSearchParams();
  const initial = params.get('cat') || 'all';

  const [selected, setSelected] = useState<string>(initial);
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Load active categories
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingCats(true);
        const cats = await categoriesService.getActive();
        if (!alive) return;

        // ensure slugs are present (your service already returns slug)
        setCategories(
          (cats ?? []).map((c: any) => ({
            id: c.id,
            slug: c.slug,
            name: c.name,
            is_active: c.is_active,
          }))
        );
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? 'Error al cargar categorías');
      } finally {
        if (alive) setLoadingCats(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Load projects when filter changes
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingProjects(true);
        // selected is a slug; your getProjects expects FK id if filters.category
        // To keep it simple, fetch ALL published and filter by slug client-side,
        // or if you prefer backend filtering by id, lookup id by slug here.
        // only published
        const data = await projectsService.getProjects({ status: 'published' }); // fetch all (status filter can be added in service if you want)
        if (!alive) return;

        const normalized = (data ?? []).map(mapToPublic);
        setProjects(normalized);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? 'Error al cargar proyectos');
      } finally {
        if (alive) setLoadingProjects(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [selected]);

  // pills for nav
  const pills = useMemo(() => {
    const base = [{ id: 'all', slug: 'all', name: 'Todos los proyectos', is_active: true }];
    return base.concat(categories);
  }, [categories]);

  const onSelect = (slug: string) => {
    setSelected(slug);
    if (slug === 'all') {
      params.delete('cat');
      setParams(params, { replace: true });
    } else {
      params.set('cat', slug);
      setParams(params, { replace: true });
    }
  };

  const filteredProjects =
    selected === 'all'
      ? projects
      : projects.filter((p) => p.category_slug === selected);

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
            <h1 className="text-5xl md:text-6xl font-serif mb-6">Nuestro Portafolio</h1>
            <p className="text-xl md:text-2xl opacity-90">
              Explora nuestra colección de eventos memorables y producciones cinematográficas
              que reflejan nuestra experiencia en diversas industrias y ocasiones
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Navigation */}
      <section className="py-8 bg-white border-b border-border sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {pills.map((cat) => (
              <CategoryPill
                key={cat.slug}
                label={cat.name}
                active={selected === cat.slug}
                onClick={() => onSelect(cat.slug)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatePresence>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                          src={getProjectImage(project)}
                          alt={project.title}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-primary text-white">
                            {project.category_name}
                          </Badge>
                        </div>

                        {/* Featured Badge */}
                        {project.featured && (
                          <div className="absolute top-4 right-4">
                            <Badge variant="secondary" className="bg-white text-black">
                              Destacado
                            </Badge>
                          </div>
                        )}

                        {/* Hover Overlay Content */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="text-white text-center p-4">
                            <p className="text-sm mb-2">Ver proyecto</p>
                            <div className="flex flex-wrap justify-center gap-1">
                              {(project.services ?? []).slice(0, 2).map((service, idx) => (
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
                        {project.description && (
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {project.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <span>{project.location}</span>
                          </div>
                          <span>{toYear(project.date)}</span>
                        </div>

                        {/* Services Tags */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {(project.services ?? []).slice(0, 3).map((service, idx) => (
                            <span key={idx} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
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
          {!loadingProjects && filteredProjects.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <h3 className="text-2xl font-semibold mb-4">No encontramos proyectos</h3>
              <p className="text-muted-foreground mb-8">
                Aún no tenemos proyectos en esta categoría, pero estamos trabajando en nuevo contenido.
              </p>
              <Button onClick={() => onSelect('all')}>Ver todos nuestros proyectos</Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      {/*
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '500+', label: 'Eventos producidos' },
              { number: '50+', label: 'Clientes felices' },
              { number: '10+', label: 'Años de experiencia' },
              { number: '100%', label: 'Satisfacción del cliente' },
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
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      */}
    </Layout>
  );
};

export default Portfolio;