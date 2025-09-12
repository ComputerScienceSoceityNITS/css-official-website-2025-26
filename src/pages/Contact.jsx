import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(400, 400);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create floating geometric shapes
    const shapes = [];
    const geometries = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.TetrahedronGeometry(1, 0),
    ];

    for (let i = 0; i < 8; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.5 + Math.random() * 0.2, 0.8, 0.6),
        wireframe: true,
        transparent: true,
        opacity: 0.6,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      mesh.scale.setScalar(0.3 + Math.random() * 0.5);
      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        },
        floatSpeed: 0.5 + Math.random() * 0.5,
        floatOffset: Math.random() * Math.PI * 2,
      };
      
      shapes.push(mesh);
      scene.add(mesh);
    }

    // Add particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    camera.position.z = 8;

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      shapes.forEach((shape ) => {
        shape.rotation.x += shape.userData.rotationSpeed.x;
        shape.rotation.y += shape.userData.rotationSpeed.y;
        shape.rotation.z += shape.userData.rotationSpeed.z;
        
        shape.position.y += Math.sin(Date.now() * 0.001 * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.005;
      });

      particles.rotation.y += 0.002;
      
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
    
    // Show success message
    alert('Message sent successfully! We\'ll get back to you soon.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00010a] via-[#000820] to-[#001122] flex items-center justify-center py-16 px-4">
      <div className="flex flex-col lg:flex-row items-center gap-12 w-full max-w-6xl">
        {/* Contact Form */}
        <div className="flex-1 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white-600 mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Get In Touch
            </h1>
            <p className="text-gray-300 text-lg">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          
          <div className="flex flex-col gap-6 w-full bg-black/30 p-8 rounded-3xl backdrop-blur-lg border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
            <div className="space-y-2">
              <label className="text-cyan-300 text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 rounded-xl bg-[#001122]/50 border border-cyan-500/30 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-gray-400 transition-all duration-300"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-cyan-300 text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 rounded-xl bg-[#001122]/50 border border-cyan-500/30 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-gray-400 transition-all duration-300"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-cyan-300 text-sm font-medium">Message</label>
              <textarea
                name="message"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full p-4 rounded-xl bg-[#001122]/50 border border-cyan-500/30 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-gray-400 resize-none transition-all duration-300"
                required
              />
            </div>
            
            <div
              onClick={handleSubmit}
              className={`relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 text-black font-bold py-4 px-6 rounded-xl transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 cursor-pointer ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Sending...
                </div>
              ) : (
                'Send Message'
              )}
            </div>
          </div>
        </div>

        {/* 3D Visualization */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <div 
              ref={mountRef} 
              className="w-96 h-96 rounded-full border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 backdrop-blur-sm"
            />
            
            {/* Floating elements around the 3D scene */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400 rounded-full opacity-60 animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full opacity-80 animate-bounce" />
            <div className="absolute top-1/2 -left-6 w-4 h-4 bg-purple-400 rounded-full opacity-70 animate-ping" />
            <div className="absolute top-10 right-10 w-3 h-3 bg-green-400 rounded-full opacity-60 animate-pulse" />
          </div>
          
          {/* Info cards */}
          <div className="absolute top-0 right-0 hidden xl:block">
            <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4 text-center">
              <div className="text-cyan-400 text-2xl font-bold">24/7</div>
              <div className="text-gray-300 text-sm">Support</div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 hidden xl:block">
            <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4 text-center">
              <div className="text-cyan-400 text-2xl font-bold">&lt;24h</div>
              <div className="text-gray-300 text-sm">Response</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;