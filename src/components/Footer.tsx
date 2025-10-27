import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';
import logo from '@/assets/4TO_LOGO PNG-20.png'

const Footer = () => {
  return (
    <footer className="bg-brand-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={logo}
                alt="Cuarto Rojo"
                className="h-10 w-auto object-contain" // keeps proportions
              />
            </Link>
            <p className="text-gray-300 text-sm">
              Eventos Cinematográficos. Historias Inolvidables.
            </p>
            <p className="text-gray-300 text-sm">
              Logística profesional de eventos, cobertura audiovisual y servicios de postproducción que dan vida a tu visión con excelencia cinematográfica.
            </p>
          </div>

          {/* Quick Links */}
          {/*
          <div>
            <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-300 hover:text-primary transition-colors">Acerca de Nosotros</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-primary transition-colors">Servicios</Link></li>
              <li><Link to="/portfolio" className="text-gray-300 hover:text-primary transition-colors">Portafolio</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">Contacto</Link></li>
            </ul>
          </div>
          */}

          {/* Services */}
          <div></div>
          <div></div>
          {/*}
          <div>
            <h3 className="font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services#logistics" className="text-gray-300 hover:text-primary transition-colors">Logística de Eventos</Link></li>
              <li><Link to="/services#coverage" className="text-gray-300 hover:text-primary transition-colors">Cobertura Audiovisual</Link></li>
              <li><Link to="/services#post-production" className="text-gray-300 hover:text-primary transition-colors">Postproducción</Link></li>
              <li><Link to="/services#food-styling" className="text-gray-300 hover:text-primary transition-colors">Food Styling</Link></li>
            </ul>
          </div>
          */}

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-primary" />
                <a href="tel:+50256632686" className="text-gray-300 hover:text-primary transition-colors">
                  +502 5663 2686
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-primary" />
                <a href="mailto:ventas@4torojo.com" className="text-gray-300 hover:text-primary transition-colors">
                  ventas@4torojo.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-primary" />
                <span className="text-gray-300">Ciudad de Guatemala</span>
              </div>
              <div className="flex items-center space-x-4 pt-2">
                <a href="https://www.instagram.com/cuartorojogt?igsh=a2p5MHM3YnlicnVz" className="text-gray-300 hover:text-primary transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="https://wa.me/50256632686" className="text-gray-300 hover:text-primary transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Cuarto Rojo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;