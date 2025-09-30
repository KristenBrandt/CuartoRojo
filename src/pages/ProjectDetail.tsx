import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import projects from '@/data/projects.json';
import weddingImage from '@/assets/wedding-hero.jpg';
import corporateImage from '@/assets/corporate-hero.jpg';
import foodImage from '@/assets/food-hero.jpg';

const ProjectDetail = () => {
  const { slug } = useParams();
  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return (
      <Layout>
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/portfolio">Back to Portfolio</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const getProjectImage = (projectId: string) => {
    switch (projectId) {
      case "1": return weddingImage;
      case "2": return corporateImage;
      case "3": return foodImage;
      default: return weddingImage;
    }
  };

  return (
    <Layout>
      {/* Back Navigation */}
      <div className="pt-24 pb-4">
        <div className="container mx-auto px-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/portfolio">
              <ArrowLeft className="mr-2" size={16} />
              Back to Portfolio
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
                src={getProjectImage(project.id)}
                alt={project.heroMedia.alt}
                className="w-full h-[60vh] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-overlay" />
              <div className="absolute bottom-8 left-8 text-white">
                <Badge className="bg-primary text-white mb-4">
                  {project.category.replace('-', ' ')}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-serif mb-4">{project.title}</h1>
                <p className="text-xl opacity-90">{project.description}</p>
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
              {/* Challenge & Solution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-serif mb-6">The Challenge</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {project.challenges}
                </p>
                
                <h3 className="text-2xl font-serif mb-4">Our Solution</h3>
                <p className="text-lg text-muted-foreground">
                  {project.solution}
                </p>
              </motion.div>

              {/* Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-serif mb-6">Project Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.gallery.map((media, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden group">
                      <div className="aspect-video bg-gradient-hero flex items-center justify-center">
                        <span className="text-white text-lg">
                          {media.type === 'video' ? '▶ Video' : '📷 Image'}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-serif mb-6">Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.results.map((result, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-3 h-3 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span>{result}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Embedded Reel */}
              {project.embedReel && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-serif mb-6">Project Reel</h2>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <ExternalLink className="text-white" size={24} />
                      </div>
                      <p className="text-muted-foreground">Video would be embedded here</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        View on Vimeo
                      </Button>
                    </div>
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
                    <h3 className="text-xl font-semibold mb-6">Project Details</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Users className="text-primary mr-3" size={20} />
                        <div>
                          <div className="font-medium">Client</div>
                          <div className="text-muted-foreground text-sm">{project.client}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="text-primary mr-3" size={20} />
                        <div>
                          <div className="font-medium">Location</div>
                          <div className="text-muted-foreground text-sm">{project.location}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="text-primary mr-3" size={20} />
                        <div>
                          <div className="font-medium">Date</div>
                          <div className="text-muted-foreground text-sm">
                            {new Date(project.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Services Provided */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-6">Services Provided</h3>
                    <div className="space-y-2">
                      {project.services.map((service, index) => (
                        <Badge key={index} variant="secondary" className="mr-2 mb-2">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Deliverables */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-6">Deliverables</h3>
                    <ul className="space-y-2">
                      {project.deliverables.map((deliverable, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="text-sm">{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="bg-gradient-hero text-white">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold mb-4">Like This Project?</h3>
                    <p className="mb-6 opacity-90">
                      Let's create something amazing for your next event.
                    </p>
                    <Button variant="secondary" size="lg" asChild className="w-full">
                      <Link to="/contact">Start Your Project</Link>
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