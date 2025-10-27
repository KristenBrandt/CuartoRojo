import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import logo from '@/assets/4TO_LOGO PNG-19.png'

const UnderConstruction = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center space-y-8"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
            <img
              src={logo}
              alt="Cuarto Rojo"
              className="h-25 w-auto object-contain" // keeps proportions
            />
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-primary to-accent rounded-full" />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Sitio Web en Construcción
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Estamos trabajando en algo increíble. Pronto estaremos listos para mostrarte nuestro trabajo.
          </p>
        </motion.div>

        {/* Contact Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-6"
        >
          <h3 className="text-xl font-semibold text-foreground">Contáctanos</h3>
          
          <div className="grid gap-4 text-left">
            <a
              href="tel:+50256632686"
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
            >
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <span>+506 5663 2686</span>
            </a>

            <a
              href="mailto:info@audiovisualcatering.com"
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
            >
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <span>ventas@4torojo.com</span>
            </a>

            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <span>Ciudad de Guatemala, Guatemala</span>
            </div>

            <a
              href="https://www.instagram.com/cuartorojogt?igsh=a2p5MHM3YnlicnVz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
            >
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Instagram className="h-5 w-5 text-primary" />
              </div>
              <span>@cuartorojogt</span>
            </a>
          </div>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex justify-center gap-2"
        >
          <motion.div
            className="w-3 h-3 bg-primary rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-3 h-3 bg-accent rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-3 h-3 bg-primary rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UnderConstruction;