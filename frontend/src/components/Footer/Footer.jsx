import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaFacebookF,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-white text-white">
      <div className="w-full overflow-hidden">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-[150px] block"
          preserveAspectRatio="none"
        >
          <path
            fill="#3d8b4c"
            fillOpacity="0.4"
            d="M0,80 C300,60 500,300 950,80 C1150,0 1350,180 1440,90 L1440,320 L0,320 Z"
          />
          <path
            fill="#6abf69"
            d="M0,200 C300,120 700,320 1000,180 C1250,80 1400,240 1850,220 L1440,320 L0,320 Z"
          />
        </svg>
      </div>

      <div className="absolute top-[40px] left-0 w-full h-65 pointer-events-none z-10">
        <img
          src="tree2.png"
          alt="Tree"
          className="absolute right-3 bottom-51 w-28 transform scale-x-[-1]"
        />
        <img
          src="tree.png"
          alt="Tree"
          className="absolute left-[3%] bottom-42 w-36"
        />
        <img
          src="tree.png"
          alt="Tree"
          className="absolute left-[73%] bottom-49 w-28 transform scale-x-[-1]"
        />
        <img
          src="tree2.png"
          alt="Tree"
          className="absolute right-[75%] bottom-49 w-24"
        />
      </div>

      <div className="relative z-30 bg-[#6abf69] pt-20 pb-20 text-white text-center">
        <div className="place-items-center max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-8 text-center">
          <div className="flex justify-center md:justify-start gap-5 items-center">
            <FooterIcon
              href="https://github.com/mangarovska"
              Icon={FaFacebookF}
            />
            <FooterIcon
              href="mailto:ana.mangarovska@gmail.com"
              Icon={FaEnvelope}
            />
            <FooterIcon
              href="mailto:ana.mangarovska@gmail.com"
              Icon={FaInstagram}
            />
            <FooterIcon href="https://github.com/mangarovska" Icon={FaGithub} />
            <FooterIcon
              href="https://linkedin.com/in/yourusername"
              Icon={FaLinkedin}
            />
            {/* <FooterIcon href="https://twitter.com/yourusername" Icon={FaTwitter} /> */}
          </div>

          <div className="flex justify-center gap-6 flex-wrap text-sm font-medium">
            <FooterLink href="/about">За нас</FooterLink>
            <FooterLink href="/privacy">Карактеристики</FooterLink>
            <FooterLink href="/terms">Галерија</FooterLink>
            <FooterLink href="/contact">Контакт</FooterLink>
          </div>

          {/* <img src="/logo.png" alt="Logo" className="w-15 h-15" /> */}

          <div className=" text-[0.9rem] text-sm text-center md:text-right text-white opacity-80 flex items-center justify-center md:justify-end">
            © {new Date().getFullYear()} Виножито
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterIcon = ({ href, Icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="!text-white visited:!text-white focus:!text-white active:!text-white no-underline hover:!text-[#2e4d30] transition-colors duration-300"
  >
    <Icon size={25} />
  </a>
);

const FooterLink = ({ href, children }) => (
  <a
    href={href}
    className="!text-white visited:!text-white focus:text-white active:text-white no-underline hover:!text-[#2e4d30] transition-colors duration-300"
  >
    {children}
  </a>
);

export default Footer;
