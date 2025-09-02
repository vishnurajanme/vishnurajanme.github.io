import { motion } from "framer-motion";
import { FaWhatsapp, FaLinkedin, FaGoogle, FaFacebook, FaGooglePlay, FaInstagram } from "react-icons/fa";

// Array of social links for easier mapping and maintenance
const socialLinks = [
  {
    name: "LinkedIn",
    icon: FaLinkedin,
    href: "https://www.linkedin.com/in/drvishnurajan/",
    hoverColor: "hover:bg-blue-600",
    shadowColor: "rgba(59, 130, 246, 0.7)", // blue-500
  },
  {
    name: "Google Developer",
    icon: FaGoogle,
    href: "http://g.dev/vishnurajan",
    hoverColor: "hover:bg-gray-700",
    shadowColor: "rgba(219, 68, 55, 0.7)", // Google Red
  },
  {
    name: "Facebook",
    icon: FaFacebook,
    href: "https://www.facebook.com/imvishnurajan/",
    hoverColor: "hover:bg-blue-500",
    shadowColor: "rgba(24, 119, 242, 0.7)", // Facebook Blue
  },
  {
    name: "Google Play",
    icon: FaGooglePlay,
    href: "https://play.google.com/store/apps/dev?id=5348400494762920729",
    hoverColor: "hover:bg-green-500",
    shadowColor: "rgba(34, 197, 94, 0.7)", // green-500
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    href: "https://www.instagram.com/_vishnu.rajan_/",
    hoverColor: "hover:bg-pink-500",
    shadowColor: "rgba(236, 72, 153, 0.7)", // pink-500
  },
  {
    name: "WhatsApp",
    icon: FaWhatsapp,
    href: "https://wa.me/918113997771",
    hoverColor: "hover:bg-green-500",
    shadowColor: "rgba(37, 211, 102, 0.7)", // WhatsApp Green
  },
];

export default function Contact() {
  const contact = {
    email: "vishnurajanme@gmail.com",
    feedbackForm: "https://forms.gle/your-feedback-form",
  };

  return (
    <div className="bg-gradient-to-br from-black to-purple-950 min-h-screen font-sans text-white">
      <section className="max-w-6xl mx-auto px-4 py-16 pt-10 space-y-16">
        <div style={{ marginTop: "100px" }}></div> {/* Spacer */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Ready to Create Something Remarkable?
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Whether you're looking to collaborate, hire, or just say hello, my digital door is always open.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch justify-center">
          {/* Email Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gray-900 p-8 rounded-3xl shadow-lg flex flex-col items-center text-center hover:bg-gray-800 transition-colors duration-300 h-full"
          >
            <h2 className="text-2xl font-bold mb-4">Drop Me a Line</h2>
            <p className="text-gray-200 flex-1">
              For professional inquiries or to connect, the best way to reach me is by email. I look forward to hearing from you.
            </p>
            <a
              href={`mailto:${contact.email}`}
              className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors"
            >
              Send an Email
            </a>
          </motion.div>

          {/* Feedback Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gray-900 p-8 rounded-3xl shadow-lg flex flex-col items-center text-center hover:bg-gray-800 transition-colors duration-300 h-full"
          >
            <h2 className="text-2xl font-bold mb-4">Got Something on Your Mind?</h2>
            <p className="text-gray-200 flex-1">
              Your feedback is valuable and helps me improve. If you have any thoughts or suggestions, please share them via the feedback form.
            </p>
            <a
              href={contact.feedbackForm}
              target="_blank"
              rel="noreferrer"
              className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors"
            >
              Leave Feedback
            </a>
          </motion.div>
        </div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h2 className="text-2xl font-bold text-white">Connect with Me</h2>
          <div className="flex justify-center gap-6 text-3xl text-white flex-wrap">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 bg-gray-800 rounded-full transition-colors ${social.hoverColor}`}
                // The animation logic is here
                animate={{
                  scale: [1, 1.1, 1],
                  filter: [
                    "drop-shadow(0 0 0 rgba(0,0,0,0))",
                    `drop-shadow(0 0 8px ${social.shadowColor})`,
                    "drop-shadow(0 0 0 rgba(0,0,0,0))",
                  ],
                }}
                transition={{
                  duration: 2,         // Total duration of one loop cycle
                  repeat: Infinity,    // Makes the animation loop forever
                  ease: "easeInOut",
                  delay: index * 0.2,  // The key to staggering the animations
                }}
              >
                <social.icon />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}